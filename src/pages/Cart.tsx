import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trash2, Plus, Minus, ShoppingBag, Truck, Clock, Tag, ArrowRight } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { toast } from 'sonner';

export default function Cart() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    getCartTotal,
    deliveryType,
    setDeliveryType,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
  } = useStore();
  const [couponInput, setCouponInput] = useState('');

  const handleApplyCoupon = () => {
    if (applyCoupon(couponInput)) {
      toast.success('Coupon applied successfully!');
      setCouponInput('');
    } else {
      toast.error('Invalid coupon code');
    }
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryCharge = deliveryType === 'express' ? 99 : 0;
  const discount = appliedCoupon ? Math.round(subtotal * 0.1) : 0; // Simplified
  const total = getCartTotal();

  if (cart.length === 0) {
    return (
      <Layout>
        <div className="pt-24 section-padding">
          <div className="container-custom mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
                <ShoppingBag className="w-12 h-12 text-muted-foreground" />
              </div>
              <h1 className="font-display text-3xl font-bold text-foreground mb-4">
                Your Cart is Empty
              </h1>
              <p className="text-muted-foreground mb-8">
                Looks like you haven't added any flowers yet. Let's fix that!
              </p>
              <Link to="/shop">
                <Button variant="hero" size="lg">
                  Start Shopping
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="pt-24 section-padding">
        <div className="container-custom mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-3xl md:text-4xl font-bold text-foreground mb-8"
          >
            Shopping Cart
          </motion.h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-4 p-4 bg-card rounded-2xl border border-border"
                >
                  <div className="w-24 h-24 rounded-xl overflow-hidden bg-muted shrink-0">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl">
                        💐
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-foreground truncate">{item.name}</h3>
                    <p className="text-lg font-bold text-primary mt-1">₹{item.price}</p>

                    <div className="flex items-center gap-4 mt-3">
                      <div className="flex items-center gap-2 bg-muted rounded-lg">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-background rounded-lg transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-background rounded-lg transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-bold text-foreground">₹{item.price * item.quantity}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-card rounded-2xl p-6 border border-border sticky top-24"
              >
                <h2 className="text-lg font-semibold text-foreground mb-6">Order Summary</h2>

                {/* Delivery Options */}
                <div className="mb-6">
                  <p className="text-sm font-medium text-foreground mb-3">Delivery Type</p>
                  <div className="space-y-2">
                    <button
                      onClick={() => setDeliveryType('express')}
                      className={cn(
                        'w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all',
                        deliveryType === 'express'
                          ? 'border-green-500 bg-green-50'
                          : 'border-border hover:border-primary/50'
                      )}
                    >
                      <Truck className={cn('w-5 h-5', deliveryType === 'express' ? 'text-green-600' : 'text-muted-foreground')} />
                      <div className="flex-1 text-left">
                        <p className={cn('font-medium', deliveryType === 'express' ? 'text-green-800' : 'text-foreground')}>
                          Express (10-30 min)
                        </p>
                      </div>
                      <span className={cn('font-medium', deliveryType === 'express' ? 'text-green-600' : 'text-muted-foreground')}>
                        +₹99
                      </span>
                    </button>

                    <button
                      onClick={() => setDeliveryType('standard')}
                      className={cn(
                        'w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all',
                        deliveryType === 'standard'
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      )}
                    >
                      <Clock className={cn('w-5 h-5', deliveryType === 'standard' ? 'text-primary' : 'text-muted-foreground')} />
                      <div className="flex-1 text-left">
                        <p className={cn('font-medium', deliveryType === 'standard' ? 'text-foreground' : 'text-foreground')}>
                          Standard (2-4 hrs)
                        </p>
                      </div>
                      <span className="font-medium text-green-600">FREE</span>
                    </button>
                  </div>
                </div>

                {/* Coupon */}
                <div className="mb-6">
                  <p className="text-sm font-medium text-foreground mb-3">Apply Coupon</p>
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl border border-green-200">
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-green-600" />
                        <span className="font-mono font-medium text-green-800">{appliedCoupon}</span>
                      </div>
                      <button
                        onClick={removeCoupon}
                        className="text-sm text-green-600 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                        placeholder="Enter code"
                        className="flex-1 input-premium text-sm"
                      />
                      <Button variant="outline" size="sm" onClick={handleApplyCoupon}>
                        Apply
                      </Button>
                    </div>
                  )}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 py-4 border-t border-border">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-foreground">₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Delivery</span>
                    <span className={deliveryCharge === 0 ? 'text-green-600' : 'text-foreground'}>
                      {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
                    </span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discount</span>
                      <span>-₹{discount}</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between py-4 border-t border-border">
                  <span className="text-lg font-semibold text-foreground">Total</span>
                  <span className="text-2xl font-bold text-primary">₹{total}</span>
                </div>

                <Link to="/checkout">
                  <Button variant="hero" size="lg" className="w-full">
                    Proceed to Checkout
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>

                <Link to="/shop" className="block mt-4">
                  <Button variant="ghost" className="w-full">
                    Continue Shopping
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
