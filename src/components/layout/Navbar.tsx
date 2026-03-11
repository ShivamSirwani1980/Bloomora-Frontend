// import { useState, useEffect } from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import { motion, AnimatePresence } from 'framer-motion';
// import { ShoppingCart, User, Menu, X, Heart, Flower2 } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { useStore } from '@/lib/store';
// import { cn } from '@/lib/utils';

// const navLinks = [
//   { name: 'Home', path: '/' },
//   { name: 'Shop', path: '/shop' },
//   { name: 'Custom Bouquet', path: '/custom-bouquet' },
//   { name: 'Gifting', path: '/gifting' },
//   { name: 'Decoration', path: '/decoration' },
//   { name: 'Offers', path: '/offers' },
// ];

// export function Navbar() {
//   const [isScrolled, setIsScrolled] = useState(false);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const location = useLocation();
//   const { getCartCount, isAuthenticated } = useStore();
//   const cartCount = getCartCount();

//   useEffect(() => {
//     const handleScroll = () => {
//       setIsScrolled(window.scrollY > 20);
//     };
//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   useEffect(() => {
//     setIsMobileMenuOpen(false);
//   }, [location.pathname]);

//   return (
//     <header
//       className={cn(
//         'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
//         isScrolled
//           ? 'bg-background/95 backdrop-blur-lg shadow-soft border-b border-border/50'
//           : 'bg-transparent'
//       )}
//     >
//       <nav className="container-custom mx-auto px-4 md:px-8">
//         <div className="flex items-center justify-between h-16 md:h-20">
//           {/* Logo */}
//           <Link to="/" className="flex items-center gap-2 group">
//             <div className="relative">
//               <Flower2 className="w-8 h-8 text-primary transition-transform duration-500 group-hover:rotate-12" />
//               <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
//             </div>
//             <span className="font-display text-2xl font-bold text-gradient">
//               Bloomora
//             </span>
//           </Link>

//           {/* Desktop Navigation */}
//           <div className="hidden lg:flex items-center gap-1">
//             {navLinks.map((link) => (
//               <Link
//                 key={link.path}
//                 to={link.path}
//                 className={cn(
//                   'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300',
//                   location.pathname === link.path
//                     ? 'text-primary bg-primary/10'
//                     : 'text-muted-foreground hover:text-foreground hover:bg-muted'
//                 )}
//               >
//                 {link.name}
//               </Link>
//             ))}
//           </div>

//           {/* Right Section */}
//           <div className="flex items-center gap-2 md:gap-4">
//             {/* Wishlist */}
//             <button className="hidden md:flex p-2 hover:bg-muted rounded-lg transition-colors">
//               <Heart className="w-5 h-5 text-muted-foreground" />
//             </button>

//             {/* Cart */}
//             <Link to="/cart" className="relative p-2 hover:bg-muted rounded-lg transition-colors">
//               <ShoppingCart className="w-5 h-5 text-muted-foreground" />
//               {cartCount > 0 && (
//                 <motion.span
//                   initial={{ scale: 0 }}
//                   animate={{ scale: 1 }}
//                   className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-primary text-primary-foreground text-xs font-bold rounded-full"
//                 >
//                   {cartCount}
//                 </motion.span>
//               )}
//             </Link>

//             {/* User/Login */}
//             <Link to={isAuthenticated ? '/dashboard' : '/login'}>
//               <Button variant="soft" size="sm" className="hidden md:flex">
//                 <User className="w-4 h-4" />
//                 {isAuthenticated ? 'Account' : 'Login'}
//               </Button>
//             </Link>

//             {/* Mobile Menu Toggle */}
//             <button
//               className="lg:hidden p-2 hover:bg-muted rounded-lg transition-colors"
//               onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//             >
//               {isMobileMenuOpen ? (
//                 <X className="w-6 h-6 text-foreground" />
//               ) : (
//                 <Menu className="w-6 h-6 text-foreground" />
//               )}
//             </button>
//           </div>
//         </div>
//       </nav>

//       {/* Mobile Menu */}
//       <AnimatePresence>
//         {isMobileMenuOpen && (
//           <motion.div
//             initial={{ opacity: 0, height: 0 }}
//             animate={{ opacity: 1, height: 'auto' }}
//             exit={{ opacity: 0, height: 0 }}
//             className="lg:hidden bg-background border-t border-border"
//           >
//             <div className="container-custom mx-auto px-4 py-4 space-y-2">
//               {navLinks.map((link) => (
//                 <Link
//                   key={link.path}
//                   to={link.path}
//                   className={cn(
//                     'block px-4 py-3 rounded-lg text-base font-medium transition-all duration-300',
//                     location.pathname === link.path
//                       ? 'text-primary bg-primary/10'
//                       : 'text-muted-foreground hover:text-foreground hover:bg-muted'
//                   )}
//                 >
//                   {link.name}
//                 </Link>
//               ))}
//               <div className="pt-4 border-t border-border">
//                 <Link to={isAuthenticated ? '/dashboard' : '/login'}>
//                   <Button variant="hero" className="w-full">
//                     <User className="w-4 h-4" />
//                     {isAuthenticated ? 'My Account' : 'Login / Sign Up'}
//                   </Button>
//                 </Link>
//               </div>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </header>
//   );
// }




import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, User, Menu, X, Search, Heart, Flower2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStore } from '@/lib/store';
import { cn } from '@/lib/utils';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Shop', path: '/shop' },
  { name: 'Custom Bouquet', path: '/custom-bouquet' },
  { name: 'Gifting', path: '/gifting' },
  { name: 'Decoration', path: '/decoration' },
  { name: 'Offers', path: '/offers' },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { getCartCount, isAuthenticated, getLikedCount } = useStore();
  const cartCount = getCartCount();
  const likedCount = getLikedCount();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        isScrolled
          ? 'bg-background/95 backdrop-blur-lg shadow-soft border-b border-border/50'
          : 'bg-transparent'
      )}
    >
      <nav className="container-custom mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <Flower2 className="w-8 h-8 text-primary transition-transform duration-500 group-hover:rotate-12" />
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
            <span className="font-display text-2xl font-bold text-gradient">
              Bloomora
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300',
                  location.pathname === link.path
                    ? 'text-primary bg-primary/10'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Search - Desktop */}
            <Link
              to="/shop"
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
            >
              <Search className="w-4 h-4" />
              <span className="text-sm">Search flowers...</span>
            </Link>

            {/* Search - Mobile */}
            <Link to="/shop" className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors">
              <Search className="w-5 h-5 text-muted-foreground" />
            </Link>

            {/* Wishlist */}
            <Link to="/liked-flowers" className="hidden md:flex relative p-2 hover:bg-muted rounded-lg transition-colors">
              <Heart className="w-5 h-5 text-muted-foreground" />
              {likedCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-primary text-primary-foreground text-xs font-bold rounded-full"
                >
                  {likedCount}
                </motion.span>
              )}
            </Link>

            {/* Cart */}
            <Link to="/cart" className="relative p-2 hover:bg-muted rounded-lg transition-colors">
              <ShoppingCart className="w-5 h-5 text-muted-foreground" />
              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-primary text-primary-foreground text-xs font-bold rounded-full"
                >
                  {cartCount}
                </motion.span>
              )}
            </Link>

            {/* User/Login */}
            <Link to={isAuthenticated ? '/dashboard' : '/login'}>
              <Button variant="soft" size="sm" className="hidden md:flex">
                <User className="w-4 h-4" />
                {isAuthenticated ? 'Account' : 'Login'}
              </Button>
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden p-2 hover:bg-muted rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-foreground" />
              ) : (
                <Menu className="w-6 h-6 text-foreground" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-background border-t border-border"
          >
            <div className="container-custom mx-auto px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    'block px-4 py-3 rounded-lg text-base font-medium transition-all duration-300',
                    location.pathname === link.path
                      ? 'text-primary bg-primary/10'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  )}
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 border-t border-border">
                <Link to={isAuthenticated ? '/dashboard' : '/login'}>
                  <Button variant="hero" className="w-full">
                    <User className="w-4 h-4" />
                    {isAuthenticated ? 'My Account' : 'Login / Sign Up'}
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
