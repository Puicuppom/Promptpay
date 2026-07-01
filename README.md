# QR รับเงิน (QR-PUI)

เว็บแอปสร้าง QR พร้อมเพย์และ QR ธนาคารสำหรับรับเงิน ติดตั้งบนหน้าจอมือถือได้

## ฟีเจอร์

- สร้าง QR พร้อมเพย์จาก **เบอร์โทร** หรือ **เลขบัตรประชาชน**
- ตั้งค่าข้อมูลได้ผ่านปุ่ม ⚙️ (บันทึกในเบราว์เซอร์)
- ใส่จำนวนเงินได้ (ไม่บังคับ)
- แสดง QR ธนาคาร (กสิกร / Make / TTB)
- บันทึกและแชร์ QR ได้

## วิธี Deploy บน GitHub Pages

1. สร้าง repo ใหม่ชื่อ `QR-PUI` ที่ GitHub
2. Push โค้ดขึ้น branch `main`
3. ไปที่ **Settings → Pages → Build and deployment**
4. เลือก **Source: GitHub Actions**
5. รอ workflow รันเสร็จ แล้วเปิดลิงก์ที่ได้

## รูป QR ธนาคาร

วางไฟล์รูปในโฟลเดอร์ `images/`:

- `qr-kbank.png`
- `qr-make.png`
- `qr-ttb.png`

## ติดตั้งเป็นแอปบนมือถือ

- **Android (Chrome):** เมนู ⋮ → Add to Home screen
- **iPhone (Safari):** ปุ่ม Share → Add to Home Screen
