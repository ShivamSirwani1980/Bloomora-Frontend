import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Loader2 } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useStore } from '@/lib/store';
import { useState, useEffect } from 'react';

export default function Contact() {
  const { settings, fetchSettings, contactSupport } = useStore();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  useEffect(() => {
    if (!settings) {
      fetchSettings();
    }
  }, [settings, fetchSettings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    const result = await contactSupport(formData);
    
    if (result.success) {
      toast.success(result.message);
      setFormData({ name: '', email: '', message: '' });
    } else {
      toast.error(result.message);
    }
    setSubmitting(false);
  };

  const update = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const supportPhone = settings?.support_phone || '+91 123 456 7890';
  const supportEmail = settings?.support_email || 'hello@bloomora.com';
  const location = settings?.location || 'Colaba Causeway, Mumbai';

  return (
    <Layout>
      <section className="pt-32 pb-16 bg-stone-50/50">
        <div className="container-custom mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="text-rose font-bold uppercase tracking-[0.3em] text-xs mb-4">Get in Touch</h2>
            <h1 className="font-display text-5xl md:text-6xl font-bold text-stone-900 mb-6">Contact <span className="text-gradient">Us</span></h1>
            <p className="text-stone-500 max-w-2xl mx-auto text-lg font-medium leading-relaxed">
              Have questions about your bouquet or need specialized assistance? 
              Our floral experts are here to help 24/7.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="pb-24 bg-stone-50/50">
        <div className="container-custom mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Info Cards */}
            <div className="lg:col-span-1 space-y-6">
              <motion.div 
                initial={{ opacity: 0, x: -20 }} 
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-stone-100"
              >
                <div className="space-y-8">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center shrink-0">
                      <Phone className="w-6 h-6 text-rose-500" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-0.5">Call Us</p>
                      <p className="font-bold text-stone-900 text-lg">{supportPhone}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-stone-50 rounded-2xl flex items-center justify-center shrink-0">
                      <Mail className="w-6 h-6 text-stone-400" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-0.5">Email</p>
                      <p className="font-bold text-stone-900 text-lg break-all">{supportEmail}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-12 pt-8 border-t border-stone-100 text-center">
                   <p className="text-stone-400 text-xs font-medium flex items-center justify-center gap-1">
                     <MapPin className="w-3 h-3" /> Flagship Store
                   </p>
                   <p className="font-bold text-stone-700 mt-2">{location}</p>
                </div>
              </motion.div>
            </div>

            {/* Form Card */}
            <div className="lg:col-span-2">
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-stone-100"
              >
                <h3 className="font-display text-2xl font-bold mb-8 text-stone-900">Send a Message</h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] uppercase font-bold text-stone-400 tracking-widest pl-2">Full Name</label>
                       <input 
                         type="text" 
                         placeholder="John Doe" 
                         value={formData.name}
                         onChange={(e) => update('name', e.target.value)}
                         className="w-full bg-stone-50 border-stone-100 rounded-2xl p-4 focus:bg-white transition-all outline-none border focus:border-rose-200" 
                         required 
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] uppercase font-bold text-stone-400 tracking-widest pl-2">Email Address</label>
                       <input 
                         type="email" 
                         placeholder="john@example.com" 
                         value={formData.email}
                         onChange={(e) => update('email', e.target.value)}
                         className="w-full bg-stone-50 border-stone-100 rounded-2xl p-4 focus:bg-white transition-all outline-none border focus:border-rose-200" 
                         required 
                       />
                    </div>
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] uppercase font-bold text-stone-400 tracking-widest pl-2">How can we help?</label>
                     <textarea 
                       placeholder="Tell us about your requirements..." 
                       rows={5} 
                       value={formData.message}
                       onChange={(e) => update('message', e.target.value)}
                       className="w-full bg-stone-50 border-stone-100 rounded-2xl p-4 focus:bg-white transition-all outline-none border focus:border-rose-200 resize-none" 
                       required 
                     />
                  </div>
                  <Button 
                    variant="hero" 
                    size="xl" 
                    type="submit"
                    disabled={submitting}
                    className="w-full h-16 rounded-2xl shadow-lg shadow-rose-200"
                  >
                    {submitting ? (
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    ) : (
                      <Send className="w-5 h-5 mr-2" />
                    )}
                    {submitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
