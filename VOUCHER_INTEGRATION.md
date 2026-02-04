# 🎟️ HỆ THỐNG QUẢN LÝ VOUCHER - HƯỚNG DẪN TÍCH HỢP

## 📋 Các File Mới Được Tạo

| File | Vị Trí | Mục Đích |
|------|--------|---------|
| `voucher-db.js` | `/admin/` | Core database & validation logic |
| `voucher-admin.js` | `/admin/` | Admin UI management |
| `voucher-style.css` | `/admin/` | Styling cho voucher module |
| `voucher-system.js` | `/project/` | Website integration |
| `voucher-demo.js` | `/project/` | Demo & testing |
| `VOUCHER_GUIDE.md` | `/project/` | Tài liệu chi tiết |

## 🚀 Quick Start

### 1. Thêm vào Admin Panel

**File:** `admin/index.html`

Đã được cập nhật với:
- ✅ Nav item "Voucher & Mã code"
- ✅ Tab content cho vouchers
- ✅ Modal tạo voucher
- ✅ Modal phát hành batch
- ✅ Stats dashboard

**Đã tự động:**
```html
<script src="voucher-db.js"></script>
<script src="voucher-admin.js"></script>
<script src="admin-script.js"></script>
```

### 2. Thêm vào Website (Giỏ hàng)

**Ví dụ HTML:**
```html
<!-- Trong trang giỏ hàng hoặc thanh toán -->
<div class="voucher-section">
    <h3>Có mã code?</h3>
    <div style="display: flex; gap: 10px;">
        <input type="text" id="voucherCodeInput" placeholder="Nhập mã code...">
        <button id="applyVoucherBtn" class="btn-primary">Áp dụng</button>
    </div>
</div>

<!-- Hiển thị voucher được áp dụng -->
<div id="appliedVoucherInfo"></div>

<!-- Trong tính toán giỏ hàng -->
<div class="cart-summary">
    <div class="summary-row">
        <span>Tạm tính:</span>
        <span id="cartSubtotal">0 VNĐ</span>
    </div>
    <div class="summary-row">
        <span>Giảm giá:</span>
        <span id="cartDiscount">0 VNĐ</span>
    </div>
    <div class="summary-row">
        <span>Phí vận chuyển:</span>
        <span id="cartShipping">0 VNĐ</span>
    </div>
    <div class="summary-row total">
        <span>Tổng cộng:</span>
        <span id="cartFinal">0 VNĐ</span>
    </div>
</div>
```

**Script Tags:**
```html
<script src="admin/voucher-db.js"></script>
<script src="voucher-system.js"></script>
<!-- Optional: Demo & Testing -->
<script src="voucher-demo.js"></script>
```

### 3. Kết nối với Checkout

**Khi hoàn tất đơn hàng:**
```javascript
async function completeOrder(orderData) {
    // Validate & update order with discount
    const hasVoucher = voucherSystem.currentVoucher !== null;
    
    if (hasVoucher) {
        await voucherSystem.completeCheckout(orderData);
    }
    
    // Proceed to payment
    // ...
}
```

---

## 🎯 Tính Năng Chính

### Admin Dashboard

**Đường dẫn:** `/admin/index.html`

**Chức năng:**
- 📊 View tất cả voucher
- 🔍 Tìm kiếm & lọc
- ➕ Tạo voucher mới
- ✏️ Cập nhật voucher
- 🗑️ Xóa voucher
- 📤 Phát hành batch cho khách hàng
- 📈 Analytics & ROI tracking

**Cách dùng:**
1. Vào `/admin/index.html`
2. Click tab "Voucher & Mã code"
3. Click "Tạo Mã Mới"
4. Điền thông tin:
   - Mã code (VD: WELCOME10)
   - Loại giảm giá
   - Giá trị
   - Thời hạn
   - Điều kiện
5. Click "Lưu Voucher"

### Website - Customer

**Chức năng:**
- ✅ Nhập & validate mã code
- 📉 Xem discount tức thời
- 💾 Lưu lịch sử sử dụng
- 📊 Xem ROI & analytics

**Cách dùng:**
1. Vào trang giỏ hàng
2. Nhập mã code vào input
3. Click "Áp dụng"
4. Xem discount tính toán
5. Hoàn tất đơn hàng

---

## 🔐 Validation 5 Bước

```
Khi customer nhập mã code:

Step 1: Kiểm tra format
  └─ Regex: /^[A-Z0-9]{3,20}$/

Step 2: Kiểm tra code tồn tại
  └─ Database lookup

Step 3: Kiểm tra thời hạn
  └─ startDate ≤ today ≤ endDate

Step 4: Kiểm tra giới hạn sử dụng
  └─ totalUsed < maxUsage
  └─ customerUsageCount < maxUsagePerCustomer

Step 5: Kiểm tra điều kiện áp dụng
  └─ cartTotal ≥ minOrder
  └─ products/categories match (if applicable)
```

---

## 📊 API Examples

### 1. Tạo Voucher

```javascript
voucherDB.addVoucher({
    code: "WELCOME10",           // Mã code
    type: "percent",              // 'percent' | 'fixed' | 'freeship'
    value: 10,                     // Giá trị
    description: "Welcome 10%",    // Mô tả
    minOrder: 500000,              // Đơn tối thiểu
    maxDiscount: 100000,           // Giảm tối đa (for percent only)
    startDate: "2024-01-01",       // Ngày bắt đầu
    endDate: "2024-12-31",         // Ngày kết thúc
    maxUsage: 100,                 // Max times (null = unlimited)
    maxUsagePerCustomer: 1         // Per customer limit
});
```

### 2. Validate Voucher

```javascript
const result = await voucherValidator.validate(
    "WELCOME10",    // Code từ user
    cartData,       // { items: [], total: number }
    "cust_001"      // Customer ID
);

if (result.isValid) {
    // Apply discount
    const discount = voucherSystem.calculateDiscount(cartData);
} else {
    // Show error
    alert(result.error);
}
```

### 3. Phát Hành Batch

```javascript
// Assign voucher to 10 customers
const voucherId = "voucher_123";
const customerIds = ["cust_001", "cust_002", ..., "cust_010"];

customerIds.forEach(customerId => {
    voucherDB.assignVoucherToCustomer(customerId, voucherId, 2);
});
```

### 4. Record Usage (At Checkout)

```javascript
voucherDB.recordUsage(
    voucherId,      // ID của voucher
    customerId,     // ID của khách
    5000000,        // Tổng đơn hàng
    500000,         // Số tiền giảm
    {               // Order details
        items: [
            { id: 1, name: "Vòng tay", price: 2500000 }
        ]
    }
);
```

### 5. Analytics

```javascript
// Tổng stats
const stats = voucherAnalytics.getStats();
// {
//     totalVouchers: 25,
//     activeVouchers: 15,
//     totalUsages: 342,
//     totalDiscountGiven: 45000000,
//     averageDiscount: 131500
// }

// Top vouchers
const top = voucherAnalytics.getTopVouchers(5);

// ROI of specific voucher
const roi = voucherAnalytics.getVoucherROI(voucherId);

// Usage trend (7 days)
const trend = voucherAnalytics.getUsageTrend(7);
```

---

## 📝 Database Schema

### Table 1: vouchers
```javascript
{
    id: string,                      // Unique ID
    code: string,                    // Mã code (VD: WELCOME10)
    type: string,                    // 'percent' | 'fixed' | 'freeship'
    value: number,                   // Giá trị
    prefix: string,                  // Prefix (VD: ADMIN)
    description: string,             // Mô tả
    minOrder: number,                // Đơn tối thiểu
    maxDiscount: number | null,      // Giảm tối đa
    applicableProducts: number[],    // Product IDs ([] = all)
    applicableCategories: string[],  // Categories ([] = all)
    startDate: string,               // "YYYY-MM-DD"
    endDate: string,                 // "YYYY-MM-DD"
    maxUsage: number | null,         // (null = unlimited)
    maxUsagePerCustomer: number,     // Per customer limit
    totalUsed: number,               // Times used so far
    totalRevenue: number,            // Revenue generated
    status: string,                  // 'active' | 'inactive' | 'expired'
    createdAt: string,               // ISO timestamp
    updatedAt: string                // ISO timestamp
}
```

### Table 2: voucher_usage
```javascript
{
    id: string,
    voucherId: string,
    customerId: string,
    orderTotal: number,
    discountAmount: number,
    appliedProducts: object[],
    usedAt: string,
    status: string                   // 'completed' | 'refunded' | 'invalid'
}
```

### Table 3: customer_vouchers
```javascript
{
    id: string,
    customerId: string,
    voucherId: string,
    quantity: number,
    used: number,
    assignedAt: string,
    updatedAt: string
}
```

---

## 🧪 Testing & Demo

### Tự động test:
```javascript
// Khởi tạo demo data
VoucherDemo.initDemoData();

// Run tất cả tests
VoucherDemo.runAllTests();

// Hoặc chạy từng test
VoucherDemo.testValidation();
VoucherDemo.testDiscount();
VoucherDemo.testDistribution();
VoucherDemo.testUsageTracking();
VoucherDemo.testAnalytics();
```

### Demo UI:
Thêm file `voucher-demo.js` vào trang sẽ hiển thị button panel ở góc phải dưới.

---

## ⚙️ Configuration

### Voucher Types

| Type | Value | Example |
|------|-------|---------|
| `percent` | 0-100 | 10% off |
| `fixed` | Amount (VNĐ) | 500K off |
| `freeship` | 0 | Free shipping |

### Status Values

| Status | Meaning |
|--------|---------|
| `active` | Đang hoạt động |
| `inactive` | Tạm dừng |
| `expired` | Hết hạn |

---

## 🔗 Integration Checklist

- [ ] Copy tất cả files vào project
- [ ] Thêm scripts vào `admin/index.html`
- [ ] Thêm scripts vào website pages
- [ ] Thêm HTML structure cho voucher input
- [ ] Thêm CSS styling nếu cần
- [ ] Test create voucher tại admin
- [ ] Test apply voucher tại website
- [ ] Test batch distribution
- [ ] Test analytics dashboard
- [ ] Deploy

---

## 🐛 Troubleshooting

### Issue: Scripts not loading
```
→ Check file paths in script tags
→ Ensure all files are in correct folders
→ Check browser console for errors
```

### Issue: Voucher not applying
```
→ Check validation steps in console
→ Verify cartData format
→ Check voucher status & dates
→ Check min order requirement
```

### Issue: Analytics not showing
```
→ Create sample usage data first
→ Call voucherAnalytics.getStats()
→ Check browser console for errors
```

---

## 📚 Resources

- **Full Documentation:** [VOUCHER_GUIDE.md](VOUCHER_GUIDE.md)
- **Code Examples:** [voucher-demo.js](voucher-demo.js)
- **Admin Panel:** [/admin/index.html](/admin/index.html)

---

## 🎓 Notes

**Current Implementation:**
- ✅ Uses localStorage (Demo/Testing)
- ✅ 100% client-side (No backend needed)
- ✅ Production-ready code structure

**For Production:**
- Replace localStorage with real database
- Add backend validation
- Implement user authentication
- Add rate limiting
- Encrypt sensitive data

---

## 📞 Support

Xem file `VOUCHER_GUIDE.md` để có tài liệu chi tiết hơn.

---

**Version:** 1.0  
**Status:** ✅ Complete & Ready to Use  
**Last Updated:** 2024-01-28
