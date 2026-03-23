import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const initialCoupons = [
  { id: '1', code: 'BLOOM10', discount: 10, expiry: '2026-12-31', usageLimit: 500, used: 234, active: true },
  { id: '2', code: 'FIRSTORDER', discount: 15, expiry: '2026-12-31', usageLimit: 1000, used: 567, active: true },
  { id: '3', code: 'EXOTIC20', discount: 20, expiry: '2026-06-30', usageLimit: 200, used: 145, active: true },
  { id: '4', code: 'LOVE25', discount: 25, expiry: '2026-02-14', usageLimit: 100, used: 89, active: false },
  { id: '5', code: 'SPRING30', discount: 30, expiry: '2026-04-30', usageLimit: 150, used: 12, active: true },
];

export default function AdminOffers() {
  const [coupons, setCoupons] = useState(initialCoupons);

  const toggleActive = (id: string) => {
    setCoupons((prev) => prev.map((c) => c.id === id ? { ...c, active: !c.active } : c));
    toast.success('Coupon status updated');
  };

  const deleteCoupon = (id: string) => {
    setCoupons((prev) => prev.filter((c) => c.id !== id));
    toast.success('Coupon deleted');
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">Offers & Coupons</h1>
            <p className="text-sm text-muted-foreground">{coupons.length} coupons configured</p>
          </div>
          <Button variant="default" size="sm"><Plus className="w-4 h-4" /> Create Coupon</Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {coupons.map((coupon, i) => (
            <motion.div
              key={coupon.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`bg-card rounded-2xl p-5 border shadow-soft ${coupon.active ? 'border-primary/30' : 'border-border/50 opacity-60'}`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-mono font-bold text-primary">{coupon.code}</span>
                <button onClick={() => toggleActive(coupon.id)} className="text-muted-foreground hover:text-foreground">
                  {coupon.active ? <ToggleRight className="w-6 h-6 text-green-600" /> : <ToggleLeft className="w-6 h-6" />}
                </button>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Discount</span>
                  <span className="font-semibold text-foreground">{coupon.discount}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Expiry</span>
                  <span className="text-foreground">{coupon.expiry}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Usage</span>
                  <span className="text-foreground">{coupon.used}/{coupon.usageLimit}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-1.5 mt-2">
                  <div
                    className="bg-primary rounded-full h-1.5 transition-all"
                    style={{ width: `${(coupon.used / coupon.usageLimit) * 100}%` }}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-1 mt-4">
                <button className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                  <Edit className="w-4 h-4" />
                </button>
                <button onClick={() => deleteCoupon(coupon.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
