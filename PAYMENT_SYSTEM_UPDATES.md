# Cập nhật Hệ thống Thanh toán - Moonlight Cafe

## Tóm tắt các thay đổi

Hệ thống đã được cập nhật để xử lý tình huống khách hàng thoát ra giữa chừng trong quá trình thanh toán VNPay/MoMo cho đặt hàng hoặc đặt bàn. Các đơn chưa hoàn tất thanh toán sẽ được lưu giữ và hiển thị trong lịch sử với tùy chọn tiếp tục thanh toán.

---

## 1. CẬP NHẬT HỆ THỐNG ĐẶT HÀNG (Orders)

### 1.1 Tệp: `checkout.html`

**Những thay đổi:**
- Thêm `paymentRef` (Mã tham chiếu thanh toán) tương tự như `depositRef` trong đặt bàn
- Cập nhật trạng thái đơn hàng:
  - COD: `status: 'pending'`, `paymentStatus: 'paid'`
  - VNPay: `status: 'awaiting_payment'`, `paymentStatus: 'pending'`
  - MoMo: `status: 'awaiting_payment'`, `paymentStatus: 'pending'`
- Lưu trữ Order ID trong `localStorage` khi chuyển sang VNPay
- Hiển thị popup MoMo với QR code và mã đơn hàng

**Chức năng mới:**
```javascript
// copyToClipboard: Sao chép mã đơn sang clipboard
copyToClipboard(text)

// Khi thanh toán MoMo, hiển thị:
- Mã đơn hàng (paymentRef)
- Số tiền cần chuyển
- Nội dung chuyển khoản
- Mã QR MoMo của quán
- Ghi chú nhắc nhở quay lại trang Đơn hàng
```

### 1.2 Tệp: `orders.html`

**Những thay đổi:**
- Cập nhật `renderOrders()` để xử lý trạng thái `awaiting_payment`
- Hiển thị thông tin thanh toán không hoàn tất:
  - **Cho VNPay**: Nút "Tiếp tục thanh toán VNPay"
  - **Cho MoMo**: Mã đơn hàng, số tiền, nội dung CK, ghi chú

**Chức năng mới:**
```javascript
// copyToClipboardOrders: Sao chép mã thanh toán
copyToClipboardOrders(text)

// continueVNPayPayment: Tiếp tục thanh toán VNPay
// - Tạo lại link thanh toán VNPay
// - Chuyển hướng sang cổng thanh toán
continueVNPayPayment(orderId, amount)
```

**UI Cải tiến:**
```
Đơn hàng chưa thanh toán sẽ hiển thị:
┌─────────────────────────────────┐
│ ⚠️  Chờ thanh toán               │
│                                 │
│ Loại TT: VNPay / MoMo          │
│ Số tiền: X.XXX đ                │
│                                 │
│ [Tiếp tục thanh toán VNPay]    │
│ (cho VNPay)                    │
│                                 │
│ Hoặc                            │
│                                 │
│ Mã đơn: MC1234567               │
│ Quét QR MoMo để thanh toán     │
│ (cho MoMo)                     │
└─────────────────────────────────┘
```

---

## 2. CẬP NHẬT HỆ THỐNG ĐẶT BÀN (Reservations)

### 2.1 Tệp: `reservation.html`

**Những thay đổi:**
- Thêm hàm `continueReservationVNPayPayment()` để tiếp tục thanh toán VNPay
- Cập nhật `buildResCard()` để hiển thị nút tiếp tục thanh toán VNPay cho đặt bàn chưa hoàn tất

**Chức năng mới:**
```javascript
// continueReservationVNPayPayment: Tiếp tục thanh toán cọc VNPay
// - Tạo lại link thanh toán VNPay
// - Chuyển hướng sang cổng thanh toán
continueReservationVNPayPayment(resId, amount)
```

**Trạng thái đặt bàn:**
- `status: 'pending'` + `depositStatus: 'pending_payment'` = Chưa TT cọc
  - Hiển thị thông báo nhắc nhở thanh toán
  - Cho VNPay: Nút "Tiếp tục thanh toán VNPay"
  - Cho MoMo: Mã CK, SĐT MoMo, Mã QR
- `status: 'cancelled'` = Đã hủy (khách hủy trước giờ nhận bàn ≥ 2h)

### 2.2 Hủy Đặt Bàn

**Chức năng hiện tại (đã hoạt động):**
- Khách chỉ có thể hủy trước 2 tiếng giờ nhận bàn
- Nếu đã chuyển cọc (depositStatus: 'paid'), admin sẽ hoàn tiền
- Đặt bàn hủy sẽ được thay đổi trạng thái thành `'cancelled'`
- Hiển thị chính xác trong lịch sử: "Đã hủy" (Hủy Đặt Bàn)

**Hiển thị hủy:**
```
Trạng thái: 🚫 Đã hủy
└─ Không thể hủy được nếu:
   - Dưới 2 tiếng trước giờ nhận bàn
   - Sau giờ nhận bàn
```

---

## 3. FLOW THANH TOÁN CHI TIẾT

### 3.1 Flow VNPay

```
1. Khách đặt hàng/bàn
   └─ Chọn VNPay
2. Tạo order/reservation
   └─ Status: 'awaiting_payment'
   └─ Status: 'pending' (paymentStatus: 'pending')
   └─ Lưu paymentRef
   └─ Lưu Order ID vào localStorage
3. Chuyển sang cổng VNPay
   └─ Khách thoát giữa chừng ❌
   └─ Order vẫn lưu với status = 'awaiting_payment'
4. Quay lại trang Đơn hàng / Lịch sử đặt bàn
   └─ Hiển thị đơn chưa TT
   └─ Nút "Tiếp tục thanh toán VNPay"
5. Nhấn "Tiếp tục thanh toán"
   └─ Tạo link thanh toán mới
   └─ Chuyển sang VNPay
6. Thanh toán thành công
   └─ VNPay callback → API vnpay-verify-return.js
   └─ Cập nhật status: 'confirmed'/'processing'
   └─ paymentStatus: 'paid'
```

### 3.2 Flow MoMo

```
1. Khách đặt hàng/bàn
   └─ Chọn MoMo
2. Tạo order/reservation
   └─ Status: 'awaiting_payment'
   └─ Status: 'pending' (paymentStatus: 'pending')
   └─ Lưu paymentRef (mã CK)
3. Hiển thị popup với:
   └─ Mã đơn (paymentRef)
   └─ Số tiền
   └─ Nội dung CK
   └─ Mã QR MoMo
   └─ Ghi chú "Quay lại trang Đơn hàng để kiểm tra sau khi TT"
4. Khách thanh toán qua MoMo
   ✅ Hoàn tất → Quay lại trang Đơn hàng
   └─ Thông báo thanh toán thành công
   └─ Admin xác nhận TT
   └─ Status: 'confirmed'
   
   ❌ Chưa TT → Thoát popup
   └─ Order vẫn lưu với status = 'awaiting_payment'
   └─ Hiển thị trong đơn hàng với:
      • Mã đơn (để khách nhắn cho quán)
      • Ghi chú nhắc nhở quét QR MoMo
```

---

## 4. DATABASE SCHEMA

### Orders Collection
```javascript
{
  id: "key",
  customer: { fullName, phone, email, address, ward, district, city },
  items: [{ name, price, quantity, imageUrl, id }],
  subtotal: number,
  shipping: number,
  discount: number,
  promoCode: string || null,
  promoId: string || null,
  total: number,
  payment: "cod" | "momo" | "vnpay",
  paymentRef: "MC1234567",  // NEW: Mã tham chiếu thanh toán
  note: string,
  status: "pending" | "awaiting_payment" | "confirmed" | "shipping" | "completed" | "cancelled",
  paymentStatus: "paid" | "pending" | "failed",  // UPDATED
  createdAt: timestamp,
  userId: string
}
```

### Reservations Collection
```javascript
{
  id: "key",
  uid: string,
  email: string,
  name: string,
  phone: string,
  date: "YYYY-MM-DD",
  time: "HH:00",  // Phụ trợ (legacy)
  timeSlots: ["HH:00"],  // Mới: hỗ trợ multi-slot
  tableType: 2 | 4 | 6 | 10,
  tableCount: number,
  totalSeats: number,
  note: string || null,
  paymentMethod: "momo" | "vnpay",
  status: "pending" | "deposited" | "confirmed" | "rejected" | "completed" | "no-show" | "cancelled",
  depositAmount: number,
  depositRef: "MC1234567",
  depositStatus: "unpaid" | "pending_payment" | "paid" | "refunded" | "refund_requested",
  assignedTableIds: [],
  alternativeTables: [],
  alternativeNote: null,
  userResponse: null,
  adminNote: null,
  notificationRead: false,
  createdAt: timestamp,
  updatedAt: timestamp,
  expiresAt: timestamp,  // 30 phút sau khi tạo
  cancelledByUser: boolean || undefined  // Khi khách hủy
}
```

---

## 5. HƯỚNG DẪN SỬ DỤNG CHO KHÁCH HÀNG

### Đặt Hàng Chưa Thanh Toán VNPay
1. Vào trang "Đơn hàng của tôi"
2. Tìm đơn hàng với trạng thái "Chờ thanh toán"
3. Nhấn nút "Tiếp tục thanh toán VNPay"
4. Hoàn tất thanh toán trên cổng VNPay

### Đặt Hàng Chưa Thanh Toán MoMo
1. Vào trang "Đơn hàng của tôi"
2. Tìm đơn hàng với trạng thái "Chờ thanh toán"
3. Xem mã đơn hàng (paymentRef) và quét mã QR MoMo
4. Nhập đúng số tiền và nội dung CK
5. Quay lại trang Đơn hàng để kiểm tra trạng thái

### Đặt Bàn Chưa Thanh Toán VNPay
1. Vào trang "Lịch sử đặt bàn" (Tài khoản)
2. Tìm đơn đặt bàn với trạng thái "Chờ xác nhận" và "Chờ xác nhận CK"
3. Nhấn nút "Tiếp tục thanh toán VNPay"
4. Hoàn tất thanh toán trên cổng VNPay

### Đặt Bàn Chưa Thanh Toán MoMo
1. Vào trang "Lịch sử đặt bàn" (Tài khoản)
2. Tìm đơn đặt bàn với trạng thái "Chờ xác nhận"
3. Xem mã CK và quét mã QR MoMo của quán
4. Chuyển đúng số tiền cọc với nội dung mã CK
5. Quay lại trang để kiểm tra trạng thái

### Hủy Đặt Bàn
1. Vào trang "Lịch sử đặt bàn"
2. Tìm đơn đặt bàn muốn hủy
3. Nhấn nút "Hủy đặt bàn"
4. Xác nhận hủy
5. Nếu đã chuyển cọc, admin sẽ hoàn tiền

**Lưu ý:** Chỉ có thể hủy trước 2 tiếng giờ nhận bàn. Hủy muộn hơn, tiền cọc sẽ không được hoàn.

---

## 6. HƯỚNG DẪN CHO ADMIN

### Xác Nhận Thanh Toán MoMo
1. Kiểm tra thông báo MoMo từ quán
2. Xem mã CK từ khách
3. Vào trang Quản lý đơn hàng / Đặt bàn
4. Tìm đơn có mã CK khớp
5. Cập nhật trạng thái thành "Đã xác nhận" / "Đã cọc"

### Quản Lý Đơn Chưa Thanh Toán
- Đơn VNPay chưa TT: Chờ callback từ VNPay
- Đơn MoMo chưa TT: Chờ khách chuyển khoản hoặc admin xác nhận

### Quản Lý Đặt Bàn Đã Hủy
- Hiển thị trong lịch sử với trạng thái "Đã hủy"
- Bàn được trả lại pool có sẵn
- Nếu đã cọc, tạo ghi chú hoàn tiền

---

## 7. FILE ĐƯỢC CẬP NHẬT

1. **checkout.html**
   - Thêm `paymentRef` generation
   - Cập nhật `orderData` schema
   - Thêm MoMo QR display
   - Thêm `copyToClipboard()` function

2. **orders.html**
   - Cập nhật `renderOrders()` 
   - Thêm payment info display
   - Thêm `continueVNPayPayment()` function
   - Thêm `copyToClipboardOrders()` function

3. **reservation.html**
   - Cập nhật `buildResCard()` 
   - Thêm `continueReservationVNPayPayment()` function
   - Thêm "Tiếp tục thanh toán" button

---

## 8. TESTING CHECKLIST

- [ ] Đặt hàng với VNPay, thoát giữa chừng
- [ ] Quay lại "Đơn hàng", nhấn "Tiếp tục thanh toán"
- [ ] Hoàn tất VNPay
- [ ] Đặt hàng với MoMo, xem popup QR
- [ ] Xem đơn trong lịch sử, kiểm tra mã CK
- [ ] Đặt bàn với VNPay, thoát giữa chừng
- [ ] Quay lại "Lịch sử đặt bàn", nhấn "Tiếp tục thanh toán"
- [ ] Đặt bàn với MoMo, xem popup/notification
- [ ] Hủy đặt bàn (trước 2h)
- [ ] Kiểm tra trạng thái "Đã hủy" trong lịch sử

---

## Ghi chú

- Tất cả thay đổi tương thích với hệ thống hiện tại
- Không ảnh hưởng đến flow COD hiện tại
- Lưu trữ `localStorage` tạm thời cho recovery intent
- Mã tham chiếu (paymentRef, depositRef) giúp đối soát dễ dàng

---

## 9. BUG FIXES (Ngày 18/3/2026)

### Issue: VNPay hiển thị số tiền sai (20 đồng thay vị 20.000 đồng)

**Nguyên nhân:** 
- VNPay server nhân số tiền với 100 (`amount * 100`), làm cho nó lớn hơn 100 lần
- VNPay Vietnam API yêu cầu `vnp_Amount` tính bằng **VND**, không phải xu

**Sửa:**
1. **scripts/vnpay-server.js** (dòng 113)
   - Trước: `vnp_Amount: Math.round(amount * 100)`
   - Sau: `vnp_Amount: amount`

2. **netlify/functions/vnpay-create-payment-url.js** (dòng 40)
   - Trước: `vnp_Amount: Math.round(amount * 100)`
   - Sau: `vnp_Amount: amount`

3. **reservation.html** (dòng 1943)
   - Sửa onclick handler để gửi đúng `r.depositAmount` (number) thay vì extract từ formatted string
   - Trước: `onclick="continueReservationVNPayPayment('" + r.id + "','" + (deposit.match(/\d+/)?.[0] || '') + "')"`
   - Sau: `onclick="continueReservationVNPayPayment('" + r.id + "'," + (r.depositAmount || 0) + ")"`

4. **reservation.html** (dòng 1688-1705)
   - Gán `createReservationVnpayPaymentUrl` vào `window` để hàm có thể gọi từ onclick handlers (vì script dùng `type="module"`)
   - Thêm: `window.createReservationVnpayPaymentUrl = createReservationVnpayPaymentUrl;`

### Testing:
- ✅ Phí cọc 20.000 VND → VNPay hiển thị 20.000 đồng
- ✅ Đơn hàng 500.000 VND → VNPay hiển thị 500.000 đồng
- ✅ "Tiếp tục thanh toán" button hoạt động đúng
- ✅ "Hủy đặt bàn" button hoạt động đúng
