// Admin Management Script
class AdminManager {
    constructor() {
        this.products = [];
        this.orders = [];
        this.orderStatusOptions = [
            'Chờ xác nhận',
            'Đã xác nhận',
            'Đang giao',
            'Đã giao',
            'Đã hủy'
        ];
        this.init();
    }

    init() {
        this.loadData();
        this.setupEventListeners();
        this.renderProducts();
        this.renderOrders();
        this.updateStats();
    }

    loadData() {
        // Load products from localStorage or use default
        const savedProducts = localStorage.getItem('adminProducts');
        
        if (savedProducts) {
            this.products = JSON.parse(savedProducts);
        } else {
            // Load from main website
            const mainProducts = localStorage.getItem('websiteProducts');
            if (mainProducts) {
                this.products = JSON.parse(mainProducts);
            } else {
                // Use default products
                this.products = this.getDefaultProducts();
            }
        }
        
        // Load orders
        const savedOrders = localStorage.getItem('adminOrders');
        if (savedOrders) {
            this.orders = JSON.parse(savedOrders);
        }
        
        // Update UI
        this.updateProductCount();
        this.updateOrderCount();
        this.updateLastSync();
    }

    getDefaultProducts() {
        const pretty = (file) => {
            let base = file.replace(/\.[^/.]+$/g, "");
            base = base.replace(/[-_]+/g, " ");
            base = base.replace(/([a-z])([A-Z])/g, "$1 $2");
            base = base.replace(/\s+/g, " ").trim();
            const title = base.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ");
            const repl = [
                [/Vong/gi, "Vòng"],
                [/Day Chuyen/gi, "Dây Chuyền"],
                [/Nhan/gi, "Nhẫn"],
                [/Bong Tai/gi, "Bông Tai"],
                [/Mat Ngoc/gi, "Mặt Ngọc"],
                [/Phi Thuy/gi, "Phỉ Thúy"],
                [/Bang Chung/gi, "Băng Chủng"],
                [/Bach Ngoc/gi, "Bạch Ngọc"],
                [/Hoang Ngoc/gi, "Hoàng Ngọc"],
                [/Cam Anh/gi, "Cam Ánh"],
                [/Hoang Hon/gi, "Hoàng Hôn"],
                [/Tim Oai Huong/gi, "Tím Oải Hương"],
                [/Xam Khoi/gi, "Xám Khói"],
                [/Tam Sac/gi, "Tam Sắc"],
                [/Da Sac/gi, "Đa Sắc"],
                [/Trang Pha Luc/gi, "Trắng Pha Lục"],
                [/Xanh Tao/gi, "Xanh Táo"],
                [/Van May/gi, "Vân Mây"],
                [/Dong Dieu/gi, "Đồng Điếu"],
                [/Phat Di Lac/gi, "Phật Di Lặc"],
                [/Quan Am/gi, "Quan Âm"],
                [/Ty Huu/gi, "Tỳ Hưu"],
                [/Giot Nuoc/gi, "Giọt Nước"],
                [/Hoa Mau Don Phu Quy/gi, "Hoa Mẫu Đơn Phú Quý"],
                [/Luc Bao/gi, "Lục Bảo"]
            ];
            let pretty = title;
            repl.forEach(([r, v]) => pretty = pretty.replace(r, v));
            return pretty;
        };
        const files = [
            "VongPhiThuyBangChungTrongSuot.jpeg",
            "VongPhiThuyBachNgocTinhKhoi.jpeg",
            "VongPhiThuyCamAnhHoangHon.jpeg",
            "VongPhiThuyHoangNgocAnhMat.jpeg",
            "VongPhiThuyHongDaoDiuDang.jpeg",
            "VongPhiThuyLamBangThanhKhiet.jpeg",
            "VongPhiThuyLucBaoHoangGia.jpg",
            "VongPhiThuyLucDamVanMay.jpeg",
            "VongPhiThuyNauHoPhach.jpeg",
            "VongPhiThuyTamSacPhucLocTho.jpeg",
            "VongPhiThuyTrangPhaLuc.jpeg",
            "VongPhiThuyTimOaiHuong.jpeg",
            "VongPhiThuyXanhLucNhatThanhTan.jpeg",
            "VongPhiThuyXanhNgocLam.jpeg",
            "VongPhiThuyXanhNgocLucBaoSang.jpeg",
            "VongPhiThuyXanhReuCoDien.jpeg",
            "VongPhiThuyXanhTaoThanhNha.jpeg",
            "VongPhiThuyXamKhoiSangTrong.jpeg",
            "VongPhiThuyDaSacThienNhien.jpeg",
            "VongPhiThuyDenHuyenBi.jpeg",
            "DayChuyenPhiThuyBangChung.jpeg",
            "DayChuyenPhiThuyBachNgoc.jpeg",
            "DayChuyenPhiThuyCamAnhDuong.jpeg",
            "DayChuyenPhiThuyGiotNuoc.jpeg",
            "DayChuyenPhiThuyHoangNgoc.jpeg",
            "DayChuyenPhiThuyHoLy.jpeg",
            "DayChuyenPhiThuyHoLo.jpeg",
            "DayChuyenPhiThuyHongDao.jpeg",
            "DayChuyenPhiThuyLamBang.jpeg",
            "DayChuyenPhiThuyLucBaoHoangGia.jpeg",
            "DayChuyenPhiThuyPhatDiLac.jpeg",
            "DayChuyenPhiThuyTraiTim.jpeg",
            "DayChuyenPhiThuyTimLavender.jpeg",
            "DayChuyenPhiThuyTyHuu.jpeg",
            "DayChuyenPhiThuyVanMay.jpeg",
            "DayChuyenPhiThuyXanhReu.jpeg",
            "DayChuyenPhiThuyXanhTao.jpeg",
            "DayChuyenPhiThuyDaSac.jpeg",
            "DayChuyenPhiThuyDenHuyenBi.jpeg",
            "DayChuyenPhiThuyDongDieu.jpeg",
            "NhanPhiThuyBangChung.jpeg",
            "NhanPhiThuyBachNgocTinhKhoi.jpeg",
            "NhanPhiThuyCamHoangHon.jpeg",
            "NhanPhiThuyHoangNgoc.jpeg",
            "NhanPhiThuyHongDao.jpeg",
            "NhanPhiThuyLamBang.jpeg",
            "NhanPhiThuyLucBaoHoangGia.jpeg",
            "NhanPhiThuyLucBaoSang.jpeg",
            "NhanPhiThuyLucNhat.jpeg",
            "NhanPhiThuyNgocLam.jpeg",
            "NhanPhiThuyNauHoPhach.jpeg",
            "NhanPhiThuyTamSac.jpeg",
            "NhanPhiThuyTrangPhaLuc.jpeg",
            "NhanPhiThuyTimOaiHuong.jpeg",
            "NhanPhiThuyVanMay.jpeg",
            "NhanPhiThuyXanhReu.jpeg",
            "NhanPhiThuyXanhTaoThanhNha.jpeg",
            "NhanPhiThuyXamKhoi.jpeg",
            "NhanPhiThuyDaSacThienNhien.jpeg",
            "NhanPhiThuyDenHuyenBi.jpeg",
            "BongTaiPhiThuyBangChung.jpeg",
            "BongTaiPhiThuyBachNgoc.jpeg",
            "BongTaiPhiThuyCamAnhDuong.jpeg",
            "BongTaiPhiThuyDangDai.jpeg",
            "BongTaiPhiThuyGiotNuoc.jpeg",
            "BongTaiPhiThuyHoangNgoc.jpeg",
            "BongTaiPhiThuyHoLy.jpeg",
            "BongTaiPhiThuyHoLo.jpeg",
            "BongTaiPhiThuyHongDao.jpeg",
            "BongTaiPhiThuyKetHopVangjpeg.webp",
            "BongTaiPhiThuyLamBang.jpeg",
            "BongTaiPhiThuyLucBaoHoangGia.jpeg",
            "BongTaiPhiThuyTraiTim.jpeg",
            "BongTaiPhiThuyTronStud.jpeg",
            "BongTaiPhiThuyTimLavender.jpeg",
            "BongTaiPhiThuyVanMay.jpeg",
            "BongTaiPhiThuyXanhReu.jpeg",
            "BongTaiPhiThuyDaSac.jpeg",
            "BongTaiPhiThuyDenHuyenBi.jpeg",
            "MatNgocPhiThuyBangChung.jpeg",
            "MatNgocPhiThuyBachNgoc.jpeg",
            "MatNgocPhiThuyCamAnhDuong.jpeg",
            "MatNgocPhiThuyGiotNuoc.jpeg",
            "MatNgocPhiThuyHoaMauDonPhuQuy.jpeg",
            "MatNgocPhiThuyHoangNgoc.jpeg",
            "MatNgocPhiThuyHoLy.jpeg",
            "MatNgocPhiThuyHoLo.jpeg",
            "MatNgocPhiThuyHongDao.jpeg",
            "MatNgocPhiThuyLamBang.jpeg",
            "MatNgocPhiThuyLucBaoHoangGia.jpeg",
            "MatNgocPhiThuyPhatDiLac.jpeg",
            "MatNgocPhiThuyQuanAm.jpeg",
            "MatNgocPhiThuyTraiTim.jpeg",
            "MatNgocPhiThuyTimLavender.jpeg",
            "MatNgocPhiThuyTyHuu.jpeg",
            "MatNgocPhiThuyVanTuNhien.jpeg",
            "MatNgocPhiThuyXanhReu.jpeg",
            "MatNgocPhiThuyDenHuyenBi.jpeg",
            "MatNgocPhiThuyDongDieuBinhAn.jpeg",
            "vongtay1.jpg",
            "vongtay2.jpg",
            "vongtay3.jpg",
            "vongtay4.jpg",
            "vongtay5.png",
            "daychuyen1.jpg",
            "daychuyen2.jpg",
            "daychuyen3.jpg",
            "daychuyen4.png",
            "daychuyen5.jpeg",
            "nhan1.jpg",
            "nhan2.jpg",
            "nhan3.jpg",
            "nhan4.jpg",
            "bongtai1.jpg",
            "bongtai2.jpeg",
            "bongtai3.jpg",
            "bongtai4.jpg",
            "il_1588xN.7866810995_itrs.jpeg"
        ];

        return files.map((file, index) => {
            const name = pretty(file);
            const lower = name.toLowerCase();
            let category = "Khác";
            if (lower.startsWith("vòng") || lower.startsWith("vong") || lower.includes("vongphithuy") || lower.startsWith("vongtay")) category = "Vòng tay";
            else if (lower.startsWith("dây chuyền") || lower.startsWith("daychuyen") || lower.includes("daychuyenphithuy")) category = "Dây chuyền";
            else if (lower.startsWith("nhẫn") || lower.startsWith("nhan") || lower.includes("nhanphithuy")) category = "Nhẫn";
            else if (lower.startsWith("bông tai") || lower.startsWith("bongtai") || lower.includes("bongtaiphithuy")) category = "Bông tai";
            else if (lower.startsWith("mặt ngọc") || lower.includes("matngoc") || lower.includes("matngocphithuy")) category = "Mặt dây chuyền";

            const basePrice = 35000000 + index * 500000;

            return {
                id: index + 1,
                name: name,
                description: "Sản phẩm " + name.toLowerCase() + " làm từ ngọc phỉ thúy tự nhiên.",
                price: basePrice,
                salePrice: null,
                category: category,
                image: encodeURI("images/" + file),
                stock: 5,
                status: "active",
                details: "Ngọc phỉ thúy tự nhiên",
                badge: "MỚI"
            };
        });
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const tab = item.dataset.tab;
                this.switchTab(tab);
            });
        });

        // Add product button
        document.getElementById('addProductBtn').addEventListener('click', () => {
            this.openProductModal();
        });

        // Sync button - ĐÃ SỬA: THÊM GỬI SỰ KIỆN
        document.getElementById('syncBtn').addEventListener('click', () => {
            this.syncWithWebsite();
        });

        // Back to site button
        document.getElementById('backToSite').addEventListener('click', () => {
            window.location.href = '../index.html';
        });

        // Product form
        document.getElementById('productForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveProduct();
        });

        // Modal close buttons
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', () => {
                this.closeModal();
            });
        });

        // Image selection
        document.querySelectorAll('.sample-image').forEach(img => {
            img.addEventListener('click', () => {
                document.getElementById('productImage').value = img.dataset.img;
            });
        });

        // Search
        document.getElementById('productSearch').addEventListener('input', (e) => {
            this.filterProducts(e.target.value);
        });

        // Category filter
        document.getElementById('categoryFilter').addEventListener('change', (e) => {
            this.filterProducts();
        });

        // Status filter
        document.getElementById('statusFilter').addEventListener('change', (e) => {
            this.filterProducts();
        });

        // Material button selection
        document.querySelectorAll('.material-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                // Bỏ active class khỏi tất cả button
                document.querySelectorAll('.material-btn').forEach(b => b.classList.remove('active'));
                // Thêm active class cho button được click
                btn.classList.add('active');
                // Cập nhật hidden input
                document.getElementById('productDetails').value = btn.dataset.material;
                console.log('Chọn chất liệu:', btn.dataset.material);
            });
        });

        // Origin button selection
        document.querySelectorAll('.origin-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                // Bỏ active class khỏi tất cả button
                document.querySelectorAll('.origin-btn').forEach(b => b.classList.remove('active'));
                // Thêm active class cho button được click
                btn.classList.add('active');
                // Cập nhật hidden input
                document.getElementById('productOrigin').value = btn.dataset.origin;
                console.log('Chọn xuất xứ:', btn.dataset.origin);
            });
        });

        // QUAN TRỌNG: LẮNG NGHE THAY ĐỔI STOCK TỪ WEBSITE CHÍNH
        window.addEventListener('storage', (event) => {
            if (event.key === 'adminProducts') {
                console.log('🔔 Admin nhận được thay đổi stock từ website chính');
                this.loadData();
                this.renderProducts();
                this.updateStats();
                this.showNotification('Stock đã được cập nhật từ giỏ hàng!', 'info');
            } else if (event.key === 'adminOrders') {
                console.log('🧾 Admin nhận được đơn hàng mới từ website chính');
                this.loadData();
                this.renderOrders();
                this.updateOrderCount();
                this.updateLastSync();
                this.showNotification('Có đơn hàng mới!', 'success');
            }
        });

        // Kiểm tra cập nhật mỗi 2 giây
        setInterval(() => {
            const currentProducts = localStorage.getItem('adminProducts');
            if (currentProducts && JSON.stringify(this.products) !== currentProducts) {
                console.log('🔄 Phát hiện thay đổi stock, cập nhật admin...');
                this.products = JSON.parse(currentProducts);
                this.renderProducts();
                this.updateStats();
            }
            const currentOrders = localStorage.getItem('adminOrders');
            if (currentOrders && JSON.stringify(this.orders) !== currentOrders) {
                console.log('🔄 Phát hiện đơn hàng mới, cập nhật admin...');
                this.orders = JSON.parse(currentOrders);
                this.renderOrders();
                this.updateOrderCount();
            }
        }, 2000);
    }

    switchTab(tab) {
        // Update active nav item
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.tab === tab) {
                item.classList.add('active');
            }
        });

        // Show selected tab
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tab}Tab`).classList.add('active');
    }

    renderProducts(filteredProducts = null) {
        const productsToRender = filteredProducts || this.products;
        const tableBody = document.getElementById('productsTable');
        
        let html = '';
        
        productsToRender.forEach(product => {
            const price = this.formatPrice(product.price);
            const salePrice = product.salePrice ? this.formatPrice(product.salePrice) : '-';
            const discount = product.salePrice ? 
                Math.round((1 - product.salePrice / product.price) * 100) : 0;
            
            html += `
                <tr>
                    <td>${product.id}</td>
                    <td>
                        <img src="${product.image}" alt="${product.name}" class="product-image"
                             onerror="this.src='https://via.placeholder.com/60x60/00796B/FFFFFF?text=IMG'">
                    </td>
                    <td>
                        <strong>${product.name}</strong>
                        <br>
                        <small>${product.description.substring(0, 50)}...</small>
                        ${product.badge ? `<br><span class="badge">${product.badge}</span>` : ''}
                    </td>
                    <td>${product.category}</td>
                    <td>${price}</td>
                    <td>
                        ${salePrice}
                        ${discount > 0 ? `<br><small style="color: var(--danger);">-${discount}%</small>` : ''}
                    </td>
                    <td>
                        ${product.stock}
                        ${product.stock < 5 ? '<br><small style="color: var(--warning);">Sắp hết</small>' : ''}
                    </td>
                    <td>
                        <span class="status-badge ${product.status === 'active' ? 'status-active' : 'status-inactive'}">
                            ${product.status === 'active' ? 'Đang bán' : 'Ngừng bán'}
                        </span>
                    </td>
                    <td>
                        <div class="action-buttons">
                            <button class="action-btn edit-btn" onclick="admin.editProduct(${product.id})">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="action-btn delete-btn" onclick="admin.deleteProduct(${product.id})">
                                <i class="fas fa-trash"></i>
                            </button>
                            <button class="action-btn view-btn" onclick="admin.viewProduct(${product.id})">
                                <i class="fas fa-eye"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        });
        
        tableBody.innerHTML = html || '<tr><td colspan="9" style="text-align: center; padding: 40px;">Không có sản phẩm nào</td></tr>';
    }

    renderOrders() {
        const tableBody = document.getElementById('ordersTable');
        if (!tableBody) return;

        const orders = this.orders || [];
        let html = '';

        orders.forEach(order => {
            const total = this.formatPrice(order.total);
            const dateStr = new Date(order.date).toLocaleString('vi-VN');
            const customerName = order.customer?.name || 'Khách lẻ';
            const payment = (order.paymentMethod || 'cod').toUpperCase();
            const itemCount = Array.isArray(order.items) ? order.items.length : 0;
            const voucherCode = order.voucher?.code || '-';
            const mem = order.membership || {};
            const memLabel = mem.label || '-';
            const memDiscountFormatted = this.formatPrice(mem.discountAmount || 0);
            const rawStatus = order.status || 'Chờ xác nhận';
            let status = rawStatus;
            if (rawStatus === 'processing' || rawStatus === 'pending') {
                status = 'Chờ xác nhận';
            }
            if (!this.orderStatusOptions.includes(status)) {
                status = 'Chờ xác nhận';
            }
            const optionsHtml = this.orderStatusOptions.map(s => 
                `<option value="${s}" ${s === status ? 'selected' : ''}>${s}</option>`
            ).join('');

            html += `
                <tr>
                    <td>${order.id}</td>
                    <td>${dateStr}</td>
                    <td>${customerName}</td>
                    <td>${payment}</td>
                    <td>${itemCount}</td>
                    <td>${total}</td>
                    <td>${memLabel}</td>
                    <td>${memDiscountFormatted}</td>
                    <td>${voucherCode}</td>
                    <td>
                        <select class="order-status-select" onchange="admin.updateOrderStatus('${order.id}', this.value)">
                            ${optionsHtml}
                        </select>
                    </td>
                    <td><button class="btn-secondary" onclick="admin.showOrderDetails('${order.id}')"><i class="fas fa-info-circle"></i> Chi tiết</button></td>
                </tr>
            `;
        });

        tableBody.innerHTML = html || '<tr><td colspan="11" style="text-align:center; padding: 40px;">Chưa có đơn hàng</td></tr>';
    }

    updateOrderStatus(orderId, newStatus) {
        const index = this.orders.findIndex(order => order.id === orderId);
        if (index === -1) return;
        if (!this.orderStatusOptions.includes(newStatus)) return;
        this.orders[index].status = newStatus;
        localStorage.setItem('adminOrders', JSON.stringify(this.orders));
        localStorage.setItem('adminLastSync', Date.now());
        this.updateOrderCount();
        this.showNotification('Đã cập nhật trạng thái đơn hàng', 'success');
        this.renderOrders();
    }

    showOrderDetails(orderId){
        const o = (this.orders||[]).find(x=>x.id===orderId);
        if(!o) return;
        const c = o.customer || {};
        const mem = o.membership || {};
        const memDiscount = this.formatPrice(mem.discountAmount || 0);
        const voucher = o.voucher || null;
        const lines = [
            `Mã đơn: ${o.id}`,
            `Ngày: ${new Date(o.date).toLocaleString('vi-VN')}`,
            `Khách hàng: ${c.name||'Khách lẻ'}`,
            `Email: ${c.email||'-'}`,
            `SĐT: ${c.phone||'-'}`,
            `Địa chỉ: ${c.address||'-'}`,
            `Phương thức: ${o.paymentMethod||'-'}`,
            `Hạng membership: ${mem.label||'-'} (${mem.discountPercent||0}%)`,
            `Giảm theo hạng: ${memDiscount}`,
            `Mã voucher: ${voucher ? voucher.code : '-'}`,
            `Tổng tiền sau giảm: ${this.formatPrice(o.total)}`
        ];
        alert(lines.join('\n'));
    }

    openProductModal(product = null) {
        const modal = document.getElementById('productModal');
        const form = document.getElementById('productForm');
        
        if (product) {
            // Edit mode
            document.getElementById('modalTitle').textContent = 'Sửa sản phẩm';
            document.getElementById('productId').value = product.id;
            document.getElementById('productName').value = product.name;
            document.getElementById('productCategory').value = product.category;
            document.getElementById('productPrice').value = product.price;
            document.getElementById('salePrice').value = product.salePrice || '';
            document.getElementById('productStock').value = product.stock;
            document.getElementById('productStatus').value = product.status;
            document.getElementById('productImage').value = product.image;
            document.getElementById('productDescription').value = product.description;
            document.getElementById('productDetails').value = product.details || '';
            
            // Highlight đúng material button
            document.querySelectorAll('.material-btn').forEach(btn => btn.classList.remove('active'));
            if (product.details) {
                const materialBtn = document.querySelector(`.material-btn[data-material="${product.details}"]`);
                if (materialBtn) {
                    materialBtn.classList.add('active');
                }
            }

            // Highlight đúng origin button
            document.querySelectorAll('.origin-btn').forEach(btn => btn.classList.remove('active'));
            if (product.origin) {
                const originBtn = document.querySelector(`.origin-btn[data-origin="${product.origin}"]`);
                if (originBtn) {
                    originBtn.classList.add('active');
                    document.getElementById('productOrigin').value = product.origin;
                }
            }
        } else {
            // Add mode
            document.getElementById('modalTitle').textContent = 'Thêm sản phẩm mới';
            form.reset();
            document.getElementById('productId').value = '';
            document.getElementById('productStatus').value = 'active';
            document.getElementById('productStock').value = 1;
            
            // Reset material button
            document.querySelectorAll('.material-btn').forEach(btn => btn.classList.remove('active'));
            // Reset origin button
            document.querySelectorAll('.origin-btn').forEach(btn => btn.classList.remove('active'));
        }
        
        modal.classList.add('active');
    }

    closeModal() {
        document.getElementById('productModal').classList.remove('active');
    }

    saveProduct() {
        const form = document.getElementById('productForm');
        const productId = document.getElementById('productId').value;
        
        const productData = {
            id: productId ? parseInt(productId) : this.generateId(),
            name: document.getElementById('productName').value,
            category: document.getElementById('productCategory').value,
            price: parseInt(document.getElementById('productPrice').value),
            salePrice: document.getElementById('salePrice').value ? 
                parseInt(document.getElementById('salePrice').value) : null,
            stock: parseInt(document.getElementById('productStock').value),
            status: document.getElementById('productStatus').value,
            image: document.getElementById('productImage').value || 'images/default-product.jpg',
            description: document.getElementById('productDescription').value,
            details: document.getElementById('productDetails').value,
            origin: document.getElementById('productOrigin').value || 'Myanmar',
            badge: document.getElementById('salePrice').value ? 'GIẢM GIÁ' : 'MỚI'
        };
        
        if (productId) {
            // Update existing product
            const index = this.products.findIndex(p => p.id === parseInt(productId));
            if (index !== -1) {
                this.products[index] = productData;
                this.showNotification('Cập nhật sản phẩm thành công!', 'success');
            }
        } else {
            // Add new product
            this.products.push(productData);
            this.showNotification('Thêm sản phẩm mới thành công!', 'success');
        }
        
        this.saveData();
        this.renderProducts();
        this.updateStats();
        this.closeModal();
    }

    editProduct(id) {
        const product = this.products.find(p => p.id === id);
        if (product) {
            this.openProductModal(product);
        }
    }

    deleteProduct(id) {
        if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
            this.products = this.products.filter(p => p.id !== id);
            this.saveData();
            this.renderProducts();
            this.updateStats();
            this.showNotification('Đã xóa sản phẩm', 'success');
        }
    }

    viewProduct(id) {
        const product = this.products.find(p => p.id === id);
        if (!product) return;

        const existing = document.getElementById('viewProductModal');
        if (existing) existing.remove();

        const wrapper = document.createElement('div');
        wrapper.className = 'modal';
        wrapper.id = 'viewProductModal';
        wrapper.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3><i class="fas fa-eye"></i> Chi tiết sản phẩm</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div style="display:grid;grid-template-columns:1.2fr 1.8fr;gap:16px;align-items:flex-start">
                        <div>
                            <div style="border-radius:12px;overflow:hidden;border:1px solid rgba(148,163,184,.4);background:#0f172a">
                                <img src="${product.image || ''}" alt="${product.name}"
                                     onerror="this.src='https://via.placeholder.com/420x320/0f172a/ffffff?text=No+Image'"
                                     style="width:100%;display:block;object-fit:cover;max-height:320px">
                            </div>
                        </div>
                        <div>
                            <h4 style="margin:0 0 6px;font-size:18px">${product.name}</h4>
                            <div style="margin-bottom:10px;font-size:14px;color:#6b7280">
                                ${product.category || ''} • ${product.status === 'active' ? 'Đang bán' : 'Ngừng bán'}
                            </div>
                            <div style="margin-bottom:12px">
                                <span style="font-size:18px;font-weight:700;color:#059669">${(product.salePrice || product.price).toLocaleString('vi-VN')} VNĐ</span>
                                ${product.salePrice ? `<span style="margin-left:8px;font-size:13px;color:#9ca3af;text-decoration:line-through">${(product.price||0).toLocaleString('vi-VN')} VNĐ</span>`:''}
                            </div>
                            <div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin-bottom:12px;font-size:13px;color:#6b7280">
                                <div><strong>Kho:</strong> ${product.stock}</div>
                                <div><strong>Chất liệu:</strong> ${product.material||'-'}</div>
                                <div><strong>Xuất xứ:</strong> ${product.origin||'-'}</div>
                            </div>
                            <div style="margin-bottom:12px;font-size:13px;color:#4b5563">
                                <strong>Mô tả:</strong>
                                <p style="margin:4px 0 0;white-space:pre-line">${product.description||'-'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;

        document.body.appendChild(wrapper);

        const closeBtn = wrapper.querySelector('.modal-close');
        const close = () => wrapper.remove();
        closeBtn.addEventListener('click', close);
        wrapper.addEventListener('click', e => {
            if (e.target === wrapper) close();
        });
    }

    filterProducts(searchTerm = '') {
        const category = document.getElementById('categoryFilter').value;
        const status = document.getElementById('statusFilter').value;
        
        let filtered = this.products;
        
        // Filter by search term
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(p => 
                p.name.toLowerCase().includes(term) ||
                p.description.toLowerCase().includes(term) ||
                p.category.toLowerCase().includes(term)
            );
        }
        
        // Filter by category
        if (category !== 'all') {
            filtered = filtered.filter(p => p.category === category);
        }
        
        // Filter by status
        if (status !== 'all') {
            filtered = filtered.filter(p => p.status === status);
        }
        
        this.renderProducts(filtered);
    }

    // QUAN TRỌNG: ĐÃ THÊM GỬI SỰ KIỆN STORAGE
    syncWithWebsite() {
        // Save to localStorage for main website
        localStorage.setItem('adminProducts', JSON.stringify(this.products));
        localStorage.setItem('websiteProducts', JSON.stringify(this.products));
        localStorage.setItem('adminLastSync', Date.now());
        
        // Trigger sync event for main website
        localStorage.setItem('forceSync', Date.now());
        
        // QUAN TRỌNG: Gửi sự kiện storage để connect.js nhận được
        window.dispatchEvent(new StorageEvent('storage', {
            key: 'adminProducts',
            newValue: JSON.stringify(this.products),
            oldValue: localStorage.getItem('adminProducts')
        }));
        
        this.showNotification('Đã đồng bộ dữ liệu với website chính!', 'success');
        this.updateLastSync();
    }

    updateStats() {
        const total = this.products.length;
        const active = this.products.filter(p => p.status === 'active').length;
        const onSale = this.products.filter(p => p.salePrice).length;
        const lowStock = this.products.filter(p => p.stock < 5).length;
        
        document.getElementById('totalProducts').textContent = total;
        document.getElementById('activeProducts').textContent = active;
        document.getElementById('saleProducts').textContent = onSale;
        document.getElementById('lowStock').textContent = lowStock;
    }

    updateProductCount() {
        document.getElementById('productCount').textContent = this.products.length;
        document.getElementById('sysProductCount').textContent = this.products.length;
    }

    updateOrderCount() {
        document.getElementById('orderCount').textContent = this.orders.length;
        document.getElementById('sysOrderCount').textContent = this.orders.length;
    }

    updateLastSync() {
        const lastSync = localStorage.getItem('adminLastSync');
        if (lastSync) {
            const time = new Date(parseInt(lastSync));
            document.getElementById('lastSync').textContent = 
                time.toLocaleTimeString('vi-VN');
        }
    }

    saveData() {
        localStorage.setItem('adminProducts', JSON.stringify(this.products));
        localStorage.setItem('adminOrders', JSON.stringify(this.orders));
        this.updateProductCount();

        // QUAN TRỌNG: Gửi sự kiện storage để website chính nhận được
        window.dispatchEvent(new StorageEvent('storage', {
            key: 'adminProducts',
            newValue: JSON.stringify(this.products),
            oldValue: localStorage.getItem('adminProducts')
        }));
    }

    generateId() {
        const ids = this.products.map(p => p.id);
        return ids.length > 0 ? Math.max(...ids) + 1 : 1;
    }

    formatPrice(price) {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + ' VNĐ';
    }

    showNotification(message, type = 'info') {
        const notification = document.getElementById('notification');
        notification.textContent = message;
        notification.className = `notification ${type}`;
        notification.style.display = 'flex';
        
        setTimeout(() => {
            notification.style.display = 'none';
        }, 3000);
    }

    setupTabNavigation() {
        // Tab switching
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const tabName = item.dataset.tab;
                
                // Remove active class from all items
                navItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                
                // Hide all tabs
                const tabs = document.querySelectorAll('.tab-content');
                tabs.forEach(tab => tab.classList.remove('active'));
                
                // Show selected tab
                const selectedTab = document.getElementById(tabName + 'Tab');
                if (selectedTab) {
                    selectedTab.classList.add('active');
                }
            });
        });
    }
}

// Enhanced setup for modals
document.addEventListener('DOMContentLoaded', function() {
    // Initialize admin
    const admin = new AdminManager();
    admin.setupTabNavigation();
    
    // Modal close handlers (general)
    const closeButtons = document.querySelectorAll('.modal-close, .close');
    closeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) modal.style.display = 'none';
        });
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        const modal = e.target;
        if (modal.classList.contains('modal')) {
            modal.style.display = 'none';
        }
    });
});

// Initialize admin manager
const admin = new AdminManager();
admin.setupTabNavigation();
