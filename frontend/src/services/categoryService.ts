import { api } from "./api";
import { Category } from "@/types";

export const categoryService = {
  async list(): Promise<Category[]> {
    const { data } = await api.get<{ categories: Category[] }>("/categories");
    return data.categories;
  },

  async create(payload: { name: string; description?: string }) {
    const { data } = await api.post<{ category: Category }>("/categories", payload);
    return data.category;
  },

  async update(id: string, payload: { name?: string; description?: string }) {
    const { data } = await api.put<{ category: Category }>(`/categories/${id}`, payload);
    return data.category;
  },

  async remove(id: string) {
    await api.delete(`/categories/${id}`);
  },
};
