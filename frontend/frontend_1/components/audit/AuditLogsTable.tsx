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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AuditLog } from "@/lib/types/audit";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AuditLogsTableProps {
  logs: AuditLog[];
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  filterAction: string;
  setFilterAction: React.Dispatch<React.SetStateAction<string>>;
}

export function AuditLogsTable({
  logs,
  searchQuery,
  setSearchQuery,
  filterAction,
  setFilterAction,
}: AuditLogsTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [selectedLog, setSelectedLog] = React.useState<AuditLog | null>(null);
  const [isDetailOpen, setIsDetailOpen] = React.useState(false);

  const columns: ColumnDef<AuditLog>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => <div className="w-12">{row.getValue("id")}</div>,
    },
    {
      accessorKey: "actor",
      header: "Người thực hiện",
      cell: ({ row }) => <div className="font-medium">{row.getValue("actor")}</div>,
    },
    {
      accessorKey: "action",
      header: "Hành động",
      cell: ({ row }) => {
        const action = row.getValue("action") as string;
        let variant: "default" | "secondary" | "destructive" = "default";
        if (action === "CREATE") variant = "default";
        else if (action === "UPDATE") variant = "secondary";
        else if (action === "DELETE") variant = "destructive";
        
        return <Badge variant={variant}>{action}</Badge>;
      },
    },
    {
      accessorKey: "entityName",
      header: "Đối tượng",
      cell: ({ row }) => <div>{row.getValue("entityName")}</div>,
    },
    {
      accessorKey: "entityId",
      header: "ID Đối tượng",
      cell: ({ row }) => <div>{row.getValue("entityId")}</div>,
    },
    {
      accessorKey: "createdAt",
      header: "Thời gian",
      cell: ({ row }) => {
        const date = row.getValue("createdAt") as string;
        return (
          <div>
            {new Date(date).toLocaleString("vi-VN", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Chi tiết",
      cell: ({ row }) => {
        const log = row.original;
        return (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedLog(log);
              setIsDetailOpen(true);
            }}
          >
            Xem
          </Button>
        );
      },
    },
  ];

  const table = useReactTable({
    data: logs,
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
      <div className="flex items-center justify-between gap-4">
        <Input
          placeholder="Tìm kiếm theo người thực hiện..."
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          className="max-w-sm"
        />
        <Select value={filterAction} onValueChange={setFilterAction}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Lọc theo hành động" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Tất cả</SelectItem>
            <SelectItem value="CREATE">CREATE</SelectItem>
            <SelectItem value="UPDATE">UPDATE</SelectItem>
            <SelectItem value="DELETE">DELETE</SelectItem>
          </SelectContent>
        </Select>
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

      {selectedLog && (
        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Chi tiết Audit Log</DialogTitle>
              <DialogDescription>
                Thông tin chi tiết về hành động {selectedLog.action}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">ID</p>
                  <p className="text-base">{selectedLog.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Người thực hiện</p>
                  <p className="text-base font-semibold">{selectedLog.actor}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Hành động</p>
                  <Badge variant={
                    selectedLog.action === "CREATE" ? "default" :
                    selectedLog.action === "UPDATE" ? "secondary" : "destructive"
                  }>
                    {selectedLog.action}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Đối tượng</p>
                  <p className="text-base">{selectedLog.entityName} (ID: {selectedLog.entityId})</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-medium text-muted-foreground">Thời gian</p>
                  <p className="text-base">
                    {new Date(selectedLog.createdAt).toLocaleString("vi-VN")}
                  </p>
                </div>
              </div>
              
              {selectedLog.oldData && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Dữ liệu cũ</p>
                  <pre className="bg-muted p-3 rounded-md text-xs overflow-auto max-h-48">
                    {JSON.stringify(JSON.parse(selectedLog.oldData), null, 2)}
                  </pre>
                </div>
              )}
              
              {selectedLog.newData && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Dữ liệu mới</p>
                  <pre className="bg-muted p-3 rounded-md text-xs overflow-auto max-h-48">
                    {JSON.stringify(JSON.parse(selectedLog.newData), null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}