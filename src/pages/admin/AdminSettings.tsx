import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Save, Upload, IndianRupee, Loader2 } from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

import { useStore } from '@/lib/store';

const getApiBase = () => {
  const envUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
  return envUrl.replace(/\/$/, '');
};

const API_BASE_URL = getApiBase();

export default function AdminSettings() {
  const { settings: globalSettings, setSettings: setGlobalSettings } = useStore();
  const [formData, setFormData] = useState({
    expressDeliveryFee: 99,
    standardDeliveryFee: 0,
    taxRate: 18,
    freeDeliveryAbove: 2000,
    siteName: 'Bloomora',
    tagline: 'Your One-Stop Floral Marketplace',
    supportEmail: 'support@bloomora.com',
    supportPhone: '+91 9876543210',
    whatsapp: '+91 9876543210',
    location: 'Mumbai, India',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/main/Bloomora/Admin/Settings/`);
        const result = await response.json();
        if (result.data) {
          const d = result.data;
          setGlobalSettings(d);
          setFormData({
            expressDeliveryFee: d.express_delivery_fee || 99,
            standardDeliveryFee: d.standard_delivery_fee || 0,
            taxRate: d.tax_rate || 18,
            freeDeliveryAbove: d.free_delivery_above || 2000,
            siteName: d.site_name || 'Bloomora',
            tagline: d.tagline || '',
            supportEmail: d.support_email || '',
            supportPhone: d.support_phone || '',
            whatsapp: d.whatsapp || '',
            location: d.location || 'Mumbai, India',
          });
          if (d.logo_url) setLogoPreview(d.logo_url);
        }
      } catch (error) {
        console.error('Failed to fetch settings:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, [setGlobalSettings]);

  const handleSave = async () => {
    setSaving(true);
    const postData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      postData.append(key, String(value));
    });
    if (logoFile) {
      postData.append('logo', logoFile);
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/main/Bloomora/Admin/Settings/`, {
        method: 'POST',
        body: postData,
      });
      const result = await response.json();
      if (response.ok) {
        toast.success('Settings saved successfully');
        if (result.data) {
          const d = result.data;
          setGlobalSettings(d);
          setFormData({
            expressDeliveryFee: d.express_delivery_fee || 99,
            standardDeliveryFee: d.standard_delivery_fee || 0,
            taxRate: d.tax_rate || 18,
            freeDeliveryAbove: d.free_delivery_above || 2000,
            siteName: d.site_name || 'Bloomora',
            tagline: d.tagline || '',
            supportEmail: d.support_email || '',
            supportPhone: d.support_phone || '',
            whatsapp: d.whatsapp || '',
            location: d.location || 'Mumbai, India',
          });
          if (d.logo_url) setLogoPreview(d.logo_url);
        }
        setLogoFile(null);
      } else {
        toast.error(result.error || 'Failed to save settings');
      }
    } catch (error) {
      toast.error('Network error while saving settings');
    } finally {
      setSaving(false);
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const update = (key: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-3xl pb-10">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-sm text-muted-foreground">Manage your store configuration globally</p>
        </div>

        {/* Site Branding */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-2xl p-6 border border-border/50 shadow-soft space-y-4">
          <h2 className="font-semibold text-foreground">Site Branding</h2>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Site Name</label>
              <Input value={formData.siteName} onChange={(e) => update('siteName', e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Tagline</label>
              <Input value={formData.tagline} onChange={(e) => update('tagline', e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Logo</label>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-muted flex items-center justify-center overflow-hidden border">
                  {logoPreview ? (
                    <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl">🌸</span>
                  )}
                </div>
                <input type="file" ref={fileInputRef} onChange={handleLogoChange} className="hidden" accept="image/*" />
                <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                  <Upload className="w-4 h-4 mr-2" /> Upload Logo
                </Button>
                {logoFile && <span className="text-xs text-muted-foreground truncate max-w-[150px]">{logoFile.name}</span>}
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
              <Input type="number" value={formData.expressDeliveryFee} onChange={(e) => update('expressDeliveryFee', Number(e.target.value))} />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Standard Delivery Fee (₹)</label>
              <Input type="number" value={formData.standardDeliveryFee} onChange={(e) => update('standardDeliveryFee', Number(e.target.value))} />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Tax Rate (%)</label>
              <Input type="number" value={formData.taxRate} onChange={(e) => update('taxRate', Number(e.target.value))} />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Free Delivery Above (₹)</label>
              <Input type="number" value={formData.freeDeliveryAbove} onChange={(e) => update('freeDeliveryAbove', Number(e.target.value))} />
            </div>
          </div>
        </motion.div>

        {/* Contact Info */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card rounded-2xl p-6 border border-border/50 shadow-soft space-y-4">
          <h2 className="font-semibold text-foreground">Contact Information</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Support Email</label>
              <Input value={formData.supportEmail} onChange={(e) => update('supportEmail', e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Support Phone</label>
              <Input value={formData.supportPhone} onChange={(e) => update('supportPhone', e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">WhatsApp</label>
              <Input value={formData.whatsapp} onChange={(e) => update('whatsapp', e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Location / Address</label>
              <Input value={formData.location} onChange={(e) => update('location', e.target.value)} />
            </div>
          </div>
        </motion.div>

        <Button variant="hero" size="xl" onClick={handleSave} disabled={saving} className="w-full sm:w-auto">
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5 mr-2" />}
          Save All Settings
        </Button>
      </div>
    </AdminLayout>
  );
}
