import { privateApi } from "./client";
import { 
  CreateFeeRequest, 
  Fee, 
  UpdateFeeRequest,
  KhoanThu,
  KhoanThuDetail,
  HoKhau
} from "../types/fee";

export const feesApi = {
  // Lấy tất cả khoản thu
  getFees: async (filter?: 'batbuoc' | 'tunguyen' | 'active') => {
    let endpoint = "/khoanthu";
    if (filter === 'batbuoc') endpoint = "/khoanthu/batbuoc";
    else if (filter === 'tunguyen') endpoint = "/khoanthu/tunguyen";
    else if (filter === 'active') endpoint = "/khoanthu/active";
    
    const response = await privateApi.get<KhoanThu[]>(endpoint);
    return response.data;
  },

  // Lấy chi tiết 1 khoản thu
  getFee: async (id: number) => {
    const response = await privateApi.get<KhoanThu>(`/khoanthu/${id}`);
    return response.data;
  },

  // Lấy chi tiết đầy đủ của khoản thu (bao gồm hộ đã đóng, chưa đóng, tổng tiền)
  getFeeDetail: async (id: number) => {
    const response = await privateApi.get<KhoanThuDetail>(`/khoanthu/${id}/chi-tiet`);
    return response.data;
  },

  // Lấy danh sách hộ đã đóng tiền
  getHoDaDong: async (id: number) => {
    const response = await privateApi.get<HoKhau[]>(`/khoanthu/${id}/ho-da-dong`);
    return response.data;
  },

  // Lấy danh sách hộ chưa đóng tiền (chỉ khoản bắt buộc)
  getHoChuaDong: async (id: number) => {
    const response = await privateApi.get<HoKhau[] | null>(`/khoanthu/${id}/ho-chua-dong`);
    return response.data;
  },

  // Lấy tổng tiền đã thu
  getTongThu: async (id: number) => {
    const response = await privateApi.get<number>(`/khoanthu/${id}/tong-thu`);
    return response.data;
  },

  // Tạo khoản thu mới
  createFee: async (data: CreateFeeRequest) => {
    const response = await privateApi.post<KhoanThu>("/khoanthu", data);
    return response.data;
  },

  // Cập nhật khoản thu
  updateFee: async (id: number, data: UpdateFeeRequest) => {
    const response = await privateApi.put<KhoanThu>(`/khoanthu/${id}`, data);
    return response.data;
  },

  // Xóa khoản thu
  deleteFee: async (id: number) => {
    await privateApi.delete(`/khoanthu/${id}`);
  },
};
