"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createKhoanThu, updateKhoanThu } from "@/app/actions/khoan-thu-actions"
import type { KhoanThu } from "@/lib/data-store"
import type { UserRole } from "@/lib/auth-context"
import { useAuth } from "@/lib/auth-context"
import { Plus, Lock } from "lucide-react"

type KhoanThuFormProps = {
  khoanThu?: KhoanThu
  trigger?: React.ReactNode
  requireRole?: UserRole
}

export function KhoanThuForm({ khoanThu, trigger, requireRole }: KhoanThuFormProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loaiKhoanThu, setLoaiKhoanThu] = useState<"Định kỳ" | "Một lần">(khoanThu?.loaiKhoanThu || "Định kỳ")
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
      tenKhoanThu: formData.get("tenKhoanThu") as string,
      loaiKhoanThu,
      soTien: Number(formData.get("soTien")),
      donViTinh: formData.get("donViTinh") as string,
      moTa: formData.get("moTa") as string,
      ngayApDung: formData.get("ngayApDung") as string,
    }

    try {
      if (khoanThu) {
        await updateKhoanThu(khoanThu.id, data)
      } else {
        await createKhoanThu(data)
      }
      setOpen(false)
    } catch (error) {
      console.error("Error saving khoản thu:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!canEdit && trigger) {
    return (
      <Button variant="ghost" size="sm" disabled title="Chỉ Kế toán mới có quyền chỉnh sửa">
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
            Thêm khoản thu
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{khoanThu ? "Chỉnh sửa khoản thu" : "Thêm khoản thu mới"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="tenKhoanThu">Tên khoản thu</Label>
              <Input id="tenKhoanThu" name="tenKhoanThu" defaultValue={khoanThu?.tenKhoanThu} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="loaiKhoanThu">Loại khoản thu</Label>
              <Select value={loaiKhoanThu} onValueChange={(value) => setLoaiKhoanThu(value as "Định kỳ" | "Một lần")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Định kỳ">Định kỳ</SelectItem>
                  <SelectItem value="Một lần">Một lần</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="soTien">Số tiền (VNĐ)</Label>
              <Input
                id="soTien"
                name="soTien"
                type="number"
                step="1000"
                min="0"
                defaultValue={khoanThu?.soTien}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="donViTinh">Đơn vị tính</Label>
              <Input
                id="donViTinh"
                name="donViTinh"
                placeholder="VD: tháng, m², người..."
                defaultValue={khoanThu?.donViTinh}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ngayApDung">Ngày áp dụng</Label>
              <Input id="ngayApDung" name="ngayApDung" type="date" defaultValue={khoanThu?.ngayApDung} required />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="moTa">Mô tả</Label>
            <Textarea
              id="moTa"
              name="moTa"
              placeholder="Mô tả chi tiết về khoản thu..."
              defaultValue={khoanThu?.moTa}
              rows={3}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Hủy
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Đang lưu..." : khoanThu ? "Cập nhật" : "Thêm mới"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
