"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
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
  Home,
  MoreHorizontal
} from "lucide-react"
import { toast } from "sonner"

interface HoKhau {
  id: number
  tenChuHo: string
  diaChi: string
  ngayTao: string
  trangThai: number
  soNhanKhau: number
}

interface PageData {
  content: HoKhau[]
  totalPages: number
  totalElements: number
  number: number
  size: number
}

export default function HoKhauPage() {
  const router = useRouter()
  const { user, isAdmin, isStaff } = useAuth()
  const [pageData, setPageData] = useState<PageData | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(0)
  const [searchKeyword, setSearchKeyword] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingHoKhau, setEditingHoKhau] = useState<HoKhau | null>(null)
  const [formData, setFormData] = useState({
    tenChuHo: "",
    diaChi: "",
    trangThai: "1"
  })

  const fetchHoKhau = async (page: number = 0) => {
    try {
      setLoading(true)
      const response = await api.get(`/api/hokhau/paged?page=${page}&size=10&sortBy=id&sortDir=asc`)
      if (response.ok) {
        const data = await response.json()
        setPageData(data)
        setCurrentPage(page)
      } else {
        toast.error("Không thể tải danh sách hộ khẩu")
      }
    } catch (error) {
      console.error("Error fetching ho khau:", error)
      toast.error("Lỗi khi tải dữ liệu")
    } finally {
      setLoading(false)
    }
  }


  useEffect(() => {
    fetchHoKhau(0)
  }, [])

  const handleDelete = async (id: number) => {
    if (!isAdmin()) {
      toast.error("Bạn không có quyền xóa hộ khẩu")
      return
    }

    if (!confirm("Bạn có chắc chắn muốn xóa hộ khẩu này?")) {
      return
    }

    try {
      const response = await api.delete(`/api/hokhau/${id}`)
      if (response.ok) {
        toast.success("Xóa hộ khẩu thành công")
        fetchHoKhau(currentPage)
      } else {
        toast.error("Không thể xóa hộ khẩu")
      }
    } catch (error) {
      console.error("Error deleting ho khau:", error)
      toast.error("Lỗi khi xóa hộ khẩu")
    }
  }

  const handleNextPage = () => {
    if (pageData && currentPage < pageData.totalPages - 1) {
      fetchHoKhau(currentPage + 1)
    }
  }

  const handlePrevPage = () => {
    if (currentPage > 0) {
      fetchHoKhau(currentPage - 1)
    }
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isAdmin()) {
      toast.error("Bạn không có quyền thêm hộ khẩu")
      return
    }

    try {
      const response = await api.post("/api/hokhau", {
        tenChuHo: formData.tenChuHo,
        diaChi: formData.diaChi,
        trangThai: Number(formData.trangThai)
      })

      if (response.ok) {
        toast.success("Thêm hộ khẩu thành công")
        setIsAddDialogOpen(false)
        setFormData({
          tenChuHo: "",
          diaChi: "",
          trangThai: "1"
        })
        fetchHoKhau(currentPage)
      } else {
        toast.error("Không thể thêm hộ khẩu")
      }
    } catch (error) {
      console.error("Error adding ho khau:", error)
      toast.error("Lỗi khi thêm hộ khẩu")
    }
  }

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isAdmin() || !editingHoKhau) return

    try {
      const response = await api.put(`/api/hokhau/${editingHoKhau.id}`, {
        tenChuHo: formData.tenChuHo,
        diaChi: formData.diaChi,
        trangThai: Number(formData.trangThai)
      })

      if (response.ok) {
        toast.success("Cập nhật hộ khẩu thành công")
        setIsEditDialogOpen(false)
        setEditingHoKhau(null)
        fetchHoKhau(currentPage)
      } else {
        toast.error("Không thể cập nhật hộ khẩu")
      }
    } catch (error) {
      console.error("Error updating ho khau:", error)
      toast.error("Lỗi khi cập nhật hộ khẩu")
    }
  }

  const openEditDialog = (hoKhau: HoKhau) => {
    setEditingHoKhau(hoKhau)
    setFormData({
      tenChuHo: hoKhau.tenChuHo,
      diaChi: hoKhau.diaChi,
      trangThai: hoKhau.trangThai.toString()
    })
    setIsEditDialogOpen(true)
  }

  const filteredHoKhau = pageData?.content.filter(
    (hk) =>
      searchKeyword === "" ||
      hk.tenChuHo.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      hk.diaChi.toLowerCase().includes(searchKeyword.toLowerCase())
  ) || []

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Quản lý hộ khẩu</h1>
          <p className="text-muted-foreground mt-1">
            Danh sách các hộ gia đình trong chung cư
          </p>
        </div>
        {isAdmin() && (
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Thêm hộ khẩu
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Thêm hộ khẩu mới</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAdd} className="space-y-4">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tenChuHo">Tên chủ hộ *</Label>
                    <Input
                      id="tenChuHo"
                      value={formData.tenChuHo}
                      onChange={(e) => setFormData({ ...formData, tenChuHo: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="diaChi">Địa chỉ *</Label>
                    <Input
                      id="diaChi"
                      value={formData.diaChi}
                      onChange={(e) => setFormData({ ...formData, diaChi: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="trangThai">Trạng thái *</Label>
                    <Select
                      value={formData.trangThai}
                      onValueChange={(value) => setFormData({ ...formData, trangThai: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Hoạt động</SelectItem>
                        <SelectItem value="0">Không hoạt động</SelectItem>
                      </SelectContent>
                    </Select>
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
                <Home className="h-5 w-5" />
                Danh sách hộ khẩu
              </CardTitle>
              <CardDescription className="mt-1">
                {pageData ? `Tổng số: ${pageData.totalElements} hộ` : "Đang tải..."}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm theo tên chủ hộ..."
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
          ) : filteredHoKhau.length > 0 ? (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>STT</TableHead>
                    <TableHead>Tên chủ hộ</TableHead>
                    <TableHead>Địa chỉ</TableHead>
                    <TableHead>Số thành viên</TableHead>
                    <TableHead>Ngày tạo</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredHoKhau.map((hoKhau, index) => (
                    <TableRow key={hoKhau.id}>
                      <TableCell>{currentPage * 10 + index + 1}</TableCell>
                      <TableCell className="font-medium">{hoKhau.tenChuHo}</TableCell>
                      <TableCell>{hoKhau.diaChi}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{hoKhau.soNhanKhau} người</Badge>
                      </TableCell>
                      <TableCell>{formatDate(hoKhau.ngayTao)}</TableCell>
                      <TableCell>
                        <Badge variant={hoKhau.trangThai === 1 ? "default" : "destructive"}>
                          {hoKhau.trangThai === 1 ? "Hoạt động" : "Không hoạt động"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Mở menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => router.push(`/dashboard/ho-khau/${hoKhau.id}`)}>
                              <Eye className="mr-2 h-4 w-4" />
                              Xem chi tiết
                            </DropdownMenuItem>
                            {isAdmin() && (
                              <>
                                <DropdownMenuItem onClick={() => openEditDialog(hoKhau)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Chỉnh sửa
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDelete(hoKhau.id)}
                                  className="text-red-600 focus:text-red-600"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Xóa
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                  Trang {currentPage + 1} / {pageData?.totalPages || 1}
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
                    disabled={!pageData || currentPage >= pageData.totalPages - 1}
                  >
                    Sau
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              {searchKeyword ? "Không tìm thấy hộ khẩu nào" : "Không có dữ liệu"}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Cập nhật hộ khẩu</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEdit} className="space-y-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-tenChuHo">Tên chủ hộ *</Label>
                <Input
                  id="edit-tenChuHo"
                  value={formData.tenChuHo}
                  onChange={(e) => setFormData({ ...formData, tenChuHo: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-diaChi">Địa chỉ *</Label>
                <Input
                  id="edit-diaChi"
                  value={formData.diaChi}
                  onChange={(e) => setFormData({ ...formData, diaChi: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-trangThai">Trạng thái *</Label>
                <Select
                  value={formData.trangThai}
                  onValueChange={(value) => setFormData({ ...formData, trangThai: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Hoạt động</SelectItem>
                    <SelectItem value="0">Không hoạt động</SelectItem>
                  </SelectContent>
                </Select>
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
