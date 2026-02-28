/**
 * cart-helper.js
 * Quản lý giỏ hàng theo từng user (dùng UID làm key trong localStorage).
 * Khách vãng lai (chưa đăng nhập) luôn thấy giỏ hàng trống.
 */
import { auth } from './firebase-config.js';

/**
 * Lấy cart key theo UID. Trả về null nếu chưa đăng nhập.
 */
export function getCartKey() {
    const user = auth.currentUser;
    if (!user) return null;
    return `moonlight_cart_${user.uid}`;
}

/**
 * Lấy giỏ hàng của user hiện tại.
 * Trả về mảng rỗng nếu chưa đăng nhập hoặc chưa có dữ liệu.
 */
export function getCart() {
    const key = getCartKey();
    if (!key) return [];
    return JSON.parse(localStorage.getItem(key)) || [];
}

/**
 * Lưu giỏ hàng của user hiện tại.
 * Không làm gì nếu chưa đăng nhập.
 */
export function saveCart(cart) {
    const key = getCartKey();
    if (!key) return;
    localStorage.setItem(key, JSON.stringify(cart));
}

/**
 * Xóa giỏ hàng của user hiện tại.
 */
export function clearCart() {
    const key = getCartKey();
    if (!key) return;
    localStorage.removeItem(key);
}

/**
 * Cập nhật badge số lượng giỏ hàng trên nav.
 * Tự động đọc theo user hiện tại (0 nếu chưa đăng nhập).
 */
export function updateCartBadge() {
    const countEl = document.getElementById('cartCount');
    if (!countEl) return;
    const cart = getCart();
    const total = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
    countEl.textContent = total;
}
