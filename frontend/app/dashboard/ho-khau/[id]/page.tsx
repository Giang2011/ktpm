"use client"

import { useEffect, useState } from "react"
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
    DollarSign
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

export default function HoKhauDetailPage({ params }: { params: { id: string } }) {
    const router = useRouter()
    const { user } = useAuth()
    const [detailHoKhau, setDetailHoKhau] = useState<HoKhauDetail | null>(null)
    const [loading, setLoading] = useState(true)

    const fetchHoKhauDetail = async () => {
        try {
            setLoading(true)
            const response = await api.get(`/api/hokhau/${params.id}/chi-tiet`)
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
    }, [user, params.id])

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount)
    }

    const formatDate = (dateString: string) => {
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
                        Thông tin chi tiết của hộ gia đình
                    </p>
                </div>
            </div>

            {/* Thông tin hộ khẩu */}
            <Card className="border-2">
                <CardHeader className="bg-muted/30">
                    <CardTitle className="text-xl flex items-center gap-2">
                        <Home className="h-6 w-6 text-primary" />
                        Thông tin hộ khẩu
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
                            <Label className="text-xs text-muted-foreground uppercase">Ngày tạo</Label>
                            <p className="text-lg font-semibold">{formatDate(detailHoKhau.hoKhau.ngayTao)}</p>
                        </div>
                        <div className="space-y-1 md:col-span-2">
                            <Label className="text-xs text-muted-foreground uppercase">Địa chỉ</Label>
                            <p className="text-lg font-semibold">{detailHoKhau.hoKhau.diaChi}</p>
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground uppercase">Trạng thái</Label>
                            <p>
                                <Badge
                                    variant={detailHoKhau.hoKhau.trangThai === 1 ? "default" : "destructive"}
                                    className="text-base px-3 py-1"
                                >
                                    {detailHoKhau.hoKhau.trangThai === 1 ? "Hoạt động" : "Không hoạt động"}
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
                        Danh sách thành viên
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
                                        <TableHead>CMND/CCCD</TableHead>
                                        <TableHead>Quan hệ</TableHead>
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
                                            <TableCell>{tv.cmndCccd}</TableCell>
                                            <TableCell>{tv.quanHeVoiChuHo}</TableCell>
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

            {/* Khoản đã đóng */}
            <Card className="border-2 border-green-200 dark:border-green-900">
                <CardHeader className="bg-green-50 dark:bg-green-950/20">
                    <CardTitle className="text-xl flex items-center gap-2 text-green-700 dark:text-green-400">
                        <DollarSign className="h-6 w-6" />
                        Các khoản đã đóng
                        <Badge variant="outline" className="ml-2 text-base border-green-600 text-green-700 dark:text-green-400">
                            {detailHoKhau.khoanDaDong.length} khoản
                        </Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    {detailHoKhau.khoanDaDong.length > 0 ? (
                        <div className="border rounded-lg">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Tên khoản thu</TableHead>
                                        <TableHead>Số tiền</TableHead>
                                        <TableHead>Ngày nộp</TableHead>
                                        <TableHead>Người nộp</TableHead>
                                        <TableHead>Ghi chú</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {detailHoKhau.khoanDaDong.map((kd) => (
                                        <TableRow key={kd.id}>
                                            <TableCell className="font-medium">{kd.tenKhoanThu}</TableCell>
                                            <TableCell className="text-green-600 font-semibold">
                                                {formatCurrency(kd.soTien)}
                                            </TableCell>
                                            <TableCell>{formatDate(kd.ngayNop)}</TableCell>
                                            <TableCell>{kd.nguoiNop}</TableCell>
                                            <TableCell className="text-muted-foreground text-sm">
                                                {kd.ghiChu || "-"}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    ) : (
                        <div className="text-center py-8 text-muted-foreground">
                            Chưa có khoản nào được đóng
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Khoản chưa đóng */}
            <Card className="border-2 border-red-200 dark:border-red-900">
                <CardHeader className="bg-red-50 dark:bg-red-950/20">
                    <CardTitle className="text-xl flex items-center gap-2 text-red-700 dark:text-red-400">
                        <DollarSign className="h-6 w-6" />
                        Các khoản chưa đóng
                        <Badge variant="outline" className="ml-2 text-base border-red-600 text-red-700 dark:text-red-400">
                            {detailHoKhau.khoanChuaDong.length} khoản
                        </Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    {detailHoKhau.khoanChuaDong.length > 0 ? (
                        <div className="border rounded-lg">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Tên khoản thu</TableHead>
                                        <TableHead>Loại</TableHead>
                                        <TableHead>Đơn giá</TableHead>
                                        <TableHead>Ngày bắt đầu</TableHead>
                                        <TableHead>Ngày kết thúc</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {detailHoKhau.khoanChuaDong.map((kc) => (
                                        <TableRow key={kc.id}>
                                            <TableCell className="font-medium">{kc.tenKhoanThu}</TableCell>
                                            <TableCell>
                                                <Badge variant={kc.loaiKhoanThu === 0 ? "destructive" : "secondary"}>
                                                    {kc.loaiKhoanThu === 0 ? "Bắt buộc" : "Tự nguyện"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-red-600 font-semibold">
                                                {formatCurrency(kc.donGia)}
                                            </TableCell>
                                            <TableCell>{formatDate(kc.ngayBatDau)}</TableCell>
                                            <TableCell>{formatDate(kc.ngayKetThuc)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    ) : (
                        <div className="text-center py-8 text-muted-foreground">
                            Không có khoản nào chưa đóng
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
