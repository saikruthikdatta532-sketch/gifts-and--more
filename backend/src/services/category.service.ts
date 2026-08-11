import { prisma } from "../utils/prisma";
import { slugify, generateUniqueSlug } from "../utils/slugify";
import { AppError } from "../middleware/errorHandler";
import { CreateCategoryInput, UpdateCategoryInput } from "../schemas/category.schema";

export async function listCategories() {
  return prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { products: true } } },
  });
}

export async function createCategory(input: CreateCategoryInput) {
  const slug = await generateUniqueSlug(input.name, async (s) => {
    const existing = await prisma.category.findUnique({ where: { slug: s } });
    return !!existing;
  });

  return prisma.category.create({
    data: {
      name: input.name,
      slug,
      description: input.description ?? null,
    },
  });
}

export async function updateCategory(id: string, input: UpdateCategoryInput) {
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) throw new AppError("Category not found", 404);

  let slug = category.slug;
  if (input.name && input.name !== category.name) {
    slug = await generateUniqueSlug(input.name, async (s) => {
      if (s === category.slug) return false;
      const existing = await prisma.category.findUnique({ where: { slug: s } });
      return !!existing;
    });
  }

  return prisma.category.update({
    where: { id },
    data: {
      name: input.name ?? category.name,
      slug,
      description: input.description !== undefined ? input.description : category.description,
    },
  });
}

export async function deleteCategory(id: string) {
  const category = await prisma.category.findUnique({
    where: { id },
    include: { _count: { select: { products: true } } },
  });

  if (!category) throw new AppError("Category not found", 404);

  if (category._count.products > 0) {
    throw new AppError(
      "Cannot delete a category with products assigned. Reassign products first.",
      400
    );
  }

  return prisma.category.delete({ where: { id } });
}

// Helper for slugify import used by generateUniqueSlug's default param typing
export { slugify };
