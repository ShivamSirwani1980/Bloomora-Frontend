import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Phone, 
  Mail, 
  MessageSquare, 
  X, 
  ChevronRight, 
  HelpCircle,
  Truck,
  RotateCcw,
  MapPin
} from 'lucide-react';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from '@/lib/utils';

const FAQS = [
  {
    question: "Where is my bouquet right now?",
    answer: "You can track your order in real-time using the 'Track Order' page. Our delivery partners update their GPS location every 30 seconds.",
    icon: Truck
  },
  {
    question: "Can I change the delivery address?",
    answer: "If your order hasn't left the florist yet, we can update the address. Please contact support immediately via WhatsApp or Phone.",
    icon: MapPin
  },
  {
    question: "How do I cancel my order?",
    answer: "Orders can be cancelled up to 2 hours before the delivery slot. For same-day deliveries, please call us within 30 minutes of placing the order.",
    icon: RotateCcw
  }
];

export const SupportModal = () => {
  const { isSupportOpen, setSupportOpen } = useStore();

  if (!isSupportOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSupportOpen(false)}
          className="absolute inset-0 bg-stone-900/40 backdrop-blur-md"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-lg bg-white/90 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl border border-white/50 overflow-hidden"
        >
          {/* Header */}
          <div className="p-8 pb-4 flex justify-between items-start">
            <div>
              <h2 className="font-display text-3xl font-bold text-stone-900">Support Center</h2>
              <p className="text-stone-500 mt-1 font-medium">How can we help you today?</p>
            </div>
            <button 
              onClick={() => setSupportOpen(false)}
              className="p-2 hover:bg-stone-100 rounded-full transition-colors group"
            >
              <X className="w-6 h-6 text-stone-400 group-hover:text-stone-900" />
            </button>
          </div>

          <div className="px-8 pb-8 space-y-8 h-[60vh] overflow-y-auto custom-scrollbar">
            
            {/* Contact Options */}
            <div className="grid grid-cols-2 gap-4">
              <a 
                href="https://wa.me/911234567890" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-6 bg-green-50 rounded-3xl border border-green-100 hover:bg-green-100 transition-colors group"
              >
                <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center shadow-lg shadow-green-200 mb-3 group-hover:scale-110 transition-transform">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <span className="font-bold text-green-700">WhatsApp</span>
                <span className="text-[10px] text-green-600/70 font-bold uppercase tracking-widest mt-1">Instant</span>
              </a>

              <a 
                href="tel:+911234567890" 
                className="flex flex-col items-center justify-center p-6 bg-rose-50 rounded-3xl border border-rose-100 hover:bg-rose-100 transition-colors group"
              >
                <div className="w-12 h-12 bg-rose-500 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-200 mb-3 group-hover:scale-110 transition-transform">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <span className="font-bold text-rose-700">Call Us</span>
                <span className="text-[10px] text-rose-600/70 font-bold uppercase tracking-widest mt-1">24/7 Priority</span>
              </a>
            </div>

            {/* FAQs */}
            <div>
              <div className="flex items-center gap-2 mb-4 px-2">
                <HelpCircle className="w-5 h-5 text-stone-400" />
                <h3 className="font-bold text-stone-800 uppercase text-xs tracking-[0.2em]">Quick Help</h3>
              </div>
              
              <Accordion type="single" collapsible className="space-y-3">
                {FAQS.map((faq, i) => (
                  <AccordionItem key={i} value={`item-${i}`} className="border-none">
                    <AccordionTrigger className="bg-stone-50 hover:bg-stone-100 px-6 py-4 rounded-2xl transition-all hover:no-underline">
                      <div className="flex items-center gap-4 text-left">
                        <div className="p-2 bg-white rounded-lg shadow-sm">
                          <faq.icon className="w-4 h-4 text-stone-500" />
                        </div>
                        <span className="font-bold text-stone-700 text-sm">{faq.question}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pt-4 pb-2 text-stone-500 text-sm leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            {/* Email Support */}
            <div className="p-6 bg-stone-900 rounded-[2rem] text-white flex items-center justify-between group cursor-pointer hover:bg-black transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform">
                  <Mail className="w-6 h-6 text-rose-400" />
                </div>
                <div>
                  <p className="font-bold">Email Support</p>
                  <p className="text-stone-400 text-xs mt-0.5">Response within 2 hours</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-stone-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
            </div>
          </div>

          {/* Footer Info */}
          <div className="p-6 bg-stone-50 border-t border-stone-100 flex items-center justify-center gap-6">
             <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">Premium Florist Network</p>
             <div className="w-1 h-1 bg-stone-200 rounded-full" />
             <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">Secure Experience</p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
