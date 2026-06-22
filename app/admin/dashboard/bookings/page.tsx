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

  const statusColors: Record<string, string> = {
    new: 'bg-blue-500/10 text-blue-400',
    contacted: 'bg-yellow-500/10 text-yellow-400',
    booked: 'bg-emerald-500/10 text-emerald-400',
    completed: 'bg-purple-500/10 text-purple-400',
    cancelled: 'bg-red-500/10 text-red-400',
  };

  if (loading) return <div className="py-20 text-center">Loading bookings...</div>;

  return (
    <div>
      <div className="mb-8">
        <div className="section-label">APPOINTMENTS</div>
        <h1 className="font-heading text-5xl tracking-[-2px]">Bookings</h1>
      </div>

      <div className="card-dark overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gold/10 text-left text-xs tracking-widest text-muted">
              <th className="p-6">CLIENT</th>
              <th className="p-6">STYLE / ARTIST</th>
              <th className="p-6">DATE</th>
              <th className="p-6">STATUS</th>
              <th className="p-6">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 && (
              <tr><td colSpan={5} className="p-8 text-center text-muted">No bookings yet.</td></tr>
            )}
            {bookings.map((booking) => (
              <tr key={booking.id} className="border-b border-gold/10">
                <td className="p-6">
                  <div className="font-medium">{booking.name}</div>
                  <div className="text-sm text-muted">{booking.phone}</div>
                </td>
                <td className="p-6 text-sm">
                  {booking.style} <span className="text-muted">•</span> {booking.preferred_artist}
                </td>
                <td className="p-6 text-sm text-muted">{booking.preferred_date}</td>
                <td className="p-6">
                  <select 
                    value={booking.status} 
                    onChange={(e) => updateStatus(booking.id, e.target.value as any)}
                    className={`px-3 py-1 rounded-full text-xs tracking-wider border-none ${statusColors[booking.status]}`}
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="booked">Booked</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
                <td className="p-6">
                  <div className="flex gap-2">
                    <a href={`tel:${booking.phone}`} className="p-2 hover:bg-dark rounded-lg"><Phone size={16} /></a>
                    <a href={`https://wa.me/${booking.phone.replace(/\s/g, '')}`} target="_blank" className="p-2 hover:bg-dark rounded-lg"><MessageCircle size={16} /></a>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
