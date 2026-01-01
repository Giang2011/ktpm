import { NhanKhau, CreateNhanKhauRequest, UpdateNhanKhauRequest } from '@/lib/types/resident';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export const nhanKhauApi = {
  getAll: async (): Promise<NhanKhau[]> => {
    const response = await fetch(`${API_BASE_URL}/nhankhau`);
    if (!response.ok) throw new Error('Failed to fetch residents');
    return response.json();
  },

  getById: async (id: number): Promise<NhanKhau> => {
    const response = await fetch(`${API_BASE_URL}/nhankhau/${id}`);
    if (!response.ok) throw new Error('Failed to fetch resident');
    return response.json();
  },

  getByHoKhau: async (hoKhauId: number): Promise<NhanKhau[]> => {
    const response = await fetch(`${API_BASE_URL}/nhankhau/hokhau/${hoKhauId}`);
    if (!response.ok) throw new Error('Failed to fetch residents by household');
    return response.json();
  },

  search: async (keyword: string): Promise<NhanKhau[]> => {
    const response = await fetch(`${API_BASE_URL}/nhankhau/search?keyword=${encodeURIComponent(keyword)}`);
    if (!response.ok) throw new Error('Failed to search residents');
    return response.json();
  },

  getByCmnd: async (cmndCccd: string): Promise<NhanKhau> => {
    const response = await fetch(`${API_BASE_URL}/nhankhau/cmnd/${encodeURIComponent(cmndCccd)}`);
    if (!response.ok) throw new Error('Failed to fetch resident by ID card');
    return response.json();
  },

  create: async (data: CreateNhanKhauRequest): Promise<NhanKhau> => {
    const response = await fetch(`${API_BASE_URL}/nhankhau`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create resident');
    return response.json();
  },

  update: async (id: number, data: UpdateNhanKhauRequest): Promise<NhanKhau> => {
    const response = await fetch(`${API_BASE_URL}/nhankhau/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update resident');
    return response.json();
  },

  delete: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/nhankhau/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete resident');
  },
};