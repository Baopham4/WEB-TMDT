// =========================================== //
// JAVASCRIPT CHUNG CHO CẢ 2 TRANG
// =========================================== //

import { studentInfo, productsData, newsData } from './sharedata.js';

// ⭐ CẬP NHẬT: TẠO WINDOW.PRODUCTSDATA ĐỂ CÓ THỂ CẬP NHẬT TỪ ADMIN
window.productsData = [...productsData];

// Biến toàn cục
let shoppingCart = JSON.parse(localStorage.getItem('shoppingCart')) || [];

// ============================ //
// CORE MODULE - CÁC HÀM CƠ BẢN
// ============================ //
const Core = {
    // Kiểm tra email hợp lệ
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },

    // Kiểm tra số điện thoại
    validatePhone(phone) {
        const phoneRegex = /^(0[0-9]{9,10})$/;
        return phoneRegex.test(phone);
    },

    // Format số tiền
    formatPrice(price) {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    },

    // Hiển thị thông báo
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        const icon = type === 'success' ? 'fa-check-circle' : 
                    type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle';
        
        notification.innerHTML = `
            <i class="fas ${icon}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        // Tự động ẩn sau 5 giây
        setTimeout(() => {
            notification.style.animation = 'slideInRight 0.4s ease-out reverse';
            setTimeout(() => notification.remove(), 400);
        }, 5000);
    },

    // Lưu giỏ hàng vào localStorage
    saveCartToStorage() {
        localStorage.setItem('shoppingCart', JSON.stringify(shoppingCart));
    },

    // Cập nhật số lượng giỏ hàng trên header
    updateCartCount() {
        const cartCounts = document.querySelectorAll('.cart-count');
        const currentCart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
        cartCounts.forEach(count => {
            count.textContent = currentCart.length;
        });
    },

    trackSession() {
        try{
            if(typeof sessionStorage!=='undefined'&&sessionStorage.getItem('session_tracked'))return;
            if(typeof sessionStorage!=='undefined')sessionStorage.setItem('session_tracked','1');
            const key='traffic_sessions';
            const current=Number(localStorage.getItem(key)||0);
            localStorage.setItem(key,String(current+1));
        }catch(e){}
    },

    trackProductView() {
        try{
            const key='traffic_productViews';
            const current=Number(localStorage.getItem(key)||0);
            localStorage.setItem(key,String(current+1));
        }catch(e){}
    }
};

// ============================ //
// HEADER MODULE
// ============================ //
const Header = {
    init() {
        this.setupMobileMenu();
        this.setupActiveNav();
        Core.updateCartCount();
    },

    setupMobileMenu() {
        const mobileBtn = document.getElementById('mobileMenuBtn');
        const navMenu = document.querySelector('.nav-menu');
        
        if (mobileBtn && navMenu) {
            mobileBtn.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                mobileBtn.innerHTML = navMenu.classList.contains('active') 
                    ? '<i class="fas fa-times"></i>' 
                    : '<i class="fas fa-bars"></i>';
            });
        }
    },

    setupActiveNav() {
        const currentPage = window.location.pathname.split('/').pop();
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const linkHref = link.getAttribute('href');
            
            if (linkHref === currentPage || 
                (currentPage === '' && linkHref === 'index.html') ||
                (currentPage === 'index.html' && linkHref === 'index.html')) {
                link.classList.add('active');
            }
        });
    }
};

// ============================ //
// FOOTER MODULE
// ============================ //
const Footer = {
    init() {
        this.updateCurrentYear();
        this.setupNewsletter();
    },

    updateCurrentYear() {
        const yearElement = document.getElementById('currentYear');
        if (yearElement) {
            yearElement.textContent = new Date().getFullYear();
        }
    },

    setupNewsletter() {
        const newsletterForms = document.querySelectorAll('#newsletterForm, #newsletterFormSidebar');
        
        newsletterForms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const emailInput = form.querySelector('input[type="email"]');
                const email = emailInput.value.trim();

                if (!Core.validateEmail(email)) {
                    Core.showNotification('Vui lòng nhập email hợp lệ', 'error');
                    return;
                }

                const submitBtn = form.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerHTML;

                // Hiệu ứng loading
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang xử lý...';
                submitBtn.disabled = true;

                // Giả lập gửi dữ liệu
                setTimeout(() => {
                    emailInput.value = '';
                    submitBtn.innerHTML = '<i class="fas fa-check"></i> Đã đăng ký!';
                    Core.showNotification('Đăng ký nhận bản tin thành công!', 'success');

                    // Reset sau 3 giây
                    setTimeout(() => {
                        submitBtn.innerHTML = originalText;
                        submitBtn.disabled = false;
                    }, 3000);
                }, 1500);
            });
        });
    }
};

// ============================ //
// TRANG CHỦ MODULE (index.html)
// ============================ //
const HomePage = {
    init() {
        if (!document.querySelector('.products-grid')) return;
        
        this.loadProducts();
        this.setupParticles();
        this.setupContactForm();
        this.setupScrollIndicator();
        
        // Lắng nghe sự kiện đồng bộ từ admin
        window.addEventListener('productsSynced', (event) => {
            console.log('🔄 Trang chủ nhận được tín hiệu đồng bộ, cập nhật sản phẩm');
            this.loadProducts();
            this.loadFeaturedProducts();
        });
    },

    loadProducts() {
        const productsContainer = document.getElementById('productsContainer');
        if (!productsContainer) return;
        
        let productsHTML = '';
        window.productsData.slice(0, 3).forEach(product => {
            productsHTML += `
                <div class="product-card" data-id="${product.id}">
                    ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
                    <div class="product-img-container">
                        <img src="${product.image}" alt="${product.name}" class="product-img" 
                             onerror="this.src='https://via.placeholder.com/400x300/00796B/FFFFFF?text=Phỉ+Thúy'">
                    </div>
                    <div class="product-info">
                        <h3 class="product-name">${product.name}</h3>
                        <p class="product-desc">${product.description}</p>
                        <p class="product-price">${product.price}</p>
                        <button class="product-link" onclick="HomePage.showProductModal(${product.id})">
                            <i class="fas fa-gem"></i> XEM CHI TIẾT
                        </button>
                    </div>
                </div>
            `;
        });
        
        productsContainer.innerHTML = productsHTML;
    },

    setupParticles() {
        if (typeof particlesJS !== 'undefined' && document.getElementById('particles-js')) {
            particlesJS("particles-js", {
                particles: {
                    number: { value: 80, density: { enable: true, value_area: 800 } },
                    color: { value: ["#d4af37", "#ffffff", "#80cbc4"] },
                    opacity: { value: 0.7, random: true },
                    size: { value: 3, random: true },
                    line_linked: { enable: true, distance: 150, color: "#d4af37", opacity: 0.2, width: 1 },
                    move: { enable: true, speed: 2, direction: "none" }
                }
            });
        }
    },

    setupContactForm() {
        const contactForm = document.getElementById('contactForm');
        if (!contactForm) return;

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = contactForm.querySelector('input[type="text"]').value.trim();
            const phone = contactForm.querySelector('input[type="tel"]').value.trim();
            const email = contactForm.querySelector('input[type="email"]').value.trim();
            const message = contactForm.querySelector('textarea').value.trim();
            
            // Validation
            if (!name || !phone || !email || !message) {
                Core.showNotification('Vui lòng điền đầy đủ thông tin', 'error');
                return;
            }
            
            if (!Core.validateEmail(email)) {
                Core.showNotification('Email không hợp lệ', 'error');
                return;
            }
            
            if (!Core.validatePhone(phone)) {
                Core.showNotification('Số điện thoại không hợp lệ', 'error');
                return;
            }
            
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            // Hiệu ứng loading
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> ĐANG GỬI...';
            submitBtn.disabled = true;
            
            // Giả lập gửi
            setTimeout(() => {
                contactForm.reset();
                submitBtn.innerHTML = '<i class="fas fa-check"></i> ĐÃ GỬI';
                Core.showNotification('Yêu cầu tư vấn đã được gửi thành công!', 'success');
                
                // Reset sau 3 giây
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }, 3000);
            }, 2000);
        });
    },

    setupScrollIndicator() {
        const scrollIndicator = document.querySelector('.scroll-indicator');
        if (scrollIndicator) {
            scrollIndicator.addEventListener('click', () => {
                window.scrollTo({
                    top: window.innerHeight,
                    behavior: 'smooth'
                });
            });
        }
    },

    showProductModal(productId) {
        if(window.Core&&Core.trackProductView)Core.trackProductView();
        const product = window.productsData.find(p => p.id === productId);
        if (!product) return;
        
        const modal = document.createElement('div');
        modal.className = 'product-modal active';
        modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <button class="modal-close"><i class="fas fa-times"></i></button>
                <div class="modal-body">
                    <div class="modal-image">
                        <img src="${product.image}" alt="${product.name}" 
                             onerror="this.src='https://via.placeholder.com/500x400/00796B/FFFFFF?text=Phỉ+Thúy'">
                    </div>
                    <div class="modal-info">
                        <h3>${product.name}</h3>
                        <p class="modal-description">${product.description}</p>
                        
                        <div class="modal-details">
                            <p><strong>Chất liệu:</strong> ${product.material}</p>
                            <p><strong>Xuất xứ:</strong> ${product.origin}</p>
                            <p><strong>Bảo hành:</strong> ${product.warranty}</p>
                            <p><strong>Kiểm định:</strong> ${product.certification}</p>
                        </div>
                        
                        <div class="modal-price">${product.price}</div>
                        
                        <div class="modal-buttons">
                            <button class="btn-primary" onclick="ProductsPage.addToCartFromButton(${product.id}); this.closest('.product-modal').classList.remove('active');">
                                <i class="fas fa-shopping-cart"></i> THÊM VÀO GIỎ
                            </button>
                            <button class="btn-secondary" onclick="Core.showNotification('Yêu cầu tư vấn đã được gửi!', 'success'); this.closest('.product-modal').classList.remove('active');">
                                <i class="fas fa-comments"></i> TƯ VẤN NGAY
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Setup close events
        const closeBtn = modal.querySelector('.modal-close');
        const overlay = modal.querySelector('.modal-overlay');
        
        const closeModal = () => modal.classList.remove('active');
        
        closeBtn.addEventListener('click', closeModal);
        overlay.addEventListener('click', closeModal);
        
        // Close on ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });
    },

    addToCart(productId) {
        const product = window.productsData.find(p => p.id === productId);
        if (product) {
            // Kiểm tra xem sản phẩm đã có trong giỏ chưa
            const existingItem = shoppingCart.find(item => item.id === productId);
            if (!existingItem) {
                const adminProduct = window.productsData?.find(p => p.id == productId);
                if (adminProduct && (parseInt(adminProduct.stock) || 0) <= 0) {
                    Core.showNotification('Sản phẩm đã hết hàng', 'error');
                    return;
                }
                const newItem = {...product, quantity: 1};
                shoppingCart.push(newItem);
                Core.saveCartToStorage();
                Core.updateCartCount();
                console.log('✅ Added to cart:', newItem);
                console.log('📦 Cart now has', shoppingCart.length, 'items');
                Core.showNotification(`Đã thêm "${product.name}" vào giỏ hàng`, 'success');
                if (typeof AdminConnector !== 'undefined') {
                    AdminConnector.updateStockAfterCartChange(productId, 1);
                }
            } else {
                Core.showNotification(`"${product.name}" đã có trong giỏ hàng`, 'info');
            }
        } else {
            console.log('❌ Product not found:', productId);
        }
    }
};

// ============================ //
// TRANG SẢN PHẨM MODULE
// ============================ //
const ProductsPage = {
    pageSize: 9,
    currentPage: 1,

    init() {
        if (!document.querySelector('.products-grid')) return;
        
        this.loadProducts();
        this.setupFilters();
        this.setupSorting();
        this.setupViewToggle();
        this.setupSearch();
        this.loadFeaturedProducts();
        
        // Lắng nghe sự kiện đồng bộ từ admin
        window.addEventListener('productsSynced', (event) => {
            console.log('🔄 Trang sản phẩm nhận được tín hiệu đồng bộ, cập nhật sản phẩm');
            this.loadProducts();
            this.loadFeaturedProducts();
            this.updateFilterCounts();
        });
    },

    loadProducts() {
        const productsGrid = document.getElementById('productsGrid');
        const productsList = document.getElementById('productsList');
        
        if (!productsGrid || !productsList) return;
        
        let gridHTML = '';
        let listHTML = '';
        
        window.productsData.forEach(product => {
            // Grid view
            gridHTML += `
                <div class="product-card" data-id="${product.id}" 
                     data-category="${product.category}" 
                     data-material="${product.material}" 
                     data-origin="${product.origin}" 
                     data-price="${this.extractPrice(product.price)}">
                    ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
                    <div class="product-img-container">
                        <img src="${product.image}" alt="${product.name}" class="product-img"
                             onerror="this.src='https://via.placeholder.com/400x300/00796B/FFFFFF?text=Phỉ+Thúy'">
                    </div>
                    <div class="product-info">
                        <h3 class="product-name">${product.name}</h3>
                        <p class="product-desc">${product.description}</p>
                        <p class="product-price">${product.price}</p>
                        <div class="product-actions">
                            <button class="product-link" onclick="ProductsPage.showProductModal(${product.id})">
                                <i class="fas fa-gem"></i> XEM CHI TIẾT
                            </button>
                            <button class="product-cart-btn" onclick="ProductsPage.addToCartFromButton(${product.id})">
                                <i class="fas fa-cart-plus"></i> THÊM GIỎ HÀNG
                            </button>
                        </div>
                    </div>
                </div>
            `;
            
            // List view
            listHTML += `
                <div class="product-list-item" data-id="${product.id}" 
                     data-category="${product.category}" 
                     data-material="${product.material}" 
                     data-origin="${product.origin}" 
                     data-price="${this.extractPrice(product.price)}">
                    <img src="${product.image}" alt="${product.name}"
                         onerror="this.src='https://via.placeholder.com/200x200/00796B/FFFFFF?text=Phỉ+Thúy'">
                    <div class="product-list-info">
                        <h3>${product.name}</h3>
                        <p class="description">${product.description}</p>
                        <div class="product-list-meta">
                            <span><i class="fas fa-gem"></i> ${product.category}</span>
                            <span><i class="fas fa-map-marker-alt"></i> ${product.origin}</span>
                            <span><i class="fas fa-shield-alt"></i> ${product.warranty}</span>
                        </div>
                        <div class="product-list-price">${product.price}</div>
                        <div class="product-list-actions">
                            <button class="btn-primary" onclick="ProductsPage.showProductModal(${product.id})">
                                <i class="fas fa-eye"></i> Xem chi tiết
                            </button>
                            <button class="btn-secondary" onclick="ProductsPage.addToCartFromButton(${product.id})">
                                <i class="fas fa-cart-plus"></i> Thêm giỏ hàng
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });
        
        productsGrid.innerHTML = gridHTML;
        productsList.innerHTML = listHTML;

        // Mặc định: tất cả sản phẩm đều đang được hiển thị (trước khi lọc)
        document.querySelectorAll('.product-card, .product-list-item').forEach(el=>{
            el.dataset.filterVisible = '1';
        });

        this.currentPage = 1;
        this.applyPagination();
    },

    // HÀM MỚI: Thêm sản phẩm vào giỏ hàng từ nút bấm
    addToCartFromButton(productId) {
        console.log('🛒 Adding product to cart:', productId);
        
        const product = window.productsData.find(p => p.id == productId);
        if (!product) {
            console.error('❌ Product not found:', productId);
            alert('Không tìm thấy sản phẩm!');
            return;
        }
        
        // Lấy giỏ hàng hiện tại
        let shoppingCart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
        
        // Kiểm tra xem sản phẩm đã có trong giỏ chưa
        const existingIndex = shoppingCart.findIndex(item => item.id == productId);
        
        if (existingIndex >= 0) {
            // Tăng số lượng nếu đã có
            const adminProduct = window.productsData?.find(p => p.id == productId);
            const available = adminProduct ? (parseInt(adminProduct.stock) || 0) : 0;
            if (available <= 0) {
                alert('Sản phẩm đã hết hàng!');
                return;
            }
            shoppingCart[existingIndex].quantity = (shoppingCart[existingIndex].quantity || 1) + 1;
            if (typeof AdminConnector !== 'undefined') {
                AdminConnector.updateStockAfterCartChange(productId, 1);
            }
        } else {
            // Thêm mới
            const productToAdd = {
                ...product,
                quantity: 1
            };
            shoppingCart.push(productToAdd);
            if (typeof AdminConnector !== 'undefined') {
                AdminConnector.updateStockAfterCartChange(productId, 1);
            }
        }
        
        // Lưu vào localStorage
        localStorage.setItem('shoppingCart', JSON.stringify(shoppingCart));
        
        // Cập nhật UI
        if (typeof Core !== 'undefined' && Core.updateCartCount) {
            Core.updateCartCount();
        }
        
        // Hiển thị thông báo
        alert(`✅ Đã thêm "${product.name}" vào giỏ hàng!`);
        console.log('📦 Cart updated:', shoppingCart);
    },

    loadFeaturedProducts() {
        const featuredList = document.getElementById('featuredProducts');
        if (!featuredList) return;
        
        let html = '';
        // Lấy 3 sản phẩm đầu tiên làm featured
        window.productsData.slice(0, 3).forEach(product => {
            html += `
                <div class="featured-product" onclick="ProductsPage.showProductModal(${product.id})">
                    <img src="${product.image}" alt="${product.name}"
                         onerror="this.src='https://via.placeholder.com/60x60/00796B/FFFFFF?text=P'">
                    <div class="featured-product-info">
                        <h4>${product.name}</h4>
                        <p class="price">${product.price}</p>
                    </div>
                </div>
            `;
        });
        
        featuredList.innerHTML = html;
    },

    setupFilters() {
        const applyBtn = document.getElementById('applyFilters');
        const resetBtn = document.getElementById('resetFilters');
        
        if (!applyBtn) return;
        
        // Cập nhật số lượng filter counts
        this.updateFilterCounts();
        
        // Apply filters
        applyBtn.addEventListener('click', () => {
            this.filterProducts();
        });
        
        // Reset filters
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                document.querySelectorAll('.filter-option input').forEach(checkbox => {
                    checkbox.checked = false;
                });
                
                // Check first category by default
                const firstCategory = document.querySelector('input[name="category"]');
                if (firstCategory) firstCategory.checked = true;
                
                this.filterProducts();
                Core.showNotification('Đã đặt lại bộ lọc', 'success');
            });
        }
    },

    updateFilterCounts() {
        // Cập nhật số lượng cho từng danh mục
        const categories = ['Vòng tay', 'Nhẫn', 'Dây chuyền', 'Bông tai', 'Mặt ngọc'];
        
        categories.forEach(category => {
            const count = window.productsData.filter(p => p.category === category).length;
            const checkbox = document.querySelector(`input[name="category"][value="${category}"]`);
            if (checkbox) {
                const filterCount = checkbox.closest('.filter-option').querySelector('.filter-count');
                if (filterCount) {
                    filterCount.textContent = count;
                }
            }
        });
    },

    setupSorting() {
        const sortSelect = document.getElementById('sortBy');
        if (!sortSelect) return;
        
        sortSelect.addEventListener('change', (e) => {
            this.sortProducts(e.target.value);
        });
    },

    setupViewToggle() {
        const viewBtns = document.querySelectorAll('.view-btn');
        const productsGrid = document.getElementById('productsGrid');
        const productsList = document.getElementById('productsList');
        
        if (!viewBtns.length) return;
        
        viewBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                viewBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const view = btn.dataset.view;
                if (view === 'grid') {
                    productsGrid.classList.add('active');
                    productsList.classList.remove('active');
                } else {
                    productsList.classList.add('active');
                    productsGrid.classList.remove('active');
                }
            });
        });
    },

    setupSearch() {
        const searchInput = document.getElementById('productSearch');
        const searchBtn = document.querySelector('.search-btn');
        
        if (!searchInput) return;
        
        const performSearch = () => {
            const searchTerm = searchInput.value.toLowerCase().trim();
            if (searchTerm.length < 2) {
                Core.showNotification('Vui lòng nhập ít nhất 2 ký tự', 'info');
                return;
            }
            
            const products = document.querySelectorAll('.product-card, .product-list-item');
            let foundCount = 0;
            
            products.forEach(product => {
                const name = product.querySelector('.product-name, h3')?.textContent.toLowerCase();
                const desc = product.querySelector('.product-desc, .description')?.textContent.toLowerCase();
                const match = (name && name.includes(searchTerm)) || (desc && desc.includes(searchTerm));
                
                if (match) {
                    product.dataset.filterVisible = '1';
                    foundCount++;
                } else {
                    product.dataset.filterVisible = '0';
                }
            });
            
            this.currentPage = 1;
            this.applyPagination();
            Core.showNotification(`Tìm thấy ${foundCount} sản phẩm`, foundCount > 0 ? 'success' : 'info');
        };
        
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') performSearch();
        });
        
        if (searchBtn) {
            searchBtn.addEventListener('click', performSearch);
        }
    },

    filterProducts() {
        const selectedCategories = Array.from(document.querySelectorAll('input[name="category"]:checked'))
            .map(cb => cb.value);
        
        const selectedMaterials = Array.from(document.querySelectorAll('input[name="material"]:checked'))
            .map(cb => cb.value);
        
        const selectedOrigins = Array.from(document.querySelectorAll('input[name="origin"]:checked'))
            .map(cb => cb.value);
        
        const minPrice = parseInt(document.getElementById('priceMin')?.value || 0);
        const maxPrice = parseInt(document.getElementById('priceMax')?.value || 500000000);
        
        const products = document.querySelectorAll('.product-card, .product-list-item');
        let visibleCount = 0;
        
        products.forEach(product => {
            const category = product.dataset.category;
            const material = product.dataset.material;
            const origin = product.dataset.origin;
            const price = parseFloat(product.dataset.price);
            
            const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(category);
            const materialMatch = selectedMaterials.length === 0 || selectedMaterials.includes(material);
            const originMatch = selectedOrigins.length === 0 || selectedOrigins.includes(origin);
            const priceMatch = price >= minPrice && price <= maxPrice;
            
            if (categoryMatch && materialMatch && originMatch && priceMatch) {
                product.dataset.filterVisible = '1';
                visibleCount++;
            } else {
                product.dataset.filterVisible = '0';
            }
        });
        
        this.currentPage = 1;
        this.applyPagination();
        Core.showNotification(`Hiển thị ${visibleCount} sản phẩm`, 'info');
    },

    sortProducts(sortBy) {
        const isGridView = document.querySelector('.view-btn[data-view="grid"]')?.classList.contains('active');
        const container = isGridView ? document.getElementById('productsGrid') : document.getElementById('productsList');
        const products = Array.from(container.children);
        
        products.sort((a, b) => {
            const aPrice = parseFloat(a.dataset.price);
            const bPrice = parseFloat(b.dataset.price);
            const aName = a.querySelector('.product-name, h3').textContent;
            const bName = b.querySelector('.product-name, h3').textContent;
            
            switch(sortBy) {
                case 'price-asc':
                    return aPrice - bPrice;
                case 'price-desc':
                    return bPrice - aPrice;
                case 'name-asc':
                    return aName.localeCompare(bName);
                case 'name-desc':
                    return bName.localeCompare(aName);
                default:
                    return parseInt(a.dataset.id) - parseInt(b.dataset.id);
            }
        });
        
        // Reorder products
        products.forEach(product => container.appendChild(product));
        this.applyPagination();
    },

    showProductModal(productId) {
        HomePage.showProductModal(productId);
    },

    addToCart(productId) {
        HomePage.addToCart(productId);
    },

    extractPrice(priceString) {
        const num = priceString.replace(/[^0-9]/g, '');
        return parseInt(num) || 0;
    },

    formatPrice(price) {
        return new Intl.NumberFormat('vi-VN').format(price);
    },

    updateProductsCount(count) {
        const countElement = document.getElementById('productsCount');
        if (countElement) {
            const totalCount = count || document.querySelectorAll('.product-card[style*="block"], .product-card:not([style])').length;
            countElement.textContent = totalCount;
        }
    },

    applyPagination() {
        const cards = Array.from(document.querySelectorAll('.product-card'));
        const lists = Array.from(document.querySelectorAll('.product-list-item'));
        if (!cards.length && !lists.length) return;

        const filteredIndices = [];
        cards.forEach((el, idx)=>{
            if (el.dataset.filterVisible !== '0') filteredIndices.push(idx);
        });

        const totalVisible = filteredIndices.length;
        const totalPages = Math.max(1, Math.ceil(totalVisible / this.pageSize));
        if (this.currentPage > totalPages) this.currentPage = totalPages;

        const start = (this.currentPage - 1) * this.pageSize;
        const end = start + this.pageSize;

        const indexToPos = {};
        filteredIndices.forEach((idx,pos)=>{indexToPos[idx]=pos;});

        cards.forEach((el, idx)=>{
            const pos = indexToPos[idx];
            const show = typeof pos !== 'undefined' && pos >= start && pos < end;
            el.style.display = show ? '' : 'none';
        });
        lists.forEach((el, idx)=>{
            const pos = indexToPos[idx];
            const show = typeof pos !== 'undefined' && pos >= start && pos < end;
            el.style.display = show ? '' : 'none';
        });

        this.updateProductsCount(totalVisible);
        this.renderPagination(totalPages);
    },

    renderPagination(totalPages){
        const pag = document.querySelector('.pagination');
        if (!pag) return;
        let html = '';
        html += `<a href="#" class="page-link prev" data-page="prev"><i class="fas fa-chevron-left"></i></a>`;
        for (let i=1;i<=totalPages;i++){
            html += `<a href="#" class="page-link ${i===this.currentPage?'active':''}" data-page="${i}">${i}</a>`;
        }
        html += `<a href="#" class="page-link next" data-page="next"><i class="fas fa-chevron-right"></i></a>`;
        pag.innerHTML = html;
        pag.querySelectorAll('.page-link').forEach(link=>{
            link.addEventListener('click',e=>{
                e.preventDefault();
                const v = link.dataset.page;
                if (v==='prev' && this.currentPage>1) this.currentPage--;
                else if (v==='next' && this.currentPage<totalPages) this.currentPage++;
                else if (!isNaN(parseInt(v))) this.currentPage=parseInt(v);
                this.applyPagination();
            });
        });
    }
};

// ============================ //
// TRANG GIỎ HÀNG MODULE
// ============================ //
const CartPage = {
    init() {
        if (!document.querySelector('.cart-container')) return;
        
        this.loadCartItems();
        this.setupCartEvents();
        this.setupCheckout();
        this.updateCartSummary();
    },

    loadCartItems() {
        const cartItemsContainer = document.getElementById('cartItems');
        const emptyCart = document.getElementById('emptyCart');
        const cartWithItems = document.getElementById('cartWithItems');
        
        if (!cartItemsContainer) return;
        
        if (shoppingCart.length === 0) {
            if (emptyCart) emptyCart.style.display = 'block';
            if (cartWithItems) cartWithItems.style.display = 'none';
            return;
        }
        
        if (emptyCart) emptyCart.style.display = 'none';
        if (cartWithItems) cartWithItems.style.display = 'block';
        
        let cartHTML = '';
        shoppingCart.forEach((item, index) => {
            cartHTML += `
                <div class="cart-item" data-index="${index}">
                    <img src="${item.image}" alt="${item.name}"
                         onerror="this.src='https://via.placeholder.com/120x120/00796B/FFFFFF?text=SP'">
                    <div class="cart-item-info">
                        <h3 class="cart-item-title">${item.name}</h3>
                        <p class="cart-item-desc">${item.description}</p>
                        <div class="cart-item-meta">
                            <span><i class="fas fa-gem"></i> ${item.category}</span>
                            <span><i class="fas fa-map-marker-alt"></i> ${item.origin}</span>
                            <span><i class="fas fa-award"></i> ${item.certification}</span>
                        </div>
                        <div class="cart-item-actions">
                            <div class="quantity-control">
                                <button class="quantity-btn minus" onclick="CartPage.updateQuantity(${index}, -1)">-</button>
                                <input type="text" class="quantity-input" value="${item.quantity || 1}" readonly>
                                <button class="quantity-btn plus" onclick="CartPage.updateQuantity(${index}, 1)">+</button>
                            </div>
                            <div class="cart-item-price">${item.price}</div>
                        </div>
                    </div>
                    <button class="remove-item" onclick="CartPage.removeItem(${index})">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;
        });
        
        cartItemsContainer.innerHTML = cartHTML;
        this.updateCartItemCount();
    },

    setupCartEvents() {
        // Clear cart
        const clearCartBtn = document.getElementById('clearCart');
        if (clearCartBtn) {
            clearCartBtn.addEventListener('click', () => {
                if (confirm('Bạn có chắc chắn muốn xóa tất cả sản phẩm khỏi giỏ hàng?')) {
                    shoppingCart.length = 0;
                    Core.saveCartToStorage();
                    Core.updateCartCount();
                    this.loadCartItems();
                    this.updateCartSummary();
                    Core.showNotification('Đã xóa tất cả sản phẩm', 'success');
                }
            });
        }
        
        // Update cart
        const updateCartBtn = document.getElementById('updateCart');
        if (updateCartBtn) {
            updateCartBtn.addEventListener('click', () => {
                Core.showNotification('Giỏ hàng đã được cập nhật', 'success');
            });
        }
        
        // Coupon
        const applyCouponBtn = document.getElementById('applyCoupon');
        const couponCodeInput = document.getElementById('couponCode');
        const couponTags = document.querySelectorAll('.coupon-tag');
        
        if (applyCouponBtn) {
            applyCouponBtn.addEventListener('click', () => {
                const code = couponCodeInput.value.trim();
                if (!code) {
                    Core.showNotification('Vui lòng nhập mã giảm giá', 'error');
                    return;
                }
                
                this.applyCoupon(code);
            });
        }
        
        couponTags.forEach(tag => {
            tag.addEventListener('click', () => {
                const code = tag.dataset.code;
                if (couponCodeInput) couponCodeInput.value = code;
                this.applyCoupon(code);
            });
        });
        
        // Shipping options
        const shippingOptions = document.querySelectorAll('input[name="shipping"]');
        shippingOptions.forEach(option => {
            option.addEventListener('change', () => {
                this.updateCartSummary();
            });
        });
    },

    setupCheckout() {
        const checkoutBtn = document.getElementById('checkoutBtn');
        if (!checkoutBtn) return;
        
        checkoutBtn.addEventListener('click', () => {
            if (shoppingCart.length === 0) {
                Core.showNotification('Giỏ hàng trống. Vui lòng thêm sản phẩm!', 'error');
                return;
            }
            
            const selectedPayment = document.querySelector('input[name="payment"]:checked')?.value || 'cod';
            
            // Show checkout modal
            this.showCheckoutModal(selectedPayment);
        });
    },

    showCheckoutModal(paymentMethod) {
        const modal = document.createElement('div');
        modal.className = 'product-modal active';
        modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <button class="modal-close"><i class="fas fa-times"></i></button>
                <div class="modal-checkout">
                    <i class="fas fa-check-circle"></i>
                    <h2>ĐẶT HÀNG THÀNH CÔNG!</h2>
                    
                    <div class="order-summary-modal">
                        <h3><i class="fas fa-receipt"></i> Thông tin đơn hàng</h3>
                        <p><strong>Mã đơn hàng:</strong> DH${Date.now().toString().slice(-8)}</p>
                        <p><strong>Số lượng sản phẩm:</strong> ${shoppingCart.length}</p>
                        <p><strong>Phương thức thanh toán:</strong> ${this.getPaymentMethodName(paymentMethod)}</p>
                        <p><strong>Tổng tiền:</strong> <span id="modalTotal">${this.calculateTotal()}</span></p>
                        <p><strong>Trạng thái:</strong> <span class="status-processing">Đang xử lý</span></p>
                    </div>
                    
                    <p>Cảm ơn bạn đã mua hàng! Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.</p>
                    
                    <div class="checkout-buttons">
                        <button class="btn-primary" onclick="CartPage.completeCheckout()">
                            <i class="fas fa-home"></i> VỀ TRANG CHỦ
                        </button>
                        <button class="btn-secondary" onclick="CartPage.printOrder()">
                            <i class="fas fa-print"></i> IN HÓA ĐƠN
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Setup close events
        const closeBtn = modal.querySelector('.modal-close');
        const overlay = modal.querySelector('.modal-overlay');
        
        const closeModal = () => modal.classList.remove('active');
        
        closeBtn.addEventListener('click', closeModal);
        overlay.addEventListener('click', closeModal);
    },

    completeCheckout() {
        // Clear cart after successful checkout
        shoppingCart.length = 0;
        Core.saveCartToStorage();
        Core.updateCartCount();
        
        // Close modal
        const modal = document.querySelector('.product-modal.active');
        if (modal) modal.classList.remove('active');
        
        // Redirect to home page
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 500);
    },

    printOrder() {
        window.print();
    },

    updateQuantity(index, change) {
        if (shoppingCart[index]) {
            const item = shoppingCart[index];
            const oldQuantity = item.quantity || 1;
            const newQuantity = oldQuantity + change;
            if (change > 0) {
                const adminProduct = window.productsData?.find(p => p.id == item.id);
                const available = adminProduct ? (parseInt(adminProduct.stock) || 0) : 0;
                if (change > available) {
                    Core.showNotification(`Chỉ còn ${available} sản phẩm trong kho`, 'error');
                    return;
                }
            }
            if (newQuantity > 0) {
                shoppingCart[index].quantity = newQuantity;
                if (typeof AdminConnector !== 'undefined') {
                    if (change > 0) {
                        AdminConnector.updateStockAfterCartChange(item.id, change);
                    } else if (change < 0) {
                        AdminConnector.restoreStockFromCart(item.id, Math.abs(change));
                    }
                }
                Core.saveCartToStorage();
                this.loadCartItems();
                this.updateCartSummary();
                Core.showNotification('Đã cập nhật số lượng', 'success');
            } else {
                this.removeItem(index);
            }
        }
    },

    removeItem(index) {
        if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
            const item = shoppingCart[index];
            const qty = item?.quantity || 1;
            if (typeof AdminConnector !== 'undefined') {
                AdminConnector.restoreStockFromCart(item.id, qty);
            }
            shoppingCart.splice(index, 1);
            Core.saveCartToStorage();
            Core.updateCartCount();
            this.loadCartItems();
            this.updateCartSummary();
            Core.showNotification('Đã xóa sản phẩm khỏi giỏ hàng', 'success');
        }
    },

    applyCoupon(code) {
        let discount = 0;
        let message = '';
        
        switch(code.toUpperCase()) {
            case 'WELCOME10':
                discount = 0.1;
                message = 'Áp dụng thành công mã WELCOME10 - Giảm 10%';
                break;
            case 'FREESHIP':
                document.querySelector('input[name="shipping"][value="free"]').checked = true;
                message = 'Áp dụng thành công mã FREESHIP - Miễn phí vận chuyển';
                break;
            case 'VIP20':
                discount = 0.2;
                message = 'Áp dụng thành công mã VIP20 - Giảm 20%';
                break;
            default:
                Core.showNotification('Mã giảm giá không hợp lệ', 'error');
                return;
        }
        
        // Save discount to localStorage for persistence
        localStorage.setItem('appliedCoupon', JSON.stringify({ code, discount }));
        this.updateCartSummary();
        Core.showNotification(message, 'success');
    },

    updateCartSummary() {
        // Calculate subtotal
        let subtotal = 0;
        shoppingCart.forEach(item => {
            const price = this.extractPrice(item.price);
            const quantity = item.quantity || 1;
            subtotal += price * quantity;
        });
        
        // Calculate shipping
        const selectedShipping = document.querySelector('input[name="shipping"]:checked');
        let shippingFee = 30000; // Mặc định
        
        if (selectedShipping) {
            switch(selectedShipping.value) {
                case 'standard':
                    shippingFee = 30000;
                    break;
                case 'express':
                    shippingFee = 60000;
                    break;
                case 'free':
                    shippingFee = 0;
                    break;
            }
        }
        
        // Calculate discount
        let discountAmount = 0;
        const couponData = localStorage.getItem('appliedCoupon');
        if (couponData) {
            const { discount } = JSON.parse(couponData);
            discountAmount = subtotal * discount;
        }
        
        // Calculate total
        const total = subtotal + shippingFee - discountAmount;
        
        // Update DOM
        const subtotalEl = document.getElementById('subtotal');
        const shippingFeeEl = document.getElementById('shippingFee');
        const discountEl = document.getElementById('discount');
        const totalEl = document.getElementById('totalAmount');
        
        if (subtotalEl) subtotalEl.textContent = this.formatPrice(subtotal) + ' VNĐ';
        if (shippingFeeEl) shippingFeeEl.textContent = this.formatPrice(shippingFee) + ' VNĐ';
        if (discountEl) discountEl.textContent = '-' + this.formatPrice(discountAmount) + ' VNĐ';
        if (totalEl) totalEl.textContent = this.formatPrice(total) + ' VNĐ';
        
        // Update cart item count
        this.updateCartItemCount();
    },

    updateCartItemCount() {
        const countElement = document.getElementById('cartItemCount');
        if (countElement) {
            let totalItems = 0;
            shoppingCart.forEach(item => {
                totalItems += item.quantity || 1;
            });
            countElement.textContent = totalItems;
        }
    },

    getPaymentMethodName(method) {
        const methods = {
            'cod': 'Thanh toán khi nhận hàng',
            'banking': 'Chuyển khoản ngân hàng',
            'momo': 'Ví điện tử MoMo',
            'credit': 'Thẻ tín dụng/ghi nợ'
        };
        return methods[method] || 'Chưa chọn';
    },

    calculateTotal() {
        let total = 0;
        shoppingCart.forEach(item => {
            const price = this.extractPrice(item.price);
            const quantity = item.quantity || 1;
            total += price * quantity;
        });
        return this.formatPrice(total) + ' VNĐ';
    },

    extractPrice(priceString) {
        return ProductsPage.extractPrice(priceString);
    },

    formatPrice(price) {
        return ProductsPage.formatPrice(price);
    }
};

// ============================ //
// BACK TO TOP FUNCTIONALITY
// ============================ //
const BackToTop = {
    init() {
        const backToTopBtn = document.getElementById('backToTop');
        if (!backToTopBtn) return;
        
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });
        
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
};

// ============================ //
// POPUP MODULE (THÔNG TIN SINH VIÊN)
// ============================ //
const Popup = {
    init() {
        // Chỉ hiển thị popup lần đầu
        if (!localStorage.getItem('studentPopupShown')) {
            setTimeout(() => {
                this.showPopup();
            }, 1000);
        }
    },

    showPopup() {
        const popup = document.createElement('div');
        popup.className = 'student-popup active';
        popup.id = 'studentPopup';
        
        popup.innerHTML = `
            <div class="popup-content">
                <div class="popup-header">
                    <h3><i class="fas fa-user-graduate"></i> THÔNG TIN SINH VIÊN</h3>
                </div>
                <div class="popup-body">
                    <div class="student-info-popup">
                        <p><strong>Họ tên:</strong> ${studentInfo.name}</p>
                        <p><strong>MSSV:</strong> ${studentInfo.mssv}</p>
                        <p><strong>Lớp:</strong> ${studentInfo.class}</p>
                        <p><strong>Môn học:</strong> ${studentInfo.subject}</p>
                        <p><strong>Dự án:</strong> ${studentInfo.project}</p>
                    </div>
                </div>
                <div class="popup-footer">
                    <button class="popup-close-btn" id="popupCloseBtn">ĐÃ HIỂU</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(popup);
        this.setupPopupEvents();
    },

    setupPopupEvents() {
        const popup = document.getElementById('studentPopup');
        const closeBtn = document.getElementById('popupCloseBtn');
        
        if (!popup || !closeBtn) return;
        
        // Đóng khi click nút
        closeBtn.addEventListener('click', () => this.closePopup(popup));
        
        // Đóng khi click bên ngoài
        popup.addEventListener('click', (e) => {
            if (e.target === popup) {
                this.closePopup(popup);
            }
        });
        
        // Đóng bằng phím ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && popup.classList.contains('active')) {
                this.closePopup(popup);
            }
        });
    },

    closePopup(popup) {
        popup.classList.remove('active');
        localStorage.setItem('studentPopupShown', 'true');
        
        setTimeout(() => {
            if (popup.parentNode) {
                popup.remove();
            }
        }, 300);
    }
};

// ============================ //
// INITIALIZE ALL MODULES
// ============================ //
document.addEventListener('DOMContentLoaded', function() {
    console.log('Website đã tải thành công!');
    console.log(`Sinh viên: ${studentInfo.name} - MSSV: ${studentInfo.mssv}`);
    
    // Khởi tạo các module chung
    Header.init();
    Footer.init();
    Popup.init();
    BackToTop.init();
    
    // Cập nhật số lượng giỏ hàng
    Core.updateCartCount();
    if(Core.trackSession)Core.trackSession();
    
    // Kiểm tra và đồng bộ dữ liệu sản phẩm
    if (!window.productsData || window.productsData.length === 0) {
        const savedProducts = localStorage.getItem('adminProducts');
        if (savedProducts) {
            window.productsData = JSON.parse(savedProducts);
            console.log('📦 Loaded products from localStorage:', window.productsData.length);
        } else {
            console.log('📦 Using default products from sharedata.js');
        }
    }

    try{
        if(window.productsData && window.productsData.length){
            localStorage.setItem('websiteProducts', JSON.stringify(window.productsData));
        }
    }catch(e){}
    
    console.log('📊 All products:', window.productsData);
    
    // Khởi tạo module cho trang cụ thể
    const isHomePage = document.querySelector('.hero-section');
    const isProductsPage = document.querySelector('.products-container');
    const isCartPage = document.querySelector('.checkout-wrapper');
    
    if (isHomePage) {
        HomePage.init();
        console.log('Đã khởi tạo trang chủ');
    }
    
    if (isProductsPage) {
        ProductsPage.init();
        console.log('Đã khởi tạo trang sản phẩm');
    }
    
    if (isCartPage) {
        console.log('Đã nhận diện trang checkout');
        // CartPage sẽ được xử lý riêng trong checkout
    }
});

// ============================ //
// GLOBAL EXPORTS
// ============================ //
window.Core = Core;
window.HomePage = HomePage;
window.ProductsPage = ProductsPage;
window.CartPage = CartPage;

// ============================ //
// QUAN TRỌNG: LẮNG NGHE SỰ KIỆN ĐỒNG BỘ TỪ ADMIN
// ============================ //

// Lắng nghe sự kiện đồng bộ từ admin
window.addEventListener('productsSynced', function(e) {
    console.log('📦 Nhận sự kiện đồng bộ:', e.detail.count, 'sản phẩm');
    
    // Reload các component hiển thị sản phẩm
    if (typeof ProductsPage !== 'undefined' && ProductsPage.loadProducts) {
        ProductsPage.loadProducts();
    }
    
    if (typeof HomePage !== 'undefined' && HomePage.loadFeaturedProducts) {
        HomePage.loadFeaturedProducts();
    }
    
    // Hiển thị thông báo
    if (typeof Core !== 'undefined' && Core.showNotification) {
        Core.showNotification(`Đã cập nhật ${e.detail.count} sản phẩm mới từ admin`, 'success');
    }
});

// Thêm nút admin trên header (chỉ hiển thị cho admin)
function addAdminButton() {
    const header = document.querySelector('header');
    if (!header) return;
    
    // Chỉ hiện với tài khoản admin đang đăng nhập
    let currentUser = null;
    try {
        if (window.Auth && Auth.current) {
            currentUser = Auth.current();
        } else {
            currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
        }
    } catch (e) {
        currentUser = null;
    }
    if (!currentUser || currentUser.role !== 'admin') return;
    
    const hasAdminData = localStorage.getItem('adminProducts') !== null;
    
    if (hasAdminData) {
        const adminBtn = document.createElement('a');
        adminBtn.href = 'admin/';
        adminBtn.className = 'admin-access-btn';
        adminBtn.innerHTML = '<i class="fas fa-cog"></i> Admin';
        adminBtn.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #2C3E50;
            color: white;
            padding: 10px 15px;
            border-radius: 50px;
            text-decoration: none;
            font-size: 0.9rem;
            z-index: 999;
            box-shadow: 0 3px 10px rgba(0,0,0,0.2);
            display: flex;
            align-items: center;
            gap: 8px;
        `;
        
        document.body.appendChild(adminBtn);
    }
}

// Thêm nút admin khi load
document.addEventListener('DOMContentLoaded', addAdminButton);

console.log('✅ Tất cả modules đã được tải');
