import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { categoryService } from "@/services/categoryService";
import { Category } from "@/types";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";

export function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    categoryService.list().then(setCategories).finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-8 py-12">
      <SectionLabel>Browse</SectionLabel>
      <h1 className="font-display text-3xl mb-10">Shop by Category</h1>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <EmptyState title="No categories found." />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
          {categories.map((cat) => (
            <Link key={cat.id} to={`/products?category=${cat.slug}`}>
              <Card className="p-6 h-32 flex flex-col justify-between">
                <h3 className="font-display text-lg">{cat.name}</h3>
                <p className="text-xs text-brand-black/50 dark:text-white/50">
                  {cat._count?.products ?? 0} products
                </p>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
