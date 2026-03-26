import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, MessageSquare, Quote, ArrowLeft, Loader2, Sparkles, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/layout/Layout';
import { API_BASE_URL } from '@/lib/api';


export default function Feedback() {
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/main/Bloomora/Feedback/All/`);
        const data = await response.json();
        if (data.status === 200) {
          setFeedbacks(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch feedbacks:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeedbacks();
  }, []);

  return (
    <Layout>
      <div className="pt-24 pb-20 min-h-screen bg-[#fcfaf9] dark:bg-background">
        <div className="container-custom mx-auto px-4 lg:px-8">
          
          {/* Header */}
          <div className="mb-12 flex flex-col items-center text-center">
             <Link to="/" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors mb-6 group">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to Home
              </Link>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-6"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Wall of Love
            </motion.div>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Voices of <span className="text-gradient">Bloomora</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl text-lg">
              Hear from our community about their floral journeys and the moments we helped make special.
            </p>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground font-medium">Gathering our favorite stories...</p>
            </div>
          ) : feedbacks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {feedbacks.map((fb, idx) => (
                <motion.div
                  key={fb.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-background rounded-2xl p-6 shadow-soft border border-border/50 h-full flex flex-col"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-rose flex items-center justify-center text-white font-bold shadow-md">
                      {fb.avatar}
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground leading-tight">{fb.name}</h3>
                      <p className="text-xs text-muted-foreground">{fb.location}</p>
                    </div>
                  </div>

                  <div className="flex gap-1 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-4 h-4 ${i < (fb.rating || 5) ? 'fill-gold text-gold' : 'text-muted/10'}`} 
                      />
                    ))}
                  </div>

                  <p className="text-muted-foreground text-sm leading-relaxed flex-grow italic">
                    "{fb.comment}"
                  </p>
                  
                  <div className="mt-6 pt-4 border-t border-border/20 flex items-center justify-between text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                    <span>Verified Story</span>
                    <Sparkles className="w-3 h-3 text-primary/40" />
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-dashed border-border rounded-[3rem] p-20 text-center">
              <MessageSquare className="w-16 h-16 text-muted-foreground mx-auto mb-6 opacity-20" />
              <h3 className="text-2xl font-bold mb-2 text-foreground">No stories yet</h3>
              <p className="text-muted-foreground mb-8 max-w-sm mx-auto font-medium">Be the first to share your experience after your order arrives!</p>
              <Link to="/orders">
                <Button variant="hero" size="lg" className="rounded-2xl px-12">View My Orders</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
