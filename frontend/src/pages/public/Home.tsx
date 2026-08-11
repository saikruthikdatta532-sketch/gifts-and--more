import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { ProductGrid } from "@/components/product/ProductGrid";
import { productService } from "@/services/productService";
import { Product } from "@/types";

const occasions = [
  { name: "Weddings", slug: "wedding" },
  { name: "Birthdays", slug: "birthday" },
  { name: "Baby Showers", slug: "baby-shower" },
  { name: "Housewarming", slug: "housewarming" },
  { name: "Corporate Events", slug: "corporate" },
  { name: "Religious Events", slug: "religious" },
];

const whyUs = [
  { title: "Thoughtfully Curated", text: "Every piece is chosen for warmth, quality and lasting impression." },
  { title: "Bulk-Ready", text: "From 50 to 5,000 pieces — we scale with your event." },
  { title: "Personal Service", text: "Talk directly to us on WhatsApp — no call centers, no forms." },
];

export function Home() {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productService
      .list({ sort: "popular", limit: 8, available: true })
      .then((res) => setFeatured(res.items))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-brand-pink-light/60 dark:bg-white/5">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-20 sm:py-28 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <SectionLabel>Premium Return Gifts</SectionLabel>
            <h1 className="font-display text-4xl sm:text-5xl leading-[1.1] mb-5">
              Beautiful Return Gifts for Every Celebration
            </h1>
            <p className="text-brand-black/65 dark:text-white/65 text-lg mb-8 max-w-md">
              Elegant, thoughtful and memorable gifts for weddings, birthdays, events and special
              occasions.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/products">
                <Button size="lg">Explore Gifts</Button>
              </Link>
              <Link to="/bulk-orders">
                <Button variant="outline" size="lg">Bulk Order Enquiry</Button>
              </Link>
            </div>
          </div>

          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-soft-lg rotate-1 hover:rotate-0 transition-transform duration-500">
            <img
              src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=1200&auto=format&fit=crop"
              alt="Curated return gifts arranged elegantly"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Featured Gifts */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 py-16">
        <SectionLabel>Featured</SectionLabel>
        <div className="flex items-end justify-between mb-8">
          <h2 className="font-display text-2xl sm:text-3xl">Popular Gifts Right Now</h2>
          <Link to="/products" className="text-sm font-medium text-brand-pink-dark hidden sm:block">
            View all →
          </Link>
        </div>
        <ProductGrid products={featured} loading={loading} />
      </section>

      {/* Shop by Occasion */}
      <section className="bg-black/[0.02] dark:bg-white/[0.03] py-16">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <SectionLabel>By Occasion</SectionLabel>
          <h2 className="font-display text-2xl sm:text-3xl mb-8">Shop by Occasion</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {occasions.map((o) => (
              <Link
                key={o.slug}
                to={`/products?eventType=${o.slug}`}
                className="rounded-xl bg-white dark:bg-surface-off-dark border border-black/5 dark:border-white/5 shadow-soft hover:shadow-soft-lg hover:-translate-y-1 transition-all duration-300 py-6 text-center text-sm font-medium"
              >
                {o.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 py-16">
        <SectionLabel>Why Us</SectionLabel>
        <h2 className="font-display text-2xl sm:text-3xl mb-10">Why Choose Us</h2>
        <div className="grid sm:grid-cols-3 gap-6">
          {whyUs.map((item) => (
            <div key={item.title} className="p-6 rounded-2xl bg-brand-pink-light/50 dark:bg-white/5">
              <h3 className="font-display text-lg mb-2">{item.title}</h3>
              <p className="text-sm text-brand-black/60 dark:text-white/60">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bulk Orders CTA */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 pb-16">
        <div className="rounded-2xl bg-brand-black text-white p-10 sm:p-14 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-lg">
            <h2 className="font-display text-2xl sm:text-3xl mb-3">Planning a Big Event?</h2>
            <p className="text-white/60">
              We handle bulk return gifting for weddings, corporate events and large celebrations —
              with custom packaging and dedicated support.
            </p>
          </div>
          <Link to="/bulk-orders">
            <Button variant="secondary" size="lg">Start Bulk Order</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
