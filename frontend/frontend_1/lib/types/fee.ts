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

// Specific response for fees using common pagination type
export interface FeesResponse extends PageableResponse<Fee> {}

// Main types aligned with backend KhoanThuDTO
export interface KhoanThu {
  id: number;
  tenKhoanThu: string;
  loaiKhoanThu: number; // 0: Bắt buộc, 1: Tự nguyện
  donGia: number;
  moTa?: string;
  ngayBatDau?: string; // ISO date string
  ngayKetThuc?: string; // ISO date string
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

// Request types for create/update
export interface CreateFeeRequest {
  tenKhoanThu: string;
  loaiKhoanThu: number; // 0: Bắt buộc, 1: Tự nguyện
  donGia: number;
  moTa?: string;
  ngayBatDau?: string; // ISO date string: "2024-01-01"
  ngayKetThuc?: string; // ISO date string: "2024-12-31"
}

export interface UpdateFeeRequest {
  tenKhoanThu?: string;
  loaiKhoanThu?: number;
  donGia?: number;
  moTa?: string;
  ngayBatDau?: string;
  ngayKetThuc?: string;
}

// Helper function to check if a fee is compulsory
export function isFeeCompulsory(khoanThu: KhoanThu): boolean {
  return khoanThu.loaiKhoanThu === 0;
}

// Helper function to check if a fee is active (within date range)
export function isFeeActive(khoanThu: KhoanThu, date: Date = new Date()): boolean {
  const today = date.toISOString().split('T')[0];
  const start = khoanThu.ngayBatDau || '';
  const end = khoanThu.ngayKetThuc || '';
  
  if (!start && !end) return true; // No date restriction
  if (start && today < start) return false; // Not started yet
  if (end && today > end) return false; // Already ended
  return true;
}