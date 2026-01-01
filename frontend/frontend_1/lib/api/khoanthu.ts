import { KhoanThu, KhoanThuDetail, CreateKhoanThuRequest, UpdateKhoanThuRequest } from '@/lib/types/fee';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export const khoanThuApi = {
  getAll: async (): Promise<KhoanThu[]> => {
    const response = await fetch(`${API_BASE_URL}/khoanthu`);
    if (!response.ok) throw new Error('Failed to fetch fees');
    return response.json();
  },

  getById: async (id: number): Promise<KhoanThu> => {
    const response = await fetch(`${API_BASE_URL}/khoanthu/${id}`);
    if (!response.ok) throw new Error('Failed to fetch fee');
    return response.json();
  },

  getBatBuoc: async (): Promise<KhoanThu[]> => {
    const response = await fetch(`${API_BASE_URL}/khoanthu/batbuoc`);
    if (!response.ok) throw new Error('Failed to fetch mandatory fees');
    return response.json();
  },

  getTuNguyen: async (): Promise<KhoanThu[]> => {
    const response = await fetch(`${API_BASE_URL}/khoanthu/tunguyen`);
    if (!response.ok) throw new Error('Failed to fetch voluntary fees');
    return response.json();
  },

  getActive: async (ngay?: string): Promise<KhoanThu[]> => {
    const url = ngay 
      ? `${API_BASE_URL}/khoanthu/active?ngay=${encodeURIComponent(ngay)}`
      : `${API_BASE_URL}/khoanthu/active`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch active fees');
    return response.json();
  },

  getChiTiet: async (id: number): Promise<KhoanThuDetail> => {
    const response = await fetch(`${API_BASE_URL}/khoanthu/${id}/chitiet`);
    if (!response.ok) throw new Error('Failed to fetch fee details');
    return response.json();
  },

  getDaDong: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/khoanthu/${id}/dadong`);
    if (!response.ok) throw new Error('Failed to fetch paid households');
    return response.json();
  },

  getChuaDong: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/khoanthu/${id}/chuadong`);
    if (!response.ok) throw new Error('Failed to fetch unpaid households');
    return response.json();
  },

  getTongThu: async (id: number): Promise<number> => {
    const response = await fetch(`${API_BASE_URL}/khoanthu/${id}/tongthu`);
    if (!response.ok) throw new Error('Failed to fetch total collected');
    return response.json();
  },

  create: async (data: CreateKhoanThuRequest): Promise<KhoanThu> => {
    const response = await fetch(`${API_BASE_URL}/khoanthu`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create fee');
    return response.json();
  },

  update: async (id: number, data: UpdateKhoanThuRequest): Promise<KhoanThu> => {
    const response = await fetch(`${API_BASE_URL}/khoanthu/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update fee');
    return response.json();
  },

  delete: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/khoanthu/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete fee');
  },
};