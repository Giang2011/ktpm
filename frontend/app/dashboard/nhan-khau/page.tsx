"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { api } from "@/lib/api-client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Edit,
  Trash2,
  Eye,
  Plus,
  ChevronLeft,
  ChevronRight,
  Search,
  Users,
  MoreHorizontal
} from "lucide-react"
import { toast } from "sonner"

interface NhanKhau {
  id: number
  hoKhauId: number
  tenChuHo: string
  diaChi: string
  hoTen: string
  ngaySinh: string
  gioiTinh: string
  cmndCccd: string
  quanHeVoiChuHo: string
  ngheNghiep: string
}

interface HoKhau {
  id: number
  tenChuHo: string
  diaChi: string
  ngayTao: string
  trangThai: number
  soNhanKhau: number
}

interface PageData {
  content: NhanKhau[]
  totalPages: number
  totalElements: number
  number: number
  size: number
}

export default function NhanKhauPage() {
  const { user, isAdmin, isStaff } = useAuth()
  const [pageData, setPageData] = useState<PageData | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(0)
  const [selectedNhanKhau, setSelectedNhanKhau] = useState<NhanKhau | null>(null)
  const [searchKeyword, setSearchKeyword] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingNhanKhau, setEditingNhanKhau] = useState<NhanKhau | null>(null)
  const [hoKhauList, setHoKhauList] = useState<HoKhau[]>([])
  const [hoKhauLoading, setHoKhauLoading] = useState(false)
  const [hoKhauSearchKeyword, setHoKhauSearchKeyword] = useState("")
  const [formData, setFormData] = useState({
    hoTen: "",
    ngaySinh: "",
    gioiTinh: "Nam",
    cmndCccd: "",
    ngheNghiep: "",
    hoKhauId: "",
    quanHeVoiChuHo: ""
  })

  const fetchNhanKhau = async (page: number = 0) => {
    try {
      setLoading(true)
      const response = await api.get(`/api/nhankhau/paged?page=${page}&size=10&sortBy=id&sortDir=asc`)
      if (response.ok) {
        const data = await response.json()
        setPageData(data)
        setCurrentPage(page)
      } else {
        toast.error("Không thể tải danh sách nhân khẩu")
      }
    } catch (error) {
      console.error("Error fetching nhan khau:", error)
      toast.error("Lỗi khi tải dữ liệu")
    } finally {
      setLoading(false)
    }
  }

  const fetchHoKhau = async () => {
    try {
      setHoKhauLoading(true)
      const response = await api.get("/api/hokhau")
      if (response.ok) {
        const data = await response.json()
        setHoKhauList(data)
      } else {
        toast.error("Không thể tải danh sách hộ khẩu")
      }
    } catch (error) {
      console.error("Error fetching ho khau:", error)
      toast.error("Lỗi khi tải danh sách hộ khẩu")
    } finally {
      setHoKhauLoading(false)
    }
  }

  useEffect(() => {
    fetchNhanKhau(0)
    fetchHoKhau()
  }, [])

  const handleDelete = async (id: number) => {
    if (!isAdmin()) {
      toast.error("Bạn không có quyền xóa nhân khẩu")
      return
    }

    if (!confirm("Bạn có chắc chắn muốn xóa nhân khẩu này?")) {
      return
    }

    try {
      const response = await api.delete(`/api/nhankhau/${id}`)
      if (response.ok) {
        toast.success("Xóa nhân khẩu thành công")
        fetchNhanKhau(currentPage)
      } else {
        toast.error("Không thể xóa nhân khẩu")
      }
    } catch (error) {
      console.error("Error deleting nhan khau:", error)
      toast.error("Lỗi khi xóa nhân khẩu")
    }
  }

  const handleNextPage = () => {
    if (pageData && currentPage < pageData.totalPages - 1) {
      fetchNhanKhau(currentPage + 1)
    }
  }

  const handlePrevPage = () => {
    if (currentPage > 0) {
      fetchNhanKhau(currentPage - 1)
    }
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isAdmin()) {
      toast.error("Bạn không có quyền thêm nhân khẩu")
      return
    }

    try {
      const response = await api.post("/api/nhankhau", {
        hoTen: formData.hoTen,
        ngaySinh: formData.ngaySinh,
        gioiTinh: formData.gioiTinh,
        cmndCccd: formData.cmndCccd,
        ngheNghiep: formData.ngheNghiep,
        hoKhauId: Number(formData.hoKhauId),
        quanHeVoiChuHo: formData.quanHeVoiChuHo
      })

      if (response.ok) {
        toast.success("Thêm nhân khẩu thành công")
        setIsAddDialogOpen(false)
        setFormData({
          hoTen: "",
          ngaySinh: "",
          gioiTinh: "Nam",
          cmndCccd: "",
          ngheNghiep: "",
          hoKhauId: "",
          quanHeVoiChuHo: ""
        })
        setHoKhauSearchKeyword("")
        fetchNhanKhau(currentPage)
      } else {
        toast.error("Không thể thêm nhân khẩu")
      }
    } catch (error) {
      console.error("Error adding nhan khau:", error)
      toast.error("Lỗi khi thêm nhân khẩu")
    }
  }

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isAdmin() || !editingNhanKhau) return

    try {
      const response = await api.put(`/api/nhankhau/${editingNhanKhau.id}`, {
        hoTen: formData.hoTen,
        ngaySinh: formData.ngaySinh,
        gioiTinh: formData.gioiTinh,
        cmndCccd: formData.cmndCccd,
        ngheNghiep: formData.ngheNghiep,
        hoKhauId: Number(formData.hoKhauId),
        quanHeVoiChuHo: formData.quanHeVoiChuHo
      })

      if (response.ok) {
        toast.success("Cập nhật nhân khẩu thành công")
        setIsEditDialogOpen(false)
        setEditingNhanKhau(null)
        setHoKhauSearchKeyword("")
        fetchNhanKhau(currentPage)
      } else {
        toast.error("Không thể cập nhật nhân khẩu")
      }
    } catch (error) {
      console.error("Error updating nhan khau:", error)
      toast.error("Lỗi khi cập nhật nhân khẩu")
    }
  }

  const openEditDialog = (nhanKhau: NhanKhau) => {
    setEditingNhanKhau(nhanKhau)
    setFormData({
      hoTen: nhanKhau.hoTen,
      ngaySinh: nhanKhau.ngaySinh,
      gioiTinh: nhanKhau.gioiTinh,
      cmndCccd: nhanKhau.cmndCccd,
      ngheNghiep: nhanKhau.ngheNghiep,
      hoKhauId: nhanKhau.hoKhauId.toString(),
      quanHeVoiChuHo: nhanKhau.quanHeVoiChuHo
    })
    setHoKhauSearchKeyword("")
    setIsEditDialogOpen(true)
  }

  const filteredHoKhauList = hoKhauList.filter(
    (hk) =>
      hoKhauSearchKeyword === "" ||
      hk.tenChuHo.toLowerCase().includes(hoKhauSearchKeyword.toLowerCase()) ||
      hk.diaChi.toLowerCase().includes(hoKhauSearchKeyword.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Quản lý nhân khẩu</h1>
          <p className="text-muted-foreground mt-1">
            Danh sách cư dân trong chung cư
          </p>
        </div>
        {isAdmin() && (
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Thêm nhân khẩu
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Thêm nhân khẩu mới</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAdd} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="hoTen">Họ và tên *</Label>
                    <Input
                      id="hoTen"
                      value={formData.hoTen}
                      onChange={(e) => setFormData({ ...formData, hoTen: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ngaySinh">Ngày sinh *</Label>
                    <Input
                      id="ngaySinh"
                      type="date"
                      value={formData.ngaySinh}
                      onChange={(e) => setFormData({ ...formData, ngaySinh: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gioiTinh">Giới tính *</Label>
                    <Select
                      value={formData.gioiTinh}
                      onValueChange={(value) => setFormData({ ...formData, gioiTinh: value })}
                    >
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
                    <Label htmlFor="cmndCccd">CMND/CCCD *</Label>
                    <Input
                      id="cmndCccd"
                      value={formData.cmndCccd}
                      onChange={(e) => setFormData({ ...formData, cmndCccd: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ngheNghiep">Nghề nghiệp</Label>
                    <Input
                      id="ngheNghiep"
                      value={formData.ngheNghiep}
                      onChange={(e) => setFormData({ ...formData, ngheNghiep: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hoKhauId">Hộ khẩu *</Label>
                    <Select
                      value={formData.hoKhauId}
                      onValueChange={(value) => setFormData({ ...formData, hoKhauId: value })}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn hộ khẩu" />
                      </SelectTrigger>
                      <SelectContent>
                        <div className="p-2">
                          <Input
                            placeholder="Tìm kiếm hộ khẩu..."
                            value={hoKhauSearchKeyword}
                            onChange={(e) => setHoKhauSearchKeyword(e.target.value)}
                            className="mb-2"
                          />
                        </div>
                        {hoKhauLoading ? (
                          <div className="p-4 text-center text-sm text-muted-foreground">
                            Đang tải...
                          </div>
                        ) : filteredHoKhauList.length === 0 ? (
                          <div className="p-4 text-center text-sm text-muted-foreground">
                            {hoKhauSearchKeyword ? "Không tìm thấy hộ khẩu" : "Không có hộ khẩu nào"}
                          </div>
                        ) : (
                          filteredHoKhauList.map((hoKhau) => (
                            <SelectItem key={hoKhau.id} value={hoKhau.id.toString()}>
                              <div className="flex flex-col">
                                <span className="font-medium">{hoKhau.tenChuHo}</span>
                                <span className="text-xs text-muted-foreground">{hoKhau.diaChi}</span>
                              </div>
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="quanHeVoiChuHo">Quan hệ với chủ hộ *</Label>
                    <Input
                      id="quanHeVoiChuHo"
                      value={formData.quanHeVoiChuHo}
                      onChange={(e) => setFormData({ ...formData, quanHeVoiChuHo: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Hủy
                  </Button>
                  <Button type="submit">Thêm mới</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Danh sách nhân khẩu
              </CardTitle>
              <CardDescription className="mt-1">
                {pageData ? `Tổng số: ${pageData.totalElements} người` : "Đang tải..."}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm theo tên..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Đang tải...</div>
          ) : pageData && pageData.content.length > 0 ? (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>STT</TableHead>
                    <TableHead>Họ và tên</TableHead>
                    <TableHead>Ngày sinh</TableHead>
                    <TableHead>Giới tính</TableHead>
                    <TableHead>CMND/CCCD</TableHead>
                    <TableHead>Hộ khẩu</TableHead>
                    <TableHead>Quan hệ</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pageData.content
                    .filter((nk) =>
                      searchKeyword === "" ||
                      nk.hoTen.toLowerCase().includes(searchKeyword.toLowerCase())
                    )
                    .map((nhanKhau, index) => (
                      <TableRow key={nhanKhau.id}>
                        <TableCell>{currentPage * 10 + index + 1}</TableCell>
                        <TableCell className="font-medium">{nhanKhau.hoTen}</TableCell>
                        <TableCell>{nhanKhau.ngaySinh}</TableCell>
                        <TableCell>
                          <Badge variant={nhanKhau.gioiTinh === "Nam" ? "default" : "secondary"}>
                            {nhanKhau.gioiTinh}
                          </Badge>
                        </TableCell>
                        <TableCell>{nhanKhau.cmndCccd}</TableCell>
                        <TableCell>{nhanKhau.tenChuHo}</TableCell>
                        <TableCell>{nhanKhau.quanHeVoiChuHo}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setSelectedNhanKhau(nhanKhau)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>Chi tiết nhân khẩu</DialogTitle>
                                </DialogHeader>
                                {selectedNhanKhau && (
                                  <div className="grid gap-4 md:grid-cols-2">
                                    <div>
                                      <Label className="text-muted-foreground">Họ và tên</Label>
                                      <p className="font-medium">{selectedNhanKhau.hoTen}</p>
                                    </div>
                                    <div>
                                      <Label className="text-muted-foreground">Họ và tên</Label>
                                      <p className="font-medium">{selectedNhanKhau.hoTen}</p>
                                    </div>
                                    <div>
                                      <Label className="text-muted-foreground">Ngày sinh</Label>
                                      <p className="font-medium">{selectedNhanKhau.ngaySinh}</p>
                                    </div>
                                    <div>
                                      <Label className="text-muted-foreground">Giới tính</Label>
                                      <p className="font-medium">{selectedNhanKhau.gioiTinh}</p>
                                    </div>
                                    <div>
                                      <Label className="text-muted-foreground">CMND/CCCD</Label>
                                      <p className="font-medium">{selectedNhanKhau.cmndCccd}</p>
                                    </div>
                                    <div>
                                      <Label className="text-muted-foreground">Nghề nghiệp</Label>
                                      <p className="font-medium">{selectedNhanKhau.ngheNghiep || "Chưa có"}</p>
                                    </div>
                                    <div>
                                      <Label className="text-muted-foreground">Tên chủ hộ</Label>
                                      <p className="font-medium">{selectedNhanKhau.tenChuHo}</p>
                                    </div>
                                    <div>
                                      <Label className="text-muted-foreground">Địa chỉ hộ khẩu</Label>
                                      <p className="font-medium">{selectedNhanKhau.diaChi}</p>
                                    </div>
                                    <div className="md:col-span-2">
                                      <Label className="text-muted-foreground">Quan hệ với chủ hộ</Label>
                                      <p className="font-medium">{selectedNhanKhau.quanHeVoiChuHo}</p>
                                    </div>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
                            {isAdmin() && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => openEditDialog(nhanKhau)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDelete(nhanKhau.id)}
                                >
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>

              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                  Trang {currentPage + 1} / {pageData.totalPages}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrevPage}
                    disabled={currentPage === 0}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Trước
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNextPage}
                    disabled={currentPage >= pageData.totalPages - 1}
                  >
                    Sau
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Không có dữ liệu
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Cập nhật nhân khẩu</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEdit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="edit-hoTen">Họ và tên *</Label>
                <Input
                  id="edit-hoTen"
                  value={formData.hoTen}
                  onChange={(e) => setFormData({ ...formData, hoTen: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-ngaySinh">Ngày sinh *</Label>
                <Input
                  id="edit-ngaySinh"
                  type="date"
                  value={formData.ngaySinh}
                  onChange={(e) => setFormData({ ...formData, ngaySinh: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-gioiTinh">Giới tính *</Label>
                <Select
                  value={formData.gioiTinh}
                  onValueChange={(value) => setFormData({ ...formData, gioiTinh: value })}
                >
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
                <Label htmlFor="edit-cmndCccd">CMND/CCCD *</Label>
                <Input
                  id="edit-cmndCccd"
                  value={formData.cmndCccd}
                  onChange={(e) => setFormData({ ...formData, cmndCccd: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-ngheNghiep">Nghề nghiệp</Label>
                <Input
                  id="edit-ngheNghiep"
                  value={formData.ngheNghiep}
                  onChange={(e) => setFormData({ ...formData, ngheNghiep: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-hoKhauId">Hộ khẩu *</Label>
                <Select
                  value={formData.hoKhauId}
                  onValueChange={(value) => setFormData({ ...formData, hoKhauId: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn hộ khẩu" />
                  </SelectTrigger>
                  <SelectContent>
                    <div className="p-2">
                      <Input
                        placeholder="Tìm kiếm hộ khẩu..."
                        value={hoKhauSearchKeyword}
                        onChange={(e) => setHoKhauSearchKeyword(e.target.value)}
                        className="mb-2"
                      />
                    </div>
                    {hoKhauLoading ? (
                      <div className="p-4 text-center text-sm text-muted-foreground">
                        Đang tải...
                      </div>
                    ) : filteredHoKhauList.length === 0 ? (
                      <div className="p-4 text-center text-sm text-muted-foreground">
                        {hoKhauSearchKeyword ? "Không tìm thấy hộ khẩu" : "Không có hộ khẩu nào"}
                      </div>
                    ) : (
                      filteredHoKhauList.map((hoKhau) => (
                        <SelectItem key={hoKhau.id} value={hoKhau.id.toString()}>
                          <div className="flex flex-col">
                            <span className="font-medium">{hoKhau.tenChuHo}</span>
                            <span className="text-xs text-muted-foreground">{hoKhau.diaChi}</span>
                          </div>
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="edit-quanHeVoiChuHo">Quan hệ với chủ hộ *</Label>
                <Input
                  id="edit-quanHeVoiChuHo"
                  value={formData.quanHeVoiChuHo}
                  onChange={(e) => setFormData({ ...formData, quanHeVoiChuHo: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Hủy
              </Button>
              <Button type="submit">Cập nhật</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
