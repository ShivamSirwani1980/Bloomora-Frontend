import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Truck, Clock, Shield, Star, ChevronLeft, Minus, Plus } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/ProductCard';
import { products } from '@/lib/data';
import { useStore, BestSellingResponse } from '@/lib/store';
import useFetch from '@/hooks/useFetch';
import { toast } from 'sonner';

export default function ProductDetail() {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useStore();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/main/Bloomora/GetProductById/${id}/`);
        const result = await res.json();
        if (result.status === 200 && result.data) {
          const data = result.data;
          setProduct({
            id: data.id || id,
            name: data.name,
            price: data.price,
            originalPrice: data.original_price,
            image: data.image_url,
            category: data.category?.[0] || 'Bouquets',
            tags: data.tags?.map((t: string) => t.toLowerCase()) || [],
            description: data.description || 'A stunning arrangement, perfect for any occasion. Hand-tied with precision.',
            inStock: true,
            rating: data.rating || 0,
            reviews: data.review_count || 0,
          });
        } else {
          setProduct(null);
        }
      } catch (error) {
        console.error("Failed to fetch product:", error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const { data: fetchedProducts, loading: bestSellingLoading, error: bestSellingError } =
    useFetch<BestSellingResponse>(
      `${import.meta.env.VITE_API_BASE_URL}/api/v1/main/Bloomora/Get/BestSelling/`
    );

  const bestSellingProducts =
    fetchedProducts?.Data?.map((item: any) => ({
      id: String(item.id),
      name: item.name,
      image: item.image_url,
      price: item.price,
      originalPrice: item.original_price,
      rating: item.rating,
      reviews: item.review_count,
      tags: item.tags || [],
    })) || [];

  const relatedProducts = bestSellingProducts.filter((p) => p.id !== id).slice(0, 4);

  if (loading) {
    return (
      <Layout>
        <div className="pt-24 section-padding text-center">
          <h1 className="text-2xl font-bold mb-4">Loading product...</h1>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="pt-24 section-padding text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <Link to="/shop">
            <Button variant="outline">Back to Shop</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success(`${quantity} ${product.name} added to cart!`);
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <Layout>
      <div className="pt-24 section-padding">
        <div className="container-custom mx-auto">
          {/* Breadcrumb */}
          <Link to="/shop" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8">
            <ChevronLeft className="w-4 h-4" />
            Back to Shop
          </Link>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Images */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <div className="relative aspect-square rounded-3xl overflow-hidden bg-muted">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {discount > 0 && (
                  <span className="absolute top-4 left-4 badge-sale text-sm">
                    {discount}% OFF
                  </span>
                )}
                {product.tags.includes('exotic') && (
                  <span className="absolute top-4 right-4 badge-exotic text-sm">
                    Exotic
                  </span>
                )}
              </div>
              {/* Thumbnail gallery could go here */}
            </motion.div>

            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-gold text-gold' : 'text-muted'}`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>

              {/* Title */}
              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                {product.name}
              </h1>

              {/* Price */}
              <div className="flex items-center gap-4">
                <span className="text-3xl font-bold text-primary">₹{product.price}</span>
                {product.originalPrice && (
                  <>
                    <span className="text-xl text-muted-foreground line-through">
                      ₹{product.originalPrice}
                    </span>
                    <span className="text-green-600 font-semibold">Save ₹{product.originalPrice - product.price}</span>
                  </>
                )}
              </div>

              {/* Description */}
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-muted rounded-full text-sm text-muted-foreground"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Quantity & Add to Cart */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <div className="flex items-center gap-4 bg-muted rounded-xl px-4 py-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded-full bg-background flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-lg font-semibold w-8 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 rounded-full bg-background flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <Button variant="hero" size="lg" className="flex-1" onClick={handleAddToCart}>
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart - ₹{product.price * quantity}
                </Button>

                <Button variant="outline" size="lg" className="px-4">
                  <Heart className="w-5 h-5" />
                </Button>
              </div>

              {/* Delivery Options */}
              <div className="border-t border-border pt-6 space-y-4">
                <h3 className="font-semibold text-foreground">Delivery Options</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-green-50 border border-green-200">
                    <Truck className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium text-green-800">Express Delivery</p>
                      <p className="text-sm text-green-600">10-30 mins • ₹99 extra</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-primary/5 border border-primary/20">
                    <Clock className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium text-foreground">Standard Delivery</p>
                      <p className="text-sm text-muted-foreground">2-4 hours • Free</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap gap-6 pt-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="w-4 h-4 text-green-600" />
                  100% Fresh Guarantee
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Truck className="w-4 h-4 text-primary" />
                  Same Day Delivery
                </div>
              </div>
            </motion.div>
          </div>

          {/* Related Products */}
          <div className="mt-20">
            <h2 className="font-display text-2xl font-bold text-foreground mb-8">
              Best Selling Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {bestSellingLoading && (
                <p className="col-span-4 text-center">Loading products...</p>
              )}
              {bestSellingError && (
                <p className="col-span-4 text-center text-red-500">
                  Failed to load products
                </p>
              )}
              {!bestSellingLoading &&
                relatedProducts.map((p, index) => (
                  <ProductCard key={p.id} product={p} index={index} />
                ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
