import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { flowerTypes, addOns } from '@/lib/data';

const popularCombinations = [
  { flowers: '5x Pink Roses + 3x White Lilies', wrap: 'Premium Satin', orders: 45 },
  { flowers: '3x Purple Orchids + 2x White Peonies', wrap: 'Luxury Hat Box', orders: 38 },
  { flowers: '7x Red Roses', wrap: 'Classic Kraft Paper', orders: 67 },
  { flowers: '4x Sunflowers + 3x Tulips', wrap: 'Glass Vase', orders: 23 },
];

export default function AdminBouquets() {
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
                  <span className="font-semibold text-foreground">₹{flower.price}/stem</span>
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
                    <span className="font-semibold text-foreground">₹{addon.price}</span>
                    <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800 font-medium">Active</span>
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
