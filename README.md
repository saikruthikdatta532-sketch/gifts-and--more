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
return-gifts/
├── frontend/ # React + Vite app
├── backend/ # Express API + Prisma
├── README.md
└── .gitignore

See `frontend/src` and `backend/src` for detailed structure — both follow a simple,
flat organization: `components/`, `pages/`, `services/`, `routes/`, `controllers/`, etc.

---

## 4. Local Setup

### Prerequisites
- Node.js 18+
- PostgreSQL 14+ (local or hosted, e.g. Supabase/Neon/Railway)
- A Google Cloud project with OAuth credentials

### Install dependencies
```bash
git clone <your-repo-url>
cd return-gifts
npm install --workspaces
```

---

## 5. Environment Variables

Copy each `.env.example` to `.env` and fill in real values.

**`backend/.env`**
DATABASE_URL=postgresql://user:password@localhost:5432/return_gifts
FRONTEND_URL=http://localhost:5173
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=http://localhost:4000/api/auth/google/callback
SESSION_SECRET=replace_with_a_long_random_string
WHATSAPP_PRIMARY_NUMBER=+919731556855
WHATSAPP_SUPPORT_NUMBER=+919845861526
STORAGE_PROVIDER=cloudinary
STORAGE_BUCKET=
STORAGE_ACCESS_KEY=
STORAGE_SECRET_KEY=
PORT=4000
NODE_ENV=development

**`frontend/.env`**
VITE_API_URL=http://localhost:4000
VITE_WHATSAPP_PRIMARY_NUMBER=919731556855
VITE_WHATSAPP_SUPPORT_NUMBER=919845861526

**Never commit `.env` files.** Only `.env.example` files are committed.

---

## 6. PostgreSQL Setup

Create a local database:
```bash
createdb return_gifts
```

Or use a free hosted Postgres provider (Neon, Supabase, Railway) and paste the
connection string into `DATABASE_URL`.

---

## 7. Prisma Setup

```bash
cd backend
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
```

This creates the schema and seeds placeholder categories/products (safe to delete/replace
from the admin dashboard).

---

## 8. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services → Credentials.
2. Create an **OAuth 2.0 Client ID** (Web application).
3. Add authorized redirect URIs:
   - `http://localhost:4000/api/auth/google/callback` (development)
   - `https://your-backend.onrender.com/api/auth/google/callback` (production)
4. Copy the Client ID and Secret into `backend/.env`.

---

## 9. Admin Setup

1. Sign in once through the website with the Google account you want as admin (this
   creates the user record with the default `USER` role).
2. Promote that account from the command line:
```bash
   cd backend
   npm run make-admin -- youremail@example.com
```
3. Sign out and back in — you'll now see the **Admin** section.

There is no UI or API for self-assigning the admin role — this is intentional (section 54
of the original spec) to prevent privilege escalation.

---

## 10. Frontend Development

```bash
cd frontend
npm run dev
```
Runs at `http://localhost:5173`.

---

## 11. Backend Development

```bash
cd backend
npm run dev
```
Runs at `http://localhost:4000`. Health check: `GET /health`.

---

## 12. Vercel Deployment (Frontend)

1. Import the repo into Vercel, set **Root Directory** to `frontend`.
2. Build command: `npm run build` — Output directory: `dist`.
3. Add environment variables (`VITE_API_URL`, WhatsApp numbers) in the Vercel dashboard.
4. Deploy. Note the generated domain (e.g. `https://return-gifts.vercel.app`) — you'll
   need it for the backend's `FRONTEND_URL`.

---

## 13. Render Deployment (Backend)

1. Create a new **Web Service** on Render, connect the repo.
2. Render will detect `backend/render.yaml` — or manually set **Root Directory** to `backend`.
3. Add all environment variables listed in `render.yaml` (`sync: false` ones must be
   entered manually in the Render dashboard).
4. Render runs `prisma migrate deploy` automatically on each deploy (via `startCommand`).
5. Once deployed, update:
   - `GOOGLE_CALLBACK_URL` to the Render URL + `/api/auth/google/callback`
   - `FRONTEND_URL` to your Vercel domain
   - Update the Google Cloud Console redirect URI to match.

---

## 14. CORS Configuration

The backend only allows requests from `FRONTEND_URL` (plus `localhost:5173` in
development). Update `FRONTEND_URL` on Render whenever your Vercel domain changes.

---

## 15. WhatsApp Configuration

WhatsApp numbers are fully configurable via environment variables — never hardcoded:

- `WHATSAPP_PRIMARY_NUMBER` (backend) / `VITE_WHATSAPP_PRIMARY_NUMBER` (frontend) — main enquiry number
- `WHATSAPP_SUPPORT_NUMBER` (backend) / `VITE_WHATSAPP_SUPPORT_NUMBER` (frontend) — support number

To change the business's WhatsApp number, update these values and redeploy — no code
changes required.

---

## 16. Production Checklist

- [ ] All `.env` values set in Vercel and Render (not committed to Git)
- [ ] `FRONTEND_URL` on Render matches the live Vercel domain exactly
- [ ] Google OAuth redirect URIs updated for production
- [ ] `SESSION_SECRET` is a strong random value (Render can auto-generate this)
- [ ] Initial admin promoted via `npm run make-admin`
- [ ] Seed data reviewed/replaced with real products
- [ ] Confirm no payment gateway code exists anywhere in the codebase
- [ ] Test the full flow: browse → product page → WhatsApp click → message pre-fills correctly
- [ ] Test admin: login → dashboard → add product → mark stock → record revenue

---

## 17. Troubleshooting

**CORS errors in the browser console**
→ Check `FRONTEND_URL` on the backend matches your frontend's exact origin (including
`https://`, no trailing slash).

**Google login redirects to an error page**
→ Verify `GOOGLE_CALLBACK_URL` matches exactly what's registered in Google Cloud Console.

**"Insufficient permissions" on admin routes**
→ Confirm the signed-in account has `role = ADMIN` in the database (run `make-admin` again
if needed, then sign out/in to refresh the session).

**Prisma migration fails on Render**
→ Ensure `DATABASE_URL` is reachable from Render (check your DB provider's IP allowlist,
if any) and that the connection string includes `?sslmode=require` if required by your host.

**WhatsApp link doesn't open**
→ On desktop, `wa.me` links open WhatsApp Web only if the browser allows redirect popups.
This is expected browser behavior, not an app bug.
