import { PageableResponse } from "./common";
import { Payment } from "./payment";

// Legacy types for backward compatibility
export interface Fee {
  id: number;
  type: string;
  amount: number;
  month: string;
  description: string;
  compulsory: boolean;
  payments?: Payment[];
}

export interface CreateFeeRequest {
  type: string;
  amount: number;
  month: string;
  description: string;
  compulsory: boolean;
}

export interface UpdateFeeRequest {
  type?: string;
  amount?: number;
  month?: string;
  description?: string;
  compulsory?: boolean;
}

// Specific response for fees using common pagination type
export interface FeesResponse extends PageableResponse<Fee> {}

// New types aligned with ktpm backend (KhoanThu)
export interface KhoanThu {
  id: number;
  tenKhoanThu: string;
  loaiKhoanThu: number; // 0: Bắt buộc, 1: Tự nguyện
  donGia: number;
  moTa?: string;
  ngayBatDau?: string;
  ngayKetThuc?: string;
}

export interface HoKhau {
  id: number;
  tenChuHo: string;
  diaChi: string;
  ngayTao: string;
  trangThai: number;
}

export interface KhoanThuDetail {
  khoanThu: KhoanThu;
  hoDaDong: HoKhau[];
  hoChuaDong: HoKhau[] | null; // null nếu là khoản tự nguyện
  tongTienDaThu: number;
  soHoDaDong: number;
  soHoChuaDong: number | null;
}

export interface CreateKhoanThuRequest {
  tenKhoanThu: string;
  loaiKhoanThu: number;
  donGia: number;
  moTa?: string;
  ngayBatDau?: string;
  ngayKetThuc?: string;
}

export interface UpdateKhoanThuRequest extends CreateKhoanThuRequest {}