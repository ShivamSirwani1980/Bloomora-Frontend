import { motion } from 'framer-motion';
import { Download, TrendingUp, Flower2, Users, Truck } from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { toast } from 'sonner';

const revenueData = [
  { month: 'Sep', revenue: 320000 }, { month: 'Oct', revenue: 410000 }, { month: 'Nov', revenue: 520000 },
  { month: 'Dec', revenue: 680000 }, { month: 'Jan', revenue: 450000 }, { month: 'Feb', revenue: 580000 },
];

const bestSelling = [
  { name: 'Red Roses', value: 456 }, { name: 'Orchid Collection', value: 312 },
  { name: 'Peony Paradise', value: 289 }, { name: 'Sunflower Bouquet', value: 267 },
  { name: 'Custom Bouquets', value: 198 },
];

const COLORS = ['hsl(345, 65%, 65%)', 'hsl(280, 40%, 75%)', 'hsl(42, 85%, 55%)', 'hsl(140, 25%, 75%)', 'hsl(15, 70%, 70%)'];

const userGrowth = [
  { month: 'Sep', users: 1200 }, { month: 'Oct', users: 1580 }, { month: 'Nov', users: 2100 },
  { month: 'Dec', users: 2650 }, { month: 'Jan', users: 2980 }, { month: 'Feb', users: 3420 },
];

const deliveryStats = [
  { type: 'Express (On-time)', value: 92 },
  { type: 'Express (Delayed)', value: 8 },
  { type: 'Standard (On-time)', value: 88 },
  { type: 'Standard (Delayed)', value: 12 },
];

export default function AdminReports() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">Reports & Analytics</h1>
            <p className="text-sm text-muted-foreground">Comprehensive business insights</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => toast.success('Report exported')}>
            <Download className="w-4 h-4" /> Export Report
          </Button>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Revenue */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-2xl p-6 border border-border/50 shadow-soft">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h2 className="font-semibold text-foreground">Revenue (Last 6 Months)</h2>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(340 20% 90%)" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(340 10% 45%)" />
                  <YAxis tick={{ fontSize: 12 }} stroke="hsl(340 10% 45%)" tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(v: number) => `₹${v.toLocaleString()}`} contentStyle={{ borderRadius: '12px', border: '1px solid hsl(340 20% 90%)' }} />
                  <Bar dataKey="revenue" fill="hsl(345, 65%, 65%)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Best Selling */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card rounded-2xl p-6 border border-border/50 shadow-soft">
            <div className="flex items-center gap-2 mb-4">
              <Flower2 className="w-5 h-5 text-primary" />
              <h2 className="font-semibold text-foreground">Best Selling Products</h2>
            </div>
            <div className="h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={bestSelling} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                    {bestSelling.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid hsl(340 20% 90%)' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* User Growth */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card rounded-2xl p-6 border border-border/50 shadow-soft">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-primary" />
              <h2 className="font-semibold text-foreground">User Growth</h2>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={userGrowth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(340 20% 90%)" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(340 10% 45%)" />
                  <YAxis tick={{ fontSize: 12 }} stroke="hsl(340 10% 45%)" />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid hsl(340 20% 90%)' }} />
                  <Line type="monotone" dataKey="users" stroke="hsl(280, 40%, 75%)" strokeWidth={2} dot={{ fill: 'hsl(280, 40%, 75%)' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Delivery Performance */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-card rounded-2xl p-6 border border-border/50 shadow-soft">
            <div className="flex items-center gap-2 mb-4">
              <Truck className="w-5 h-5 text-primary" />
              <h2 className="font-semibold text-foreground">Delivery Performance</h2>
            </div>
            <div className="space-y-4 mt-6">
              {deliveryStats.map((stat) => (
                <div key={stat.type}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">{stat.type}</span>
                    <span className="font-medium text-foreground">{stat.value}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className={`rounded-full h-2 transition-all ${stat.type.includes('Delayed') ? 'bg-destructive' : 'bg-primary'}`}
                      style={{ width: `${stat.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </AdminLayout>
  );
}
