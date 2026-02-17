import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, CreditCard, MapPin } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useStore } from '@/lib/store';
import { toast } from 'sonner';

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, getCartTotal, clearCart, deliveryType } = useStore();
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState({ street: '', city: '', state: '', pincode: '' });

  const handlePlaceOrder = () => {
    toast.success('Order placed successfully!');
    clearCart();
    navigate('/dashboard');
  };

  if (cart.length === 0) {
    return (
      <Layout>
        <div className="pt-24 section-padding text-center">
          <h1 className="text-2xl font-bold mb-4">No items in cart</h1>
          <Link to="/shop"><Button variant="hero">Shop Now</Button></Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="pt-24 section-padding">
        <div className="container-custom mx-auto max-w-3xl">
          <h1 className="font-display text-3xl font-bold text-foreground mb-8">Checkout</h1>
          
          <div className="bg-card rounded-2xl p-6 border border-border mb-6">
            <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" /> Delivery Address
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <input placeholder="Street Address" className="input-premium md:col-span-2" value={address.street} onChange={(e) => setAddress({...address, street: e.target.value})} />
              <input placeholder="City" className="input-premium" value={address.city} onChange={(e) => setAddress({...address, city: e.target.value})} />
              <input placeholder="State" className="input-premium" value={address.state} onChange={(e) => setAddress({...address, state: e.target.value})} />
              <input placeholder="Pincode" className="input-premium" value={address.pincode} onChange={(e) => setAddress({...address, pincode: e.target.value})} />
            </div>
          </div>

          <div className="bg-card rounded-2xl p-6 border border-border mb-6">
            <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" /> Payment
            </h2>
            <p className="text-muted-foreground">Cash on Delivery / Card Payment (Demo)</p>
          </div>

          <div className="bg-card rounded-2xl p-6 border border-border">
            <div className="flex justify-between mb-4">
              <span className="text-muted-foreground">Items ({cart.length})</span>
              <span className="font-semibold">₹{getCartTotal()}</span>
            </div>
            <div className="flex justify-between mb-4">
              <span className="text-muted-foreground">Delivery ({deliveryType})</span>
              <span className="font-semibold">{deliveryType === 'express' ? '₹99' : 'FREE'}</span>
            </div>
            <div className="flex justify-between text-xl font-bold border-t pt-4">
              <span>Total</span>
              <span className="text-primary">₹{getCartTotal()}</span>
            </div>
            <Button variant="hero" className="w-full mt-6" onClick={handlePlaceOrder}>
              <CheckCircle className="w-5 h-5" /> Place Order
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
