import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, ToggleLeft, ToggleRight, Loader2 } from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import axios from 'axios';
import { CouponModal } from '@/components/admin/CouponModal';

interface Coupon {
  id: string;
  code: string;
  discount: string | number;
  description: string;
  min_order: number;
  valid_till: string;
  usage_limit: number;
  used: number;
  active: boolean;
}

export default function AdminOffers() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://127.0.0.1:8000/api/v1/main/Bloomora/GetAllOffer/');
      if (response.data.status === 200) {
        setCoupons(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching coupons:', error);
      toast.error('Failed to load coupons');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const toggleActive = async (id: string) => {
    try {
      const response = await axios.post(`http://127.0.0.1:8000/api/v1/main/Bloomora/ToggleOffer/${id}/`);
      if (response.data.status === 200) {
        setCoupons((prev) => prev.map((c) => c.id === id ? { ...c, active: response.data.active } : c));
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const deleteCoupon = async (id: string) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return;
    try {
      const response = await axios.delete(`http://127.0.0.1:8000/api/v1/main/Bloomora/DeleteOffer/${id}/`);
      if (response.data.status === 200) {
        setCoupons((prev) => prev.filter((c) => c.id !== id));
        toast.success('Coupon deleted');
      }
    } catch (error) {
      toast.error('Failed to delete coupon');
    }
  };

  const handleEdit = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedCoupon(null);
    setIsModalOpen(true);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">Offers & Coupons</h1>
            <p className="text-sm text-muted-foreground">{coupons.length} coupons configured</p>
          </div>
          <Button variant="default" size="sm" onClick={handleCreate}>
            <Plus className="w-4 h-4" /> Create Coupon
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
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
                  <button onClick={() => toggleActive(coupon.id)} className="text-muted-foreground hover:text-foreground transition-colors">
                    {coupon.active ? <ToggleRight className="w-6 h-6 text-green-600" /> : <ToggleLeft className="w-6 h-6" />}
                  </button>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Discount</span>
                    <span className="font-semibold text-foreground">
                      {typeof coupon.discount === 'number' ? `${coupon.discount}%` : coupon.discount}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Expiry</span>
                    <span className="text-foreground">{coupon.valid_till}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Usage</span>
                    <span className="text-foreground">{coupon.used}/{coupon.usage_limit}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1.5 mt-2 overflow-hidden">
                    <div
                      className="bg-primary rounded-full h-1.5 transition-all duration-500"
                      style={{ width: `${Math.min((coupon.used / coupon.usage_limit) * 100, 100)}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1 line-clamp-1">{coupon.description}</p>
                </div>
                <div className="flex justify-end gap-1 mt-4">
                  <button onClick={() => handleEdit(coupon)} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => deleteCoupon(coupon.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <CouponModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchCoupons} 
        coupon={selectedCoupon} 
      />
    </AdminLayout>
  );
}
