import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, ShoppingCart, Users, Package, Truck, TrendingUp, Plus, Tag, AlertTriangle, Loader2 } from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useStore } from '@/lib/store';
import { API_BASE_URL } from '@/lib/api';

interface DashboardData {
  stats: any[];
  salesData: any[];
  recentOrders: any[];
  lowStockAlerts: any[];
}


const statIcons: Record<string, any> = {
  orders: ShoppingCart,
  revenue: DollarSign,
  users: Users,
  products: Package,
  today: TrendingUp,
  pending: Truck,
};

const statColors: Record<string, string> = {
  orders: 'bg-primary/10 text-primary',
  revenue: 'bg-accent/10 text-accent',
  users: 'bg-lavender/20 text-lavender-dark',
  products: 'bg-sage/10 text-sage-dark',
  today: 'bg-primary/10 text-primary',
  pending: 'bg-destructive/10 text-destructive',
};

const statusColors: Record<string, string> = {
  Delivered: 'bg-green-100 text-green-800',
  Shipped: 'bg-blue-100 text-blue-800',
  Packed: 'bg-amber-100 text-amber-800',
  Pending: 'bg-muted text-muted-foreground',
  Confirmed: 'bg-lavender-light text-lavender-dark',
};

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData | null>(null);
  const { settings } = useStore();

  const fetchDashboardData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/main/Bloomora/Admin/Dashboard/`);
      const result = await response.json();
      if (result.data) {
        setData(result.data);
      }
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    // Refresh every 2 minutes
    const interval = setInterval(fetchDashboardData, 120000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6 pb-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground text-sm">Welcome back, Admin. Here's your store overview.</p>
          </div>
          <div className="flex gap-2">
            <Link to="/admin/products">
              <Button variant="outline" size="sm"><Plus className="w-4 h-4 mr-2" /> Add Product</Button>
            </Link>
            <Link to="/admin/offers">
              <Button variant="soft" size="sm"><Tag className="w-4 h-4 mr-2" /> Add Offer</Button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {data?.stats.map((stat, i) => {
            const Icon = statIcons[stat.type] || ShoppingCart;
            const colorClass = statColors[stat.type] || 'bg-primary/10 text-primary';
            
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-card rounded-2xl p-4 border border-border/50 shadow-soft"
              >
                <div className={`w-9 h-9 rounded-xl ${colorClass} flex items-center justify-center mb-3`}>
                  <Icon className="w-4 h-4" />
                </div>
                <p className="text-xl md:text-2xl font-bold text-foreground truncate">{stat.value}</p>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs text-muted-foreground truncate">{stat.label}</p>
                  <span className="text-[10px] font-medium text-green-600 bg-green-50 px-1.5 py-0.5 rounded-md">{stat.change}</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 bg-card rounded-2xl p-6 border border-border/50 shadow-soft"
          >
            <h2 className="font-semibold text-foreground mb-4">Sales Overview (This Week)</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data?.salesData || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      borderRadius: '12px',
                      border: '1px solid hsl(var(--border))',
                      boxShadow: 'var(--shadow-soft)',
                    }}
                  />
                  <Bar dataKey="sales" fill="hsl(var(--rose))" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Low Stock Alerts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card rounded-2xl p-6 border border-border/50 shadow-soft"
          >
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <h2 className="font-semibold text-foreground">Low Stock Alerts</h2>
            </div>
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
              {data?.lowStockAlerts.length ? (
                data.lowStockAlerts.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-amber-50/50 border border-amber-100 hover:bg-amber-50 transition-colors">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                      <p className="text-[10px] text-muted-foreground">Threshold: {item.threshold}</p>
                    </div>
                    <span className="text-lg font-bold text-amber-600 ml-2">{item.stock}</span>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Package className="w-8 h-8 text-muted/30 mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">Stock levels are healthy!</p>
                </div>
              )}
            </div>
            <Link to="/admin/inventory">
              <Button variant="ghost" size="sm" className="w-full mt-4 text-xs">View Full Inventory</Button>
            </Link>
          </motion.div>
        </div>

        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card rounded-2xl p-6 border border-border/50 shadow-soft"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-foreground">Recent Orders</h2>
            <Link to="/admin/orders">
              <Button variant="ghost" size="sm">View All</Button>
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Order ID</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Customer</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Total</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Delivery</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {data?.recentOrders.length ? (
                  data.recentOrders.map((order) => (
                    <tr key={order.id} className="border-b border-border/30 hover:bg-muted/30 transition-colors group">
                      <td className="py-3 px-4 font-medium text-foreground group-hover:text-primary transition-colors">
                        {order.display_id || order.id}
                      </td>
                      <td className="py-3 px-4 text-foreground">{order.customer}</td>
                      <td className="py-3 px-4 font-semibold text-foreground">{order.total}</td>
                      <td className="py-3 px-4">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${order.type === 'Express' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                          {order.type}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-medium ${statusColors[order.status] || 'bg-muted text-muted-foreground'}`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-muted-foreground">No recent orders found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  );
}
