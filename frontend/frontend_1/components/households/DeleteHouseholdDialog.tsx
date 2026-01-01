"use client";

import * as React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { HoKhau } from "@/lib/types/household";

interface DeleteHouseholdDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  household: HoKhau;
  onDelete?: (id: number) => Promise<void>;
  isDeleting?: boolean;
}

export function DeleteHouseholdDialog({
  open,
  onOpenChange,
  household,
  onDelete,
  isDeleting,
}: DeleteHouseholdDialogProps) {
  const handleDelete = async () => {
    try {
      await onDelete?.(household.id);
      onOpenChange(false);
    } catch (error) {
      console.error("Error deleting household:", error);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xác nhận xóa hộ khẩu</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc chắn muốn xóa hộ khẩu của <strong>{household.tenChuHo}</strong> tại{" "}
            <strong>{household.diaChi}</strong>?
            <br />
            <br />
            Hành động này không thể hoàn tác và sẽ xóa tất cả dữ liệu liên quan.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Hủy</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-destructive hover:bg-destructive/90"
          >
            {isDeleting ? "Đang xóa..." : "Xóa"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}