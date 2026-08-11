import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(2).max(150),
  description: z.string().min(10).max(3000),
  price: z.number().positive("Price must be positive"),
  categoryId: z.string().min(1, "Category is required"),
  stockQuantity: z.number().int().min(0, "Stock cannot be negative").default(0),
  minimumBulkQuantity: z.number().int().positive().optional().nullable(),
  isAvailable: z.boolean().optional().default(true),
  isFeatured: z.boolean().optional().default(false),
  customizationAvailable: z.boolean().optional().default(false),
  eventType: z.string().max(100).optional().nullable(),
  metaTitle: z.string().max(160).optional().nullable(),
  metaDescription: z.string().max(300).optional().nullable(),
  images: z
    .array(
      z.object({
        url: z.string().url("Image must be a valid URL"),
        altText: z.string().max(150).optional(),
        sortOrder: z.number().int().min(0).optional().default(0),
      })
    )
    .optional()
    .default([]),
});

export const updateProductSchema = createProductSchema.partial();

export const updateStockSchema = z.object({
  stockQuantity: z.number().int().min(0, "Stock cannot be negative"),
});

export const productQuerySchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  minPrice: z.coerce.number().nonnegative().optional(),
  maxPrice: z.coerce.number().nonnegative().optional(),
  available: z
    .enum(["true", "false"])
    .optional()
    .transform((v) => (v === undefined ? undefined : v === "true")),
  eventType: z.string().optional(),
  sort: z.enum(["newest", "price_asc", "price_desc", "popular"]).optional().default("newest"),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(20),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ProductQueryInput = z.infer<typeof productQuerySchema>;
