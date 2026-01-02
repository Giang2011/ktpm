import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { feesApi } from "../api/fees";
import { CreateFeeRequest, UpdateFeeRequest, KhoanThu } from "../types/fee";
import { toast } from "sonner";
import { logActivity } from "@/lib/utils/activity-logger";

interface UseFeesOptions {
  filter?: 'batbuoc' | 'tunguyen' | 'active';
}

export function useFees(options?: UseFeesOptions) {
  const queryClient = useQueryClient();

  const fees = useQuery({
    queryKey: ["fees", options?.filter],
    queryFn: () => feesApi.getFees(options?.filter),
  });

  const createFee = useMutation({
    mutationFn: (data: CreateFeeRequest) => feesApi.createFee(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["fees"] });
      logActivity("Create Fee", `Created fee: ${variables.tenKhoanThu}`, "CREATE");
      toast.success("Khoản thu đã được tạo thành công");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Không thể tạo khoản thu");
    },
  });

  const updateFee = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateFeeRequest }) =>
      feesApi.updateFee(id, data),
    onSuccess: (_, { id, data }) => {
      queryClient.invalidateQueries({ queryKey: ["fees"] });
      queryClient.invalidateQueries({ queryKey: ["fee", id] });
      queryClient.invalidateQueries({ queryKey: ["fee-detail", id] });
      logActivity("Update Fee", `Updated fee: ${data.tenKhoanThu}`, "UPDATE");
      toast.success("Khoản thu đã được cập nhật");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Không thể cập nhật khoản thu");
    },
  });

  const deleteFee = useMutation({
    mutationFn: (id: number) => feesApi.deleteFee(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["fees"] });
      queryClient.removeQueries({ queryKey: ["fee", id] });
      queryClient.removeQueries({ queryKey: ["fee-detail", id] });
      const fee = (fees.data as KhoanThu[] | undefined)?.find((f) => f.id === id);
      logActivity("Delete Fee", `Deleted fee: ${fee?.tenKhoanThu}`, "DELETE");
      toast.success("Khoản thu đã được xóa");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Không thể xóa khoản thu");
    },
  });

  return {
    fees,
    createFee,
    updateFee,
    deleteFee,
  };
}

// Hook để lấy chi tiết 1 khoản thu
export function useFee(id: number) {
  return useQuery({
    queryKey: ["fee", id],
    queryFn: () => feesApi.getFee(id),
    enabled: !!id,
  });
}

// Hook để lấy chi tiết đầy đủ (bao gồm hộ đã đóng, chưa đóng, tổng tiền)
export function useFeeDetail(id: number) {
  return useQuery({
    queryKey: ["fee-detail", id],
    queryFn: () => feesApi.getFeeDetail(id),
    enabled: !!id,
  });
}

// Hook để lấy danh sách hộ đã đóng
export function useHoDaDong(id: number) {
  return useQuery({
    queryKey: ["fee-ho-da-dong", id],
    queryFn: () => feesApi.getHoDaDong(id),
    enabled: !!id,
  });
}

// Hook để lấy danh sách hộ chưa đóng
export function useHoChuaDong(id: number) {
  return useQuery({
    queryKey: ["fee-ho-chua-dong", id],
    queryFn: () => feesApi.getHoChuaDong(id),
    enabled: !!id,
  });
}

// Hook để lấy tổng tiền đã thu
export function useTongThu(id: number) {
  return useQuery({
    queryKey: ["fee-tong-thu", id],
    queryFn: () => feesApi.getTongThu(id),
    enabled: !!id,
  });
}
