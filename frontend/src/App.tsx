import { Routes, Route } from "react-router-dom";
import { PublicLayout } from "@/layouts/PublicLayout";
import { Home } from "@/pages/public/Home";
import { Products } from "@/pages/public/Products";
import { ProductDetails } from "@/pages/public/ProductDetails";
import { Categories } from "@/pages/public/Categories";
import { BulkOrders } from "@/pages/public/BulkOrders";
import { About } from "@/pages/public/About";
import { Contact } from "@/pages/public/Contact";
import { Login } from "@/pages/public/Login";
import { NotFound } from "@/pages/public/NotFound";

function App() {
  return (
    <Routes>
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
    </Routes>
  );
}

export default App;
