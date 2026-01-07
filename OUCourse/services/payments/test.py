#! /usr/bin/env python3.6

"""
server.py
Stripe Sample.
Python 3.6 or newer required.
"""
import os
from flask import Flask, redirect, request, jsonify

import stripe
# This is your test secret API key.
stripe.api_key = 'sk_test_51SmQuJAPWwKN6jfmDq17faZsFhidgUDT3QCpzUxBSt2p4ksAYdOzQ6KCbt074QeyRK85cEaob0gtKuHoF7hUZXJz00dy8QE81k'

app = Flask(__name__,
            static_url_path='',
            static_folder='public')

YOUR_DOMAIN = 'http://localhost:4242'

@app.route('/create-checkout-session', methods=['POST'])
def create_checkout_session():
    try:
        checkout_session = stripe.checkout.Session.create(
            line_items=[
                {
                    'price_data': {
                        'currency': 'usd',
                        'product_data': {
                            'name': 'Sản phẩm Test Python',
                            'description': 'Test nhanh không cần Frontend',
                        },
                        'unit_amount': 5000, # 50.00 USD (tính bằng cent)
                    },
                    'quantity': 1,
                },
            ],
            mode='payment',
            success_url=YOUR_DOMAIN + '/success?session_id={CHECKOUT_SESSION_ID}',
        )
    except Exception as e:
        return str(e)

    return redirect(checkout_session.url, code=303)

@app.route('/success', methods=['GET'])
def success_view():
    # 1. Lấy session_id từ URL trả về
    session_id = request.args.get('session_id')
    
    if not session_id:
        return "Error: No session_id provided"

    try:
        # 2. Gọi lại Stripe để lấy toàn bộ thông tin chi tiết của giao dịch
        session = stripe.checkout.Session.retrieve(session_id)
        
        # 3. Trích xuất thông tin bạn cần
        customer_email = session.customer_details.email
        payment_id = session.payment_intent # Đây chính là Transaction ID
        amount = session.amount_total       # Số tiền (theo đơn vị nhỏ nhất, vd: cent)
        status = session.payment_status     # 'paid' hoặc 'unpaid'
        currency = session.currency

        data = {
            "customer_email": customer_email,
            "payment_id": payment_id,
            "amount": amount,
            "status": status,
            "currency": currency
        }

        print("Payment Success:", data)
        # Demo: Trả về JSON để bạn xem kết quả. 
        # Thực tế bạn sẽ render template HTML hoặc lưu vào Database ở đây.
        return jsonify(data)
        
    except Exception as e:
        return str(e)

if __name__ == '__main__':
    app.run(port=4242, debug=True)