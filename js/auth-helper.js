/**
 * 🔐 Auth Helper - Hệ thống phân quyền cho Moonlight Cafe
 */

// Cấu hình email admin - Tập trung tại đây để dễ quản lý
export const ADMIN_EMAILS = [
    'admin@moonlightcafe.vn',
    'huynhnhu6604@gmail.com',
    'elisa6604@gmail.com'  // Admin account
];

// Lấy thông tin user từ localStorage
export function getCurrentUser() {
    const userData = localStorage.getItem('moonlight_user');
    return userData ? JSON.parse(userData) : null;
}

// Kiểm tra user có phải là admin không
export function isAdmin(userData = null) {
    const user = userData || getCurrentUser();
    if (!user) return false;

    // Kiểm tra role
    if (user.role === 'admin') return true;

    // Kiểm tra email admin (backup)
    if (user.email && ADMIN_EMAILS.includes(user.email)) return true;

    return false;
}

// Lưu thông tin user sau khi đăng nhập
export async function saveUserSession(auth, db) {
    const { onAuthStateChanged, ref, get } = await import('./firebase-config.js');

    return new Promise((resolve) => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                const userRef = ref(db, 'users/' + user.uid);
                const snapshot = await get(userRef);

                let userData = {
                    uid: user.uid,
                    email: user.email,
                    role: 'customer'
                };

                if (snapshot.exists()) {
                    userData = { ...userData, ...snapshot.val() };
                }

                localStorage.setItem('moonlight_user', JSON.stringify(userData));
                resolve(userData);
            } else {
                localStorage.removeItem('moonlight_user');
                resolve(null);
            }
        });
    });
}

// Bảo vệ trang admin - chỉ admin mới truy cập được
export async function protectAdminRoute(auth, db, redirectUrl = 'index.html') {
    const { onAuthStateChanged, ref, get } = await import('./firebase-config.js');

    return new Promise((resolve) => {
        onAuthStateChanged(auth, async (user) => {
            if (!user) {
                window.location.href = 'login.html?redirect=' + encodeURIComponent(window.location.href);
                resolve(false);
                return;
            }

            const userRef = ref(db, 'users/' + user.uid);
            const snapshot = await get(userRef);

            let userData = {
                uid: user.uid,
                email: user.email,
                role: 'customer'
            };

            if (snapshot.exists()) {
                userData = { ...userData, ...snapshot.val() };
            }

            localStorage.setItem('moonlight_user', JSON.stringify(userData));

            if (!isAdmin(userData)) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Truy cập bị từ chối!',
                    text: 'Bạn không có quyền truy cập trang quản trị',
                    timer: 2000,
                    showConfirmButton: false
                }).then(() => {
                    window.location.href = redirectUrl;
                });
                resolve(false);
                return;
            }

            resolve(true);
        });
    })
}

// Bảo vệ trang yêu cầu đăng nhập - chuyển về login nếu chưa đăng nhập
export async function requireAuth(auth, redirectUrl = 'login.html') {
    return new Promise((resolve) => {
        import('./firebase-config.js').then(({ onAuthStateChanged }) => {

            onAuthStateChanged(auth, (user) => {
                if (!user) {
                    // Lưu URL hiện tại để redirect sau khi login
                    const currentPath = window.location.pathname.split('/').pop();
                    window.location.href = redirectUrl + '?redirect=' + encodeURIComponent(currentPath);
                    resolve(false);
                    return;
                }
                resolve(true);
            });
        });
    });
}

// Tạo menu dropdown user với phân quyền
export function getUserDropdownHTML(userData) {
    if (!userData) {
        return `
            <a href="login.html" class="dropdown-item">
                <i class="fas fa-sign-in-alt"></i> Đăng nhập
            </a>
            <a href="register.html" class="dropdown-item">
                <i class="fas fa-user-plus"></i> Đăng ký
            </a>
        `;
    }

    let menuItems = `
        <a href="profile.html" class="dropdown-item">
            <i class="fas fa-user"></i> Hồ sơ của tôi
        </a>
        <a href="profile.html?tab=orders" class="dropdown-item">
            <i class="fas fa-box"></i> Đơn hàng của tôi
        </a>
        <a href="wishlist.html" class="dropdown-item">
            <i class="fas fa-heart"></i> Yêu thích
        </a>
    `;

    if (isAdmin(userData)) {
        menuItems += `
            <a href="admin.html" class="dropdown-item">
                <i class="fas fa-cog"></i> Quản trị
            </a>
        `;
    }

    menuItems += `
        <a href="#" class="dropdown-item" id="logoutBtn">
            <i class="fas fa-sign-out-alt"></i> Đăng xuất
        </a>
    `;

    return menuItems;
}
