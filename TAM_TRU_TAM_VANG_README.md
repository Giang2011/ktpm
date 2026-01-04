# Tạm Trú Tạm Vắng - Tài liệu Cập nhật

## Tổng quan
Đã thêm chức năng quản lý Tạm Trú Tạm Vắng vào hệ thống BlueMoon, bao gồm đầy đủ CRUD operations với phân quyền ADMIN/STAFF.

## Backend Changes

### 1. Entity
**File:** `backend/src/main/java/com/bluemoon/bluemoonv1/entity/TamTruTamVang.java`
- Các trường:
  - `id` (Long): Primary key
  - `nhanKhau` (ManyToOne): Liên kết với bảng nhân khẩu
  - `loaiTamTru` (Integer): Phân loại - 0: Tạm Trú, 1: Tạm Vắng
  - `soDienThoai` (String): Số điện thoại liên lạc
  - `ngayBatDau` (LocalDate): Ngày bắt đầu
  - `ngayKetThuc` (LocalDate): Ngày kết thúc
  - `lyDo` (String, TEXT): Lý do tạm trú/tạm vắng

### 2. DTOs
**Files:**
- `TamTruTamVangDTO.java`: Dùng cho response, bao gồm thông tin nhân khẩu
- `TamTruTamVangRequestDTO.java`: Dùng cho create/update request

### 3. Repository
**File:** `TamTruTamVangRepository.java`
- Các query methods:
  - `findByNhanKhauId()`: Tìm theo nhân khẩu
  - `findBySoDienThoaiContaining()`: Tìm theo SĐT
  - `findActiveByDate()`: Tìm các bản ghi đang hiệu lực
  - `searchByKeyword()`: Tìm kiếm theo tên hoặc SĐT

### 4. Service & Implementation
**Files:**
- `TamTruTamVangService.java`: Interface
- `TamTruTamVangServiceImpl.java`: Implementation với Audit Logging

### 5. Controller
**File:** `TamTruTamVangController.java`
**Endpoints:**
- `GET /api/tamtrutamvang` - Lấy tất cả
- `GET /api/tamtrutamvang/paged` - Lấy có phân trang
- `GET /api/tamtrutamvang/{id}` - Lấy theo ID
- `GET /api/tamtrutamvang/nhankhau/{nhanKhauId}` - Lấy theo nhân khẩu
- `GET /api/tamtrutamvang/search?keyword={keyword}` - Tìm kiếm
- `GET /api/tamtrutamvang/active?date={date}` - Lấy các bản ghi đang hiệu lực
- `POST /api/tamtrutamvang` - Tạo mới
- `PUT /api/tamtrutamvang/{id}` - Cập nhật
- `DELETE /api/tamtrutamvang/{id}` - Xóa

### 6. Database
**File:** `backend/init/init.sql`
- Thêm bảng `tam_tru_tam_vang` với các ràng buộc foreign key

## Frontend Changes

### 1. Actions
**File:** `frontend/app/actions/tam-tru-tam-vang-actions.ts`
- Server actions cho tất cả CRUD operations
- Type definitions cho TamTruTamVang và TamTruTamVangRequest

### 2. Form Component
**File:** `frontend/components/tam-tru-tam-vang-form.tsx`
- Dialog form với validation
- Select loại: Tạm Trú (0) hoặc Tạm Vắng (1)
- Tìm kiếm và chọn nhân khẩu
- Các trường: Nhân khẩu, Loại, SĐT, Ngày bắt đầu, Ngày kết thúc, Lý do
- Support cho cả Add và Edit modes

### 3. Page Component
**File:** `frontend/app/dashboard/tam-tru-tam-vang/page.tsx`
**Tính năng:**
- Table hiển thị với phân trang
- Cột "Loại" với Badge: Tạm Trú (xanh) / Tạm Vắng (xám)
- Tìm kiếm theo tên hoặc SĐT
- Badge trạng thái: Đang hiệu lực, Đã hết hạn, Chưa bắt đầu
- Dropdown menu actions: Xem chi tiết, Chỉnh sửa, Xóa
- Dialog xem chi tiết với đầy đủ thông tin
- **Phân quyền:**
  - ADMIN: Toàn quyền CRUD
  - STAFF: Chỉ xem

### 4. Navigation Updates
**Files:**
- `frontend/app/dashboard/layout.tsx`: Thêm menu "Tạm Trú Tạm Vắng" với icon MapPin
- `frontend/components/shared/footer.tsx`: Thêm link footer

## Permissions

### ADMIN
- ✅ Xem danh sách
- ✅ Xem chi tiết
- ✅ Thêm mới
- ✅ Chỉnh sửa
- ✅ Xóa

### STAFF
- ✅ Xem danh sách
- ✅ Xem chi tiết
- ❌ Thêm mới
- ❌ Chỉnh sửa
- ❌ Xóa

## Testing Checklist

### Backend
- [ ] Khởi động Spring Boot application
- [ ] Chạy init.sql để tạo bảng
- [ ] Test các API endpoints với Postman/Swagger
- [ ] Verify foreign key constraints
- [ ] Verify audit logging

### Frontend
- [ ] Chạy `npm install` (nếu cần)
- [ ] Chạy `npm run dev`
- [ ] Kiểm tra menu hiển thị
- [ ] Test Add/Edit/Delete với ADMIN account
- [ ] Test read-only với STAFF account
- [ ] Kiểm tra validation
- [ ] Kiểm tra responsive design
- [ ] Test tìm kiếm
- [ ] Test phân trang

## Notes
- Entity sử dụng LocalDate cho ngày bắt đầu/kết thúc
- Form có validation cho required fields
- Frontend tự động refresh data sau CRUD operations
- UI/UX pattern nhất quán với các module khác
