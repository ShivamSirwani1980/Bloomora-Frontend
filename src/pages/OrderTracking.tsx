
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  ChevronRight, 
  ArrowLeft,
  Loader2,
  Phone,
  MessageSquare,
  Star,
  Send,
  Heart
} from 'lucide-react';
import { useStore } from '@/lib/store';
import { toast } from 'sonner';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Stylized Map Component
const AnimatedMap = ({ status }: { status: string }) => {
  const isDelivered = status?.toLowerCase() === "delivered";
  const isOutForDelivery = status?.toLowerCase() === "out for delivery";
  const isPacked = status?.toLowerCase() === "packed" || isOutForDelivery || isDelivered;
  
  // Animation progress based on status
  const progress = isDelivered ? 1 : isOutForDelivery ? 0.7 : isPacked ? 0.3 : 0.05;

  return (
    <div className="relative w-full aspect-[16/9] bg-stone-50 rounded-3xl overflow-hidden border border-stone-200 shadow-inner">
      {/* Decorative Grid */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
      
      <svg viewBox="0 0 800 450" className="w-full h-full">
        {/* Animated Path */}
        <motion.path
          d="M 100 350 Q 200 300 300 350 T 500 250 T 700 150"
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <motion.path
          d="M 100 350 Q 200 300 300 350 T 500 250 T 700 150"
          fill="none"
          stroke="url(#gradient)"
          strokeWidth="6"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: progress }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />

        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#fb7185" />
            <stop offset="100%" stopColor="#e11d48" />
          </linearGradient>
        </defs>

        {/* Start Point (Florist) */}
        <circle cx="100" cy="350" r="8" fill="#e11d48" className="animate-pulse" />
        <text x="90" y="380" className="text-[12px] font-bold fill-stone-400">Bloomora Florist</text>

        {/* End Point (Customer) */}
        <circle cx="700" cy="150" r="8" fill="#cbd5e1" />
        <MapPin className="text-stone-300" x="690" y="110" width="20" height="20" />
        <text x="660" y="180" className="text-[12px] font-bold fill-stone-400">Delivery Address</text>

        {/* Delivery Vehicle Shadow */}
        <motion.circle
          r="4"
          fill="rgba(0,0,0,0.1)"
          initial={{ offsetDistance: "0%" }}
          animate={{ x: [0, 800 * progress], y: [0, -200 * progress] }} // Simple approx for SVG path mapping
          style={{ display: 'none' }} // Replaced by more complex path follow if needed
        />
      </svg>

      {/* Floating Delivery Marker */}
      <motion.div
        className="absolute z-10"
        initial={{ left: '12.5%', top: '77%' }}
        animate={{ 
          left: `${12.5 + (75 * progress)}%`, 
          top: `${77 - (44 * progress)}%` 
        }}
        transition={{ duration: 2, ease: "easeInOut" }}
      >
        <div className="relative group">
          <div className="absolute -inset-4 bg-rose-500/20 blur-xl rounded-full scale-150 animate-pulse" />
          <div className="bg-rose-600 p-2.5 rounded-2xl shadow-xl border-2 border-white transform -rotate-12 group-hover:rotate-0 transition-transform">
            <Truck className="w-6 h-6 text-white" />
          </div>
          {isOutForDelivery && (
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white px-3 py-1 rounded-full shadow-lg border border-stone-100 whitespace-nowrap">
              <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider">Fast Moving</span>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default function OrderTracking() {
  const { id } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const cleanId = id?.replace(/^#/, '');
        const response = await fetch(`http://127.0.0.1:8000/api/v1/main/Bloomora/Order/Tracking/?order_id=${cleanId}`);
        const data = await response.json();
        if (data.status === 200) {
          setOrder(data.order);
        }
      } catch (err) {
        console.error("Tracking Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
    
    // Poll for updates every 30 seconds
    const interval = setInterval(fetchOrder, 30000);
    return () => clearInterval(interval);
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-rose-500" />
        </div>
      </Layout>
    );
  }

  if (!order) {
    return (
      <Layout>
        <div className="min-h-screen pt-40 text-center">
          <div className="bg-white max-w-md mx-auto p-12 rounded-[2rem] shadow-sm border border-stone-100">
            <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-6 text-stone-300">
              <Package size={40} />
            </div>
            <h1 className="text-2xl font-bold text-stone-900 mb-2">Order not found</h1>
            <p className="text-stone-500 mb-8">
              We couldn't find an order with the ID <span className="font-mono text-rose-500 font-bold bg-rose-50 px-2 py-1 rounded">{id}</span>
            </p>
            <div className="space-y-3">
              <Link to="/orders"><Button variant="hero" className="w-full">View My Orders</Button></Link>
              <Link to="/"><Button variant="ghost" className="w-full">Return Home</Button></Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const steps = [
    { key: "placed", label: "Order Placed", icon: Package, date: order.timeline?.placed },
    { key: "packed", label: "Preparation", icon: Clock, date: order.timeline?.packed },
    { key: "out_for_delivery", label: "Out for Delivery", icon: Truck, date: order.timeline?.out_for_delivery },
    { key: "delivered", label: "Delivered", icon: CheckCircle2, date: order.timeline?.delivered },
  ];

  const currentStatusIndex = steps.findIndex(s => s.date === null) - 1;
  const statusToDisplay = currentStatusIndex === -2 ? steps.length - 1 : currentStatusIndex;

  const getRealTimeEstimation = () => {
    if (order.order_status?.toLowerCase() === "delivered") return "Delivered";
    const now = new Date();
    let minMinutes = 120;
    let maxMinutes = 240;
    
    if (order.order_status === "Out for Delivery") {
      minMinutes = 20;
      maxMinutes = 50;
    } else if (order.order_status === "Packed") {
      minMinutes = 60;
      maxMinutes = 90;
    }

    const formatTime = (d: Date) => d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const start = new Date(now.getTime() + minMinutes * 60 * 1000);
    const end = new Date(now.getTime() + maxMinutes * 60 * 1000);
    return `Today, ${formatTime(start)} - ${formatTime(end)}`;
  };

  return (
    <Layout>
      <div className="pt-24 pb-16 min-h-screen bg-stone-50/50">
        <div className="container-custom mx-auto px-4 lg:px-8">
          
          <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <Link to="/orders" className="flex items-center gap-1 text-sm text-stone-500 hover:text-rose-600 transition-colors mb-4 group">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to Orders
              </Link>
              <h1 className="font-display text-3xl font-bold tracking-tight text-stone-900">
                Track Order <span className="text-rose-600">{order.display_id}</span>
              </h1>
              <p className="text-stone-500 font-medium mt-1">
                Estimated Delivery: <span className="text-stone-900">{getRealTimeEstimation()}</span>
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Link to="/contact">
                <Button 
                  variant="outline" 
                  className="rounded-2xl border-stone-200 bg-white hover:bg-stone-50 text-stone-600"
                >
                  <Phone className="w-4 h-4 mr-2" /> Support
                </Button>
              </Link>
            </div>
          </div>

          <div className="space-y-8">
            {/* Timeline Card */}
            <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-stone-100">
              <h2 className="font-display text-2xl font-bold mb-10 text-center">Delivery Progress</h2>
              
              <div className="relative">
                {/* Vertical Line for Mobile */}
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-stone-100 md:hidden" />
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-4">
                  {steps.map((step, idx) => {
                    const isCompleted = step.date !== null;
                    const isCurrent = idx === statusToDisplay;
                    
                    return (
                      <div key={step.key} className="relative flex md:flex-col items-center gap-4 md:text-center">
                        <div className={cn(
                          "z-10 w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500",
                          isCompleted ? "bg-rose-500 text-white shadow-lg shadow-rose-200" : "bg-stone-50 text-stone-300 border border-stone-100"
                        )}>
                          <step.icon className={cn("w-7 h-7", isCurrent && "animate-bounce")} />
                        </div>
                        
                        <div className="md:mt-2">
                          <p className={cn(
                            "font-bold text-base mb-1",
                            isCompleted ? "text-stone-900" : "text-stone-400"
                          )}>
                            {step.label}
                          </p>
                          {!isCompleted && (
                            <p className="text-xs text-stone-300 font-medium tracking-tight">Pending Approval</p>
                          )}
                        </div>

                        {/* Horizontal Connector Line for Desktop */}
                        {idx < steps.length - 1 && (
                          <div className="hidden md:block absolute top-7 left-[60%] w-full h-[3px] bg-stone-100 overflow-hidden">
                            <motion.div 
                              className="h-full bg-rose-500"
                              initial={{ width: "0%" }}
                              animate={{ width: isCompleted ? "100%" : "0%" }}
                              transition={{ duration: 0.8, delay: idx * 0.2 }}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Map Card */}
            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-stone-100 overflow-hidden">
              <div className="flex items-center justify-between mb-8 px-2">
                <div>
                   <h2 className="font-display text-2xl font-bold">Real-time Delivery Map</h2>
                   <p className="text-stone-400 text-sm mt-1">Order route from florist to your doorstep</p>
                </div>
                <div className="flex items-center gap-3 bg-stone-50 px-4 py-2 rounded-full border border-stone-100">
                  <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-xs font-bold text-stone-600 uppercase tracking-widest">Live Tracking</span>
                </div>
              </div>
              <div className="rounded-3xl overflow-hidden border border-stone-100">
                <AnimatedMap status={order.order_status} />
              </div>
              <div className="mt-8 flex items-center justify-center gap-8 py-4 border-t border-stone-50">
                <div className="text-center">
                   <p className="text-[10px] uppercase tracking-widest text-stone-400 font-bold mb-1">Status</p>
                   <p className="font-bold text-stone-900">{order.order_status}</p>
                </div>
                <div className="w-px h-8 bg-stone-100" />
                <div className="text-center">
                   <p className="text-[10px] uppercase tracking-widest text-stone-400 font-bold mb-1">Method</p>
                   <p className="font-bold text-stone-900">{order.delivery_type || "Express"}</p>
                </div>
                <div className="w-px h-8 bg-stone-100" />
                <div className="text-center">
                   <p className="text-[10px] uppercase tracking-widest text-stone-400 font-bold mb-1">Destination</p>
                   <p className="font-bold text-stone-900">{order.delivery_address?.city || "Mumbai"}</p>
                </div>
              </div>
            </div>

            {/* Feedback Section (Visible when Delivered) */}
            <FeedbackPrompt order={order} />
          </div>
        </div>
      </div>
    </Layout>
  );
}

function FeedbackPrompt({ order }: { order: any }) {
  const isDelivered = order.order_status?.toLowerCase() === "delivered";
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { user } = useStore();

  const handleSubmit = async () => {
    if (!comment.trim()) {
      toast.error("Please share a little about your experience.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/v1/main/Bloomora/Feedback/Submit/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: user?.firstName || "Bloomora Customer",
          location: "India",
          rating,
          comment,
          order_id: order.order_id || order.id,
          user_email: user?.email
        }),
      });

      const data = await response.json();
      if (data.status === 200) {
        toast.success("Thank you for your beautiful feedback!");
        setSubmitted(true);
      } else {
        toast.error(data.message || "Failed to submit feedback.");
      }
    } catch (error) {
      console.error("Feedback error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isDelivered) return null;
  if (submitted) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-green-50 rounded-[2.5rem] p-10 border border-green-100 text-center"
      >
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white">
          <CheckCircle2 size={32} />
        </div>
        <h3 className="text-xl font-bold text-green-900 mb-2">Feedback Received!</h3>
        <p className="text-green-700">Thank you for helping us grow better. Your words inspire our florists!</p>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-stone-100 flex flex-col md:flex-row gap-10 items-center"
    >
      <div className="flex-1">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest mb-4">
           <Heart className="w-3.5 h-3.5 fill-primary" />
           Share the Love
        </div>
        <h2 className="font-display text-3xl font-bold mb-4">How was your Bloomora experience?</h2>
        <p className="text-stone-500 mb-6">Your feedback helps us create more magical moments. Please rate your delivery and the quality of your flowers.</p>
        
        <div className="flex gap-2 mb-8">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              className="focus:outline-none transition-transform hover:scale-110"
            >
              <Star 
                className={cn(
                  "w-10 h-10 transition-colors",
                  star <= rating ? "fill-gold text-gold" : "text-stone-200"
                )} 
              />
            </button>
          ))}
        </div>

        <div className="space-y-4">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Tell us what you loved about your flowers..."
            className="w-full h-32 bg-stone-50 rounded-2xl p-4 border border-stone-100 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none text-stone-700"
          />
          <Button 
            variant="hero" 
            size="xl" 
            className="w-full md:w-auto px-10 rounded-xl"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Send className="w-5 h-5 mr-2" />}
            Submit Feedback
          </Button>
        </div>
      </div>
      <div className="hidden lg:block w-1/3">
        <div className="relative aspect-square">
           <div className="absolute inset-0 bg-primary/5 rounded-full animate-pulse" />
           <div className="absolute inset-4 bg-primary/10 rounded-full" />
           <img 
             src="https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=1000&auto=format&fit=crop" 
             alt="Flowers" 
             className="absolute inset-8 w-[calc(100%-64px)] h-[calc(100%-64px)] object-cover rounded-full shadow-2xl border-4 border-white"
           />
        </div>
      </div>
    </motion.div>
  );
}
