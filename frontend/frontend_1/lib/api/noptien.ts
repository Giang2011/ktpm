import { NopTien, CreateNopTienRequest, UpdateNopTienRequest } from '@/lib/types/payment';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export const nopTienApi = {
  getAll: async (): Promise<NopTien[]> => {
    const response = await fetch(`${API_BASE_URL}/noptien`);
    if (!response.ok) throw new Error('Failed to fetch payments');
    return response.json();
  },

  getById: async (id: number): Promise<NopTien> => {
    const response = await fetch(`${API_BASE_URL}/noptien/${id}`);
    if (!response.ok) throw new Error('Failed to fetch payment');
    return response.json();
  },

  getByHoKhau: async (hoKhauId: number): Promise<NopTien[]> => {
    const response = await fetch(`${API_BASE_URL}/noptien/hokhau/${hoKhauId}`);
    if (!response.ok) throw new Error('Failed to fetch payments by household');
    return response.json();
  },

  getByKhoanThu: async (khoanThuId: number): Promise<NopTien[]> => {
    const response = await fetch(`${API_BASE_URL}/noptien/khoanthu/${khoanThuId}`);
    if (!response.ok) throw new Error('Failed to fetch payments by fee');
    return response.json();
  },

  getByDateRange: async (startDate: string, endDate: string): Promise<NopTien[]> => {
    const response = await fetch(
      `${API_BASE_URL}/noptien/daterange?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`
    );
    if (!response.ok) throw new Error('Failed to fetch payments by date range');
    return response.json();
  },

  getThongKeByKhoanThu: async (khoanThuId: number): Promise<number> => {
    const response = await fetch(`${API_BASE_URL}/noptien/thongke/khoanthu/${khoanThuId}`);
    if (!response.ok) throw new Error('Failed to fetch statistics by fee');
    return response.json();
  },

  getThongKeByDateRange: async (startDate: string, endDate: string): Promise<number> => {
    const response = await fetch(
      `${API_BASE_URL}/noptien/thongke/daterange?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`
    );
    if (!response.ok) throw new Error('Failed to fetch statistics by date range');
    return response.json();
  },

  create: async (data: CreateNopTienRequest): Promise<NopTien> => {
    const response = await fetch(`${API_BASE_URL}/noptien`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create payment');
    return response.json();
  },

  update: async (id: number, data: UpdateNopTienRequest): Promise<NopTien> => {
    const response = await fetch(`${API_BASE_URL}/noptien/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update payment');
    return response.json();
  },

  delete: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/noptien/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete payment');
  },
};