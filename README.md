# Return Gifts — Premium Return Gifts & Bulk Order Enquiries

A boutique e-commerce-style website for a return gifts business. Customers browse products
and enquire via WhatsApp — there is **no online payment system**. The business owner
handles order confirmation and payment personally through WhatsApp.

---

## 1. Project Overview

- **Customers** browse return gifts, filter by category/price/event, and view product
  details — all without needing an account.
- Every product page has a **"Chat on WhatsApp"** button that opens WhatsApp with a
  pre-filled enquiry message.
- A dedicated **Bulk Orders** page handles large/event enquiries the same way.
- The **admin dashboard** (Google-authenticated, role-gated) lets the business owner manage
  products, categories, stock, enquiries, and manually record confirmed revenue once a
  WhatsApp conversation results in a sale.

---

## 2. Tech Stack

| Layer      | Technology                                      |
|------------|--------------------------------------------------|
| Frontend   | React, TypeScript, Vite, Tailwind CSS, React Router, Framer Motion |
| Backend    | Node.js, Express, TypeScript, Zod, Helmet, Passport (Google OAuth) |
| Database   | PostgreSQL + Prisma ORM                          |
| Auth       | Google OAuth 2.0, session-based, server-side RBAC |
| Frontend Hosting | Vercel                                     |
| Backend Hosting  | Render                                     |

---

## 3. Folder Structure
