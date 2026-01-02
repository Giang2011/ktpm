"use client";

import { FeesTable } from "@/components/fees/FeesTable";
import { useFees } from "@/lib/hooks/use-fees";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CreateFeeRequest,
  UpdateFeeRequest,
  KhoanThu,
} from "@/lib/types/fee";
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

export default function FeesPage() {
  const [filter, setFilter] = React.useState<'all' | 'batbuoc' | 'tunguyen' | 'active'>('all');
  const isFirstMount = React.useRef(true);

  const { fees, createFee, updateFee, deleteFee } = useFees({
    filter: filter === 'all' ? undefined : filter,
  });

  React.useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
    }
  }, []);

  const handleCreate = async (data: CreateFeeRequest) => {
    try {
      await createFee.mutateAsync(data);
    } catch (error) {
      // Error is already handled by the hook with toast
    }
  };

  const handleUpdate = async (id: number, data: UpdateFeeRequest) => {
    try {
      await updateFee.mutateAsync({ id, data });
    } catch (error) {
      // Error is already handled by the hook with toast
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteFee.mutateAsync(id);
    } catch (error) {
      // Error is already handled by the hook with toast
    }
  };

  // Convert KhoanThu[] to FeesResponse format for compatibility with FeesTable
  const feesResponse = React.useMemo(() => {
    if (!fees.data) return undefined;
    
    return {
      content: fees.data,
      totalElements: fees.data.length,
      totalPages: 1,
      number: 0,
      size: fees.data.length,
      first: true,
      last: true,
      empty: fees.data.length === 0,
    };
  }, [fees.data]);

  if (fees.isLoading && isFirstMount.current) {
    return (
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="px-4 lg:px-6">
          <Skeleton className="h-9 w-64" />
        </div>
        <div className="space-y-4 px-4 lg:px-6">
          <div className="flex items-center justify-between">
            <div className="flex flex-1 items-center space-x-2">
              <Skeleton className="h-8 w-[250px]" />
              <Skeleton className="h-8 w-[100px]" />
            </div>
            <Skeleton className="h-8 w-[120px]" />
          </div>
          <div className="rounded-md border">
            <div className="relative w-full">
              <div className="space-y-2 p-4">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (fees.isError) {
    return (
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="px-4 lg:px-6">
          <h1 className="text-3xl font-bold">Quản lý Khoản Thu</h1>
        </div>
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive mx-4 lg:mx-6">
          <p>Không thể tải danh sách khoản thu. Vui lòng kiểm tra:</p>
          <ul className="list-disc list-inside mt-2 text-sm">
            <li>Backend Spring Boot đã chạy chưa?</li>
            <li>Endpoint /api/khoanthu có hoạt động không?</li>
            <li>Database có kết nối được không?</li>
          </ul>
          <p className="mt-2 text-sm">Error: {(fees.error as any)?.message || 'Unknown error'}</p>
        </div>
      </div>
    );
  }

  const isEmpty = !fees.data || fees.data.length === 0;

  return (
    <div className="flex flex-col gap-4 py-6 md:gap-6 px-12">
      <div className="px-4 lg:px-6">
        <h1 className="text-3xl font-bold">Quản lý Khoản Thu</h1>
        <p className="text-muted-foreground mt-2">
          Quản lý các khoản thu bắt buộc và tự nguyện của khu dân cư
        </p>
      </div>

      {/* Filter Section */}
      <div className="px-4 lg:px-6">
        <div className="flex items-center gap-4">
          <label htmlFor="filter" className="text-sm font-medium">
            Lọc khoản thu:
          </label>
          <Select
            value={filter}
            onValueChange={(value) => setFilter(value as typeof filter)}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="batbuoc">Bắt buộc</SelectItem>
              <SelectItem value="tunguyen">Tự nguyện</SelectItem>
              <SelectItem value="active">Đang trong thời hạn</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Alert className="mt-4">
          <InfoIcon className="h-4 w-4" />
          <AlertDescription>
            <strong>Khoản bắt buộc:</strong> Tất cả hộ dân phải đóng. 
            <strong className="ml-3">Khoản tự nguyện:</strong> Hộ dân tự nguyện đóng góp.
            <strong className="ml-3">Đang trong thời hạn:</strong> Các khoản thu đang trong thời gian nộp.
          </AlertDescription>
        </Alert>
      </div>

      {isEmpty ? (
        <div className="rounded-lg border border-muted p-8 text-center text-muted-foreground mx-4 lg:mx-6">
          <p className="text-lg font-medium">Chưa có khoản thu nào</p>
          <p className="text-sm mt-1">
            {filter === 'all' 
              ? 'Hãy tạo khoản thu đầu tiên để bắt đầu' 
              : `Không có khoản thu ${filter === 'batbuoc' ? 'bắt buộc' : filter === 'tunguyen' ? 'tự nguyện' : 'đang trong thời hạn'}`
            }
          </p>
        </div>
      ) : (
        <FeesTable
          data={feesResponse}
          onEdit={handleUpdate}
          onDelete={handleDelete}
          onCreate={handleCreate}
          onPageChange={() => {}} // No pagination from backend
          isCreating={createFee.isPending}
          isUpdating={updateFee.isPending}
          isDeleting={deleteFee.isPending}
          isLoading={fees.isLoading}
          onSearch={async () => {}} // Search handled by filter
        />
      )}
    </div>
  );
}