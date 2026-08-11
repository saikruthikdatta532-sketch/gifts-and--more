import { prisma } from "../utils/prisma";
import { AppError } from "../middleware/errorHandler";
import { CreateRevenueInput, UpdateRevenueInput } from "../schemas/revenue.schema";

export async function listRevenue() {
  return prisma.revenue.findMany({
    orderBy: { recordedAt: "desc" },
    include: {
      enquiry: {
        include: { product: { select: { id: true, name: true } } },
      },
    },
  });
}

export async function createRevenue(input: CreateRevenueInput) {
  const enquiry = await prisma.enquiry.findUnique({
    where: { id: input.enquiryId },
    include: { revenue: true },
  });

  if (!enquiry) throw new AppError("Enquiry not found", 404);
  if (enquiry.revenue) throw new AppError("Revenue already recorded for this enquiry", 400);

  // Recording revenue implies the enquiry is confirmed business.
  const [revenue] = await prisma.$transaction([
    prisma.revenue.create({
      data: {
        enquiryId: input.enquiryId,
        amount: input.amount,
        notes: input.notes ?? null,
      },
    }),
    prisma.enquiry.update({
      where: { id: input.enquiryId },
      data: { status: "CONFIRMED" },
    }),
  ]);

  return revenue;
}

export async function updateRevenue(id: string, input: UpdateRevenueInput) {
  const revenue = await prisma.revenue.findUnique({ where: { id } });
  if (!revenue) throw new AppError("Revenue record not found", 404);

  return prisma.revenue.update({
    where: { id },
    data: {
      amount: input.amount ?? revenue.amount,
      notes: input.notes !== undefined ? input.notes : revenue.notes,
    },
  });
}

export async function getRevenueSummary() {
  const records = await prisma.revenue.findMany({ select: { amount: true, recordedAt: true } });

  const totalConfirmedRevenue = records.reduce((sum, r) => sum + Number(r.amount), 0);
  const numberOfConfirmedOrders = records.length;
  const averageOrderValue = numberOfConfirmedOrders > 0 ? totalConfirmedRevenue / numberOfConfirmedOrders : 0;

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthlyRevenue = records
    .filter((r) => r.recordedAt >= startOfMonth)
    .reduce((sum, r) => sum + Number(r.amount), 0);

  return {
    totalConfirmedRevenue,
    monthlyRevenue,
    numberOfConfirmedOrders,
    averageOrderValue,
  };
}
