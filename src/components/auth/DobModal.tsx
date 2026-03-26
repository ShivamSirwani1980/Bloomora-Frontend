import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Cake, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStore } from '@/lib/store';
import { toast } from 'sonner';
import axios from 'axios';
import { API_BASE_URL } from '@/lib/api';

interface DobModalProps {
  isOpen: boolean;
  email: string;
  onSuccess: (dob: string) => void;
}

export const DobModal: React.FC<DobModalProps> = ({ isOpen, email, onSuccess }) => {
  const [dob, setDob] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate the maximum date allowed (Today - 5 years)
  const todayDate = new Date();
  const maxDate = new Date(todayDate.getFullYear() - 5, todayDate.getMonth(), todayDate.getDate())
    .toISOString()
    .split("T")[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dob) {
      toast.error("Please select your date of birth.");
      return;
    }

    // Age validation (must be at least 5 years old)
    const birthDate = new Date(dob);
    let age = todayDate.getFullYear() - birthDate.getFullYear();
    const m = todayDate.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && todayDate.getDate() < birthDate.getDate())) {
      age--;
    }

    if (age < 5) {
      toast.error("You must be at least 5 years old.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/main/Bloomora/user/update-dob/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, dob }),
      });

      const data = await response.json();
      if (data.status === 200) {
        toast.success("Profile updated! Get ready for birthday surprises 🎂");
        onSuccess(dob);
      } else {
        toast.error(data.message || "Failed to update profile.");
      }
    } catch (error) {
      console.error("DOB Update Error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md bg-card border border-border rounded-[2.5rem] p-8 shadow-elevated overflow-hidden"
          >
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-40 h-40 bg-rose/10 rounded-full blur-3xl" />

            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-rose-dark flex items-center justify-center text-white mb-6 shadow-lg shadow-primary/20 mx-auto">
                <Cake className="w-8 h-8" />
              </div>

              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-2 flex items-center justify-center gap-2">
                  When's the party? <Sparkles className="w-5 h-5 text-gold animate-pulse" />
                </h2>
                <p className="text-muted-foreground">
                  Google didn't tell us your birthday! We need it to send you magical floral surprises.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-foreground/70 uppercase tracking-widest ml-1">
                    Your Date of Birth
                  </label>
                  <div className="relative group">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <input
                      type="date"
                      value={dob}
                      max={maxDate}
                      onChange={(e) => setDob(e.target.value)}
                      className="w-full h-14 bg-stone-50/50 dark:bg-stone-900/50 border border-border/50 rounded-2xl pl-12 pr-4 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                      required
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-14 rounded-2xl group relative overflow-hidden" 
                  disabled={isSubmitting}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2 text-lg font-bold">
                    {isSubmitting ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        Save My Birthday
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </span>
                </Button>

                <p className="text-[10px] text-center text-muted-foreground uppercase tracking-widest font-bold opacity-50">
                  Privacy Guaranteed • 100% Secure
                </p>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
