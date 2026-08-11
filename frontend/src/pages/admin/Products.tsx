import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { productService } from "@/services/productService";
import { Product } from "@/types";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Table, Thead, Th, Td, Tr } from "@/components/ui/Table";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatCurrency } from "@/utils/formatCurrency";

export function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);

  function load() {
    setLoading(true);
    productService.list({ limit: 100, sort: "newest" }).then((res) => setProducts(res.items)).finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await productService.remove(deleteTarget.id);
      setDeleteTarget(null);
      load();
    } finally {
      setDeleting(false);
    }
  }

  async function toggleAvailability(product: Product) {
    await productService.update(product.id, { isAvailable: !product.isAvailable });
    load();
  }

  async function quickStockUpdate(product: Product, delta: number) {
    const next = Math.max(0, product.stockQuantity + delta);
    await productService.updateStock(product.id, next);
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl">Products</h1>
        <Link to="/admin/products/new">
          <Button>Add Product</Button>
        </Link>
      </div>

      {loading ? (
        <Skeleton className="h-96" />
      ) : products.length === 0 ? (
        <EmptyState
          title="No products found."
          action={
            <Link to="/admin/products/new">
              <Button>Add Product</Button>
            </Link>
          }
        />
      ) : (
        <Table>
          <Thead>
            <Th>Image</Th>
            <Th>Name</Th>
            <Th>Category</Th>
            <Th>Price</Th>
            <Th>Stock</Th>
            <Th>Status</Th>
            <Th>Featured</Th>
            <Th></Th>
          </Thead>
          <tbody>
            {products.map((p) => (
              <Tr key={p.id}>
                <Td>
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-brand-pink-light dark:bg-white/5">
                    {p.images[0] && (
                      <img src={p.images[0].url} alt="" className="w-full h-full object-cover" />
                    )}
                  </div>
                </Td>
                <Td className="font-medium max-w-[200px] truncate">{p.name}</Td>
                <Td className="text-brand-black/50 dark:text-white/50">{p.category.name}</Td>
                <Td>{formatCurrency(p.price)}</Td>
                <Td>
                  <div className="flex items-center gap-2">
                    <button onClick={() => quickStockUpdate(p, -1)} className="w-6 h-6 rounded-full border border-black/10 dark:border-white/10 text-xs">−</button>
                    <span className="w-8 text-center">{p.stockQuantity}</span>
                    <button onClick={() => quickStockUpdate(p, 1)} className="w-6 h-6 rounded-full border border-black/10 dark:border-white/10 text-xs">+</button>
                  </div>
                </Td>
                <Td>
                  <button onClick={() => toggleAvailability(p)}>
                    <Badge variant={p.isAvailable ? "pink" : "muted"}>
                      {p.isAvailable ? "Available" : "Unavailable"}
                    </Badge>
                  </button>
                </Td>
                <Td>{p.isFeatured ? "★" : "—"}</Td>
                <Td>
                  <div className="flex gap-3 justify-end">
                    <Link to={`/admin/products/${p.id}/edit`} className="text-brand-pink-dark text-sm font-medium">
                      Edit
                    </Link>
                    <button onClick={() => setDeleteTarget(p)} className="text-red-600 text-sm font-medium">
                      Delete
                    </button>
                  </div>
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete this product?"
        description={`"${deleteTarget?.name}" will be permanently removed.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  );
}
