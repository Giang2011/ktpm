-- 1. Tạo Database (nếu chưa có)
CREATE DATABASE IF NOT EXISTS bluemoon_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE bluemoon_db;

-- 2. Bảng Users: Dùng cho chức năng Đăng nhập/Phân quyền (Admin/Mod)
-- Spring Security sẽ dùng bảng này để xác thực.
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL, -- Lưu password đã mã hóa (BCrypt)
    role VARCHAR(20) DEFAULT 'USER', -- Ví dụ: 'ADMIN', 'MANAGER'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Bảng Hộ Khẩu (HoKhau): Quản lý thông tin căn hộ/gia đình
CREATE TABLE ho_khau (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    -- ma_ho_khau VARCHAR(20) NOT NULL UNIQUE, -- Mã quản lý (VD: HK001)
    ten_chu_ho VARCHAR(100) NOT NULL,
    dia_chi VARCHAR(255) NOT NULL, -- Số phòng/Tầng
    ngay_tao DATE DEFAULT (CURRENT_DATE),
    trang_thai INT DEFAULT 1 -- 1: Đang ở, 0: Đã chuyển đi
);

-- 4. Bảng Nhân Khẩu (NhanKhau): Thành viên trong hộ
CREATE TABLE nhan_khau (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    ho_khau_id BIGINT, -- Khóa ngoại liên kết với hộ khẩu
    ho_ten VARCHAR(100) NOT NULL,
    ngay_sinh DATE NOT NULL,
    gioi_tinh VARCHAR(10) NOT NULL, -- Nam/Nữ
    cmnd_cccd VARCHAR(20), -- Có thể null nếu là trẻ em
    quan_he_voi_chu_ho VARCHAR(50), -- Chủ hộ, Vợ, Con, v.v.
    nghe_nghiep VARCHAR(100),
    FOREIGN KEY (ho_khau_id) REFERENCES ho_khau(id) ON DELETE CASCADE
);

-- 5. Bảng Khoản Thu (KhoanThu): Định nghĩa các loại phí
-- Dựa vào tài liệu: Có phí bắt buộc (Vệ sinh) và Tự nguyện (Ủng hộ)
CREATE TABLE khoan_thu (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    ten_khoan_thu VARCHAR(100) NOT NULL, -- VD: Phí vệ sinh 2023, Ủng hộ ngày 1/6
    -- ma_khoan_thu VARCHAR(20) UNIQUE, -- Mã quản lý (VD: KT001)
    loai_khoan_thu INT NOT NULL, -- 0: Bắt buộc (tính theo đầu người/diện tích), 1: Tự nguyện
    don_gia DECIMAL(15, 0) DEFAULT 0, -- Nếu là phí bắt buộc cố định (VD: 6000đ/người)
    mo_ta TEXT,
    ngay_bat_dau DATE,
    ngay_ket_thuc DATE
);

-- 6. Bảng Nộp Tiền (NopTien): Lưu lịch sử đóng tiền của các hộ
-- Đây là bảng quan trọng nhất để thống kê doanh thu
CREATE TABLE nop_tien (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    khoan_thu_id BIGINT NOT NULL,
    ho_khau_id BIGINT NOT NULL,
    so_tien DECIMAL(15, 0) NOT NULL, -- Số tiền thực tế đóng
    ngay_nop TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    nguoi_nop VARCHAR(100), -- Người đi đóng tiền (có thể khác chủ hộ)
    ghi_chu TEXT,
    FOREIGN KEY (khoan_thu_id) REFERENCES khoan_thu(id),
    FOREIGN KEY (ho_khau_id) REFERENCES ho_khau(id)
);

-- Insert dữ liệu mẫu (Seeding data) để bạn test API
-- INSERT INTO users (username, password, role) VALUES 
-- ('admin', '123456', 'ADMIN'); -- Lưu ý: Khi làm thật password phải hash

-- INSERT INTO ho_khau (ma_ho_khau, ten_chu_ho, dia_chi) VALUES 
-- ('HK01', 'Nguyễn Văn A', 'Phòng 101, Tầng 1'),
-- ('HK02', 'Trần Thị B', 'Phòng 202, Tầng 2');

-- INSERT INTO nhan_khau (ho_khau_id, ho_ten, ngay_sinh, gioi_tinh, quan_he_voi_chu_ho) VALUES 
-- (1, 'Nguyễn Văn A', '1980-01-01', 'Nam', 'Chủ hộ'),
-- (1, 'Lê Thị C', '1982-05-20', 'Nữ', 'Vợ'),
-- (2, 'Trần Thị B', '1990-10-10', 'Nữ', 'Chủ hộ');

-- INSERT INTO khoan_thu (ten_khoan_thu, loai_khoan_thu, don_gia) VALUES 
-- ('Phí vệ sinh tháng 12/2023', 0, 6000), -- 0: Bắt buộc
-- ('Quỹ vì người nghèo', 1, 0); -- 1: Tự nguyện