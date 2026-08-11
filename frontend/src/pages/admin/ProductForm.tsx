import { useEffect, useState, FormEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { productService } from "@/services/productService";
import { categoryService } from "@/services/categoryService";
import { Category } from "@/types";
import { Button } from "@/components/ui/Button";

interface FormState {
  name: string;
  description: string;
  price: string;
  categoryId: string;
  stockQuantity: string;
  minimumBulkQuantity: string;
  isFeatured: boolean;
  customizationAvailable: boolean;
  eventType: string;
  imageUrl: string;
}

const emptyForm: FormState = {
  name: "",
  description: "",
  price: "",
  categoryId: "",
  stockQuantity: "0",
  minimumBulkQuantity: "",
  isFeatured: false,
  customizationAvailable: false,
  eventType: "",
  imageUrl: "",
};

export function ProductForm() {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();

  const [form, setForm] = useState<FormState>(emptyForm);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    categoryService.list().then(setCategories);
  }, []);

  useEffect(() => {
    if (!id) return;
    // Fetch by ID isn't exposed publicly, so we filter the admin list — simplest option
    // given the small catalog size expected for this business.
    productService.list({ limit: 100 }).then((res) => {
      const product = res.items.find((p) => p.id === id);
      if (product) {
        setForm({
          name: product.name,
          description: product.description,
          price: product.price,
          categoryId: product.categoryId,
          stockQuantity: String(product.stockQuantity),
          minimumBulkQuantity: product.minimumBulkQuantity ? String(product.minimumBulkQuantity) : "",
          isFeatured: product.isFeatured,
          customizationAvailable: product.customizationAvailable,
          eventType: product.eventType ?? "",
          imageUrl: product.images[0]?.url ?? "",
        });
      }
      setLoading(false);
    });
  }, [id]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const payload = {
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
        categoryId: form.categoryId,
        stockQuantity: parseInt(form.stockQuantity, 10) || 0,
        minimumBulkQuantity: form.minimumBulkQuantity ? parseInt(form.minimumBulkQuantity, 10) : null,
        isFeatured: form.isFeatured,
        customizationAvailable: form.customizationAvailable,
        eventType: form.eventType || null,
        images: form.imageUrl ? [{ url: form.imageUrl, sortOrder: 0 }] : [],
      };

      if (isEdit && id) {
        await productService.update(id, payload as never);
      } else {
        await productService.create(payload as never);
      }
      navigate("/admin/products");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="text-sm text-brand-black/50">Loading...</p>;

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl mb-6">{isEdit ? "Edit Product" : "Add Product"}</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-sm text-red-600">{error}</p>}

        <div>
          <label className="text-sm font-medium block mb-1.5">Product Name</label>
          <input
            required
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-transparent text-sm"
          />
        </div>

        <div>
          <label className="text-sm font-medium block mb-1.5">Description</label>
          <textarea
            required
            rows={4}
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-transparent text-sm resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium block mb-1.5">Price (₹)</label>
            <input
              required
              type="number"
              min="0.01"
              step="0.01"
              value={form.price}
              onChange={(e) => update("price", e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-transparent text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1.5">Category</label>
            <select
              required
              value={form.categoryId}
              onChange={(e) => update("categoryId", e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-transparent text-sm"
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium block mb-1.5">Stock Quantity</label>
            <input
              required
              type="number"
              min="0"
              value={form.stockQuantity}
              onChange={(e) => update("stockQuantity", e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-transparent text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1.5">Min. Bulk Quantity</label>
            <input
              type="number"
              min="1"
              value={form.minimumBulkQuantity}
              onChange={(e) => update("minimumBulkQuantity", e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-transparent text-sm"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium block mb-1.5">Event Type</label>
          <input
            placeholder="e.g. Wedding, Birthday"
            value={form.eventType}
            onChange={(e) => update("eventType", e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-transparent text-sm"
          />
        </div>

        <div>
          <label className="text-sm font-medium block mb-1.5">Image URL</label>
          <input
            placeholder="https://..."
            value={form.imageUrl}
            onChange={(e) => update("imageUrl", e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-transparent text-sm"
          />
        </div>

        <div className="flex gap-6 pt-1">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.customizationAvailable}
              onChange={(e) => update("customizationAvailable", e.target.checked)}
            />
            Customization Available
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.isFeatured}
              onChange={(e) => update("isFeatured", e.target.checked)}
            />
            Featured
          </label>
        </div>

        <div className="flex gap-3 justify-end pt-4">
          <Button type="button" variant="ghost" onClick={() => navigate("/admin/products")}>
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save Product"}
          </Button>
        </div>
      </form>
    </div>
  );
}
