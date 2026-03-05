import { motion } from 'framer-motion';
<<<<<<< HEAD
import { Copy, CheckCircle, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
=======
import { Copy, CheckCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';

>>>>>>> 1aa6af8fedfdf247d7322b95f082eac8c638f563
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

<<<<<<< HEAD
interface Offer {
  id: string;
  discount: string;
  code: string;
  description: string;
  min_order: number;
  valid_till: string;
  createdAt: string;
=======
// 🔥 Coupon coming from backend (Mongo fields)
interface Coupon {
  id: string;
  code: string;
  discount: number;
  description: string;
  min_order: number;
  valid_till: string;
}

// 🔥 API response structure
interface OfferResponse {
  status: number;
  message: string;
  data: Coupon[];
>>>>>>> 1aa6af8fedfdf247d7322b95f082eac8c638f563
}

export default function Offers() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
<<<<<<< HEAD
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
=======
  const [coupons, setCoupons] = useState<Coupon[]>([]);

  // 🔥 Fetch coupons from backend
  useEffect(() => {
    axios
      .get<OfferResponse>(
        'http://127.0.0.1:8000/api/v1/main/Bloomora/GetAllOffer/'
      )
      .then((res) => {
        console.log('API DATA:', res.data);
        setCoupons(res.data.data); // ⭐ FIXED
      })
      .catch((err) => console.log('API ERROR:', err));
>>>>>>> 1aa6af8fedfdf247d7322b95f082eac8c638f563
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
<<<<<<< HEAD
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
=======
            {coupons.map((coupon, index) => (
              <motion.div
                key={coupon.code}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-card to-lavender/5 rounded-3xl p-8 border border-primary/20"
              >
                <div className="absolute -right-6 -top-6 w-24 h-24 bg-primary/10 rounded-full" />
                <div className="absolute -left-6 -bottom-6 w-32 h-32 bg-lavender/10 rounded-full" />
>>>>>>> 1aa6af8fedfdf247d7322b95f082eac8c638f563

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
<<<<<<< HEAD
                </motion.div>
              ))
            ) : (
              <div className="col-span-2 text-center text-muted-foreground py-12">
                No offers available at the moment.
              </div>
            )}
=======

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
            ))}
>>>>>>> 1aa6af8fedfdf247d7322b95f082eac8c638f563
          </div>
        </div>
      </section>
    </Layout>
  );
}