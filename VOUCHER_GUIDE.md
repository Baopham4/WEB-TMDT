# 📌 HỆ THỐNG QUẢN LÝ VOUCHER & MÃ CODE

## 🎯 Tổng Quan

Hệ thống voucher hoàn chỉnh với 3 module chính:
1. **Tạo & Phân phối** - Dashboard quản lý, tạo voucher tự động/thủ công
2. **Validation** - API kiểm tra + 5 bước verify
3. **Tracking & Analytics** - Real-time tracking + ROI analysis

---

## 📦 CẤU TRÚC DATABASE

### 🔹 Bảng 1: `vouchers`
Lưu trữ thông tin voucher chính

```javascript
{
    id: "1234567890",                    // Unique ID
    code: "VIP2024",                     // Mã code
    type: "percent",                     // 'percent' | 'fixed' | 'freeship'
    value: 10,                           // Giá trị giảm
    prefix: "ADMIN",                     // Prefix mã
    description: "Giảm 10% cho khách mới", // Mô tả
    minOrder: 1000000,                   // Đơn tối thiểu (VNĐ)
    maxDiscount: 500000,                 // Giảm tối đa
    applicableProducts: [],              // [] = tất cả sản phẩm
    applicableCategories: [],            // [] = tất cả danh mục
    startDate: "2024-01-01",             // Ngày bắt đầu
    endDate: "2024-12-31",               // Ngày kết thúc
    maxUsage: 100,                       // Tổng lần dùng (null = vô hạn)
    maxUsagePerCustomer: 1,              // Per khách hàng
    totalUsed: 42,                       // Đã dùng
    totalRevenue: 50000000,              // Doanh thu từ voucher
    status: "active",                    // 'active' | 'inactive' | 'expired'
    createdAt: "2024-01-01T10:00:00",
    updatedAt: "2024-01-15T15:30:00",
    createdBy: "Admin"
}
```

### 🔹 Bảng 2: `voucher_usage`
Lưu lịch sử sử dụng voucher

```javascript
{
    id: "usage_001",
    voucherId: "1234567890",
    customerId: "cust_001",
    orderTotal: 5000000,                 // Tổng đơn hàng
    discountAmount: 500000,              // Số tiền giảm
    appliedProducts: [                   // Sản phẩm áp dụng
        { id: 1, name: "Vòng tay", price: 2500000 }
    ],
    usedAt: "2024-01-15T14:30:00",
    status: "completed"                  // 'completed' | 'refunded' | 'invalid'
}
```

### 🔹 Bảng 3: `customer_vouchers`
Quản lý voucher của từng khách hàng

```javascript
{
    id: "cv_001",
    customerId: "cust_001",
    voucherId: "1234567890",
    quantity: 3,                         // Số voucher được cấp
    used: 1,                             // Đã dùng
    assignedAt: "2024-01-01T10:00:00",
    updatedAt: "2024-01-15T15:30:00"
}
```

---

## 🎛️ 3 MODULE CHÍNH

### 1️⃣ MODULE: Tạo & Phân phối

**Dashboard Admin:**
- Tạo voucher mới với các tùy chọn:
  - Loại giảm giá: % / Số tiền / Miễn phí ship
  - Điều kiện: Đơn tối thiểu, Sản phẩm/Danh mục áp dụng
  - Thời hạn: Từ ngày - Đến ngày
  - Giới hạn: Số lần dùng, Per khách hàng

**Phát hành Batch:**
```
Setup → Generate → Store → Distribute
```

**Code:**
```javascript
// Tạo voucher
voucherDB.addVoucher({
    code: "VIP2024",
    type: "percent",
    value: 10,
    minOrder: 1000000,
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    maxUsage: 100,
    description: "Voucher VIP"
});

// Phát hành batch
voucherDB.assignVoucherToCustomer("cust_001", "voucher_id", 3);
```

---

### 2️⃣ MODULE: Validation (5-Step Verification)

**5 Bước Verify:**

```
Step 1: Check Format Code
  ├─ Regex: /^[A-Z0-9]{3,20}$/
  └─ Error: "Mã code không hợp lệ"

Step 2: Check Existence
  ├─ Kiểm tra code tồn tại
  └─ Error: "Mã code không tồn tại"

Step 3: Check Expiration
  ├─ Kiểm tra thời hạn & status
  └─ Error: "Mã code đã hết hạn"

Step 4: Check Usage Limit
  ├─ Kiểm tra maxUsage
  ├─ Kiểm tra maxUsagePerCustomer
  └─ Error: "Đã dùng hết số lần"

Step 5: Check Applicability
  ├─ Kiểm tra đơn tối thiểu
  ├─ Kiểm tra sản phẩm áp dụng
  ├─ Kiểm tra danh mục áp dụng
  └─ Error: "Không áp dụng sản phẩm này"
```

**API Validation:**
```javascript
const result = await voucherValidator.validate(
    code,           // Mã code từ người dùng
    cartData,       // Dữ liệu giỏ hàng
    customerId      // ID khách hàng
);

// Result:
{
    isValid: true/false,
    steps: {
        step1: { valid: true, error: null },
        step2: { valid: true, error: null, voucher: {...} },
        step3: { valid: true, error: null },
        step4: { valid: true, error: null },
        step5: { valid: true, error: null }
    },
    error: null
}
```

---

### 3️⃣ MODULE: Tracking & Analytics

**Real-time Tracking:**
```javascript
// Lấy thống kê tổng
const stats = voucherAnalytics.getStats();
// {
//     totalVouchers: 25,
//     activeVouchers: 15,
//     totalUsages: 342,
//     totalDiscountGiven: 45000000,
//     averageDiscount: 131500
// }

// ROI của từng voucher
const roi = voucherAnalytics.getVoucherROI(voucherId);
// {
//     code: "VIP2024",
//     timesUsed: 42,
//     totalDiscount: 4200000,
//     totalRevenue: 210000000,
//     roi: "98.00%"
// }

// Top 5 voucher được dùng nhiều
const top = voucherAnalytics.getTopVouchers(5);

// Trend 7 ngày
const trend = voucherAnalytics.getUsageTrend(7);
```

---

## 🔄 LUỒNG XỬ LÝ (Processing Flow)

### 📥 Luồng Sử Dụng Voucher

```
1. Customer nhập mã code
   ↓
2. System validate 5 bước
   ├─ Nếu fail → Hiện error message
   └─ Nếu pass → Tiếp tục
   ↓
3. Calculate discount
   ├─ Type = percent: amount × value / 100
   ├─ Type = fixed: value
   └─ Type = freeship: shipping cost
   ↓
4. Apply discount to cart
   └─ Update total price
   ↓
5. At checkout:
   └─ Record usage in voucher_usage
   └─ Update totalUsed counter
   └─ Update totalRevenue
   └─ Mark customer voucher as used
   ↓
6. Success → Order completed
```

### 📤 Luồng Tạo & Phát Hành Batch

```
1. Admin Setup
   ├─ Nhập thông tin voucher
   ├─ Chọn loại giảm giá
   ├─ Set điều kiện & thời hạn
   └─ Confirm
   ↓
2. Generate
   └─ System tạo voucher
   ↓
3. Store
   └─ Lưu vào localStorage/Database
   ↓
4. Distribute
   ├─ Chọn voucher
   ├─ Danh sách khách hàng
   ├─ Set số lượng per khách
   └─ Phát hành
   ↓
5. Complete
   └─ Voucher được gắn cho khách
```

---

## 🛠️ CÁCH SỬ DỤNG

### Admin Panel

**Đường dẫn:** `/admin/index.html`

**Chức năng:**
1. **Tab: Voucher & Mã Code**
   - View danh sách voucher
   - Tìm kiếm & lọc theo status
   - Create/Edit/Delete voucher

2. **Modal: Tạo Mã Voucher Mới**
   - Nhập mã code (VD: VIP2024)
   - Chọn loại giảm giá
   - Nhập giá trị
   - Set đơn tối thiểu
   - Chọn thời hạn
   - Lưu

3. **Modal: Phát Hành Batch**
   - Chọn voucher
   - Nhập danh sách customer ID
   - Set số lượng per customer
   - Phát hành

### Website

**Đường dẫn:** Thêm vào giỏ hàng/thanh toán

**HTML Required:**
```html
<!-- Trong giỏ hàng -->
<div id="voucherSection">
    <input type="text" id="voucherCodeInput" placeholder="Nhập mã code...">
    <button id="applyVoucherBtn">Áp dụng</button>
</div>

<!-- Voucher được áp dụng -->
<div id="appliedVoucherInfo"></div>

<!-- Cột giảm giá trong tính toán -->
<div id="cartDiscount">0 VNĐ</div>
<div id="cartFinal">0 VNĐ</div>
```

**Script:**
```html
<!-- Trong </head> hoặc </body> -->
<script src="admin/voucher-db.js"></script>
<script src="voucher-system.js"></script>
```

**JavaScript Usage:**
```javascript
// Apply voucher
voucherSystem.applyVoucher();

// Remove voucher
voucherSystem.removeVoucher();

// Checkout with voucher
voucherSystem.completeCheckout(orderData);
```

---

## 📊 DASHBOARD ADMIN

**Stats Cards:**
- Tổng Voucher
- Đang Hoạt Động
- Tổng Lần Dùng
- Tổng Giảm Giá

**Voucher Cards:**
- Mã code & prefix
- Loại giảm giá
- Điều kiện
- Thời hạn
- Lần dùng
- Doanh thu

**Analytics Chart:**
- Top 5 voucher được dùng nhiều
- Usage trend (7 ngày)

---

## 🔐 Validation Rules

| Rule | Condition | Error |
|------|-----------|-------|
| Format | A-Z0-9, 3-20 ký tự | Code format không hợp lệ |
| Existence | Code phải tồn tại | Code không tồn tại |
| Status | Status = active | Code đã hết hạn |
| Expiration | Today ∈ [startDate, endDate] | Code hết hạn |
| Max Usage | totalUsed < maxUsage | Code hết số lần dùng |
| Per Customer | usage < maxUsagePerCustomer | Dùng quá số lần cho phép |
| Min Order | cartTotal ≥ minOrder | Đơn hàng quá nhỏ |
| Products | Có product in applicableProducts hoặc empty | Không áp dụng SP này |
| Categories | Có category in applicableCategories hoặc empty | Không áp dụng danh mục |

---

## 💾 Storage

**LocalStorage Keys:**
```javascript
localStorage.getItem('vouchers')           // Danh sách voucher
localStorage.getItem('voucher_usage')      // Lịch sử dùng
localStorage.getItem('customer_vouchers')  // Voucher của khách
```

---

## 🚀 API Reference

### VoucherDatabase

```javascript
// CRUD Operations
voucherDB.addVoucher(data)                 // Tạo
voucherDB.getVouchers(filter)              // Lấy danh sách
voucherDB.updateVoucher(id, updates)       // Cập nhật
voucherDB.deleteVoucher(id)                // Xóa

// Usage
voucherDB.recordUsage(voucherId, customerId, total, discount, orderDetails)
voucherDB.getUsageHistory(voucherId, customerId)

// Customer Vouchers
voucherDB.assignVoucherToCustomer(customerId, voucherId, quantity)
voucherDB.getCustomerVouchers(customerId)
voucherDB.useVoucher(customerId, voucherId)
```

### VoucherValidator

```javascript
voucherValidator.validate(code, cartData, customerId)  // 5-step validation
voucherValidator.checkCodeFormat(code)
voucherValidator.checkVoucherExists(code)
voucherValidator.checkExpiration(code)
voucherValidator.checkUsageLimit(code, customerId)
voucherValidator.checkApplicability(code, cartData)
```

### VoucherAnalytics

```javascript
voucherAnalytics.getStats()                            // Tổng stats
voucherAnalytics.getVoucherROI(voucherId)              // ROI từng voucher
voucherAnalytics.getTopVouchers(limit)                 // Top N voucher
voucherAnalytics.getUsageTrend(days)                   // Trend N ngày
```

---

## 🎨 Styling

File CSS: `admin/voucher-style.css`

Classes chính:
- `.voucher-card` - Card hiển thị voucher
- `.stat-card` - Card thống kê
- `.modal` - Modal dialog
- `.voucher-applied` - Voucher được áp dụng

---

## ⚠️ Notes

1. **Database:** Hiện dùng localStorage (phù hợp demo). Production nên dùng real database.
2. **Authentication:** Thêm auth check cho admin functions
3. **Security:** Validate tất cả input ở backend
4. **Performance:** Cache voucher list để tránh lookup liên tục

---

## 📝 Example Usage

```javascript
// 1. Tạo voucher
voucherDB.addVoucher({
    code: "NEW2024",
    type: "percent",
    value: 15,
    description: "Welcome voucher 15% off",
    minOrder: 500000,
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    maxUsage: 1000,
    maxUsagePerCustomer: 1
});

// 2. Phát hành cho khách
voucherDB.assignVoucherToCustomer("cust_001", "voucher_id_123", 2);

// 3. Customer apply voucher
await voucherValidator.validate("NEW2024", cartData, "cust_001");

// 4. Tính discount
const discount = voucherSystem.calculateDiscount(cartData);

// 5. Complete order
voucherSystem.completeCheckout(orderData);

// 6. Xem analytics
const stats = voucherAnalytics.getStats();
const roi = voucherAnalytics.getVoucherROI("voucher_id_123");
```

---

**Version:** 1.0  
**Last Updated:** 2024-01-28  
**Author:** Phạm Quốc Bảo
