import { Product } from "@/types";
import { formatCurrency } from "./formatCurrency";

const PRIMARY_NUMBER = (import.meta.env.VITE_WHATSAPP_PRIMARY_NUMBER as string) || "919731556855";
const SUPPORT_NUMBER = (import.meta.env.VITE_WHATSAPP_SUPPORT_NUMBER as string) || "919845861526";

function toWhatsAppUrl(number: string, message: string): string {
  const cleanNumber = number.replace(/[^\d]/g, "");
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}

/** Standard product enquiry link */
export function generateWhatsAppLink(product: Product, quantity = 1): string {
  const url = `${window.location.origin}/products/${product.slug}`;
  const message = [
    "Hello, I am interested in this return gift:",
    "",
    `Product: ${product.name}`,
    `Price: ${formatCurrency(product.price)}`,
    `Quantity: ${quantity}`,
    "",
    "I would like to know about availability, customization and delivery.",
    "",
    `Product Link: ${url}`,
  ].join("\n");

  return toWhatsAppUrl(PRIMARY_NUMBER, message);
}

/** Bulk order enquiry link, tied to a specific product */
export function generateBulkWhatsAppLink(
  product: Product,
  quantity: number,
  eventType = "Not specified"
): string {
  const message = [
    "Hello, I am interested in placing a bulk order.",
    "",
    `Product: ${product.name}`,
    `Required Quantity: ${quantity}`,
    `Event Type: ${eventType}`,
    "",
    "Please share bulk pricing, customization options and delivery details.",
  ].join("\n");

  return toWhatsAppUrl(PRIMARY_NUMBER, message);
}

/** General bulk enquiry from the Bulk Orders page form (no specific product) */
export function generateGeneralBulkWhatsAppLink(fields: {
  name: string;
  eventType: string;
  quantity: string;
  productOrCategory: string;
  message: string;
}): string {
  const text = [
    "Hello, I would like to enquire about a bulk return gift order.",
    "",
    `Name: ${fields.name}`,
    `Event: ${fields.eventType}`,
    `Approx Quantity: ${fields.quantity}`,
    `Product/Category: ${fields.productOrCategory}`,
    `Message: ${fields.message}`,
    "",
    "Please share your bulk pricing and customization options.",
  ].join("\n");

  return toWhatsAppUrl(PRIMARY_NUMBER, text);
}

/** Customer support link (uses the secondary/support number) */
export function generateSupportWhatsAppLink(): string {
  const message = "Hello, I need help regarding return gifts.";
  return toWhatsAppUrl(SUPPORT_NUMBER, message);
}
