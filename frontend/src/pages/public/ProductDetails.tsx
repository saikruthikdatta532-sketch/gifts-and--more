import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { productService } from "@/services/productService";
import { Product } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { WhatsAppButton } from "@/components/whatsapp/WhatsAppButton";
import { BulkEnquiryButton } from "@/components/whatsapp/BulkEnquiryButton";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatCurrency } from "@/utils/formatCurrency";

export function ProductDetails() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError(false);
    productService
      .getBySlug(slug)
      .then((p) => {
        setProduct(p);
        setActiveImage(0);
        setQuantity(p.minimumBulkQuantity ?? 1);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-12 grid md:grid-cols-2 gap-10">
        <Skeleton className="aspect-square w-full" />
        <div className="space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-3xl mx-auto px-5 py-24 text-center">
        <h1 className="font-display text-2xl mb-3">Product not found</h1>
        <p className="text-brand-black/60 dark:text-white/60 mb-6">
          This gift may have been removed or is no longer available.
        </p>
        <Link to="/products" className="text-brand-pink-dark font-medium">
          ← Back to all products
        </Link>
      </div>
    );
  }

  const image = product.images[activeImage] ?? product.images[0];

  return (
    <div className="max-w-6xl mx-auto px-5 sm:px-8 py-12 pb-28 md:pb-12">
      <div className="grid md:grid-cols-2 gap-10">
        {/* Gallery */}
        <div>
          <div className="aspect-square rounded-2xl overflow-hidden bg-brand-pink-light dark:bg-white/5 mb-4">
            {image ? (
              <img src={image.url} alt={image.altText ?? product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-brand-black/20">No image</div>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-3">
              {product.images.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => setActiveImage(i)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                    i === activeImage ? "border-brand-pink-dark" : "border-transparent"
                  }`}
                >
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <Badge variant="muted" className="mb-3">{product.category.name}</Badge>
          <h1 className="font-display text-3xl mb-3">{product.name}</h1>
          <p className="text-2xl font-semibold mb-4">{formatCurrency(product.price)}</p>

          <div className="flex flex-wrap gap-2 mb-5">
            {product.isAvailable ? (
              <Badge variant="pink">In Stock</Badge>
            ) : (
              <Badge variant="muted">Out of Stock</Badge>
            )}
            {product.customizationAvailable && <Badge variant="outline">Customizable</Badge>}
            {product.eventType && <Badge variant="outline">{product.eventType}</Badge>}
          </div>

          <p className="text-brand-black/65 dark:text-white/65 leading-relaxed mb-6">
            {product.description}
          </p>

          {product.minimumBulkQuantity && (
            <p className="text-sm text-brand-black/60 dark:text-white/60 mb-6">
              Minimum bulk quantity: <span className="font-medium">{product.minimumBulkQuantity} pieces</span>
            </p>
          )}

          {/* Quantity selector */}
          <div className="flex items-center gap-3 mb-6">
            <span className="text-sm font-medium">Quantity</span>
            <div className="flex items-center border border-black/10 dark:border-white/10 rounded-full">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-9 h-9 flex items-center justify-center text-lg"
              >
                −
              </button>
              <span className="w-10 text-center text-sm">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="w-9 h-9 flex items-center justify-center text-lg"
              >
                +
              </button>
            </div>
          </div>

          {/* Desktop CTAs */}
          <div className="hidden md:flex flex-col gap-3 max-w-sm">
            {product.isAvailable && <WhatsAppButton product={product} quantity={quantity} fullWidth />}
            <BulkEnquiryButton product={product} quantity={quantity} fullWidth />
          </div>
        </div>
      </div>

      {/* Sticky mobile CTA (section 28) */}
      <div className="fixed md:hidden bottom-0 left-0 right-0 bg-white dark:bg-surface-dark border-t border-black/5 dark:border-white/10 p-4 flex gap-3 z-30">
        {product.isAvailable && <WhatsAppButton product={product} quantity={quantity} fullWidth />}
        <BulkEnquiryButton product={product} quantity={quantity} fullWidth />
      </div>
    </div>
  );
}
