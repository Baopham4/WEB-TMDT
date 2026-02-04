// ========================================== //
// VOUCHER SYSTEM - DEMO & TEST FILE
// ========================================== //

/**
 * Demo Data và Test Cases cho Voucher System
 * Dùng để kiểm tra & demo chức năng
 */

class VoucherDemo {
    static initDemoData() {
        // Xóa data cũ
        localStorage.removeItem('vouchers');
        localStorage.removeItem('voucher_usage');
        localStorage.removeItem('customer_vouchers');

        // Khởi tạo DB
        voucherDB.init();

        // Tạo voucher demo
        this.createDemoVouchers();
        console.log('✓ Demo data initialized');
    }

    static createDemoVouchers() {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const nextMonth = new Date(today);
        nextMonth.setMonth(nextMonth.getMonth() + 1);

        // 1. Voucher giảm %
        voucherDB.addVoucher({
            code: "WELCOME10",
            type: "percent",
            value: 10,
            description: "Giảm 10% cho khách mới",
            minOrder: 500000,
            maxDiscount: 100000,
            startDate: today.toISOString().split('T')[0],
            endDate: nextMonth.toISOString().split('T')[0],
            maxUsage: 100,
            maxUsagePerCustomer: 1,
            prefix: "ADMIN"
        });

        // 2. Voucher giảm số tiền
        voucherDB.addVoucher({
            code: "SAVE200K",
            type: "fixed",
            value: 200000,
            description: "Giảm thêm 200K",
            minOrder: 2000000,
            startDate: today.toISOString().split('T')[0],
            endDate: nextMonth.toISOString().split('T')[0],
            maxUsage: 50,
            maxUsagePerCustomer: 1,
            prefix: "ADMIN"
        });

        // 3. Voucher miễn phí ship
        voucherDB.addVoucher({
            code: "FREESHIP",
            type: "freeship",
            value: 0,
            description: "Miễn phí giao hàng",
            minOrder: 1000000,
            startDate: today.toISOString().split('T')[0],
            endDate: nextMonth.toISOString().split('T')[0],
            maxUsage: 200,
            maxUsagePerCustomer: 3,
            prefix: "ADMIN"
        });

        // 4. Voucher VIP - giảm cao
        voucherDB.addVoucher({
            code: "VIP2024",
            type: "percent",
            value: 25,
            description: "VIP Member - Giảm 25%",
            minOrder: 5000000,
            maxDiscount: 1000000,
            startDate: today.toISOString().split('T')[0],
            endDate: nextMonth.toISOString().split('T')[0],
            maxUsage: 20,
            maxUsagePerCustomer: 2,
            prefix: "ADMIN"
        });

        // 5. Voucher hết hạn (để test)
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        voucherDB.addVoucher({
            code: "EXPIRED",
            type: "percent",
            value: 15,
            description: "Voucher đã hết hạn",
            minOrder: 1000000,
            startDate: yesterday.toISOString().split('T')[0],
            endDate: yesterday.toISOString().split('T')[0],
            maxUsage: 10,
            maxUsagePerCustomer: 1,
            prefix: "ADMIN"
        });

        console.log('✓ Created 5 demo vouchers');
    }

    // ==================== TEST CASES ====================
    static testValidation() {
        console.log('\n=== TEST VALIDATION ===\n');

        const cartData = {
            items: [
                { id: 1, name: "Vòng tay", category: "Vòng tay", price: 2000000 },
                { id: 2, name: "Nhẫn", category: "Nhẫn", price: 3000000 }
            ],
            total: 5000000,
            shipping: 50000
        };

        // Test 1: Valid voucher
        this.testCase('Test 1: Valid voucher - WELCOME10', async () => {
            const result = await voucherValidator.validate('WELCOME10', cartData, 'cust_001');
            console.log('Result:', result);
            return result.isValid === true;
        });

        // Test 2: Non-existent code
        this.testCase('Test 2: Non-existent code', async () => {
            const result = await voucherValidator.validate('INVALID', cartData, 'cust_001');
            console.log('Error:', result.error);
            return result.isValid === false;
        });

        // Test 3: Expired voucher
        this.testCase('Test 3: Expired voucher', async () => {
            const result = await voucherValidator.validate('EXPIRED', cartData, 'cust_001');
            console.log('Error:', result.error);
            return result.isValid === false;
        });

        // Test 4: Min order not met
        this.testCase('Test 4: Min order not met - VIP2024', async () => {
            const smallCart = { ...cartData, total: 1000000 };
            const result = await voucherValidator.validate('VIP2024', smallCart, 'cust_001');
            console.log('Error:', result.error);
            return result.isValid === false;
        });

        // Test 5: Format invalid
        this.testCase('Test 5: Invalid format', async () => {
            const result = await voucherValidator.validate('aaa111@@@', cartData, 'cust_001');
            console.log('Error:', result.error);
            return result.isValid === false;
        });
    }

    static testDiscount() {
        console.log('\n=== TEST DISCOUNT CALCULATION ===\n');

        // Test 1: Percent discount
        this.testCase('Test 1: Percent discount', () => {
            const cart = { total: 1000000 };
            const voucher = { type: 'percent', value: 10, maxDiscount: null };
            const discount = this.calculateDiscount(cart, voucher);
            console.log(`Discount: ${discount} (expected: 100000)`);
            return discount === 100000;
        });

        // Test 2: Fixed discount
        this.testCase('Test 2: Fixed discount', () => {
            const cart = { total: 1000000 };
            const voucher = { type: 'fixed', value: 200000 };
            const discount = this.calculateDiscount(cart, voucher);
            console.log(`Discount: ${discount} (expected: 200000)`);
            return discount === 200000;
        });

        // Test 3: Percent with max discount
        this.testCase('Test 3: Percent with max discount', () => {
            const cart = { total: 10000000 };
            const voucher = { type: 'percent', value: 50, maxDiscount: 1000000 };
            const discount = this.calculateDiscount(cart, voucher);
            console.log(`Discount: ${discount} (expected: 1000000)`);
            return discount === 1000000;
        });
    }

    static testDistribution() {
        console.log('\n=== TEST BATCH DISTRIBUTION ===\n');

        // Assign voucher to multiple customers
        this.testCase('Test 1: Distribute to 5 customers', () => {
            const voucherId = voucherDB.getVouchers()[0].id;
            for (let i = 1; i <= 5; i++) {
                voucherDB.assignVoucherToCustomer(`cust_00${i}`, voucherId, 2);
            }
            
            const cv = JSON.parse(localStorage.getItem('customer_vouchers') || '[]');
            console.log(`Total customer vouchers: ${cv.length}`);
            return cv.length >= 5;
        });

        // Check customer vouchers
        this.testCase('Test 2: Get customer vouchers', () => {
            const cv = voucherDB.getCustomerVouchers('cust_001');
            console.log(`Vouchers for cust_001: ${cv.length}`);
            console.log('Details:', cv);
            return cv.length > 0;
        });
    }

    static testUsageTracking() {
        console.log('\n=== TEST USAGE TRACKING ===\n');

        // Record usage
        this.testCase('Test 1: Record voucher usage', () => {
            const voucherId = voucherDB.getVouchers()[0].id;
            voucherDB.recordUsage(voucherId, 'cust_001', 5000000, 500000, {
                items: [{ id: 1, name: "Vòng tay" }]
            });

            const usages = voucherDB.getUsageHistory(voucherId);
            console.log(`Total usages: ${usages.length}`);
            return usages.length > 0;
        });

        // Check usage history
        this.testCase('Test 2: Get usage history', () => {
            const usages = JSON.parse(localStorage.getItem('voucher_usage') || '[]');
            console.log(`Usage history:`, usages);
            return usages.length > 0;
        });
    }

    static testAnalytics() {
        console.log('\n=== TEST ANALYTICS ===\n');

        // Add sample data first
        this.addSampleUsageData();

        // Stats
        this.testCase('Test 1: Get stats', () => {
            const stats = voucherAnalytics.getStats();
            console.log('Stats:', stats);
            return stats.totalVouchers > 0;
        });

        // Top vouchers
        this.testCase('Test 2: Get top vouchers', () => {
            const top = voucherAnalytics.getTopVouchers(3);
            console.log('Top 3 vouchers:', top);
            return top.length > 0;
        });

        // ROI
        this.testCase('Test 3: Get voucher ROI', () => {
            const voucherId = voucherDB.getVouchers()[0].id;
            const roi = voucherAnalytics.getVoucherROI(voucherId);
            console.log('ROI:', roi);
            return roi !== null;
        });

        // Trend
        this.testCase('Test 4: Get usage trend', () => {
            const trend = voucherAnalytics.getUsageTrend(7);
            console.log('7-day trend:', trend);
            return Object.keys(trend).length > 0;
        });
    }

    // ==================== HELPER METHODS ====================
    static testCase(name, testFn) {
        try {
            const result = testFn();
            const status = result ? '✓ PASS' : '✗ FAIL';
            console.log(`${status}: ${name}`);
        } catch (error) {
            console.error(`✗ ERROR: ${name}`, error);
        }
    }

    static calculateDiscount(cart, voucher) {
        if (voucher.type === 'percent') {
            let discount = (cart.total * voucher.value) / 100;
            if (voucher.maxDiscount && discount > voucher.maxDiscount) {
                discount = voucher.maxDiscount;
            }
            return discount;
        } else if (voucher.type === 'fixed') {
            return voucher.value;
        }
        return 0;
    }

    static addSampleUsageData() {
        // Thêm sample usage data để test analytics
        const usages = JSON.parse(localStorage.getItem('voucher_usage') || '[]');
        const vouchers = voucherDB.getVouchers();

        if (usages.length === 0 && vouchers.length > 0) {
            for (let i = 0; i < 10; i++) {
                const voucher = vouchers[i % vouchers.length];
                voucherDB.recordUsage(
                    voucher.id,
                    `cust_${String(i).padStart(3, '0')}`,
                    5000000 + (i * 100000),
                    500000 + (i * 10000),
                    { items: [{ id: 1 }] }
                );
            }
        }
    }

    // ==================== DEMO UI ====================
    static createDemoUI() {
        const html = `
        <div style="position: fixed; bottom: 20px; right: 20px; z-index: 9999; 
                    background: white; border: 2px solid #c41e3a; border-radius: 8px; 
                    padding: 15px; box-shadow: 0 4px 12px rgba(0,0,0,0.2);">
            <h3 style="margin: 0 0 10px 0; color: #c41e3a;">🧪 VOUCHER DEMO</h3>
            <button onclick="VoucherDemo.initDemoData()" 
                    style="display: block; width: 100%; padding: 8px; margin: 5px 0;
                           background: #4caf50; color: white; border: none; border-radius: 4px; cursor: pointer;">
                Init Demo Data
            </button>
            <button onclick="VoucherDemo.testValidation()" 
                    style="display: block; width: 100%; padding: 8px; margin: 5px 0;
                           background: #2196f3; color: white; border: none; border-radius: 4px; cursor: pointer;">
                Test Validation
            </button>
            <button onclick="VoucherDemo.testDiscount()" 
                    style="display: block; width: 100%; padding: 8px; margin: 5px 0;
                           background: #ff9800; color: white; border: none; border-radius: 4px; cursor: pointer;">
                Test Discount
            </button>
            <button onclick="VoucherDemo.testDistribution()" 
                    style="display: block; width: 100%; padding: 8px; margin: 5px 0;
                           background: #9c27b0; color: white; border: none; border-radius: 4px; cursor: pointer;">
                Test Distribution
            </button>
            <button onclick="VoucherDemo.testUsageTracking()" 
                    style="display: block; width: 100%; padding: 8px; margin: 5px 0;
                           background: #f44336; color: white; border: none; border-radius: 4px; cursor: pointer;">
                Test Usage
            </button>
            <button onclick="VoucherDemo.testAnalytics()" 
                    style="display: block; width: 100%; padding: 8px; margin: 5px 0;
                           background: #00bcd4; color: white; border: none; border-radius: 4px; cursor: pointer;">
                Test Analytics
            </button>
            <button onclick="console.clear()" 
                    style="display: block; width: 100%; padding: 8px; margin: 5px 0;
                           background: #666; color: white; border: none; border-radius: 4px; cursor: pointer;">
                Clear Console
            </button>
        </div>
        `;

        document.body.insertAdjacentHTML('beforeend', html);
    }
}

// Auto-init demo UI khi load file này
document.addEventListener('DOMContentLoaded', function() {
    if (typeof voucherDB !== 'undefined') {
        VoucherDemo.createDemoUI();
        console.log('✓ Voucher Demo UI loaded. Click buttons to test!');
        console.log('Open console (F12) to see results');
    }
});

// Run all tests
VoucherDemo.runAllTests = () => {
    console.clear();
    console.log('╔════════════════════════════════════════╗');
    console.log('║   VOUCHER SYSTEM - COMPLETE TEST SUITE  ║');
    console.log('╚════════════════════════════════════════╝\n');
    
    VoucherDemo.initDemoData();
    VoucherDemo.testValidation();
    VoucherDemo.testDiscount();
    VoucherDemo.testDistribution();
    VoucherDemo.testUsageTracking();
    VoucherDemo.testAnalytics();
    
    console.log('\n╔════════════════════════════════════════╗');
    console.log('║         ALL TESTS COMPLETED!            ║');
    console.log('╚════════════════════════════════════════╝');
};
