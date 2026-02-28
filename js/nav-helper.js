/**
 * nav-helper.js
 * Dùng chung cho tất cả các trang để hiển thị dropdown tài khoản.
 */
import { auth, db, onAuthStateChanged, ref, get, query, orderByChild, equalTo } from './firebase-config.js';
import { getUserDropdownHTML, isAdmin, saveUserSession } from './auth-helper.js';
import { updateCartBadge } from './cart-helper.js';

/**
 * Cập nhật badge tin nhắn (phản hồi chưa đọc từ admin).
 */
export async function updateMsgBadge(uid) {
    const msgIcon = document.getElementById('msgIcon');
    const msgCount = document.getElementById('msgCount');
    if (!msgIcon) return;

    if (!uid) {
        msgIcon.classList.add('hidden');
        return;
    }

    try {
        // Lấy tất cả reviews của user này
        const reviewsRef = ref(db, 'reviews');
        const snap = await get(reviewsRef);
        if (!snap.exists()) { msgIcon.classList.add('hidden'); return; }

        let unread = 0;
        snap.forEach(child => {
            const r = child.val();
            if (r.uid === uid && r.adminReply && !r.userReadReply) {
                unread++;
            }
        });

        if (unread > 0) {
            msgIcon.classList.remove('hidden');
            if (msgCount) {
                msgCount.textContent = unread;
                msgCount.style.display = 'flex';
            }
        } else {
            msgIcon.classList.add('hidden');
        }
    } catch (e) {
        console.error('updateMsgBadge error:', e);
    }
}

/**
 * Khởi tạo user dropdown cho icon tài khoản trên nav.
 * Gọi sau khi DOM đã sẵn sàng.
 */
export async function loadStoreInfo() {
    try {
        const snap = await get(ref(db, 'siteSettings'));
        if (!snap.exists()) return;
        const s = snap.val();
        const setText = (id, val) => { const el = document.getElementById(id); if (el && val) el.textContent = val; };
        const setHref = (id, val) => { const el = document.getElementById(id); if (el && val) el.href = val; };
        setText('footer-slogan', s.slogan);
        setText('footer-address', s.address);
        setText('footer-phone', s.phone);
        setText('footer-email', s.email);
        setText('footer-hours', s.hours);
        setText('footer-copyright', s.copyright);
        setHref('footer-fb', s.facebook);
        setHref('footer-ig', s.instagram);
        setHref('footer-tt', s.tiktok);
        setHref('footer-yt', s.youtube);
    } catch(e) {}
}

export function initUserDropdown() {
    const userIcon = document.getElementById('userIcon');
    const userDropdown = document.getElementById('userDropdown');

    if (!userIcon || !userDropdown) return;

    loadStoreInfo();

    const userInfo = document.getElementById('userInfo');
    const dropdownMenu = userDropdown.querySelector('.user-dropdown-menu');

    // Toggle khi bấm icon
    userIcon.addEventListener('click', (e) => {
        e.preventDefault();
        userDropdown.classList.toggle('active');
    });

    // Đóng khi bấm bên ngoài
    document.addEventListener('click', (e) => {
        if (!userIcon.contains(e.target) && !userDropdown.contains(e.target)) {
            userDropdown.classList.remove('active');
        }
    });

    // Lắng nghe trạng thái đăng nhập
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            const userData = await saveUserSession(auth, db);

            // Cập nhật tên
            const displayName = userData && (userData.firstName || userData.lastName)
                ? `${userData.lastName || ''} ${userData.firstName || ''}`.trim()
                : user.email.split('@')[0];

            if (userInfo) {
                userInfo.innerHTML = `<i class="fas fa-user-circle"></i><span>${displayName}</span>`;
            }

            // Cập nhật menu items
            if (dropdownMenu) {
                dropdownMenu.innerHTML = getUserDropdownHTML(userData);
                // Gắn sự kiện logout
                const logoutBtn = dropdownMenu.querySelector('#logoutBtn');
                logoutBtn?.addEventListener('click', async (e) => {
                    e.preventDefault();
                    try {
                        const { signOut } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js');
                        await signOut(auth);
                        localStorage.removeItem('moonlight_user');
                        window.location.href = 'index.html';
                    } catch (err) {
                        console.error(err);
                    }
                });
            }
            // Cập nhật badge giỏ hàng và tin nhắn
            updateCartBadge();
            updateMsgBadge(user.uid);
        } else {
            if (userInfo) {
                userInfo.innerHTML = `<i class="fas fa-user-circle"></i><span>Tài khoản</span>`;
            }
            if (dropdownMenu) {
                dropdownMenu.innerHTML = getUserDropdownHTML(null);
            }
            // Khách vãng lai: ẩn badge tin nhắn
            updateCartBadge();
            updateMsgBadge(null);
        }
    });
}
/**
 * Tự động inject nút "Trở về" trên mọi trang.
 * Nút hiện khi có lịch sử điều hướng (history.length > 1 hoặc có referrer).
 */
export function initBackButton() {
    // Không hiện trên trang chủ
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    if (currentPage === 'index.html' || currentPage === '') return;

    // Tạo nút
    const btn = document.createElement('button');
    btn.id = 'back-btn';
    btn.setAttribute('aria-label', 'Trở về trang trước');
    btn.innerHTML = '<i class="fas fa-arrow-left"></i>';
    document.body.appendChild(btn);

    // Hiển thị nếu có trang trước
    const hasHistory = window.history.length > 1 || !!document.referrer;
    if (hasHistory) {
        // Delay nhỏ để transition hoạt động
        requestAnimationFrame(() => {
            requestAnimationFrame(() => btn.classList.add('visible'));
        });
    }

    btn.addEventListener('click', () => {
        if (window.history.length > 1) {
            window.history.back();
        } else {
            window.location.href = 'index.html';
        }
    });
}

// Tự động khởi tạo nút trở về khi module được load
(function () {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initBackButton);
    } else {
        initBackButton();
    }
})();