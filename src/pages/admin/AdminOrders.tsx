import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Download, ChevronDown, Loader2 } from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import axios from 'axios';

import { MapPin, Phone, Mail, Calendar, Package, CreditCard, X, ExternalLink } from 'lucide-react';

interface Order {
  id: string;
  display_id: string;
  customer: string;
  email: string;
  items: number;
  itemsList: any[];
  total: number;
  status: string;
  delivery: string;
  date: string;
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
  };
  payment_method: string;
}

const statusFlow = ['Placed', 'Packed', 'Out for Delivery', 'Delivered'];

const statusColors: Record<string, string> = {
  Placed: 'bg-muted text-muted-foreground',
  Packed: 'bg-amber-100 text-amber-800',
  'Out for Delivery': 'bg-blue-100 text-blue-800',
  Delivered: 'bg-green-100 text-green-800',
};

export default function AdminOrders() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filterStatuses = ['All', 'Placed', 'Packed', 'Out for Delivery', 'Delivered'];

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}api/v1/main/Bloomora/Admin/Orders/All/`);
      if (res.status === 200) {
        const formattedOrders = res.data.orders.map((o: any) => ({
          id: o.id,
          display_id: o.display_id,
          customer: o.customer_name || o.email.split('@')[0], 
          email: o.email,
          items: o.items.reduce((acc: number, item: any) => acc + item.quantity, 0),
          itemsList: o.items,
          total: o.pricing.total,
          status: o.order_status,
          delivery: o.delivery_method?.method || 'Standard',
          date: new Date(o.createdAt).toLocaleDateString(),
          address: {
            street: o.delivery_address?.street_address || 'N/A',
            city: o.delivery_address?.city || 'N/A',
            state: o.delivery_address?.state || 'N/A',
            pincode: o.delivery_address?.pincode || 'N/A',
            phone: o.delivery_address?.phone || o.customer_phone || o.phone || 'N/A',
          },
          payment_method: o.payment_method?.method || 'N/A',
        }));
        setOrders(formattedOrders);
      }
    } catch (error) {
      toast.error('Failed to fetch orders');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string) => {
    const order = orders.find((o) => o.id === id);
    if (!order) return;

    const currentIdx = statusFlow.indexOf(order.status);
    if (currentIdx === -1 || currentIdx === statusFlow.length - 1) return;

    const nextStatus = statusFlow[currentIdx + 1];
    setActionLoading(id);

    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_API_BASE_URL}api/v1/main/Bloomora/Admin/Orders/UpdateStatus/${id}/`,
        { status: nextStatus }
      );

      if (res.status === 200) {
        setOrders((prev) =>
          prev.map((o) => (o.id === id ? { ...o, status: nextStatus } : o))
        );
        toast.success(`Order ${id.slice(-6).toUpperCase()} updated to ${nextStatus}`);
      }
    } catch (error) {
      toast.error('Failed to update status');
      console.error(error);
    } finally {
      setActionLoading(null);
    }
  };

  const filtered = orders.filter((o) => {
    const matchSearch = o.id.toLowerCase().includes(search.toLowerCase()) || o.customer.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const exportCSV = () => {
    toast.success('Orders exported to CSV');
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">Orders</h1>
            <p className="text-sm text-muted-foreground">{orders.length} total orders</p>
          </div>
          <Button variant="outline" size="sm" onClick={exportCSV}>
            <Download className="w-4 h-4" /> Export CSV
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search orders..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {filterStatuses.map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  statusFilter === s ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-2xl border border-border/50 shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Order ID</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Customer</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Items</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Total</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Delivery</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Date</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className="py-20 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 className="w-8 h-8 text-primary animate-spin" />
                        <p className="text-muted-foreground">Loading orders from database...</p>
                      </div>
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-20 text-center text-muted-foreground">
                      No orders found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  <AnimatePresence mode="popLayout">
                    {filtered.map((order, i) => (
                      <motion.tr
                        key={order.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ delay: i * 0.02 }}
                        className="border-b border-border/50 hover:bg-muted/20 transition-colors"
                      >
                        <td className="py-3 px-4 font-medium text-foreground">
                          {order.display_id || order.id.slice(-6).toUpperCase()}
                        </td>
                        <td className="py-3 px-4 text-foreground capitalize">{order.customer}</td>
                        <td className="py-3 px-4 text-foreground">{order.items}</td>
                        <td className="py-3 px-4 font-semibold text-foreground">₹{order.total}</td>
                        <td className="py-3 px-4">
                          <span className={`text-xs px-2 py-1 rounded-full ${order.delivery.toLowerCase() === 'express' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                            {order.delivery}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">{order.date}</td>
                        <td className="py-3 px-4">
                          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColors[order.status] || 'bg-muted text-muted-foreground'}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="w-8 h-8 p-0 rounded-full hover:bg-primary/10 hover:text-primary transition-colors"
                              onClick={() => setSelectedOrder(order)}
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                            {order.status !== 'Delivered' && (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => updateStatus(order.id)}
                                disabled={actionLoading === order.id}
                                className="whitespace-nowrap"
                              >
                                {actionLoading === order.id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  'Next Step →'
                                )}
                              </Button>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Details Modal */}
        <AnimatePresence>
          {selectedOrder && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedOrder(null)}
                className="absolute inset-0 bg-background/80 backdrop-blur-sm"
              />
              
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-2xl bg-card border border-border shadow-elevated rounded-[2rem] overflow-hidden max-h-[90vh] flex flex-col"
              >
                {/* Header */}
                <div className="p-6 border-b border-border flex items-center justify-between bg-muted/30">
                  <div>
                    <h2 className="text-xl font-bold text-foreground">Order Details</h2>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                      ID: {selectedOrder.display_id || selectedOrder.id}
                    </p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setSelectedOrder(null)}
                    className="rounded-full h-10 w-10"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                  {/* Customer & Contact */}
                  <div className="grid sm:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <h3 className="text-sm font-bold text-foreground/70 uppercase tracking-widest flex items-center gap-2">
                        <Mail className="w-4 h-4 text-primary" /> Customer Info
                      </h3>
                      <div className="bg-stone-50 dark:bg-stone-900/50 rounded-2xl p-4 border border-border/50">
                        <p className="font-bold text-lg text-foreground capitalize">{selectedOrder.customer}</p>
                        <p className="text-sm text-muted-foreground mb-3">{selectedOrder.email}</p>
                        <div className="flex items-center gap-2 text-primary font-bold bg-primary/5 p-2 rounded-xl border border-primary/10">
                          <Phone className="w-4 h-4" />
                          <span className="text-sm">{selectedOrder.address.phone}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-sm font-bold text-foreground/70 uppercase tracking-widest flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-primary" /> Delivery Address
                      </h3>
                      <div className="bg-stone-50 dark:bg-stone-900/50 rounded-2xl p-4 border border-border/50">
                        <p className="text-sm font-medium text-foreground leading-relaxed">
                          {selectedOrder.address.street},<br />
                          {selectedOrder.address.city}, {selectedOrder.address.state}<br />
                          <span className="font-bold text-primary">{selectedOrder.address.pincode}</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-foreground/70 uppercase tracking-widest flex items-center gap-2">
                      <Package className="w-4 h-4 text-primary" /> Order Items
                    </h3>
                    <div className="bg-stone-50 dark:bg-stone-900/50 rounded-2xl border border-border/50 overflow-hidden">
                      <table className="w-full text-sm">
                        <thead className="bg-muted/50 text-muted-foreground font-bold uppercase text-[10px] tracking-widest border-b border-border/50">
                          <tr>
                            <th className="py-3 px-4 text-left">Item</th>
                            <th className="py-3 px-4 text-center">Qty</th>
                            <th className="py-3 px-4 text-right">Price</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/30">
                          {selectedOrder.itemsList.map((item, idx) => (
                            <tr key={idx} className="bg-card/30">
                              <td className="py-3 px-4 font-medium text-foreground">{item.name}</td>
                              <td className="py-3 px-4 text-center font-bold text-muted-foreground">{item.quantity}</td>
                              <td className="py-3 px-4 text-right font-bold text-foreground">₹{item.price}</td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot className="bg-primary/5">
                          <tr>
                            <td colSpan={2} className="py-4 px-4 text-right font-bold text-muted-foreground uppercase text-[10px] tracking-widest">Grand Total</td>
                            <td className="py-4 px-4 text-right font-display text-lg font-bold text-primary">₹{selectedOrder.total}</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>

                  {/* Meta Info */}
                  <div className="grid grid-cols-2 gap-4">
                     <div className="flex items-center gap-3 p-4 rounded-2xl bg-muted/30 border border-border/50">
                       <Calendar className="w-5 h-5 text-primary" />
                       <div>
                         <p className="text-[10px] uppercase font-bold text-muted-foreground">Order Date</p>
                         <p className="text-sm font-bold text-foreground">{selectedOrder.date}</p>
                       </div>
                     </div>
                     <div className="flex items-center gap-3 p-4 rounded-2xl bg-muted/30 border border-border/50">
                       <CreditCard className="w-5 h-5 text-primary" />
                       <div>
                         <p className="text-[10px] uppercase font-bold text-muted-foreground">Payment</p>
                         <p className="text-sm font-bold text-foreground">{selectedOrder.payment_method}</p>
                       </div>
                     </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-6 bg-muted/30 border-t border-border flex justify-end">
                  <Button 
                    variant="hero" 
                    onClick={() => setSelectedOrder(null)}
                    className="rounded-xl px-8"
                  >
                    Close Details
                  </Button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </AdminLayout>
  );
}
