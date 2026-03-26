import { motion } from 'framer-motion';
import { Download, TrendingUp, Flower2, Users, Truck } from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { toast } from 'sonner';

import { useState, useEffect } from 'react';

const getApiBase = () => {
  const envUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
  return envUrl.replace(/\/$/, '');
};

const API_BASE_URL = getApiBase();

const COLORS = ['hsl(345, 65%, 65%)', 'hsl(280, 40%, 75%)', 'hsl(42, 85%, 55%)', 'hsl(140, 25%, 75%)', 'hsl(15, 70%, 70%)'];

export default function AdminReports() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/main/Bloomora/Admin/Reports/All/`);
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP ${response.status}: ${errorText.substring(0, 100)}`);
        }
        const result = await response.json();
        if (result.data) {
          setData(result.data);
        }
      } catch (error) {
        console.error('Analytics Fetch Error:', error);
        toast.error('Failed to load real-time analytics');
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-muted-foreground animate-pulse">Aggregating business insights...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  // Fallback to static structure if data fetch fails, but use live data if available
  const revenueData = data?.revenueData || [];
  const bestSelling = data?.bestSelling || [];
  const userGrowth = data?.userGrowth || [];
  const deliveryStats = data?.deliveryStats || [];

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
