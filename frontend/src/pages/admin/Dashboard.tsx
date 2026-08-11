import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { DashboardMetrics } from "@/types";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatCurrency } from "@/utils/formatCurrency";

const metricCards: Array<{ key: keyof DashboardMetrics; label: string; format?: "currency" }> = [
  { key: "totalProducts", label: "Total Products" },
  { key: "availableProducts", label: "Available Stock" },
  { key: "outOfStockProducts", label: "Out of Stock" },
  { key: "totalEnquiries", label: "Total Enquiries" },
  { key: "pendingEnquiries", label: "Pending Enquiries" },
  { key: "bulkEnquiries", label: "Bulk Enquiries" },
  { key: "confirmedRevenue", label: "Confirmed Revenue", format: "currency" },
  { key: "monthlyRevenue", label: "This Month's Revenue", format: "currency" },
  { key: "confirmedOrders", label: "Confirmed Orders" },
  { key: "averageOrderValue", label: "Avg. Order Value", format: "currency" },
];

export function Dashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<{ metrics: DashboardMetrics }>("/admin/dashboard")
      .then((res) => setMetrics(res.data.metrics))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="font-display text-2xl mb-1">Dashboard</h1>
      <p className="text-sm text-brand-black/50 dark:text-white/50 mb-8">
        Confirmed revenue is manually recorded — it is not collected automatically on the website.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
        {loading || !metrics
          ? Array.from({ length: 10 }).map((_, i) => <Skeleton key={i} className="h-24" />)
          : metricCards.map((card) => (
              <Card key={card.key} hover={false} className="p-5">
                <p className="text-xs text-brand-black/50 dark:text-white/50 mb-2">{card.label}</p>
                <p className="font-display text-2xl">
                  {card.format === "currency"
                    ? formatCurrency(metrics[card.key] as number)
                    : (metrics[card.key] as number)}
                </p>
              </Card>
            ))}
      </div>

      <h2 className="font-display text-lg mb-4">Recent Activity</h2>
      <Card hover={false} className="divide-y divide-black/5 dark:divide-white/5">
        {loading || !metrics ? (
          <div className="p-5 space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-5 w-2/3" />
            ))}
          </div>
        ) : metrics.recentActivity.length === 0 ? (
          <p className="p-5 text-sm text-brand-black/50 dark:text-white/50">
            No activity logs found.
          </p>
        ) : (
          metrics.recentActivity.map((log) => (
            <div key={log.id} className="p-4 flex items-center justify-between text-sm">
              <div>
                <span className="font-medium">{log.action.replace(/_/g, " ")}</span>
                <span className="text-brand-black/50 dark:text-white/50"> — {log.entityType}</span>
              </div>
              <span className="text-xs text-brand-black/40 dark:text-white/40">
                {new Date(log.createdAt).toLocaleString()}
              </span>
            </div>
          ))
        )}
      </Card>
    </div>
  );
}
