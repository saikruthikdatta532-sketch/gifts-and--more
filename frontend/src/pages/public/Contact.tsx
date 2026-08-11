import { SectionLabel } from "@/components/ui/SectionLabel";
import { Button } from "@/components/ui/Button";
import { generateSupportWhatsAppLink } from "@/utils/whatsapp";

const PRIMARY_DISPLAY = "+91 97315 56855";
const SUPPORT_DISPLAY = "+91 98458 61526";

export function Contact() {
  const link = generateSupportWhatsAppLink();

  return (
    <div className="max-w-2xl mx-auto px-5 sm:px-8 py-16 text-center">
      <SectionLabel>Get in Touch</SectionLabel>
      <h1 className="font-display text-3xl sm:text-4xl mb-4">Need Help?</h1>
      <p className="text-brand-black/65 dark:text-white/65 mb-10">
        Our support is entirely WhatsApp-based — reach out directly and we'll respond as quickly
        as we can.
      </p>

      <div className="bg-white dark:bg-surface-off-dark rounded-2xl shadow-soft p-8 space-y-6">
        <div>
          <p className="text-xs uppercase tracking-wide text-brand-black/40 dark:text-white/40 mb-1">
            Primary
          </p>
          <p className="text-lg font-medium">{PRIMARY_DISPLAY}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-brand-black/40 dark:text-white/40 mb-1">
            Support
          </p>
          <p className="text-lg font-medium">{SUPPORT_DISPLAY}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <a href={link} target="_blank" rel="noopener noreferrer" className="flex-1">
            <Button size="lg" className="w-full">Chat with Support</Button>
          </a>
          <a href={link} target="_blank" rel="noopener noreferrer" className="flex-1">
            <Button variant="outline" size="lg" className="w-full">WhatsApp Us</Button>
          </a>
        </div>
      </div>
    </div>
  );
}
