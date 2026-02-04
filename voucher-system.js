// ========================================== //
// VOUCHER SYSTEM - WEBSITE INTEGRATION
// ========================================== //

class VoucherSystem {
    constructor() {
        this.currentVoucher = null;
        this.discount = 0;
        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Apply voucher button
        const applyBtn = document.getElementById('applyVoucherBtn');
        const input = document.getElementById('voucherCodeInput');

        if (applyBtn) applyBtn.addEventListener('click', () => this.applyVoucher());
        if (input) input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.applyVoucher();
        });
    }

    // ==================== APPLY VOUCHER ====================
    async applyVoucher() {
        const codeInput = document.getElementById('voucherCodeInput');
        const code = codeInput.value.trim().toUpperCase();

        if (!code) {
            this.showError('Vui lòng nhập mã code');
            return;
        }

        // Get cart data
        const cartData = this.getCartData();
        if (!cartData || cartData.items.length === 0) {
            this.showError('Giỏ hàng trống');
            return;
        }

        // Validate voucher (5-step verification)
        const customerId = this.getCurrentCustomerId(); // Should be saved in session/localStorage
        const validation = await voucherValidator.validate(code, cartData, customerId);

        if (!validation.isValid) {
            this.showError(validation.error);
            return;
        }

        // Apply voucher
        this.currentVoucher = validation.steps.step2.voucher;
        this.calculateDiscount(cartData);
        this.displayVoucherInfo();
        this.updateCartTotal();
        this.showSuccess('Áp dụng mã code thành công!');
    }

    // ==================== CALCULATE DISCOUNT ====================
    calculateDiscount(cartData) {
        if (!this.currentVoucher) return 0;

        let discount = 0;

        if (this.currentVoucher.type === 'percent') {
            discount = (cartData.total * this.currentVoucher.value) / 100;
            
            // Check max discount
            if (this.currentVoucher.maxDiscount && discount > this.currentVoucher.maxDiscount) {
                discount = this.currentVoucher.maxDiscount;
            }
        } else if (this.currentVoucher.type === 'fixed') {
            discount = this.currentVoucher.value;
        } else if (this.currentVoucher.type === 'freeship') {
            // Ship cost stored somewhere in cart
            const shipCost = cartData.shipping || 0;
            discount = shipCost;
        }

        this.discount = discount;
        return discount;
    }

    // ==================== DISPLAY VOUCHER ====================
    displayVoucherInfo() {
        const container = document.getElementById('appliedVoucherInfo');
        if (!container) return;

        let discountText = '';
        if (this.currentVoucher.type === 'percent') {
            discountText = `Giảm ${this.currentVoucher.value}%`;
        } else if (this.currentVoucher.type === 'fixed') {
            discountText = `Giảm ${this.currentVoucher.value.toLocaleString()} VNĐ`;
        } else if (this.currentVoucher.type === 'freeship') {
            discountText = 'Miễn phí giao hàng';
        }

        container.innerHTML = `
            <div class="applied-voucher-info">
                <div class="voucher-applied-success">
                    <i class="fas fa-check-circle"></i>
                    <div>
                        <strong>Mã: ${this.currentVoucher.code}</strong>
                        <p>${this.currentVoucher.description || discountText}</p>
                    </div>
                    <button class="btn-remove-voucher" onclick="voucherSystem.removeVoucher()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
        `;
    }

    removeVoucher() {
        this.currentVoucher = null;
        this.discount = 0;
        const container = document.getElementById('appliedVoucherInfo');
        if (container) container.innerHTML = '';
        const input = document.getElementById('voucherCodeInput');
        if (input) input.value = '';
        this.updateCartTotal();
    }

    // ==================== UPDATE CART ====================
    updateCartTotal() {
        // Use cart page's element IDs
        const cartSubtotal = document.getElementById('subtotal');
        const cartDiscount = document.getElementById('discount');
        const cartShipping = document.getElementById('shippingFee');
        const cartFinal = document.getElementById('totalAmount');

        if (!cartSubtotal) return;

        // Get current values
        const subtotal = this.parsePrice(cartSubtotal.textContent);
        const shipping = cartShipping ? this.parsePrice(cartShipping.textContent) : 0;

        const total = subtotal + shipping - this.discount;

        // Update display
        if (cartDiscount) {
            cartDiscount.textContent = '-' + this.formatPrice(this.discount) + ' VNĐ';
        }
        if (cartFinal) {
            cartFinal.textContent = this.formatPrice(Math.max(0, total)) + ' VNĐ';
        }

        // Update cart page if it exists
        if (typeof cartPage !== 'undefined' && cartPage.updateCartSummary) {
            cartPage.appliedVoucher = this.currentVoucher ? {
                code: this.currentVoucher.code,
                type: this.currentVoucher.type,
                value: this.currentVoucher.value,
                description: this.currentVoucher.description,
                discount: this.discount
            } : null;
        }
    }

    // ==================== CHECKOUT & LOG USAGE ====================
    async completeCheckout(orderData) {
        if (!this.currentVoucher) return true;

        try {
            // Record voucher usage
            const customerId = this.getCurrentCustomerId();
            voucherDB.recordUsage(
                this.currentVoucher.id,
                customerId,
                orderData.total,
                this.discount,
                orderData
            );

            // Update customer voucher count
            voucherDB.useVoucher(customerId, this.currentVoucher.id);

            // Log to console for tracking
            console.log('Voucher used:', {
                code: this.currentVoucher.code,
                customerId: customerId,
                discount: this.discount,
                orderTotal: orderData.total
            });

            return true;
        } catch (error) {
            console.error('Error recording voucher usage:', error);
            return false;
        }
    }

    // ==================== HELPER METHODS ====================
    getCartData() {
        // This depends on your cart implementation
        // Should return: { items: [], total: 0, shipping: 0 }

        // Use cartPage if available (from gio-hang.html)
        if (typeof cartPage !== 'undefined' && cartPage.getCartDataForValidation) {
            return cartPage.getCartDataForValidation();
        }

        // Example: Get from cart module if exists
        if (typeof cart !== 'undefined' && cart.getCartData) {
            return cart.getCartData();
        }

        // Fallback: Try to get from DOM
        const cartItems = document.querySelectorAll('.cart-item');
        const items = [];
        let total = 0;

        cartItems.forEach(item => {
            const price = this.parsePrice(item.querySelector('.item-price')?.textContent || '0');
            const quantity = parseInt(item.querySelector('.item-quantity')?.value || 1);
            total += price * quantity;
            items.push({
                id: item.dataset.productId,
                category: item.dataset.category,
                price: price,
                quantity: quantity
            });
        });

        return {
            items: items,
            total: total,
            shipping: this.parsePrice(document.getElementById('shippingFee')?.textContent || '0')
        };
    }

    getCurrentCustomerId() {
        // Get from session/localStorage
        return localStorage.getItem('customerId') || 'guest_' + Date.now();
    }

    parsePrice(text) {
        if (!text) return 0;
        return parseInt(text.replace(/[^\d]/g, '')) || 0;
    }

    formatPrice(amount) {
        return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 6px;
            z-index: 9999;
            animation: slideInRight 0.3s ease;
        `;

        if (type === 'error') {
            notification.style.background = '#f44336';
            notification.style.color = 'white';
        } else if (type === 'success') {
            notification.style.background = '#4caf50';
            notification.style.color = 'white';
        }

        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }
}

// Initialize on page load
let voucherSystem;
document.addEventListener('DOMContentLoaded', function() {
    voucherSystem = new VoucherSystem();
});
