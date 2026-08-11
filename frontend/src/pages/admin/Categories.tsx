import { useEffect, useState, FormEvent } from "react";
import { categoryService } from "@/services/categoryService";
import { Category } from "@/types";
import { Button } from "@/components/ui/Button";
import { Table, Thead, Th, Td, Tr } from "@/components/ui/Table";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";

export function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  function load() {
    setLoading(true);
    categoryService.list().then(setCategories).finally(() => setLoading(false));
  }

  useEffect(load, []);

  function openCreate() {
    setEditing(null);
    setName("");
    setDescription("");
    setError("");
    setFormOpen(true);
  }

  function openEdit(cat: Category) {
    setEditing(cat);
    setName(cat.name);
    setDescription(cat.description ?? "");
    setError("");
    setFormOpen(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      if (editing) {
        await categoryService.update(editing.id, { name, description });
      } else {
        await categoryService.create({ name, description });
      }
      setFormOpen(false);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await categoryService.remove(deleteTarget.id);
      setDeleteTarget(null);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete category.");
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl">Categories</h1>
        <Button onClick={openCreate}>Add Category</Button>
      </div>

      {error && !formOpen && (
        <p className="text-sm text-red-600 mb-4">{error}</p>
      )}

      {loading ? (
        <Skeleton className="h-64" />
      ) : categories.length === 0 ? (
        <EmptyState title="No categories yet." action={<Button onClick={openCreate}>Add Category</Button>} />
      ) : (
        <Table>
          <Thead>
            <Th>Name</Th>
            <Th>Slug</Th>
            <Th>Products</Th>
            <Th></Th>
          </Thead>
          <tbody>
            {categories.map((cat) => (
              <Tr key={cat.id}>
                <Td className="font-medium">{cat.name}</Td>
                <Td className="text-brand-black/50 dark:text-white/50">{cat.slug}</Td>
                <Td>{cat._count?.products ?? 0}</Td>
                <Td>
                  <div className="flex gap-3 justify-end">
                    <button onClick={() => openEdit(cat)} className="text-brand-pink-dark text-sm font-medium">
                      Edit
                    </button>
                    <button onClick={() => setDeleteTarget(cat)} className="text-red-600 text-sm font-medium">
                      Delete
                    </button>
                  </div>
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
            <h3 className="font-display text-lg">{editing ? "Edit Category" : "Add Category"}</h3>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <input
              required
              placeholder="Category name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-transparent text-sm"
            />
            <textarea
              placeholder="Description (optional)"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-transparent text-sm resize-none"
            />
            <div className="flex gap-3 justify-end pt-2">
              <Button type="button" variant="ghost" onClick={() => setFormOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete this category?"
        description={`"${deleteTarget?.name}" will be permanently removed. This can't be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  );
}
