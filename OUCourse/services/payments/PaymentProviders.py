from abc import ABC, abstractmethod

class PaymentProviders(ABC):
    @abstractmethod
    def process_payment(self, amount, currency, payment_method):
        pass

class ZaloPayProvider(PaymentProviders):
    def process_payment(self, amount, currency, payment_method):
        # Implement ZaloPay payment processing logic here
        print(f"Processing ZaloPay payment of {amount} {currency} using {payment_method}")
        return {"status": "success", "provider": "ZaloPay"}
    
class StripeProvider(PaymentProviders):
    def process_payment(self, amount, currency, payment_method):
        # Implement Stripe payment processing logic here
        print(f"Processing Stripe payment of {amount} {currency} using {payment_method}")
        return {"status": "success", "provider": "Stripe"}

class PaymentFactory:
    @staticmethod
    def get_payment_provider(provider_name):
        PROVIDER_NAME = {
            "zalopay": ZaloPayProvider,
            "stripe": StripeProvider,
        }
        
        provider_class = PROVIDER_NAME.get(provider_name.lower())
        return provider_class() if provider_class else None