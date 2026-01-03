"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, Edit, Trash2, Eye, Search, Calendar, MoreHorizontal } from "lucide-react";
import { api } from "@/lib/api-client";

interface NopTien {
  id: number;
  khoanThuId: number;
  tenKhoanThu: string;
  hoKhauId: number;
  tenChuHo: string;
  soTien: number;
  ngayNop: string;
  nguoiNop: string;
  ghiChu: string;
}

interface HoKhau {
  id: number;
  tenChuHo: string;
  diaChi: string;
}

interface KhoanThu {
  id: number;
  tenKhoanThu: string;
  loaiKhoanThu: number;
  donGia: number;
}

export default function NopTienPage() {
  const { user, isAdmin: isAdminUser, isStaff } = useAuth();
  const [nopTienList, setNopTienList] = useState<NopTien[]>([]);
  const [hoKhauList, setHoKhauList] = useState<HoKhau[]>([]);
  const [khoanThuList, setKhoanThuList] = useState<KhoanThu[]>([]);

  const [searchKeyword, setSearchKeyword] = useState("");
  const [hoKhauFilter, setHoKhauFilter] = useState<string>("all");
  const [khoanThuFilter, setKhoanThuFilter] = useState<string>("all");
  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDateFilter, setEndDateFilter] = useState("");

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [showFormDialog, setShowFormDialog] = useState(false);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [viewingDetail, setViewingDetail] = useState<NopTien | null>(null);

  const [formData, setFormData] = useState({
    khoanThuId: "",
    hoKhauId: "",
    soTien: "",
    nguoiNop: "",
    ghiChu: "",
  });

  useEffect(() => {
    if (user) {
      loadNopTien();
      loadHoKhau();
      loadKhoanThu();
    }
  }, [user, currentPage, hoKhauFilter, khoanThuFilter, startDateFilter, endDateFilter]);

  const loadNopTien = async () => {
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        size: "10",
        sortBy: "ngayNop",
        sortDir: "desc",
      });

      if (hoKhauFilter !== "all") {
        params.append("hoKhauId", hoKhauFilter);
      }
      if (khoanThuFilter !== "all") {
        params.append("khoanThuId", khoanThuFilter);
      }
      if (startDateFilter) {
        params.append("startDate", new Date(startDateFilter).toISOString());
      }
      if (endDateFilter) {
        params.append("endDate", new Date(endDateFilter).toISOString());
      }

      const response = await api.get(`/api/noptien/paged?${params.toString()}`);

      if (response.ok) {
        const data = await response.json();
        setNopTienList(data.content || []);
        setTotalPages(data.totalPages || 0);
      } else {
        toast.error("Không thể tải dữ liệu nộp tiền");
      }
    } catch (error) {
      console.error("Error loading nop tien:", error);
      toast.error("Không thể tải dữ liệu nộp tiền");
    }
  };

  const loadHoKhau = async () => {
    try {
      const response = await api.get("/api/hokhau");

      if (response.ok) {
        const data = await response.json();
        setHoKhauList(data || []);
      }
    } catch (error) {
      console.error("Error loading ho khau:", error);
    }
  };

  const loadKhoanThu = async () => {
    try {
      const response = await api.get("/api/khoanthu");

      if (response.ok) {
        const data = await response.json();
        setKhoanThuList(data || []);
      }
    } catch (error) {
      console.error("Error loading khoan thu:", error);
    }
  };

  const filteredNopTien = nopTienList.filter((nt) => {
    if (searchKeyword === "") return true;
    const keyword = searchKeyword.toLowerCase();
    return (
      nt.tenKhoanThu.toLowerCase().includes(keyword) ||
      nt.tenChuHo.toLowerCase().includes(keyword) ||
      nt.nguoiNop.toLowerCase().includes(keyword) ||
      (nt.ghiChu && nt.ghiChu.toLowerCase().includes(keyword))
    );
  });

  const handleAdd = () => {
    if (!isStaff()) {
      toast.error("Chỉ nhân viên mới có quyền thêm nộp tiền");
      return;
    }
    setEditingId(null);
    setFormData({
      khoanThuId: "",
      hoKhauId: "",
      soTien: "",
      nguoiNop: "",
      ghiChu: "",
    });
    setShowFormDialog(true);
  };

  const handleEdit = (nopTien: NopTien) => {
    if (!isStaff()) {
      toast.error("Chỉ nhân viên mới có quyền sửa nộp tiền");
      return;
    }
    setEditingId(nopTien.id);
    setFormData({
      khoanThuId: nopTien.khoanThuId.toString(),
      hoKhauId: nopTien.hoKhauId.toString(),
      soTien: nopTien.soTien.toString(),
      nguoiNop: nopTien.nguoiNop,
      ghiChu: nopTien.ghiChu || "",
    });
    setShowFormDialog(true);
  };

  const handleDelete = async (id: number) => {
    if (!isStaff()) {
      toast.error("Chỉ nhân viên mới có quyền xóa nộp tiền");
      return;
    }
    if (!confirm("Bạn có chắc muốn xóa bản ghi nộp tiền này?")) return;

    try {
      await api.delete(`/api/noptien/${id}`);
      toast.success("Xóa nộp tiền thành công");
      loadNopTien();
    } catch (error) {
      console.error("Error deleting nop tien:", error);
      toast.error("Không thể xóa nộp tiền");
    }
  };

  const handleView = (nopTien: NopTien) => {
    setViewingDetail(nopTien);
    setShowDetailDialog(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isStaff()) {
      toast.error("Chỉ nhân viên mới có quyền thực hiện thao tác này");
      return;
    }

    if (
      !formData.khoanThuId ||
      !formData.hoKhauId ||
      !formData.soTien ||
      !formData.nguoiNop
    ) {
      toast.error("Vui lòng điền đầy đủ các trường bắt buộc");
      return;
    }

    const soTien = parseFloat(formData.soTien);
    if (isNaN(soTien) || soTien <= 0) {
      toast.error("Số tiền phải là số dương hợp lệ");
      return;
    }

    try {
      const payload = {
        khoanThuId: parseInt(formData.khoanThuId),
        hoKhauId: parseInt(formData.hoKhauId),
        soTien: soTien,
        nguoiNop: formData.nguoiNop,
        ghiChu: formData.ghiChu,
      };

      if (editingId) {
        await api.put(`/api/noptien/${editingId}`, payload);
        toast.success("Cập nhật nộp tiền thành công");
      } else {
        await api.post("/api/noptien", payload);
        toast.success("Thêm nộp tiền thành công");
      }

      setShowFormDialog(false);
      loadNopTien();
    } catch (error) {
      console.error("Error saving nop tien:", error);
      toast.error("Không thể lưu nộp tiền");
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">QUẢN LÝ NỘP TIỀN</h1>
          <p className="text-muted-foreground">
            Quản lý các giao dịch nộp tiền của hộ khẩu
          </p>
        </div>
        {isStaff() && (
          <Button onClick={handleAdd}>
            <Plus className="mr-2 h-4 w-4" />
            Thêm nộp tiền
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Bộ lọc</CardTitle>
          <CardDescription>Lọc danh sách nộp tiền</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Tìm kiếm</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm theo tên, người nộp..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Hộ khẩu</Label>
              <Select value={hoKhauFilter} onValueChange={setHoKhauFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn hộ khẩu" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả hộ khẩu</SelectItem>
                  {hoKhauList.map((hk) => (
                    <SelectItem key={hk.id} value={hk.id.toString()}>
                      {hk.tenChuHo} - {hk.diaChi}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Khoản thu</Label>
              <Select value={khoanThuFilter} onValueChange={setKhoanThuFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn khoản thu" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả khoản thu</SelectItem>
                  {khoanThuList.map((kt) => (
                    <SelectItem key={kt.id} value={kt.id.toString()}>
                      {kt.tenKhoanThu} ({kt.loaiKhoanThu === 1 ? "Bắt buộc" : "Tự nguyện"})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Ngày bắt đầu</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="date"
                  value={startDateFilter}
                  onChange={(e) => setStartDateFilter(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Ngày kết thúc</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="date"
                  value={endDateFilter}
                  onChange={(e) => {
                    const newEndDate = e.target.value;
                    if (startDateFilter && newEndDate && newEndDate < startDateFilter) {
                      toast.error("Ngày kết thúc phải sau ngày bắt đầu");
                      return;
                    }
                    setEndDateFilter(newEndDate);
                  }}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">STT</TableHead>
                <TableHead>Khoản thu</TableHead>
                <TableHead>Hộ khẩu</TableHead>
                <TableHead>Số tiền</TableHead>
                <TableHead>Người nộp</TableHead>
                <TableHead>Ngày nộp</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredNopTien.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    Không có dữ liệu
                  </TableCell>
                </TableRow>
              ) : (
                filteredNopTien.map((nt, index) => (
                  <TableRow key={nt.id}>
                    <TableCell>{currentPage * 10 + index + 1}</TableCell>
                    <TableCell className="font-medium">{nt.tenKhoanThu}</TableCell>
                    <TableCell>{nt.tenChuHo}</TableCell>
                    <TableCell className="font-semibold text-green-600">
                      {formatCurrency(nt.soTien)}
                    </TableCell>
                    <TableCell>{nt.nguoiNop}</TableCell>
                    <TableCell>{formatDateTime(nt.ngayNop)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Mở menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleView(nt)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Xem chi tiết
                          </DropdownMenuItem>
                          {isStaff() && (
                            <>
                              <DropdownMenuItem onClick={() => handleEdit(nt)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Chỉnh sửa
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDelete(nt.id)}
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
        </CardContent>
      </Card>

      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          Trang {currentPage + 1} / {totalPages}
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 0}
            onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
          >
            Trang trước
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage >= totalPages - 1}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Trang sau
          </Button>
        </div>
      </div>

      {/* Form Dialog */}
      <Dialog open={showFormDialog} onOpenChange={setShowFormDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Cập nhật nộp tiền" : "Thêm nộp tiền"}
            </DialogTitle>
            <DialogDescription>
              {editingId
                ? "Chỉnh sửa thông tin giao dịch nộp tiền"
                : "Thêm mới giao dịch nộp tiền"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="khoanThuId">
                  Khoản thu <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.khoanThuId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, khoanThuId: value })
                  }
                >
                  <SelectTrigger id="khoanThuId">
                    <SelectValue placeholder="Chọn khoản thu" />
                  </SelectTrigger>
                  <SelectContent>
                    {khoanThuList.map((kt) => (
                      <SelectItem key={kt.id} value={kt.id.toString()}>
                        {kt.tenKhoanThu} - {formatCurrency(kt.donGia)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="hoKhauId">
                  Hộ khẩu <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.hoKhauId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, hoKhauId: value })
                  }
                >
                  <SelectTrigger id="hoKhauId">
                    <SelectValue placeholder="Chọn hộ khẩu" />
                  </SelectTrigger>
                  <SelectContent>
                    {hoKhauList.map((hk) => (
                      <SelectItem key={hk.id} value={hk.id.toString()}>
                        {hk.tenChuHo} - {hk.diaChi}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="soTien">
                  Số tiền <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="soTien"
                  type="number"
                  step="0.01"
                  placeholder="Nhập số tiền"
                  value={formData.soTien}
                  onChange={(e) =>
                    setFormData({ ...formData, soTien: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nguoiNop">
                  Người nộp <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="nguoiNop"
                  placeholder="Nhập tên người nộp"
                  value={formData.nguoiNop}
                  onChange={(e) =>
                    setFormData({ ...formData, nguoiNop: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="ghiChu">Ghi chú</Label>
                <Input
                  id="ghiChu"
                  placeholder="Nhập ghi chú (không bắt buộc)"
                  value={formData.ghiChu}
                  onChange={(e) =>
                    setFormData({ ...formData, ghiChu: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowFormDialog(false)}
              >
                Hủy
              </Button>
              <Button type="submit">
                {editingId ? "Cập nhật" : "Thêm mới"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chi tiết nộp tiền</DialogTitle>
            <DialogDescription>
              Thông tin chi tiết giao dịch nộp tiền
            </DialogDescription>
          </DialogHeader>

          {viewingDetail && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Thông tin giao dịch</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Khoản thu
                      </p>
                      <p className="text-base font-semibold">
                        {viewingDetail.tenKhoanThu}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Hộ khẩu
                      </p>
                      <p className="text-base font-semibold">
                        {viewingDetail.tenChuHo}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Số tiền
                      </p>
                      <p className="text-xl font-bold text-green-600">
                        {formatCurrency(viewingDetail.soTien)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Người nộp
                      </p>
                      <p className="text-base font-semibold">
                        {viewingDetail.nguoiNop}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Ngày nộp
                      </p>
                      <p className="text-base font-semibold">
                        {formatDateTime(viewingDetail.ngayNop)}
                      </p>
                    </div>
                    {viewingDetail.ghiChu && (
                      <div className="col-span-2">
                        <p className="text-sm font-medium text-muted-foreground">
                          Ghi chú
                        </p>
                        <p className="text-base">{viewingDetail.ghiChu}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
