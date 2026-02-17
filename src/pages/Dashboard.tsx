import { motion } from 'framer-motion';
import { User, Package, Heart, Bell, Settings, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useStore } from '@/lib/store';

export default function Dashboard() {
  const { user, isAuthenticated, setUser, orders, savedBouquets, reminders } = useStore();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="pt-24 section-padding text-center">
          <h1 className="text-2xl font-bold mb-4">Please login to view your dashboard</h1>
          <Link to="/login"><Button variant="hero">Login</Button></Link>
        </div>
      </Layout>
    );
  }

  const handleLogout = () => {
    setUser(null);
    navigate('/');
  };

  return (
    <Layout>
      <div className="pt-24 section-padding">
        <div className="container-custom mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="font-display text-3xl font-bold text-foreground">Welcome, {user?.name}!</h1>
            <p className="text-muted-foreground">{user?.email}</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              { icon: Package, label: 'Orders', value: orders.length, color: 'text-primary' },
              { icon: Heart, label: 'Saved Bouquets', value: savedBouquets.length, color: 'text-rose-500' },
              { icon: Bell, label: 'Reminders', value: reminders.length, color: 'text-gold' },
              { icon: User, label: 'Profile', value: 'Active', color: 'text-green-500' },
            ].map((stat, i) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-card rounded-2xl p-6 border border-border">
                <stat.icon className={`w-8 h-8 ${stat.color} mb-3`} />
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-card rounded-2xl p-6 border border-border">
              <h2 className="font-semibold text-foreground mb-4">Recent Orders</h2>
              {orders.length === 0 ? (
                <p className="text-muted-foreground">No orders yet. <Link to="/shop" className="text-primary hover:underline">Start shopping</Link></p>
              ) : (
                <div className="space-y-3">{orders.slice(0, 3).map((order) => (
                  <div key={order.id} className="flex justify-between p-3 bg-muted rounded-lg">
                    <span>Order #{order.id}</span>
                    <span className="text-primary font-medium">₹{order.total}</span>
                  </div>
                ))}</div>
              )}
            </div>

            <div className="bg-card rounded-2xl p-6 border border-border">
              <h2 className="font-semibold text-foreground mb-4">Saved Bouquets</h2>
              {savedBouquets.length === 0 ? (
                <p className="text-muted-foreground">No saved bouquets. <Link to="/custom-bouquet" className="text-primary hover:underline">Create one</Link></p>
              ) : (
                <div className="space-y-3">{savedBouquets.slice(0, 3).map((b) => (
                  <div key={b.id} className="flex justify-between p-3 bg-muted rounded-lg">
                    <span>{b.name}</span>
                    <span className="text-primary font-medium">₹{b.totalPrice}</span>
                  </div>
                ))}</div>
              )}
            </div>
          </div>

          <Button variant="outline" className="mt-8" onClick={handleLogout}>
            <LogOut className="w-4 h-4" /> Logout
          </Button>
        </div>
      </div>
    </Layout>
  );
}
