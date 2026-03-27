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

function prettifyNameFromFile(file) {
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
}

let productsData = productImageFiles.map((file, index) => {
    const name = prettifyNameFromFile(file);
    const lower = name.toLowerCase();
    let category = "Khác";
    if (lower.startsWith("vòng") || lower.startsWith("vong") || lower.includes("vongphithuy") || lower.startsWith("vongtay")) category = "Vòng tay";
    else if (lower.startsWith("dây chuyền") || lower.startsWith("daychuyen") || lower.includes("daychuyenphithuy")) category = "Dây chuyền";
    else if (lower.startsWith("nhẫn") || lower.startsWith("nhan") || lower.includes("nhanphithuy")) category = "Nhẫn";
    else if (lower.startsWith("bông tai") || lower.startsWith("bongtai") || lower.includes("bongtaiphithuy")) category = "Bông tai";
    else if (lower.startsWith("mặt ngọc") || lower.includes("matngoc") || lower.includes("matngocphithuy")) category = "Mặt dây chuyền";

    const basePrice = 42000000 + index * 500000;

    return {
        id: index + 1,
        name: name,
        description: "Sản phẩm " + name.toLowerCase() + " làm từ ngọc phỉ thúy tự nhiên.",
        price: formatPrice(basePrice) + " VNĐ",
        image: encodeURI("images/" + file),
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
