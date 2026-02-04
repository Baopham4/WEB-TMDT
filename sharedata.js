// =========================================== //
// DỮ LIỆU CHUNG CHO WEBSITE PHỈ THÚY CHI BẢO
// =========================================== //

// Thông tin sinh viên
const studentInfo = {
    name: "Phạm Quốc Bảo",
    mssv: "2274802010049",
    class: "DHTMDTT/TT",
    subject: "Thiết kế Web",
    project: "Website Ngọc Phỉ Thúy"
};

// Dữ liệu sản phẩm (mặc định - sẽ bị ghi đè nếu có dữ liệu từ admin)
let productsData = [
    {
        id: 1,
        name: "Vòng Phỉ Thúy Lý Ngư",
        description: "Ngọc tự nhiên từ Myanmar, màu lục bảo thượng hạng. Thiết kế hình cá chép với ý nghĩa phong thủy vượng tài lộc.",
        price: "42.000.000 VNĐ",
        image: "images/vongtay1.jpg",
        badge: "BÁN CHẠY",
        category: "Vòng tay",
        material: "Ngọc phỉ thúy tự nhiên",
        origin: "Myanmar",
        warranty: "5 năm",
        certification: "GIA Certified",
        salePrice: null,
        stock: 15,
        status: "active"
    },
    {
        id: 2,
        name: "Ngọc Phỉ Thúy Tuyết",
        description: "Đá trắng trong suốt từ vùng Kachin, vân tuyết độc bản. Chế tác tinh xảo, mang vẻ đẹp thuần khiết.",
        price: "85.500.000 VNĐ",
        image: "images/daychuyen1.jpg",
        badge: "CAO CẤP",
        category: "Dây chuyền",
        material: "Ngọc phỉ thúy tuyết trắng",
        origin: "Kachin, Myanmar",
        warranty: "Trọn đời",
        certification: "GIA Certified",
        salePrice: null,
        stock: 8,
        status: "active"
    },
    {
        id: 3,
        name: "Nhẫn Phỉ Thúy Rồng",
        description: "Kết hợp vàng 24K và ngọc phỉ thúy xanh lục từ Myanmar. Thiết kế rồng uốn lượn tinh xảo, quyền uy.",
        price: "68.750.000 VNĐ",
        image: "images/nhan1.jpg",
        badge: "ĐỘC BẢN",
        category: "Nhẫn",
        material: "Ngọc phỉ thúy + Vàng 24K",
        origin: "Myanmar",
        warranty: "5 năm",
        certification: "GIA Certified",
        salePrice: "58.750.000 VNĐ",
        stock: 5,
        status: "active"
    },
    {
        id: 4,
        name: "Bông Tai Hoa Sen",
        description: "Đôi bông tai hình hoa sen cách điệu, kết hợp ngọc phỉ thúy và kim cương 0.5ct. Vẻ đẹp thanh tao.",
        price: "39.500.000 VNĐ",
        image: "images/bongtai1.jpg",
        badge: "ƯU ĐÃI",
        category: "Bông tai",
        material: "Ngọc phỉ thúy + Kim cương",
        origin: "Myanmar",
        warranty: "3 năm",
        certification: "GIA Certified",
        salePrice: "34.500.000 VNĐ",
        stock: 12,
        status: "active"
    },
    {
        id: 5,
        name: "Dây Chuyền Phỉ Thúy Viên Mãn",
        description: "Mặt dây chuyền hình tròn, biểu tượng của sự viên mãn. Ngọc màu lục bảo tự nhiên từ Myanmar.",
        price: "75.300.000 VNĐ",
        image: "images/daychuyen2.jpg",
        badge: "PHONG THỦY",
        category: "Dây chuyền",
        material: "Ngọc phỉ thúy tự nhiên",
        origin: "Myanmar",
        warranty: "5 năm",
        certification: "GIA Certified",
        salePrice: null,
        stock: 7,
        status: "active"
    },
    {
        id: 6,
        name: "Vòng Tay Kim Tiền Ngọc Bích",
        description: "Chuỗi ngọc phỉ thúy hạng A kết hợp hạt vàng 24K. Mang ý nghĩa tài lộc, thịnh vượng trường tồn.",
        price: "125.000.000 VNĐ",
        image: "images/vongtay2.jpg",
        badge: "ĐỘC QUYỀN",
        category: "Vòng tay",
        material: "Ngọc phỉ thúy + Vàng 24K",
        origin: "Myanmar",
        warranty: "Trọn đời",
        certification: "GIA Certified",
        salePrice: "115.000.000 VNĐ",
        stock: 3,
        status: "active"
    },
    {
        id: 7,
        name: "Nhẫn Cưới Kim Cương Ngọc",
        description: "Nhẫn cưới kết hợp kim cương và ngọc phỉ thúy. Thiết kế tinh tế, sang trọng cho ngày trọng đại.",
        price: "185.000.000 VNĐ",
        image: "images/nhan2.jpg",
        badge: "CAO CẤP",
        category: "Nhẫn",
        material: "Ngọc phỉ thúy + Kim cương",
        origin: "Myanmar",
        warranty: "Trọn đời",
        certification: "GIA Certified",
        salePrice: null,
        stock: 2,
        status: "active"
    },
    {
        id: 8,
        name: "Bông Tai Khuyên Ngọc Xanh",
        description: "Bông tai khuyên đơn giản nhưng tinh tế với viên ngọc phỉ thúy xanh lục tự nhiên.",
        price: "28.300.000 VNĐ",
        image: "images/bongtai2.jpeg",
        badge: "PHỔ BIẾN",
        category: "Bông tai",
        material: "Ngọc phỉ thúy tự nhiên",
        origin: "Myanmar",
        warranty: "3 năm",
        certification: "GIA Certified",
        salePrice: "25.300.000 VNĐ",
        stock: 20,
        status: "active"
    }
    
];

// Hàm đồng bộ dữ liệu từ admin
function syncProductsFromAdmin() {
    try {
        const adminProducts = localStorage.getItem('adminProducts');
        if (adminProducts) {
            const parsedProducts = JSON.parse(adminProducts);
            
            if (parsedProducts.length > 0) {
                // Chuyển đổi định dạng từ admin sang website chính
                productsData = parsedProducts.map(product => ({
                    id: product.id,
                    name: product.name,
                    description: product.description || "",
                    price: formatPrice(product.price) + " VNĐ",
                    image: product.image || getDefaultImage(product.category),
                    badge: product.salePrice ? "GIẢM GIÁ" : (product.badge || "MỚI"),
                    category: product.category,
                    material: product.details || "Ngọc phỉ thúy tự nhiên",
                    origin: "Myanmar",
                    warranty: product.category === "Vòng tay" ? "5 năm" : "3 năm",
                    certification: "GIA Certified",
                    salePrice: product.salePrice ? formatPrice(product.salePrice) + " VNĐ" : null,
                    stock: product.stock || 0,
                    status: product.status || "active"
                }));
                
                console.log("✅ Đã đồng bộ sản phẩm từ admin:", productsData.length, "sản phẩm");
                
                // Kích hoạt sự kiện để các module biết dữ liệu đã thay đổi
                if (typeof window !== 'undefined') {
                    window.dispatchEvent(new CustomEvent('productsDataUpdated', {
                        detail: { count: productsData.length }
                    }));
                }
            }
        }
    } catch (error) {
        console.error("❌ Lỗi khi đồng bộ dữ liệu từ admin:", error);
    }
}

// Hàm định dạng giá
function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// Hàm lấy ảnh mặc định theo danh mục
function getDefaultImage(category) {
    const categoryMap = {
        "Vòng tay": "images/vongtay1.jpg",
        "Dây chuyền": "images/daychuyen1.jpg",
        "Nhẫn": "images/nhan1.jpg",
        "Bông tai": "images/bongtai1.jpg",
        "Mặt dây chuyền": "images/daychuyen1.jpg",
        "Khác": "images/default-product.jpg"
    };
    return categoryMap[category] || "images/default-product.jpg";
}

// Dữ liệu tin tức
const newsData = {
    breakingNews: [
        "• Giá ngọc phỉ thúy thượng hạng tăng 15% trong quý đầu năm 2024",
        "• Triển lãm ngọc quý quốc tế sẽ diễn ra tại Hà Nội tháng 10/2024",
        "• Phát hiện mỏ ngọc bích mới tại Myanmar với trữ lượng lớn",
        "• Chuyên gia phong thủy cảnh báo về ngọc giả trên thị trường"
    ],
    
    categories: [
        { name: "Phong thủy", count: 128, icon: "fas fa-yin-yang" },
        { name: "Ngọc quý", count: 95, icon: "fas fa-gem" },
        { name: "Văn hóa", count: 76, icon: "fas fa-landmark" },
        { name: "Thị trường", count: 54, icon: "fas fa-chart-line" }
    ],
    
    tags: [
        "Ngọc phỉ thúy", "Phong thủy", "Văn hóa", "Đầu tư",
        "Tài lộc", "May mắn", "Trang sức", "Cổ vật"
    ]
};

// Xuất dữ liệu
export { studentInfo, productsData, newsData, syncProductsFromAdmin };