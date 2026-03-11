import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, DollarSign, Send, CheckCircle2 } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import useFetch from '@/hooks/useFetch';
import axios from 'axios';

const getIconForServiceType = (type: string) => {
  switch (type?.toLowerCase()) {
    case 'wedding': return '💒';
    case 'engagement': return '💍';
    case 'birthday': return '🎈';
    case 'corporate': return '🏢';
    default: return '✨';
  }
};

export default function Decoration() {
  const { data, loading, error } = useFetch<any>(`${import.meta.env.VITE_API_BASE_URL}/api/v1/main/Bloomora/getAllService/`);
  const servicesData = data?.data || [];

  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventType: '',
    eventDate: '',
    location: '',
    budget: '',
    requirements: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        full_name: formData.name,
        email: formData.email,
        phone_number: formData.phone,
        event_type: formData.eventType || selectedService,
        event_date: formData.eventDate,
        location: formData.location,
        budget_range: formData.budget,
        additional_requirements: formData.requirements,
      };

      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/v1/main/Bloomora/BookService/  `, payload);

      toast.success('Thank you! Our team will contact you within 24 hours.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        eventType: '',
        eventDate: '',
        location: '',
        budget: '',
        requirements: '',
      });
      setSelectedService(null);
    } catch (err) {
      toast.error('Failed to submit request. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="pt-24 pb-12 bg-hero-gradient">
        <div className="container-custom mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="inline-block px-4 py-2 bg-gold/10 text-gold-dark rounded-full text-sm font-medium mb-6">
              ✨ Transform Your Venue
            </span>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
              Floral <span className="text-gradient">Decoration Services</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Turn your special occasions into magical moments with our expert floral
              decoration services for weddings, engagements, parties, and corporate events.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services */}
      <section className="section-padding">
        <div className="container-custom mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our Services
            </h2>
            <p className="text-muted-foreground">
              Choose from our range of professional decoration services
            </p>
          </motion.div>

          {loading && (
            <div className="text-center py-12 text-muted-foreground">
              Loading decoration services...
            </div>
          )}

          {error && (
            <div className="text-center py-12 text-red-500">
              Failed to load decoration services.
            </div>
          )}

          {!loading && !error && (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {servicesData.map((service: any, index: number) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={cn(
                    'relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300',
                    selectedService === service.id
                      ? 'ring-2 ring-primary shadow-elevated'
                      : 'hover:shadow-card'
                  )}
                  onClick={() => setSelectedService(service.id)}
                >
                  <div className="aspect-[4/3] relative">
                    <img
                      src={service.image_url}
                      alt={service.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                    <div className="absolute inset-0 flex flex-col justify-end p-6 text-white drop-shadow-lg">

                      <span className="text-3xl mb-2">{getIconForServiceType(service.service_type)}</span>
                      <h3 className="text-lg font-semibold mb-1">{service.title}</h3>
                      <p className="text-sm opacity-90 mb-2">{service.description}</p>
                      <p className="text-sm">
                        Starting from <span className="font-bold">₹{parseInt(service.starting_price || '0').toLocaleString()}</span>
                      </p>
                    </div>
                  </div>
                  {selectedService === service.id && (
                    <div className="absolute top-3 right-3 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-primary-foreground" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Booking Form */}
      <section className="section-padding bg-muted/30">
        <div className="container-custom mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Book Your Decoration
            </h2>
            <p className="text-muted-foreground">
              Fill out the form below and our team will get back to you within 24 hours
            </p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            onSubmit={handleSubmit}
            className="bg-card rounded-3xl p-8 shadow-card border border-border"
          >
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full input-premium"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full input-premium"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full input-premium"
                  placeholder="+91 98765 43210"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Event Type *
                </label>
                <select
                  required
                  value={formData.eventType || selectedService || ''}
                  onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                  className="w-full input-premium"
                >
                  <option value="">Select event type</option>
                  {servicesData.map((service: any) => (
                    <option key={service.id} value={service.id}>
                      {service.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Event Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.eventDate}
                  onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                  className="w-full input-premium"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Location *
                </label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full input-premium"
                  placeholder="Venue address"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-2">
                  <DollarSign className="w-4 h-4 inline mr-1" />
                  Budget Range
                </label>
                <select
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  className="w-full input-premium"
                >
                  <option value="">Select budget range</option>
                  <option value="10000-25000">₹10,000 - ₹25,000</option>
                  <option value="25000-50000">₹25,000 - ₹50,000</option>
                  <option value="50000-100000">₹50,000 - ₹1,00,000</option>
                  <option value="100000+">₹1,00,000+</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Additional Requirements
                </label>
                <textarea
                  value={formData.requirements}
                  onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                  rows={4}
                  className="w-full input-premium resize-none"
                  placeholder="Tell us about your vision, color preferences, theme, etc."
                />
              </div>
            </div>

            <Button variant="hero" size="xl" className="w-full mt-8" disabled={isSubmitting}>
              <Send className="w-5 h-5" />
              {isSubmitting ? 'Submitting...' : 'Submit Request'}
            </Button>
          </motion.form>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section-padding">
        <div className="container-custom mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose Bloomora?
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { title: '500+', subtitle: 'Events Decorated' },
              { title: '100%', subtitle: 'Client Satisfaction' },
              { title: '50+', subtitle: 'Professional Decorators' },
              { title: '24/7', subtitle: 'Customer Support' },
            ].map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6 bg-card rounded-2xl border border-border"
              >
                <p className="text-4xl font-bold text-gradient mb-2">{stat.title}</p>
                <p className="text-muted-foreground">{stat.subtitle}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
