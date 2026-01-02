"use server"

import { khoanThuStore, type KhoanThu } from "@/lib/data-store"
import { revalidatePath } from "next/cache"

export async function getKhoanThuList() {
  return khoanThuStore.getAll()
}

export async function getKhoanThuById(id: string) {
  return khoanThuStore.getById(id)
}

export async function createKhoanThu(data: Omit<KhoanThu, "id">) {
  const result = khoanThuStore.create(data)
  revalidatePath("/dashboard/khoan-thu")
  revalidatePath("/dashboard")
  return result
}

export async function updateKhoanThu(id: string, data: Partial<KhoanThu>) {
  const result = khoanThuStore.update(id, data)
  revalidatePath("/dashboard/khoan-thu")
  revalidatePath("/dashboard")
  return result
}

export async function deleteKhoanThu(id: string) {
  khoanThuStore.delete(id)
  revalidatePath("/dashboard/khoan-thu")
  revalidatePath("/dashboard")
}
