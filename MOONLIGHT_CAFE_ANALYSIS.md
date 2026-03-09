# 🌙 MOONLIGHT CAFE - PHÂN TÍCH DỰ ÁN CHO GEMINI

## 📋 I. THÔNG TIN CƠ BẢN

**Tên Dự Án:** Moonlight Cafe - Website E-Commerce cho cửa hàng cafe & bánh ngọt  
**Sinh Viên:** Nguyễn Thị Huỳnh Như (MSSV: 222358)  
**Trường:** Đại học Nam Cần Thơ  
**Năm Học:** 2024-2025  

**Mục Đích:** Xây dựng hệ thống e-commerce hoàn chỉnh từ frontend đến backend với đầy đủ tính năng quản lý cửa hàng & thanh toán.

---

## 🚀 II. CÔNG NGHỆ CHÍNH

### Frontend Stack
| Công Nghệ | Phiên Bản | Mục Đích |
|-----------|----------|---------|
| **HTML5** | - | Cấu trúc trang web |
| **CSS3** | - | Styling, Dark Mode, Animations |
| **JavaScript** | ES6+ | Logic, UI interactivity |
| **Font Awesome** | 6.4.0 | 500+ icons |
| **Google Fonts** | - | Playfair Display, Poppins typography |
| **SweetAlert2** | 11 | Beautiful notification dialogs |
| **Chart.js** | Latest | Bar/Line/Doughnut charts (admin) |
| **QRCode.js** | - | QR code generation for invoices |
| **SheetJS (XLSX)** | 0.18.5 | Excel export functionality |
| **Cloudinary SDK** | - | Image upload & CDN delivery |

### Backend & Database
| Dịch Vụ | Mục Đích |
|--------|---------|
| **Firebase Auth** | Email/Password + Google authentication |
| **Firebase Realtime DB** | NoSQL database + real-time listeners |
| **Firebase Storage** | Cloud backup for images |
| **Netlify Functions** | Serverless Node.js backend (VNPAY, Cloudinary proxy) |

### Payment Gateways
| Gateway | Loại | Tình Trạng |
|---------|------|----------|
| **VNPAY** | E-wallet + Banking | Sandbox mode (active) |
| **MoMo** | E-wallet | Integration ready |
| **COD** | Cash on Delivery | Active |
| **Banking** | Direct transfer | Active |

### Deployment
| Platform | Mục Đích |
|----------|---------|
| **Netlify** | Hosting + auto-deploy from GitHub |
| **GitHub** | Version control repository |

---

## 📂 III. CẤU TRÚC THỰC TẾ

### HTML Pages (16 files)
```
index.html                 → Homepage (featured products)
menu.html                  → Product list with filtering
product-detail.html        → Product info + reviews
cart.html                  → Shopping cart management
checkout.html              → Payment gateway selection
order-success.html         → Order confirmation + QR code
orders.html                → Order history + status tracking
profile.html               → User profile + wishlist
login.html                 → Email/Password + Google auth
register.html              → User registration form
forgot-password.html       → Password reset flow
news.html                  → Blog/news listing
news-detail.html           → Blog detail + promo codes
about.html                 → Info about cafe
contact.html               → Contact form
reservation.html           → Table booking system
policy.html                → Privacy & terms
admin.html                 → Admin dashboard (1500+ lines)
```

### CSS Files
```
style.css                  → Main styles (2000+ lines)
                             - CSS variables (colors, fonts)
                             - Layout (flexbox, grid)
                             - Components (buttons, cards, modals)
                             - Dark mode theme
                             - Animations & transitions
```

### JavaScript Modules
```
firebase-config.js         → Firebase SDK + auth initialization + exports
auth-helper.js             → User authentication & role checking
                             - ADMIN_EMAILS list
                             - isAdmin() function
                             - getCurrentUser()
                             - Session management
cart-helper.js             → Shopping cart per-user management
                             - localStorage key: moonlight_cart_{uid}
                             - Add/update/remove items
                             - Calculate totals
                             - Update UI badges
cloudinary-helper.js       → Image upload & optimization
                             - Canvas compression
                             - File optimization
                             - Upload to Cloudinary
cloudinary-paths.js        → Cloudinary API config
cloudinary-public-config.js → Public upload preset
nav-helper.js              → Navigation & menu toggle
```

### Netlify Functions (Backend)
```
vnpay-create-payment-url.js    → POST /api/vnpay/create-payment-url
                                  - Generate VNPAY payment link
                                  - HMAC-SHA512 signing
                                  
vnpay-verify-return.js         → GET /api/vnpay/verify-return
                                  - Verify payment signature
                                  - Return result to frontend
                                  
vnpay-ipn.js                   → POST /api/vnpay/ipn
                                  - IPN webhook from VNPAY
                                  - Update order status in Firebase
                                  
cloudinary-upload.js           → POST /api/cloudinary/upload
                                  - Server-side image upload
                                  - Override direct upload
                                  
_vnpay.js                      → VNPAY utilities
                                  - hmacSHA512()
                                  - sortObject()
                                  - queryString()
```

### Configuration Files
```
.env                           → API keys & secrets (not in repo)
netlify.toml                   → Build config + API redirects
database.rules.json            → Firebase security rules
sample-data.json               → Mock data for testing
```

---

## 🗄️ IV. FIREBASE DATABASE STRUCTURE

```
moonlight-cafe-57e5d/
│
├─ users/{uid}/
│  ├─ email: string
│  ├─ displayName: string
│  ├─ phone: string
│  ├─ role: "admin" | "customer"
│  ├─ dateJoined: timestamp
│  └─ avatar: url
│
├─ products/{id}/
│  ├─ name: string
│  ├─ category: "coffee" | "tea" | "cake" | "dessert"
│  ├─ price: number (VND)
│  ├─ stock: number
│  ├─ description: string
│  ├─ imageUrl: string (Cloudinary)
│  ├─ isAvailable: boolean
│  ├─ rating: number
│  ├─ badge: "Hot" | "Classic" | "Sweet" | "Healthy"
│  └─ createdAt: timestamp
│
├─ orders/{id}/
│  ├─ userId: string
│  ├─ customerName: string
│  ├─ email: string
│  ├─ phone: string
│  ├─ address: string
│  ├─ items: [{productId, name, qty, price, subtotal}]
│  ├─ total: number
│  ├─ discount: number
│  ├─ paymentMethod: "COD" | "Banking" | "MoMo" | "VNPAY"
│  ├─ paymentStatus: "pending" | "paid" | "failed"
│  ├─ status: "pending" | "confirmed" | "shipping" | "delivered" | "cancelled"
│  ├─ promoCode: string
│  ├─ createdAt: timestamp
│  ├─ updatedAt: timestamp
│  └─ vnpayTransactionId: string
│
├─ reviews/{id}/
│  ├─ productId: string
│  ├─ userId: string
│  ├─ userName: string
│  ├─ rating: 1-5
│  ├─ content: string
│  ├─ status: "pending" | "approved" | "rejected"
│  ├─ createdAt: timestamp
│  └─ images: [urls]
│
├─ promotions/{id}/
│  ├─ code: string (unique)
│  ├─ title: string
│  ├─ description: string
│  ├─ discountType: "percentage" | "fixed"
│  ├─ discountValue: number
│  ├─ minAmount: number
│  ├─ maxUses: number
│  ├─ usedCount: number
│  ├─ startDate: timestamp
│  ├─ endDate: timestamp
│  ├─ isActive: boolean
│  └─ createdAt: timestamp
│
├─ news/{id}/
│  ├─ title: string
│  ├─ content: string
│  ├─ image: url
│  ├─ promoCode: string
│  ├─ status: "published" | "draft"
│  ├─ views: number
│  └─ createdAt: timestamp
│
├─ reservations/{id}/
│  ├─ customerName: string
│  ├─ email: string
│  ├─ phone: string
│  ├─ date: string (YYYY-MM-DD)
│  ├─ time: string (HH:MM)
│  ├─ partySize: number
│  ├─ tableNum: string
│  ├─ notes: string
│  ├─ status: "pending" | "confirmed" | "completed" | "no-show" | "rejected"
│  ├─ depositStatus: "pending" | "paid" | "refunded"
│  ├─ depositAmount: number
│  ├─ createdAt: timestamp
│  └─ modifiedAt: timestamp
│
├─ contacts/{id}/
│  ├─ name: string
│  ├─ email: string
│  ├─ phone: string
│  ├─ subject: string
│  ├─ message: string
│  ├─ status: "new" | "replied" | "closed"
│  ├─ adminReply: string
│  ├─ createdAt: timestamp
│  └─ repliedAt: timestamp
│
└─ settings/
   ├─ storeName: string
   ├─ storePhone: string
   ├─ storeEmail: string
   ├─ storeAddress: string
   └─ businessHours: object
```

---

## 🎯 V. TÍNH NĂNG HỆ THỐNG

### Phía Customer
| Nhóm | Tính Năng |
|-----|----------|
| **Duyệt Sản Phẩm** | Xem danh sách, lọc danh mục, tìm kiếm, xem chi tiết |
| **Giỏ Hàng** | Thêm/xóa, cập nhật số lượng, áp dụng promo code |
| **Thanh Toán** | COD, Banking, MoMo, VNPAY (Sandbox) |
| **Hóa Đơn** | Xem QR code, thông tin chi tiết |
| **Đơn Hàng** | Lịch sử, theo dõi trạng thái, hủy |
| **Tài Khoản** | Đăng ký/đăng nhập (Email + Google), quên mật khẩu |
| **Hồ Sơ** | Cập nhật thông tin, đổi mật khẩu |
| **Yêu Thích** | Lưu sản phẩm yêu thích |
| **Đánh Giá** | Rating + bình luận sản phẩm |
| **Tin Tức** | Xem blog + copy promo codes |
| **Đặt Bàn** | Chọn ngày/giờ, xem trạng thái |
| **Liên Hệ** | Gửi tin nhắn, xem chính sách |

### Phía Admin
| Nhóm | Tính Năng |
|-----|----------|
| **Dashboard** | Thống kê (doanh thu, đơn hàng, khách, sản phẩm), biểu đồ Chart.js |
| **Đặt Hàng** | Danh sách, lọc trạng thái, xem chi tiết, cập nhật status, xuất Excel |
| **Sản Phẩm** | CRUD, upload ảnh, quản lý kho, bật/tắt |
| **Khách Hàng** | Danh sách, xem thông tin, lịch sử mua |
| **Đánh Giá** | Duyệt/từ chối, xóa |
| **Tin Tức** | CRUD, thêm promo code |
| **Khuyến Mãi** | CRUD, cấu hình mã giảm giá |
| **Đặt Bàn** | Xem danh sách, xác nhận, quản lý deposit |
| **Liên Hệ** | Xem tin nhắn, trả lời |
| **Thông Báo Real-time** | Đơn hàng mới, sắp hết hàng, đánh giá chờ duyệt |

---

## 🔄 VI. CÁC FLOW CHÍNH

### A. Authentication Flow
```
User → Login/Register Page → Firebase Auth
        ↓
    Check Admin Email List
        ↓
    ├─ Admin → Admin Dashboard
    └─ Customer → Home/Profile
```

### B. Shopping Flow
```
Browse → Add to Cart → Checkout → 
Select Payment → Process Payment → Confirm Order → 
View Invoice (QR) → Track Order → Leave Review
```

### C. Payment Flow (VNPAY)
```
Submit Order
    ↓
Netlify: vnpay-create-payment-url.js
    ↓
    Create VNPAY Signature & URL
    ↓
Redirect to VNPAY Portal
    ↓
User enters card info
    ↓
VNPAY -> IPN Webhook
    ↓
Netlify: vnpay-ipn.js
    ↓
    Update order status in Firebase
    ↓
Redirect back to app
    ↓
vnpay-verify-return.js
    ↓
    Verify signature & status
    ↓
Show Order Success (with QR)
```

### D. Real-time Admin Updates
```
Firebase onValue listeners
    ↓
    Trigger when data changes
    ↓
Update Charts/Tables/Badges
    ↓
Notification system
    ├─ New orders (pending status)
    ├─ Low stock (stock ≤ 10)
    └─ Reviews to approve (pending status)
```

---

## 🔐 VII. BẢO MẬT & XÁC THỰC

### Authentication
- ✅ Firebase Auth (built-in security, password hashing)
- ✅ Email/Password authentication
- ✅ Google OAuth 2.0 Sign-in
- ✅ Session management via localStorage

### Authorization
- ✅ Role-based access (ADMIN_EMAILS list)
- ✅ `isAdmin()` function checks role
- ✅ Admin pages protected by JS redirect
- ✅ Firebase Security Rules (per-collection access)

### Payment Security
- ✅ VNPAY HMAC-SHA512 signature verification
- ✅ Netlify Functions (server-side) for sensitive ops
- ✅ API keys in `.env` (not exposed to frontend)
- ✅ CORS headers configuration

### Data Protection
- ✅ HTTPS/SSL (Netlify + Firebase)
- ✅ Data encryption at rest (Firebase)
- ✅ Private Firebase rules

---

## 💾 VIII. KEY IMPLEMENTATION DETAILS

### 1. Shopping Cart
- **Storage:** localStorage with key `moonlight_cart_{uid}`
- **Scope:** Per-user only (empty for guests)
- **Persistence:** Survives page reload
- **Clear:** On logout

### 2. Real-time Listening
```javascript
// Admin dashboard updates in real-time
onValue(ref(db, 'orders'), (snapshot) => {
  const orders = [];
  snapshot.forEach(child => {
    orders.push(child.val());
  });
  renderOrders(orders);
});
```

### 3. Image Handling
- **Upload:** Cloudinary via form or API
- **Compression:** Canvas-based optimization before upload
- **Delivery:** CDN from Cloudinary
- **Fallback:** Firebase Storage as backup

### 4. Promo Code System
- **Format:** `code` field in promotions collection
- **Validation:** Check minAmount, endDate, usedCount
- **Discount:** Apply `discountValue` (percentage or fixed)
- **Auto-update:** Real-time in checkout page

### 5. Notification System
- **Types:**
  - Order notifications (status = "pending")
  - Stock alerts (stock ≤ 10)
  - Review approvals (status = "pending")
- **Display:** Real-time bell icon with badge
- **Auto-refresh:** Every 10 seconds when panel open
- **Storage:** localStorage tracks viewed notifications

### 6. Admin Dashboard
- **Single file:** admin.html (1500+ lines)
- **Structure:** Embedded HTML + CSS + JavaScript
- **Navigation:** `showSection()` function for tabs
- **Charts:** Chart.js for visualization
- **Export:** XLSX for Excel download

---

## 🔌 IX. API ENDPOINTS (Netlify Functions)

### VNPAY Payment
```
POST /api/vnpay/create-payment-url
  Input: {amount, orderId, returnUrl}
  Output: {paymentUrl, error}

GET /api/vnpay/verify-return
  Query: vnp_Amount, vnp_TransactionNo, vnp_SecureHash, etc.
  Output: {status: "success"|"failure", message}

POST /api/vnpay/ipn
  From: VNPAY server
  Task: Update Firebase order status
  Response: {RspCode: "00" or "01"}
```

### Image Upload
```
POST /api/cloudinary/upload
  Input: FormData with image file
  Output: {url, error}
  Task: Server-side upload to Cloudinary
```

---

## 📊 X. PERFORMANCE OPTIMIZATIONS

### Frontend
- **CSS Variables** for easy theming
- **LocalStorage** for caching user data
- **Firebase** direct queries (no unnecessary fetches)
- **Event delegation** for dynamic elements
- **Lazy loading** for images (Cloudinary)

### Backend
- **Netlify Functions** auto-scaling
- **Firebase indexes** on commonly queried fields
- **CDN** delivery via Netlify + Cloudinary
- **Real-time listeners** instead of polling

---

## 🎨 XI. UI/UX FEATURES

### Design
- **Dark Mode** theme (cafe ambiance)
- **Color Scheme:** Gold (#d4a574) + Dark background
- **Typography:** Playfair Display (headings) + Poppins (body)
- **Animations:** Smooth transitions, loading spinners, hover effects

### Key Components
- **Navigation:** Logo, menu links, user icon, cart badge
- **Cards:** Product, order, review cards with hover effects
- **Modals:** For orders, reviews, confirmations
- **Forms:** Styled inputs, validation feedback
- **Tables:** Admin dashboard tables with sorting/filtering
- **Charts:** Revenue trends, order status breakdown

---

# 🎯 PROMPT FO GEMINI CHAT

## **NGẮN GỌN, SÁT VỚI CODE:**

```
Phân tích dự án "Moonlight Cafe" - E-commerce website cho cửa hàng cafe & bánh ngọt.

## CÔNG NGHỆ:
- Frontend: HTML5, CSS3, JavaScript ES6+
- Libraries: Font Awesome, SweetAlert2, Chart.js, QRCode.js, XLSX
- Backend: Firebase (Auth + Realtime DB)
- Serverless: Netlify Functions (Node.js)
- Payment: VNPAY, COD, Banking, MoMo
- Deployment: Netlify + GitHub

## TÍNH NĂNG CHÍNH:

**Customer:**
- Browse & filter products (coffee, tea, cake, dessert)
- Shopping cart (per-user localStorage)
- Multi-method checkout (VNPAY/COD/Banking/MoMo)
- Order history & tracking
- Invoice viewing with QR code
- Product reviews & ratings
- Wishlist management
- Table reservation
- Authentication (Email/Google)
- Contact messaging

**Admin:**
- Dashboard with stats (revenue, orders, customers, products)
- Chart.js visualizations
- Order management (list, filter, update status, export Excel)
- Product CRUD + image upload
- Customer management
- Review approval/rejection
- News/promo management
- Table booking management
- Real-time notifications (new orders, low stock, pending reviews)

## CẤU TRÚC DỮ LIỆU (Firebase):
- users/ → Email, role, profile
- products/ → Name, price, stock, category, image
- orders/ → Items[], total, status, payment method
- reviews/ → ProductId, rating, content, status
- promotions/ → Code, discount, validity
- news/ → Title, content, promo code
- reservations/ → Date, time, table, status
- contacts/ → Name, message, status

## KEY PATTERNS:

1. **Auth:** Firebase Auth + ADMIN_EMAILS list → Role checking
2. **Cart:** localStorage key = moonlight_cart_{uid}
3. **Real-time:** Firebase onValue() listeners auto-update dashboard
4. **Payments:** 
   - Create URL → Sign with HMAC-SHA512 → Redirect to VNPAY
   - IPN webhook updates order status in Firebase
5. **Images:** Cloudinary upload + Canvas compression + CDN delivery
6. **Notifications:** Bell icon shows:
   - Pending orders (blue)
   - Low stock (red)
   - Pending reviews (orange)

## FILE STRUCTURE:

Frontend:
- 16 HTML pages (index, menu, cart, checkout, orders, admin, etc.)
- style.css (2000+ lines) - Dark mode, components, animations
- 7 JS modules (firebase, auth, cart, cloudinary, nav)

Backend:
- 4 Netlify Functions (VNPAY create/verify/IPN, Cloudinary upload)
- _vnpay.js (utilities & constants)

Database: Firebase Realtime DB with security rules

## DETAILS CẦN BIẾT:

- Admin dashboard: Single admin.html file (1500+ lines)
- Payment flow: Client → Netlify → VNPAY → IPN → Firebase update
- Cart: Local-only (no sync to Firebase until order)
- Images: Cloudinary as primary, Firebase as backup
- Real-time: Listeners update charts + tables automatically

## TASK:

Vui lòng phân tích:
1. Kiến trúc hệ thống & cách các thành phần tương tác
2. Luồng dữ liệu chính (auth, shopping, payment, admin updates)
3. Design patterns được sử dụng
4. Issues tiềm ẩn & cải thiện có thể
5. Ưu/nhược điểm của stack này

Chỉ phân tích & giải thích. Chúng tôi sẽ yêu cầu cụ thể sau.
```

---

**TÓMLƯỢC:**
Website e-commerce hoàn chỉnh (HTML5/CSS3/JS + Firebase + Netlify) 
cho quản lý cafe với payment gateway, real-time admin dashboard, 
và đa tính năng (cart, orders, reviews, reservations, notifications).
```
