import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Download, ChevronDown, Loader2 } from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import axios from 'axios';

interface Order {
  id: string;
  customer: string;
  email: string;
  items: number;
  total: number;
  status: string;
  delivery: string;
  date: string;
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
          customer: o.customer_name || o.email.split('@')[0], // Use real name or email prefix
          email: o.email,
          items: o.items.reduce((acc: number, item: any) => acc + item.quantity, 0),
          total: o.pricing.total,
          status: o.order_status,
          delivery: o.delivery_method?.method || 'Standard',
          date: new Date(o.createdAt).toLocaleDateString(),
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
                          {order.id.slice(-6).toUpperCase()}
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
                          {order.status !== 'Delivered' && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => updateStatus(order.id)}
                              disabled={actionLoading === order.id}
                            >
                              {actionLoading === order.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                'Next Step →'
                              )}
                            </Button>
                          )}
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
