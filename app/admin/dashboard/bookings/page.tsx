'use client';

import React, { useState, useEffect } from 'react';
import { Phone, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

interface Booking {
  id: string;
  name: string;
  phone: string;
  email?: string;
  style?: string;
  preferred_artist?: string;
  preferred_date?: string;
  status: 'new' | 'contacted' | 'booked' | 'completed' | 'cancelled';
  created_at: string;
}

export default function BookingsManager() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error) setBookings(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchBookings(); }, []);

  const updateStatus = async (id: string, newStatus: Booking['status']) => {
    const { error } = await supabase.from('bookings').update({ status: newStatus }).eq('id', id);
    if (!error) {
      toast.success(`Status updated to ${newStatus}`);
      fetchBookings();
    }
  };

  // ✅ FIXED: Added proper type annotation for Record
  const statusColors: Record<string, string> = {
    new: 'bg-blue-500/10 text-blue-400',
    contacted: 'bg-yellow-500/10 text-yellow-400',
    booked: 'bg-emerald-500/10 text-emerald-400',
    completed: 'bg-purple-500/10 text-purple-400',
    cancelled: 'bg-red-500/10 text-red-400',
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <p className="text-muted">Loading bookings...</p>
    </div>
  );

  return (
    <div>
      <div className="mb-8">
        <span className="section-label">APPOINTMENTS</span>
        <h1 className="section-title text-4xl">Bookings</h1>
      </div>

      {bookings.length === 0 ? (
        <div className="card-dark p-12 text-center">
          <p className="text-muted text-lg">No bookings yet.</p>
          <p className="text-muted text-sm mt-2">New submissions will appear here.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs uppercase tracking-widest text-muted border-b border-gold/10">
                <th className="pb-4 pr-4">CLIENT</th>
                <th className="pb-4 pr-4">STYLE / ARTIST</th>
                <th className="pb-4 pr-4">DATE</th>
                <th className="pb-4 pr-4">STATUS</th>
                <th className="pb-4">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id} className="border-b border-dark3/50">
                  <td className="py-4 pr-4">
                    <p className="text-cream font-medium">{booking.name}</p>
                    <p className="text-muted text-sm">{booking.phone}</p>
                  </td>
                  <td className="py-4 pr-4">
                    <p className="text-cream">{booking.style || 'Custom'}</p>
                    {booking.preferred_artist && (
                      <p className="text-muted text-sm">by {booking.preferred_artist}</p>
                    )}
                  </td>
                  <td className="py-4 pr-4 text-muted">
                    {booking.preferred_date
                      ? new Date(booking.preferred_date).toLocaleDateString()
                      : 'Not set'}
                  </td>
                  <td className="py-4 pr-4">
                    <select
                      value={booking.status}
                      onChange={(e) => updateStatus(booking.id, e.target.value as Booking['status'])}
                      className={`px-3 py-1 rounded-full text-xs tracking-wider border-none ${statusColors[booking.status]}`}
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="booked">Booked</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="py-4">
                    <div className="flex gap-2">
                      <a
                        href={`tel:${booking.phone}`}
                        className="p-2 bg-dark3 rounded-lg hover:bg-gold/20 transition"
                      >
                        <Phone className="w-4 h-4 text-gold" />
                      </a>
                      <a
                        href={`https://wa.me/977${booking.phone.replace(/^0+/, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-dark3 rounded-lg hover:bg-emerald-900/30 transition"
                      >
                        <MessageCircle className="w-4 h-4 text-emerald-400" />
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}