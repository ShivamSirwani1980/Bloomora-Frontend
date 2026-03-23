import { motion } from 'framer-motion';
import { DollarSign, ShoppingCart, Users, Package, Truck, TrendingUp, Plus, Tag, AlertTriangle } from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const stats = [
  { label: 'Total Orders', value: '1,284', change: '+12%', icon: ShoppingCart, color: 'bg-primary/10 text-primary' },
  { label: 'Revenue', value: '₹8,45,200', change: '+18%', icon: DollarSign, color: 'bg-accent/10 text-accent' },
  { label: 'Active Users', value: '3,420', change: '+8%', icon: Users, color: 'bg-lavender/20 text-lavender-dark' },
  { label: 'Products', value: '156', change: '+5', icon: Package, color: 'bg-sage/30 text-foreground' },
  { label: "Today's Orders", value: '42', change: '+15%', icon: TrendingUp, color: 'bg-primary/10 text-primary' },
  { label: 'Pending Deliveries', value: '18', change: '-3', icon: Truck, color: 'bg-destructive/10 text-destructive' },
];

const salesData = [
  { day: 'Mon', sales: 4200 }, { day: 'Tue', sales: 3800 }, { day: 'Wed', sales: 5100 },
  { day: 'Thu', sales: 4600 }, { day: 'Fri', sales: 6200 }, { day: 'Sat', sales: 7800 },
  { day: 'Sun', sales: 5400 },
];

const recentOrders = [
  { id: 'ORD-1284', customer: 'Priya Sharma', total: '₹2,499', status: 'Delivered', type: 'Express' },
  { id: 'ORD-1283', customer: 'Rahul Verma', total: '₹1,899', status: 'Shipped', type: 'Standard' },
  { id: 'ORD-1282', customer: 'Ananya Patel', total: '₹3,299', status: 'Packed', type: 'Express' },
  { id: 'ORD-1281', customer: 'Vikram Singh', total: '₹999', status: 'Pending', type: 'Standard' },
  { id: 'ORD-1280', customer: 'Meera Joshi', total: '₹1,499', status: 'Delivered', type: 'Standard' },
];

const lowStockAlerts = [
  { name: 'Blue Orchids', stock: 5, threshold: 10 },
  { name: 'White Peonies', stock: 3, threshold: 15 },
  { name: 'Red Protea', stock: 2, threshold: 8 },
];

const statusColors: Record<string, string> = {
  Delivered: 'bg-green-100 text-green-800',
  Shipped: 'bg-blue-100 text-blue-800',
  Packed: 'bg-amber-100 text-amber-800',
  Pending: 'bg-muted text-muted-foreground',
};

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground text-sm">Welcome back, Admin. Here's your store overview.</p>
          </div>
          <div className="flex gap-2">
            <Link to="/admin/products">
              <Button variant="outline" size="sm"><Plus className="w-4 h-4" /> Add Product</Button>
            </Link>
            <Link to="/admin/offers">
              <Button variant="soft" size="sm"><Tag className="w-4 h-4" /> Add Offer</Button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-card rounded-2xl p-4 border border-border/50 shadow-soft"
            >
              <div className={`w-9 h-9 rounded-xl ${stat.color} flex items-center justify-center mb-3`}>
                <stat.icon className="w-4 h-4" />
              </div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <div className="flex items-center justify-between mt-1">
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <span className="text-xs font-medium text-green-600">{stat.change}</span>
              </div>
            </motion.div>
          ))}
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
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(340 20% 90%)" />
                  <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="hsl(340 10% 45%)" />
                  <YAxis tick={{ fontSize: 12 }} stroke="hsl(340 10% 45%)" />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '12px',
                      border: '1px solid hsl(340 20% 90%)',
                      boxShadow: '0 4px 20px -4px hsl(345 30% 70% / 0.2)',
                    }}
                  />
                  <Bar dataKey="sales" fill="hsl(345 65% 65%)" radius={[6, 6, 0, 0]} />
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
            <div className="space-y-4">
              {lowStockAlerts.map((item) => (
                <div key={item.name} className="flex items-center justify-between p-3 rounded-xl bg-amber-50 border border-amber-200">
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.name}</p>
                    <p className="text-xs text-muted-foreground">Threshold: {item.threshold}</p>
                  </div>
                  <span className="text-lg font-bold text-amber-600">{item.stock}</span>
                </div>
              ))}
            </div>
            <Link to="/admin/inventory">
              <Button variant="ghost" size="sm" className="w-full mt-4">View Inventory</Button>
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
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4 font-medium text-foreground">{order.id}</td>
                    <td className="py-3 px-4 text-foreground">{order.customer}</td>
                    <td className="py-3 px-4 font-semibold text-foreground">{order.total}</td>
                    <td className="py-3 px-4">
                      <span className={`text-xs px-2 py-1 rounded-full ${order.type === 'Express' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                        {order.type}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColors[order.status]}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  );
}
