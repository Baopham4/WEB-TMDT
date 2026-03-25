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

// Dữ liệu sản phẩm mặc định (làm thủ công từ toàn bộ thư mục images)
const productImageFiles = [
    "Vòng Phỉ Thúy Băng Chủng Trong Suốt.jpeg",
    "Vòng Phỉ Thúy Bạch Ngọc Tinh Khôi.jpeg",
    "Vòng Phỉ Thúy Cam Ánh Hoàng Hôn.jpeg",
    "Vòng Phỉ Thúy Hoàng Ngọc Ánh Mật.jpeg",
    "Vòng Phỉ Thúy Hồng Đào Dịu Dàng.jpeg",
    "Vòng Phỉ Thúy Lam Băng Thanh Khiết.jpeg",
    "Vòng Phỉ Thúy Lục Bảo Hoàng Gia.jpg",
    "Vòng Phỉ Thúy Lục Đậm Vân Mây.jpeg",
    "Vòng Phỉ Thúy Nâu Hổ Phách.jpeg",
    "Vòng Phỉ Thúy Tam Sắc Phúc Lộc Thọ.jpeg",
    "Vòng Phỉ Thúy Trắng Pha Lục.jpeg",
    "Vòng Phỉ Thúy Tím Oải Hương.jpeg",
    "Vòng Phỉ Thúy Xanh Lục Nhạt Thanh Tân.jpeg",
    "Vòng Phỉ Thúy Xanh Ngọc Lam.jpeg",
    "Vòng Phỉ Thúy Xanh Ngọc Lục Bảo Sáng.jpeg",
    "Vòng Phỉ Thúy Xanh Rêu Cổ Điển.jpeg",
    "Vòng Phỉ Thúy Xanh Táo Thanh Nhã.jpeg",
    "Vòng Phỉ Thúy Xám Khói Sang Trọng.jpeg",
    "Vòng Phỉ Thúy Đa Sắc Thiên Nhiên.jpeg",
    "Vòng Phỉ Thúy Đen Huyền Bí.jpeg",
    "Dây Chuyền Phỉ Thúy Băng Chủng.jpeg",
    "Dây Chuyền Phỉ Thúy Bạch Ngọc.jpeg",
    "Dây Chuyền Phỉ Thúy Cam Ánh Dương.jpeg",
    "Dây Chuyền Phỉ Thúy Giọt Nước.jpeg",
    "Dây Chuyền Phỉ Thúy Hoàng Ngọc.jpeg",
    "Dây Chuyền Phỉ Thúy Hồ Ly.jpeg",
    "Dây Chuyền Phỉ Thúy Hồ Lô.jpeg",
    "Dây Chuyền Phỉ Thúy Hồng Đào.jpeg",
    "Dây Chuyền Phỉ Thúy Lam Băng.jpeg",
    "Dây Chuyền Phỉ Thúy Lục Bảo Hoàng Gia.jpeg",
    "Dây Chuyền Phỉ Thúy Phật Di Lặc.jpeg",
    "Dây Chuyền Phỉ Thúy Trái Tim.jpeg",
    "Dây Chuyền Phỉ Thúy Tím Lavender.jpeg",
    "Dây Chuyền Phỉ Thúy Tỳ Hưu.jpeg",
    "Dây Chuyền Phỉ Thúy Vân Mây.jpeg",
    "Dây Chuyền Phỉ Thúy Xanh Rêu.jpeg",
    "Dây Chuyền Phỉ Thúy Xanh Táo.jpeg",
    "Dây Chuyền Phỉ Thúy Đa Sắc.jpeg",
    "Dây Chuyền Phỉ Thúy Đen Huyền Bí.jpeg",
    "Dây Chuyền Phỉ Thúy Đồng Điếu.jpeg",
    "Nhẫn Phỉ Thúy Băng Chủng.jpeg",
    "Nhẫn Phỉ Thúy Bạch Ngọc Tinh Khôi.jpeg",
    "Nhẫn Phỉ Thúy Cam Hoàng Hôn.jpeg",
    "Nhẫn Phỉ Thúy Hoàng Ngọc.jpeg",
    "Nhẫn Phỉ Thúy Hồng Đào.jpeg",
    "Nhẫn Phỉ Thúy Lam Băng.jpeg",
    "Nhẫn Phỉ Thúy Lục Bảo Hoàng Gia.jpeg",
    "Nhẫn Phỉ Thúy Lục Bảo Sáng.jpeg",
    "Nhẫn Phỉ Thúy Lục Nhạt.jpeg",
    "Nhẫn Phỉ Thúy Ngọc Lam.jpeg",
    "Nhẫn Phỉ Thúy Nâu Hổ Phách.jpeg",
    "Nhẫn Phỉ Thúy Tam Sắc.jpeg",
    "Nhẫn Phỉ Thúy Trắng Pha Lục.jpeg",
    "Nhẫn Phỉ Thúy Tím Oải Hương.jpeg",
    "Nhẫn Phỉ Thúy Vân Mây.jpeg",
    "Nhẫn Phỉ Thúy Xanh Rêu.jpeg",
    "Nhẫn Phỉ Thúy Xanh Táo Thanh Nhã.jpeg",
    "Nhẫn Phỉ Thúy Xám Khói.jpeg",
    "Nhẫn Phỉ Thúy Đa Sắc Thiên Nhiên.jpeg",
    "Nhẫn Phỉ Thúy Đen Huyền Bí.jpeg",
    "Bông Tai Phỉ Thúy Băng Chủng.jpeg",
    "Bông Tai Phỉ Thúy Bạch Ngọc.jpeg",
    "Bông Tai Phỉ Thúy Cam Ánh Dương.jpeg",
    "Bông Tai Phỉ Thúy Dáng Dài.jpeg",
    "Bông Tai Phỉ Thúy Giọt Nước.jpeg",
    "Bông Tai Phỉ Thúy Hoàng Ngọc.jpeg",
    "Bông Tai Phỉ Thúy Hồ Ly.jpeg",
    "Bông Tai Phỉ Thúy Hồ Lô.jpeg",
    "Bông Tai Phỉ Thúy Hồng Đào.jpeg",
    "Bông Tai Phỉ Thúy Kết Hợp Vàng,jpeg.webp",
    "Bông Tai Phỉ Thúy Lam Băng.jpeg",
    "Bông Tai Phỉ Thúy Lục Bảo Hoàng Gia.jpeg",
    "Bông Tai Phỉ Thúy Trái Tim.jpeg",
    "Bông Tai Phỉ Thúy Tròn (Stud).jpeg",
    "Bông Tai Phỉ Thúy Tím Lavender.jpeg",
    "Bông Tai Phỉ Thúy Vân Mây.jpeg",
    "Bông Tai Phỉ Thúy Xanh Rêu.jpeg",
    "Bông Tai Phỉ Thúy Đa Sắc.jpeg",
    "Bông Tai Phỉ Thúy Đen Huyền Bí.jpeg",
    "Mặt Ngọc Phỉ Thúy Băng Chủng.jpeg",
    "Mặt Ngọc Phỉ Thúy Bạch Ngọc.jpeg",
    "Mặt Ngọc Phỉ Thúy Cam Ánh Dương.jpeg",
    "Mặt Ngọc Phỉ Thúy Giọt Nước.jpeg",
    "Mặt Ngọc Phỉ Thúy Hoa Mẫu Đơn Phú Quý.jpeg",
    "Mặt Ngọc Phỉ Thúy Hoàng Ngọc.jpeg",
    "Mặt Ngọc Phỉ Thúy Hồ Ly.jpeg",
    "Mặt Ngọc Phỉ Thúy Hồ Lô.jpeg",
    "Mặt Ngọc Phỉ Thúy Hồng Đào.jpeg",
    "Mặt Ngọc Phỉ Thúy Lam Băng.jpeg",
    "Mặt Ngọc Phỉ Thúy Lục Bảo Hoàng Gia.jpeg",
    "Mặt Ngọc Phỉ Thúy Phật Di Lặc.jpeg",
    "Mặt Ngọc Phỉ Thúy Quan Âm.jpeg",
    "Mặt Ngọc Phỉ Thúy Trái Tim.jpeg",
    "Mặt Ngọc Phỉ Thúy Tím Lavender.jpeg",
    "Mặt Ngọc Phỉ Thúy Tỳ Hưu.jpeg",
    "Mặt Ngọc Phỉ Thúy Vân Tự Nhiên.jpeg",
    "Mặt Ngọc Phỉ Thúy Xanh Rêu.jpeg",
    "Mặt Ngọc Phỉ Thúy Đen Huyền Bí.jpeg",
    "Mặt Ngọc Phỉ Thúy Đồng Điếu (Bình An).jpeg",
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

let productsData = productImageFiles.map((file, index) => {
    const name = file.replace(/\.[^/.]+$/g, "");
    const lower = name.toLowerCase();
    let category = "Khác";
    if (lower.startsWith("vòng") || lower.startsWith("vong ")) category = "Vòng tay";
    else if (lower.startsWith("vòng phỉ thúy") || lower.startsWith("vong phỉ thúy") || lower.startsWith("vongtay")) category = "Vòng tay";
    else if (lower.startsWith("dây chuyền") || lower.startsWith("daychuyen")) category = "Dây chuyền";
    else if (lower.startsWith("nhẫn") || lower.startsWith("nhan")) category = "Nhẫn";
    else if (lower.startsWith("bông tai") || lower.startsWith("bongtai")) category = "Bông tai";
    else if (lower.startsWith("mặt ngọc") || lower.includes("mặt") || lower.includes("mat ngoc")) category = "Mặt dây chuyền";

    const basePrice = 42000000 + index * 500000;

    return {
        id: index + 1,
        name: name,
        description: "Sản phẩm " + name.toLowerCase() + " làm từ ngọc phỉ thúy tự nhiên.",
        price: formatPrice(basePrice) + " VNĐ",
        image: "images/" + file,
        badge: "MỚI",
        category: category,
        material: "Ngọc phỉ thúy tự nhiên",
        origin: "Myanmar",
        warranty: category === "Vòng tay" ? "5 năm" : "3 năm",
        certification: "GIA Certified",
        salePrice: null,
        stock: 5,
        status: "active"
    };
});

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
