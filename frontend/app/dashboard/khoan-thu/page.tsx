"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { api } from "@/lib/api-client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
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
  DollarSign,
  Users as UsersIcon,
  MoreHorizontal
} from "lucide-react"
import { toast } from "sonner"

interface KhoanThu {
  id: number
  tenKhoanThu: string
  loaiKhoanThu: number // 0: Bắt buộc, 1: Tự nguyện
  donGia: number
  moTa: string
  ngayBatDau: string
  ngayKetThuc: string | null
  tongThuDuoc: number
  soHoDaDong: number
}

interface HoKhau {
  id: number
  tenChuHo: string
  diaChi: string
  ngayTao: string
  trangThai: number
  soNhanKhau: number
}

interface KhoanThuDetail {
  khoanThu: KhoanThu
  hoDaDong: HoKhau[]
  hoChuaDong: HoKhau[] | null
  tongTienDaThu: number
  soHoDaDong: number
  soHoChuaDong: number | null
}

export default function KhoanThuPage() {
  const { user, isAdmin: isAdminUser, isStaff } = useAuth()
  const [khoanThuList, setKhoanThuList] = useState<KhoanThu[]>([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [searchKeyword, setSearchKeyword] = useState("")
  const [loaiFilter, setLoaiFilter] = useState<string>("all") // all, batbuoc, tunguyen
  const [hanNopFilter, setHanNopFilter] = useState<string>("all") // all, conhan

  // Detail dialog states
  const [selectedKhoanThu, setSelectedKhoanThu] = useState<KhoanThu | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [khoanThuDetail, setKhoanThuDetail] = useState<KhoanThuDetail | null>(null)
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)

  // Form dialog states
  const [formDialogOpen, setFormDialogOpen] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [formData, setFormData] = useState({
    tenKhoanThu: "",
    loaiKhoanThu: 0,
    donGia: 0,
    moTa: "",
    ngayBatDau: "",
    ngayKetThuc: ""
  })

  // Fetch khoản thu với pagination và filter
  const fetchKhoanThu = async () => {
    try {
      setLoading(true)

      // Xây dựng query params
      const params = new URLSearchParams({
        page: currentPage.toString(),
        size: "10",
        sortBy: "id",
        sortDir: "desc"
      })

      // Thêm filter loại khoản thu
      if (loaiFilter === "batbuoc") {
        params.append("loaiKhoanThu", "0")
      } else if (loaiFilter === "tunguyen") {
        params.append("loaiKhoanThu", "1")
      }

      // Thêm filter còn hạn nộp
      if (hanNopFilter === "conhan") {
        params.append("conHanNop", "true")
      }

      const response = await api.get(`/api/khoanthu/paged?${params.toString()}`)

      if (response.ok) {
        const data = await response.json()
        setKhoanThuList(data.content)
        setTotalPages(data.totalPages)
      } else {
        toast.error("Không thể tải danh sách khoản thu")
      }
    } catch (error) {
      console.error("Error fetching khoản thu:", error)
      toast.error("Đã xảy ra lỗi khi tải dữ liệu")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      fetchKhoanThu()
    }
  }, [currentPage, loaiFilter, hanNopFilter, user])

  // Fetch chi tiết khoản thu
  const fetchKhoanThuDetail = async (khoanThu: KhoanThu) => {
    try {
      setDetailLoading(true)
      setSelectedKhoanThu(khoanThu)

      const response = await api.get(`/api/khoanthu/${khoanThu.id}/chi-tiet`)

      if (response.ok) {
        const data = await response.json()
        setKhoanThuDetail(data)
        setDetailDialogOpen(true)
      } else {
        toast.error("Không thể tải chi tiết khoản thu")
      }
    } catch (error) {
      console.error("Error fetching detail:", error)
      toast.error("Đã xảy ra lỗi khi tải chi tiết")
    } finally {
      setDetailLoading(false)
    }
  }

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1)
    }
  }

  const handleAdd = () => {
    setEditMode(false)
    setFormData({
      tenKhoanThu: "",
      loaiKhoanThu: 0,
      donGia: 0,
      moTa: "",
      ngayBatDau: "",
      ngayKetThuc: ""
    })
    setFormDialogOpen(true)
  }

  const handleEdit = (khoanThu: KhoanThu) => {
    setEditMode(true)
    setSelectedKhoanThu(khoanThu)
    setFormData({
      tenKhoanThu: khoanThu.tenKhoanThu,
      loaiKhoanThu: khoanThu.loaiKhoanThu,
      donGia: khoanThu.donGia,
      moTa: khoanThu.moTa,
      ngayBatDau: khoanThu.ngayBatDau,
      ngayKetThuc: khoanThu.ngayKetThuc || ""
    })
    setFormDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (!isStaff()) {
      toast.error("Bạn không có quyền xóa khoản thu")
      return
    }

    if (!confirm("Bạn có chắc chắn muốn xóa khoản thu này?")) return

    try {
      const response = await api.delete(`/api/khoanthu/${id}`)
      if (response.ok) {
        toast.success("Xóa khoản thu thành công")
        fetchKhoanThu()
      } else {
        toast.error("Không thể xóa khoản thu")
      }
    } catch (error) {
      console.error("Error deleting:", error)
      toast.error("Đã xảy ra lỗi khi xóa")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation: ngayKetThuc phải sau ngayBatDau
    if (formData.ngayKetThuc && formData.ngayBatDau) {
      const ngayBatDau = new Date(formData.ngayBatDau)
      const ngayKetThuc = new Date(formData.ngayKetThuc)

      if (ngayKetThuc <= ngayBatDau) {
        toast.error("Ngày kết thúc phải sau ngày bắt đầu")
        return
      }
    }

    try {
      let response
      if (editMode) {
        response = await api.put(`/api/khoanthu/${selectedKhoanThu?.id}`, formData)
      } else {
        response = await api.post("/api/khoanthu", formData)
      }

      if (response.ok) {
        toast.success(editMode ? "Cập nhật thành công" : "Thêm mới thành công")
        setFormDialogOpen(false)
        fetchKhoanThu()
      } else {
        toast.error("Có lỗi xảy ra")
      }
    } catch (error) {
      console.error("Error submitting:", error)
      toast.error("Đã xảy ra lỗi")
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Không giới hạn"
    return new Date(dateString).toLocaleDateString('vi-VN')
  }

  const isConHan = (ngayKetThuc: string | null) => {
    if (!ngayKetThuc) return true
    return new Date(ngayKetThuc) >= new Date()
  }

  // Client-side filtering for instant search
  const filteredKhoanThu = khoanThuList.filter((kt) =>
    searchKeyword === "" ||
    kt.tenKhoanThu.toLowerCase().includes(searchKeyword.toLowerCase())
  )

  if (!user) {
    return <div className="flex items-center justify-center h-screen">Vui lòng đăng nhập</div>
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold flex items-center gap-2">
            <DollarSign className="h-8 w-8" />
            QUẢN LÝ KHOẢN THU
          </CardTitle>
          <CardDescription>
            Quản lý các khoản thu của chung cư
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search và Filter */}
          <div className="mb-6 space-y-4">
            <div className="flex gap-4 flex-wrap items-end">
              <div className="flex-1 min-w-[250px]">
                <Label htmlFor="search">Tìm kiếm theo tên khoản thu</Label>
                <div className="relative mt-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Nhập tên khoản thu..."
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="w-[200px]">
                <Label htmlFor="loaiFilter">Loại khoản thu</Label>
                <Select value={loaiFilter} onValueChange={setLoaiFilter}>
                  <SelectTrigger id="loaiFilter" className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="batbuoc">Bắt buộc</SelectItem>
                    <SelectItem value="tunguyen">Tự nguyện</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="w-[200px]">
                <Label htmlFor="hanNopFilter">Thời hạn</Label>
                <Select value={hanNopFilter} onValueChange={setHanNopFilter}>
                  <SelectTrigger id="hanNopFilter" className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="conhan">Còn hạn nộp</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {isStaff() && (
                <Button onClick={handleAdd} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Thêm khoản thu
                </Button>
              )}
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <div className="text-center py-8">Đang tải...</div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[60px]">STT</TableHead>
                      <TableHead>Tên khoản thu</TableHead>
                      <TableHead>Loại</TableHead>
                      <TableHead>Đơn giá</TableHead>
                      <TableHead>Ngày bắt đầu</TableHead>
                      <TableHead>Ngày kết thúc</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead>Tổng thu</TableHead>
                      <TableHead>Số hộ đã đóng</TableHead>
                      <TableHead className="text-right">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredKhoanThu.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                          Không có dữ liệu
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredKhoanThu.map((khoanThu, index) => (
                        <TableRow key={khoanThu.id}>
                          <TableCell>{currentPage * 10 + index + 1}</TableCell>
                          <TableCell className="font-medium">{khoanThu.tenKhoanThu}</TableCell>
                          <TableCell>
                            <Badge variant={khoanThu.loaiKhoanThu === 0 ? "destructive" : "secondary"}>
                              {khoanThu.loaiKhoanThu === 0 ? "Bắt buộc" : "Tự nguyện"}
                            </Badge>
                          </TableCell>
                          <TableCell>{formatCurrency(khoanThu.donGia)}</TableCell>
                          <TableCell>{formatDate(khoanThu.ngayBatDau)}</TableCell>
                          <TableCell>{formatDate(khoanThu.ngayKetThuc)}</TableCell>
                          <TableCell>
                            <Badge variant={isConHan(khoanThu.ngayKetThuc) ? "default" : "outline"}>
                              {isConHan(khoanThu.ngayKetThuc) ? "Còn hạn" : "Hết hạn"}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-semibold text-green-600">
                            {formatCurrency(khoanThu.tongThuDuoc)}
                          </TableCell>
                          <TableCell>{khoanThu.soHoDaDong}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Mở menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => fetchKhoanThuDetail(khoanThu)}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  Xem chi tiết
                                </DropdownMenuItem>
                                {isStaff() && (
                                  <>
                                    <DropdownMenuItem onClick={() => handleEdit(khoanThu)}>
                                      <Edit className="mr-2 h-4 w-4" />
                                      Chỉnh sửa
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => handleDelete(khoanThu.id)}
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
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                  Trang {currentPage + 1} / {totalPages || 1}
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
                    disabled={currentPage >= totalPages - 1}
                  >
                    Sau
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="max-w-[98vw] w-[98vw] max-h-[96vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Chi tiết khoản thu</DialogTitle>
          </DialogHeader>
          {detailLoading ? (
            <div className="py-8 text-center">Đang tải...</div>
          ) : khoanThuDetail && selectedKhoanThu ? (
            <div className="space-y-6">
              {/* Thông tin khoản thu */}
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="text-xl">Thông tin khoản thu</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-xs text-muted-foreground uppercase">Tên khoản thu</Label>
                      <p className="text-lg font-semibold mt-1">{selectedKhoanThu.tenKhoanThu}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground uppercase">Loại</Label>
                      <div className="mt-1">
                        <Badge variant={selectedKhoanThu.loaiKhoanThu === 0 ? "destructive" : "secondary"}>
                          {selectedKhoanThu.loaiKhoanThu === 0 ? "Bắt buộc" : "Tự nguyện"}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground uppercase">Đơn giá</Label>
                      <p className="text-lg font-semibold mt-1">{formatCurrency(selectedKhoanThu.donGia)}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground uppercase">Ngày bắt đầu</Label>
                      <p className="text-base mt-1">{formatDate(selectedKhoanThu.ngayBatDau)}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground uppercase">Ngày kết thúc</Label>
                      <p className="text-base mt-1">{formatDate(selectedKhoanThu.ngayKetThuc)}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground uppercase">Trạng thái</Label>
                      <div className="mt-1">
                        <Badge variant={isConHan(selectedKhoanThu.ngayKetThuc) ? "default" : "outline"}>
                          {isConHan(selectedKhoanThu.ngayKetThuc) ? "Còn hạn" : "Hết hạn"}
                        </Badge>
                      </div>
                    </div>
                    <div className="md:col-span-3">
                      <Label className="text-xs text-muted-foreground uppercase">Mô tả</Label>
                      <p className="text-base mt-1">{selectedKhoanThu.moTa || "Không có mô tả"}</p>
                    </div>
                  </div>
                  <div className="mt-6 p-4 bg-green-50 dark:bg-green-950 rounded-lg border-2 border-green-200 dark:border-green-800">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs text-muted-foreground uppercase">Tổng tiền đã thu</Label>
                        <p className="text-2xl font-bold text-green-600 mt-1">
                          {formatCurrency(khoanThuDetail.tongTienDaThu)}
                        </p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground uppercase">Số hộ đã đóng</Label>
                        <p className="text-2xl font-bold text-green-600 mt-1">
                          {khoanThuDetail.soHoDaDong} hộ
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Danh sách hộ đã đóng */}
              <Card className="border-2 border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2 text-green-700 dark:text-green-400">
                    <UsersIcon className="h-5 w-5" />
                    Danh sách hộ đã đóng
                    <Badge variant="secondary" className="ml-2">
                      {khoanThuDetail.hoDaDong.length}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {khoanThuDetail.hoDaDong.length === 0 ? (
                    <p className="text-center py-4 text-muted-foreground">Chưa có hộ nào đóng</p>
                  ) : (
                    <div className="rounded-md border bg-white dark:bg-gray-950">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>STT</TableHead>
                            <TableHead>Tên chủ hộ</TableHead>
                            <TableHead>Địa chỉ</TableHead>
                            <TableHead>Số nhân khẩu</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {khoanThuDetail.hoDaDong.map((ho, index) => (
                            <TableRow key={ho.id}>
                              <TableCell>{index + 1}</TableCell>
                              <TableCell className="font-medium">{ho.tenChuHo}</TableCell>
                              <TableCell>{ho.diaChi}</TableCell>
                              <TableCell>{ho.soNhanKhau}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Danh sách hộ chưa đóng (chỉ hiển thị với khoản bắt buộc) */}
              {selectedKhoanThu.loaiKhoanThu === 0 && khoanThuDetail.hoChuaDong && (
                <Card className="border-2 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950">
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2 text-red-700 dark:text-red-400">
                      <UsersIcon className="h-5 w-5" />
                      Danh sách hộ chưa đóng
                      <Badge variant="destructive" className="ml-2">
                        {khoanThuDetail.hoChuaDong.length}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {khoanThuDetail.hoChuaDong.length === 0 ? (
                      <p className="text-center py-4 text-muted-foreground">Tất cả các hộ đã đóng</p>
                    ) : (
                      <div className="rounded-md border bg-white dark:bg-gray-950">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>STT</TableHead>
                              <TableHead>Tên chủ hộ</TableHead>
                              <TableHead>Địa chỉ</TableHead>
                              <TableHead>Số nhân khẩu</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {khoanThuDetail.hoChuaDong.map((ho, index) => (
                              <TableRow key={ho.id}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell className="font-medium">{ho.tenChuHo}</TableCell>
                                <TableCell>{ho.diaChi}</TableCell>
                                <TableCell>{ho.soNhanKhau}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      {/* Form Dialog (Add/Edit) */}
      <Dialog open={formDialogOpen} onOpenChange={setFormDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editMode ? "Chỉnh sửa khoản thu" : "Thêm khoản thu mới"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="tenKhoanThu">Tên khoản thu *</Label>
              <Input
                id="tenKhoanThu"
                value={formData.tenKhoanThu}
                onChange={(e) => setFormData({ ...formData, tenKhoanThu: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="loaiKhoanThu">Loại khoản thu *</Label>
              <Select
                value={formData.loaiKhoanThu.toString()}
                onValueChange={(value) => setFormData({ ...formData, loaiKhoanThu: parseInt(value) })}
              >
                <SelectTrigger id="loaiKhoanThu">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Bắt buộc</SelectItem>
                  <SelectItem value="1">Tự nguyện</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="donGia">Đơn giá (VNĐ) *</Label>
              <Input
                id="donGia"
                type="number"
                value={formData.donGia}
                onChange={(e) => setFormData({ ...formData, donGia: parseFloat(e.target.value) })}
                required
                min="0"
              />
            </div>

            <div>
              <Label htmlFor="moTa">Mô tả</Label>
              <Input
                id="moTa"
                value={formData.moTa}
                onChange={(e) => setFormData({ ...formData, moTa: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="ngayBatDau">Ngày bắt đầu *</Label>
                <Input
                  id="ngayBatDau"
                  type="date"
                  value={formData.ngayBatDau}
                  onChange={(e) => setFormData({ ...formData, ngayBatDau: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="ngayKetThuc">Ngày kết thúc</Label>
                <Input
                  id="ngayKetThuc"
                  type="date"
                  value={formData.ngayKetThuc}
                  onChange={(e) => setFormData({ ...formData, ngayKetThuc: e.target.value })}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setFormDialogOpen(false)}>
                Hủy
              </Button>
              <Button type="submit">
                {editMode ? "Cập nhật" : "Thêm mới"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
