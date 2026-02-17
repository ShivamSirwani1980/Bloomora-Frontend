import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function Contact() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Message sent! We\'ll get back to you soon.');
  };

  return (
    <Layout>
      <section className="pt-24 pb-12 bg-hero-gradient">
        <div className="container-custom mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">Contact <span className="text-gradient">Us</span></h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">We'd love to hear from you. Reach out with questions, feedback, or just to say hello!</p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom mx-auto max-w-5xl">
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <h2 className="font-display text-2xl font-bold mb-6">Get in Touch</h2>
              <div className="space-y-6">
                <div className="flex items-center gap-4"><div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center"><Phone className="w-5 h-5 text-primary" /></div><div><p className="font-medium">Phone</p><p className="text-muted-foreground">+91 123 456 7890</p></div></div>
                <div className="flex items-center gap-4"><div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center"><Mail className="w-5 h-5 text-primary" /></div><div><p className="font-medium">Email</p><p className="text-muted-foreground">hello@bloomora.com</p></div></div>
                <div className="flex items-center gap-4"><div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center"><MapPin className="w-5 h-5 text-primary" /></div><div><p className="font-medium">Address</p><p className="text-muted-foreground">Mumbai, Maharashtra, India</p></div></div>
              </div>
            </motion.div>

            <motion.form initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} onSubmit={handleSubmit} className="bg-card rounded-2xl p-6 border border-border space-y-4">
              <input type="text" placeholder="Your Name" className="w-full input-premium" required />
              <input type="email" placeholder="Your Email" className="w-full input-premium" required />
              <textarea placeholder="Your Message" rows={5} className="w-full input-premium resize-none" required />
              <Button variant="hero" className="w-full"><Send className="w-4 h-4" /> Send Message</Button>
            </motion.form>
          </div>
        </div>
      </section>
    </Layout>
  );
}
