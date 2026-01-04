"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit } from "lucide-react"
import { toast } from "sonner"
import { api } from "@/lib/api-client"
import type { TamTruTamVang, TamTruTamVangRequest } from "@/app/actions/tam-tru-tam-vang-actions"

interface NhanKhau {
  id: number
  hoTen: string
  cmndCccd: string
  ngaySinh: string
  gioiTinh: string
}

type TamTruTamVangFormProps = {
  tamTruTamVang?: TamTruTamVang
  trigger?: React.ReactNode
  onSuccess?: () => void
}

export function TamTruTamVangForm({ tamTruTamVang, trigger, onSuccess }: TamTruTamVangFormProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [nhanKhauList, setNhanKhauList] = useState<NhanKhau[]>([])
  const [nhanKhauLoading, setNhanKhauLoading] = useState(false)
  const [selectedNhanKhauId, setSelectedNhanKhauId] = useState<string>(
    tamTruTamVang?.nhanKhauId?.toString() || ""
  )
  const [loaiTamTru, setLoaiTamTru] = useState<number>(
    tamTruTamVang?.loaiTamTru ?? 0
  )
  const [searchKeyword, setSearchKeyword] = useState("")

  const fetchNhanKhau = async () => {
    try {
      setNhanKhauLoading(true)
      const response = await api.get("/api/nhankhau")
      if (response.ok) {
        const data = await response.json()
        setNhanKhauList(data)
      } else {
        toast.error("Không thể tải danh sách nhân khẩu")
      }
    } catch (error) {
      console.error("Error fetching nhan khau:", error)
      toast.error("Lỗi khi tải danh sách nhân khẩu")
    } finally {
      setNhanKhauLoading(false)
    }
  }

  useEffect(() => {
    if (open) {
      fetchNhanKhau()
    }
  }, [open])

  const filteredNhanKhau = nhanKhauList.filter((nk) => {
    if (!searchKeyword) return true
    const keyword = searchKeyword.toLowerCase()
    return (
      nk.hoTen.toLowerCase().includes(keyword) ||
      nk.cmndCccd.toLowerCase().includes(keyword)
    )
  })

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    
    if (!selectedNhanKhauId) {
      toast.error("Vui lòng chọn nhân khẩu")
      return
    }
    
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    
    // Validate địa chỉ bắt buộc khi tạm trú
    if (loaiTamTru === 0) {
      const diaChi = formData.get("diaChi") as string
      if (!diaChi || diaChi.trim() === "") {
        toast.error("Địa chỉ là bắt buộc khi đăng ký tạm trú")
        setLoading(false)
        return
      }
    }
    
    const data: TamTruTamVangRequest = {
      nhanKhauId: Number(selectedNhanKhauId),
      loaiTamTru: loaiTamTru,
      diaChi: loaiTamTru === 0 ? (formData.get("diaChi") as string) : undefined,
      soDienThoai: formData.get("soDienThoai") as string,
      ngayBatDau: formData.get("ngayBatDau") as string,
      ngayKetThuc: formData.get("ngayKetThuc") as string,
      lyDo: formData.get("lyDo") as string,
    }
    
    console.log("Submitting data:", data)

    try {
      if (tamTruTamVang) {
        const response = await api.put(`/api/tamtrutamvang/${tamTruTamVang.id}`, data)
        if (response.ok) {
          toast.success("Cập nhật tạm trú tạm vắng thành công")
          setOpen(false)
          onSuccess?.()
        } else {
          const errorText = await response.text()
          console.error("Update error:", errorText)
          toast.error(`Không thể cập nhật: ${errorText || 'Lỗi không xác định'}`)
        }
      } else {
        const response = await api.post("/api/tamtrutamvang", data)
        if (response.ok) {
          toast.success("Thêm tạm trú tạm vắng thành công")
          setOpen(false)
          onSuccess?.()
        } else {
          const errorText = await response.text()
          console.error("Create error:", errorText)
          toast.error(`Không thể thêm: ${errorText || 'Lỗi không xác định'}`)
        }
      }
    } catch (error) {
      console.error("Error saving tam tru tam vang:", error)
      toast.error("Lỗi khi lưu tạm trú tạm vắng")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Thêm tạm trú tạm vắng
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {tamTruTamVang ? "Chỉnh sửa tạm trú tạm vắng" : "Thêm tạm trú tạm vắng mới"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="nhanKhauId">Nhân khẩu *</Label>
              <div className="space-y-2">
                <Input
                  placeholder="Tìm kiếm theo tên hoặc CMND/CCCD..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                />
                <Select
                  value={selectedNhanKhauId}
                  onValueChange={setSelectedNhanKhauId}
                  required
                  disabled={nhanKhauLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn nhân khẩu" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {nhanKhauLoading ? (
                      <SelectItem value="loading" disabled>
                        Đang tải...
                      </SelectItem>
                    ) : filteredNhanKhau.length === 0 ? (
                      <SelectItem value="empty" disabled>
                        Không tìm thấy nhân khẩu
                      </SelectItem>
                    ) : (
                      filteredNhanKhau.map((nk) => (
                        <SelectItem key={nk.id} value={nk.id.toString()}>
                          {nk.hoTen} - {nk.cmndCccd}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="loaiTamTru">Loại *</Label>
              <Select
                value={loaiTamTru.toString()}
                onValueChange={(value) => setLoaiTamTru(Number(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn loại" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Tạm Trú</SelectItem>
                  <SelectItem value="1">Tạm Vắng</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {loaiTamTru === 0 && (
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="diaChi">Địa chỉ *</Label>
                <Input
                  id="diaChi"
                  name="diaChi"
                  type="text"
                  placeholder="Nhập địa chỉ tạm trú..."
                  defaultValue={tamTruTamVang?.diaChi}
                  required={loaiTamTru === 0}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="soDienThoai">Số điện thoại *</Label>
              <Input
                id="soDienThoai"
                name="soDienThoai"
                type="tel"
                placeholder="0123456789"
                defaultValue={tamTruTamVang?.soDienThoai}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ngayBatDau">Ngày bắt đầu *</Label>
              <Input
                id="ngayBatDau"
                name="ngayBatDau"
                type="date"
                defaultValue={tamTruTamVang?.ngayBatDau}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ngayKetThuc">Ngày kết thúc *</Label>
              <Input
                id="ngayKetThuc"
                name="ngayKetThuc"
                type="date"
                defaultValue={tamTruTamVang?.ngayKetThuc}
                required
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="lyDo">Lý do *</Label>
              <Textarea
                id="lyDo"
                name="lyDo"
                placeholder="Nhập lý do tạm trú/tạm vắng..."
                defaultValue={tamTruTamVang?.lyDo}
                required
                rows={4}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Hủy
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Đang lưu..." : tamTruTamVang ? "Cập nhật" : "Thêm mới"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
