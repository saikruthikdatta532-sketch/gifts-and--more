export type Role = "USER" | "ADMIN";

export type EnquiryStatus = "NEW" | "CONTACTED" | "CONFIRMED" | "COMPLETED" | "CANCELLED";

export interface User {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: Role;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  _count?: { products: number };
}

export interface ProductImage {
  id: string;
  url: string;
  altText: string | null;
  sortOrder: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: string; // Decimal comes over the wire as a string
  stockQuantity: number;
  minimumBulkQuantity: number | null;
  isAvailable: boolean;
  isFeatured: boolean;
  customizationAvailable: boolean;
  eventType: string | null;
  categoryId: string;
  category: Category;
  images: ProductImage[];
  metaTitle?: string | null;
  metaDescription?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Enquiry {
  id: string;
  customerName: string;
  customerPhone: string;
  productId: string | null;
  product?: Pick<Product, "id" | "name" | "slug"> | null;
  quantity: number | null;
  eventType: string | null;
  expectedValue: string | null;
  status: EnquiryStatus;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Revenue {
  id: string;
  enquiryId: string;
  amount: string;
  notes: string | null;
  recordedAt: string;
}

export interface Paginated<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface DashboardMetrics {
  totalProducts: number;
  availableProducts: number;
  outOfStockProducts: number;
  totalEnquiries: number;
  pendingEnquiries: number;
  bulkEnquiries: number;
  confirmedRevenue: number;
  monthlyRevenue: number;
  confirmedOrders: number;
  averageOrderValue: number;
  recentActivity: ActivityLog[];
}

export interface ActivityLog {
  id: string;
  userId: string;
  user: { name: string; email: string };
  action: string;
  entityType: string;
  entityId: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
}
