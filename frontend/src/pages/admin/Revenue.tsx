import { useEffect, useState, FormEvent } from "react";
import { revenueService } from "@/services/revenueService";
import { enquiryService } from "@/services/enquiryService";
import { Revenue, Enquiry } from "@/types";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Table, Thead, Th, Td, Tr } from "@/components/ui/Table";
import { formatCurrency } from "@/utils/formatCurrency";

export function AdminRevenue() {
  const [revenue, setRevenue] = useState<Revenue[]>([]);
  const [summary, setSummary] = useState({
    totalConfirmedRevenue: 0,
    monthlyRevenue: 0,
    numberOfConfirmedOrders: 0,
    averageOrderValue: 0,
  });
  const [confirmedEnquiries, setConfirmedEnquiries] = useState<Enquiry[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [enquiryId, setEnquiryId] = useState("");
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function load() {
    revenueService.list().then((res) => {
      setRevenue(res.revenue);
      setSummary(res.summary);
    });
    // Enquiries eligible for recording revenue against
    enquiryService.list("CONTACTED", 1, 50).then((res) => setConfirmedEnquiries(res.items));
  }

  useEffect(load, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await revenueService.create({ enquiryId, amount: parseFloat(amount), notes: notes || undefined });
      setFormOpen(false);
      setEnquiryId("");
      setAmount("");
      setNotes("");
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not record revenue.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl">Revenue</h1>
          <p className="text-xs text-brand-black/50 dark:text-white/50 mt-1">
            Manually recorded business revenue — not connected to any payment system.
          </p>
        </div>
        <Button onClick={() => setFormOpen(true)}>Record Revenue</Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <Card hover={false} className="p-5">
          <p className="text-xs text-brand-black/50 dark:text-white/50 mb-2">Total Confirmed</p>
          <p className="font-display text-xl">{formatCurrency(summary.totalConfirmedRevenue)}</p>
        </Card>
        <Card hover={false} className="p-5">
          <p className="text-xs text-brand-black/50 dark:text-white/50 mb-2">This Month</p>
          <p className="font-display text-xl">{formatCurrency(summary.monthlyRevenue)}</p>
        </Card>
        <Card hover={false} className="p-5">
          <p className="text-xs text-brand-black/50 dark:text-white/50 mb-2">Confirmed Orders</p>
          <p className="font-display text-xl">{summary.numberOfConfirmedOrders}</p>
        </Card>
        <Card hover={false} className="p-5">
          <p className="text-xs text-brand-black/50 dark:text-white/50 mb-2">Avg. Order Value</p>
          <p className="font-display text-xl">{formatCurrency(summary.averageOrderValue)}</p>
        </Card>
      </div>

      {revenue.length === 0 ? (
        <p className="text-sm text-brand-black/50 dark:text-white/50">No revenue recorded yet.</p>
      ) : (
        <Table>
          <Thead>
            <Th>Customer</Th>
            <Th>Product</Th>
            <Th>Amount</Th>
            <Th>Notes</Th>
            <Th>Date</Th>
          </Thead>
          <tbody>
            {revenue.map((r: any) => (
              <Tr key={r.id}>
                <Td>{r.enquiry?.customerName ?? "—"}</Td>
                <Td className="text-brand-black/50 dark:text-white/50">{r.enquiry?.product?.name ?? "—"}</Td>
                <Td className="font-medium">{formatCurrency(r.amount)}</Td>
                <Td className="text-brand-black/50 dark:text-white/50">{r.notes ?? "—"}</Td>
                <Td className="text-xs text-brand-black/40 dark:text-white/40">
                  {new Date(r.recordedAt).toLocaleDateString()}
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      )}

      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <form
            onSubmit={handleSubmit}
            className="bg-white dark:bg-surface-off-dark rounded-2xl shadow-soft-lg max-w-md w-full p-6 space-y-4"
          >
            <h3 className="font-display text-lg">Record Confirmed Revenue</h3>
            {error && <p className="text-sm text-red-600">{error}</p>}

            <div>
              <label className="text-sm font-medium block mb-1.5">Enquiry</label>
              <select
                required
                value={enquiryId}
                onChange={(e) => setEnquiryId(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-transparent text-sm"
              >
                <option value="">Select enquiry</option>
                {confirmedEnquiries.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.customerName} — {e.product?.name ?? "General enquiry"}
                  </option>
                ))}
              </select>
              <p className="text-xs text-brand-black/40 dark:text-white/40 mt-1">
                Showing enquiries marked "Contacted". Recording revenue will mark it Confirmed.
              </p>
            </div>

            <div>
              <label className="text-sm font-medium block mb-1.5">Amount (₹)</label>
              <input
                required
                type="number"
                min="0.01"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-transparent text-sm"
              />
            </div>

            <div>
              <label className="text-sm font-medium block mb-1.5">Notes (optional)</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-transparent text-sm resize-none"
              />
            </div>

            <div className="flex gap-3 justify-end pt-2">
              <Button type="button" variant="ghost" onClick={() => setFormOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : "Record Revenue"}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
