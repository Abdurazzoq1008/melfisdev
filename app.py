import json
import os
import requests
from flask import Flask, render_template, request, jsonify
import config

app = Flask(__name__)

DATA_FILE = os.path.join(os.path.dirname(__file__), "products.json")

def load_products():
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return []

def send_telegram_order(order_data):
    """Buyurtma ma'lumotlarini Telegram bot orqali adminga jo'natish"""
    bot_token = config.TELEGRAM_BOT_TOKEN
    chat_id = config.TELEGRAM_CHAT_ID

    if not bot_token or not chat_id:
        return False, "Telegram token yoki chat ID kiritilmagan (config.py)"

    customer = order_data.get("customer", {})
    items = order_data.get("items", [])
    delivery_type = order_data.get("delivery_type", "delivery")
    total_price = order_data.get("total_price", 0)
    card_note = customer.get("card_note", "").strip()

    items_text = ""
    for idx, item in enumerate(items, 1):
        items_text += f"{idx}. {item['name']} x {item['quantity']} dona - {item['price'] * item['quantity']:,} so'm\n"

    delivery_title = "🚗 Yetkazib berish (Dostavka)" if delivery_type == "delivery" else "🏬 Do'kondan olib ketish (Samovivoz)"

    message = (
        f"🌸 <b>YANGI BUYURTMA | Melfis_flow3rs_samarqand</b> 🌸\n\n"
        f"<b>Mijoz:</b> {customer.get('name', '-')}\n"
        f"<b>Telefon:</b> {customer.get('phone', '-')}\n"
        f"<b>Turi:</b> {delivery_title}\n"
    )

    if delivery_type == "delivery":
        message += (
            f"<b>Manzil:</b> {customer.get('address', '-')}\n"
            f"<b>Yetkazish sanasi:</b> {customer.get('date', 'Tez orada')}\n"
            f"<b>Yetkazish vaqti:</b> {customer.get('time', 'Tez orada')}\n"
        )

    if card_note:
        message += f"\n💌 <b>Tabriknoma matni:</b>\n<i>\"{card_note}\"</i>\n"

    if customer.get("comment"):
        message += f"\n💬 <b>Izoh:</b> {customer.get('comment')}\n"

    message += (
        f"\n📦 <b>Buyurtma tarkibi:</b>\n{items_text}\n"
        f"💰 <b>Jami summa:</b> <b>{total_price:,} so'm</b>\n"
        f"🕒 <b>Sana:</b> Qabul qilindi"
    )

    url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
    payload = {
        "chat_id": chat_id,
        "text": message,
        "parse_mode": "HTML"
    }

    try:
        res = requests.post(url, json=payload, timeout=8)
        data = res.json()
        if data.get("ok"):
            return True, "Yuborildi"
        else:
            return False, data.get("description", "Xatolik yuz berdi")
    except Exception as e:
        return False, str(e)


@app.route("/")
def index():
    products = load_products()
    return render_template("index.html", 
                           products=products, 
                           store=config,
                           categories=[
                               {"id": "all", "name": "Barcha gullar"},
                               {"id": "roses", "name": "Atirgullar"},
                               {"id": "bouquets", "name": "Guldastalar"},
                               {"id": "boxes", "name": "Qutidagi gullar"},
                               {"id": "gifts", "name": "Sovg'alar & Sharlar"}
                           ])


@app.route("/api/order", methods=["POST"])
def create_order():
    data = request.get_json()
    if not data or "items" not in data or not data["items"]:
        return jsonify({"success": False, "message": "Savatcha bo'sh!"}), 400

    success, msg = send_telegram_order(data)

    # Agar telegram sozlanmagan bo'lsa ham buyurtma tizimda qayd etiladi
    return jsonify({
        "success": True, 
        "telegram_sent": success,
        "telegram_status": msg,
        "message": "Buyurtmangiz qabul qilindi! Tez orada operatorimiz siz bilan bog'lanadi."
    })


if __name__ == "__main__":
    app.run(debug=True, port=5000)

