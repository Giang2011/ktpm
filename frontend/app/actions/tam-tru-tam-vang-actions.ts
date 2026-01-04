"use server"

import { revalidatePath } from "next/cache"
import { api } from "@/lib/api-client"

export interface TamTruTamVang {
  id: number
  nhanKhauId: number
  hoTenNhanKhau: string
  cmndCccdNhanKhau: string
  loaiTamTru: number // 0: Tạm trú, 1: Tạm vắng
  diaChi?: string // Địa chỉ (chỉ bắt buộc khi tạm trú)
  soDienThoai: string
  ngayBatDau: string
  ngayKetThuc: string
  lyDo: string
}

export interface TamTruTamVangRequest {
  nhanKhauId: number
  loaiTamTru: number
  diaChi?: string // Địa chỉ (chỉ bắt buộc khi tạm trú)
  soDienThoai: string
  ngayBatDau: string
  ngayKetThuc: string
  lyDo: string
}

export async function getTamTruTamVangList() {
  const response = await api.get("/api/tamtrutamvang")
  if (response.ok) {
    return await response.json()
  }
  throw new Error("Failed to fetch tam tru tam vang list")
}

export async function getTamTruTamVangById(id: number) {
  const response = await api.get(`/api/tamtrutamvang/${id}`)
  if (response.ok) {
    return await response.json()
  }
  throw new Error("Failed to fetch tam tru tam vang")
}

export async function getTamTruTamVangByNhanKhauId(nhanKhauId: number) {
  const response = await api.get(`/api/tamtrutamvang/nhankhau/${nhanKhauId}`)
  if (response.ok) {
    return await response.json()
  }
  throw new Error("Failed to fetch tam tru tam vang by nhan khau")
}

export async function searchTamTruTamVang(keyword: string) {
  const response = await api.get(`/api/tamtrutamvang/search?keyword=${keyword}`)
  if (response.ok) {
    return await response.json()
  }
  throw new Error("Failed to search tam tru tam vang")
}

export async function createTamTruTamVang(data: TamTruTamVangRequest) {
  const response = await api.post("/api/tamtrutamvang", data)
  if (response.ok) {
    revalidatePath("/dashboard/tam-tru-tam-vang")
    return await response.json()
  }
  throw new Error("Failed to create tam tru tam vang")
}

export async function updateTamTruTamVang(id: number, data: TamTruTamVangRequest) {
  const response = await api.put(`/api/tamtrutamvang/${id}`, data)
  if (response.ok) {
    revalidatePath("/dashboard/tam-tru-tam-vang")
    return await response.json()
  }
  throw new Error("Failed to update tam tru tam vang")
}

export async function deleteTamTruTamVang(id: number) {
  const response = await api.delete(`/api/tamtrutamvang/${id}`)
  if (response.ok) {
    revalidatePath("/dashboard/tam-tru-tam-vang")
    return
  }
  throw new Error("Failed to delete tam tru tam vang")
}
