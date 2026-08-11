import { Button } from "@/components/ui/Button";
import { Product } from "@/types";
import { generateBulkWhatsAppLink } from "@/utils/whatsapp";

interface BulkEnquiryButtonProps {
  product: Product;
  quantity: number;
  eventType?: string;
  fullWidth?: boolean;
}

export function BulkEnquiryButton({
  product,
  quantity,
  eventType,
  fullWidth = false,
}: BulkEnquiryButtonProps) {
  const link = generateBulkWhatsAppLink(product, quantity, eventType);

  return (
    
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className={fullWidth ? "block w-full" : "inline-block"}
    >
      <Button variant="outline" className={fullWidth ? "w-full" : ""}>
        Enquire for Bulk Order
      </Button>
    </a>
  );
}
