"use client";

import * as React from "react";
import { AuditLogsTable } from "@/components/audit/AuditLogsTable";
import { auditApi } from "@/lib/api/audit";
import { AuditLog } from "@/lib/types/audit";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export default function AuditLogsPage() {
  const [logs, setLogs] = React.useState<AuditLog[]>([]);
  const [filteredLogs, setFilteredLogs] = React.useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [filterAction, setFilterAction] = React.useState("ALL");

  React.useEffect(() => {
    const fetchLogs = async () => {
      try {
        setIsLoading(true);
        const data = await auditApi.getAll();
        setLogs(data);
        setFilteredLogs(data);
      } catch (error) {
        console.error("Failed to fetch audit logs:", error);
        toast.error("Không thể tải audit logs");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLogs();
  }, []);

  // Filter logs by search query and action
  React.useEffect(() => {
    let filtered = logs;

    // Filter by search query (actor)
    if (searchQuery.trim() !== "") {
      filtered = filtered.filter((log) =>
        log.actor.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by action
    if (filterAction !== "ALL") {
      filtered = filtered.filter((log) => log.action === filterAction);
    }

    setFilteredLogs(filtered);
  }, [searchQuery, filterAction, logs]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Audit Logs</h1>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <Skeleton className="h-8 w-[250px]" />
            <Skeleton className="h-8 w-[180px]" />
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
        <div>
          <h1 className="text-3xl font-bold">Audit Logs</h1>
          <p className="text-muted-foreground mt-1">
            Lịch sử các thay đổi trong hệ thống
          </p>
        </div>
      </div>

      <AuditLogsTable
        logs={filteredLogs}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filterAction={filterAction}
        setFilterAction={setFilterAction}
      />
    </div>
  );
}