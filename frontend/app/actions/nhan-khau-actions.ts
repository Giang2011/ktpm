"use server"

import { nhanKhauStore, type NhanKhau } from "@/lib/data-store"
import { revalidatePath } from "next/cache"

export async function getNhanKhauList() {
  return nhanKhauStore.getAll()
}

export async function getNhanKhauById(id: string) {
  return nhanKhauStore.getById(id)
}

export async function getNhanKhauByHoKhau(hoKhauId: string) {
  return nhanKhauStore.getByHoKhau(hoKhauId)
}

export async function createNhanKhau(data: Omit<NhanKhau, "id">) {
  const result = nhanKhauStore.create(data)
  revalidatePath("/dashboard/nhan-khau")
  revalidatePath("/dashboard/ho-khau")
  return result
}

export async function updateNhanKhau(id: string, data: Partial<NhanKhau>) {
  const result = nhanKhauStore.update(id, data)
  revalidatePath("/dashboard/nhan-khau")
  revalidatePath("/dashboard/ho-khau")
  return result
}

export async function deleteNhanKhau(id: string) {
  nhanKhauStore.delete(id)
  revalidatePath("/dashboard/nhan-khau")
  revalidatePath("/dashboard/ho-khau")
}
