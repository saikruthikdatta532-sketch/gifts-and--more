import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { ProductGrid } from "@/components/product/ProductGrid";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { productService } from "@/services/productService";
import { categoryService } from "@/services/categoryService";
import { Product, Category } from "@/types";
import { cn } from "@/utils/cn";

const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "popular", label: "Popular" },
];

export function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const search = searchParams.get("search") ?? "";
  const category = searchParams.get("category") ?? "";
  const eventType = searchParams.get("eventType") ?? "";
  const sort = (searchParams.get("sort") as typeof sortOptions[number]["value"]) ?? "newest";

  useEffect(() => {
    categoryService.list().then(setCategories);
  }, []);

  const fetchProducts = useCallback(() => {
    setLoading(true);
    productService
      .list({
        search: search || undefined,
        category: category || undefined,
        eventType: eventType || undefined,
        sort,
        limit: 24,
      })
      .then((res) => setProducts(res.items))
      .finally(() => setLoading(false));
  }, [search, category, eventType, sort]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  function updateParam(key: string, value: string) {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next);
  }

  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-8 py-12">
      <SectionLabel>Shop</SectionLabel>
      <h1 className="font-display text-3xl mb-8">All Return Gifts</h1>

      {/* Search + Sort */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Search products..."
          defaultValue={search}
          onChange={(e) => updateParam("search", e.target.value)}
          className="flex-1 px-4 py-3 rounded-full border border-black/10 dark:border-white/10 bg-transparent text-sm focus:outline-none focus:border-brand-pink-dark"
        />
        <select
          value={sort}
          onChange={(e) => updateParam("sort", e.target.value)}
          className="px-4 py-3 rounded-full border border-black/10 dark:border-white/10 bg-transparent text-sm focus:outline-none"
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Category filter pills */}
      <div className="flex flex-wrap gap-2 mb-10">
        <button
          onClick={() => updateParam("category", "")}
          className={cn(
            "px-4 py-2 rounded-full text-sm border transition-colors",
            !category
              ? "bg-brand-black text-white border-brand-black dark:bg-brand-pink dark:text-brand-black dark:border-brand-pink"
              : "border-black/10 dark:border-white/10 text-brand-black/60 dark:text-white/60"
          )}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => updateParam("category", cat.slug)}
            className={cn(
              "px-4 py-2 rounded-full text-sm border transition-colors",
              category === cat.slug
                ? "bg-brand-black text-white border-brand-black dark:bg-brand-pink dark:text-brand-black dark:border-brand-pink"
                : "border-black/10 dark:border-white/10 text-brand-black/60 dark:text-white/60"
            )}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <ProductGrid products={products} loading={loading} />
    </div>
  );
}
