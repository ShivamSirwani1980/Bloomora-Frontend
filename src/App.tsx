import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";

import Index from "./pages/Index";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import CustomBouquet from "./pages/CustomBouquet";
import Gifting from "./pages/Gifting";
import Decoration from "./pages/Decoration";
import Offers from "./pages/Offers";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import Contact from "./pages/Contact";
import About from "./pages/About";
import FAQs from "./pages/FAQs";
import Feedback from "./pages/Feedback";
import NotFound from "./pages/NotFound";
import LikedFlowers from "./pages/LikedFlowers";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminOffers from "./pages/admin/AdminOffers";
import AdminBouquets from "./pages/admin/AdminBouquets";
import AdminDecorations from "./pages/admin/AdminDecorations";
import AdminInventory from "./pages/admin/AdminInventory";
import AdminReports from "./pages/admin/AdminReports";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminNotifications from "./pages/admin/AdminNotifications";
import OrderTracking from "./pages/OrderTracking";
import { BirthdayExperience } from "./components/BirthdayExperience";
import { SupportModal } from "./components/SupportModal";

import '@fontsource/playfair-display/400.css';
import '@fontsource/playfair-display/500.css';
import '@fontsource/playfair-display/600.css';
import '@fontsource/playfair-display/700.css';
import { useStore } from '@/lib/store';
import { useEffect } from 'react';
import { API_BASE_URL } from '@/lib/api';

const queryClient = new QueryClient();

function AppRoutes() {
  useScrollToTop();

  const { cart, likedProducts, isAuthenticated, user } = useStore();

  useEffect(() => {
    if (isAuthenticated && user?.email) {
      fetch(`${API_BASE_URL}/api/v1/main/Bloomora/User/State/Sync/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          cart: cart,
          liked_products: likedProducts
        })
      }).catch(err => console.error("Error syncing state", err));
    }
  }, [cart, likedProducts, isAuthenticated, user]);

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/shop/:id" element={<ProductDetail />} />
      <Route path="/custom-bouquet" element={<CustomBouquet />} />
      <Route path="/gifting" element={<Gifting />} />
      <Route path="/decoration" element={<Decoration />} />
      <Route path="/offers" element={<Offers />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/about" element={<About />} />
      <Route path="/faqs" element={<FAQs />} />
      <Route path="/feedback" element={<Feedback />} />
      <Route path="*" element={<NotFound />} />
      <Route path="/liked-flowers" element={<LikedFlowers />} />
      <Route path="/order-tracking/:id" element={<OrderTracking />} />

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/products" element={<AdminProducts />} />
      <Route path="/admin/orders" element={<AdminOrders />} />
      <Route path="/admin/users" element={<AdminUsers />} />
      <Route path="/admin/bouquets" element={<AdminBouquets />} />
      <Route path="/admin/offers" element={<AdminOffers />} />
      <Route path="/admin/decorations" element={<AdminDecorations />} />
      <Route path="/admin/inventory" element={<AdminInventory />} />
      <Route path="/admin/reports" element={<AdminReports />} />
      <Route path="/admin/settings" element={<AdminSettings />} />
      <Route path="/admin/notifications" element={<AdminNotifications />} />
      <Route path="/admin/login" element={<AdminLogin />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <BirthdayExperience />
        <SupportModal />
        <AppRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
