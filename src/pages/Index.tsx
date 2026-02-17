import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Truck, Clock, Sparkles, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { products, categories, testimonials, coupons } from "@/lib/data";
import heroImage from "@/assets/hero-flowers.jpg";
import useFetch from "@/hooks/useFetch";
import { BestSellingResponse } from "@/lib/store";
import { ProductCard } from "@/components/ProductCard";

const features = [
  {
    icon: Sparkles,
    title: "Exotic Collection",
    description: "Rare and exotic flowers sourced globally",
  },
  {
    icon: Truck,
    title: "Express Delivery",
    description: "10-30 min delivery for urgent orders",
  },
  {
    icon: Clock,
    title: "Fresh Guaranteed",
    description: "Farm-fresh flowers with 7-day guarantee",
  },
  {
    icon: Shield,
    title: "100% Quality",
    description: "Premium quality assured on every order",
  },
];

export default function Index() {
const { data: fetchedProducts, loading, error } =
  useFetch<BestSellingResponse>(
    `${import.meta.env.VITE_API_BASE_URL}Get/BestSelling/`
  );

const bestSellingProducts =
  fetchedProducts?.Data?.map((item) => ({
    id: item.id,
    name: item.name,
    image: item.image_url,                 // 🔥 important mapping
    price: item.price,
    originalPrice: item.original_price,    // 🔥 rename
    rating: item.rating,
    reviews: item.review_count,            // 🔥 rename
    tags: item.tags || [],
  })) || [];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-hero-gradient">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Beautiful exotic flowers"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-transparent to-background" />
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-pulse-soft" />
        <div
          className="absolute bottom-40 right-20 w-48 h-48 bg-lavender/20 rounded-full blur-3xl animate-pulse-soft"
          style={{ animationDelay: "1s" }}
        />
        <div className="absolute top-1/3 right-10 w-24 h-24 bg-gold/10 rounded-full blur-2xl animate-float" />

        {/* Content */}
        <div className="relative z-10 container-custom mx-auto px-4 md:px-8 pt-24 pb-16">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-6"
            >
              <span className="inline-block px-4 py-2 bg-gold/10 text-gold-dark rounded-full text-sm font-medium mb-6">
                ✨ India's Premier Floral Marketplace
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mb-6"
            >
              <span className="text-foreground">Let Your Love</span>
              <br />
              <span className="text-gradient">Bloom</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
            >
              Discover exotic flowers, create custom bouquets, and make every
              moment memorable with Bloomora's premium floral collection and
              lightning-fast delivery.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link to="/shop">
                <Button variant="hero" size="xl" className="min-w-[200px]">
                  Shop Now
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/custom-bouquet">
                <Button variant="outline" size="xl" className="min-w-[200px]">
                  Create Bouquet
                </Button>
              </Link>
            </motion.div>

            {/* Delivery Info */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-12 flex flex-wrap items-center justify-center gap-6"
            >
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span>
                  <strong className="text-foreground">Express:</strong> 10-30
                  mins
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>
                  <strong className="text-foreground">Standard:</strong> 2-4
                  hours
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Truck className="w-4 h-4" />
                <span>
                  <strong className="text-foreground">Free delivery</strong>{" "}
                  above ₹999
                </span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-primary/30 rounded-full flex justify-center">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-3 bg-primary rounded-full mt-2"
            />
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-background">
        <div className="container-custom mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6 rounded-2xl bg-card border border-border/50 hover:shadow-card transition-all duration-300"
              >
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="section-padding bg-muted/30">
        <div className="container-custom mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Shop by Category
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From exotic rarities to classic favorites, find the perfect blooms
              for every occasion
            </p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={`/shop?category=${category.id}`}
                  className="flex items-center gap-3 px-6 py-4 bg-background rounded-2xl border border-border hover:border-primary hover:shadow-card transition-all duration-300 group"
                >
                  <span className="text-2xl">{category.icon}</span>
                  <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                    {category.name}
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Selling Products */}
      <section className="section-padding">
        <div className="container-custom mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-4"
          >
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
                Bestselling Blooms
              </h2>
              <p className="text-muted-foreground">
                Our customers' most loved flowers, handpicked for quality
              </p>
            </div>
            <Link to="/shop">
              <Button variant="outline">
                View All
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

  {loading && (
    <p className="col-span-4 text-center">Loading products...</p>
  )}

  {error && (
    <p className="col-span-4 text-center text-red-500">
      Failed to load products
    </p>
  )}

  {!loading &&
    bestSellingProducts.slice(0, 4).map((product, index) => (
      <ProductCard
        key={product.id}
        product={product}
        index={index}
      />
    ))}
</div>

        </div>
      </section>

      {/* CTA - Custom Bouquet */}
      <section className="section-padding bg-gradient-to-br from-rose-light via-lavender-light to-cream">
        <div className="container-custom mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex-1 text-center lg:text-left"
            >
              <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-6">
                Create Your Perfect
                <br />
                <span className="text-gradient">Custom Bouquet</span>
              </h2>
              <p className="text-muted-foreground mb-8 max-w-lg">
                Design a one-of-a-kind arrangement with our interactive bouquet
                creator. Choose your flowers, colors, wrap style, and add-ons
                for a truly personalized gift.
              </p>
              <Link to="/custom-bouquet">
                <Button variant="hero" size="xl">
                  Start Creating
                  <Sparkles className="w-5 h-5" />
                </Button>
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex-1 relative"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-elevated">
                <img
                  src={products[2].image}
                  alt="Custom bouquet preview"
                  className="w-full aspect-[4/3] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-primary-foreground">
                  <p className="text-sm mb-1">Starting from</p>
                  <p className="text-3xl font-bold">₹799</p>
                </div>
              </div>
              {/* Floating Badge */}
              <div className="absolute -top-4 -right-4 bg-gold text-accent-foreground px-4 py-2 rounded-full font-semibold shadow-glow-gold animate-float">
                ✨ Personalize It!
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Delivery Options */}
      <section className="section-padding">
        <div className="container-custom mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Delivery Options
            </h2>
            <p className="text-muted-foreground">
              Choose the delivery speed that suits your needs
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="card-premium p-8"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                  <Truck className="w-7 h-7 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">
                    Express Delivery
                  </h3>
                  <p className="text-green-600 font-medium">10-30 minutes</p>
                </div>
              </div>
              <p className="text-muted-foreground mb-4">
                For those last-minute surprises! Our express delivery ensures
                your flowers reach within 30 minutes for select areas.
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <span className="text-muted-foreground">Additional charge</span>
                <span className="text-xl font-bold text-foreground">₹99</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="card-premium p-8"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-rose-dark flex items-center justify-center">
                  <Clock className="w-7 h-7 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">
                    Standard Delivery
                  </h3>
                  <p className="text-primary font-medium">2-4 hours</p>
                </div>
              </div>
              <p className="text-muted-foreground mb-4">
                Our standard delivery option with careful handling to ensure
                your flowers arrive in perfect condition.
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <span className="text-muted-foreground">Free above ₹999</span>
                <span className="text-xl font-bold text-green-600">FREE</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding bg-muted/30">
        <div className="container-custom mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              What Our Customers Say
            </h2>
            <p className="text-muted-foreground">
              Join thousands of happy customers who trust Bloomora
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-background rounded-2xl p-6 shadow-soft border border-border/50"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-lavender flex items-center justify-center text-primary-foreground font-semibold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.location}
                    </p>
                  </div>
                </div>
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <svg
                      key={i}
                      className="w-4 h-4 fill-gold text-gold"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-muted-foreground text-sm">
                  {testimonial.comment}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Offers Slider */}
      <section className="section-padding">
        <div className="container-custom mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-between mb-8"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              Special Offers
            </h2>
            <Link to="/offers">
              <Button variant="ghost">
                View All Offers
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>

          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
            {coupons.map((coupon, index) => (
              <motion.div
                key={coupon.code}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="min-w-[300px] bg-gradient-to-br from-primary/10 to-lavender/10 rounded-2xl p-6 border border-primary/20"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl font-bold text-primary">
                    {coupon.discount}% OFF
                  </span>
                  <span className="px-3 py-1 bg-primary/10 rounded-full text-primary text-sm font-mono">
                    {coupon.code}
                  </span>
                </div>
                <p className="text-foreground font-medium mb-2">
                  {coupon.description}
                </p>
                <p className="text-sm text-muted-foreground">
                  Min. order: ₹{coupon.minOrder} • Valid till {coupon.validTill}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
