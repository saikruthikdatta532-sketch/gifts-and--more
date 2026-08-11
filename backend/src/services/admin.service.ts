import { prisma } from "../utils/prisma";
import { getRevenueSummary } from "./revenue.service";

export async function getDashboardMetrics() {
  const [
    totalProducts,
    availableProducts,
    outOfStockProducts,
    totalEnquiries,
    pendingEnquiries,
    bulkEnquiries,
    revenueSummary,
    recentActivity,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({ where: { isAvailable: true } }),
    prisma.product.count({ where: { stockQuantity: 0 } }),
    prisma.enquiry.count(),
    prisma.enquiry.count({ where: { status: "NEW" } }),
    prisma.enquiry.count({ where: { quantity: { gte: 10 } } }), // simple bulk heuristic
    getRevenueSummary(),
    prisma.activityLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      include: { user: { select: { name: true, email: true } } },
    }),
  ]);

  return {
    totalProducts,
    availableProducts,
    outOfStockProducts,
    totalEnquiries,
    pendingEnquiries,
    bulkEnquiries,
    confirmedRevenue: revenueSummary.totalConfirmedRevenue,
    monthlyRevenue: revenueSummary.monthlyRevenue,
    confirmedOrders: revenueSummary.numberOfConfirmedOrders,
    averageOrderValue: revenueSummary.averageOrderValue,
    recentActivity,
  };
}

export async function getActivityLogs(page: number, limit: number) {
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    prisma.activityLog.findMany({
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: { user: { select: { name: true, email: true } } },
    }),
    prisma.activityLog.count(),
  ]);

  return {
    items,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
}
