import os
import requests
import config

def setup_and_test():
    token = config.TELEGRAM_BOT_TOKEN
    print("Tekshirilmoqda...")
    url = f"https://api.telegram.org/bot{token}/getUpdates"
    res = requests.get(url).json()
    
    if not res.get("ok"):
        print("Xatolik:", res)
        return

    results = res.get("result", [])
    if not results:
        print("Hali botga xabar kelmadi. Iltimos, Telegramda @flower_samarqand_bot ga kirib /start bosing!")
        return

    last_msg = results[-1]
    chat = last_msg.get("message", {}).get("chat", {})
    chat_id = chat.get("id")
    first_name = chat.get("first_name", "Foydalanuvchi")

    print(f"Topildi! Chat ID: {chat_id} ({first_name})")

    # config.py ni yangilash
    config_path = os.path.join(os.path.dirname(__file__), "config.py")
    with open(config_path, "r", encoding="utf-8") as f:
        content = f.read()

    new_content = ""
    for line in content.splitlines():
        if line.startswith("TELEGRAM_CHAT_ID"):
            new_content += f'TELEGRAM_CHAT_ID = "{chat_id}"\n'
        else:
            new_content += line + "\n"

    with open(config_path, "w", encoding="utf-8") as f:
        f.write(new_content)

    # Test xabar yuborish
    test_msg = (
        f"🌸 <b>MilfestFlowers_samarqand.com</b> 🌸\n\n"
        f"Assalomu alaykum, <b>{first_name}</b>!\n"
        f"✅ Bot muvaffaqiyatli ishga tushdi va saytga ulandi.\n"
        f"Endi mijozlar sayt orqali buyurtma berganda barcha ma'lumotlar to'g'ridan-to'g'ri shu yerga keladi!"
    )
    send_url = f"https://api.telegram.org/bot{token}/sendMessage"
    send_res = requests.post(send_url, json={"chat_id": chat_id, "text": test_msg, "parse_mode": "HTML"}).json()
    
    if send_res.get("ok"):
        print("Tabriklaymiz! Test xabari Telegramingizga yuborildi.")
    else:
        print("Yuborishda xatolik:", send_res)

if __name__ == "__main__":
    setup_and_test()

