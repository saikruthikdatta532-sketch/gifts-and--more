import { Prisma } from "@prisma/client";
import { prisma } from "../utils/prisma";
import { AppError } from "../middleware/errorHandler";
import { CreateEnquiryInput, UpdateEnquiryInput, EnquiryQueryInput } from "../schemas/enquiry.schema";

export async function listEnquiries(query: EnquiryQueryInput) {
  const where: Prisma.EnquiryWhereInput = {};
  if (query.status) where.status = query.status;

  const skip = (query.page - 1) * query.limit;

  const [items, total] = await Promise.all([
    prisma.enquiry.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: query.limit,
      include: {
        product: { select: { id: true, name: true, slug: true } },
        revenue: true,
      },
    }),
    prisma.enquiry.count({ where }),
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

export async function getEnquiryById(id: string) {
  const enquiry = await prisma.enquiry.findUnique({
    where: { id },
    include: { product: true, revenue: true },
  });
  if (!enquiry) throw new AppError("Enquiry not found", 404);
  return enquiry;
}

export async function createEnquiry(input: CreateEnquiryInput) {
  if (input.productId) {
    const product = await prisma.product.findUnique({ where: { id: input.productId } });
    if (!product) throw new AppError("Product not found", 400);
  }

  return prisma.enquiry.create({
    data: {
      customerName: input.customerName,
      customerPhone: input.customerPhone,
      productId: input.productId ?? null,
      quantity: input.quantity ?? null,
      eventType: input.eventType ?? null,
      expectedValue: input.expectedValue ?? null,
      notes: input.notes ?? null,
      status: "NEW",
    },
    include: { product: true },
  });
}

export async function updateEnquiry(id: string, input: UpdateEnquiryInput) {
  const enquiry = await prisma.enquiry.findUnique({ where: { id } });
  if (!enquiry) throw new AppError("Enquiry not found", 404);

  if (input.productId) {
    const product = await prisma.product.findUnique({ where: { id: input.productId } });
    if (!product) throw new AppError("Product not found", 400);
  }

  return prisma.enquiry.update({
    where: { id },
    data: {
      customerName: input.customerName ?? enquiry.customerName,
      customerPhone: input.customerPhone ?? enquiry.customerPhone,
      productId: input.productId !== undefined ? input.productId : enquiry.productId,
      quantity: input.quantity !== undefined ? input.quantity : enquiry.quantity,
      eventType: input.eventType !== undefined ? input.eventType : enquiry.eventType,
      expectedValue: input.expectedValue !== undefined ? input.expectedValue : enquiry.expectedValue,
      status: input.status ?? enquiry.status,
      notes: input.notes !== undefined ? input.notes : enquiry.notes,
    },
    include: { product: true, revenue: true },
  });
}
