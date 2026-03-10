# TỔNG QUAN DỰ ÁN WEBSITE THƯƠNG MẠI ĐIỆN TỬ MOONLIGHT CAFE

Tài liệu này cung cấp cái nhìn chi tiết nhất về cấu trúc, chức năng và công cụ được sử dụng trong dự án "Xây dựng website thương mại điện tử cửa hàng Moonlight Cafe" để hỗ trợ viết báo cáo Đồ án Cơ sở 2.

---

## 1. Thông tin chung
- **Tên đề tài:** Xây dựng Website thương mại điện tử cửa hàng Moonlight Cafe.
- **Mục tiêu:** Cung cấp giải pháp kinh doanh đồ uống và bánh ngọt trực tuyến, kết hợp các tính năng đặt bàn và quản lý chuyên sâu.
- **Đặc điểm hệ thống:** Vận hành trên nền tảng Web (tối ưu hóa giao diện Desktop), tích hợp thời gian thực (Real-time) và trí tuệ nhân tạo đơn giản (AI Chatbot Tudongchat.com).

---

## 2. Công nghệ và Công cụ sử dụng
### Frontend (Giao diện người dùng)
- **Ngôn ngữ:** HTML5, CSS3, JavaScript (ES6+).
- **Thiết kế:** Sử dụng chuẩn **Vanilla CSS** với hệ thống Design Tokens (Biến CSS) giúp giao diện nhất quán, sang trọng theo phong cách Dark Theme (chủ đạo).
- **Thư viện hỗ trợ:**
    - **Font Awesome 6.4.0:** Cung cấp hệ thống icon đa dạng.
    - **Google Fonts:** Sử dụng bộ font *Playfair Display* (tiêu đề) và *Poppins* (nội dung) tạo cảm giác premium.
    - **SweetAlert2:** Thay thế các thông báo mặc định bằng popup hiện đại, thân thiện.
    - **Chart.js:** Xử lý đồ họa, vẽ biểu đồ thống kê tăng trưởng doanh thu.
    - **SheetJS (xlsx.full.min.js):** Thư viện mạnh mẽ cho phép xuất dữ liệu hệ thống ra file Excel (.xlsx).
    - **TuDongChat AI:** Tích hợp Chatbot thông minh hỗ trợ khách hàng 24/7.

### Backend & Infrastructure (Hạ tầng hệ thống)
- **Firebase Authentication:** Quản lý tài khoản (Đăng ký, Đăng nhập, Quên mật khẩu) và phân quyền truy cập (Admin/User).
- **Firebase Realtime Database:** Cơ sở dữ liệu NoSQL lưu trữ toàn bộ thông tin sản phẩm, đơn hàng, đặt bàn, bài viết theo thời gian thực.
- **Hosting:** Triển khai trên **Netlify** giúp tăng tốc độ phản hồi và bảo mật SSL.
- **Cloudinary API:** Giải pháp lưu trữ hình ảnh đám mây, tự động tối ưu hóa kích thước ảnh sản phẩm để tăng hiệu suất.

### Cổng thanh toán (Payment Gateways)
- **VNPay:** Thanh toán qua ngân hàng hoặc ví điện tử (Sandbox).
- **Ví MoMo:** Quét mã QR thanh toán nhanh.
- **COD:** Thanh toán tiền mặt khi nhận hàng (Cash on Delivery).

---

## 3. Hệ thống chức năng dành cho Khách hàng
1. **Trang chủ & Giới thiệu:** Banner tĩnh, sản phẩm bán chạy, tin tức mới và thông tin về giá trị cốt lõi của quán.
2. **Thực đơn thông minh (Menu):** 
    - Phân loại rõ ràng (Cà phê, Trà, Bánh ngọt, Tráng miệng).
    - Bộ lọc giá, tìm kiếm từ khóa.
    - Chế độ xem Lưới (Grid) hoặc Danh sách (List).
3. **Chi tiết sản phẩm:** Xem mô tả chi tiết, hình ảnh chất lượng cao, xem đánh giá xếp hạng sao.
4. **Giỏ hàng & Thanh toán:** 
    - Quản lý giỏ hàng linh hoạt (lưu trữ qua LocalStorage).
    - Quy trình Checkout 1 bước: Nhập thông tin và chọn phương thức thanh toán.
5. **Đặt bàn trực tuyến (Online Reservation):** 
    - Chọn ngày giờ cụ thể, loại bàn theo số người(2, 4, 6, 10 người).
    - **Chế độ đặt cọc:** Yêu cầu khách đặt cọc (mức cọc từ 20,000đ - 100,000đ tùy cấu hình, 10.000/ người) để giữ chỗ, thanh toán cọc qua MoMo/VNPay.
6. **Không gian cá nhân (Profile):** Theo dõi lịch sử mua hàng, trạng thái vận chuyển và thông tin tích lũy.
7. **Tin tức & Khuyến mãi:** Cập nhật các bài viết blog chuyên sâu về văn hóa cafe và các mã giảm giá.
8. **AI Chatbot & Liên hệ:** Hỗ trợ trực tuyến và gửi feedback về dịch vụ.

---

## 4. Hệ thống quản trị chuyên sâu (Admin Dashboard)
Trang Admin là trung tâm điều hành toàn bộ hoạt động kinh doanh:
1. **Dashboard - Báo cáo & Thống kê:** 
    - Tổng quan con số: Doanh thu tháng, Tổng doanh thu, Tổng đơn hàng, Khách hàng, Sản phẩm đang bán, Đơn chờ xử lí.
    - Biểu đồ thống kê doanh thu theo 12 tháng gần nhất.
    - Biểu đồ tròn hiển thị top 5 sản phẩm bán chạy nhất.
2. **Quản lý đơn hàng:** Tiếp nhận đơn hàng Real-time, cập nhật trạng thái (Xác nhận  Đang giao -> Hoàn thành/Hủy), xem/ xoá đơn.
3. **Quản lý sản phẩm:** Quản lý tồn kho, giá bán, danh mục, hình ảnh và trạng thái sản phẩm.
4. **Quản lý khách hàng:** Theo dõi danh sách khách hàng và hành vi mua sắm.
5. **Quản lý đánh giá và liên hệ:** Xem đánh giá và liên hệ từ khách hàng, duyệt để hiển thị trên trang web, phản hồi đánh giá hoặc xóa.
6. **Quản lý khuyến mãi:** Tạo, xem , sửa, xoá khuyến mãi.
7. **Quản lý tin tức:** Tạo, xem , sửa, xoá tin tức.
8. **Quản lý đặt bàn:** Phê duyệt/Hủy yêu cầu đặt bàn, kiểm tra tình trạng cọc.
9. **Quản lý bàn:** Quản lý số lượng bàn, trạng thái bàn, loại bàn.
10. **Tính năng dữ liệu nâng cao:** 
    - **Import Bulk Products:** Thêm hàng loạt sản phẩm từ file JSON nhanh chóng.
    - **Export specialized Excel:** Xuất báo cáo Excel chi tiết cho: *Đơn hàng, Khách hàng, Sản phẩm, Khuyến mãi, Thống kê tổng quan*.
11. **Trung tâm thông báo:** Hệ thống chuông báo và popup thông báo ngay lập tức khi phát sinh đơn hàng hoặc yêu cầu đặt bàn mới.

---

## 5. Cấu trúc thư mục (Detailed Directory Tree)

```text
Moonlight-Cafe/
├── index.html                  # Trang chủ (Cổng vào hệ thống)
├── menu.html                   # Module Thực đơn & Tìm kiếm
├── product-detail.html         # Module Chi tiết & Đánh giá
├── cart.html                   # Module Giỏ hàng
├── checkout.html               # Module Thanh toán & Xác nhận
├── reservation.html            # Module Đặt bàn & Thanh toán cọc
├── profile.html                # Module Quản lý thông tin cá nhân
├── orders.html                 # Module Lịch sử đơn hàng khách hàng
├── admin.html                  # Dashboard Quản trị toàn diện (All-in-one)
├── login.html / register.html  # Hệ thống Xác thực
├── forgot-password.html        # Trang khôi phục mật khẩu
├── contact.html                # Module Liên hệ & Feedback
├── news.html / news-detail.html # Module Blog/Tin tức
├── promotions.html             # Module Khuyến mãi & Voucher
├── policy.html                 # Chính sách & Quy định cửa hàng
├── setup-admin.html            # Công cụ quản trị đặc biệt (Cấp quyền Admin)
├── vnpay-return.html           # Landing page xử lý callback từ VNPay
├── import-products.html        # Công cụ nhập dữ liệu sản phẩm hàng loạt
├── bulk_products.json          # File chứa dữ liệu sản phẩm mẫu (JSON)
├── css/                        # Thư mục chứa các tệp định dạng
│   └── style.css               # File CSS chính tập trung mọi style desktop
├── js/                         # Thư mục chứa các tệp xử lý logic JavaScript
│   ├── firebase-config.js      # Cấu hình kết nối Firebase Project
│   ├── auth-helper.js          # Logic xác thực người dùng & Phân quyền
│   ├── cart-helper.js          # Quản lý giỏ hàng LocalStorage
│   ├── cloudinary-helper.js    # Tương tác API lưu trữ ảnh Cloudinary
│   ├── cloudinary-paths.js     # Quản lý đường dẫn ảnh trên Cloudinary
│   └── nav-helper.js           # Xử lý UX điều hướng & Badge thông báo
├── images/                     # Tài nguyên hình ảnh của website
│   ├── logo.png                # Logo chính thức của Moonlight Cafe
│   ├── momo-qr-quan.jpg        # Mã QR MoMo nhận thanh toán cọc/đơn hàng
│   ├── gallery/                # Chứa ảnh không gian quán (anh-1.jpg, ...)
│   └── pic_products/           # Chứa ảnh đại diện cho các loại sản phẩm
├── netlify/                    # Chức năng Serverless (Backend logic)
│   └── functions/
│       ├── vnpay-create-payment-url.js # Tạo URL thanh toán VNPay
│       ├── vnpay-verify-return.js      # Xác minh giao dịch từ VNPay
│       └── cloudinary-upload.js        # Xử lý upload ảnh lên Cloudinary
└── scripts/                    # Các script hỗ trợ tự động hóa & Backup
    ├── gen_products.py         # Script Python tạo dữ liệu sản phẩm mẫu
    └── vnpay-server.js         # Script Node.js hỗ trợ test VNPay Local
```

---

## 6. Prompt mẫu hỗ trợ viết báo cáo (Dành cho Chat AI)
Hãy sao chép đoạn Prompt này gửi cho AI để nhận được sự hỗ trợ tốt nhất:
> *"Tôi đang thực hiện báo cáo đồ án 'Xây dựng website thương mại điện tử Moonlight Cafe'. Dựa trên tài liệu cấu trúc và chức năng tôi gửi, hãy hỗ trợ tôi phân tích chi tiết các module. 

    
