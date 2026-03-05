import { motion } from 'framer-motion';
import { Copy, CheckCircle, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface Offer {
  id: string;
  discount: string;
  code: string;
  description: string;
  min_order: number;
  valid_till: string;
  createdAt: string;
}

export default function Offers() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/v1/main/Bloomora/GetAllOffer/');
        const data = await response.json();
        if (data.status === 200) {
          setOffers(data.data);
        } else {
          toast.error(data.message || 'Failed to fetch offers');
        }
      } catch (error) {
        toast.error('Failed to fetch offers');
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, []);

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Coupon code ${code} copied!`);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="pt-24 pb-12 bg-hero-gradient">
        <div className="container-custom mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="inline-block px-4 py-2 bg-gold/10 text-gold-dark rounded-full text-sm font-medium mb-6">
              💰 Save Big on Blooms
            </span>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
              Exclusive <span className="text-gradient">Offers & Coupons</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Grab these amazing deals and discounts on your favorite flowers and gifts
            </p>
          </motion.div>
        </div>
      </section>

      {/* Coupons */}
      <section className="section-padding">
        <div className="container-custom mx-auto">
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {loading ? (
              <div className="col-span-2 flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : offers.length > 0 ? (
              offers.map((coupon, index) => (
                <motion.div
                  key={coupon.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-card to-lavender/5 rounded-3xl p-8 border border-primary/20"
                >
                  {/* Decorative circles */}
                  <div className="absolute -right-6 -top-6 w-24 h-24 bg-primary/10 rounded-full" />
                  <div className="absolute -left-6 -bottom-6 w-32 h-32 bg-lavender/10 rounded-full" />

                  <div className="relative">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="text-5xl font-bold text-gradient">{coupon.discount.split(' ')[0]}</p>
                        <p className="text-sm text-muted-foreground">{coupon.discount.split(' ').slice(1).join(' ') || 'OFF'}</p>
                      </div>
                      <div className="px-4 py-2 bg-background/80 backdrop-blur rounded-xl">
                        <p className="font-mono font-bold text-primary text-lg">{coupon.code}</p>
                      </div>
                    </div>

                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {coupon.description}
                    </h3>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                      {coupon.min_order > 0 && (
                        <span>Min. order: ₹{coupon.min_order}</span>
                      )}
                      <span>Valid till: {coupon.valid_till}</span>
                    </div>

                    <Button
                      variant={copiedCode === coupon.code ? 'soft' : 'hero'}
                      className="w-full"
                      onClick={() => copyCode(coupon.code)}
                    >
                      {copiedCode === coupon.code ? (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copy Code
                        </>
                      )}
                    </Button>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-2 text-center text-muted-foreground py-12">
                No offers available at the moment.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Terms */}
      <section className="section-padding bg-muted/30">
        <div className="container-custom mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-2xl font-bold text-foreground mb-6 text-center">
              Terms & Conditions
            </h2>
            <div className="bg-card rounded-2xl p-6 border border-border">
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  Coupons can only be applied once per order
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  Coupons cannot be combined with other offers
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  Minimum order value must be met before applying coupon
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  Coupons are auto-applied at checkout when eligible
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  Bloomora reserves the right to modify or withdraw offers without prior notice
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Banner */}
      <section className="section-padding">
        <div className="container-custom mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-primary via-rose-dark to-lavender rounded-3xl p-12 text-center text-primary-foreground"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Subscribe for Exclusive Deals
            </h2>
            <p className="mb-8 opacity-90 max-w-xl mx-auto">
              Be the first to know about new arrivals, special offers, and seasonal discounts
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-xl bg-background/10 border border-primary-foreground/30 text-primary-foreground placeholder:text-primary-foreground/60 focus:outline-none focus:border-primary-foreground"
              />
              <Button variant="gold" size="lg">
                Subscribe
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
