# 🌙 Moonlight Cafe - Hướng dẫn Setup & Sử dụng

## 📋 Mục lục
- [Yêu cầu hệ thống](#yêu-cầu-hệ-thống)
- [Cài đặt Firebase](#cài-đặt-firebase)
- [Cài đặt Cloudinary](#cài-đặt-cloudinary)
- [Chạy dự án](#chạy-dự-án)
- [Thêm sản phẩm mẫu](#thêm-sản-phẩm-mẫu)

---

## ⚙️ Yêu cầu hệ thống

- **Browser**: Chrome, Firefox, Edge (phiên bản mới nhất)
- **Node.js**: v14+ (để chạy local server)
- **Firebase Account**: Tài khoản Google
- **Cloudinary Account** (tùy chọn): Để upload hình ảnh

---

## 🔥 Cài đặt Firebase

### Bước 1: Tạo Firebase Project

1. Truy cập [Firebase Console](https://console.firebase.google.com)
2. Click **"Add project"** hoặc **"Tạo dự án"**
3. Đặt tên project: `moonlight-cafe` (hoặc tên tùy chọn)
4. Bỏ chọn Google Analytics (không bắt buộc)
5. Click **"Create project"**

### Bước 2: Kích hoạt Firebase Authentication

1. Vào **Build** → **Authentication**
2. Click **"Get started"**
3. Tab **Sign-in method**:
   - Bật **Email/Password**
   - Click **Save**

### Bước 3: Kích hoạt Realtime Database

1. Vào **Build** → **Realtime Database**
2. Click **"Create Database"**
3. Chọn location: **United States (us-central1)**
4. Chọn **"Start in test mode"** (để dễ test)
5. Click **Enable**

### Bước 4: Lấy Firebase Config

1. Vào **Project Settings** (⚙️ icon)
2. Cuộn xuống phần **"Your apps"**
3. Click icon **Web** (`</>`)
4. Đặt nickname: `Moonlight Cafe Web`
5. Click **"Register app"**
6. Copy đoạn `firebaseConfig`:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "moonlight-cafe.firebaseapp.com",
  databaseURL: "https://moonlight-cafe-default-rtdb.firebaseio.com",
  projectId: "moonlight-cafe",
  storageBucket: "moonlight-cafe.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:xxxxxxxxxxxxx"
};
```

### Bước 5: Cập nhật file `firebase-config.js`

1. Mở file `js/firebase-config.js`
2. Thay thế các giá trị placeholder bằng config vừa copy:

```javascript
const firebaseConfig = {
    apiKey: "AIza...", // PASTE GIÁ TRỊ THẬT
    authDomain: "moonlight-cafe.firebaseapp.com",
    databaseURL: "https://moonlight-cafe-default-rtdb.firebaseio.com",
    projectId: "moonlight-cafe",
    storageBucket: "moonlight-cafe.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:xxxxx"
};
```

---

## ☁️ Cài đặt Cloudinary (Tùy chọn)

### Bước 1: Tạo tài khoản

1. Truy cập [Cloudinary](https://cloudinary.com/users/register/free)
2. Đăng ký tài khoản miễn phí
3. Xác nhận email

### Bước 2: Lấy Cloud Name

1. Vào **Dashboard**
2. Tìm **"Cloud name"** (vd: `du1234abc`)

### Bước 3: Tạo Upload Preset

1. Vào **Settings** → **Upload**
2. Cuộn xuống **"Upload presets"**
3. Click **"Add upload preset"**
4. Đặt tên: `moonlight_products`
5. **Signing Mode**: chọn **"Unsigned"**
6. Click **Save**

### Bước 4: Cập nhật Cloudinary Config

Mở `js/firebase-config.js` và cập nhật:

```javascript
export const cloudinaryConfig = {
    cloudName: 'du1234abc', // Cloud name của bạn
    uploadPreset: 'moonlight_products' // Upload preset vừa tạo
};
```

---

## 🚀 Chạy dự án

### Cách 1: Sử dụng Live Server (VS Code)

1. Cài extension **Live Server** trong VS Code
2. Click chuột phải vào `index.html`
3. Chọn **"Open with Live Server"**
4. Website sẽ mở tại `http://localhost:5500`

### Cách 2: Sử dụng `serve`

```bash
npx serve
```

Truy cập: `http://localhost:3000`

### Cách 3: Mở trực tiếp

- Double click `index.html`
- **Lưu ý**: Một số tính năng có thể không hoạt động vì CORS policy

---

## 📦 Thêm sản phẩm mẫu

### Cách 1: Sử dụng Firebase Console

1. Vào **Realtime Database**
2. Click **"+"** bên cạnh root
3. Tạo node `products`
4. Thêm sản phẩm:

```json
{
  "products": {
    "product1": {
      "name": "Cappuccino",
      "category": "coffee",
      "price": 45000,
      "description": "Cà phê Ý truyền thống với bọt sữa mịn",
      "imageUrl": "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400",
      "isAvailable": true
    },
    "product2": {
      "name": "Tiramisu",
      "category": "pastry",
      "price": 55000,
      "description": "Bánh Tiramisu Ý nguyên bản",
      "imageUrl": "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400",
      "isAvailable": true
    }
  }
}
```

### Cách 2: Sử dụng Admin Dashboard

1. Truy cập `admin.html`
2. Đăng nhập (nếu chưa có tài khoản, vào `register.html`)
3. Click **"Thêm sản phẩm"**
4. Điền form:
   - Tên: Cappuccino
   - Danh mục: Cà phê
   - Giá: 45000
   - Link ảnh: `https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400`
5. Click **"Lưu"**

---

## 🎯 Kiểm tra hoạt động

### Checklist

- ✅ **Homepage** (`index.html`): Load được sản phẩm featured
- ✅ **Menu** (`menu.html`): Hiển thị danh sách sản phẩm, filter hoạt động
- ✅ **Login** (`login.html`): Đăng nhập thành công
- ✅ **Register** (`register.html`): Đăng ký tài khoản mới
- ✅ **Cart** (`cart.html`): Thêm/xóa sản phẩm
- ✅ **Checkout** (`checkout.html`): Đặt hàng thành công
- ✅ **Orders** (`orders.html`): Hiển thị đơn hàng
- ✅ **Admin** (`admin.html`): Quản lý sản phẩm/đơn hàng

---

## 🔒 Security Rules (Quan trọng!)

Sau khi test xong, cập nhật Firebase Realtime Database Rules:

```json
{
  "rules": {
    "products": {
      ".read": true,
      ".write": "auth != null"
    },
    "orders": {
      "$orderId": {
        ".read": "auth != null && auth.uid == data.child('userId').val()",
        ".write": "auth != null"
      }
    },
    "users": {
      "$uid": {
        ".read": "auth != null && auth.uid == $uid",
        ".write": "auth != null && auth.uid == $uid"
      }
    }
  }
}
```

---

## 🆘 Troubleshooting

### Lỗi: "Firebase not configured"
- Kiểm tra `js/firebase-config.js` đã điền đúng config chưa

### Lỗi: "No products found"
- Thêm sản phẩm vào Firebase Realtime Database

### Lỗi: "Permission denied"
- Kiểm tra Database Rules, đổi sang "test mode" nếu cần

### Trang không load CSS
- Kiểm tra đường dẫn file `css/style.css` và `css/mobile.css`

---

## 📞 Liên hệ hỗ trợ

Nếu gặp vấn đề, hãy:
1. Kiểm tra **Console log** (F12 → Console)
2. Kiểm tra **Network tab** (F12 → Network)
3. Xem log Firebase trong **Firebase Console**

---

**Chúc bạn setup thành công! 🎉**
