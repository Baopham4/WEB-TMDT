// ========================================== //
// VOUCHER DATABASE & CORE SYSTEM
// ========================================== //

class VoucherDatabase {
    constructor() {
        this.init();
    }

    init() {
        // Initialize tables nếu chưa có
        if (!localStorage.getItem('vouchers')) {
            localStorage.setItem('vouchers', JSON.stringify([]));
        }
        if (!localStorage.getItem('voucher_usage')) {
            localStorage.setItem('voucher_usage', JSON.stringify([]));
        }
        if (!localStorage.getItem('customer_vouchers')) {
            localStorage.setItem('customer_vouchers', JSON.stringify([]));
        }
    }

    // ==================== BẢNG: VOUCHERS ====================
    // Thêm voucher mới
    addVoucher(voucherData) {
        const vouchers = this.getVouchers();
        const newVoucher = {
            id: Date.now().toString(),
            code: voucherData.code,
            type: voucherData.type, // 'percent' | 'fixed' | 'freeship'
            value: voucherData.value,
            prefix: voucherData.prefix || 'ADMIN',
            description: voucherData.description,
            minOrder: voucherData.minOrder || 0,
            maxDiscount: voucherData.maxDiscount || null,
            applicableProducts: voucherData.applicableProducts || [], // [] = tất cả
            applicableCategories: voucherData.applicableCategories || [],
            startDate: voucherData.startDate,
            endDate: voucherData.endDate,
            maxUsage: voucherData.maxUsage || null, // null = vô hạn
            maxUsagePerCustomer: voucherData.maxUsagePerCustomer || 1,
            totalUsed: 0,
            totalRevenue: 0,
            status: 'active', // 'active' | 'inactive' | 'expired'
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            createdBy: voucherData.createdBy || 'Admin'
        };
        vouchers.push(newVoucher);
        localStorage.setItem('vouchers', JSON.stringify(vouchers));
        return newVoucher;
    }

    getVouchers(filter = {}) {
        const vouchers = JSON.parse(localStorage.getItem('vouchers') || '[]');
        if (filter.status) {
            return vouchers.filter(v => v.status === filter.status);
        }
        if (filter.code) {
            return vouchers.filter(v => v.code === filter.code);
        }
        return vouchers;
    }

    updateVoucher(voucherId, updates) {
        const vouchers = this.getVouchers();
        const index = vouchers.findIndex(v => v.id === voucherId);
        if (index !== -1) {
            vouchers[index] = {
                ...vouchers[index],
                ...updates,
                updatedAt: new Date().toISOString()
            };
            localStorage.setItem('vouchers', JSON.stringify(vouchers));
            return vouchers[index];
        }
        return null;
    }

    deleteVoucher(voucherId) {
        let vouchers = this.getVouchers();
        vouchers = vouchers.filter(v => v.id !== voucherId);
        localStorage.setItem('vouchers', JSON.stringify(vouchers));
        return true;
    }

    // ==================== BẢNG: VOUCHER_USAGE ====================
    // Lưu lịch sử sử dụng voucher
    recordUsage(voucherId, customerId, orderTotal, discount, orderDetails) {
        const usage = {
            id: Date.now().toString(),
            voucherId: voucherId,
            customerId: customerId,
            orderTotal: orderTotal,
            discountAmount: discount,
            appliedProducts: orderDetails.items || [],
            usedAt: new Date().toISOString(),
            status: 'completed' // 'completed' | 'refunded' | 'invalid'
        };
        const usages = JSON.parse(localStorage.getItem('voucher_usage') || '[]');
        usages.push(usage);
        localStorage.setItem('voucher_usage', JSON.stringify(usages));
        
        // Update voucher stats
        const voucher = this.getVouchers({ code: voucherId })[0];
        if (voucher) {
            this.updateVoucher(voucherId, {
                totalUsed: (voucher.totalUsed || 0) + 1,
                totalRevenue: (voucher.totalRevenue || 0) + orderTotal
            });
        }
        return usage;
    }

    getUsageHistory(voucherId = null, customerId = null) {
        const usages = JSON.parse(localStorage.getItem('voucher_usage') || '[]');
        let results = usages;
        if (voucherId) results = results.filter(u => u.voucherId === voucherId);
        if (customerId) results = results.filter(u => u.customerId === customerId);
        return results;
    }

    // ==================== BẢNG: CUSTOMER_VOUCHERS ====================
    // Quản lý voucher của từng khách hàng
    assignVoucherToCustomer(customerId, voucherId, quantity = 1) {
        const customerVouchers = JSON.parse(localStorage.getItem('customer_vouchers') || '[]');
        
        const existing = customerVouchers.find(
            cv => cv.customerId === customerId && cv.voucherId === voucherId
        );

        if (existing) {
            existing.quantity += quantity;
            existing.updatedAt = new Date().toISOString();
        } else {
            customerVouchers.push({
                id: Date.now().toString(),
                customerId: customerId,
                voucherId: voucherId,
                quantity: quantity,
                used: 0,
                assignedAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            });
        }
        localStorage.setItem('customer_vouchers', JSON.stringify(customerVouchers));
    }

    getCustomerVouchers(customerId) {
        const customerVouchers = JSON.parse(localStorage.getItem('customer_vouchers') || '[]');
        return customerVouchers.filter(cv => cv.customerId === customerId);
    }

    useVoucher(customerId, voucherId) {
        const customerVouchers = JSON.parse(localStorage.getItem('customer_vouchers') || '[]');
        const cv = customerVouchers.find(
            cv => cv.customerId === customerId && cv.voucherId === voucherId
        );
        if (cv && cv.used < cv.quantity) {
            cv.used += 1;
            localStorage.setItem('customer_vouchers', JSON.stringify(customerVouchers));
            return true;
        }
        return false;
    }
}

// ==================== VALIDATION ENGINE ====================
class VoucherValidator {
    constructor(db) {
        this.db = db;
    }

    // 5-step verification process
    async validate(code, cartData, customerId) {
        const steps = {
            step1: this.checkCodeFormat(code),
            step2: this.checkVoucherExists(code),
            step3: this.checkExpiration(code),
            step4: this.checkUsageLimit(code, customerId),
            step5: this.checkApplicability(code, cartData)
        };

        return {
            isValid: Object.values(steps).every(s => s.valid),
            steps: steps,
            error: Object.values(steps).find(s => !s.valid)?.error || null
        };
    }

    // Step 1: Kiểm tra format code
    checkCodeFormat(code) {
        const regex = /^[A-Z0-9]{3,20}$/;
        return {
            valid: regex.test(code.toUpperCase()),
            error: code.match(regex) ? null : 'Mã code không hợp lệ'
        };
    }

    // Step 2: Kiểm tra code có tồn tại
    checkVoucherExists(code) {
        const voucher = this.db.getVouchers({ code: code.toUpperCase() })[0];
        return {
            valid: !!voucher,
            voucher: voucher,
            error: voucher ? null : 'Mã code không tồn tại'
        };
    }

    // Step 3: Kiểm tra thời hạn
    checkExpiration(code) {
        const voucher = this.db.getVouchers({ code: code.toUpperCase() })[0];
        if (!voucher) return { valid: false, error: 'Voucher không tồn tại' };

        const now = new Date();
        const start = new Date(voucher.startDate);
        const end = new Date(voucher.endDate);

        const isValid = now >= start && now <= end && voucher.status === 'active';
        return {
            valid: isValid,
            error: isValid ? null : 'Mã code đã hết hạn hoặc không hoạt động'
        };
    }

    // Step 4: Kiểm tra giới hạn sử dụng
    checkUsageLimit(code, customerId) {
        const voucher = this.db.getVouchers({ code: code.toUpperCase() })[0];
        if (!voucher) return { valid: false, error: 'Voucher không tồn tại' };

        // Kiểm tra tổng số lần dùng
        if (voucher.maxUsage && voucher.totalUsed >= voucher.maxUsage) {
            return { valid: false, error: 'Mã code đã hết số lần sử dụng' };
        }

        // Kiểm tra số lần dùng per customer
        const usage = this.db.getUsageHistory().filter(
            u => u.customerId === customerId && u.voucherId === voucher.id
        );
        if (usage.length >= voucher.maxUsagePerCustomer) {
            return { 
                valid: false, 
                error: `Bạn đã dùng mã code này ${voucher.maxUsagePerCustomer} lần` 
            };
        }

        return { valid: true, error: null };
    }

    // Step 5: Kiểm tra tính áp dụng (sản phẩm, danh mục, đơn tối thiểu)
    checkApplicability(code, cartData) {
        const voucher = this.db.getVouchers({ code: code.toUpperCase() })[0];
        if (!voucher) return { valid: false, error: 'Voucher không tồn tại' };

        // Kiểm tra đơn tối thiểu
        if (cartData.total < voucher.minOrder) {
            return {
                valid: false,
                error: `Mua thêm ${(voucher.minOrder - cartData.total).toLocaleString()} để dùng code này`
            };
        }

        // Kiểm tra sản phẩm áp dụng
        if (voucher.applicableProducts.length > 0) {
            const applicableIds = voucher.applicableProducts.map(id => String(id));
            const hasApplicableProduct = cartData.items.some(
                item => applicableIds.includes(String(item.id))
            );
            if (!hasApplicableProduct) {
                return { valid: false, error: 'Mã code không áp dụng cho sản phẩm này' };
            }
        }

        // Kiểm tra danh mục áp dụng
        if (voucher.applicableCategories.length > 0) {
            const hasApplicableCategory = cartData.items.some(
                item => voucher.applicableCategories.includes(item.category)
            );
            if (!hasApplicableCategory) {
                return { valid: false, error: 'Mã code không áp dụng cho danh mục này' };
            }
        }

        return { valid: true, error: null };
    }
}

// ==================== ANALYTICS ====================
class VoucherAnalytics {
    constructor(db) {
        this.db = db;
    }

    getStats() {
        const vouchers = this.db.getVouchers();
        const usages = JSON.parse(localStorage.getItem('voucher_usage') || '[]');

        return {
            totalVouchers: vouchers.length,
            activeVouchers: vouchers.filter(v => v.status === 'active').length,
            totalUsages: usages.length,
            totalDiscountGiven: usages.reduce((sum, u) => sum + u.discountAmount, 0),
            averageDiscount: usages.length > 0 
                ? usages.reduce((sum, u) => sum + u.discountAmount, 0) / usages.length 
                : 0
        };
    }

    getVoucherROI(voucherId) {
        const voucher = this.db.getVouchers().find(v => v.id === voucherId);
        if (!voucher) return null;

        const usages = this.db.getUsageHistory(voucherId);
        const totalDiscount = usages.reduce((sum, u) => sum + u.discountAmount, 0);
        const totalRevenue = voucher.totalRevenue || 0;

        return {
            voucherId: voucherId,
            code: voucher.code,
            timesUsed: voucher.totalUsed,
            totalDiscount: totalDiscount,
            totalRevenue: totalRevenue,
            roi: totalRevenue > 0 ? ((totalRevenue - totalDiscount) / totalRevenue * 100).toFixed(2) : 0,
            avgOrderValue: usages.length > 0 ? totalRevenue / usages.length : 0
        };
    }

    getTopVouchers(limit = 5) {
        const vouchers = this.db.getVouchers();
        return vouchers
            .sort((a, b) => (b.totalUsed || 0) - (a.totalUsed || 0))
            .slice(0, limit)
            .map(v => ({
                code: v.code,
                used: v.totalUsed || 0,
                revenue: v.totalRevenue || 0
            }));
    }

    getUsageTrend(days = 7) {
        const usages = JSON.parse(localStorage.getItem('voucher_usage') || '[]');
        const now = new Date();
        const trend = {};

        for (let i = 0; i < days; i++) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            trend[dateStr] = 0;
        }

        usages.forEach(usage => {
            const dateStr = usage.usedAt.split('T')[0];
            if (trend.hasOwnProperty(dateStr)) {
                trend[dateStr]++;
            }
        });

        return trend;
    }
}

// Khởi tạo instances
const voucherDB = new VoucherDatabase();
const voucherValidator = new VoucherValidator(voucherDB);
const voucherAnalytics = new VoucherAnalytics(voucherDB);
