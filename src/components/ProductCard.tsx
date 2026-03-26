// import { motion } from 'framer-motion';
// import { ShoppingCart, Heart, Star } from 'lucide-react';
// import { Link } from 'react-router-dom';
// import { Button } from '@/components/ui/button';
// import { useStore } from '@/lib/store';
// import { toast } from 'sonner';

// interface ProductCardProps {
//   product: any; // allow API structure
//   index?: number;
// }

// export function ProductCard({ product, index = 0 }: ProductCardProps) {
//   const { addToCart } = useStore();

//   // 🔥 Normalize fields (API or Store compatible)
//   const image = product.image || product.image_url;
//   const originalPrice = product.originalPrice || product.original_price;
//   const reviews = product.reviews || product.review_count;
//   const tags = product.tags || [];

//   const discount = originalPrice
//     ? Math.round(((originalPrice - product.price) / originalPrice) * 100)
//     : 0;

//   const handleAddToCart = (e: React.MouseEvent) => {
//     e.preventDefault();

//     // ensure cart gets correct structure
//     addToCart({
//       id: product.id,
//       name: product.name,
//       image_url: image,
//       price: product.price,
//       original_price: originalPrice,
//       rating: product.rating,
//       review_count: reviews,
//       tags,
//       category: '',
//       isBestselling: false
//     });

//     toast.success(`${product.name} added to cart!`);
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.5, delay: index * 0.1 }}
//       className="group"
//     >
//       <Link to={`/shop/${product.id}`} className="block">
//         <div className="card-product relative">

//           {/* Image */}
//           <div className="relative aspect-square overflow-hidden">
//             <img
//               src={image}
//               alt={product.name}
//               className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
//             />

//             {/* Overlay */}
//             <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

//             {/* Badges */}
//             <div className="absolute top-3 left-3 flex flex-col gap-2">
//               {discount > 0 && (
//                 <span className="badge-sale">{discount}% OFF</span>
//               )}

//               {tags.map((tag: string, i: number) => (
//                 <span key={i} className="badge-exotic capitalize">
//                   {tag}
//                 </span>
//               ))}
//             </div>

//             {/* Wishlist */}
//             <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
//               <button className="w-9 h-9 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center text-muted-foreground hover:text-primary transition-colors shadow-soft">
//                 <Heart className="w-4 h-4" />
//               </button>
//             </div>

//             {/* Add to Cart */}
//             <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
//               <Button
//                 variant="hero"
//                 size="sm"
//                 className="w-full"
//                 onClick={handleAddToCart}
//               >
//                 <ShoppingCart className="w-4 h-4" />
//                 Add to Cart
//               </Button>
//             </div>
//           </div>

//           {/* Content */}
//           <div className="p-4">
//             <div className="flex items-center gap-1 mb-2">
//               <Star className="w-4 h-4 fill-gold text-gold" />
//               <span className="text-sm font-medium">{product.rating}</span>
//               <span className="text-sm text-muted-foreground">
//                 ({reviews})
//               </span>
//             </div>

//             <h3 className="font-medium mb-2 line-clamp-2 group-hover:text-primary transition-colors">
//               {product.name}
//             </h3>

//             <div className="flex items-center gap-2">
//               <span className="text-lg font-bold text-primary">
//                 ₹{product.price}
//               </span>

//               {originalPrice && (
//                 <span className="text-sm text-muted-foreground line-through">
//                   ₹{originalPrice}
//                 </span>
//               )}
//             </div>
//           </div>

//         </div>
//       </Link>
//     </motion.div>
//   );
// }




import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useStore } from '@/lib/store';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  product: any; // allow API structure
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addToCart, toggleLike, isLiked } = useStore();
  const liked = isLiked(product.id);

  // 🔥 Normalize fields (API or Store compatible)
  const image = product.image || product.image_url;
  const originalPrice = product.originalPrice || product.original_price;
  const reviews = product.reviews || product.review_count;
  const tags = product.tags || [];

  const discount = originalPrice
    ? Math.round(((originalPrice - product.price) / originalPrice) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();

    // ensure cart gets correct structure
    const success = addToCart({
      id: product.id,
      name: product.name,
      image_url: image,
      price: product.price,
      original_price: originalPrice,
      rating: product.rating,
      review_count: reviews,
      tags,
      category: '',
      isBestselling: false,
      stock: product.stock,
    });

    if (success) {
      toast.success(`${product.name} added to cart!`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group"
    >
      <Link to={`/shop/${product.id}`} className="block">
        <div className="card-product relative">

          {/* Image */}
          <div className="relative aspect-square overflow-hidden">
            <img
              src={image}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {discount > 0 && (
                <span className="badge-sale">{discount}% OFF</span>
              )}

              {tags.map((tag: string, i: number) => (
                <span key={i} className="badge-exotic capitalize">
                  {tag}
                </span>
              ))}

              {product.stock <= 0 && (
                <span className="bg-destructive text-white text-[10px] font-black px-2 py-1 rounded-md shadow-sm animate-pulse uppercase">
                  OUT OF STOCK
                </span>
              )}
            </div>

            {/* Wishlist */}
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  toggleLike({
                    id: product.id,
                    name: product.name,
                    image_url: image,
                    price: product.price,
                    original_price: originalPrice,
                    rating: product.rating,
                    review_count: reviews,
                    tags,
                    category: product.category || '',
                    isBestselling: false,
                  });
                  toast.success(liked ? `${product.name} removed from likes` : `${product.name} added to likes`);
                }}
                className={cn(
                  'w-9 h-9 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center transition-colors shadow-soft',
                  liked ? 'text-primary' : 'text-muted-foreground hover:text-primary'
                )}
              >
                <Heart className={cn('w-4 h-4', liked && 'fill-primary')} />
              </button>
            </div>

            {/* Add to Cart */}
            <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
              <Button
                variant={product.stock <= 0 ? "secondary" : "hero"}
                size="sm"
                className="w-full"
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
              >
                <ShoppingCart className="w-4 h-4" />
                {product.stock <= 0 ? "Sold Out" : "Add to Cart"}
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            <div className="flex items-center gap-1 mb-2">
              <Star className="w-4 h-4 fill-gold text-gold" />
              <span className="text-sm font-medium">{product.rating}</span>
              <span className="text-sm text-muted-foreground">
                ({reviews})
              </span>
            </div>

            <h3 className="font-medium mb-2 line-clamp-2 group-hover:text-primary transition-colors">
              {product.name}
            </h3>

            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-primary">
                ₹{product.price}
              </span>

              {originalPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  ₹{originalPrice}
                </span>
              )}
            </div>
          </div>

        </div>
      </Link>
    </motion.div>
  );
}
