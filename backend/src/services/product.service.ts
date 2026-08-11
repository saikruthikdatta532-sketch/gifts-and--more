import { Prisma } from "@prisma/client";
import { prisma } from "../utils/prisma";
import { generateUniqueSlug } from "../utils/slugify";
import { AppError } from "../middleware/errorHandler";
import { CreateProductInput, UpdateProductInput, ProductQueryInput } from "../schemas/product.schema";

export async function listProducts(query: ProductQueryInput) {
  const where: Prisma.ProductWhereInput = {};

  if (query.search) {
    where.OR = [
      { name: { contains: query.search, mode: "insensitive" } },
      { description: { contains: query.search, mode: "insensitive" } },
      { category: { name: { contains: query.search, mode: "insensitive" } } },
    ];
  }

  if (query.category) {
    where.category = { slug: query.category };
  }

  if (query.available !== undefined) {
    where.isAvailable = query.available;
  }

  if (query.eventType) {
    where.eventType = { equals: query.eventType, mode: "insensitive" };
  }

  if (query.minPrice !== undefined || query.maxPrice !== undefined) {
    where.price = {
      ...(query.minPrice !== undefined ? { gte: query.minPrice } : {}),
      ...(query.maxPrice !== undefined ? { lte: query.maxPrice } : {}),
    };
  }

  let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: "desc" };
  if (query.sort === "price_asc") orderBy = { price: "asc" };
  if (query.sort === "price_desc") orderBy = { price: "desc" };
  if (query.sort === "popular") orderBy = { isFeatured: "desc" };

  const skip = (query.page - 1) * query.limit;

  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip,
      take: query.limit,
      include: {
        category: true,
        images: { orderBy: { sortOrder: "asc" } },
      },
    }),
    prisma.product.count({ where }),
  ]);

  return {
    items,
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages: Math.ceil(total / query.limit),
    },
  };
}

export async function getProductBySlug(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      images: { orderBy: { sortOrder: "asc" } },
    },
  });

  if (!product) throw new AppError("Product not found", 404);
  return product;
}

export async function getProductById(id: string) {
  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: true, images: true },
  });
  if (!product) throw new AppError("Product not found", 404);
  return product;
}

export async function createProduct(input: CreateProductInput) {
  const category = await prisma.category.findUnique({ where: { id: input.categoryId } });
  if (!category) throw new AppError("Category not found", 400);

  const slug = await generateUniqueSlug(input.name, async (s) => {
    const existing = await prisma.product.findUnique({ where: { slug: s } });
    return !!existing;
  });

  return prisma.product.create({
    data: {
      name: input.name,
      slug,
      description: input.description,
      price: input.price,
      categoryId: input.categoryId,
      stockQuantity: input.stockQuantity,
      minimumBulkQuantity: input.minimumBulkQuantity ?? null,
      isAvailable: input.stockQuantity > 0 ? input.isAvailable : false,
      isFeatured: input.isFeatured,
      customizationAvailable: input.customizationAvailable,
      eventType: input.eventType ?? null,
      metaTitle: input.metaTitle ?? null,
      metaDescription: input.metaDescription ?? null,
      images: {
        create: input.images.map((img) => ({
          url: img.url,
          altText: img.altText,
          sortOrder: img.sortOrder,
        })),
      },
    },
    include: { category: true, images: true },
  });
}

export async function updateProduct(id: string, input: UpdateProductInput) {
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) throw new AppError("Product not found", 404);

  if (input.categoryId) {
    const category = await prisma.category.findUnique({ where: { id: input.categoryId } });
    if (!category) throw new AppError("Category not found", 400);
  }

  let slug = product.slug;
  if (input.name && input.name !== product.name) {
    slug = await generateUniqueSlug(input.name, async (s) => {
      if (s === product.slug) return false;
      const existing = await prisma.product.findUnique({ where: { slug: s } });
      return !!existing;
    });
  }

  // Recompute availability if stock is being changed to 0
  let isAvailable = input.isAvailable ?? product.isAvailable;
  if (input.stockQuantity !== undefined && input.stockQuantity === 0) {
    isAvailable = false;
  }

  const data: Prisma.ProductUpdateInput = {
    name: input.name ?? product.name,
    slug,
    description: input.description ?? product.description,
    price: input.price ?? product.price,
    stockQuantity: input.stockQuantity ?? product.stockQuantity,
    minimumBulkQuantity:
      input.minimumBulkQuantity !== undefined ? input.minimumBulkQuantity : product.minimumBulkQuantity,
    isAvailable,
    isFeatured: input.isFeatured ?? product.isFeatured,
    customizationAvailable: input.customizationAvailable ?? product.customizationAvailable,
    eventType: input.eventType !== undefined ? input.eventType : product.eventType,
    metaTitle: input.metaTitle !== undefined ? input.metaTitle : product.metaTitle,
    metaDescription: input.metaDescription !== undefined ? input.metaDescription : product.metaDescription,
  };

  if (input.categoryId) {
    data.category = { connect: { id: input.categoryId } };
  }

  // Replace images only if a new set was provided
  if (input.images) {
    await prisma.productImage.deleteMany({ where: { productId: id } });
    data.images = {
      create: input.images.map((img) => ({
        url: img.url,
        altText: img.altText,
        sortOrder: img.sortOrder,
      })),
    };
  }

  return prisma.product.update({
    where: { id },
    data,
    include: { category: true, images: true },
  });
}

export async function updateStock(id: string, stockQuantity: number) {
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) throw new AppError("Product not found", 404);

  return prisma.product.update({
    where: { id },
    data: {
      stockQuantity,
      // Auto out-of-stock when hitting 0 (section 43)
      isAvailable: stockQuantity === 0 ? false : product.isAvailable,
    },
  });
}

export async function deleteProduct(id: string) {
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) throw new AppError("Product not found", 404);

  return prisma.product.delete({ where: { id } });
}
