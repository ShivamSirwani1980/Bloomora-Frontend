import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'sonner';

// Product Types
export interface Product {
  id: string;
  name: string;
  image?: string;
  image_url?: string;
  category: string | string[];
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
  stock?: number;
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
  selections?: BouquetCustomization;
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
  dob?: string;
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

export interface Notification {
  _id: string;
  type: 'order' | 'stock' | 'booking' | 'generic';
  title: string;
  message: string;
  read: boolean;
  created_at: string;
  data?: any;
}

// Store Interface
interface StoreState {
  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => boolean;
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
  setAppliedCoupon: (code: string | null) => void;
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

  // Sync
  setCart: (cartItems: CartItem[]) => void;
  setLikedProducts: (products: Product[]) => void;
  clearUserSession: () => void;

  // Global Settings
  settings: any;
  setSettings: (settings: any) => void;

  // Notifications
  notifications: Notification[];
  unreadNotificationsCount: number;
  setNotifications: (notifications: Notification[]) => void;
  setUnreadNotificationsCount: (count: number) => void;
  fetchNotifications: () => Promise<void>;
  markNotificationRead: (id: string) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;
  
  // Support
  isSupportOpen: boolean;
  setSupportOpen: (open: boolean) => void;
  fetchSettings: () => Promise<void>;
  contactSupport: (data: { name: string; email: string; message: string }) => Promise<{ success: boolean; message: string }>;
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
        let success = true;
        set((state) => {
          const existingItem = state.cart.find((item) => item.id === product.id);
          const currentQty = existingItem ? existingItem.quantity : 0;
          const totalRequested = currentQty + quantity;
          
          // Check Stock Limit
          if (product.stock !== undefined && totalRequested > product.stock) {
            toast.error(`Only ${product.stock} units available for ${product.name}`);
            success = false;
            return { cart: state.cart };
          }

          if (existingItem) {
            return {
              cart: state.cart.map((item) =>
                item.id === product.id
                  ? { ...item, quantity: totalRequested }
                  : item
              ),
            };
          }
          return {
            cart: [...state.cart, { ...product, quantity: totalRequested }],
          };
        });
        return success;
      },

      removeFromCart: (productId) => {
        set((state) => {
          const newCart = state.cart.filter((item) => item.id !== productId);
          return {
            cart: newCart,
            appliedCoupon: newCart.length === 0 ? null : state.appliedCoupon,
            deliveryType: newCart.length === 0 ? 'standard' : state.deliveryType,
          };
        });
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(productId);
          return;
        }

        set((state) => {
          const item = state.cart.find((i) => i.id === productId);
          
          // Check Stock Limit
          if (item && item.stock !== undefined && quantity > item.stock) {
            toast.error(`Maximum stock reached (${item.stock} available)`);
            return { cart: state.cart };
          }

          return {
            cart: state.cart.map((i) =>
              i.id === productId ? { ...i, quantity } : i
            ),
          };
        });
      },

      clearCart: () => set({ 
        cart: [], 
        appliedCoupon: null, 
        deliveryType: 'standard' 
      }),

      getCartTotal: () => {
        const state = get();
        let total = state.cart.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );

        // Apply coupon discount
        let discountPercent = 0;
        if (state.appliedCoupon) {
          if (validCoupons[state.appliedCoupon]) {
            discountPercent = validCoupons[state.appliedCoupon];
          } else if (state.appliedCoupon === 'BIRTHDAYBLOOM') {
            discountPercent = 15;
          }
        }

        if (discountPercent > 0) {
          total = total * (1 - discountPercent / 100);
        }

        // Add delivery charge
        if (state.deliveryType === 'express') {
          const expressFee = state.settings?.express_delivery_fee ?? 99;
          total += expressFee;
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
      setAppliedCoupon: (code) => set({ appliedCoupon: code }),
      applyCoupon: (code) => {
        const upperCode = code.toUpperCase().trim();
        const state = get();

        if (upperCode === 'BIRTHDAYBLOOM') {
          if (!state.isAuthenticated || !state.user) {
            toast.error("Please login to use this coupon.");
            return false;
          }

          if (!state.user.dob) {
            toast.error("Birthday information not found.");
            return false;
          }

          const today = new Date();
          const mm_dd = `-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
          
          if (!state.user.dob.includes(mm_dd)) {
             toast.error("This coupon is only valid on your birthday!");
             return false;
          }

          set({ appliedCoupon: upperCode });
          toast.success("Birthday discount applied!");
          return true;
        }

        if (validCoupons[upperCode]) {
          set({ appliedCoupon: upperCode });
          toast.success("Coupon applied successfully!");
          return true;
        }

        toast.error("Invalid coupon code");
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

      // Sync specific methods
      setCart: (cartItems) => set({ cart: cartItems }),
      setLikedProducts: (products) => set({ likedProducts: products }),
      clearUserSession: () => set({
        cart: [],
        likedProducts: [],
        savedBouquets: [],
        orders: [],
        reminders: [],
        user: null,
        isAuthenticated: false,
        appliedCoupon: null,
        deliveryType: 'standard',
        settings: null,
      }),

      // Global Settings
      settings: null,
      setSettings: (settings) => set({ settings }),

      // Notifications
      notifications: [],
      unreadNotificationsCount: 0,
      setNotifications: (notifications) => set({ notifications }),
      setUnreadNotificationsCount: (unreadNotificationsCount) => set({ unreadNotificationsCount }),
      
      fetchNotifications: async () => {
        try {
          const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000').replace(/\/$/, '');
          const response = await fetch(`${API_BASE_URL}/api/v1/main/Bloomora/Admin/Notifications/`);
          const result = await response.json();
          if (result.status === 200) {
            set({ 
              notifications: result.data, 
              unreadNotificationsCount: result.unread_count 
            });
          }
        } catch (error) {
          console.error('Failed to fetch notifications:', error);
        }
      },

      markNotificationRead: async (id) => {
        try {
          const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000').replace(/\/$/, '');
          const response = await fetch(`${API_BASE_URL}/api/v1/main/Bloomora/Admin/Notifications/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ notification_id: id })
          });
          if (response.ok) {
            set((state) => ({
              notifications: state.notifications.map(n => n._id === id ? { ...n, read: true } : n),
              unreadNotificationsCount: Math.max(0, state.unreadNotificationsCount - 1)
            }));
          }
        } catch (error) {
          console.error('Failed to mark notification as read:', error);
        }
      },

      markAllNotificationsRead: async () => {
        try {
          const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000').replace(/\/$/, '');
          const response = await fetch(`${API_BASE_URL}/api/v1/main/Bloomora/Admin/Notifications/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ notification_id: null }) // null means mark all
          });
          if (response.ok) {
            set((state) => ({
              notifications: state.notifications.map(n => ({ ...n, read: true })),
              unreadNotificationsCount: 0
            }));
          }
        } catch (error) {
          console.error('Failed to mark all as read:', error);
        }
      },

      // Support
      isSupportOpen: false,
      setSupportOpen: (open) => set({ isSupportOpen: open }),

      fetchSettings: async () => {
        try {
          const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000').replace(/\/$/, '');
          const response = await fetch(`${API_BASE_URL}/api/v1/main/Bloomora/Admin/Settings/`);
          const result = await response.json();
          if (result.data) {
            set({ settings: result.data });
          }
        } catch (error) {
          console.error('Failed to fetch settings:', error);
        }
      },

      contactSupport: async (data) => {
        try {
          const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000').replace(/\/$/, '');
          const response = await fetch(`${API_BASE_URL}/api/v1/main/Bloomora/Support/Contact/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
          });
          const result = await response.json();
          if (response.ok) {
            return { success: true, message: result.message };
          }
          return { success: false, message: result.message || 'Failed to send message' };
        } catch (error) {
          return { success: false, message: 'Network error while sending message' };
        }
      }
    }),
    {
      name: 'bloomora-store',
    }
  )
);
