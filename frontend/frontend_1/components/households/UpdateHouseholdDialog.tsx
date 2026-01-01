"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { HoKhau, UpdateHoKhauRequest } from "@/lib/types/household";

const formSchema = z.object({
  tenChuHo: z.string().min(1, "Tên chủ hộ là bắt buộc"),
  diaChi: z.string().min(1, "Địa chỉ là bắt buộc"),
  trangThai: z.number().min(0).max(1).optional().default(1),
});

interface UpdateHouseholdDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  household: HoKhau;
  onUpdate?: (id: number, data: UpdateHoKhauRequest) => Promise<void>;
  isUpdating?: boolean;
}

export function UpdateHouseholdDialog({
  open,
  onOpenChange,
  household,
  onUpdate,
  isUpdating,
}: UpdateHouseholdDialogProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tenChuHo: household.tenChuHo,
      diaChi: household.diaChi,
      trangThai: household.trangThai,
    },
  });

  React.useEffect(() => {
    form.reset({
      tenChuHo: household.tenChuHo,
      diaChi: household.diaChi,
      trangThai: household.trangThai,
    });
  }, [household, form]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      await onUpdate?.(household.id, data as UpdateHoKhauRequest);
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating household:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Cập nhật hộ khẩu</DialogTitle>
          <DialogDescription>
            Chỉnh sửa thông tin hộ khẩu trong form bên dưới.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="tenChuHo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên chủ hộ</FormLabel>
                  <FormControl>
                    <Input placeholder="Nguyễn Văn A" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="diaChi"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Địa chỉ</FormLabel>
                  <FormControl>
                    <Input placeholder="123 Đường ABC, Quận XYZ" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="trangThai"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trạng thái</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    value={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn trạng thái" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1">Đang ở</SelectItem>
                      <SelectItem value="0">Đã chuyển đi</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Hủy
              </Button>
              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? "Đang cập nhật..." : "Cập nhật"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}