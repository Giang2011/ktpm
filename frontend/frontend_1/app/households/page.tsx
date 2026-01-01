"use client";

import * as React from "react";
import { HouseholdsTable } from "@/components/households/HouseholdTable";
import { hoKhauApi } from "@/lib/api/hokhau";
import { HoKhau, CreateHoKhauRequest, UpdateHoKhauRequest } from "@/lib/types/household";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export default function HouseholdsPage() {
  const [households, setHouseholds] = React.useState<HoKhau[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isCreating, setIsCreating] = React.useState(false);
  const [isUpdating, setIsUpdating] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const fetchHouseholds = React.useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await hoKhauApi.getAll();
      setHouseholds(data);
    } catch (error) {
      console.error("Failed to fetch households:", error);
      toast.error("Không thể tải danh sách hộ khẩu");
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchHouseholds();
  }, [fetchHouseholds]);

  // Search functionality
  React.useEffect(() => {
    const searchHouseholds = async () => {
      if (searchQuery.trim() === "") {
        fetchHouseholds();
        return;
      }

      try {
        setIsLoading(true);
        const data = await hoKhauApi.searchByChuHo(searchQuery);
        setHouseholds(data);
      } catch (error) {
        console.error("Failed to search households:", error);
        toast.error("Không thể tìm kiếm hộ khẩu");
      } finally {
        setIsLoading(false);
      }
    };

    const debounce = setTimeout(searchHouseholds, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery, fetchHouseholds]);

  const handleCreate = async (data: CreateHoKhauRequest) => {
    try {
      setIsCreating(true);
      await hoKhauApi.create(data);
      toast.success("Tạo hộ khẩu thành công");
      fetchHouseholds();
    } catch (error) {
      console.error("Failed to create household:", error);
      toast.error("Không thể tạo hộ khẩu");
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdate = async (id: number, data: UpdateHoKhauRequest) => {
    try {
      setIsUpdating(true);
      await hoKhauApi.update(id, data);
      toast.success("Cập nhật hộ khẩu thành công");
      fetchHouseholds();
    } catch (error) {
      console.error("Failed to update household:", error);
      toast.error("Không thể cập nhật hộ khẩu");
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      setIsDeleting(true);
      await hoKhauApi.delete(id);
      toast.success("Xóa hộ khẩu thành công");
      fetchHouseholds();
    } catch (error) {
      console.error("Failed to delete household:", error);
      toast.error("Không thể xóa hộ khẩu");
      throw error;
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading && households.length === 0) {
    return (
      <div className="container mx-auto py-6 px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Quản lý Hộ Khẩu</h1>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-[250px]" />
            <Skeleton className="h-8 w-[120px]" />
          </div>
          <div className="rounded-md border">
            <div className="relative w-full">
              <div className="space-y-2 p-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-8 w-full" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Quản lý Hộ Khẩu</h1>
      </div>

      <HouseholdsTable
        households={households}
        onEdit={handleUpdate}
        onDelete={handleDelete}
        onCreate={handleCreate}
        isCreating={isCreating}
        isUpdating={isUpdating}
        isDeleting={isDeleting}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
    </div>
  );
}
