import { Link } from "react-router-dom";
import { Product } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { WhatsAppButton } from "@/components/whatsapp/WhatsAppButton";
import { formatCurrency } from "@/utils/formatCurrency";

export function ProductCard({ product }: { product: Product }) {
  const image = product.images[0];

  return (
    <Card className="overflow-hidden group" hover>
      <Link to={`/products/${product.slug}`}>
        <div className="aspect-square overflow-hidden bg-brand-pink-light dark:bg-white/5 relative">
          {image ? (
            <img
              src={image.url}
              alt={image.altText ?? product.name}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-brand-black/20 text-sm">
              No image
            </div>
          )}
          {!product.isAvailable && (
            <span className="absolute top-3 left-3 bg-brand-black/85 text-white text-xs px-3 py-1 rounded-full">
              Out of Stock
            </span>
          )}
          {product.isFeatured && product.isAvailable && (
            <span className="absolute top-3 left-3">
              <Badge variant="pink">Featured</Badge>
            </span>
          )}
        </div>
      </Link>

      <div className="p-4">
        <Badge variant="muted" className="mb-2">{product.category.name}</Badge>
        <Link to={`/products/${product.slug}`}>
          <h3 className="font-display text-base leading-snug mb-1 hover:text-brand-pink-dark transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>
        <p className="text-lg font-semibold mb-3">{formatCurrency(product.price)}</p>

        {product.isAvailable ? (
          <WhatsAppButton product={product} size="sm" fullWidth />
        ) : (
          <Link
            to={`/products/${product.slug}`}
            className="block text-center text-sm font-medium py-3 rounded-full border border-black/10 dark:border-white/10 text-brand-black/50 dark:text-white/50"
          >
            View Details
          </Link>
        )}
      </div>
    </Card>
  );
}
