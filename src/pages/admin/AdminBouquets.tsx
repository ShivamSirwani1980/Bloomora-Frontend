import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Sparkles, Edit2 } from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { toast } from 'sonner';

interface FlowerType {
  name: string;
  price: number;
  colors: string[];
}

interface AddOn {
  name: string;
  price: number;
  status: string;
}

interface PopularCombo {
  flowers: string;
  wrap: string;
  orders: number;
}

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000').replace(/\/$/, '');

export default function AdminBouquets() {
  const [flowerTypes, setFlowerTypes] = useState<FlowerType[]>([]);
  const [addOns, setAddOns] = useState<AddOn[]>([]);
  const [popularCombinations, setPopularCombinations] = useState<PopularCombo[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBouquetConfig = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/v1/main/Bloomora/Admin/Bouquets/Config/`);
      if (res.data.status === 200) {
        setFlowerTypes(res.data.flowerTypes);
        setAddOns(res.data.addOns);
        setPopularCombinations(res.data.popularCombinations);
      }
    } catch (error) {
      console.error('Failed to fetch bouquet config:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBouquetConfig();
  }, []);

  const handleUpdatePrice = async (type: 'flowerTypes' | 'addOns', name: string, currentPrice: number) => {
    const newPrice = prompt(`Enter new price for ${name}:`, currentPrice.toString());
    if (newPrice === null || isNaN(Number(newPrice))) return;

    try {
      const res = await axios.patch(`${API_BASE_URL}/api/v1/main/Bloomora/Admin/Bouquets/UpdateConfig/`, {
        config_type: type,
        name: name,
        new_value: Number(newPrice),
        field: 'price'
      });
      if (res.data.status === 200) {
        toast.success(`Updated ${name} price`);
        fetchBouquetConfig();
      }
    } catch (error: any) {
      console.error('Update price error:', error.response?.data || error.message);
      toast.error('Failed to update price');
    }
  };

  const toggleAddonStatus = async (name: string, currentStatus: string) => {
    const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    try {
      const res = await axios.patch(`${API_BASE_URL}/api/v1/main/Bloomora/Admin/Bouquets/UpdateConfig/`, {
        config_type: 'addOns',
        name: name,
        new_value: newStatus,
        field: 'status'
      });
      if (res.data.status === 200) {
        toast.success(`${name} is now ${newStatus}`);
        fetchBouquetConfig();
      }
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Custom Bouquets</h1>
          <p className="text-sm text-muted-foreground">Manage bouquet options and view popular combinations</p>
        </div>

        {/* Popular Combinations */}
        <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-soft">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-primary" />
            <h2 className="font-semibold text-foreground">Most Popular Combinations</h2>
          </div>
          <div className="space-y-3">
            {popularCombinations.map((combo, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/30"
              >
                <div>
                  <p className="font-medium text-foreground text-sm">{combo.flowers}</p>
                  <p className="text-xs text-muted-foreground">Wrap: {combo.wrap}</p>
                </div>
                <span className="text-sm font-bold text-primary">{combo.orders} orders</span>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Flower Inventory */}
          <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-soft">
            <h2 className="font-semibold text-foreground mb-4">Flower Pricing</h2>
            <div className="space-y-3">
              {flowerTypes.map((flower) => (
                <div key={flower.name} className="flex items-center justify-between p-3 rounded-xl border border-border/30">
                  <div>
                    <p className="font-medium text-foreground text-sm">{flower.name}</p>
                    <p className="text-xs text-muted-foreground">{flower.colors.join(', ')}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-foreground">₹{flower.price}/stem</span>
                    <button 
                      onClick={() => handleUpdatePrice('flowerTypes', flower.name, flower.price)}
                      className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Add-ons */}
          <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-soft">
            <h2 className="font-semibold text-foreground mb-4">Add-ons Management</h2>
            <div className="space-y-3">
              {addOns.map((addon) => (
                <div key={addon.name} className="flex items-center justify-between p-3 rounded-xl border border-border/30">
                  <span className="font-medium text-foreground text-sm">{addon.name}</span>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 mr-2">
                       <span className="font-semibold text-foreground text-sm">₹{addon.price}</span>
                       <button 
                        onClick={() => handleUpdatePrice('addOns', addon.name, addon.price)}
                        className="p-1 text-muted-foreground hover:text-primary"
                       >
                         <Edit2 className="w-3 h-3" />
                       </button>
                    </div>
                    <button
                      onClick={() => toggleAddonStatus(addon.name, addon.status)}
                      className={`text-xs px-2 py-1 rounded-full font-medium transition-colors ${
                        addon.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-destructive/10 text-destructive'
                      }`}
                    >
                      {addon.status}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
