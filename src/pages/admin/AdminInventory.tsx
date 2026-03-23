import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Plus, Minus } from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const initialInventory = [
  { name: 'Red Roses', category: 'Roses', stock: 120, threshold: 20, unit: 'stems' },
  { name: 'Pink Roses', category: 'Roses', stock: 85, threshold: 20, unit: 'stems' },
  { name: 'White Lilies', category: 'Lilies', stock: 45, threshold: 15, unit: 'stems' },
  { name: 'Purple Orchids', category: 'Orchids', stock: 8, threshold: 10, unit: 'stems' },
  { name: 'White Peonies', category: 'Peonies', stock: 3, threshold: 15, unit: 'stems' },
  { name: 'Sunflowers', category: 'Sunflowers', stock: 60, threshold: 10, unit: 'stems' },
  { name: 'Blue Orchids', category: 'Orchids', stock: 5, threshold: 10, unit: 'stems' },
  { name: 'Red Protea', category: 'Exotic', stock: 2, threshold: 8, unit: 'stems' },
  { name: 'Tulips (Mixed)', category: 'Tulips', stock: 90, threshold: 20, unit: 'stems' },
  { name: 'Hydrangeas', category: 'Hydrangeas', stock: 25, threshold: 10, unit: 'stems' },
  { name: 'Carnations', category: 'Carnations', stock: 150, threshold: 25, unit: 'stems' },
  { name: 'Premium Satin Wrap', category: 'Wrapping', stock: 40, threshold: 10, unit: 'pcs' },
  { name: 'Gift Box', category: 'Packaging', stock: 30, threshold: 10, unit: 'pcs' },
  { name: 'Greeting Cards', category: 'Add-ons', stock: 200, threshold: 50, unit: 'pcs' },
];

export default function AdminInventory() {
  const [inventory, setInventory] = useState(initialInventory);

  const adjust = (name: string, delta: number) => {
    setInventory((prev) =>
      prev.map((item) => item.name === name ? { ...item, stock: Math.max(0, item.stock + delta) } : item)
    );
    toast.success(`${name} stock ${delta > 0 ? 'increased' : 'decreased'} by ${Math.abs(delta)}`);
  };

  const lowStock = inventory.filter((i) => i.stock <= i.threshold);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Inventory</h1>
          <p className="text-sm text-muted-foreground">{inventory.length} items tracked • {lowStock.length} low stock alerts</p>
        </div>

        {lowStock.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span className="font-semibold text-amber-800 text-sm">Low Stock Alerts</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {lowStock.map((item) => (
                <span key={item.name} className="text-xs px-3 py-1 rounded-full bg-amber-100 text-amber-800 font-medium">
                  {item.name}: {item.stock} {item.unit}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="bg-card rounded-2xl border border-border/50 shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Item</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Category</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Stock</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Threshold</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Adjust</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map((item, i) => {
                  const isLow = item.stock <= item.threshold;
                  return (
                    <motion.tr
                      key={item.name}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.02 }}
                      className={`border-b border-border/50 hover:bg-muted/20 transition-colors ${isLow ? 'bg-amber-50/50' : ''}`}
                    >
                      <td className="py-3 px-4 font-medium text-foreground">{item.name}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 rounded-full bg-muted text-xs font-medium text-muted-foreground">{item.category}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`font-bold ${isLow ? 'text-destructive' : 'text-foreground'}`}>
                          {item.stock} {item.unit}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">{item.threshold} {item.unit}</td>
                      <td className="py-3 px-4">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          isLow ? 'bg-destructive/10 text-destructive' : 'bg-green-100 text-green-800'
                        }`}>
                          {isLow ? 'Low Stock' : 'In Stock'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => adjust(item.name, -5)} className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center hover:bg-destructive/10 transition-colors">
                            <Minus className="w-3 h-3" />
                          </button>
                          <button onClick={() => adjust(item.name, 10)} className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center hover:bg-green-100 transition-colors">
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
