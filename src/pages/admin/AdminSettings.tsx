import { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Upload, IndianRupee } from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    expressDeliveryFee: 99,
    standardDeliveryFee: 0,
    taxRate: 18,
    freeDeliveryAbove: 2000,
    siteName: 'Bloomora',
    tagline: 'Your One-Stop Floral Marketplace',
    supportEmail: 'support@bloomora.com',
    supportPhone: '+91 9876543210',
    whatsapp: '+91 9876543210',
  });

  const handleSave = () => {
    toast.success('Settings saved successfully');
  };

  const update = (key: string, value: string | number) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-3xl">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-sm text-muted-foreground">Manage your store configuration</p>
        </div>

        {/* Site Branding */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-2xl p-6 border border-border/50 shadow-soft space-y-4">
          <h2 className="font-semibold text-foreground">Site Branding</h2>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Site Name</label>
              <Input value={settings.siteName} onChange={(e) => update('siteName', e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Tagline</label>
              <Input value={settings.tagline} onChange={(e) => update('tagline', e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Logo</label>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-muted flex items-center justify-center text-2xl">🌸</div>
                <Button variant="outline" size="sm"><Upload className="w-4 h-4" /> Upload Logo</Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Delivery & Pricing */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card rounded-2xl p-6 border border-border/50 shadow-soft space-y-4">
          <h2 className="font-semibold text-foreground flex items-center gap-2">
            <IndianRupee className="w-4 h-4" /> Delivery & Pricing
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Express Delivery Fee (₹)</label>
              <Input type="number" value={settings.expressDeliveryFee} onChange={(e) => update('expressDeliveryFee', Number(e.target.value))} />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Standard Delivery Fee (₹)</label>
              <Input type="number" value={settings.standardDeliveryFee} onChange={(e) => update('standardDeliveryFee', Number(e.target.value))} />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Tax Rate (%)</label>
              <Input type="number" value={settings.taxRate} onChange={(e) => update('taxRate', Number(e.target.value))} />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Free Delivery Above (₹)</label>
              <Input type="number" value={settings.freeDeliveryAbove} onChange={(e) => update('freeDeliveryAbove', Number(e.target.value))} />
            </div>
          </div>
        </motion.div>

        {/* Contact Info */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card rounded-2xl p-6 border border-border/50 shadow-soft space-y-4">
          <h2 className="font-semibold text-foreground">Contact Information</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Support Email</label>
              <Input value={settings.supportEmail} onChange={(e) => update('supportEmail', e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Support Phone</label>
              <Input value={settings.supportPhone} onChange={(e) => update('supportPhone', e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">WhatsApp</label>
              <Input value={settings.whatsapp} onChange={(e) => update('whatsapp', e.target.value)} />
            </div>
          </div>
        </motion.div>

        <Button variant="hero" size="lg" onClick={handleSave}>
          <Save className="w-5 h-5" /> Save All Settings
        </Button>
      </div>
    </AdminLayout>
  );
}
