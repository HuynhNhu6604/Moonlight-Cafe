# TÀI LIỆU USE CASE – HỆ THỐNG WEBSITE MOONLIGHT CAFE

---

## 1. USE CASE QUẢN LÝ TÀI KHOẢN

### UC001: Đăng ký tài khoản
**Actor:** Khách vãng lai  
**Mô tả:** Khách vãng lai đăng ký tài khoản mới bằng email hoặc Google  
**Precondition:** Chưa có tài khoản  
**Main Flow:**  
1. Khách vãng lai truy cập trang Đăng ký (`register.html`)
2. Chọn phương thức đăng ký:
   - **Email:** Nhập Họ, Tên, Email, Số điện thoại, Mật khẩu, Xác nhận mật khẩu
   - **Google:** Nhấn nút đăng ký bằng Google, chọn tài khoản Google
3. Đồng ý với Điều khoản sử dụng và Chính sách bảo mật
4. Nhấn nút "Đăng ký"
5. Hệ thống tạo tài khoản trên Firebase Authentication
6. Hệ thống lưu thông tin người dùng vào Firebase Realtime Database (họ tên, email, SĐT, role: `customer`, ngày tạo)
7. Hệ thống hiển thị thông báo đăng ký thành công
8. Chuyển hướng về Trang chủ (hoặc Trang quản trị nếu email nằm trong danh sách Admin)

**Postcondition:** Tài khoản mới được tạo thành công, role mặc định là `customer`  
**Exception:**  
- Email đã được sử dụng (`auth/email-already-in-use`)
- Email không hợp lệ (`auth/invalid-email`)
- Mật khẩu quá yếu – ít nhất 6 ký tự (`auth/weak-password`)
- Mật khẩu xác nhận không khớp
- Chưa đồng ý Điều khoản sử dụng

---

### UC002: Đăng nhập
**Actor:** Khách vãng lai, Người dùng, Quản trị viên  
**Mô tả:** Người dùng đăng nhập vào hệ thống bằng Email/Mật khẩu hoặc Google  
**Precondition:** Người dùng chưa đăng nhập, đã có tài khoản  
**Main Flow:**  
1. Người dùng truy cập trang Đăng nhập (`login.html`)
2. Chọn phương thức đăng nhập:
   - **Email:** Nhập Email và Mật khẩu, nhấn "Đăng nhập"
   - **Google:** Nhấn nút Google, chọn tài khoản Google trong popup
3. Hệ thống xác thực thông tin qua Firebase Authentication
4. Hệ thống lấy thông tin người dùng từ Firebase Database (role, tên, SĐT...)
5. Lưu thông tin phiên đăng nhập vào `localStorage` (`moonlight_user`)
6. Cập nhật thời gian đăng nhập cuối (`lastLoginAt`)
7. Chuyển hướng theo quyền:
   - **Admin** (role = `admin` hoặc email nằm trong `ADMIN_EMAILS`) → `admin.html`
   - **Customer** → Trang chủ hoặc trang được redirect trước đó

**Postcondition:** Đăng nhập thành công, vào đúng trang theo quyền  
**Exception:**  
- Email không tồn tại (`auth/user-not-found`)
- Mật khẩu không đúng (`auth/wrong-password`)
- Email hoặc mật khẩu không đúng (`auth/invalid-credential`)
- Popup Google bị đóng/chặn bởi trình duyệt

---

### UC003: Quên mật khẩu
**Actor:** Người dùng  
**Mô tả:** Người dùng yêu cầu đặt lại mật khẩu khi quên  
**Precondition:** Người dùng đã có tài khoản, chưa đăng nhập  
**Main Flow:**  
1. Người dùng truy cập trang Quên mật khẩu (`forgot-password.html`)
2. Nhập email đã đăng ký
3. Nhấn nút "Gửi yêu cầu"
4. Hệ thống gửi email chứa link đặt lại mật khẩu qua Firebase `sendPasswordResetEmail`
5. Hiển thị thông báo thành công: "Đã gửi email! Vui lòng kiểm tra hộp thư."

**Postcondition:** Email đặt lại mật khẩu được gửi thành công  
**Exception:**  
- Email không tồn tại trong hệ thống (`auth/user-not-found`)
- Email không hợp lệ (`auth/invalid-email`)
- Quá nhiều yêu cầu (`auth/too-many-requests`)

---

### UC004: Đăng xuất
**Actor:** Người dùng, Quản trị viên  
**Mô tả:** Người dùng đăng xuất khỏi hệ thống  
**Precondition:** Người dùng đã đăng nhập  
**Main Flow:**  
1. Người dùng nhấn vào icon tài khoản trên thanh điều hướng
2. Chọn "Đăng xuất" trong dropdown menu
3. Hệ thống xóa phiên đăng nhập khỏi `localStorage`
4. Đăng xuất khỏi Firebase Authentication
5. Chuyển hướng về trang Đăng nhập

**Postcondition:** Đăng xuất thành công, phiên đăng nhập bị xóa  

---

## 2. USE CASE XEM THỰC ĐƠN VÀ SẢN PHẨM

### UC005: Xem thực đơn (Menu)
**Actor:** Khách vãng lai, Người dùng  
**Mô tả:** Người dùng duyệt xem danh sách sản phẩm trên thực đơn  
**Precondition:** Không yêu cầu đăng nhập  
**Main Flow:**  
1. Người dùng truy cập trang Menu (`menu.html`)
2. Hệ thống tải danh sách sản phẩm từ Firebase Database (chỉ hiển thị sản phẩm có `isAvailable = true`)
3. Hiển thị sản phẩm dạng lưới (Grid) mặc định, 8 sản phẩm/trang
4. Người dùng có thể:
   - **Lọc theo danh mục:** Tất cả, Cà phê, Trà, Bánh ngọt, Tráng miệng, Sinh tố... (danh mục động từ dữ liệu)
   - **Tìm kiếm:** Nhập từ khóa tìm sản phẩm theo tên
   - **Lọc theo giá:** Nhập khoảng giá (Từ - Đến) rồi nhấn "Áp dụng"
   - **Sắp xếp:** Mặc định, Tên A-Z, Tên Z-A, Giá thấp→cao, Giá cao→thấp
   - **Chuyển chế độ xem:** Grid (lưới) hoặc List (danh sách)
   - **Phân trang:** Chuyển trang khi có nhiều sản phẩm
5. Mỗi sản phẩm hiển thị: Hình ảnh, Tên, Danh mục, Mô tả ngắn, Giá, Giá cũ (nếu có), Badge (nếu có), Trạng thái còn/hết hàng

**Postcondition:** Danh sách sản phẩm được hiển thị theo bộ lọc  
**Exception:** Không tìm thấy sản phẩm phù hợp → Hiển thị "Không tìm thấy sản phẩm"

---

### UC006: Xem chi tiết sản phẩm
**Actor:** Khách vãng lai, Người dùng  
**Mô tả:** Người dùng xem thông tin chi tiết của một sản phẩm  
**Precondition:** Sản phẩm tồn tại trong hệ thống  
**Main Flow:**  
1. Người dùng nhấn vào tên, hình ảnh, hoặc nút "Xem chi tiết" của sản phẩm trên trang Menu
2. Hệ thống chuyển sang trang Chi tiết sản phẩm (`product-detail.html?id=...`)
3. Hiển thị: Hình ảnh chất lượng cao, Tên sản phẩm, Danh mục, Giá, Mô tả chi tiết, Đánh giá xếp hạng sao từ khách hàng

**Postcondition:** Thông tin chi tiết sản phẩm được hiển thị  
**Exception:** Sản phẩm không tồn tại → Thông báo lỗi

---

### UC007: Thêm sản phẩm vào danh sách yêu thích
**Actor:** Người dùng  
**Mô tả:** Người dùng thêm/xóa sản phẩm khỏi danh sách yêu thích  
**Precondition:** Người dùng đã đăng nhập  
**Main Flow:**  
1. Trên trang Menu, người dùng nhấn nút trái tim (♥) trên sản phẩm
2. Nếu sản phẩm chưa có trong Wishlist → Thêm vào, hiển thị "Đã thêm yêu thích"
3. Nếu sản phẩm đã có trong Wishlist → Xóa khỏi danh sách, hiển thị "Đã bỏ yêu thích"
4. Danh sách yêu thích được lưu vào `localStorage` theo UID người dùng (`moonlight_wishlist_{uid}`)

**Postcondition:** Sản phẩm được thêm/xóa khỏi danh sách yêu thích  
**Exception:** Chưa đăng nhập → Hiển thị yêu cầu đăng nhập

---

## 3. USE CASE GIỎ HÀNG VÀ THANH TOÁN

### UC008: Thêm sản phẩm vào giỏ hàng
**Actor:** Người dùng  
**Mô tả:** Người dùng thêm sản phẩm vào giỏ hàng  
**Precondition:** Người dùng đã đăng nhập, sản phẩm còn hàng  
**Main Flow:**  
1. Trên trang Menu hoặc Chi tiết sản phẩm, người dùng nhấn nút "Thêm vào giỏ hàng"
2. Hệ thống kiểm tra tồn kho real-time từ Firebase
3. Nếu sản phẩm đã có trong giỏ → Tăng số lượng thêm 1
4. Nếu sản phẩm chưa có → Thêm mới với số lượng 1
5. Giỏ hàng lưu vào `localStorage` theo UID (`moonlight_cart_{uid}`)
6. Cập nhật badge số lượng giỏ hàng trên thanh điều hướng
7. Hiển thị thông báo toast "Đã thêm vào giỏ hàng!"

**Postcondition:** Sản phẩm đã được thêm vào giỏ hàng  
**Exception:**  
- Chưa đăng nhập → Yêu cầu đăng nhập trước
- Sản phẩm hết hàng (`stock <= 0`) → Thông báo "Hết hàng"
- Số lượng vượt quá tồn kho → Thông báo "Không đủ số lượng"

---

### UC009: Quản lý giỏ hàng
**Actor:** Người dùng  
**Mô tả:** Người dùng xem và quản lý giỏ hàng  
**Precondition:** Người dùng đã đăng nhập  
**Main Flow:**  
1. Người dùng truy cập trang Giỏ hàng (`cart.html`)
2. Hệ thống hiển thị danh sách sản phẩm trong giỏ (hình ảnh, tên, giá, số lượng, thành tiền)
3. Người dùng có thể:
   - **Tăng/giảm số lượng:** Nhấn nút +/- (kiểm tra tồn kho khi tăng)
   - **Xóa sản phẩm:** Nhấn nút X, xác nhận xóa
   - **Xóa tất cả:** Nhấn "Xóa tất cả", xác nhận
4. Hiển thị tổng đơn hàng: Tạm tính, Tổng cộng
5. Nhấn "Thanh toán" để chuyển sang trang Checkout
6. Nhấn "Tiếp tục mua sắm" để quay lại Menu

**Postcondition:** Giỏ hàng được cập nhật  
**Exception:**  
- Chưa đăng nhập → Hiển thị yêu cầu đăng nhập
- Giỏ hàng trống → Hiển thị "Giỏ hàng trống" và nút "Xem Menu"
- Số lượng giảm về 0 → Tự động hỏi xóa sản phẩm

---

### UC010: Thanh toán đơn hàng
**Actor:** Người dùng  
**Mô tả:** Người dùng tiến hành thanh toán đơn hàng  
**Precondition:** Người dùng đã đăng nhập, giỏ hàng có sản phẩm  
**Main Flow:**  
1. Người dùng truy cập trang Thanh toán (`checkout.html`)
2. Hệ thống tự động điền thông tin từ hồ sơ (Họ tên, Email, SĐT, Địa chỉ)
3. Nhập/chỉnh sửa thông tin giao hàng:
   - Họ và tên, Số điện thoại, Email
   - Địa chỉ giao hàng, Quận/Huyện (Ninh Kiều, Bình Thủy, Cái Răng), Phường/Xã, Tỉnh/Thành phố (mặc định: Cần Thơ)
   - Ghi chú đơn hàng
4. Chọn phương thức thanh toán:
   - **COD:** Thanh toán tiền mặt khi nhận hàng
   - **Ví MoMo:** Quét mã QR MoMo, nội dung chuyển khoản: "THANHTOAN [Mã đơn hàng]"
   - **VNPay QR:** Chuyển hướng đến cổng thanh toán VNPay online
5. Nhập mã khuyến mãi (nếu có) → Nhấn "Áp dụng" để kiểm tra và áp dụng giảm giá
6. Hệ thống tính:
   - Tạm tính (tổng giá sản phẩm)
   - Phí vận chuyển (tính theo khoảng cách phường: ≤1km miễn phí, mỗi km thêm 5.000đ, tối đa 25.000đ)
   - Giảm giá (nếu có mã khuyến mãi hợp lệ)
   - Tổng cộng
7. Nhấn "Đặt hàng"
8. Hệ thống lưu đơn hàng vào Firebase Database, xóa giỏ hàng
9. Nếu VNPay → Chuyển đến cổng VNPay; Nếu COD/MoMo → Chuyển đến trang Đặt hàng thành công

**Postcondition:** Đơn hàng được tạo thành công, giỏ hàng được xóa  
**Exception:**  
- Chưa đăng nhập → Yêu cầu đăng nhập
- Giỏ hàng trống → Chuyển về trang Giỏ hàng
- Thiếu thông tin bắt buộc → Thông báo lỗi
- Mã khuyến mãi không hợp lệ/hết hạn/chưa đến ngày áp dụng → Thông báo lỗi cụ thể

---

### UC011: Xem trang đặt hàng thành công
**Actor:** Người dùng  
**Mô tả:** Người dùng xem thông tin xác nhận đơn hàng sau khi đặt thành công  
**Precondition:** Đơn hàng vừa được tạo  
**Main Flow:**  
1. Sau khi đặt hàng thành công, hệ thống chuyển đến trang `order-success.html`
2. Hiển thị thông tin đơn hàng: Mã đơn, danh sách sản phẩm, tổng tiền, phương thức thanh toán, trạng thái

**Postcondition:** Người dùng nhận được thông tin xác nhận đơn hàng  

---

### UC012: Xử lý callback VNPay
**Actor:** Hệ thống  
**Mô tả:** Hệ thống xử lý kết quả trả về từ cổng thanh toán VNPay  
**Precondition:** Người dùng đã thanh toán qua VNPay  
**Main Flow:**  
1. VNPay gọi callback đến trang `vnpay-return.html`
2. Hệ thống xác minh giao dịch qua serverless function (`vnpay-verify-return.js`)
3. Nếu thanh toán thành công → Cập nhật trạng thái đơn hàng
4. Nếu thất bại → Thông báo lỗi cho người dùng

**Postcondition:** Trạng thái đơn hàng được cập nhật theo kết quả thanh toán  

---

## 4. USE CASE ĐẶT BÀN

### UC013: Đặt bàn trực tuyến
**Actor:** Người dùng  
**Mô tả:** Người dùng đặt bàn trước tại quán café  
**Precondition:** Người dùng đã đăng nhập  
**Main Flow:**  
1. Người dùng truy cập trang Đặt bàn (`reservation.html`)
2. Nếu chưa đăng nhập → Hiển thị Login Gate, yêu cầu đăng nhập/đăng ký
3. Sau khi đăng nhập, hiển thị form đặt bàn theo các bước:
   - **Bước 1 – Chọn bàn:** Chọn loại bàn theo số người (2, 4, 6, 10 người), chọn số lượng bàn, chọn ngày giờ, xem tình trạng bàn trống real-time
   - **Bước 2 – Thông tin:** Nhập họ tên, số điện thoại, email, ghi chú
   - **Bước 3 – Đặt cọc:** Thanh toán tiền cọc (10.000đ/người) qua MoMo hoặc VNPay (quét mã QR MoMo hoặc chuyển đến cổng VNPay)
4. Nhấn "Xác nhận đặt bàn"
5. Hệ thống lưu yêu cầu đặt bàn vào Firebase Database với trạng thái `pending`
6. Gửi thông báo đến Admin

**Postcondition:** Yêu cầu đặt bàn được tạo, chờ Admin phê duyệt  
**Exception:**  
- Chưa đăng nhập → Login Gate
- Loại bàn hết chỗ → Hiển thị "Không khả dụng"
- Thiếu thông tin bắt buộc → Thông báo lỗi

---

### UC014: Xem lịch sử đặt bàn
**Actor:** Người dùng  
**Mô tả:** Người dùng xem danh sách các lần đặt bàn của mình  
**Precondition:** Người dùng đã đăng nhập  
**Main Flow:**  
1. Trên trang Đặt bàn hoặc tab "Lịch sử đặt bàn" trong Hồ sơ cá nhân (`profile.html?tab=reservations`)
2. Hiển thị danh sách đặt bàn với trạng thái: Chờ duyệt (pending), Đã xác nhận (confirmed), Đang thương lượng (negotiating), Đã từ chối (rejected), Hoàn thành (completed), Đã hủy (cancelled)
3. Mỗi card hiển thị: Mã đặt bàn, Thời gian, Loại bàn, Số người, Tiền cọc, Trạng thái

**Postcondition:** Danh sách đặt bàn được hiển thị  

---

## 5. USE CASE ĐÁNH GIÁ VÀ LIÊN HỆ

### UC015: Gửi đánh giá
**Actor:** Người dùng  
**Mô tả:** Người dùng gửi đánh giá xếp hạng sao về dịch vụ của quán  
**Precondition:** Người dùng đã đăng nhập  
**Main Flow:**  
1. Người dùng truy cập trang Liên hệ & Đánh giá (`contact.html`)
2. Chọn tab "Đánh giá"
3. Chọn số sao (1-5 sao)
4. Nhập nội dung đánh giá
5. Nhấn "Gửi đánh giá"
6. Hệ thống lưu đánh giá vào Firebase Database với trạng thái chờ duyệt (`pending`)
7. Hiển thị thông báo: "Đánh giá đang chờ duyệt"

**Postcondition:** Đánh giá được gửi thành công, chờ Admin duyệt  
**Exception:**  
- Chưa đăng nhập → Hiển thị prompt đăng nhập
- Chưa chọn số sao hoặc chưa nhập nội dung → Thông báo lỗi

---

### UC016: Xem đánh giá đã duyệt
**Actor:** Khách vãng lai, Người dùng  
**Mô tả:** Xem danh sách đánh giá đã được Admin duyệt  
**Precondition:** Không yêu cầu đăng nhập  
**Main Flow:**  
1. Truy cập trang Liên hệ & Đánh giá (`contact.html`)
2. Cuộn xuống phần "Khách hàng nói gì về chúng tôi"
3. Hệ thống hiển thị các đánh giá có trạng thái `approved`: Số sao, Nội dung, Tên người đánh giá, Ngày đánh giá

**Postcondition:** Danh sách đánh giá đã duyệt được hiển thị  

---

### UC017: Chỉnh sửa đánh giá
**Actor:** Người dùng  
**Mô tả:** Người dùng chỉnh sửa đánh giá đã gửi (trước khi được duyệt)  
**Precondition:** Người dùng đã gửi đánh giá, đánh giá đang ở trạng thái chờ duyệt  
**Main Flow:**  
1. Trên trang Liên hệ & Đánh giá, hiển thị form chỉnh sửa
2. Người dùng thay đổi số sao và/hoặc nội dung
3. Nhấn "Lưu"
4. Hệ thống cập nhật đánh giá trong Firebase

**Postcondition:** Đánh giá được cập nhật  

---

### UC018: Gửi liên hệ / Góp ý
**Actor:** Người dùng  
**Mô tả:** Người dùng gửi tin nhắn liên hệ đến quán  
**Precondition:** Người dùng đã đăng nhập  
**Main Flow:**  
1. Truy cập trang Liên hệ & Đánh giá (`contact.html`)
2. Chọn tab "Gửi liên hệ"
3. Chọn loại liên hệ: Góp ý, Khiếu nại, Hỏi đáp, Hợp tác, Khác
4. Nhập tiêu đề và nội dung chi tiết
5. Nhấn "Gửi liên hệ"
6. Hệ thống lưu vào Firebase Database

**Postcondition:** Liên hệ được gửi thành công  
**Exception:** Chưa đăng nhập → Hiển thị prompt đăng nhập

---

### UC019: Xem phản hồi từ quán (Hộp thư)
**Actor:** Người dùng  
**Mô tả:** Người dùng xem phản hồi từ Admin đối với đánh giá/liên hệ của mình  
**Precondition:** Người dùng đã đăng nhập, có phản hồi từ Admin  
**Main Flow:**  
1. Truy cập trang Liên hệ (`contact.html`) hoặc tab "Hộp thư" trong Hồ sơ cá nhân (`profile.html?tab=inbox`)
2. Hệ thống hiển thị phần "Tin nhắn từ tiệm" với các phản hồi
3. Mỗi phản hồi hiển thị: Đánh giá gốc, nội dung phản hồi của Admin, ngày phản hồi, trạng thái đã đọc/chưa đọc
4. Người dùng có thể nhấn "Đánh dấu đã đọc"
5. Badge thông báo trên nav icon (🔔) tự động cập nhật

**Postcondition:** Phản hồi được hiển thị, badge được cập nhật  

---

## 6. USE CASE QUẢN LÝ HỒ SƠ CÁ NHÂN

### UC020: Xem và cập nhật thông tin cá nhân
**Actor:** Người dùng  
**Mô tả:** Người dùng xem và chỉnh sửa thông tin tài khoản  
**Precondition:** Người dùng đã đăng nhập  
**Main Flow:**  
1. Truy cập trang Hồ sơ (`profile.html`), tab "Thông tin tài khoản"
2. Hiển thị: Avatar (chữ cái đầu), Họ tên, Email, thống kê (Tổng đơn hàng, Tổng chi tiêu, Thành viên từ)
3. Người dùng chỉnh sửa: Họ, Tên, SĐT, Địa chỉ
4. Nhấn "Lưu thay đổi"
5. Hệ thống cập nhật thông tin vào Firebase Database

**Postcondition:** Thông tin cá nhân được cập nhật  

---

### UC021: Đổi mật khẩu
**Actor:** Người dùng  
**Mô tả:** Người dùng thay đổi mật khẩu đăng nhập  
**Precondition:** Người dùng đã đăng nhập bằng Email/Mật khẩu  
**Main Flow:**  
1. Truy cập Hồ sơ (`profile.html`), tab "Đổi mật khẩu"
2. Nhập mật khẩu hiện tại, mật khẩu mới, xác nhận mật khẩu mới
3. Nhấn "Đổi mật khẩu"
4. Hệ thống xác thực mật khẩu cũ rồi cập nhật mật khẩu mới qua Firebase Authentication

**Postcondition:** Mật khẩu được thay đổi thành công  
**Exception:**  
- Mật khẩu hiện tại không đúng
- Mật khẩu mới quá yếu
- Mật khẩu xác nhận không khớp

---

### UC022: Xem lịch sử đơn hàng
**Actor:** Người dùng  
**Mô tả:** Người dùng xem danh sách các đơn hàng đã đặt  
**Precondition:** Người dùng đã đăng nhập  
**Main Flow:**  
1. Truy cập Hồ sơ (`profile.html`), tab "Lịch sử đơn hàng"
2. Hệ thống hiển thị danh sách đơn hàng từ Firebase, lọc theo trạng thái:
   - Tất cả, Chờ xác nhận (pending), Đã xác nhận (confirmed), Đang giao (shipping), Hoàn thành (completed), Đã hủy (cancelled)
3. Mỗi đơn hàng hiển thị: Mã đơn, Ngày đặt, Tổng tiền, Trạng thái, Phương thức thanh toán, Trạng thái thanh toán
4. Nhấn vào đơn hàng để xem chi tiết: Thông tin khách hàng, Danh sách sản phẩm, Tạm tính, Phí ship, Giảm giá, Tổng cộng
5. Nút "Đã nhận hàng" khi đơn ở trạng thái "Đang giao" → Chuyển sang "Hoàn thành"
6. Nút "Đặt lại" để thêm lại các sản phẩm vào giỏ hàng

**Postcondition:** Danh sách đơn hàng được hiển thị  

---

### UC023: Xem danh sách yêu thích (Wishlist)
**Actor:** Người dùng  
**Mô tả:** Người dùng xem và quản lý danh sách sản phẩm yêu thích  
**Precondition:** Người dùng đã đăng nhập  
**Main Flow:**  
1. Truy cập Hồ sơ (`profile.html`), tab "Yêu thích"
2. Hiển thị danh sách sản phẩm yêu thích dạng grid: Hình ảnh, Tên, Giá
3. Người dùng có thể:
   - Nhấn "Thêm vào giỏ" để thêm sản phẩm vào giỏ hàng
   - Nhấn "Xóa" để bỏ khỏi danh sách yêu thích

**Postcondition:** Danh sách yêu thích được hiển thị  

---

## 7. USE CASE QUẢN TRỊ HỆ THỐNG (ADMIN)

### UC024: Xem Dashboard thống kê
**Actor:** Quản trị viên  
**Mô tả:** Quản trị viên xem tổng quan thống kê kinh doanh  
**Precondition:** Quản trị viên đã đăng nhập, có quyền Admin  
**Main Flow:**  
1. Truy cập trang Admin (`admin.html`)
2. Hệ thống bảo vệ trang bằng `protectAdminRoute` – từ chối truy cập nếu không phải Admin
3. Dashboard hiển thị:
   - Tổng quan: Doanh thu tháng, Tổng doanh thu, Tổng đơn hàng, Số khách hàng, Số sản phẩm đang bán, Đơn chờ xử lý
   - Biểu đồ cột: Thống kê doanh thu 12 tháng gần nhất (Chart.js)
   - Biểu đồ tròn: Top 5 sản phẩm bán chạy nhất

**Postcondition:** Thông tin thống kê được hiển thị  
**Exception:** Không có quyền Admin → Từ chối truy cập, chuyển về Trang chủ

---

### UC025: Quản lý đơn hàng
**Actor:** Quản trị viên  
**Mô tả:** Quản trị viên quản lý các đơn hàng  
**Precondition:** Quản trị viên đã đăng nhập  
**Main Flow:**  
1. Truy cập mục "Quản lý đơn hàng" trong Admin
2. Hiển thị danh sách đơn hàng real-time từ Firebase
3. Quản trị viên có thể:
   - **Xem chi tiết:** Thông tin khách hàng, danh sách sản phẩm, tổng tiền, phương thức thanh toán
   - **Cập nhật trạng thái:** Xác nhận → Đang giao → Hoàn thành / Hủy
   - **Xóa đơn hàng:** Xác nhận xóa

**Postcondition:** Trạng thái đơn hàng được cập nhật  

---

### UC026: Quản lý sản phẩm
**Actor:** Quản trị viên  
**Mô tả:** Quản trị viên quản lý danh sách sản phẩm  
**Precondition:** Quản trị viên đã đăng nhập  
**Main Flow:**  
1. Truy cập mục "Quản lý sản phẩm" trong Admin
2. Hiển thị danh sách sản phẩm: Hình ảnh, Tên, Danh mục, Giá, Tồn kho, Trạng thái
3. Quản trị viên có thể:
   - **Thêm sản phẩm:** Nhập tên, danh mục, giá, mô tả, tồn kho, upload hình ảnh (qua Cloudinary API)
   - **Sửa sản phẩm:** Chỉnh sửa thông tin, giá, tồn kho, hình ảnh
   - **Xóa sản phẩm:** Xác nhận xóa
   - **Bật/Tắt trạng thái hiển thị:** `isAvailable`
   - **Import hàng loạt:** Thêm nhiều sản phẩm cùng lúc từ file JSON (`import-products.html`)

**Postcondition:** Sản phẩm được thêm/sửa/xóa thành công  

---

### UC027: Quản lý khách hàng
**Actor:** Quản trị viên  
**Mô tả:** Quản trị viên xem danh sách khách hàng  
**Precondition:** Quản trị viên đã đăng nhập  
**Main Flow:**  
1. Truy cập mục "Quản lý khách hàng" trong Admin
2. Hiển thị danh sách người dùng: Tên, Email, SĐT, Ngày đăng ký, Trạng thái hoạt động

**Postcondition:** Danh sách khách hàng được hiển thị  

---

### UC028: Quản lý đánh giá và liên hệ
**Actor:** Quản trị viên  
**Mô tả:** Quản trị viên quản lý đánh giá và liên hệ từ khách hàng  
**Precondition:** Quản trị viên đã đăng nhập  
**Main Flow:**  
1. Truy cập mục "Quản lý đánh giá và liên hệ" trong Admin
2. Hiển thị danh sách đánh giá: Tên người dùng, Số sao, Nội dung, Trạng thái (chờ duyệt/đã duyệt)
3. Quản trị viên có thể:
   - **Duyệt đánh giá:** Chuyển trạng thái từ `pending` → `approved` để hiển thị trên trang web
   - **Phản hồi đánh giá:** Nhập nội dung phản hồi, gửi cho khách hàng
   - **Xóa đánh giá**
   - **Xem và phản hồi liên hệ:** Xem danh sách liên hệ (góp ý, khiếu nại, hỏi đáp...), gửi phản hồi cho khách

**Postcondition:** Đánh giá/liên hệ được duyệt/phản hồi/xóa  

---

### UC029: Quản lý khuyến mãi
**Actor:** Quản trị viên  
**Mô tả:** Quản trị viên quản lý các mã khuyến mãi  
**Precondition:** Quản trị viên đã đăng nhập  
**Main Flow:**  
1. Truy cập mục "Quản lý khuyến mãi" trong Admin
2. Hiển thị danh sách mã khuyến mãi
3. Quản trị viên có thể:
   - **Tạo mã khuyến mãi:** Mã code, loại giảm (phần trăm/số tiền), giá trị giảm, ngày bắt đầu, ngày kết thúc, trạng thái hoạt động
   - **Sửa khuyến mãi**
   - **Xóa khuyến mãi**
   - **Bật/Tắt trạng thái hoạt động** (`isActive`)

**Postcondition:** Mã khuyến mãi được tạo/sửa/xóa  

---

### UC030: Quản lý tin tức
**Actor:** Quản trị viên  
**Mô tả:** Quản trị viên quản lý các bài viết tin tức/blog  
**Precondition:** Quản trị viên đã đăng nhập  
**Main Flow:**  
1. Truy cập mục "Quản lý tin tức" trong Admin
2. Hiển thị danh sách bài viết
3. Quản trị viên có thể:
   - **Tạo bài viết:** Tiêu đề, nội dung, hình ảnh đại diện
   - **Sửa bài viết**
   - **Xóa bài viết**

**Postcondition:** Bài viết tin tức được tạo/sửa/xóa  

---

### UC031: Quản lý đặt bàn
**Actor:** Quản trị viên  
**Mô tả:** Quản trị viên quản lý yêu cầu đặt bàn từ khách hàng  
**Precondition:** Quản trị viên đã đăng nhập  
**Main Flow:**  
1. Truy cập mục "Quản lý đặt bàn" trong Admin
2. Hiển thị danh sách yêu cầu đặt bàn: Tên khách, Ngày giờ, Loại bàn, Số người, Tiền cọc, Trạng thái
3. Quản trị viên có thể:
   - **Phê duyệt:** Chuyển trạng thái từ `pending` → `confirmed`
   - **Từ chối:** Chuyển trạng thái từ `pending` → `rejected`
   - **Kiểm tra tình trạng cọc**

**Postcondition:** Yêu cầu đặt bàn được phê duyệt/từ chối  

---

### UC032: Quản lý bàn
**Actor:** Quản trị viên  
**Mô tả:** Quản trị viên quản lý số lượng và trạng thái bàn  
**Precondition:** Quản trị viên đã đăng nhập  
**Main Flow:**  
1. Truy cập mục "Quản lý bàn" trong Admin
2. Quản lý: Loại bàn (2, 4, 6, 10 người), Số lượng bàn từng loại, Trạng thái bàn

**Postcondition:** Thông tin bàn được cập nhật  

---

### UC033: Xuất dữ liệu Excel
**Actor:** Quản trị viên  
**Mô tả:** Quản trị viên xuất báo cáo dữ liệu ra file Excel  
**Precondition:** Quản trị viên đã đăng nhập  
**Main Flow:**  
1. Trong trang Admin, chọn chức năng xuất Excel tại mục tương ứng
2. Hệ thống sử dụng thư viện SheetJS (xlsx.full.min.js) để tạo file Excel
3. Tải xuống báo cáo Excel cho: Đơn hàng, Khách hàng, Sản phẩm, Khuyến mãi, Thống kê tổng quan

**Postcondition:** File Excel được tải xuống  

---

### UC034: Nhận thông báo real-time
**Actor:** Quản trị viên  
**Mô tả:** Quản trị viên nhận thông báo khi có đơn hàng mới hoặc yêu cầu đặt bàn mới  
**Precondition:** Quản trị viên đang ở trang Admin  
**Main Flow:**  
1. Hệ thống lắng nghe sự kiện real-time từ Firebase Database
2. Khi có đơn hàng mới hoặc yêu cầu đặt bàn mới:
   - Hiển thị icon chuông thông báo với badge số lượng
   - Hiển thị popup thông báo chi tiết

**Postcondition:** Quản trị viên nhận được thông báo ngay lập tức  

---

## 8. USE CASE XEM THÔNG TIN

### UC035: Xem trang Khuyến mãi
**Actor:** Khách vãng lai, Người dùng  
**Mô tả:** Người dùng xem danh sách các chương trình khuyến mãi  
**Precondition:** Không yêu cầu đăng nhập  
**Main Flow:**  
1. Truy cập trang Khuyến mãi (`promotions.html`)
2. Hiển thị danh sách các mã khuyến mãi đang hoạt động (mã code, mô tả, thời hạn)

**Postcondition:** Danh sách khuyến mãi được hiển thị  

---

### UC036: Xem trang Tin tức
**Actor:** Khách vãng lai, Người dùng  
**Mô tả:** Người dùng xem danh sách bài viết tin tức/blog  
**Precondition:** Không yêu cầu đăng nhập  
**Main Flow:**  
1. Truy cập trang Tin tức (`news.html`)
2. Hiển thị danh sách bài viết: Tiêu đề, Hình ảnh, Tóm tắt, Ngày đăng
3. Nhấn vào bài viết để xem chi tiết (`news-detail.html`)

**Postcondition:** Danh sách tin tức được hiển thị  

---

### UC037: Xem trang Giới thiệu
**Actor:** Khách vãng lai, Người dùng  
**Mô tả:** Người dùng xem thông tin giới thiệu về Moonlight Cafe  
**Precondition:** Không yêu cầu đăng nhập  
**Main Flow:**  
1. Truy cập trang Về chúng tôi (`about.html`)
2. Hiển thị: Giá trị cốt lõi của quán, Không gian, Gallery ảnh

**Postcondition:** Thông tin giới thiệu được hiển thị  

---

### UC038: Xem trang Chính sách
**Actor:** Khách vãng lai, Người dùng  
**Mô tả:** Người dùng xem các chính sách và quy định  
**Precondition:** Không yêu cầu đăng nhập  
**Main Flow:**  
1. Truy cập trang Chính sách (`policy.html`)
2. Hiển thị: Điều khoản sử dụng, Chính sách bảo mật, Chính sách hoàn tiền

**Postcondition:** Thông tin chính sách được hiển thị  

---

### UC039: Sử dụng AI Chatbot
**Actor:** Khách vãng lai, Người dùng  
**Mô tả:** Người dùng tương tác với Chatbot AI để được hỗ trợ  
**Precondition:** Không yêu cầu đăng nhập  
**Main Flow:**  
1. Chatbot TuDongChat hiển thị trên tất cả các trang web
2. Người dùng nhấn vào widget chatbot
3. Nhập câu hỏi hoặc yêu cầu hỗ trợ
4. Chatbot AI trả lời tự động 24/7

**Postcondition:** Người dùng nhận được hỗ trợ từ Chatbot  

---

### UC040: Cấp quyền Admin
**Actor:** Quản trị viên  
**Mô tả:** Quản trị viên cấp quyền admin cho tài khoản  
**Precondition:** Có trang Setup Admin (`setup-admin.html`)  
**Main Flow:**  
1. Truy cập trang Setup Admin (`setup-admin.html`)
2. Nhập email cần cấp quyền
3. Hệ thống cập nhật role thành `admin` trong Firebase Database

**Postcondition:** Tài khoản được cấp quyền Admin  
