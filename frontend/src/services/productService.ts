import { api } from "./api";
import { Product, Paginated } from "@/types";

export interface ProductFilters {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  available?: boolean;
  eventType?: string;
  sort?: "newest" | "price_asc" | "price_desc" | "popular";
  page?: number;
  limit?: number;
}

export const productService = {
  async list(filters: ProductFilters = {}): Promise<Paginated<Product>> {
    const { data } = await api.get<Paginated<Product>>("/products", { params: filters });
    return data;
  },

  async getBySlug(slug: string): Promise<Product> {
    const { data } = await api.get<{ product: Product }>(`/products/${slug}`);
    return data.product;
  },

  async create(payload: Partial<Product>) {
    const { data } = await api.post<{ product: Product }>("/products", payload);
    return data.product;
  },

  async update(id: string, payload: Partial<Product>) {
    const { data } = await api.put<{ product: Product }>(`/products/${id}`, payload);
    return data.product;
  },

  async updateStock(id: string, stockQuantity: number) {
    const { data } = await api.patch<{ product: Product }>(`/products/${id}/stock`, {
      stockQuantity,
    });
    return data.product;
  },

  async remove(id: string) {
    await api.delete(`/products/${id}`);
  },
};
