import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { Sparkles, Target, Heart, Truck, Shield, Award } from 'lucide-react';

export default function About() {
  return (
    <Layout>
      <section className="pt-24 pb-12 bg-hero-gradient">
        <div className="container-custom mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">About <span className="text-gradient">Bloomora</span></h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">India's Premier Digital Flower Marketplace</p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom mx-auto max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="prose prose-lg mx-auto text-center mb-16">
            <h2 className="font-display text-3xl font-bold text-foreground">Our Mission</h2>
            <p className="text-muted-foreground">To make premium flowers accessible to everyone, bringing joy and beauty to every special moment through exceptional quality, innovative customization, and lightning-fast delivery.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="bg-card rounded-2xl p-8 border border-border">
              <Target className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-3">The Problem We Solve</h3>
              <p className="text-muted-foreground">Finding fresh, exotic flowers at fair prices with reliable delivery has always been a challenge. Traditional florists lack variety, and online options often disappoint with quality issues and late deliveries.</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="bg-card rounded-2xl p-8 border border-border">
              <Sparkles className="w-10 h-10 text-gold mb-4" />
              <h3 className="text-xl font-semibold mb-3">Our Solution</h3>
              <p className="text-muted-foreground">Bloomora bridges this gap with a curated marketplace of exotic and rare flowers, interactive bouquet customization, professional decoration services, and express delivery in as fast as 10 minutes.</p>
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold text-foreground mb-8">Why Choose Bloomora?</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Award, title: 'Premium Quality', desc: 'Hand-selected exotic and rare flowers sourced globally' },
              { icon: Heart, title: 'Custom Creations', desc: 'Design your perfect bouquet with our interactive creator' },
              { icon: Truck, title: 'Express Delivery', desc: '10-30 minute delivery for those special moments' },
              { icon: Shield, title: 'Freshness Guarantee', desc: '7-day freshness guarantee on all flowers' },
              { icon: Sparkles, title: 'Expert Decorators', desc: 'Professional event decoration services' },
              { icon: Target, title: 'Best Prices', desc: 'Competitive pricing with regular offers' },
            ].map((item, i) => (
              <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center p-6">
                <item.icon className="w-10 h-10 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
