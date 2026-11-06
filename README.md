# 🌸 Melfis Flowers Samarqand - Onlayn Do'kon Sayti

Ushbu loyiha [Instagram @samarqand.melfisflowers](https://www.instagram.com/samarqand.melfisflowers/) profili uchun tayyorlangan zamonaviy, nafis va to'liq interaktiv onlayn gul do'koni tizimidir.

---

## 🚀 Sayt imkoniyatlari va xususiyatlari:

1. **Zamonaviy va Nozik Dizayn**:
   - Gul do'koniga mos estetik ranglar gammasi (blush pink, serif shriftlar, silliq animatsiyalar).
   - Mobil telefonlar va kompyuterlar uchun 100% moslashuvchan (Responsive) dizayn.

2. **Katalog va Kategoriyalar**:
   - Barcha gullar, Atirgullar, Guldastalar, Qutidagi gullar, Sovg'alar va sharlar.
   - Kategoriyalar bo'yicha tezkor filtr.
   - Mahsulot narxlari, chegirmalari va maxsus yorliqlari (*Xit savdo, Premial, Tavsiya*).

3. **Savatcha (Korzina) va Qulay Checkout**:
   - Mahsulotlarni savatchaga bitta tugma bilan qo'shish va sonini boshqarish.
   - Samarqand bo'ylab yetkazib berish (dostavka) yoki do'kondan olib ketish (samovivoz) tanlovi.
   - Aniq sana va vaqtni tanlash (syurpriz qilish imkoniyati).
   - Bepul tabriknoma matnini yozib qoldirish formasi.

4. **Telegram Bot Integratsiyasi**:
   - Sayt orqali tushgan har bir buyurtma avtomatik tarzda Telegram guruhingizga yoki profilingizga to'liq tafsilotlari bilan boradi.

---

## 🛠️ Loyihani ishga tushirish:

### 1-usul: `run.bat` orqali (Eng osoni)
- Papkadagi [`run.bat`](file:///c:/Users/Saidovs/Python%20sayt/run.bat) faylini sichqoncha bilan ikki marta bosib ishga tushiring.
- Brauzeringizda quyidagi manzilni oching:
  👉 **http://localhost:5000**

### 2-usul: Terminal orqali
```bash
python app.py
```

---

## ⚙️ Telegram Botni ulash:

Saytdan tushgan buyurtmalar Telegramingizga kelishi uchun:
1. Telegramda `@BotFather` orqali yangi bot yarating va uning `API Token`ini oling.
2. `@userinfobot` orqali o'zingizning Telegram `ID`ingizni (yoki guruh ID sini) oling.
3. [`config.py`](file:///c:/Users/Saidovs/Python%20sayt/config.py) faylini oching va quyidagi qatorlarni to'ldiring:

```python
TELEGRAM_BOT_TOKEN = "SIZNING_BOT_TOKENINGIZ"
TELEGRAM_CHAT_ID = "SIZNING_CHAT_ID"
```

---

## 📁 Mahsulotlarni o'zgartirish yoki yangi gul qo'shish:
- Barcha gullar ro'yxati, narxlari va rasmlari [`products.json`](file:///c:/Users/Saidovs/Python%20sayt/products.json) faylida joylashgan. 
- Siz istalgan vaqtda yangi gul qo'shishingiz yoki narxlarini o'zgartirishingiz mumkin.

