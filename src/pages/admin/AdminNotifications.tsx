import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, ShoppingCart, AlertTriangle, Calendar, Check, Loader2 } from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { useStore, Notification } from '@/lib/store';
import { formatDistanceToNow, parseISO } from 'date-fns';

const typeColors: Record<string, string> = {
  order: 'bg-primary/10 text-primary',
  stock: 'bg-amber-100 text-amber-600',
  booking: 'bg-lavender/20 text-lavender-dark',
  generic: 'bg-blue-100 text-blue-600',
};

const typeIcons: Record<string, any> = {
  order: ShoppingCart,
  stock: AlertTriangle,
  booking: Calendar,
  generic: Bell,
};

export default function AdminNotifications() {
  const { 
    notifications, 
    unreadNotificationsCount, 
    fetchNotifications, 
    markNotificationRead, 
    markAllNotificationsRead 
  } = useStore();

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const formatTime = (isoString: string) => {
    try {
      return formatDistanceToNow(parseISO(isoString), { addSuffix: true });
    } catch (e) {
      return 'just now';
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-3xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">Notifications</h1>
            <p className="text-sm text-muted-foreground">{unreadNotificationsCount} unread notifications</p>
          </div>
          {unreadNotificationsCount > 0 && (
            <Button variant="ghost" size="sm" onClick={() => markAllNotificationsRead()}>
              <Check className="w-4 h-4" /> Mark All Read
            </Button>
          )}
        </div>

        <div className="space-y-3">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                <Bell className="w-8 h-8 text-muted-foreground/30" />
              </div>
              <p className="text-muted-foreground">No notifications yet</p>
            </div>
          ) : (
            notifications.map((notif, i) => {
              const Icon = typeIcons[notif.type] || Bell;
              return (
                <motion.div
                  key={notif._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  onClick={() => !notif.read && markNotificationRead(notif._id)}
                  className={`flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${
                    notif.read
                      ? 'bg-card border-border/50'
                      : 'bg-primary/5 border-primary/20 shadow-soft'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${typeColors[notif.type] || typeColors.generic}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-foreground text-sm">{notif.title}</p>
                      {!notif.read && <span className="w-2 h-2 rounded-full bg-primary shrink-0" />}
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">{notif.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{formatTime(notif.created_at)}</p>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
