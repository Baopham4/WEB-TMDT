// =========================================== //
// KẾT NỐI ADMIN - WEBSITE CHÍNH (đã gộp)
// =========================================== //

const AdminConnector = {
    // Hàm định dạng giá
    formatPrice(price) {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    },
    
    // Lấy ảnh mặc định
    getDefaultImage(category) {
        const categoryMap = {
            "Vòng tay": "images/vongtay1.jpg",
            "Dây chuyền": "images/daychuyen1.jpg", 
            "Nhẫn": "images/nhan1.jpg",
            "Bông tai": "images/bongtai1.jpg",
            "Mặt dây chuyền": "images/daychuyen1.jpg",
            "Khác": "images/default-product.jpg"
        };
        return categoryMap[category] || "images/default-product.jpg";
    },
    
    // Đồng bộ sản phẩm từ admin
    syncProducts() {
        try {
            const adminProducts = localStorage.getItem('adminProducts');

            if (adminProducts) {
                const products = JSON.parse(adminProducts);

                if (Array.isArray(products) && products.length > 0) {
                    console.log('🔄 Syncing', products.length, 'products from admin');

                    // Chuyển đổi định dạng từ admin sang website
                    const convertedProducts = products.map(product => ({
                        id: product.id,
                        name: product.name,
                        description: product.description || "",
                        price: this.formatPrice(product.price) + " VNĐ",
                        image: product.image || this.getDefaultImage(product.category),
                        badge: product.salePrice ? "GIẢM GIÁ" : (product.badge || "MỚI"),
                        category: product.category,
                        material: product.details || "Ngọc phỉ thúy tự nhiên",
                        origin: "Myanmar",
                        warranty: product.category === "Vòng tay" ? "5 năm" : "3 năm",
                        certification: "GIA Certified",
                        salePrice: product.salePrice ? this.formatPrice(product.salePrice) + " VNĐ" : null,
                        stock: product.stock || 0,
                        status: product.status || "active"
                    }));

                    // CẬP NHẬT GLOBAL PRODUCTSDATA
                    if (!window.productsData) {
                        window.productsData = [];
                    }

                    // Xóa hết phần tử cũ và thêm mới
                    window.productsData.length = 0;
                    window.productsData.push(...convertedProducts);

                    console.log('✅ Cập nhật window.productsData:', window.productsData.length, 'sản phẩm');

                    // Kích hoạt sự kiện để các trang biết dữ liệu đã thay đổi
                    const event = new CustomEvent('productsSynced', {
                        detail: {
                            count: convertedProducts.length,
                            source: 'admin',
                            timestamp: Date.now()
                        }
                    });
                    window.dispatchEvent(event);
                    console.log('📡 Phát đi sự kiện productsSynced');

                    // Cập nhật UI nếu các trang đã tải
                    this.updateUI();

                    return true;
                }
            } else {
                console.log('ℹ️ Không có dữ liệu sản phẩm từ admin');
            }
        } catch (error) {
            console.error('❌ Lỗi đồng bộ:', error);
        }
        return false;
    },

    // Hàm cập nhật stock sau khi thêm vào giỏ hàng
    updateStockAfterCartChange(productId, quantityChange) {
        try {
            // Cập nhật stock trong window.productsData
            if (window.productsData) {
                const productIndex = window.productsData.findIndex(p => p.id == productId);
                if (productIndex >= 0) {
                    const currentStock = parseInt(window.productsData[productIndex].stock) || 0;
                    const newStock = Math.max(0, currentStock - quantityChange);
                    window.productsData[productIndex].stock = newStock;

                    console.log(`📦 Cập nhật stock cho sản phẩm ${productId}: ${currentStock} -> ${newStock}`);

                    // Phát sự kiện cập nhật stock
                    const stockEvent = new CustomEvent('stockUpdated', {
                        detail: {
                            productId: productId,
                            oldStock: currentStock,
                            newStock: newStock,
                            change: quantityChange
                        }
                    });
                    window.dispatchEvent(stockEvent);
                }
            }

            // Cập nhật stock trong localStorage adminProducts
            const adminProducts = localStorage.getItem('adminProducts');
            if (adminProducts) {
                const products = JSON.parse(adminProducts);
                const productIndex = products.findIndex(p => p.id == productId);

                if (productIndex >= 0) {
                    const currentStock = parseInt(products[productIndex].stock) || 0;
                    const newStock = Math.max(0, currentStock - quantityChange);
                    products[productIndex].stock = newStock;

                    // Lưu lại vào localStorage
                    localStorage.setItem('adminProducts', JSON.stringify(products));

                    console.log(`💾 Đã lưu stock mới vào adminProducts: ${productId} = ${newStock}`);
                }
            }
        } catch (error) {
            console.error('❌ Lỗi cập nhật stock:', error);
        }
    },

    // Hàm khôi phục stock khi xóa khỏi giỏ hàng
    restoreStockFromCart(productId, quantityToRestore) {
        try {
            // Cập nhật stock trong window.productsData
            if (window.productsData) {
                const productIndex = window.productsData.findIndex(p => p.id == productId);
                if (productIndex >= 0) {
                    const currentStock = parseInt(window.productsData[productIndex].stock) || 0;
                    const newStock = currentStock + quantityToRestore;
                    window.productsData[productIndex].stock = newStock;

                    console.log(`🔄 Khôi phục stock cho sản phẩm ${productId}: ${currentStock} -> ${newStock}`);
                }
            }

            // Cập nhật stock trong localStorage adminProducts
            const adminProducts = localStorage.getItem('adminProducts');
            if (adminProducts) {
                const products = JSON.parse(adminProducts);
                const productIndex = products.findIndex(p => p.id == productId);

                if (productIndex >= 0) {
                    const currentStock = parseInt(products[productIndex].stock) || 0;
                    const newStock = currentStock + quantityToRestore;
                    products[productIndex].stock = newStock;

                    // Lưu lại vào localStorage
                    localStorage.setItem('adminProducts', JSON.stringify(products));

                    console.log(`💾 Đã khôi phục stock trong adminProducts: ${productId} = ${newStock}`);
                }
            }
        } catch (error) {
            console.error('❌ Lỗi khôi phục stock:', error);
        }
    },
    
    // Cập nhật UI sau khi đồng bộ
    updateUI() {
        // Cập nhật trang sản phẩm (nếu đang ở trang products.html)
        if (typeof ProductsPage !== 'undefined' && ProductsPage.loadProducts) {
            ProductsPage.loadProducts();
            console.log('🔄 Đã cập nhật trang sản phẩm');
        }
        
        // Cập nhật trang chủ (nếu đang ở index.html)
        if (typeof HomePage !== 'undefined' && HomePage.loadProducts) {
            HomePage.loadProducts();
            console.log('🔄 Đã cập nhật trang chủ');
        }
        
        // Hiển thị thông báo
        if (typeof Core !== 'undefined' && Core.showNotification) {
            Core.showNotification('Đã cập nhật sản phẩm mới từ admin', 'success');
        }
    },
    
    // API để admin gọi khi cần refresh website
    refreshWebsite() {
        console.log('🔄 Admin yêu cầu refresh website');
        this.syncProducts();
        
        // Hiển thị thông báo
        if (typeof Core !== 'undefined' && Core.showNotification) {
            Core.showNotification('Website đã được cập nhật với dữ liệu mới nhất!', 'success');
        }
        
        return true;
    },
    
    // Khởi tạo
    init() {
        console.log('🔄 AdminConnector đang khởi động...');
        
        // Nếu là tab admin, không cần sync
        if (window.location.pathname.includes('/admin/')) {
            return;
        }
        
        // Chờ 500ms để đảm bảo DOM đã tải xong
        setTimeout(() => {
            this.syncProducts();
        }, 500);
        
        // Lắng nghe sự kiện từ admin
        window.addEventListener('storage', (event) => {
            if (event.key === 'adminProducts') {
                console.log('🔔 Nhận sự kiện từ localStorage:', event.key);
                setTimeout(() => this.syncProducts(), 100);
            }
        });
        
        // Kiểm tra cập nhật mỗi 2 giây
        setInterval(() => {
            const lastSync = localStorage.getItem('adminLastSync');
            const currentTime = Date.now();
            
            // Nếu có cập nhật trong 2 giây gần đây, thực hiện sync
            if (lastSync && (currentTime - parseInt(lastSync)) < 2000) {
                this.syncProducts();
            }
        }, 2000);
        
        console.log('✅ AdminConnector đã sẵn sàng');
    }
};

// Tự động khởi động khi trang tải
document.addEventListener('DOMContentLoaded', () => {
    AdminConnector.init();
});

// Làm cho AdminConnector có thể truy cập từ bất kỳ đâu
window.AdminConnector = AdminConnector;