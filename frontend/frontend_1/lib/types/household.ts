export interface HoKhau {
    id: number;
    tenChuHo: string;
    diaChi: string;
    ngayTao: string;
    trangThai: number; // 1: Đang ở, 0: Đã chuyển đi
  }
  
  export interface NhanKhau {
    id: number;
    hoKhauId: number;
    hoTen: string;
    ngaySinh: string;
    gioiTinh: string;
    cmndCccd?: string;
    quanHeVoiChuHo?: string;
    ngheNghiep?: string;
  }
  
  export interface KhoanThu {
    id: number;
    tenKhoanThu: string;
    loaiKhoanThu: number; // 0: Bắt buộc, 1: Tự nguyện
    donGia: number;
    moTa?: string;
    ngayBatDau?: string;
    ngayKetThuc?: string;
  }
  
  export interface NopTien {
    id: number;
    khoanThuId: number;
    hoKhauId: number;
    soTien: number;
    ngayNop: string;
    nguoiNop?: string;
    ghiChu?: string;
  }
  
  export interface HoKhauDetail {
    hoKhau: HoKhau;
    thanhVien: NhanKhau[];
    khoanDaDong: NopTien[];
    khoanChuaDong: KhoanThu[];
  }
  
  export interface CreateHoKhauRequest {
    tenChuHo: string;
    diaChi: string;
    trangThai?: number;
  }
  
  export interface UpdateHoKhauRequest extends CreateHoKhauRequest {}