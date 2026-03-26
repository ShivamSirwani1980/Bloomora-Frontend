import React, { useState, useEffect, Fragment } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { 
  Calendar, MapPin, DollarSign, Plus, Trash2, 
  Image as ImageIcon, Loader2, X, CheckCircle2, ChevronRight
} from 'lucide-react';

const statusColors: Record<string, string> = {
  Confirmed: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  Pending: 'bg-amber-100 text-amber-700 border-amber-200',
  'In Progress': 'bg-blue-100 text-blue-700 border-blue-200',
  Completed: 'bg-slate-100 text-slate-600 border-slate-200',
  Cancelled: 'bg-rose-100 text-rose-700 border-rose-200',
};

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000').replace(/\/$/, '');

export default function AdminDecorations() {
  const [activeTab, setActiveTab] = useState<'bookings' | 'services'>('bookings');
  const [bookings, setBookings] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState<any | null>(null);

  useEffect(() => {
    if (activeTab === 'bookings') fetchBookings();
    else fetchServices();
  }, [activeTab]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/main/Bloomora/Admin/Bookings/All/`);
      const data = await res.json();
      if (res.ok) setBookings(data.data || []);
    } catch (err) {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/main/Bloomora/getAllService/`);
      const data = await res.json();
      if (res.ok) setServices(data.data || []);
    } catch (err) {
      toast.error('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/main/Bloomora/Admin/Bookings/UpdateStatus/${id}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setBookings((prev) => prev.map((b) => b.id === id ? { ...b, status: newStatus } : b));
        toast.success(`Booking updated to ${newStatus}`);
      } else {
        toast.error('Failed to update status');
      }
    } catch (err) {
      toast.error('Error updating status');
    }
  };

  const deleteService = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/main/Bloomora/Admin/Services/Delete/${id}/`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setServices((prev) => prev.filter((s) => s.id !== id));
        toast.success('Service deleted successfully');
      }
    } catch (err) {
      toast.error('Failed to delete service');
    }
  };

  const handleEdit = (service: any) => {
    setEditingService(service);
    setShowModal(true);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">Decoration Management</h1>
            <div className="flex gap-4 mt-2">
              <button 
                onClick={() => setActiveTab('bookings')}
                className={`text-sm font-medium pb-2 border-b-2 transition-colors ${activeTab === 'bookings' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
              >
                Bookings ({bookings.length})
              </button>
              <button 
                onClick={() => setActiveTab('services')}
                className={`text-sm font-medium pb-2 border-b-2 transition-colors ${activeTab === 'services' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
              >
                Services ({services.length})
              </button>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={activeTab === 'bookings' ? fetchBookings : fetchServices}>Refresh</Button>
            {activeTab === 'services' && (
              <Button size="sm" onClick={() => { setEditingService(null); setShowModal(true); }} className="gap-2">
                <Plus className="w-4 h-4" /> Add Service
              </Button>
            )}
          </div>
        </div>

        {activeTab === 'bookings' ? (
          <div className="bg-card rounded-2xl border border-border/50 shadow-soft overflow-hidden">
            <div className="overflow-x-auto">
              {loading ? (
                <div className="p-12 text-center text-muted-foreground">Loading bookings...</div>
              ) : bookings.length === 0 ? (
                <div className="p-12 text-center text-muted-foreground">No bookings found</div>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="text-left py-4 px-4 font-medium text-muted-foreground">Booking ID</th>
                      <th className="text-left py-4 px-4 font-medium text-muted-foreground">Event</th>
                      <th className="text-left py-4 px-4 font-medium text-muted-foreground">Date</th>
                      <th className="text-left py-4 px-4 font-medium text-muted-foreground">Location</th>
                      <th className="text-left py-4 px-4 font-medium text-muted-foreground">Budget</th>
                      <th className="text-left py-4 px-4 font-medium text-muted-foreground">Contact</th>
                      <th className="text-left py-4 px-4 font-medium text-muted-foreground">Status</th>
                      <th className="text-right py-4 px-4 font-medium text-muted-foreground">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {bookings.map((booking, i) => (
                      <Fragment key={booking.id}>
                        <motion.tr
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: i * 0.02 }}
                          className="hover:bg-muted/20 transition-colors cursor-pointer"
                          onClick={() => setExpandedRow(expandedRow === booking.id ? null : booking.id)}
                        >
                          <td className="py-4 px-4 font-medium text-foreground">
                            {booking.display_id || (booking.id ? `#${booking.id.slice(-6).toUpperCase()}` : 'NEW')}
                          </td>
                          <td className="py-4 px-4">
                            <span className="text-foreground font-medium">{booking.event_type}</span>
                          </td>
                          <td className="py-4 px-4 text-foreground">{booking.event_date}</td>
                          <td className="py-4 px-4 text-foreground">{booking.location}</td>
                          <td className="py-4 px-4 font-semibold text-foreground">₹{booking.budget_range}</td>
                          <td className="py-4 px-4">
                            <div className="flex flex-col">
                              <span className="font-medium text-foreground">{booking.full_name}</span>
                              <span className="text-xs text-muted-foreground">{booking.phone_number}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded-md font-bold border ${statusColors[booking.status] || 'bg-muted text-muted-foreground border-transparent'}`}>
                              {booking.status}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                            <select
                              value={booking.status}
                              onChange={(e) => updateStatus(booking.id, e.target.value)}
                              className="text-xs bg-card rounded-lg px-3 py-1.5 border border-border shadow-sm hover:border-primary/50 transition-colors cursor-pointer outline-none focus:ring-1 focus:ring-primary/20"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Confirmed">Confirmed</option>
                              <option value="In Progress">In Progress</option>
                              <option value="Completed">Completed</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>
                        </motion.tr>
                        {expandedRow === booking.id && (
                          <tr className="bg-muted/10">
                            <td colSpan={8} className="py-4 px-6 animate-in slide-in-from-top-2 duration-200">
                              <div className="flex flex-col gap-2">
                                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Additional Requirements</h4>
                                <p className="text-sm text-foreground bg-card p-4 rounded-xl border border-border italic whitespace-pre-wrap">
                                  {booking.additional_requirements || "No specific requirements mentioned."}
                                </p>
                                <div className="flex items-center gap-4 mt-2">
                                  <span className="text-xs text-muted-foreground">Booked on: {new Date(booking.createdAt).toLocaleString()}</span>
                                  <span className="text-xs text-muted-foreground">|</span>
                                  <span className="text-xs text-muted-foreground">User Email: {booking.email}</span>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-full p-12 text-center text-muted-foreground">Loading services...</div>
            ) : services.length === 0 ? (
              <div className="col-span-full p-12 text-center text-muted-foreground">No services found</div>
            ) : (
              services.map((service, i) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-card rounded-2xl border border-border/50 overflow-hidden group hover:shadow-lg transition-all"
                >
                  <div className="aspect-video relative">
                    <img src={service.image_url} alt={service.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-3 right-3 flex gap-2">
                      <button 
                        onClick={() => handleEdit(service)}
                        className="p-2 bg-white/10 text-white hover:bg-white hover:text-primary rounded-lg transition-colors backdrop-blur-md"
                      >
                        <ImageIcon className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => deleteService(service.id)}
                        className="p-2 bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground rounded-lg transition-colors backdrop-blur-md"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase tracking-widest font-bold text-primary">{service.service_type}</span>
                      <span className="text-sm font-bold text-foreground">₹{parseInt(service.starting_price).toLocaleString()}</span>
                    </div>
                    <h3 className="font-bold text-foreground leading-tight">{service.title}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">{service.description}</p>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}
      </div>

      <AnimatePresence>
        {showModal && (
          <ServiceModal 
            service={editingService} 
            onClose={() => setShowModal(false)} 
            onRefresh={fetchServices} 
          />
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}

function ServiceModal({ service, onClose, onRefresh }: { service: any | null, onClose: () => void, onRefresh: () => void }) {
  const [formData, setFormData] = useState({
    title: service?.title || '',
    description: service?.description || '',
    starting_price: service?.starting_price || '',
    service_type: service?.service_type || 'Wedding',
    image: null as File | null
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('starting_price', formData.starting_price);
      data.append('service_type', formData.service_type);
      if (formData.image) data.append('image', formData.image);

      const url = service 
        ? `${API_BASE_URL}/api/v1/main/Bloomora/Admin/Services/Update/${service.id}/`
        : `${API_BASE_URL}/api/v1/main/Bloomora/CreateService/`;

      const res = await fetch(url, {
        method: service ? 'PATCH' : 'POST',
        body: data
      });

      if (res.ok) {
        toast.success(service ? 'Service updated!' : 'Service created!');
        onRefresh();
        onClose();
      } else {
        toast.error('Failed to save service');
      }
    } catch (err) {
      toast.error('Error saving service');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-card w-full max-w-md border border-border rounded-3xl shadow-elevated overflow-hidden"
      >
        <div className="p-6 border-b border-border flex items-center justify-between bg-muted/30">
          <h2 className="font-bold text-foreground flex items-center gap-2">
            {service ? <ImageIcon className="w-5 h-5 text-primary" /> : <Plus className="w-5 h-5 text-primary" />}
            {service ? 'Edit Decoration Service' : 'Add New Service'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Service Title</label>
            <input 
              required
              className="w-full input-premium h-11"
              placeholder="e.g. Dreamy Rose Wedding Decor"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Type</label>
              <select 
                className="w-full input-premium h-11 px-3"
                value={formData.service_type}
                onChange={e => setFormData({ ...formData, service_type: e.target.value })}
              >
                <option>Wedding</option>
                <option>Engagement</option>
                <option>Birthday</option>
                <option>Corporate</option>
                <option>Personal</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Price (₹)</label>
              <input 
                required
                type="number"
                className="w-full input-premium h-11"
                placeholder="Starting from"
                value={formData.starting_price}
                onChange={e => setFormData({ ...formData, starting_price: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Description</label>
            <textarea 
              required
              rows={3}
              className="w-full input-premium py-3 resize-none px-3"
              placeholder="Elegant arrangements for..."
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              {service ? 'Replacement Image (Optional)' : 'Cover Image'}
            </label>
            <div className="relative group">
              <input 
                type="file" 
                accept="image/*"
                onChange={e => setFormData({ ...formData, image: e.target.files?.[0] || null })}
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
              />
              <div className="w-full h-24 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center gap-1 group-hover:border-primary/50 group-hover:bg-primary/5 transition-all">
                {formData.image ? (
                  <div className="flex items-center gap-2 text-primary">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="text-sm font-medium">{formData.image.name}</span>
                  </div>
                ) : service ? (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <ImageIcon className="w-5 h-5" />
                    <span className="text-xs">Keeping existing image</span>
                  </div>
                ) : (
                  <>
                    <ImageIcon className="w-6 h-6 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Click or drag to upload image</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <Button 
            disabled={submitting} 
            className="w-full h-12 text-md font-bold shadow-soft mt-4" 
            variant="hero"
          >
            {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : service ? 'Update Service' : 'Create Service'}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
