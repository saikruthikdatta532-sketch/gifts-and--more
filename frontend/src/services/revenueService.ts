import { api } from "./api";
import { Revenue } from "@/types";

interface RevenueSummary {
  totalConfirmedRevenue: number;
  monthlyRevenue: number;
  numberOfConfirmedOrders: number;
  averageOrderValue: number;
}

export const revenueService = {
  async list(): Promise<{ revenue: Revenue[]; summary: RevenueSummary }> {
    const { data } = await api.get<{ revenue: Revenue[]; summary: RevenueSummary }>("/revenue");
    return data;
  },

  async create(payload: { enquiryId: string; amount: number; notes?: string }) {
    const { data } = await api.post<{ revenue: Revenue }>("/revenue", payload);
    return data.revenue;
  },
};
