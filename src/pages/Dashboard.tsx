import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Package, Heart, LogOut, ChevronRight, Clock, MapPin, ShoppingBag } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000').replace(/\/$/, '');

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'delivered': return 'bg-green-100 text-green-700 border-green-200';
    case 'out for delivery': return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'packed': return 'bg-amber-100 text-amber-700 border-amber-200';
    case 'placed': return 'bg-primary/10 text-primary border-primary/20';
    default: return 'bg-muted text-muted-foreground border-border';
  }
};

export default function Dashboard() {
  const { user, isAuthenticated, setUser, clearUserSession, orders, setOrders, savedBouquets, setSavedBouquets } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user?.email) {
      const fetchSavedBouquets = async () => {
        try {
          const res = await fetch(`${API_BASE_URL}/api/v1/main/Bloomora/Dashboard/SavedBouquets/`);
          if (res.ok) {
            const data = await res.json();
            let bouquetsArray = [];

            if (Array.isArray(data)) {
              bouquetsArray = data;
            } else if (data.data && Array.isArray(data.data)) {
              bouquetsArray = data.data;
            } else if (data.bouquets && Array.isArray(data.bouquets)) {
              bouquetsArray = data.bouquets;
            }

            const validBouquets = bouquetsArray.filter((b: any) => b.email === user.email);

            const mappedUserBouquets = validBouquets.map((b: any) => {
              const safeId = String(b.id || b.bouquet_id || Date.now() + Math.random());
              let details = b.selections || b.bouquet_details || b;
              if (typeof details === 'string') {
                try { details = JSON.parse(details); } catch (e) { details = {}; }
              }

              let totalCalculated = 0;
              if (details?.flowers && Array.isArray(details.flowers)) {
                totalCalculated = details.flowers.reduce((acc: number, f: any) => {
                  return acc + (Number(f.qty || f.quantity || 1) * Number(f.price_per_stem || f.price || 0));
                }, 0);
              }

              const formatType = (t: string) => {
                if (!t) return t;
                return t.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
              };

              let rawFlowers = details?.flowers || b.flowers;
              if (typeof rawFlowers === 'string') { try { rawFlowers = JSON.parse(rawFlowers); } catch (e) { rawFlowers = []; } }
              const flowersArray = Array.isArray(rawFlowers) ? rawFlowers : [];

              return {
                ...b,
                id: safeId,
                name: b.name || `Custom Bouquet ✨`,
                totalPrice: b.total_price || b.totalPrice || totalCalculated,
                flowers: flowersArray.map((f: any) => ({
                  type: formatType(f.category || f.type),
                  color: formatType(f.color),
                  quantity: Number(f.qty || f.quantity) || 1,
                  price: Number(f.price_per_stem || f.price) || 0
                })),
                wrapStyle: details?.wrap_style || details?.wrapStyle || b.wrap_style || b.wrapStyle || "Classic White",
                addOns: details?.special_touches || details?.addOns || b.special_touches || b.addOns || [],
                message: details?.message || b.message || ""
              };
            });

            setSavedBouquets(mappedUserBouquets);
          }
        } catch (err) {
          console.error("Failed to fetch saved bouquets", err);
        }
      };

      const fetchOrders = async () => {
        try {
          const res = await fetch(`${API_BASE_URL}/api/v1/main/Bloomora/OrderHistory/?email=${encodeURIComponent(user.email)}`);
          if (res.ok) {
            const data = await res.json();

            const extractAndMap = (rawOrders: any[]) => {
              return rawOrders.map((o: any) => ({
                ...o,
                id: String(o.display_id || o.order_id || o._id || o.id || Math.random()),
                total: Number(o.pricing?.total || o.total_price || o.total || 0),
                status: o.order_status || o.status || 'Placed',
                createdAt: new Date(o.createdAt || o.created_at || Date.now()),
                address: o.delivery_address || o.address || { label: 'Default', street: '', city: '', state: '', pincode: '', isDefault: true },
                deliveryType: o.delivery_method?.method || o.delivery_type || 'standard',
                items: o.items || o.cart_items || []
              }));
            };

            if (data.status === 200 && Array.isArray(data.Order_History)) {
              setOrders(extractAndMap(data.Order_History));
            } else if (Array.isArray(data)) {
              setOrders(extractAndMap(data));
            } else if (data.data && Array.isArray(data.data)) {
              setOrders(extractAndMap(data.data));
            } else if (data.orders && Array.isArray(data.orders)) {
              setOrders(extractAndMap(data.orders));
            }
          }
        } catch (e) {
          console.error('Failed to fetch recent orders:', e);
        }
      };

      fetchSavedBouquets();
      fetchOrders();
    }
  }, [isAuthenticated, user?.email, setSavedBouquets, setOrders]);

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="pt-32 min-h-[70vh] flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
            <User className="w-10 h-10 text-primary" />
          </div>
          <h1 className="font-display text-2xl font-bold mb-4">Your Bloomora Account</h1>
          <p className="text-muted-foreground mb-8 max-w-sm">Please sign in to access your orders, saved bouquets, and personalized rewards.</p>
          <Link to="/login">
            <Button variant="hero" size="lg">Sign In</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const handleLogout = () => {
    setUser(null);
    clearUserSession();
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <Layout>
      <div className="pt-24 pb-20 min-h-screen bg-[#fcfaf9] dark:bg-background">

        <div className="container-custom mx-auto max-w-6xl">
          
          {/* PREMIUM HEADER CARD */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10 relative overflow-hidden bg-white/80 dark:bg-card/80 backdrop-blur-md border border-border/40 rounded-[2.5rem] p-6 md:p-8 shadow-sm"
          >

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
              <div className="flex items-center gap-6">
                 <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-primary flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-primary/10">
                    {user?.firstName?.[0] || user?.email?.[0]?.toUpperCase() || "B"}
                 </div>
                 <div>
                    <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-1">
                      Welcome, {user?.firstName || "Bloomora User"}!
                    </h1>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">Logged in as {user?.email}</span>
                    </div>
                 </div>
              </div>
              <div className="flex gap-3">
                 <Button variant="outline" className="rounded-xl h-10 px-5 border-border/60 bg-white/50 dark:bg-background/50 hover:bg-white dark:hover:bg-background transition-colors text-sm" onClick={handleLogout}>
                    <LogOut className="w-3.5 h-3.5 mr-2" /> Logout
                 </Button>
              </div>
            </div>
          </motion.div>

          {/* STATS TILES */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[
              { icon: ShoppingBag, label: "Total Orders", value: orders?.length || 0, color: "text-primary", bg: "bg-primary/10" },
              { icon: Heart, label: "Saved Creations", value: savedBouquets?.length || 0, color: "text-rose-500", bg: "bg-rose-50" },
              { icon: User, label: "Account Status", value: "Verified Profile", color: "text-green-500", bg: "bg-green-50" },
            ].map((stat, i) => (
               <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group relative bg-white/50 dark:bg-card/50 backdrop-blur-sm rounded-[2rem] p-7 border border-border/40 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mb-4 transition-transform group-hover:scale-110 duration-300`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <p className="text-2xl font-bold text-foreground mb-0.5">{stat.value}</p>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          <div className="space-y-12">
            
            {/* RECENT ORDERS SECTION */}
            <div className="space-y-6">
              <div className="flex items-center justify-between px-2">
                <h2 className="font-display text-2xl font-bold text-foreground flex items-center gap-3">
                  <Package className="w-6 h-6 text-primary" /> Recent Orders
                </h2>
                <Link to="/orders" className="text-sm font-semibold text-primary hover:underline flex items-center">
                  View All <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                {orders && orders.length > 0 ? (
                  orders.slice(0, 4).map((order, i) => (
                    <div key={order.id} className="block group">
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white/60 dark:bg-card/40 rounded-2xl p-5 border border-border/30 group-hover:border-primary/20 shadow-sm group-hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                              <ShoppingBag className="w-6 h-6" />
                           </div>
                           <div>
                              <p className="font-bold text-foreground mb-1">#{order.id}</p>
                              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(order.createdAt).toLocaleDateString()}</span>
                                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {order.address?.city || "Mumbai"}</span>
                              </div>
                           </div>
                        </div>
                        
                        <div className="flex items-center justify-between md:justify-end gap-6">
                           <div className="text-right">
                              <p className="text-lg font-bold text-foreground">₹{order.total}</p>
                              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{order.items?.length || 0} Items</p>
                           </div>
                           <div className="flex flex-col items-end gap-2">
                              <div className={`px-4 py-1.5 rounded-full border text-xs font-bold shadow-sm ${getStatusColor(order.status)}`}>
                                 {order.status}
                              </div>
                              <Button 
                                variant="hero" 
                                size="sm" 
                                onClick={() => navigate(`/order-tracking/${order.id}`)}
                                className="h-8 rounded-lg text-[10px] px-3 font-bold uppercase tracking-wider shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                Track Order
                              </Button>
                           </div>
                        </div>
                      </motion.div>
                    </div>
                  ))
                ) : (
                  <div className="bg-card/40 border border-dashed border-border rounded-3xl p-12 text-center">
                    <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                    <p className="text-muted-foreground mb-6">You haven't placed any orders yet.</p>
                    <Link to="/shop">
                      <Button variant="hero" className="rounded-xl">Start Shopping</Button>
                    </Link>
                  </div>
                )}
                </AnimatePresence>
              </div>
            </div>

            {/* SAVED BOUQUETS SECTION */}
            <div className="space-y-6">
               <div className="flex items-center justify-between px-2">
                <h2 className="font-display text-2xl font-bold text-foreground flex items-center gap-3">
                  <Heart className="w-6 h-6 text-rose-500" /> Saved Creations
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedBouquets && savedBouquets.length > 0 ? (
                  savedBouquets.slice(0, 6).map((b, i) => (
                    <motion.div
                      key={b.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                      onClick={() => navigate(`/custom-bouquet?id=${b.id}`)}
                      className="group bg-white/80 dark:bg-card/60 rounded-2xl p-5 border border-border/30 hover:border-rose-400 shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                         <div className="w-14 h-14 rounded-xl bg-rose-50 flex items-center justify-center text-rose-500 group-hover:scale-110 transition-transform">
                            <Heart className="w-7 h-7 fill-rose-500/10" />
                         </div>
                         <div>
                            <h3 className="font-bold text-foreground group-hover:text-rose-600 transition-colors uppercase text-xs tracking-wider">{b.name}</h3>
                            <p className="text-lg font-display font-bold text-foreground">₹{b.totalPrice}</p>
                         </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full hover:bg-rose-50 hover:text-rose-500"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/custom-bouquet?id=${b.id}`);
                        }}
                      >
                        <ChevronRight className="w-5 h-5" />
                      </Button>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full bg-card/20 border border-dashed border-border rounded-[2.5rem] p-16 text-center">
                    <Heart className="w-12 h-12 text-rose-200 mx-auto mb-4" />
                    <p className="text-muted-foreground mb-6 font-medium">Capture your bouquet recipe for later.</p>
                    <Link to="/custom-bouquet">
                      <Button variant="outline" className="rounded-xl border-rose-200 text-rose-600 hover:bg-rose-50 px-8 h-12">Create Your First Bouquet</Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
