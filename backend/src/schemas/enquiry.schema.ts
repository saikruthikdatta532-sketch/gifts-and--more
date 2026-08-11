import { z } from "zod";

const enquiryStatusEnum = z.enum(["NEW", "CONTACTED", "CONFIRMED", "COMPLETED", "CANCELLED"]);

export const createEnquirySchema = z.object({
  customerName: z.string().min(2).max(150),
  customerPhone: z.string().min(7).max(20),
  productId: z.string().optional().nullable(),
  quantity: z.number().int().positive().optional().nullable(),
  eventType: z.string().max(100).optional().nullable(),
  expectedValue: z.number().positive().optional().nullable(),
  notes: z.string().max(1000).optional().nullable(),
});

export const updateEnquirySchema = z.object({
  customerName: z.string().min(2).max(150).optional(),
  customerPhone: z.string().min(7).max(20).optional(),
  productId: z.string().optional().nullable(),
  quantity: z.number().int().positive().optional().nullable(),
  eventType: z.string().max(100).optional().nullable(),
  expectedValue: z.number().positive().optional().nullable(),
  status: enquiryStatusEnum.optional(),
  notes: z.string().max(1000).optional().nullable(),
});

export const enquiryQuerySchema = z.object({
  status: enquiryStatusEnum.optional(),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(20),
});

export type CreateEnquiryInput = z.infer<typeof createEnquirySchema>;
export type UpdateEnquiryInput = z.infer<typeof updateEnquirySchema>;
export type EnquiryQueryInput = z.infer<typeof enquiryQuerySchema>;
