import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Package, ChevronRight, Clock, MapPin, ShoppingBag, ArrowLeft, ChevronDown } from "lucide-react";
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

export default function Orders() {
  const { user, isAuthenticated, orders, setOrders } = useStore();
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user?.email) {
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
            }
          }
        } catch (e) {
          console.error('Failed to fetch orders:', e);
        }
      };
      fetchOrders();
    }
  }, [isAuthenticated, user?.email, setOrders]);

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="pt-32 min-h-[70vh] flex flex-col items-center justify-center text-center">
          <Package className="w-16 h-16 text-muted-foreground mb-4 opacity-20" />
          <h1 className="text-2xl font-bold mb-4">Please sign in to view your orders</h1>
          <Link to="/login">
            <Button variant="hero">Sign In</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="pt-24 pb-20 min-h-screen bg-[#fcfaf9] dark:bg-background">
        <div className="container-custom mx-auto max-w-4xl">
          
          <div className="mb-10 flex items-center gap-4">
            <Link to="/dashboard">
              <Button variant="ghost" size="icon" className="rounded-full bg-white shadow-sm border border-border/40">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="font-display text-3xl font-bold text-foreground">Your Orders</h1>
              <p className="text-muted-foreground text-sm">Track and manage your Bloomora shipments</p>
            </div>
          </div>

          <div className="space-y-4">
            {orders && orders.length > 0 ? (
              orders.map((order, i) => (
                <div 
                  key={order.id}
                  className="bg-white dark:bg-card border border-border/40 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all"
                >
                  <div 
                    className="p-6 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
                    onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary">
                        <ShoppingBag className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-bold text-lg mb-1">#{order.id}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1 font-medium"><Clock className="w-3.5 h-3.5" /> {new Date(order.createdAt).toLocaleDateString()}</span>
                          <span className={`${getStatusColor(order.status)} px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider`}>
                            {order.status}
                          </span>
                          <Button 
                            variant="hero" 
                            size="sm" 
                            className="h-7 rounded-lg text-[9px] px-3 font-bold uppercase tracking-wider shadow-sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/order-tracking/${order.id}`);
                            }}
                          >
                            Track Live
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-6">
                      <div className="text-right">
                        <p className="text-xl font-bold text-foreground">₹{order.total}</p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{order.items?.length || 0} Items</p>
                      </div>
                      <div className={`transition-transform duration-300 ${expandedOrder === order.id ? 'rotate-180' : ''}`}>
                         <ChevronDown className="w-5 h-5 text-muted-foreground" />
                      </div>
                    </div>
                  </div>

                  <AnimatePresence>
                    {expandedOrder === order.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="px-6 pb-8 pt-2 border-t border-border/30 bg-muted/20">
                           <div className="grid md:grid-cols-2 gap-8 mt-4">
                              <div>
                                <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Items Ordered</h3>
                                <div className="space-y-4">
                                  {order.items.map((item: any, idx: number) => (
                                    <div key={idx} className="flex items-center gap-4 bg-white dark:bg-background p-3 rounded-2xl border border-border/40">
                                      <div className="w-14 h-14 rounded-xl bg-muted overflow-hidden">
                                        {item.image ? (
                                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        ) : (
                                          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                            <Package className="w-6 h-6" />
                                          </div>
                                        )}
                                      </div>
                                      <div className="flex-1">
                                        <p className="font-bold text-sm">{item.name || item.flower_name || "Custom Bouquet"}</p>
                                        <p className="text-xs text-muted-foreground">Qty: {item.quantity || item.qty || 1} • ₹{item.price || item.price_per_stem || 0}</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <div className="space-y-6">
                                <div>
                                  <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Delivery Address</h3>
                                  <div className="bg-white dark:bg-background p-4 rounded-2xl border border-border/40 flex items-start gap-3">
                                    <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                    <div>
                                      <p className="font-bold text-sm mb-1">{order.address?.label || 'Home'}</p>
                                      <p className="text-xs text-muted-foreground leading-relaxed">
                                        {order.address?.street}, {order.address?.city},<br />
                                        {order.address?.state} - {order.address?.pincode}
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                <div>
                                  <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Order Timeline</h3>
                                  <div className="flex items-center justify-between gap-3 text-xs">
                                     <div className="flex items-center gap-3">
                                       <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_hsl(142_70%_45%/0.4)]" />
                                       <p className="text-muted-foreground font-medium">Order Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                                     </div>
                                     <Button 
                                       variant="link" 
                                       className="h-auto p-0 text-primary font-bold uppercase text-[10px]"
                                       onClick={() => navigate(`/order-tracking/${order.id}`)}
                                     >
                                       Track Full Map <ChevronRight className="w-3 h-3 ml-1" />
                                     </Button>
                                  </div>
                                </div>
                              </div>
                           </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))
            ) : (
              <div className="bg-white border border-dashed border-border rounded-[2.5rem] p-20 text-center shadow-sm">
                <Package className="w-16 h-16 text-muted-foreground mx-auto mb-6 opacity-20" />
                <h3 className="text-xl font-bold mb-2">No orders yet</h3>
                <p className="text-muted-foreground mb-8 max-w-xs mx-auto">Explore our collection and start your first Bloomora journey today.</p>
                <Link to="/shop">
                  <Button variant="hero" size="lg" className="rounded-xl px-10">Start Shopping</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
