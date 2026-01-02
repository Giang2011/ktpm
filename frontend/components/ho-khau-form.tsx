"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { createHoKhau, updateHoKhau } from "@/app/actions/ho-khau-actions"
import type { HoKhau } from "@/lib/data-store"
import type { UserRole } from "@/lib/auth-context"
import { useAuth } from "@/lib/auth-context"
import { Plus, Lock } from "lucide-react"

type HoKhauFormProps = {
  hoKhau?: HoKhau
  trigger?: React.ReactNode
  requireRole?: UserRole
}

export function HoKhauForm({ hoKhau, trigger, requireRole }: HoKhauFormProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  const canEdit = !requireRole || user?.role === requireRole

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (!canEdit) {
      return
    }

    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      maHoKhau: formData.get("maHoKhau") as string,
      chuHo: formData.get("chuHo") as string,
      diaChi: formData.get("diaChi") as string,
      soPhong: formData.get("soPhong") as string,
      dienTich: Number(formData.get("dienTich")),
      soThanhVien: Number(formData.get("soThanhVien")) || 0,
      ngayDangKy: formData.get("ngayDangKy") as string,
    }

    try {
      if (hoKhau) {
        await updateHoKhau(hoKhau.id, data)
      } else {
        await createHoKhau(data)
      }
      setOpen(false)
    } catch (error) {
      console.error("Error saving hộ khẩu:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!canEdit && trigger) {
    return (
      <Button variant="ghost" size="sm" disabled title="Chỉ Tổ trưởng mới có quyền chỉnh sửa">
        <Lock className="h-4 w-4" />
      </Button>
    )
  }

  if (!canEdit) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Thêm hộ khẩu
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{hoKhau ? "Chỉnh sửa hộ khẩu" : "Thêm hộ khẩu mới"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="maHoKhau">Mã hộ khẩu</Label>
              <Input id="maHoKhau" name="maHoKhau" defaultValue={hoKhau?.maHoKhau} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="chuHo">Chủ hộ</Label>
              <Input id="chuHo" name="chuHo" defaultValue={hoKhau?.chuHo} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="soPhong">Số phòng</Label>
              <Input id="soPhong" name="soPhong" defaultValue={hoKhau?.soPhong} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dienTich">Diện tích (m²)</Label>
              <Input id="dienTich" name="dienTich" type="number" step="0.01" defaultValue={hoKhau?.dienTich} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ngayDangKy">Ngày đăng ký</Label>
              <Input id="ngayDangKy" name="ngayDangKy" type="date" defaultValue={hoKhau?.ngayDangKy} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="soThanhVien">Số thành viên</Label>
              <Input
                id="soThanhVien"
                name="soThanhVien"
                type="number"
                defaultValue={hoKhau?.soThanhVien || 0}
                readOnly
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="diaChi">Địa chỉ đầy đủ</Label>
            <Input id="diaChi" name="diaChi" defaultValue={hoKhau?.diaChi} required />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Hủy
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Đang lưu..." : hoKhau ? "Cập nhật" : "Thêm mới"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
