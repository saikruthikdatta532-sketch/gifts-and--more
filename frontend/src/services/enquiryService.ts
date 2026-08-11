import { api } from "./api";
import { Enquiry, EnquiryStatus, Paginated } from "@/types";

export interface CreateEnquiryPayload {
  customerName: string;
  customerPhone: string;
  productId?: string;
  quantity?: number;
  eventType?: string;
  expectedValue?: number;
  notes?: string;
}

export const enquiryService = {
  async list(status?: EnquiryStatus, page = 1, limit = 20): Promise<Paginated<Enquiry>> {
    const { data } = await api.get<Paginated<Enquiry>>("/enquiries", {
      params: { status, page, limit },
    });
    return data;
  },

  async create(payload: CreateEnquiryPayload) {
    const { data } = await api.post<{ enquiry: Enquiry }>("/enquiries", payload);
    return data.enquiry;
  },

  async update(id: string, payload: Partial<Enquiry>) {
    const { data } = await api.put<{ enquiry: Enquiry }>(`/enquiries/${id}`, payload);
    return data.enquiry;
  },
};
