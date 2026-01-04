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
  FileText,
  MoreHorizontal,
  Calendar
} from "lucide-react"
import { toast } from "sonner"
import { TamTruTamVangForm } from "@/components/tam-tru-tam-vang-form"
import type { TamTruTamVang } from "@/app/actions/tam-tru-tam-vang-actions"

interface PageData {
  content: TamTruTamVang[]
  totalPages: number
  totalElements: number
  number: number
  size: number
}

export default function TamTruTamVangPage() {
  const { user, isAdmin, isStaff } = useAuth()
  const [pageData, setPageData] = useState<PageData | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(0)
  const [selectedItem, setSelectedItem] = useState<TamTruTamVang | null>(null)
  const [searchKeyword, setSearchKeyword] = useState("")
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)

  const fetchTamTruTamVang = async (page: number = 0) => {
    try {
      setLoading(true)
      const response = await api.get(`/api/tamtrutamvang/paged?page=${page}&size=10&sortBy=id&sortDir=desc`)
      if (response.ok) {
        const data = await response.json()
        setPageData(data)
        setCurrentPage(page)
      } else {
        toast.error("Không thể tải danh sách tạm trú tạm vắng")
      }
    } catch (error) {
      console.error("Error fetching tam tru tam vang:", error)
      toast.error("Lỗi khi tải dữ liệu")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTamTruTamVang(0)
  }, [])

  const handleDelete = async (id: number) => {
    if (!isAdmin()) {
      toast.error("Chỉ ADMIN mới có quyền xóa")
      return
    }

    if (!confirm("Bạn có chắc chắn muốn xóa tạm trú tạm vắng này?")) {
      return
    }

    try {
      const response = await api.delete(`/api/tamtrutamvang/${id}`)
      if (response.ok) {
        toast.success("Xóa tạm trú tạm vắng thành công")
        fetchTamTruTamVang(currentPage)
      } else {
        toast.error("Không thể xóa tạm trú tạm vắng")
      }
    } catch (error) {
      console.error("Error deleting tam tru tam vang:", error)
      toast.error("Lỗi khi xóa tạm trú tạm vắng")
    }
  }

  const handleNextPage = () => {
    if (pageData && currentPage < pageData.totalPages - 1) {
      fetchTamTruTamVang(currentPage + 1)
    }
  }

  const handlePrevPage = () => {
    if (currentPage > 0) {
      fetchTamTruTamVang(currentPage - 1)
    }
  }

  const handleSearch = async () => {
    if (!searchKeyword.trim()) {
      fetchTamTruTamVang(0)
      return
    }

    try {
      setLoading(true)
      const response = await api.get(`/api/tamtrutamvang/search?keyword=${encodeURIComponent(searchKeyword)}`)
      if (response.ok) {
        const data = await response.json()
        setPageData({
          content: data,
          totalPages: 1,
          totalElements: data.length,
          number: 0,
          size: data.length
        })
      } else {
        toast.error("Không thể tìm kiếm")
      }
    } catch (error) {
      console.error("Error searching:", error)
      toast.error("Lỗi khi tìm kiếm")
    } finally {
      setLoading(false)
    }
  }

  const handleViewDetails = (item: TamTruTamVang) => {
    setSelectedItem(item)
    setIsDetailDialogOpen(true)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN")
  }

  const isActive = (item: TamTruTamVang) => {
    const now = new Date()
    const start = new Date(item.ngayBatDau)
    const end = new Date(item.ngayKetThuc)
    return now >= start && now <= end
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">QUẢN LÝ TẠM TRÚ TẠM VẮNG</h1>
          <p className="text-muted-foreground mt-1">
            Quản lý thông tin tạm trú tạm vắng của cư dân
          </p>
        </div>
        {isAdmin() && (
          <TamTruTamVangForm onSuccess={() => fetchTamTruTamVang(currentPage)} />
        )}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Danh Sách Tạm Trú Tạm Vắng</CardTitle>
              <CardDescription>
                {pageData && `Tổng số: ${pageData.totalElements} bản ghi`}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Tìm kiếm theo tên hoặc SĐT..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSearch()
                    }
                  }}
                  className="w-64"
                />
                <Button onClick={handleSearch} variant="outline" size="icon">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="w-[60px] text-center">STT</TableHead>
                      <TableHead>Họ Tên</TableHead>
                      <TableHead>CMND/CCCD</TableHead>
                      <TableHead>Loại</TableHead>
                      <TableHead>Số Điện Thoại</TableHead>
                      <TableHead>Ngày Bắt Đầu</TableHead>
                      <TableHead>Ngày Kết Thúc</TableHead>
                      <TableHead>Trạng Thái</TableHead>
                      <TableHead className="text-right">Thao Tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pageData && pageData.content.length > 0 ? (
                      pageData.content.map((item, index) => (
                        <TableRow key={item.id} className="hover:bg-muted/50">
                          <TableCell className="text-center font-medium">
                            {currentPage * 10 + index + 1}
                          </TableCell>
                          <TableCell className="font-medium">{item.hoTenNhanKhau}</TableCell>
                          <TableCell>{item.cmndCccdNhanKhau}</TableCell>
                          <TableCell>
                            <Badge variant={item.loaiTamTru === 0 ? "default" : "secondary"}>
                              {item.loaiTamTru === 0 ? "Tạm Trú" : "Tạm Vắng"}
                            </Badge>
                          </TableCell>
                          <TableCell>{item.soDienThoai}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3 text-muted-foreground" />
                              {formatDate(item.ngayBatDau)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3 text-muted-foreground" />
                              {formatDate(item.ngayKetThuc)}
                            </div>
                          </TableCell>
                          <TableCell>
                            {isActive(item) ? (
                              <Badge variant="default">Đang hiệu lực</Badge>
                            ) : new Date(item.ngayKetThuc) < new Date() ? (
                              <Badge variant="secondary">Đã hết hạn</Badge>
                            ) : (
                              <Badge variant="outline">Chưa bắt đầu</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleViewDetails(item)}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  Xem chi tiết
                                </DropdownMenuItem>
                                {isAdmin() && (
                                  <>
                                    <DropdownMenuItem asChild>
                                      <TamTruTamVangForm
                                        tamTruTamVang={item}
                                        trigger={
                                          <button className="w-full flex items-center px-2 py-1.5 text-sm">
                                            <Edit className="mr-2 h-4 w-4" />
                                            Chỉnh sửa
                                          </button>
                                        }
                                        onSuccess={() => fetchTamTruTamVang(currentPage)}
                                      />
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => handleDelete(item.id)}
                                      className="text-destructive focus:text-destructive"
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
                    ) : (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                          Không có dữ liệu
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {pageData && pageData.totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-muted-foreground">
                    Trang {currentPage + 1} / {pageData.totalPages}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePrevPage}
                      disabled={currentPage === 0}
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Trước
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleNextPage}
                      disabled={currentPage >= pageData.totalPages - 1}
                    >
                      Sau
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chi Tiết Tạm Trú Tạm Vắng</DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Họ tên</p>
                  <p className="font-medium">{selectedItem.hoTenNhanKhau}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">CMND/CCCD</p>
                  <p className="font-medium">{selectedItem.cmndCccdNhanKhau}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Loại</p>
                  <Badge variant={selectedItem.loaiTamTru === 0 ? "default" : "secondary"}>
                    {selectedItem.loaiTamTru === 0 ? "Tạm Trú" : "Tạm Vắng"}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Số điện thoại</p>
                  <p className="font-medium">{selectedItem.soDienThoai}</p>
                </div>
                {selectedItem.loaiTamTru === 0 && selectedItem.diaChi && (
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground">Địa chỉ tạm trú</p>
                    <p className="font-medium">{selectedItem.diaChi}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-muted-foreground">Trạng thái</p>
                  {isActive(selectedItem) ? (
                    <Badge variant="default">Đang hiệu lực</Badge>
                  ) : new Date(selectedItem.ngayKetThuc) < new Date() ? (
                    <Badge variant="secondary">Đã hết hạn</Badge>
                  ) : (
                    <Badge variant="outline">Chưa bắt đầu</Badge>
                  )}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Ngày bắt đầu</p>
                  <p className="font-medium">{formatDate(selectedItem.ngayBatDau)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Ngày kết thúc</p>
                  <p className="font-medium">{formatDate(selectedItem.ngayKetThuc)}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Lý do</p>
                <p className="font-medium bg-muted p-3 rounded-md">{selectedItem.lyDo}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
