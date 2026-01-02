"use server"

import { hoKhauStore, type HoKhau } from "@/lib/data-store"
import { revalidatePath } from "next/cache"

export async function getHoKhauList() {
  return hoKhauStore.getAll()
}

export async function getHoKhauById(id: string) {
  return hoKhauStore.getById(id)
}

export async function createHoKhau(data: Omit<HoKhau, "id">) {
  const result = hoKhauStore.create(data)
  revalidatePath("/dashboard/ho-khau")
  return result
}

export async function updateHoKhau(id: string, data: Partial<HoKhau>) {
  const result = hoKhauStore.update(id, data)
  revalidatePath("/dashboard/ho-khau")
  return result
}

export async function deleteHoKhau(id: string) {
  hoKhauStore.delete(id)
  revalidatePath("/dashboard/ho-khau")
}
