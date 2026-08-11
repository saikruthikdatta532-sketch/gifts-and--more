import { z } from "zod";

export const createRevenueSchema = z.object({
  enquiryId: z.string().min(1, "Enquiry is required"),
  amount: z.number().positive("Amount must be positive"),
  notes: z.string().max(1000).optional().nullable(),
});

export const updateRevenueSchema = z.object({
  amount: z.number().positive().optional(),
  notes: z.string().max(1000).optional().nullable(),
});

export type CreateRevenueInput = z.infer<typeof createRevenueSchema>;
export type UpdateRevenueInput = z.infer<typeof updateRevenueSchema>;
