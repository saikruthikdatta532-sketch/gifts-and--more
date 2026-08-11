import { Routes, Route } from "react-router-dom";
import { PublicLayout } from "@/layouts/PublicLayout";
import { AdminLayout } from "@/layouts/AdminLayout";
import { ProtectedAdminRoute } from "@/routes/ProtectedAdminRoute";

import { Home } from "@/pages/public/Home";
import { Products } from "@/pages/public/Products";
import { ProductDetails } from "@/pages/public/ProductDetails";
import { Categories } from "@/pages/public/Categories";
import { BulkOrders } from "@/pages/public/BulkOrders";
import { About } from "@/pages/public/About";
import { Contact } from "@/pages/public/Contact";
import { Login } from "@/pages/public/Login";
import { NotFound } from "@/pages/public/NotFound";

import { Dashboard } from "@/pages/admin/Dashboard";
import { AdminProducts } from "@/pages/admin/Products";
import { ProductForm } from "@/pages/admin/ProductForm";
import { AdminCategories } from "@/pages/admin/Categories";
import { AdminEnquiries } from "@/pages/admin/Enquiries";
import { AdminRevenue } from "@/pages/admin/Revenue";
import { AdminLogs } from "@/pages/admin/Logs";

function App() {
  return (
    <Routes>
      {/* Public site */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:slug" element={<ProductDetails />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/bulk-orders" element={<BulkOrders />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Admin dashboard — protected */}
      <Route element={<ProtectedAdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/products/new" element={<ProductForm />} />
          <Route path="/admin/products/:id/edit" element={<ProductForm />} />
          <Route path="/admin/categories" element={<AdminCategories />} />
          <Route path="/admin/enquiries" element={<AdminEnquiries />} />
          <Route path="/admin/revenue" element={<AdminRevenue />} />
          <Route path="/admin/logs" element={<AdminLogs />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
