from abc import ABC, abstractmethod
from typing import Any, Dict, List, Optional
from api.payments.models import Transaction
from datetime import datetime
import hmac
import hashlib
import stripe
import os
import json
from django.http import HttpResponse
import requests
import time

class PaymentProviders(ABC):
    def __init__(self, items: List = None) -> None:
        self.items = items if items is not None else []

    @abstractmethod
    def create_payment(self, transaction_obj) -> Dict[str, Any]:
        pass

    @abstractmethod
    def process_webhook(self, request) -> HttpResponse:
        pass

    @abstractmethod
    def check_status(self, transaction_obj) -> str:
        pass

    @abstractmethod
    def refund_payment(self, transaction_obj, amount: Optional[float] = None) -> bool:
        pass
        
class ZaloPayProvider(PaymentProviders):
    def __init__(self, items: List) -> None:
        super().__init__(items)
        self.app_id = os.getenv("ZLP_MERCHANT_APP_ID")
        self.key1 = os.getenv("ZLP_MERCHANT_KEY1")
        self.key2 = os.getenv("ZLP_MERCHANT_KEY2")
        self.endpoint = os.getenv("ZLP_MERCHANT_ENDPOINT")
        self.gateway_endpoint = os.getenv("ZLP_MERCHANT_GATEWAY_ENDPOINT")
        self.redirect_url = os.getenv("ZLP_REDIRECT_URL") + "?provider=zalopay"

    def _get_mac(self, data, key):
        mac = hmac.new(
            key.encode("utf-8"),
            data.encode("utf-8"),
            hashlib.sha256
        ).hexdigest()

        return mac
    
    def create_payment(self, transaction_obj) -> Dict[str, Any]:
        amount = sum([item['amount'] * item.get('quantity', 1) for item in self.items])
        order_code = f"{datetime.now().strftime('%y%m%d')}_{transaction_obj.id.hex[:8]}_ZLP"
        transaction_obj.order_code = order_code
        transaction_obj.save()

        embedded_data = {
            "preferred_payment_method": ["zalopay_wallet"],
            "redirecturl": f"{self.redirect_url}"
        }

        embed_data_str = json.dumps(embedded_data)

        inputData = {
            "app_id": int(self.app_id),
            "app_user": transaction_obj.user.username,
            "app_trans_id": order_code,
            "app_time": int(datetime.now().timestamp() * 1000),
            "expire_duration_seconds": 900,
            "description": f"Giao dịch {order_code} thanh toán đơn hàng trên OUCourse",
            "amount": int(amount),
            "bank_code": "",
            "embed_data": embed_data_str,
            "item": json.dumps(self.items),
        }

        data = "|".join([
            str(inputData["app_id"]),
            inputData["app_trans_id"],
            inputData["app_user"],
            str(inputData["amount"]),
            str(inputData["app_time"]),
            inputData["embed_data"],
            inputData["item"],
        ])
        
        inputData["mac"] = self._get_mac(data, self.key1)

        try:
            response = requests.post(self.endpoint + "/create", json=inputData)
            response_json = response.json()
            if response.status_code == 200 and response_json.get("return_code") == 1:
                checkout_url = response_json.get("order_url")
                zp_transaction_token = response_json.get("zp_trans_token")

                transaction_obj.provider_transaction_id = str(zp_transaction_token)
                transaction_obj.save()
                return {
                    "checkout_url": checkout_url,
                    "session_id": zp_transaction_token
                }
            else:
                return {'error': response_json.get("return_message", response.text)}
        except Exception as e:
            return {'error': str(e)}

    def process_webhook(self, request) -> HttpResponse:
        try:
            body_unicode = request.body.decode('utf-8')
            request_data = json.loads(body_unicode)
        except json.JSONDecodeError:
            return HttpResponse(json.dumps({"return_code": 0, "return_message": "Invalid JSON"}), content_type="application/json")
        
        data_str = request_data.get("data")
        req_mac = request_data.get("mac")

        if not data_str or not req_mac:
            raise Exception("Missing data or mac")
        
        mac_calculated = self._get_mac(data_str, self.key2)
            
        if req_mac != mac_calculated:
            return {"status": "failed", "message": "Invalid Signature"}

        data_json = json.loads(data_str)
        order_code = data_json["app_trans_id"]
        zalo_trans_id = data_json["zalo_trans_id"]

        try:
            transaction = Transaction.objects.get(order_code=order_code)
            if transaction:
                transaction.status = Transaction.statuses.COMPLETED
                transaction.provider_transaction_id = str(zalo_trans_id)
                transaction.save()

            return {"status": "success", "order_code": order_code}
        except Transaction.DoesNotExist:
            return {"status": "failed", "message": "Transaction not found"}


    def check_status(self, transaction_obj) -> str:
        params = {
            "app_id": int(self.app_id),
            "app_trans_id": transaction_obj.order_code
        }

        data_sign = f"{params['app_id']}|{params['app_trans_id']}|{self.key1}"
        params["mac"] = self._get_mac(data_sign, self.key1)

        try:
            response = requests.post(f"{self.endpoint}/query", data=params, timeout=15)
            resp_json = response.json()

            return_code = resp_json.get("return_code")
            
            if return_code == 1:
                if transaction_obj.status != Transaction.statuses.COMPLETED:
                    transaction_obj.status = Transaction.statuses.COMPLETED

                    if "zalo_trans_id" in resp_json:
                         transaction_obj.provider_transaction_id = str(resp_json["zalo_trans_id"])
                    transaction_obj.save()
                return "SUCCESS"
            elif return_code == 3:
                return "PENDING"
            else:
                return "FAILED"
        except Exception as e:
            print(f"ZaloPay Check Status Error: {e}")
            return "ERROR"

    def refund_payment(self, transaction_obj, amount: Optional[float] = None) -> bool:
        if not transaction_obj.provider_transaction_id:
            print("Cannot refund: Missing Zalo Transaction ID")
            return False

        timestamp = int(round(time.time() * 1000))
        
        # Tạo mã hoàn tiền (m_refund_id) - Phải duy nhất từng lần gọi
        # Format gợi ý: yyMMdd_{appid}_{random}
        refund_uid = f"{datetime.now().strftime('%y%m%d')}_{self.app_id}_{int(time.time())}"
        
        refund_amount = int(amount) if amount else int(transaction_obj.amount)
        description = "User requested refund"

        refund_req = {
            "app_id": int(self.app_id),
            "zalo_trans_id": transaction_obj.provider_transaction_id,
            "amount": refund_amount,
            "description": description,
            "timestamp": timestamp,
            "m_refund_id": refund_uid 
        }

        data_sign = "|".join([
            str(refund_req["app_id"]),
            str(refund_req["zalo_trans_id"]),
            str(refund_req["amount"]),
            refund_req["description"],
            str(refund_req["timestamp"])
        ])
        refund_req["mac"] = self._get_mac(data_sign, self.key1)

        try:
            response = requests.post(f"{self.endpoint}/refund", json=refund_req, timeout=30)
            resp_json = response.json()

            if resp_json.get("return_code") == 1:
                return True
            else:
                print(f"ZaloPay Refund Failed: {resp_json.get('return_message')}")
                return False

        except Exception as e:
            print(f"ZaloPay Refund Exception: {e}")
            return False
    
class StripeProvider(PaymentProviders):
    def __init__(self, items: List) -> None:
        super().__init__(items)
        self.stripe = stripe
        self.stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
        self.success_url = os.getenv("SUCCESS_URL")
        self.cancel_url = os.getenv("CANCEL_URL")
        self.webhook_secret = os.getenv("STRIPE_WEBHOOK_SECRET")
        
    
    def create_payment(self, transaction_obj) -> Dict[str, Any]:
        line_items = []
        for item in self.items:
            line_items.append({
                'price_data': {
                    'currency': transaction_obj.currency.lower(),
                    'product_data': {
                        'name': item['name'],
                        'description': item.get('description', ''),
                    },
                    'unit_amount': int(item['amount'] if transaction_obj.currency == 'VND' else item['amount'] * 100),
                },
                'quantity': item.get('quantity', 1),
            })
        
        try:
            checkout_session = self.stripe.checkout.Session.create(
                line_items=line_items,
                mode='payment',

                metadata={
                    'order_code': transaction_obj.order_code, 
                    'user_id': str(transaction_obj.user.id)
                },

                success_url=f"{self.success_url}?provider=stripe&session_id={{CHECKOUT_SESSION_ID}}",
                cancel_url=self.cancel_url,

                customer_email=transaction_obj.user.email if hasattr(transaction_obj.user, 'email') else None
            )
        except Exception as e:
            return {"error": str(e)}
        
        return {
            "checkout_url": checkout_session.url,
            "session_id": checkout_session.id
        }
    
    def process_webhook(self, request) -> HttpResponse:
        payload = request.body
        event = None
        sig_header = request.headers.get('stripe-signature')

        if self.webhook_secret:
            try:
                event = self.stripe.Webhook.construct_event(
                    payload, sig_header, self.webhook_secret
                )
            except self.stripe.error.SignatureVerificationError as e:
                print('Webhook signature verification failed.' + str(e))
                return HttpResponse(status=400)

        if event.type == 'checkout.session.completed':
            session = event.data.object
            order_code = session.get('metadata', {}).get('order_code')

            real_transaction_id = session.get('payment_intent') 

            transaction = Transaction.objects.get(order_code=order_code)
            if transaction:
                transaction.status = Transaction.statuses.COMPLETED
                transaction.provider_transaction_id = real_transaction_id
                transaction.save()
        else:
            print('Unhandled event type {}'.format(event.type))

        return HttpResponse(status=200)
    
    def check_status(self, transaction_obj) -> str:
        try:
            if not transaction_obj.provider_transaction_id:
                return "unknown"
            payment_intent = self.stripe.PaymentIntent.retrieve(transaction_obj.provider_transaction_id)
            return payment_intent.status
        except Exception as e:
            print(f"Error checking status: {str(e)}")
            return "error"
        
    def refund_payment(self, transaction_obj, amount: Optional[float] = None) -> bool:
        try:
            refund_params = {
                'payment_intent': transaction_obj.provider_transaction_id,
            }
            if amount:
                refund_params['amount'] = int(amount if transaction_obj.currency == 'vnd' else amount * 100)
            
            refund = self.stripe.Refund.create(**refund_params)
            return refund.status == 'succeeded'
        except Exception as e:
            print(f"Error processing refund: {str(e)}")
            return False


class PaymentFactory:
    @staticmethod
    def get_payment_provider(provider_name, items: List = None) -> Optional[PaymentProviders]:
        PROVIDER_NAME = {
            "zalopay": ZaloPayProvider,
            "stripe": StripeProvider,
        }
        
        provider_class = PROVIDER_NAME.get(provider_name.lower())
        return provider_class(items) if provider_class else None