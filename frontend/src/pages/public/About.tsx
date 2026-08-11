import { SectionLabel } from "@/components/ui/SectionLabel";

export function About() {
  return (
    <div className="max-w-3xl mx-auto px-5 sm:px-8 py-16">
      <SectionLabel>Our Story</SectionLabel>
      <h1 className="font-display text-3xl sm:text-4xl mb-6">About Return Gifts</h1>
      <div className="space-y-5 text-brand-black/70 dark:text-white/70 leading-relaxed">
        <p>
          Return Gifts is a boutique gifting studio dedicated to curating thoughtful, elegant
          return gifts for life's celebrations — from weddings and baby showers to corporate
          milestones and everything in between.
        </p>
        <p>
          We believe a return gift is more than a formality — it's a small, lasting token of
          gratitude. That's why every piece in our collection is chosen with care, whether you
          need a handful of gifts for an intimate gathering or thousands for a large event.
        </p>
        <p>
          We keep things simple and personal: browse our collection online, then reach out to us
          directly on WhatsApp to discuss customization, pricing and delivery. No complicated
          checkouts — just a conversation with people who care about getting your event right.
        </p>
      </div>
    </div>
  );
}
