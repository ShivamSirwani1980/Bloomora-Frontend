  import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { ProductCard } from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { categories } from '@/lib/data';
import { cn } from '@/lib/utils';
import useFetch from '@/hooks/useFetch';

const priceRanges = [
  { label: 'Under ₹1000', min: 0, max: 1000 },
  { label: '₹1000 - ₹2000', min: 1000, max: 2000 },
  { label: '₹2000 - ₹3000', min: 2000, max: 3000 },
  { label: 'Above ₹3000', min: 3000, max: Infinity },
];

interface ApiProduct {
  id: string;
  name: string;
  image_url: string;
  category: string;
  isBestselling: boolean;
  rating: number;
  review_count: number;
  price: number;
  original_price?: number;
  discount_label?: string;
  tags?: string[];
  description?: string;
}

interface ProductsResponse {
  status: number;
  success: string;
  total_count: number;
  data: ApiProduct[];
}

export default function Shop() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all flowers');
  const [selectedPriceRange, setSelectedPriceRange] = useState<number | null>(null);

  const { data, loading, error, setUrl } =
    useFetch<ProductsResponse>('');

  // ✅ Refetch when category changes
  useEffect(() => {
    const url =
      `${import.meta.env.VITE_API_BASE_URL}/api/v1/main/Bloomora/Get/Products/Category/?category=${selectedCategory}`;

    setUrl(url);
  }, [selectedCategory]);

  // ✅ Extract backend array
  const apiProducts = data?.data || [];

  // ✅ Normalize to ProductCard structure
  const normalizedProducts = apiProducts.map((item) => ({
    id: item.id,
    name: item.name,
    image: item.image_url,
    price: item.price,
    originalPrice: item.original_price,
    rating: item.rating,
    reviews: item.review_count,
    tags: item.tags || [],
    category: item.category,
    description: item.description || '',
  }));

  // ✅ Apply Frontend Filters
  const filteredProducts = normalizedProducts.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesPrice =
      selectedPriceRange === null ||
      (product.price >= priceRanges[selectedPriceRange].min &&
        product.price < priceRanges[selectedPriceRange].max);

    return matchesSearch && matchesPrice;
  });

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all flowers');
    setSelectedPriceRange(null);
  };

  return (
    <Layout>
      {/* Header */}
      <section className="pt-24 pb-8 bg-hero-gradient">
        <div className="container-custom mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-4xl md:text-5xl font-bold mb-4"
          >
            Flower <span className="text-gradient">Marketplace</span>
          </motion.h1>

          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search flowers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full input-premium pl-12 pr-4"
            />
          </div>
        </div>
      </section>

      {/* Main */}
      <section className="section-padding">
        <div className="container-custom mx-auto flex gap-8">

          {/* Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="space-y-6">

              {/* Category */}
              <div>
                <h4 className="text-sm font-medium mb-3">Category</h4>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={cn(
                      'w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm',
                      selectedCategory === category.id
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-muted'
                    )}
                  >
                    <span>{category.icon}</span>
                    {category.name}
                  </button>
                ))}
              </div>

              {/* Price */}
              <div>
                <h4 className="text-sm font-medium mb-3">Price Range</h4>
                {priceRanges.map((range, index) => (
                  <button
                    key={range.label}
                    onClick={() =>
                      setSelectedPriceRange(
                        selectedPriceRange === index ? null : index
                      )
                    }
                    className={cn(
                      'w-full px-3 py-2 rounded-lg text-sm',
                      selectedPriceRange === index
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-muted'
                    )}
                  >
                    {range.label}
                  </button>
                ))}
              </div>

              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          </aside>

          {/* Products */}
          <div className="flex-1">

            {loading && (
              <div className="text-center py-16">
                Loading products...
              </div>
            )}


            {!loading && filteredProducts.length > 0 && (
              <>
                <p className="mb-6 text-muted-foreground">
                  {filteredProducts.length} products found
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredProducts.map((product, index) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      index={index}
                    />
                  ))}
                </div>
              </>
            )}

            {!loading && filteredProducts.length === 0 && (
              <div className="text-center py-16">
                No flowers found
              </div>
            )}

          </div>
        </div>
      </section>
    </Layout>
  );
}