import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { ActivityLog, Paginated } from "@/types";
import { Table, Thead, Th, Td, Tr } from "@/components/ui/Table";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";

export function AdminLogs() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<Paginated<ActivityLog>>("/admin/logs", { params: { limit: 50 } })
      .then((res) => setLogs(res.data.items))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="font-display text-2xl mb-6">Activity Logs</h1>

      {loading ? (
        <Skeleton className="h-96" />
      ) : logs.length === 0 ? (
        <EmptyState title="No activity logs found." />
      ) : (
        <Table>
          <Thead>
            <Th>Action</Th>
            <Th>Entity</Th>
            <Th>Admin</Th>
            <Th>Date</Th>
          </Thead>
          <tbody>
            {logs.map((log) => (
              <Tr key={log.id}>
                <Td className="font-medium">{log.action.replace(/_/g, " ")}</Td>
                <Td className="text-brand-black/50 dark:text-white/50">{log.entityType}</Td>
                <Td>{log.user?.name ?? "—"}</Td>
                <Td className="text-xs text-brand-black/40 dark:text-white/40">
                  {new Date(log.createdAt).toLocaleString()}
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}
