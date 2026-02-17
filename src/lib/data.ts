import roseBouquet from '@/assets/flowers/rose-bouquet.jpg';
import orchidArrangement from '@/assets/flowers/orchid-arrangement.jpg';
import peonyBouquet from '@/assets/flowers/peony-bouquet.jpg';
import exoticArrangement from '@/assets/flowers/exotic-arrangement.jpg';
import sunflowerBouquet from '@/assets/flowers/sunflower-bouquet.jpg';
import lilyTulipBouquet from '@/assets/flowers/lily-tulip-bouquet.jpg';
import redRoses from '@/assets/flowers/red-roses.jpg';
import weddingDecor from '@/assets/decorations/wedding.jpg';
import engagementDecor from '@/assets/decorations/engagement.jpg';
import birthdayDecor from '@/assets/decorations/birthday.jpg';
import corporateDecor from '@/assets/decorations/corporate.jpg';


export const products = [
  {
    id: '1',
    name: 'Elegant Pink Rose Bouquet',
    price: 1299,
    originalPrice: 1599,
    image: roseBouquet,
    category: 'Bouquets',
    tags: ['bestseller', 'roses'],
    description: 'A stunning arrangement of soft pink roses, perfect for expressing love and appreciation. Hand-tied with premium ribbon.',
    inStock: true,
    rating: 4.8,
    reviews: 234,
  },
  {
    id: '2',
    name: 'Exotic Orchid Collection',
    price: 2499,
    originalPrice: 2999,
    image: orchidArrangement,
    category: 'Exotic',
    tags: ['exotic', 'rare', 'orchids'],
    description: 'Luxurious purple and lavender orchids paired with fragrant lavender. A statement piece for any occasion.',
    inStock: true,
    rating: 4.9,
    reviews: 156,
  },
  {
    id: '3',
    name: 'Blush Peony Paradise',
    price: 1899,
    originalPrice: 2199,
    image: peonyBouquet,
    category: 'Premium',
    tags: ['premium', 'peonies', 'wedding'],
    description: 'Delicate white and blush peonies arranged in a romantic bouquet. Perfect for weddings and special celebrations.',
    inStock: true,
    rating: 4.9,
    reviews: 189,
  },
  {
    id: '4',
    name: 'Tropical Paradise Arrangement',
    price: 3299,
    image: exoticArrangement,
    category: 'Exotic',
    tags: ['exotic', 'rare', 'tropical'],
    description: 'A vibrant mix of Bird of Paradise, Protea, and exotic tropical blooms. Brings the essence of paradise to your space.',
    inStock: true,
    rating: 4.7,
    reviews: 98,
  },
  {
    id: '5',
    name: 'Sunshine Sunflower Bouquet',
    price: 999,
    originalPrice: 1199,
    image: sunflowerBouquet,
    category: 'Bouquets',
    tags: ['sunflowers', 'cheerful'],
    description: 'Bright and cheerful sunflowers to light up anyones day. A perfect gift to spread happiness and warmth.',
    inStock: true,
    rating: 4.6,
    reviews: 312,
  },
  {
    id: '6',
    name: 'Spring Lily & Tulip Mix',
    price: 1499,
    image: lilyTulipBouquet,
    category: 'Seasonal',
    tags: ['spring', 'lilies', 'tulips'],
    description: 'Elegant white lilies paired with soft pink tulips. A fresh arrangement that celebrates the beauty of spring.',
    inStock: true,
    rating: 4.8,
    reviews: 167,
  },
  {
    id: '7',
    name: 'Romantic Red Roses',
    price: 1799,
    originalPrice: 2099,
    image: redRoses,
    category: 'Roses',
    tags: ['bestseller', 'roses', 'romantic'],
    description: 'Classic red roses wrapped in premium kraft paper with a satin ribbon. The timeless symbol of love.',
    inStock: true,
    rating: 4.9,
    reviews: 456,
  },
];

export const categories = [
  { id: 'all', name: 'All Flowers', icon: '🌸' },
  { id: 'roses', name: 'Roses', icon: '🌹' },
  { id: 'bouquets', name: 'Bouquets', icon: '💐' },
  { id: 'exotic', name: 'Exotic', icon: '🌺' },
  { id: 'premium', name: 'Premium', icon: '✨' },
  { id: 'seasonal', name: 'Seasonal', icon: '🌷' },
];

export const occasions = [
  'Birthday',
  'Anniversary',
  'Wedding',
  'Valentine\'s Day',
  'Mother\'s Day',
  'Get Well Soon',
  'Congratulations',
  'Sympathy',
  'Thank You',
  'Just Because',
];

export const flowerTypes = [
  { name: 'Roses', price: 80, colors: ['Red', 'Pink', 'White', 'Yellow', 'Peach'] },
  { name: 'Lilies', price: 120, colors: ['White', 'Pink', 'Orange', 'Yellow'] },
  { name: 'Orchids', price: 200, colors: ['Purple', 'White', 'Pink', 'Blue'] },
  { name: 'Tulips', price: 100, colors: ['Red', 'Pink', 'Yellow', 'Purple', 'White'] },
  { name: 'Peonies', price: 180, colors: ['Pink', 'White', 'Coral', 'Burgundy'] },
  { name: 'Sunflowers', price: 90, colors: ['Yellow', 'Orange', 'Red'] },
  { name: 'Carnations', price: 50, colors: ['Red', 'Pink', 'White', 'Purple'] },
  { name: 'Hydrangeas', price: 150, colors: ['Blue', 'Pink', 'White', 'Purple'] },
];

export const wrapStyles = [
  { name: 'Classic Kraft Paper', price: 0 },
  { name: 'Premium Satin Wrap', price: 199 },
  { name: 'Elegant Box', price: 349 },
  { name: 'Luxury Hat Box', price: 499 },
  { name: 'Glass Vase', price: 599 },
];

export const addOns = [
  { name: 'Greeting Card', price: 49 },
  { name: 'Premium Chocolates', price: 299 },
  { name: 'Cute Teddy Bear', price: 399 },
  { name: 'Scented Candle', price: 249 },
  { name: 'Balloon Bunch', price: 199 },
  { name: 'Photo Frame', price: 349 },
];

export const giftCategories = [
  {
    id: 'birthday',
    name: 'Birthday',
    icon: '🎂',
    description: 'Make their birthday bloom with joy',
  },
  {
    id: 'anniversary',
    name: 'Anniversary',
    icon: '💕',
    description: 'Celebrate your love story',
  },
  {
    id: 'romantic',
    name: 'Romantic',
    icon: '❤️',
    description: 'Express your deepest feelings',
  },
  {
    id: 'apology',
    name: 'Apology',
    icon: '💐',
    description: 'Say sorry with beautiful blooms',
  },
  {
    id: 'festivals',
    name: 'Festivals',
    icon: '🪔',
    description: 'Celebrate festivals with flowers',
  },
  {
    id: 'congratulations',
    name: 'Congratulations',
    icon: '🎉',
    description: 'Celebrate achievements in style',
  },
];

export const decorationServices = [
  {
    id: 'wedding',
    name: 'Wedding Decoration',
    icon: '💒',
    description: 'Transform your wedding venue into a floral paradise',
    startingPrice: 25000,
    images: [weddingDecor],
  },
  {
    id: 'engagement',
    name: 'Engagement Party',
    icon: '💍',
    description: 'Create the perfect backdrop for your special moment',
    startingPrice: 15000,
    images: [engagementDecor],
  },
  {
    id: 'birthday',
    name: 'Birthday Celebration',
    icon: '🎈',
    description: 'Add floral magic to birthday celebrations',
    startingPrice: 8000,
    images: [birthdayDecor],
  },
  {
    id: 'corporate',
    name: 'Corporate Events',
    icon: '🏢',
    description: 'Professional floral arrangements for business events',
    startingPrice: 20000,
    images: [corporateDecor],
  },
];


export const coupons = [
  {
    code: 'BLOOM10',
    discount: 10,
    description: 'Get 10% off on your order',
    minOrder: 999,
    validTill: '2024-12-31',
  },
  {
    code: 'FIRSTORDER',
    discount: 15,
    description: '15% off on your first order',
    minOrder: 0,
    validTill: '2024-12-31',
  },
  {
    code: 'EXOTIC20',
    discount: 20,
    description: '20% off on exotic flowers',
    minOrder: 1999,
    validTill: '2024-12-31',
  },
  {
    code: 'LOVE25',
    discount: 25,
    description: '25% off on orders above ₹2999',
    minOrder: 2999,
    validTill: '2024-12-31',
  },
];

export const testimonials = [
  {
    id: 1,
    name: 'Priya Sharma',
    location: 'Mumbai',
    rating: 5,
    comment: 'Absolutely stunning flowers! The bouquet I ordered for my mother\'s birthday was beyond beautiful. Express delivery was super fast!',
    avatar: 'PS',
  },
  {
    id: 2,
    name: 'Rahul Verma',
    location: 'Delhi',
    rating: 5,
    comment: 'The custom bouquet feature is amazing! I could create exactly what I had in mind. My wife loved it!',
    avatar: 'RV',
  },
  {
    id: 3,
    name: 'Ananya Patel',
    location: 'Bangalore',
    rating: 5,
    comment: 'Bloomora made my wedding decoration dream come true. The team was professional and the results were magical!',
    avatar: 'AP',
  },
  {
    id: 4,
    name: 'Vikram Singh',
    location: 'Jaipur',
    rating: 4,
    comment: 'Great quality exotic flowers at reasonable prices. The packaging was premium and flowers stayed fresh for days.',
    avatar: 'VS',
  },
];

export const faqs = [
  {
    question: 'What are the delivery options available?',
    answer: 'We offer two delivery options: Express Delivery (10-30 minutes, ₹99 extra) for urgent orders, and Standard Delivery (2-4 hours, free) for regular orders. Same-day delivery is available for orders placed before 6 PM.',
  },
  {
    question: 'How do I track my order?',
    answer: 'Once your order is confirmed, you\'ll receive an SMS and email with a tracking link. You can also track your order from the "My Orders" section in your dashboard.',
  },
  {
    question: 'Can I customize my bouquet?',
    answer: 'Absolutely! Our Custom Bouquet Creator lets you choose flower types, colors, quantities, wrap styles, and add-ons. You can also add a personalized message card.',
  },
  {
    question: 'What if the flowers are not fresh?',
    answer: 'We guarantee 100% fresh flowers. If you receive flowers that are not fresh, contact us within 24 hours and we\'ll replace them or provide a full refund.',
  },
  {
    question: 'Do you offer same-day delivery?',
    answer: 'Yes! For orders placed before 6 PM, we offer same-day delivery. Express delivery ensures your flowers reach within 10-30 minutes (subject to availability).',
  },
  {
    question: 'How can I cancel or modify my order?',
    answer: 'You can cancel or modify your order within 1 hour of placing it. After that, please contact our support team. Note: Orders in transit cannot be cancelled.',
  },
  {
    question: 'Do you deliver to all locations?',
    answer: 'We currently deliver across major cities in India including Mumbai, Delhi, Bangalore, Chennai, Hyderabad, Pune, Kolkata, and more. Enter your pincode to check availability.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit/debit cards, UPI, net banking, and popular wallets like Paytm and PhonePe. Cash on delivery is also available in select areas.',
  },
];
