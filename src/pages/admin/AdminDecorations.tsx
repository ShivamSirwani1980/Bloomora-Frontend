import { useState } from 'react';
import { motion } from 'framer-motion';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { toast } from 'sonner';

const mockBookings = [
  { id: 'BK-101', event: 'Wedding', date: '2026-03-15', location: 'Mumbai', budget: '₹50,000', contact: 'Priya S.', status: 'Confirmed' },
  { id: 'BK-102', event: 'Engagement', date: '2026-02-28', location: 'Delhi', budget: '₹25,000', contact: 'Rahul V.', status: 'Pending' },
  { id: 'BK-103', event: 'Birthday', date: '2026-03-05', location: 'Bangalore', budget: '₹12,000', contact: 'Ananya P.', status: 'In Progress' },
  { id: 'BK-104', event: 'Corporate', date: '2026-03-20', location: 'Hyderabad', budget: '₹35,000', contact: 'Vikram S.', status: 'Pending' },
  { id: 'BK-105', event: 'Wedding', date: '2026-04-10', location: 'Pune', budget: '₹75,000', contact: 'Meera J.', status: 'Confirmed' },
];

const statusColors: Record<string, string> = {
  Confirmed: 'bg-green-100 text-green-800',
  Pending: 'bg-amber-100 text-amber-800',
  'In Progress': 'bg-blue-100 text-blue-800',
  Completed: 'bg-muted text-muted-foreground',
};

export default function AdminDecorations() {
  const [bookings, setBookings] = useState(mockBookings);

  const updateStatus = (id: string, newStatus: string) => {
    setBookings((prev) => prev.map((b) => b.id === id ? { ...b, status: newStatus } : b));
    toast.success(`Booking ${id} updated to ${newStatus}`);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Decoration Bookings</h1>
          <p className="text-sm text-muted-foreground">{bookings.length} bookings</p>
        </div>

        <div className="bg-card rounded-2xl border border-border/50 shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Booking ID</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Event</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Date</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Location</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Budget</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Contact</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking, i) => (
                  <motion.tr
                    key={booking.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-border/50 hover:bg-muted/20 transition-colors"
                  >
                    <td className="py-3 px-4 font-medium text-foreground">{booking.id}</td>
                    <td className="py-3 px-4 text-foreground">{booking.event}</td>
                    <td className="py-3 px-4 text-foreground">{booking.date}</td>
                    <td className="py-3 px-4 text-foreground">{booking.location}</td>
                    <td className="py-3 px-4 font-semibold text-foreground">{booking.budget}</td>
                    <td className="py-3 px-4 text-muted-foreground">{booking.contact}</td>
                    <td className="py-3 px-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColors[booking.status] || 'bg-muted text-muted-foreground'}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <select
                        value={booking.status}
                        onChange={(e) => updateStatus(booking.id, e.target.value)}
                        className="text-xs bg-muted rounded-lg px-2 py-1 border border-border"
                      >
                        <option>Pending</option>
                        <option>Confirmed</option>
                        <option>In Progress</option>
                        <option>Completed</option>
                      </select>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
