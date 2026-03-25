import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Product Types
export interface Product {
  id: string;
  name: string;
  image?: string;
  image_url?: string;
  category: string;
  isBestselling?: boolean;
  rating: number;
  reviews?: number;
  review_count?: number;
  price: number;
  originalPrice?: number;
  original_price?: number;
  discount_label?: string;
  tags?: string[];
  description?: string;
  inStock?: boolean;
}

export interface BestSellingResponse {
  status: number;
  success: string;
  Total_Data: number;
  Data: Product[];
}


export interface CartItem extends Product {
  image?: string;
  quantity: number;
  deliveryType?: 'express' | 'standard';
}

export interface BouquetCustomization {
  flowers: { type: string; color: string; quantity: number }[];
  wrapStyle: string;
  addOns: string[];
  message?: string;
}

export interface SavedBouquet extends BouquetCustomization {
  id: string;
  name: string;
  createdAt: Date;
  totalPrice: number;
}

// User Types
export interface User {
  id: string;
  email: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  addresses?: Address[];
}

export interface Address {
  id: string;
  label: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export interface Reminder {
  id: string;
  title: string;
  date: string;
  occasion: string;
  recurring: boolean;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
  deliveryType: 'express' | 'standard';
  address: Address;
  createdAt: Date;
  couponApplied?: string;
}

// Store Interface
interface StoreState {
  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;

  // User
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;

  // Saved Bouquets
  savedBouquets: SavedBouquet[];
  setSavedBouquets: (bouquets: SavedBouquet[]) => void;
  saveBouquet: (bouquet: SavedBouquet) => void;
  removeBouquet: (id: string) => void;

  // Orders
  orders: Order[];
  setOrders: (orders: Order[]) => void;
  addOrder: (order: Order) => void;

  // Reminders
  reminders: Reminder[];
  addReminder: (reminder: Reminder) => void;
  removeReminder: (id: string) => void;

  // Coupon
  appliedCoupon: string | null;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;

  // Delivery
  deliveryType: 'express' | 'standard';
  setDeliveryType: (type: 'express' | 'standard') => void;

  // Wishlist
  likedProducts: Product[];
  toggleLike: (product: Product) => void;
  isLiked: (productId: string) => boolean;
  getLikedCount: () => number;
  // Admin Auth (frontend-only dummy)
  isAdminAuthenticated: boolean;
  setAdminAuthenticated: (val: boolean) => void;

  // Admin Products CRUD
  adminProducts: Product[];
  setAdminProducts: (products: Product[]) => void;
  addAdminProduct: (product: Product) => void;
  updateAdminProduct: (id: string, updates: Partial<Product>) => void;
  deleteAdminProduct: (id: string) => void;
}

// Available Coupons
const validCoupons: Record<string, number> = {
  'BLOOM10': 10,
  'FIRSTORDER': 15,
  'EXOTIC20': 20,
  'LOVE25': 25,
};

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Cart
      cart: [],

      addToCart: (product, quantity = 1) => {
        set((state) => {
          const existingItem = state.cart.find((item) => item.id === product.id);
          if (existingItem) {
            return {
              cart: state.cart.map((item) =>
                item.id === product.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }
          return {
            cart: [...state.cart, { ...product, quantity }],
          };
        });
      },

      removeFromCart: (productId) => {
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== productId),
        }));
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(productId);
          return;
        }
        set((state) => ({
          cart: state.cart.map((item) =>
            item.id === productId ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () => set({ cart: [] }),

      getCartTotal: () => {
        const state = get();
        let total = state.cart.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );

        // Apply coupon discount
        if (state.appliedCoupon && validCoupons[state.appliedCoupon]) {
          total = total * (1 - validCoupons[state.appliedCoupon] / 100);
        }

        // Add delivery charge
        if (state.deliveryType === 'express') {
          total += 99;
        }

        return Math.round(total);
      },

      getCartCount: () => {
        return get().cart.reduce((sum, item) => sum + item.quantity, 0);
      },

      // User
      user: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),

      // Saved Bouquets
      savedBouquets: [],
      setSavedBouquets: (bouquets) => set({ savedBouquets: bouquets }),
      saveBouquet: (bouquet) =>
        set((state) => ({
          savedBouquets: [...state.savedBouquets, bouquet],
        })),
      removeBouquet: (id) =>
        set((state) => ({
          savedBouquets: state.savedBouquets.filter((b) => b.id !== id),
        })),

      // Orders
      orders: [],
      setOrders: (fetchedOrders) => set({ orders: fetchedOrders }),
      addOrder: (order) =>
        set((state) => ({
          orders: [order, ...state.orders],
        })),

      // Reminders
      reminders: [],
      addReminder: (reminder) =>
        set((state) => ({
          reminders: [...state.reminders, reminder],
        })),
      removeReminder: (id) =>
        set((state) => ({
          reminders: state.reminders.filter((r) => r.id !== id),
        })),

      // Coupon
      appliedCoupon: null,
      applyCoupon: (code) => {
        const upperCode = code.toUpperCase();
        if (validCoupons[upperCode]) {
          set({ appliedCoupon: upperCode });
          return true;
        }
        return false;
      },
      removeCoupon: () => set({ appliedCoupon: null }),

      // Delivery
      deliveryType: 'standard',
      setDeliveryType: (type) => set({ deliveryType: type }),

      // Wishlist
      likedProducts: [],
      toggleLike: (product) => {
        set((state) => {
          const exists = state.likedProducts.some((p) => p.id === product.id);
          return {
            likedProducts: exists
              ? state.likedProducts.filter((p) => p.id !== product.id)
              : [...state.likedProducts, product],
          };
        });
      },
      isLiked: (productId) => {
        return get().likedProducts.some((p) => p.id === productId);
      },
      getLikedCount: () => {
        return get().likedProducts.length;
      },

      // Admin Auth
      isAdminAuthenticated: false,
      setAdminAuthenticated: (val) => set({ isAdminAuthenticated: val }),

      // Admin Products
      adminProducts: [],
      setAdminProducts: (products) => set({ adminProducts: products }),
      addAdminProduct: (product) => set((state) => ({ adminProducts: [...state.adminProducts, product] })),
      updateAdminProduct: (id, updates) => set((state) => ({
        adminProducts: state.adminProducts.map((p) => p.id === id ? { ...p, ...updates } : p)
      })),
      deleteAdminProduct: (id) => set((state) => ({
        adminProducts: state.adminProducts.filter((p) => p.id !== id)
      })),
    }),
    {
      name: 'bloomora-store',
    }
  )
);
