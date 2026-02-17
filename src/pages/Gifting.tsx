import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Gift, Calendar, MessageSquare, Heart, ArrowRight } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { giftCategories, products } from '@/lib/data';
import { ProductCard } from '@/components/ProductCard';

const giftCombos = [
  {
    id: 1,
    name: 'Romantic Rose Bundle',
    items: ['Red Roses Bouquet', 'Premium Chocolates', 'Greeting Card'],
    price: 2499,
    originalPrice: 2999,
  },
  {
    id: 2,
    name: 'Birthday Celebration',
    items: ['Sunflower Bouquet', 'Teddy Bear', 'Balloon Bunch'],
    price: 1999,
    originalPrice: 2499,
  },
  {
    id: 3,
    name: 'Anniversary Special',
    items: ['Orchid Arrangement', 'Scented Candle', 'Photo Frame'],
    price: 3499,
    originalPrice: 3999,
  },
];

export default function Gifting() {
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
            <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">
              🎁 Thoughtful Gifting Made Easy
            </span>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
              Send Love with <span className="text-gradient">Perfect Gifts</span>
            </h1>
            <p className="text-muted-foreground text-lg mb-8">
              Discover curated gift combos and express your feelings with our premium 
              flowers paired with thoughtful add-ons for every special occasion.
            </p>
            <Link to="/shop">
              <Button variant="hero" size="xl">
                Explore Gifts
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Gift Categories */}
      <section className="section-padding">
        <div className="container-custom mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Gift by Occasion
            </h2>
            <p className="text-muted-foreground">
              Find the perfect arrangement for every special moment
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {giftCategories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={`/shop?occasion=${category.id}`}
                  className="block p-6 bg-card rounded-2xl border border-border hover:border-primary hover:shadow-card transition-all duration-300 text-center group"
                >
                  <span className="text-4xl mb-3 block">{category.icon}</span>
                  <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">{category.description}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gift Combos */}
      <section className="section-padding bg-muted/30">
        <div className="container-custom mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Curated Gift Combos
            </h2>
            <p className="text-muted-foreground">
              Pre-made bundles that combine flowers with perfect gifts
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {giftCombos.map((combo, index) => (
              <motion.div
                key={combo.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-2xl p-6 border border-border hover:shadow-card transition-all"
              >
                <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-lavender/20 mb-4">
                  <Gift className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">{combo.name}</h3>
                <ul className="space-y-2 mb-4">
                  {combo.items.map((item) => (
                    <li key={item} className="text-sm text-muted-foreground flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl font-bold text-primary">₹{combo.price}</span>
                  <span className="text-sm text-muted-foreground line-through">₹{combo.originalPrice}</span>
                </div>
                <Button variant="hero" className="w-full">Add to Cart</Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section-padding">
        <div className="container-custom mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
                <MessageSquare className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Personal Message</h3>
              <p className="text-muted-foreground">
                Add a heartfelt message to make your gift extra special
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Calendar className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Scheduled Delivery</h3>
              <p className="text-muted-foreground">
                Schedule your gift for the perfect moment
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Heart className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Premium Packaging</h3>
              <p className="text-muted-foreground">
                Elegant gift wrapping that makes an impression
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Popular Gift Flowers */}
      <section className="section-padding bg-muted/30">
        <div className="container-custom mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-between mb-8"
          >
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
              Popular Gift Flowers
            </h2>
            <Link to="/shop">
              <Button variant="outline">View All</Button>
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.slice(0, 4).map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
