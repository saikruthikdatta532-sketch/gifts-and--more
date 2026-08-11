import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const categories = [
  { name: "Wedding Return Gifts", description: "Elegant gifts for wedding guests and functions." },
  { name: "Birthday Return Gifts", description: "Fun, colorful gifts for birthday celebrations." },
  { name: "Baby Shower", description: "Gentle, thoughtful gifts for baby shower guests." },
  { name: "Housewarming", description: "Traditional gifts for housewarming ceremonies." },
  { name: "Religious Events", description: "Gifts suited for religious functions and ceremonies." },
  { name: "Corporate Gifts", description: "Professional gifting for corporate events." },
  { name: "Kids Gifts", description: "Playful return gifts for children's parties." },
  { name: "Traditional Gifts", description: "Classic, culturally rooted gift items." },
  { name: "Premium Gifts", description: "High-end, curated gifting options." },
  { name: "Budget Gifts", description: "Affordable gifts without compromising on quality." },
];

// Seed products are illustrative placeholders — real inventory should be
// entered by the admin through the dashboard.
const products = [
  {
    name: "Mini Dry Fruit Box",
    description:
      "A beautifully packaged assortment of premium dry fruits, perfect as a wholesome return gift for weddings and festive occasions.",
    price: 249,
    stockQuantity: 200,
    minimumBulkQuantity: 50,
    isFeatured: true,
    customizationAvailable: true,
    eventType: "Wedding",
    categoryName: "Wedding Return Gifts",
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Decorative Candle Set",
    description:
      "A set of hand-finished decorative candles, ideal for housewarming ceremonies and festive return gifting.",
    price: 349,
    stockQuantity: 150,
    minimumBulkQuantity: 25,
    isFeatured: true,
    customizationAvailable: false,
    eventType: "Housewarming",
    categoryName: "Housewarming",
    image: "https://images.unsplash.com/photo-1602874801007-bd36c0f7c9a5?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Traditional Return Gift Box",
    description:
      "A classic assortment box combining traditional sweets and small keepsakes, suited for religious and cultural functions.",
    price: 299,
    stockQuantity: 300,
    minimumBulkQuantity: 100,
    isFeatured: false,
    customizationAvailable: true,
    eventType: "Religious",
    categoryName: "Traditional Gifts",
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Personalized Gift Hamper",
    description:
      "A curated hamper that can be personalized with names or messages — a memorable gift for close family and friends.",
    price: 799,
    stockQuantity: 80,
    minimumBulkQuantity: 20,
    isFeatured: true,
    customizationAvailable: true,
    eventType: "Wedding",
    categoryName: "Premium Gifts",
    image: "https://images.unsplash.com/photo-1607344645866-009c320b63e0?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Mini Brass Diya Set",
    description:
      "A set of handcrafted brass diyas, a timeless and auspicious return gift for religious and festive ceremonies.",
    price: 199,
    stockQuantity: 250,
    minimumBulkQuantity: 50,
    isFeatured: false,
    customizationAvailable: false,
    eventType: "Religious",
    categoryName: "Religious Events",
    image: "https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Floral Gift Box",
    description:
      "A delicate floral-themed gift box, perfect for baby showers and naming ceremonies.",
    price: 279,
    stockQuantity: 120,
    minimumBulkQuantity: 30,
    isFeatured: false,
    customizationAvailable: true,
    eventType: "Baby Shower",
    categoryName: "Baby Shower",
    image: "https://images.unsplash.com/photo-1487530811176-3780de880c2d?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Premium Wedding Gift Box",
    description:
      "An opulent gift box featuring premium packaging and curated contents, designed to leave a lasting impression on wedding guests.",
    price: 999,
    stockQuantity: 60,
    minimumBulkQuantity: 20,
    isFeatured: true,
    customizationAvailable: true,
    eventType: "Wedding",
    categoryName: "Premium Gifts",
    image: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Kids Return Gift Pack",
    description:
      "A playful, colorful pack filled with small toys and treats — a birthday party favorite for young guests.",
    price: 149,
    stockQuantity: 400,
    minimumBulkQuantity: 50,
    isFeatured: false,
    customizationAvailable: false,
    eventType: "Birthday",
    categoryName: "Kids Gifts",
    image: "https://images.unsplash.com/photo-1543946602-781380ac9de1?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Handmade Potli Gift",
    description:
      "A traditional handmade potli (drawstring pouch) filled with small treats, a graceful gift for cultural ceremonies.",
    price: 179,
    stockQuantity: 0,
    minimumBulkQuantity: 50,
    isFeatured: false,
    customizationAvailable: true,
    eventType: "Traditional",
    categoryName: "Traditional Gifts",
    image: "https://images.unsplash.com/photo-1610030181087-540f6f5303ea?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Ceramic Gift Set",
    description:
      "An elegant ceramic gift set, practical and beautiful, suited for corporate gifting and housewarming events.",
    price: 549,
    stockQuantity: 90,
    minimumBulkQuantity: 20,
    isFeatured: false,
    customizationAvailable: false,
    eventType: "Corporate",
    categoryName: "Corporate Gifts",
    image: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?q=80&w=800&auto=format&fit=crop",
  },
];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function main() {
  console.log("🌱 Seeding database...");

  // --- Categories ---
  const categoryMap = new Map<string, string>(); // name -> id

  for (const cat of categories) {
    const slug = slugify(cat.name);
    const created = await prisma.category.upsert({
      where: { slug },
      update: {},
      create: {
        name: cat.name,
        slug,
        description: cat.description,
      },
    });
    categoryMap.set(cat.name, created.id);
  }
  console.log(`✅ Seeded ${categories.length} categories`);

  // --- Products ---
  let productCount = 0;
  for (const p of products) {
    const categoryId = categoryMap.get(p.categoryName);
    if (!categoryId) continue;

    const slug = slugify(p.name);

    const existing = await prisma.product.findUnique({ where: { slug } });
    if (existing) continue; // idempotent — skip if already seeded

    await prisma.product.create({
      data: {
        name: p.name,
        slug,
        description: p.description,
        price: p.price,
        stockQuantity: p.stockQuantity,
        minimumBulkQuantity: p.minimumBulkQuantity,
        isAvailable: p.stockQuantity > 0,
        isFeatured: p.isFeatured,
        customizationAvailable: p.customizationAvailable,
        eventType: p.eventType,
        categoryId,
        images: {
          create: [{ url: p.image, altText: p.name, sortOrder: 0 }],
        },
      },
    });
    productCount++;
  }
  console.log(`✅ Seeded ${productCount} products`);

  console.log("🌱 Seed complete. This is placeholder data — replace via the admin dashboard.");
}

main()
  .catch((err) => {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
