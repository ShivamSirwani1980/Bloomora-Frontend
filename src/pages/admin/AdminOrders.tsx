import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Download, ChevronDown } from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const mockOrders = Array.from({ length: 20 }, (_, i) => ({
  id: `ORD-${1300 - i}`,
  customer: ['Priya Sharma', 'Rahul Verma', 'Ananya Patel', 'Vikram Singh', 'Meera Joshi'][i % 5],
  email: ['priya@mail.com', 'rahul@mail.com', 'ananya@mail.com', 'vikram@mail.com', 'meera@mail.com'][i % 5],
  items: Math.floor(Math.random() * 4) + 1,
  total: Math.floor(Math.random() * 5000) + 800,
  status: ['Pending', 'Packed', 'Out for Delivery', 'Delivered'][i % 4] as string,
  delivery: i % 3 === 0 ? 'Express' : 'Standard',
  date: new Date(2026, 1, 13 - i).toLocaleDateString(),
}));

const statuses = ['All', 'Pending', 'Packed', 'Out for Delivery', 'Delivered'];

const statusColors: Record<string, string> = {
  Pending: 'bg-muted text-muted-foreground',
  Packed: 'bg-amber-100 text-amber-800',
  'Out for Delivery': 'bg-blue-100 text-blue-800',
  Delivered: 'bg-green-100 text-green-800',
};

export default function AdminOrders() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [orders, setOrders] = useState(mockOrders);

  const filtered = orders.filter((o) => {
    const matchSearch = o.id.toLowerCase().includes(search.toLowerCase()) || o.customer.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const updateStatus = (id: string) => {
    const statusFlow = ['Pending', 'Packed', 'Out for Delivery', 'Delivered'];
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== id) return o;
        const idx = statusFlow.indexOf(o.status);
        if (idx < statusFlow.length - 1) {
          toast.success(`Order ${id} updated to ${statusFlow[idx + 1]}`);
          return { ...o, status: statusFlow[idx + 1] };
        }
        return o;
      })
    );
  };

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
            {statuses.map((s) => (
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
                {filtered.map((order, i) => (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.02 }}
                    className="border-b border-border/50 hover:bg-muted/20 transition-colors"
                  >
                    <td className="py-3 px-4 font-medium text-foreground">{order.id}</td>
                    <td className="py-3 px-4 text-foreground">{order.customer}</td>
                    <td className="py-3 px-4 text-foreground">{order.items}</td>
                    <td className="py-3 px-4 font-semibold text-foreground">₹{order.total}</td>
                    <td className="py-3 px-4">
                      <span className={`text-xs px-2 py-1 rounded-full ${order.delivery === 'Express' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                        {order.delivery}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{order.date}</td>
                    <td className="py-3 px-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColors[order.status]}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {order.status !== 'Delivered' && (
                        <Button variant="ghost" size="sm" onClick={() => updateStatus(order.id)}>
                          Next Step →
                        </Button>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
