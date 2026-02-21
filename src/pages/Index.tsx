import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Truck, Clock, Sparkles, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { products, categories, testimonials } from "@/lib/data";
import heroImage from "@/assets/hero-flowers.jpg";
import useFetch from "@/hooks/useFetch";
import { BestSellingResponse } from "@/lib/store";
import { ProductCard } from "@/components/ProductCard";

import axios from "axios";
import { useState, useEffect } from "react";

interface Coupon {
  id: string;
  code: string;
  discount: string;
  description: string;
  min_order: number;
  valid_till: string;
}

interface OfferResponse {
  status: number;
  message: string;
  data: Coupon[];
}

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
      image: item.image_url,
      price: item.price,
      originalPrice: item.original_price,
      rating: item.rating,
      reviews: item.review_count,
      tags: item.tags || [],
    })) || [];

  // 🔥 Offers from backend
  const [coupons, setCoupons] = useState<Coupon[]>([]);

  useEffect(() => {
    axios
      .get<OfferResponse>(
        "http://127.0.0.1:8000/api/v1/main/Bloomora/GetAllOffer/"
      )
      .then((res) => {
        setCoupons(res.data.data);
      })
      .catch((err) => console.log("OFFERS ERROR:", err));
  }, []);

  return (
    <Layout>

      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-hero-gradient">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Beautiful exotic flowers"
            className="w-full h-full object-cover opacity-30"
          />
        </div>

        <div className="relative z-10 container-custom mx-auto px-4 md:px-8 pt-24 pb-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-display text-5xl md:text-7xl font-bold mb-6">
              Let Your Love <span className="text-gradient">Bloom</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Discover exotic flowers and premium floral collections.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/shop">
                <Button variant="hero" size="xl">
                  Shop Now
                </Button>
              </Link>
              <Link to="/custom-bouquet">
                <Button variant="outline" size="xl">
                  Create Bouquet
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* TOP SELLING PRODUCTS */}
      <section className="section-padding">
        <div className="container-custom mx-auto">

          <div className="flex justify-between mb-8">
            <h2 className="font-display text-3xl font-bold">
              Bestselling Blooms
            </h2>
          </div>

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

      {/* SPECIAL OFFERS (BACKEND DATA) */}
      <section className="section-padding">
        <div className="container-custom mx-auto">

          <div className="flex items-center justify-between mb-8">
            <h2 className="font-display text-3xl md:text-4xl font-bold">
              Special Offers
            </h2>
            <Link to="/offers">
              <Button variant="ghost">
                View All Offers
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
            {coupons.map((coupon, index) => (
              <motion.div
                key={coupon.code}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="min-w-[300px] bg-gradient-to-br from-primary/10 to-lavender/10 rounded-2xl p-6 border border-primary/20"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl font-bold text-primary">
                    {coupon.discount}
                  </span>

                  <span className="px-3 py-1 bg-primary/10 rounded-full text-primary text-sm font-mono">
                    {coupon.code}
                  </span>
                </div>

                <p className="text-foreground font-medium mb-2">
                  {coupon.description}
                </p>

                <p className="text-sm text-muted-foreground">
                  Min. order: ₹{coupon.min_order} • Valid till{" "}
                  {coupon.valid_till}
                </p>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

    </Layout>
  );
}