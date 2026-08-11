import { Button } from "@/components/ui/Button";
import { Product } from "@/types";
import { generateWhatsAppLink } from "@/utils/whatsapp";

interface WhatsAppButtonProps {
  product: Product;
  quantity?: number;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

export function WhatsAppButton({
  product,
  quantity = 1,
  variant = "primary",
  size = "md",
  fullWidth = false,
}: WhatsAppButtonProps) {
  const link = generateWhatsAppLink(product, quantity);

  return (
    
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className={fullWidth ? "block w-full" : "inline-block"}
    >
      <Button variant={variant} size={size} className={fullWidth ? "w-full" : ""}>
        <ChatIcon />
        Chat on WhatsApp
      </Button>
    </a>
  );
}

function ChatIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0">
      <path
        d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.36 5.07L2 22l5.07-1.33A9.94 9.94 0 0012 22c5.52 0 10-4.48 10-10S17.52 2 12 2z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M8.5 9.5c0 3.5 2.5 6 6 6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
