import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, ShoppingCart, AlertTriangle, Calendar, Check } from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';

const initialNotifications = [
  { id: '1', type: 'order', title: 'New Order Received', message: 'ORD-1284 from Priya Sharma - ₹2,499', time: '2 min ago', read: false, icon: ShoppingCart },
  { id: '2', type: 'stock', title: 'Low Stock Alert', message: 'Red Protea is running low (2 stems remaining)', time: '15 min ago', read: false, icon: AlertTriangle },
  { id: '3', type: 'booking', title: 'New Decoration Booking', message: 'Wedding decoration booking from Meera J. for Apr 10', time: '1 hr ago', read: false, icon: Calendar },
  { id: '4', type: 'order', title: 'Order Delivered', message: 'ORD-1280 delivered successfully', time: '3 hrs ago', read: true, icon: ShoppingCart },
  { id: '5', type: 'stock', title: 'Low Stock Alert', message: 'White Peonies below threshold (3 stems)', time: '5 hrs ago', read: true, icon: AlertTriangle },
  { id: '6', type: 'order', title: 'New Order Received', message: 'ORD-1283 from Rahul Verma - ₹1,899', time: '6 hrs ago', read: true, icon: ShoppingCart },
];

const typeColors: Record<string, string> = {
  order: 'bg-primary/10 text-primary',
  stock: 'bg-amber-100 text-amber-600',
  booking: 'bg-lavender/20 text-lavender-dark',
};

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState(initialNotifications);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  };

  const unread = notifications.filter((n) => !n.read).length;

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-3xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">Notifications</h1>
            <p className="text-sm text-muted-foreground">{unread} unread notifications</p>
          </div>
          {unread > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllRead}>
              <Check className="w-4 h-4" /> Mark All Read
            </Button>
          )}
        </div>

        <div className="space-y-3">
          {notifications.map((notif, i) => (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              onClick={() => markRead(notif.id)}
              className={`flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${
                notif.read
                  ? 'bg-card border-border/50'
                  : 'bg-primary/5 border-primary/20 shadow-soft'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${typeColors[notif.type]}`}>
                <notif.icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-foreground text-sm">{notif.title}</p>
                  {!notif.read && <span className="w-2 h-2 rounded-full bg-primary shrink-0" />}
                </div>
                <p className="text-sm text-muted-foreground mt-0.5">{notif.message}</p>
                <p className="text-xs text-muted-foreground mt-1">{notif.time}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
