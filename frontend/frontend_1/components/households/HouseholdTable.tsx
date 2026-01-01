"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
  ColumnFiltersState,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IconDotsVertical, IconPlus, IconEye } from "@tabler/icons-react";
import { HoKhau, CreateHoKhauRequest, UpdateHoKhauRequest } from "@/lib/types/household";
import { CreateHouseholdDialog } from "./CreateHouseholdDialog";
import { UpdateHouseholdDialog } from "./UpdateHouseholdDialog";
import { DeleteHouseholdDialog } from "./DeleteHouseholdDialog";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

interface HouseholdsTableProps {
  households: HoKhau[];
  onEdit?: (id: number, data: UpdateHoKhauRequest) => Promise<void>;
  onDelete?: (id: number) => Promise<void>;
  onCreate?: (data: CreateHoKhauRequest) => Promise<void>;
  isCreating?: boolean;
  isUpdating?: boolean;
  isDeleting?: boolean;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
}

export function HouseholdsTable({
  households,
  onEdit,
  onDelete,
  onCreate,
  isCreating,
  isUpdating,
  isDeleting,
  searchQuery,
  setSearchQuery,
}: HouseholdsTableProps) {
  const router = useRouter();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [selectedHousehold, setSelectedHousehold] = React.useState<HoKhau | null>(null);
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = React.useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);

  const columns: ColumnDef<HoKhau>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => <div>{row.getValue("id")}</div>,
    },
    {
      accessorKey: "tenChuHo",
      header: "Tên Chủ Hộ",
      cell: ({ row }) => <div className="font-medium">{row.getValue("tenChuHo")}</div>,
    },
    {
      accessorKey: "diaChi",
      header: "Địa Chỉ",
      cell: ({ row }) => <div>{row.getValue("diaChi")}</div>,
    },
    {
      accessorKey: "ngayTao",
      header: "Ngày Tạo",
      cell: ({ row }) => {
        const date = row.getValue("ngayTao") as string;
        return <div>{new Date(date).toLocaleDateString("vi-VN")}</div>;
      },
    },
    {
      accessorKey: "trangThai",
      header: "Trạng Thái",
      cell: ({ row }) => {
        const status = row.getValue("trangThai") as number;
        return (
          <Badge variant={status === 1 ? "default" : "secondary"}>
            {status === 1 ? "Đang ở" : "Đã chuyển đi"}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: "Thao tác",
      cell: ({ row }) => {
        const household = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <IconDotsVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => router.push(`/households/${household.id}`)}>
                <IconEye className="mr-2 h-4 w-4" />
                Xem chi tiết
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setSelectedHousehold(household);
                  setIsUpdateOpen(true);
                }}
              >
                Chỉnh sửa
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => {
                  setSelectedHousehold(household);
                  setIsDeleteOpen(true);
                }}
              >
                Xóa
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: households,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Tìm kiếm theo tên chủ hộ..."
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          className="max-w-sm"
        />
        <Button onClick={() => setIsCreateOpen(true)}>
          <IconPlus className="mr-2 h-4 w-4" />
          Thêm hộ khẩu
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Trước
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Sau
        </Button>
      </div>

      <CreateHouseholdDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onCreate={onCreate}
        isCreating={isCreating}
      />

      {selectedHousehold && (
        <>
          <UpdateHouseholdDialog
            open={isUpdateOpen}
            onOpenChange={setIsUpdateOpen}
            household={selectedHousehold}
            onUpdate={onEdit}
            isUpdating={isUpdating}
          />
          <DeleteHouseholdDialog
            open={isDeleteOpen}
            onOpenChange={setIsDeleteOpen}
            household={selectedHousehold}
            onDelete={onDelete}
            isDeleting={isDeleting}
          />
        </>
      )}
    </div>
  );
}