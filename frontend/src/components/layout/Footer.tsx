import { Link } from "react-router-dom";
import { generateSupportWhatsAppLink } from "@/utils/whatsapp";

const PRIMARY_DISPLAY = "+91 97315 56855";
const SUPPORT_DISPLAY = "+91 98458 61526";

export function Footer() {
  return (
    <footer className="bg-brand-black text-white/80 mt-24">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-14 grid grid-cols-1 sm:grid-cols-3 gap-10">
        <div>
          <h3 className="font-display text-xl text-white mb-3">
            Return<span className="text-brand-pink">Gifts</span>
          </h3>
          <p className="text-sm text-white/60 max-w-xs">
            Elegant, thoughtful return gifts for weddings, celebrations and every occasion worth
            remembering.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-medium text-white mb-4 tracking-wide uppercase">
            Quick Links
          </h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/products" className="hover:text-brand-pink transition-colors">Shop</Link></li>
            <li><Link to="/bulk-orders" className="hover:text-brand-pink transition-colors">Bulk Orders</Link></li>
            <li><Link to="/about" className="hover:text-brand-pink transition-colors">About</Link></li>
            <li><Link to="/contact" className="hover:text-brand-pink transition-colors">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-medium text-white mb-4 tracking-wide uppercase">
            WhatsApp Us
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a href={generateSupportWhatsAppLink()} target="_blank" rel="noopener noreferrer" className="hover:text-brand-pink transition-colors">
                {PRIMARY_DISPLAY}
              </a>
            </li>
            <li>
              <a href={generateSupportWhatsAppLink()} target="_blank" rel="noopener noreferrer" className="hover:text-brand-pink transition-colors">
                {SUPPORT_DISPLAY}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-5 px-5 sm:px-8 text-xs text-white/40 max-w-7xl mx-auto">
        © {new Date().getFullYear()} Return Gifts. All rights reserved.
      </div>
    </footer>
  );
}
