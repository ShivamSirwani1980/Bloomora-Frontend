import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, CreditCard, MapPin, Loader2, ShieldCheck } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useStore } from '@/lib/store';
import { toast } from 'sonner';

// ─────────────────────────────────────────────────────────────
//  Type declarations for Razorpay (avoids TypeScript errors)
// ─────────────────────────────────────────────────────────────
declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill?: { name?: string; email?: string; contact?: string };
  theme?: { color?: string };
  modal?: { ondismiss?: () => void };
}

interface RazorpayInstance {
  open: () => void;
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

// ─────────────────────────────────────────────────────────────
//  Config
// ─────────────────────────────────────────────────────────────
// Strip trailing slash so URLs like `${API_BASE_URL}/payment/...` always work
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000').replace(/\/$/, '');

// ─────────────────────────────────────────────────────────────
//  Helper: load Razorpay checkout.js script once
// ─────────────────────────────────────────────────────────────
function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (document.getElementById('razorpay-script')) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.id = 'razorpay-script';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

// ─────────────────────────────────────────────────────────────
//  Component
// ─────────────────────────────────────────────────────────────
const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", 
  "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", 
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", 
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", 
  "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir", "Ladakh", 
  "Lakshadweep", "Puducherry"
].sort();

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, getCartTotal, clearCart, deliveryType, isAuthenticated, user, appliedCoupon, settings } = useStore();

  const paymentMethod = 'RAZORPAY'; // Default payment method for this component
  const [address, setAddress] = useState({
    street: '', city: '', state: '', pincode: '', phone: '',
  });
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [isPaying, setIsPaying] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState<RazorpayResponse | null>(null);
  const [brandedOrderId, setBrandedOrderId] = useState<string | null>(null);

  const validate = () => {
    const newErrors: Record<string, boolean> = {};
    if (!address.street.trim()) newErrors.street = true;
    if (!address.city.trim()) newErrors.city = true;
    if (!address.state.trim()) newErrors.state = true;
    // Pincode validation: 6 digits
    if (!/^\d{6}$/.test(address.pincode.trim())) newErrors.pincode = true;
    // Phone validation: 10 digits
    if (!/^\d{10}$/.test(address.phone.trim())) newErrors.phone = true;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

     console.log(cart);

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please login to continue with checkout');
      navigate('/login', { state: { from: '/checkout' } });
    }
  }, [isAuthenticated, navigate]);

  // Pre-load Razorpay script on mount
  useEffect(() => {
    loadRazorpayScript();
  }, []);

  // ── Auth protection rendering ──
  if (!isAuthenticated) {
    return null; // Don't render anything while redirecting
  }

  // ── Empty cart guard ──
  if (cart.length === 0 && !paymentSuccess) {
    return (
      <Layout>
        <div className="pt-24 section-padding text-center">
          <h1 className="text-2xl font-bold mb-4">No items in cart</h1>
          <Link to="/shop"><Button variant="hero">Shop Now</Button></Link>
        </div>
      </Layout>
    );
  }

  // ── Payment success screen ──
  if (paymentSuccess) {
    return (
      <Layout>
        <div className="pt-32 pb-24 section-padding min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-background via-primary/5 to-background">
          <div className="container-custom mx-auto max-w-xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="bg-card/40 backdrop-blur-xl rounded-[2.5rem] p-10 border border-border/50 shadow-elevated relative overflow-hidden"
            >
              {/* Premium Glow */}
              <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary/20 rounded-full blur-[80px]" />
              <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-primary/20 rounded-full blur-[80px]" />

              <div className="w-24 h-24 mx-auto mb-8 relative">
                <motion.div 
                  initial={{ rotate: -45, scale: 0 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                  className="w-full h-full rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg shadow-green-500/20"
                >
                  <CheckCircle className="w-12 h-12 text-white" />
                </motion.div>
                <motion.div 
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 rounded-full border-4 border-green-500/30"
                />
              </div>

              <h1 className="font-display text-4xl font-bold text-foreground mb-3 tracking-tight">
                Payment Successful! 🌸
              </h1>
              <p className="text-muted-foreground text-lg mb-8 max-w-sm mx-auto leading-relaxed">
                Your order was placed successfully. Your premium flowers are being prepared with love!
              </p>

              <div className="bg-muted/40 backdrop-blur-md rounded-2xl p-6 border border-border/50 text-left space-y-4 mb-10">
                <div className="flex items-center justify-between pb-4 border-b border-border/50">
                   <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-primary" />
                    <span className="font-semibold text-foreground">Booking Confirmed</span>
                   </div>
                   <span className="text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary">Priority Handling</span>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center bg-card/60 p-4 rounded-xl border border-border/30">
                    <span className="text-sm text-muted-foreground font-medium">Order ID</span>
                    <span className="font-display font-bold text-rose-500 text-lg tracking-wide">{brandedOrderId || "ORD-XXXXXX"}</span>
                  </div>
                  <div className="flex justify-between items-center px-3">
                    <span className="text-xs text-muted-foreground">Transaction ID</span>
                    <span className="font-mono text-[10px] text-muted-foreground/70 uppercase">{paymentSuccess.razorpay_payment_id}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <Button 
                  variant="hero" 
                  size="xl" 
                  onClick={() => navigate(`/order-tracking/${brandedOrderId}`)} 
                  className="w-full h-14 rounded-2xl shadow-lg shadow-primary/20"
                >
                  Track Order
                </Button>
                <button 
                  onClick={() => navigate('/dashboard')} 
                  className="text-xs font-bold text-stone-500 hover:text-rose-600 transition-colors uppercase tracking-widest mt-2"
                >
                  Go to Dashboard
                </button>
              </div>
            </motion.div>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-8 text-sm text-muted-foreground"
            >
              A confirmation email has been sent to your inbox.
            </motion.p>
          </div>
        </div>
      </Layout>
    );
  }

  // ── Main checkout handler ──
  const handlePayNow = async () => {
    // 🔐 Double-check auth before payment (in case token expired)
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) {
      toast.error('Session expired. Please login again.');
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }

    // Robust validation
    if (!validate()) {
      toast.error('Please fix the errors in your delivery address');
      return;
    }

    setIsPaying(true);

    try {
      // 🚀 Step 1: Call Integrated Checkout (Handles Cart + Auth + Init)
      const checkoutRes = await fetch(`${API_BASE_URL}/api/v1/main/Bloomora/IntegratedCheckout/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: user?.email,
          cart_items: cart.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            selections: item.selections // Preserve the recipe!
          })),
          delivery_type: deliveryType,
          coupon_code: useStore.getState().appliedCoupon,
          address: {
            street_address: address.street,
            city: address.city,
            state: address.state,
            pincode: address.pincode,
            phone: address.phone
          },
          payment_method: paymentMethod.toUpperCase()
        }),
      });

      const checkoutData = await checkoutRes.json();

      if (!checkoutRes.ok) {
        throw new Error(checkoutData.message || 'Checkout failed');
      }

      // 💳 Step 2: Handle COD (Immediate Success)
      if (paymentMethod.toUpperCase() === 'COD') {
        clearCart();
        navigate('/orders');
        toast.success('Order placed successfully! 🌸');
        return;
      }

      // 💳 Step 3: Handle RAZORPAY (Open Modal)
      const options: RazorpayOptions = { // Explicitly type options
        key: checkoutData.key_id,
        amount: checkoutData.amount,
        currency: 'INR',
        name: 'Bloomora',
        description: 'Thank you for your purchase',
        order_id: checkoutData.razorpay_order_id,
        handler: async function (response: RazorpayResponse) { // Explicitly type response
          try {
            // After successful payment, finalize/verify the order using the SAME endpoint
            const finalizeRes = await fetch(`${API_BASE_URL}/api/v1/main/Bloomora/IntegratedCheckout/`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
              },
              body: JSON.stringify({
                email: user?.email,
                address: {
                  street_address: address.street,
                  city: address.city,
                  state: address.state,
                  pincode: address.pincode,
                  phone: address.phone
                },
                payment_method: 'RAZORPAY',
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature
              }),
            });

            const finalizeData = await finalizeRes.json();

            if (finalizeRes.ok || finalizeData.status === 200) {
              clearCart();
              setBrandedOrderId(finalizeData.custom_order_id);
              setPaymentSuccess(response);
              toast.success('Payment successful! Order confirmed 🌸');
              // 5️⃣ Send order details to Integrated Checkout API
              try {
                const checkoutPayload = {
                  email: user?.email || "",
                  delivery_type: deliveryType,
                  coupon_code: appliedCoupon || "BLOOM10",
                  payment_method: "UPI",
                  cart_items: cart.map(item => ({
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    category: item.category || "Pre-made",
                    details: item.description || "Premium Arrangement"
                  })),
                  address: {
                    street_address: address.street,
                    city: address.city,
                    state: address.state,
                    pincode: address.pincode,
                    phone: address.phone
                  }
                };

                await fetch(`${API_BASE_URL}/api/v1/main/Bloomora/IntegratedCheckout/`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                  },
                  body: JSON.stringify(checkoutPayload),
                });
              } catch (error) {
                console.error('Failed to send integrated checkout data:', error);
              }
            } else {
              toast.error(finalizeData.message || 'Payment verification failed. Contact support.');
            }
          } catch (err) {
            toast.error('Could not verify payment. Contact support.');
          }
        },

        prefill: {
          name: user?.name || '',
          email: user?.email || '',
          contact: address.phone || '',
        },

        theme: { color: '#E91E8C' },

        modal: {
          ondismiss: () => {
            toast('Payment cancelled');
            setIsPaying(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Something went wrong';
      toast.error(message);
      setIsPaying(false);
    }
  };

  // ── Render ──
  return (
    <Layout>
      <div className="pt-24 section-padding">
        <div className="container-custom mx-auto max-w-3xl">
          <h1 className="font-display text-3xl font-bold text-foreground mb-8">Checkout</h1>

          {/* Delivery Address */}
          <div className="bg-card rounded-2xl p-6 border border-border mb-6">
            <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" /> Delivery Address
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <input
                  placeholder="Street Address"
                  className={`input-premium w-full ${errors.street ? 'border-red-500 bg-red-50/50' : ''}`}
                  value={address.street}
                  onChange={(e) => {
                    setAddress({ ...address, street: e.target.value });
                    if (errors.street) setErrors({ ...errors, street: false });
                  }}
                />
                {errors.street && <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest mt-1 ml-2">Street address is required</p>}
              </div>

              <div>
                <input
                  placeholder="City"
                  className={`input-premium w-full ${errors.city ? 'border-red-500 bg-red-50/50' : ''}`}
                  value={address.city}
                  onChange={(e) => {
                    setAddress({ ...address, city: e.target.value });
                    if (errors.city) setErrors({ ...errors, city: false });
                  }}
                />
                 {errors.city && <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest mt-1 ml-2">City is required</p>}
              </div>

              <div>
                <select
                  className={`input-premium w-full bg-transparent ${errors.state ? 'border-red-500 bg-red-50/50' : ''}`}
                  value={address.state}
                  onChange={(e) => {
                    setAddress({ ...address, state: e.target.value });
                    if (errors.state) setErrors({ ...errors, state: false });
                  }}
                >
                  <option value="" disabled className="text-muted-foreground bg-background">Select State</option>
                  {INDIAN_STATES.map(state => (
                    <option key={state} value={state} className="text-foreground bg-background">{state}</option>
                  ))}
                </select>
                {errors.state && <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest mt-1 ml-2">State is required</p>}
              </div>

              <div>
                <input
                  placeholder="Pincode"
                  className={`input-premium w-full ${errors.pincode ? 'border-red-500 bg-red-50/50' : ''}`}
                  value={address.pincode}
                  maxLength={6}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    setAddress({ ...address, pincode: val });
                    if (errors.pincode) setErrors({ ...errors, pincode: false });
                  }}
                />
                {errors.pincode && <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest mt-1 ml-2">Enter valid 6-digit pincode</p>}
              </div>

              <div className="md:col-span-2">
                <input
                  placeholder="Phone Number (10 digits)"
                  className={`input-premium w-full ${errors.phone ? 'border-red-500 bg-red-50/50' : ''}`}
                  value={address.phone}
                  maxLength={10}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    setAddress({ ...address, phone: val });
                    if (errors.phone) setErrors({ ...errors, phone: false });
                  }}
                />
                {errors.phone && <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest mt-1 ml-2">Enter valid 10-digit phone number</p>}
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-card rounded-2xl p-6 border border-border mb-6">
            <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" /> Payment
            </h2>
            <div className="flex items-center gap-3 p-4 rounded-xl border-2 border-primary bg-primary/5">
              <ShieldCheck className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium text-foreground">Razorpay Secure Payment</p>
                <p className="text-sm text-muted-foreground">
                  Cards · UPI · Net Banking · Wallets — all supported
                </p>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-card rounded-2xl p-6 border border-border">
            <h2 className="font-semibold text-foreground mb-4">Order Summary</h2>

            {/* Item list */}
            <div className="space-y-2 mb-4">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {item.name} × {item.quantity}
                  </span>
                  <span className="font-medium text-foreground">
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Items ({cart.reduce((s, i) => s + i.quantity, 0)})
                </span>
                <span className="font-semibold">
                  ₹{cart.reduce((s, i) => s + i.price * i.quantity, 0)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Delivery ({deliveryType})
                </span>
                <span className={deliveryType === 'express' ? 'font-semibold' : 'font-semibold text-green-600'}>
                  {deliveryType === 'express' ? `₹${settings?.express_delivery_fee ?? 99}` : 'FREE'}
                </span>
              </div>
            </div>

            <div className="flex justify-between text-xl font-bold border-t border-border mt-4 pt-4">
              <span>Total</span>
              <span className="text-primary">₹{getCartTotal()}</span>
            </div>

            {/* Pay Now button */}
            <Button
              variant="hero"
              className="w-full mt-6"
              size="xl"
              onClick={handlePayNow}
              disabled={isPaying}
            >
              {isPaying ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Opening Payment…
                </>
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5" />
                  Pay ₹{getCartTotal()} Securely
                </>
              )}
            </Button>

            <p className="text-xs text-center text-muted-foreground mt-3">
              🔒 Powered by Razorpay · 100% secure
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}