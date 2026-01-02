"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createNhanKhau, updateNhanKhau } from "@/app/actions/nhan-khau-actions"
import type { NhanKhau, HoKhau } from "@/lib/data-store"
import type { UserRole } from "@/lib/auth-context"
import { useAuth } from "@/lib/auth-context"
import { Plus, Lock } from "lucide-react"

type NhanKhauFormProps = {
  nhanKhau?: NhanKhau
  hoKhauList: HoKhau[]
  trigger?: React.ReactNode
  requireRole?: UserRole
}

export function NhanKhauForm({ nhanKhau, hoKhauList, trigger, requireRole }: NhanKhauFormProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [gioiTinh, setGioiTinh] = useState<"Nam" | "Nữ" | "Khác">(nhanKhau?.gioiTinh || "Nam")
  const [hoKhauId, setHoKhauId] = useState(nhanKhau?.hoKhauId || "")
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
      hoTen: formData.get("hoTen") as string,
      ngaySinh: formData.get("ngaySinh") as string,
      gioiTinh,
      cccd: formData.get("cccd") as string,
      soDienThoai: formData.get("soDienThoai") as string,
      hoKhauId,
      quanHeChuHo: formData.get("quanHeChuHo") as string,
      ngheNghiep: formData.get("ngheNghiep") as string,
    }

    try {
      if (nhanKhau) {
        await updateNhanKhau(nhanKhau.id, data)
      } else {
        await createNhanKhau(data)
      }
      setOpen(false)
    } catch (error) {
      console.error("Error saving nhân khẩu:", error)
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
            Thêm nhân khẩu
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{nhanKhau ? "Chỉnh sửa nhân khẩu" : "Thêm nhân khẩu mới"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="hoTen">Họ và tên</Label>
              <Input id="hoTen" name="hoTen" defaultValue={nhanKhau?.hoTen} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ngaySinh">Ngày sinh</Label>
              <Input id="ngaySinh" name="ngaySinh" type="date" defaultValue={nhanKhau?.ngaySinh} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gioiTinh">Giới tính</Label>
              <Select value={gioiTinh} onValueChange={(value) => setGioiTinh(value as "Nam" | "Nữ" | "Khác")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Nam">Nam</SelectItem>
                  <SelectItem value="Nữ">Nữ</SelectItem>
                  <SelectItem value="Khác">Khác</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cccd">CCCD/CMND</Label>
              <Input id="cccd" name="cccd" defaultValue={nhanKhau?.cccd} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="soDienThoai">Số điện thoại</Label>
              <Input id="soDienThoai" name="soDienThoai" type="tel" defaultValue={nhanKhau?.soDienThoai} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ngheNghiep">Nghề nghiệp</Label>
              <Input id="ngheNghiep" name="ngheNghiep" defaultValue={nhanKhau?.ngheNghiep} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hoKhauId">Hộ khẩu</Label>
              <Select value={hoKhauId} onValueChange={setHoKhauId} required>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn hộ khẩu" />
                </SelectTrigger>
                <SelectContent>
                  {hoKhauList.map((hoKhau) => (
                    <SelectItem key={hoKhau.id} value={hoKhau.id}>
                      {hoKhau.maHoKhau} - {hoKhau.chuHo} (Phòng {hoKhau.soPhong})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="quanHeChuHo">Quan hệ với chủ hộ</Label>
              <Input id="quanHeChuHo" name="quanHeChuHo" defaultValue={nhanKhau?.quanHeChuHo} required />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Hủy
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Đang lưu..." : nhanKhau ? "Cập nhật" : "Thêm mới"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
