"use client"

import { use, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { api } from "@/lib/api-client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import {
    ArrowLeft,
    Home,
    Users as UsersIcon,
    DollarSign,
    Eye,
    CreditCard,
    Briefcase,
    Calendar,
    User
} from "lucide-react"
import { toast } from "sonner"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

// Interface định nghĩa dữ liệu nhân khẩu
interface NhanKhau {
    id: number
    hoKhauId: number
    tenChuHo: string
    hoTen: string
    ngaySinh: string
    gioiTinh: string
    cmndCccd: string
    quanHeVoiChuHo: string
    ngheNghiep: string
    nguyenQuan?: string
    danToc?: string
    tonGiao?: string
}

interface HoKhau {
    id: number
    tenChuHo: string
    diaChi: string
    ngayTao: string
    trangThai: number
    soNhanKhau: number
}

interface NopTien {
    id: number
    khoanThuId: number
    tenKhoanThu: string
    hoKhauId: number
    tenChuHo: string
    soTien: number
    ngayNop: string
    nguoiNop: string
    ghiChu: string
}

interface KhoanThu {
    id: number
    tenKhoanThu: string
    loaiKhoanThu: number
    donGia: number
    moTa: string
    ngayBatDau: string
    ngayKetThuc: string
    tongThuDuoc: number
    soHoDaDong: number
}

interface HoKhauDetail {
    hoKhau: HoKhau
    thanhVien: NhanKhau[]
    khoanDaDong: NopTien[]
    khoanChuaDong: KhoanThu[]
}

export default function HoKhauDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    
    const router = useRouter()
    const { user } = useAuth()
    const [detailHoKhau, setDetailHoKhau] = useState<HoKhauDetail | null>(null)
    const [loading, setLoading] = useState(true)
    
    // State để quản lý nhân khẩu đang được chọn xem chi tiết
    const [selectedMember, setSelectedMember] = useState<NhanKhau | null>(null)

    const fetchHoKhauDetail = async () => {
        try {
            setLoading(true)
            const response = await api.get(`/api/hokhau/${id}/chi-tiet`)
            if (response.ok) {
                const data = await response.json()
                setDetailHoKhau(data)
            } else {
                toast.error("Không thể tải chi tiết hộ khẩu")
                router.push("/dashboard/ho-khau")
            }
        } catch (error) {
            console.error("Error fetching ho khau detail:", error)
            toast.error("Lỗi khi tải chi tiết")
            router.push("/dashboard/ho-khau")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (user) {
            fetchHoKhauDetail()
        }
    }, [user, id])

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount)
    }

    const formatDate = (dateString: string) => {
        if (!dateString) return "N/A"
        return new Date(dateString).toLocaleDateString('vi-VN')
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-muted-foreground">Đang tải...</div>
            </div>
        )
    }

    if (!detailHoKhau) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-muted-foreground">Không tìm thấy dữ liệu</div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header with Back button */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard/ho-khau")}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                    <h1 className="text-3xl font-semibold">Chi tiết hộ khẩu</h1>
                    <p className="text-muted-foreground mt-1">
                        Mã hộ: <strong>{detailHoKhau.hoKhau.id}</strong>
                    </p>
                </div>
            </div>

            {/* Thông tin hộ khẩu */}
            <Card className="border-2">
                <CardHeader className="bg-muted/30">
                    <CardTitle className="text-xl flex items-center gap-2">
                        <Home className="h-6 w-6 text-primary" />
                        Thông tin hộ gia đình
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="grid gap-6 md:grid-cols-3">
                        <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground uppercase">Tên chủ hộ</Label>
                            <p className="text-lg font-semibold">{detailHoKhau.hoKhau.tenChuHo}</p>
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground uppercase">Số thành viên</Label>
                            <p className="text-lg font-semibold">
                                <Badge variant="secondary" className="text-base px-3 py-1">
                                    {detailHoKhau.hoKhau.soNhanKhau} người
                                </Badge>
                            </p>
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground uppercase">Ngày lập sổ</Label>
                            <p className="text-lg font-semibold">{formatDate(detailHoKhau.hoKhau.ngayTao)}</p>
                        </div>
                        <div className="space-y-1 md:col-span-2">
                            <Label className="text-xs text-muted-foreground uppercase">Địa chỉ thường trú</Label>
                            <p className="text-lg font-semibold">{detailHoKhau.hoKhau.diaChi}</p>
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground uppercase">Trạng thái</Label>
                            <p>
                                <Badge
                                    variant={detailHoKhau.hoKhau.trangThai === 1 ? "default" : "destructive"}
                                    className="text-base px-3 py-1"
                                >
                                    {detailHoKhau.hoKhau.trangThai === 1 ? "Thường trú" : "Đã chuyển đi"}
                                </Badge>
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Danh sách thành viên */}
            <Card className="border-2">
                <CardHeader className="bg-blue-50 dark:bg-blue-950/20">
                    <CardTitle className="text-xl flex items-center gap-2">
                        <UsersIcon className="h-6 w-6 text-blue-600" />
                        Danh sách nhân khẩu
                        <Badge variant="secondary" className="ml-2 text-base">
                            {detailHoKhau.thanhVien.length} người
                        </Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    {detailHoKhau.thanhVien.length > 0 ? (
                        <div className="border rounded-lg">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Họ và tên</TableHead>
                                        <TableHead>Ngày sinh</TableHead>
                                        <TableHead>Giới tính</TableHead>
                                        <TableHead>Quan hệ</TableHead>
                                        <TableHead>Số CCCD/CMND</TableHead>
                                        <TableHead className="text-right">Hành động</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {detailHoKhau.thanhVien.map((tv) => (
                                        <TableRow key={tv.id}>
                                            <TableCell className="font-medium">{tv.hoTen}</TableCell>
                                            <TableCell>{formatDate(tv.ngaySinh)}</TableCell>
                                            <TableCell>
                                                <Badge variant={tv.gioiTinh === "Nam" ? "default" : "secondary"}>
                                                    {tv.gioiTinh}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{tv.quanHeVoiChuHo}</TableCell>
                                            <TableCell className="font-mono text-sm">
                                                {tv.cmndCccd ? tv.cmndCccd : <span className="text-muted-foreground italic">Chưa có</span>}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button 
                                                    variant="ghost" 
                                                    size="sm" 
                                                    className="h-8 w-8 p-0"
                                                    onClick={() => setSelectedMember(tv)}
                                                >
                                                    <Eye className="h-4 w-4 text-blue-600" />
                                                    <span className="sr-only">Xem chi tiết</span>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    ) : (
                        <div className="text-center py-8 text-muted-foreground">
                            Chưa có thành viên nào
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Dialog hiển thị chi tiết nhân khẩu */}
            <Dialog open={!!selectedMember} onOpenChange={(open) => !open && setSelectedMember(null)}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-xl">
                            <User className="h-5 w-5" />
                            Thông tin chi tiết nhân khẩu
                        </DialogTitle>
                        <DialogDescription>
                            Thông tin cá nhân đầy đủ của công dân
                        </DialogDescription>
                    </DialogHeader>
                    
                    {selectedMember && (
                        <div className="grid gap-6 py-4">
                            {/* Header info */}
                            <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg border">
                                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
                                    {selectedMember.hoTen.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold">{selectedMember.hoTen}</h3>
                                    <p className="text-muted-foreground flex items-center gap-2 text-sm mt-1">
                                        <Badge variant="outline">{selectedMember.quanHeVoiChuHo}</Badge>
                                        {/* Đã xóa phần hiển thị ID ở đây */}
                                    </p>
                                </div>
                            </div>

                            {/* Detail Grid */}
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <Label className="text-xs text-muted-foreground flex items-center gap-1">
                                        <Calendar className="h-3 w-3" /> Ngày sinh
                                    </Label>
                                    <p className="font-medium">{formatDate(selectedMember.ngaySinh)}</p>
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs text-muted-foreground">Giới tính</Label>
                                    <p className="font-medium">{selectedMember.gioiTinh}</p>
                                </div>
                                <div className="space-y-1 col-span-2">
                                    <Label className="text-xs text-muted-foreground flex items-center gap-1">
                                        <CreditCard className="h-3 w-3" /> Số CCCD / CMND
                                    </Label>
                                    <p className="text-xl font-mono font-semibold tracking-wide text-primary">
                                        {selectedMember.cmndCccd || "Chưa cấp"}
                                    </p>
                                </div>
                                <div className="space-y-1 col-span-2">
                                    <Label className="text-xs text-muted-foreground flex items-center gap-1">
                                        <Briefcase className="h-3 w-3" /> Nghề nghiệp
                                    </Label>
                                    <p className="font-medium">
                                        {selectedMember.ngheNghiep || "Không có thông tin"}
                                    </p>
                                </div>
                                {selectedMember.nguyenQuan && (
                                    <div className="space-y-1 col-span-2">
                                        <Label className="text-xs text-muted-foreground">Nguyên quán</Label>
                                        <p className="font-medium">{selectedMember.nguyenQuan}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Khoản đã đóng & chưa đóng */}
            <div className="grid gap-6 md:grid-cols-2">
                <Card className="border-2 border-green-200 dark:border-green-900">
                    <CardHeader className="bg-green-50 dark:bg-green-950/20 py-4">
                        <CardTitle className="text-lg flex items-center gap-2 text-green-700 dark:text-green-400">
                            <DollarSign className="h-5 w-5" />
                            Đã đóng
                            <Badge variant="secondary" className="ml-auto">
                                {detailHoKhau.khoanDaDong.length} khoản
                            </Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4 p-0">
                        <div className="max-h-[300px] overflow-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Khoản thu</TableHead>
                                        <TableHead className="text-right">Số tiền</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {detailHoKhau.khoanDaDong.map((kd) => (
                                        <TableRow key={kd.id}>
                                            <TableCell className="font-medium text-sm">{kd.tenKhoanThu}</TableCell>
                                            <TableCell className="text-right text-green-600 font-semibold">
                                                {formatCurrency(kd.soTien)}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {detailHoKhau.khoanDaDong.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={2} className="text-center text-muted-foreground text-sm py-4">
                                                Chưa đóng khoản nào
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-2 border-red-200 dark:border-red-900">
                    <CardHeader className="bg-red-50 dark:bg-red-950/20 py-4">
                        <CardTitle className="text-lg flex items-center gap-2 text-red-700 dark:text-red-400">
                            <DollarSign className="h-5 w-5" />
                            Chưa đóng
                            <Badge variant="secondary" className="ml-auto">
                                {detailHoKhau.khoanChuaDong.length} khoản
                            </Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4 p-0">
                        <div className="max-h-[300px] overflow-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Khoản thu</TableHead>
                                        <TableHead className="text-right">Đơn giá</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {detailHoKhau.khoanChuaDong.map((kc) => (
                                        <TableRow key={kc.id}>
                                            <TableCell className="font-medium text-sm">
                                                {kc.tenKhoanThu}
                                                {kc.loaiKhoanThu === 0 && (
                                                    <span className="text-red-500 ml-1">*</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right text-red-600 font-semibold">
                                                {formatCurrency(kc.donGia)}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {detailHoKhau.khoanChuaDong.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={2} className="text-center text-muted-foreground text-sm py-4">
                                                Đã hoàn thành nghĩa vụ
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}