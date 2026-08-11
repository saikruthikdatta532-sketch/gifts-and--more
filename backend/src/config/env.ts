import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.string().default("4000"),

  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  FRONTEND_URL: z.string().min(1, "FRONTEND_URL is required"),

  GOOGLE_CLIENT_ID: z.string().min(1, "GOOGLE_CLIENT_ID is required"),
  GOOGLE_CLIENT_SECRET: z.string().min(1, "GOOGLE_CLIENT_SECRET is required"),
  GOOGLE_CALLBACK_URL: z.string().min(1, "GOOGLE_CALLBACK_URL is required"),

  SESSION_SECRET: z.string().min(10, "SESSION_SECRET must be at least 10 characters"),

  WHATSAPP_PRIMARY_NUMBER: z.string().min(1, "WHATSAPP_PRIMARY_NUMBER is required"),
  WHATSAPP_SUPPORT_NUMBER: z.string().min(1, "WHATSAPP_SUPPORT_NUMBER is required"),

  STORAGE_PROVIDER: z.string().default("cloudinary"),
  STORAGE_BUCKET: z.string().optional().default(""),
  STORAGE_ACCESS_KEY: z.string().optional().default(""),
  STORAGE_SECRET_KEY: z.string().optional().default(""),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment variables:");
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = {
  ...parsed.data,
  PORT: parseInt(parsed.data.PORT, 10),
  isProduction: parsed.data.NODE_ENV === "production",
};
