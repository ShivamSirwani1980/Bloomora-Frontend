import { motion } from 'framer-motion';
import { Heart, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { ProductCard } from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { useStore } from '@/lib/store';

export default function LikedFlowers() {
  const { likedProducts } = useStore();

  return (
    <Layout>
      {/* Header */}
      <section className="pt-24 pb-8 bg-hero-gradient">
        <div className="container-custom mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Liked <span className="text-gradient">Flowers</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Your curated collection of favourite blooms
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding">
        <div className="container-custom mx-auto">
          {likedProducts.length > 0 ? (
            <>
              <p className="text-muted-foreground mb-6">
                {likedProducts.length} flower{likedProducts.length !== 1 ? 's' : ''} liked
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {likedProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
                <Heart className="w-10 h-10 text-muted-foreground" />
              </div>
              <h2 className="font-display text-2xl font-semibold text-foreground mb-3">
                You haven't liked any flowers yet.
              </h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Explore our beautiful collection and tap the heart icon on flowers you love.
              </p>
              <Link to="/shop">
                <Button variant="hero" size="lg">
                  <ShoppingBag className="w-5 h-5" />
                  Browse Flowers
                </Button>
              </Link>
            </motion.div>
          )}
        </div>
      </section>
    </Layout>
  );
}
