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
export default function Checkout() {
  const navigate = useNavigate();
  const { cart, getCartTotal, clearCart, deliveryType, isAuthenticated } = useStore();

  const [address, setAddress] = useState({
    street: '', city: '', state: '', pincode: '',
  });
  const [isPaying, setIsPaying] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState<RazorpayResponse | null>(null);

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
        <div className="pt-24 section-padding">
          <div className="container-custom mx-auto max-w-lg text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <h1 className="font-display text-3xl font-bold text-foreground mb-2">
                Payment Successful! 🌸
              </h1>
              <p className="text-muted-foreground mb-6">
                Your order has been placed. Your flowers are on their way!
              </p>

              <div className="bg-card rounded-2xl p-6 border border-border text-left space-y-3 mb-8">
                <h2 className="font-semibold text-foreground flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-green-600" /> Payment Details
                </h2>
                <div className="text-sm space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Payment ID</span>
                    <span className="font-mono text-xs text-foreground">{paymentSuccess.razorpay_payment_id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Order ID</span>
                    <span className="font-mono text-xs text-foreground">{paymentSuccess.razorpay_order_id}</span>
                  </div>
                </div>
              </div>

              <Button variant="hero" size="xl" onClick={() => navigate('/dashboard')}>
                Go to Dashboard
              </Button>
            </motion.div>
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

    // Basic address validation
    if (!address.street || !address.city || !address.pincode) {
      toast.error('Please fill in your delivery address');
      return;
    }

    setIsPaying(true);

    try {
      // 1️⃣ Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded || !window.Razorpay) {
        toast.error('Could not load payment gateway. Check your internet connection.');
        setIsPaying(false);
        return;
      }

      // 2️⃣ Create Razorpay order on backend (with auth token)
      const orderRes = await fetch(`${API_BASE_URL}/api/v1/main/Bloomora/payment/create-order/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,   // 🔐 Send token to backend
        },
        body: JSON.stringify({
          amount: getCartTotal(),   // in rupees, backend converts to paise
          currency: 'INR',
        }),
      });

      if (orderRes.status === 401) {
        toast.error('Session expired. Please login again.');
        navigate('/login', { state: { from: '/checkout' } });
        return;
      }

      if (!orderRes.ok) {
        const err = await orderRes.json();
        throw new Error(err.error || 'Failed to create order');
      }

      const orderData = await orderRes.json();

      // 3️⃣ Open Razorpay Checkout
      const options: RazorpayOptions = {
        key: orderData.key_id,
        amount: orderData.amount,          // in paise
        currency: orderData.currency,
        name: 'Bloomora 🌸',
        description: 'Fresh Flowers Delivery',
        order_id: orderData.order_id,

        handler: async (response: RazorpayResponse) => {
          // 4️⃣ Verify payment on backend (with auth token)
          try {
            const verifyRes = await fetch(`${API_BASE_URL}/api/v1/main/Bloomora/payment/verify/`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,   // 🔐 Send token to backend
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();

            if (verifyData.success) {
              clearCart();
              setPaymentSuccess(response);
              toast.success('Payment verified! Order confirmed 🌸');
            } else {
              toast.error('Payment verification failed. Contact support.');
            }
          } catch {
            toast.error('Could not verify payment. Contact support.');
          }
        },

        prefill: {
          name: '',
          email: '',
          contact: '',
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
              <input
                placeholder="Street Address"
                className="input-premium md:col-span-2"
                value={address.street}
                onChange={(e) => setAddress({ ...address, street: e.target.value })}
              />
              <input
                placeholder="City"
                className="input-premium"
                value={address.city}
                onChange={(e) => setAddress({ ...address, city: e.target.value })}
              />
              <input
                placeholder="State"
                className="input-premium"
                value={address.state}
                onChange={(e) => setAddress({ ...address, state: e.target.value })}
              />
              <input
                placeholder="Pincode"
                className="input-premium"
                value={address.pincode}
                onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
              />
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
                  {deliveryType === 'express' ? '₹99' : 'FREE'}
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