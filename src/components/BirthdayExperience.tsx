
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Cake, Gift, X, Sparkles, Star } from 'lucide-react';
import { useStore } from '@/lib/store';
import { cn } from '@/lib/utils';

const FLOWERS = ['🌸', '🌹', '🌻', '🌺', '🌷', '🌼', '✨'];

export function BirthdayExperience() {
  const { user, isAuthenticated } = useStore();
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(true);
  const [isBirthday, setIsBirthday] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user?.dob) {
      const today = new Date();
      const mm_dd = `-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      if (user.dob.includes(mm_dd)) {
        setIsBirthday(true);
      }
    }
  }, [user, isAuthenticated]);

  if (!isBirthday || !isVisible || location.pathname !== '/') return null;

  return (
    <>
      {/* 1. Festive Flower Rain Overlay */}
      <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              top: -50, 
              left: `${Math.random() * 100}%`,
              rotate: 0,
              opacity: 1,
              scale: Math.random() * 0.5 + 0.5
            }}
            animate={{ 
              top: '120%', 
              left: `${(Math.random() - 0.5) * 20 + (i * 100 / 30)}%`,
              rotate: [0, 180, 360, 540],
              opacity: [1, 1, 0]
            }}
            transition={{ 
              duration: Math.random() * 5 + 4, 
              repeat: Infinity,
              delay: Math.random() * 10,
              ease: "linear"
            }}
            className="absolute text-2xl md:text-3xl filter drop-shadow-sm"
          >
            {FLOWERS[i % FLOWERS.length]}
          </motion.div>
        ))}
      </div>

      {/* 2. Premium Birthday Banner */}
      <AnimatePresence>
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          className="fixed top-24 left-0 right-0 z-[49] px-4 md:px-8 pointer-events-none"
        >
          <div className="max-w-3xl mx-auto pointer-events-auto">
            <div className="relative group overflow-hidden bg-white/95 backdrop-blur-xl p-[1px] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-amber-200/50">
              {/* Subtle Animated Glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400/10 via-rose-400/10 to-amber-400/10 opacity-30 animate-pulse" />
              
              <div className="relative px-6 py-4 flex items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                  <div className="relative">
                    <div className="absolute inset-0 bg-amber-400/30 blur-2xl rounded-full animate-pulse" />
                    <div className="relative bg-gradient-to-br from-amber-500 to-amber-600 p-3 rounded-xl shadow-lg ring-4 ring-amber-50">
                      <Cake className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-0.5 text-amber-600 font-bold tracking-tight">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span className="text-xs uppercase">Your Special Day</span>
                    </div>
                    <h3 className="font-display font-bold text-stone-900 text-xl leading-tight">
                      Happy Birthday, {user?.firstName}! 🎂
                    </h3>
                    <p className="text-stone-500 text-sm mt-1">
                      Enjoy <span className="text-amber-600 font-bold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100">BIRTHDAYBLOOM</span> (15% OFF) today.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="hidden lg:flex flex-col items-end">
                    <div className="flex items-center gap-1.5 text-amber-600 font-bold text-sm bg-amber-50 px-3 py-1.5 rounded-full border border-amber-100 shadow-sm">
                      <Gift className="w-4 h-4" />
                      Premium Gift Unlocked
                    </div>
                  </div>
                  
                  <div className="h-10 w-[1px] bg-stone-100 mx-1 hidden sm:block" />
                  
                  <button 
                    onClick={() => setIsVisible(false)}
                    className="p-2 hover:bg-stone-50 text-stone-400 hover:text-stone-600 rounded-xl transition-all duration-300 active:scale-95 border border-transparent hover:border-stone-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  );
}
