import { useEffect, useState } from "react";
import { enquiryService } from "@/services/enquiryService";
import { Enquiry, EnquiryStatus } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { Table, Thead, Th, Td, Tr } from "@/components/ui/Table";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";

const statuses: EnquiryStatus[] = ["NEW", "CONTACTED", "CONFIRMED", "COMPLETED", "CANCELLED"];

const statusColors: Record<EnquiryStatus, "pink" | "muted" | "outline"> = {
  NEW: "pink",
  CONTACTED: "outline",
  CONFIRMED: "pink",
  COMPLETED: "muted",
  CANCELLED: "muted",
};

export function AdminEnquiries() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [filter, setFilter] = useState<EnquiryStatus | "">("");
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    enquiryService
      .list(filter || undefined, 1, 50)
      .then((res) => setEnquiries(res.items))
      .finally(() => setLoading(false));
  }

  useEffect(load, [filter]);

  async function updateStatus(enquiry: Enquiry, status: EnquiryStatus) {
    await enquiryService.update(enquiry.id, { status });
    load();
  }

  return (
    <div>
      <h1 className="font-display text-2xl mb-6">Enquiries</h1>

      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setFilter("")}
          className={`px-4 py-2 rounded-full text-xs font-medium ${
            filter === "" ? "bg-brand-black text-white dark:bg-brand-pink dark:text-brand-black" : "bg-black/5 dark:bg-white/10"
          }`}
        >
          All
        </button>
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-full text-xs font-medium ${
              filter === s ? "bg-brand-black text-white dark:bg-brand-pink dark:text-brand-black" : "bg-black/5 dark:bg-white/10"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <Skeleton className="h-96" />
      ) : enquiries.length === 0 ? (
        <EmptyState title="No enquiries yet." />
      ) : (
        <Table>
          <Thead>
            <Th>Customer</Th>
            <Th>Phone</Th>
            <Th>Product</Th>
            <Th>Qty</Th>
            <Th>Event</Th>
            <Th>Status</Th>
            <Th>Date</Th>
          </Thead>
          <tbody>
            {enquiries.map((e) => (
              <Tr key={e.id}>
                <Td className="font-medium">{e.customerName}</Td>
                <Td>{e.customerPhone}</Td>
                <Td className="text-brand-black/50 dark:text-white/50">{e.product?.name ?? "—"}</Td>
                <Td>{e.quantity ?? "—"}</Td>
                <Td>{e.eventType ?? "—"}</Td>
                <Td>
                  <select
                    value={e.status}
                    onChange={(ev) => updateStatus(e, ev.target.value as EnquiryStatus)}
                    className="bg-transparent text-xs font-medium border border-black/10 dark:border-white/10 rounded-full px-3 py-1"
                  >
                    {statuses.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <Badge variant={statusColors[e.status]} className="hidden">{e.status}</Badge>
                </Td>
                <Td className="text-xs text-brand-black/40 dark:text-white/40">
                  {new Date(e.createdAt).toLocaleDateString()}
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}
