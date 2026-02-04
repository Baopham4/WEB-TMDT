// ========================================== //
// ADMIN VOUCHER MANAGEMENT
// ========================================== //

class AdminVoucherManager {
    constructor() {
        this.currentVoucher = null;
        this.voucherList = [];
        this.init();
    }

    init() {
        this.loadVouchers();
        this.setupEventListeners();
        this.renderVouchers();
    }

    loadVouchers() {
        this.voucherList = voucherDB.getVouchers();
    }

    setupEventListeners() {
        // Create voucher modal
        const createBtn = document.getElementById('createVoucherBtn');
        const modal = document.getElementById('voucherModal');
        const closeBtn = document.querySelector('#voucherModal .close');
        const submitBtn = document.getElementById('submitVoucherForm');

        if (createBtn) createBtn.addEventListener('click', () => this.openCreateModal());
        if (closeBtn) closeBtn.addEventListener('click', () => this.closeModal());
        if (submitBtn) submitBtn.addEventListener('click', () => this.handleSubmitVoucher());

        // Filter & Search
        const search = document.getElementById('voucherSearch');
        const statusFilter = document.getElementById('voucherStatusFilter');
        if (search) search.addEventListener('input', (e) => this.filterVouchers(e.target.value));
        if (statusFilter) statusFilter.addEventListener('change', (e) => this.filterByStatus(e.target.value));

        // Distribution buttons
        const distributeBtn = document.getElementById('distributeBatchBtn');
        if (distributeBtn) distributeBtn.addEventListener('click', () => this.openDistributionModal());
    }

    // ==================== CREATE VOUCHER ====================
    openCreateModal() {
        const modal = document.getElementById('voucherModal');
        if (modal) {
            modal.style.display = 'block';
            document.getElementById('voucherFormTitle').textContent = 'Tạo Mã Voucher Mới';
            this.resetForm();
        }
    }

    closeModal() {
        const modal = document.getElementById('voucherModal');
        if (modal) modal.style.display = 'none';
    }

    resetForm() {
        const form = document.getElementById('voucherForm');
        if (form) form.reset();
        this.currentVoucher = null;

        // Reset date inputs to today
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('voucherStartDate').value = today;
        document.getElementById('voucherEndDate').value = today;
    }

    async handleSubmitVoucher() {
        try {
            // Validate form
            const code = document.getElementById('voucherCode').value.toUpperCase();
            const type = document.getElementById('voucherType').value;
            const value = parseFloat(document.getElementById('voucherValue').value);
            const minOrder = parseFloat(document.getElementById('minOrder').value) || 0;
            const startDate = document.getElementById('voucherStartDate').value;
            const endDate = document.getElementById('voucherEndDate').value;
            const maxUsage = parseInt(document.getElementById('maxUsage').value) || null;
            const description = document.getElementById('voucherDescription').value;

            if (!code || !type || !value || !startDate || !endDate) {
                alert('Vui lòng điền đủ thông tin bắt buộc');
                return;
            }

            // Check duplicate code
            if (!this.currentVoucher && voucherDB.getVouchers({ code })[0]) {
                alert('Mã code này đã tồn tại');
                return;
            }

            const voucherData = {
                code,
                type,
                value,
                minOrder,
                startDate,
                endDate,
                maxUsage,
                description,
                maxUsagePerCustomer: parseInt(document.getElementById('maxPerCustomer').value) || 1,
                prefix: 'ADMIN',
                createdBy: 'Admin'
            };

            if (this.currentVoucher) {
                // Update
                voucherDB.updateVoucher(this.currentVoucher.id, voucherData);
                alert('Cập nhật voucher thành công!');
            } else {
                // Create
                voucherDB.addVoucher(voucherData);
                alert('Tạo voucher thành công!');
            }

            this.closeModal();
            this.loadVouchers();
            this.renderVouchers();
        } catch (error) {
            console.error('Error:', error);
            alert('Có lỗi xảy ra: ' + error.message);
        }
    }

    // ==================== RENDER & DISPLAY ====================
    renderVouchers() {
        const container = document.getElementById('voucherList');
        if (!container) return;

        if (this.voucherList.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-ticket-alt"></i>
                    <h3>Chưa có voucher nào</h3>
                    <p>Hãy tạo voucher đầu tiên của bạn</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.voucherList.map(voucher => `
            <div class="voucher-card" id="voucher-${voucher.id}">
                <div class="voucher-header">
                    <div class="voucher-code">
                        <span class="code">${voucher.code}</span>
                        <span class="prefix">${voucher.prefix}</span>
                    </div>
                    <div class="voucher-actions">
                        <button class="btn-icon" onclick="adminVoucher.editVoucher('${voucher.id}')" title="Chỉnh sửa">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon danger" onclick="adminVoucher.deleteVoucher('${voucher.id}')" title="Xóa">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>

                <div class="voucher-details">
                    <div class="detail-row">
                        <span class="label">Loại giảm giá:</span>
                        <span class="value">
                            ${voucher.type === 'percent' ? `${voucher.value}% OFF` : 
                              voucher.type === 'fixed' ? `${voucher.value.toLocaleString()} VNĐ` : 
                              'Miễn phí ship'}
                        </span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Mô tả:</span>
                        <span class="value">${voucher.description}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Đơn tối thiểu:</span>
                        <span class="value">${voucher.minOrder.toLocaleString()} VNĐ</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Thời hạn:</span>
                        <span class="value">${voucher.startDate} đến ${voucher.endDate}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Lượt dùng tối đa:</span>
                        <span class="value">${voucher.maxUsage || 'Vô hạn'}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Per Customer:</span>
                        <span class="value">${voucher.maxUsagePerCustomer} lần</span>
                    </div>
                </div>

                <div class="voucher-stats">
                    <div class="stat">
                        <span class="stat-value">${voucher.totalUsed || 0}</span>
                        <span class="stat-label">Lần dùng</span>
                    </div>
                    <div class="stat">
                        <span class="stat-value">${(voucher.totalRevenue || 0).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
                        <span class="stat-label">Doanh thu</span>
                    </div>
                    <div class="stat">
                        <span class="stat-status ${voucher.status}">${voucher.status === 'active' ? '✓ Hoạt động' : '✗ Không hoạt động'}</span>
                    </div>
                </div>
            </div>
        `).join('');

        this.updateStats();
    }

    editVoucher(voucherId) {
        const voucher = voucherDB.getVouchers().find(v => v.id === voucherId);
        if (!voucher) return;

        this.currentVoucher = voucher;
        
        // Fill form
        document.getElementById('voucherCode').value = voucher.code;
        document.getElementById('voucherType').value = voucher.type;
        document.getElementById('voucherValue').value = voucher.value;
        document.getElementById('minOrder').value = voucher.minOrder;
        document.getElementById('voucherStartDate').value = voucher.startDate;
        document.getElementById('voucherEndDate').value = voucher.endDate;
        document.getElementById('maxUsage').value = voucher.maxUsage || '';
        document.getElementById('maxPerCustomer').value = voucher.maxUsagePerCustomer;
        document.getElementById('voucherDescription').value = voucher.description;

        document.getElementById('voucherFormTitle').textContent = 'Cập nhật Voucher';
        document.getElementById('voucherModal').style.display = 'block';
    }

    deleteVoucher(voucherId) {
        if (confirm('Bạn chắc chắn muốn xóa voucher này?')) {
            voucherDB.deleteVoucher(voucherId);
            this.loadVouchers();
            this.renderVouchers();
        }
    }

    filterVouchers(searchTerm) {
        this.voucherList = voucherDB.getVouchers().filter(v =>
            v.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
            v.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
        this.renderVouchers();
    }

    filterByStatus(status) {
        if (status === 'all') {
            this.voucherList = voucherDB.getVouchers();
        } else {
            this.voucherList = voucherDB.getVouchers({ status });
        }
        this.renderVouchers();
    }

    // ==================== BATCH DISTRIBUTION ====================
    openDistributionModal() {
        const modal = document.getElementById('distributionModal');
        if (modal) {
            modal.style.display = 'block';
            this.loadVouchersForDistribution();
        }
    }

    loadVouchersForDistribution() {
        const select = document.getElementById('selectVoucherForDistribution');
        if (!select) return;
        
        select.innerHTML = this.voucherList.map(v => 
            `<option value="${v.id}">${v.code} - ${v.description}</option>`
        ).join('');
    }

    async handleDistributionSubmit() {
        try {
            const voucherId = document.getElementById('selectVoucherForDistribution').value;
            const distributionType = document.getElementById('distributionType').value;
            const quantity = parseInt(document.getElementById('distributionQuantity').value) || 1;
            const customerList = document.getElementById('customerListInput').value;

            if (!voucherId || !customerList.trim()) {
                alert('Vui lòng điền đầy đủ thông tin');
                return;
            }

            const customerIds = customerList.split('\n')
                .map(id => id.trim())
                .filter(id => id.length > 0);

            let distributed = 0;
            customerIds.forEach(customerId => {
                voucherDB.assignVoucherToCustomer(customerId, voucherId, quantity);
                distributed++;
            });

            alert(`Phát hành thành công ${distributed} voucher cho ${customerIds.length} khách hàng!`);
            this.closeDistributionModal();
        } catch (error) {
            alert('Lỗi: ' + error.message);
        }
    }

    closeDistributionModal() {
        const modal = document.getElementById('distributionModal');
        if (modal) modal.style.display = 'none';
    }

    // ==================== STATS ====================
    updateStats() {
        const stats = voucherAnalytics.getStats();
        
        document.getElementById('totalVouchersCount').textContent = stats.totalVouchers;
        document.getElementById('activeVouchersCount').textContent = stats.activeVouchers;
        document.getElementById('totalUsagesCount').textContent = stats.totalUsages;
        document.getElementById('totalDiscountCount').textContent = 
            stats.totalDiscountGiven.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

        this.renderAnalytics();
    }

    renderAnalytics() {
        const topVouchers = voucherAnalytics.getTopVouchers(5);
        const container = document.getElementById('topVouchersChart');
        
        if (!container || topVouchers.length === 0) return;

        container.innerHTML = topVouchers.map(v => `
            <div class="chart-item">
                <div class="chart-name">${v.code}</div>
                <div class="chart-bar">
                    <div class="bar" style="width: ${(v.used / Math.max(...topVouchers.map(x => x.used)) * 100)}%"></div>
                </div>
                <div class="chart-stats">
                    <span>${v.used} lần dùng</span>
                    <span>${(v.revenue).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
                </div>
            </div>
        `).join('');
    }
}

// Khởi tạo
let adminVoucher;
document.addEventListener('DOMContentLoaded', function() {
    adminVoucher = new AdminVoucherManager();
});
