import { HoKhau, HoKhauDetail, CreateHoKhauRequest, UpdateHoKhauRequest } from '../types/household';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export const hoKhauApi = {
  getAll: async (): Promise<HoKhau[]> => {
    const response = await fetch(`${API_BASE_URL}/hokhau`);
    if (!response.ok) throw new Error('Failed to fetch households');
    return response.json();
  },

  getById: async (id: number): Promise<HoKhau> => {
    const response = await fetch(`${API_BASE_URL}/hokhau/${id}`);
    if (!response.ok) throw new Error('Failed to fetch household');
    return response.json();
  },

  getActive: async (): Promise<HoKhau[]> => {
    const response = await fetch(`${API_BASE_URL}/hokhau/active`);
    if (!response.ok) throw new Error('Failed to fetch active households');
    return response.json();
  },

  getDetail: async (id: number): Promise<HoKhauDetail> => {
    const response = await fetch(`${API_BASE_URL}/hokhau/${id}/chitiet`);
    if (!response.ok) throw new Error('Failed to fetch household details');
    return response.json();
  },

  getThanhVien: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/hokhau/${id}/thanhvien`);
    if (!response.ok) throw new Error('Failed to fetch household members');
    return response.json();
  },

  getDaDong: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/hokhau/${id}/dadong`);
    if (!response.ok) throw new Error('Failed to fetch paid fees');
    return response.json();
  },

  getChuaDong: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/hokhau/${id}/chuadong`);
    if (!response.ok) throw new Error('Failed to fetch unpaid fees');
    return response.json();
  },

  searchByChuHo: async (keyword: string): Promise<HoKhau[]> => {
    const response = await fetch(`${API_BASE_URL}/hokhau/search/chuho?keyword=${encodeURIComponent(keyword)}`);
    if (!response.ok) throw new Error('Failed to search households');
    return response.json();
  },

  searchByDiaChi: async (keyword: string): Promise<HoKhau[]> => {
    const response = await fetch(`${API_BASE_URL}/hokhau/search/diachi?keyword=${encodeURIComponent(keyword)}`);
    if (!response.ok) throw new Error('Failed to search households');
    return response.json();
  },

  create: async (data: CreateHoKhauRequest): Promise<HoKhau> => {
    const response = await fetch(`${API_BASE_URL}/hokhau`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create household');
    return response.json();
  },

  update: async (id: number, data: UpdateHoKhauRequest): Promise<HoKhau> => {
    const response = await fetch(`${API_BASE_URL}/hokhau/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update household');
    return response.json();
  },

  delete: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/hokhau/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete household');
  },
};