"use client";

import * as React from "react";
import { useRouter, useParams } from "next/navigation";
import { hoKhauApi } from "@/lib/api/hokhau";
import { nhanKhauApi } from "@/lib/api/nhankhau";
import { HoKhauDetail, HoKhau } from "@/lib/types/household";
import { NhanKhau, CreateNhanKhauRequest, UpdateNhanKhauRequest } from "@/lib/types/resident";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Users, Home, Calendar } from "lucide-react";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function HouseholdDetailPage() {
  const router = useRouter();
  const params = useParams();
  const householdId = Number(params.id);

  const [household, setHousehold] = React.useState<HoKhau | null>(null);
  const [members, setMembers] = React.useState<NhanKhau[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [householdData, membersData] = await Promise.all([
          hoKhauApi.getById(householdId),
          hoKhauApi.getThanhVien(householdId),
        ]);
        setHousehold(householdData);
        setMembers(membersData);
      } catch (error) {
        console.error("Failed to fetch household details:", error);
        toast.error("Không thể tải thông tin hộ khẩu");
      } finally {
        setIsLoading(false);
      }
    };

    if (householdId) {
      fetchData();
    }
  }, [householdId]);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 py-6 px-12">
        <Skeleton className="h-8 w-full mb-4" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!household) {
    return (
      <div className="flex flex-col gap-6 py-6 px-12">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lại
          </Button>
        </div>
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-destructive">
          <h2 className="text-lg font-semibold mb-2">Không tìm thấy hộ khẩu</h2>
          <p>Hộ khẩu với ID {householdId} không tồn tại.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 py-6 px-12">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/households")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại danh sách
        </Button>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">Thông tin Hộ Khẩu</CardTitle>
                <CardDescription>Chi tiết thông tin hộ khẩu</CardDescription>
              </div>
              <Badge variant={household.trangThai === 1 ? "default" : "secondary"} className="text-sm">
                {household.trangThai === 1 ? "Đang ở" : "Đã chuyển đi"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Home className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Chủ hộ</p>
                  <p className="text-base font-semibold">{household.tenChuHo}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Home className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Địa chỉ</p>
                  <p className="text-base">{household.diaChi}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Ngày tạo</p>
                  <p className="text-base">
                    {new Date(household.ngayTao).toLocaleDateString("vi-VN")}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Số thành viên</p>
                  <p className="text-base font-semibold">{members.length} người</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Danh sách thành viên</CardTitle>
            <CardDescription>
              Các thành viên trong hộ khẩu này
            </CardDescription>
          </CardHeader>
          <CardContent>
            {members.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Chưa có thành viên nào trong hộ khẩu này
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Họ tên</TableHead>
                      <TableHead>Ngày sinh</TableHead>
                      <TableHead>Giới tính</TableHead>
                      <TableHead>CMND/CCCD</TableHead>
                      <TableHead>Quan hệ với chủ hộ</TableHead>
                      <TableHead>Nghề nghiệp</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {members.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell className="font-medium">{member.hoTen}</TableCell>
                        <TableCell>
                          {new Date(member.ngaySinh).toLocaleDateString("vi-VN")}
                        </TableCell>
                        <TableCell>{member.gioiTinh}</TableCell>
                        <TableCell>{member.cmndCccd || "-"}</TableCell>
                        <TableCell>{member.quanHeVoiChuHo || "-"}</TableCell>
                        <TableCell>{member.ngheNghiep || "-"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}