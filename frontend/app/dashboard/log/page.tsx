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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Calendar, Eye } from "lucide-react";
import { api } from "@/lib/api-client";

interface AuditLog {
  id: number;
  actor: string;
  action: string;
  entityName: string;
  entityId: number;
  oldData: string | null;
  newData: string | null;
  createdAt: string;
}

export default function LogPage() {
  const { user } = useAuth();
  const [logList, setLogList] = useState<AuditLog[]>([]);
  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDateFilter, setEndDateFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [viewingDetail, setViewingDetail] = useState<AuditLog | null>(null);

  useEffect(() => {
    if (user) {
      loadLogs();
    }
  }, [user, currentPage, startDateFilter, endDateFilter]);

  const loadLogs = async () => {
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        size: "10",
        sortBy: "createdAt",
        sortDir: "desc",
      });

      if (startDateFilter) {
        params.append("startDate", new Date(startDateFilter).toISOString());
      }
      if (endDateFilter) {
        params.append("endDate", new Date(endDateFilter).toISOString());
      }

      const response = await api.get(`/api/audit-logs/paged?${params.toString()}`);

      if (response.ok) {
        const data = await response.json();
        setLogList(data.content || []);
        setTotalPages(data.totalPages || 0);
      } else {
        toast.error("Không thể tải dữ liệu log");
      }
    } catch (error) {
      console.error("Error loading logs:", error);
      toast.error("Không thể tải dữ liệu log");
    }
  };

  const filteredLogs = logList;

  const handleView = (log: AuditLog) => {
    setViewingDetail(log);
    setShowDetailDialog(true);
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const getActionBadgeColor = (action: string) => {
    switch (action) {
      case "CREATE":
        return "bg-green-500";
      case "UPDATE":
        return "bg-blue-500";
      case "DELETE":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getActionText = (action: string) => {
    switch (action) {
      case "CREATE":
        return "Tạo mới";
      case "UPDATE":
        return "Cập nhật";
      case "DELETE":
        return "Xóa";
      default:
        return action;
    }
  };

  const getEntityNameText = (entityName: string) => {
    switch (entityName) {
      case "ho_khau":
        return "Hộ khẩu";
      case "nhan_khau":
        return "Nhân khẩu";
      case "khoan_thu":
        return "Khoản thu";
      case "nop_tien":
        return "Nộp tiền";
      default:
        return entityName;
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Nhật ký hoạt động</h1>
          <p className="text-muted-foreground">
            Theo dõi các thay đổi trong hệ thống
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Bộ lọc</CardTitle>
          <CardDescription>Lọc danh sách nhật ký</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Từ ngày</Label>
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
              <Label>Đến ngày</Label>
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
                <TableHead>Thời gian</TableHead>
                <TableHead>Người thực hiện</TableHead>
                <TableHead>Hành động</TableHead>
                <TableHead>Đối tượng</TableHead>
                <TableHead>ID</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    Không có dữ liệu
                  </TableCell>
                </TableRow>
              ) : (
                filteredLogs.map((log, index) => (
                  <TableRow key={log.id}>
                    <TableCell>{currentPage * 10 + index + 1}</TableCell>
                    <TableCell className="font-mono text-sm">
                      {formatDateTime(log.createdAt)}
                    </TableCell>
                    <TableCell className="font-medium">{log.actor}</TableCell>
                    <TableCell>
                      <Badge className={getActionBadgeColor(log.action)}>
                        {getActionText(log.action)}
                      </Badge>
                    </TableCell>
                    <TableCell>{getEntityNameText(log.entityName)}</TableCell>
                    <TableCell className="font-mono">{log.entityId}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleView(log)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
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

      {/* Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chi tiết nhật ký</DialogTitle>
            <DialogDescription>
              Thông tin chi tiết về thay đổi trong hệ thống
            </DialogDescription>
          </DialogHeader>

          {viewingDetail && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Thông tin chung</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Người thực hiện
                      </p>
                      <p className="text-base font-semibold">
                        {viewingDetail.actor}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Hành động
                      </p>
                      <Badge className={getActionBadgeColor(viewingDetail.action)}>
                        {getActionText(viewingDetail.action)}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Đối tượng
                      </p>
                      <p className="text-base font-semibold">
                        {getEntityNameText(viewingDetail.entityName)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        ID đối tượng
                      </p>
                      <p className="text-base font-mono">{viewingDetail.entityId}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm font-medium text-muted-foreground">
                        Thời gian
                      </p>
                      <p className="text-base font-mono">
                        {formatDateTime(viewingDetail.createdAt)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {viewingDetail.oldData && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Dữ liệu cũ</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="text-xs bg-muted p-4 rounded overflow-x-auto">
                      {JSON.stringify(JSON.parse(viewingDetail.oldData), null, 2)}
                    </pre>
                  </CardContent>
                </Card>
              )}

              {viewingDetail.newData && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Dữ liệu mới</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="text-xs bg-muted p-4 rounded overflow-x-auto">
                      {JSON.stringify(JSON.parse(viewingDetail.newData), null, 2)}
                    </pre>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
