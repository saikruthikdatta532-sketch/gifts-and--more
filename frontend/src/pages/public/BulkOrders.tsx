import { useState, FormEvent } from "react";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Button } from "@/components/ui/Button";
import { generateGeneralBulkWhatsAppLink } from "@/utils/whatsapp";
import { enquiryService } from "@/services/enquiryService";

const features = [
  "Bulk quantities from 50 to 5,000+ pieces",
  "Custom packaging and branding",
  "Event-specific gift curation",
  "Delivery coordination across cities",
  "Dedicated WhatsApp support throughout",
];

export function BulkOrders() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    eventType: "",
    quantity: "",
    productOrCategory: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  function update(key: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Record as an internal enquiry (admin CRM) — no payment, no checkout.
      await enquiryService.create({
        customerName: form.name,
        customerPhone: form.phone,
        eventType: form.eventType || undefined,
        quantity: form.quantity ? parseInt(form.quantity, 10) : undefined,
        notes: `${form.productOrCategory ? `Product/Category: ${form.productOrCategory}. ` : ""}${form.message}`,
      });
    } catch {
      // Non-blocking — WhatsApp redirect still happens even if the CRM write fails
    } finally {
      setSubmitting(false);
    }

    const link = generateGeneralBulkWhatsAppLink(form);
    window.open(link, "_blank", "noopener,noreferrer");
  }

  return (
    <div>
      <section className="bg-brand-pink-light/60 dark:bg-white/5 py-16">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 text-center">
          <SectionLabel>For Events</SectionLabel>
          <h1 className="font-display text-3xl sm:text-4xl mb-4">Planning an Event?</h1>
          <p className="text-brand-black/65 dark:text-white/65 max-w-xl mx-auto">
            We provide return gifts and event gifting solutions for weddings, celebrations,
            corporate events and other occasions.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 sm:px-8 py-16 grid md:grid-cols-2 gap-12">
        <div>
          <h2 className="font-display text-2xl mb-6">What We Offer</h2>
          <ul className="space-y-4">
            {features.map((f) => (
              <li key={f} className="flex items-start gap-3 text-sm text-brand-black/70 dark:text-white/70">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-brand-pink-dark shrink-0" />
                {f}
              </li>
            ))}
          </ul>
        </div>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-surface-off-dark rounded-2xl shadow-soft p-6 sm:p-8 space-y-4">
          <h2 className="font-display text-xl mb-2">Send a Bulk Enquiry</h2>

          <input
            required
            placeholder="Your Name"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-transparent text-sm focus:outline-none focus:border-brand-pink-dark"
          />
          <input
            required
            placeholder="Phone Number"
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-transparent text-sm focus:outline-none focus:border-brand-pink-dark"
          />
          <input
            placeholder="Event Type (e.g. Wedding, Birthday)"
            value={form.eventType}
            onChange={(e) => update("eventType", e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-transparent text-sm focus:outline-none focus:border-brand-pink-dark"
          />
          <input
            type="number"
            min={1}
            placeholder="Approximate Quantity"
            value={form.quantity}
            onChange={(e) => update("quantity", e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-transparent text-sm focus:outline-none focus:border-brand-pink-dark"
          />
          <input
            placeholder="Product / Category (optional)"
            value={form.productOrCategory}
            onChange={(e) => update("productOrCategory", e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-transparent text-sm focus:outline-none focus:border-brand-pink-dark"
          />
          <textarea
            placeholder="Message (optional)"
            rows={3}
            value={form.message}
            onChange={(e) => update("message", e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-transparent text-sm focus:outline-none focus:border-brand-pink-dark resize-none"
          />

          <Button type="submit" size="lg" className="w-full" disabled={submitting}>
            {submitting ? "Sending..." : "Send Bulk Enquiry on WhatsApp"}
          </Button>
        </form>
      </section>
    </div>
  );
}
