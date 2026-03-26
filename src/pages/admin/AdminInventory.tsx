import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Plus, Minus, RefreshCcw } from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { API_BASE_URL } from '@/lib/api';


interface InventoryItem {
  name: string;
  category: string;
  stock: number;
  threshold: number;
  unit: string;
  type: string;
}

const mockInventory: InventoryItem[] = [
  { name: 'Red Roses', category: 'Flowers', stock: 120, threshold: 20, unit: 'stems', type: 'flowers' },
  { name: 'White Lilies', category: 'Flowers', stock: 45, threshold: 15, unit: 'stems', type: 'flowers' },
  { name: 'Sunflowers', category: 'Flowers', stock: 12, threshold: 10, unit: 'stems', type: 'flowers' },
  { name: 'Premium Satin Wrap', category: 'Wrapping', stock: 40, threshold: 10, unit: 'pcs', type: 'wrapping' },
  { name: 'Luxury Box', category: 'Wrapping', stock: 8, threshold: 5, unit: 'pcs', type: 'wrapping' },
];

export default function AdminInventory() {
  const [inventory, setInventory] = useState<{ custom: InventoryItem[], shop: InventoryItem[] }>({ custom: [], shop: [] });
  const [loading, setLoading] = useState(true);

  const fetchInventory = async () => {
    setLoading(true);
    const targetUrl = `${API_BASE_URL}/api/v1/main/Bloomora/Admin/Inventory/All/`;
    
    try {
      const res = await fetch(targetUrl);
      const contentType = res.headers.get('content-type');
      
      if (res.ok && contentType?.includes('application/json')) {
        const data = await res.json();
        // If the new structure exists, use it. Otherwise fallback.
        if (data.data && data.data.custom) {
          setInventory(data.data);
        } else {
          setInventory({ custom: data.data || mockInventory, shop: [] });
        }
      } else {
        setInventory({ custom: mockInventory, shop: [] });
      }
    } catch (err) {
      setInventory({ custom: mockInventory, shop: [] });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const adjust = async (name: string, delta: number, type: string) => {
    // Optimistic update for both lists
    setInventory((prev) => ({
      custom: prev.custom.map((item) => item.name === name ? { ...item, stock: Math.max(0, item.stock + delta) } : item),
      shop: prev.shop.map((item) => item.name === name ? { ...item, stock: Math.max(0, item.stock + delta) } : item)
    }));

    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/main/Bloomora/Admin/Inventory/Update/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, delta, type }),
      });
      
      if (!res.ok) {
        fetchInventory();
        toast.error('Failed to update stock');
      } else {
        toast.success(`${name} updated`);
      }
    } catch (err) {
      fetchInventory();
    }
  };

  const allItems = [...inventory.custom, ...inventory.shop];
  const lowStock = allItems.filter((i) => i.stock <= i.threshold);

  const renderTable = (items: InventoryItem[], title: string) => (
    <div className="space-y-4">
      <h2 className="font-display text-lg font-bold text-foreground/80 px-2 flex items-center gap-2">
        <span className="w-1.5 h-6 bg-primary rounded-full" />
        {title}
      </h2>
      <div className="bg-card rounded-2xl border border-border/50 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left py-3.5 px-6 font-semibold text-muted-foreground uppercase tracking-wider text-[10px]">Item</th>
                <th className="text-left py-3.5 px-6 font-semibold text-muted-foreground uppercase tracking-wider text-[10px]">Category</th>
                <th className="text-left py-3.5 px-6 font-semibold text-muted-foreground uppercase tracking-wider text-[10px]">Stock</th>
                <th className="text-left py-3.5 px-6 font-semibold text-muted-foreground uppercase tracking-wider text-[10px]">Threshold</th>
                <th className="text-left py-3.5 px-6 font-semibold text-muted-foreground uppercase tracking-wider text-[10px]">Status</th>
                <th className="text-right py-3.5 px-6 font-semibold text-muted-foreground uppercase tracking-wider text-[10px]">Adjust</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {items.map((item, i) => {
                const isLow = item.stock <= item.threshold;
                return (
                  <motion.tr
                    key={item.name}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.01 }}
                    className={`hover:bg-muted/10 transition-colors ${isLow ? 'bg-amber-50/20' : ''}`}
                  >
                    <td className="py-3.5 px-6 font-bold text-foreground">{item.name}</td>
                    <td className="py-3.5 px-6">
                      <span className="px-2.5 py-1 rounded-lg bg-muted text-[11px] font-bold text-muted-foreground">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-6">
                      <span className={`font-black text-sm ${isLow ? 'text-destructive animate-pulse' : 'text-foreground'}`}>
                        {item.stock} <span className="text-[10px] font-medium opacity-60 uppercase">{item.unit}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-muted-foreground font-medium">
                      {item.threshold} <span className="text-[10px] opacity-60">{item.unit}</span>
                    </td>
                    <td className="py-3.5 px-6">
                      <span className={`text-[10px] px-2.5 py-1 rounded-md font-black uppercase tracking-tighter ${
                        isLow ? 'bg-destructive/10 text-destructive border border-destructive/20' : 'bg-green-100 text-green-700'
                      }`}>
                        {isLow ? 'Low Stock' : 'In Stock'}
                      </span>
                    </td>
                    <td className="py-3.5 px-6">
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => adjust(item.name, item.unit === 'stems' ? -5 : -1, item.type)} 
                          className="h-8 w-8 rounded-xl bg-muted/50 hover:bg-destructive hover:text-white"
                        >
                          <Minus className="w-3" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => adjust(item.name, item.unit === 'stems' ? 10 : 2, item.type)} 
                          className="h-8 w-8 rounded-xl bg-muted/50 hover:bg-primary hover:text-white"
                        >
                          <Plus className="w-3" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
          {items.length === 0 && !loading && (
            <div className="p-12 text-center text-muted-foreground italic">No items found in this category.</div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">Inventory Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              {allItems.length} items tracked • {lowStock.length} low stock alerts
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={fetchInventory} className="gap-2 rounded-xl">
            <RefreshCcw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} /> Sync Data
          </Button>
        </div>

        {lowStock.length > 0 && (
          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 animate-in fade-in slide-in-from-top-2 duration-500 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span className="font-bold text-amber-800 text-sm italic">Critical Low Stock Alerts</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {lowStock.map((item) => (
                <span key={item.name} className="text-[11px] px-3 py-1 rounded-full bg-white border border-amber-200 text-amber-900 font-bold shadow-sm">
                  {item.name}: {item.stock} {item.unit}
                </span>
              ))}
            </div>
          </div>
        )}

        {loading && allItems.length === 0 ? (
          <div className="p-20 text-center animate-pulse text-muted-foreground font-medium">Establishing connection to Bloomora Warehouse...</div>
        ) : (
          <>
            {renderTable(inventory.custom, "Custom Bouquet Components")}
            {renderTable(inventory.shop, "Shop Flowers (Ready-made)")}
          </>
        )}
      </div>
    </AdminLayout>
  );
}
