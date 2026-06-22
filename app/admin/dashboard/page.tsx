'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Image, Users, Calendar, Star, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface DashboardStats {
  galleryCount: number;
  newBookings: number;
  pendingReviews: number;
  activeArtists: number;
}

interface RecentBooking {
  id: string;
  name: string;
  phone: string;
  style: string;
  status: string;
  created_at: string;
}

export default function DashboardHome() {
  const [stats, setStats] = useState<DashboardStats>({
    galleryCount: 0,
    newBookings: 0,
    pendingReviews: 0,
    activeArtists: 0,
  });
  const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      // Fetch counts in parallel
      const [
        galleryRes,
        bookingsRes,
        testimonialsRes,
        artistsRes,
        recentBookingsRes,
      ] = await Promise.all([
        supabase.from('gallery_items').select('id', { count: 'exact', head: true }),
        supabase.from('bookings').select('id', { count: 'exact', head: true }).eq('status', 'new'),
        supabase.from('testimonials').select('id', { count: 'exact', head: true }).eq('is_approved', false),
        supabase.from('artists').select('id', { count: 'exact', head: true }).eq('is_active', true),
        supabase
          .from('bookings')
          .select('id, name, phone, style, status, created_at')
          .order('created_at', { ascending: false })
          .limit(5),
      ]);

      setStats({
        galleryCount: galleryRes.count || 0,
        newBookings: bookingsRes.count || 0,
        pendingReviews: testimonialsRes.count || 0,
        activeArtists: artistsRes.count || 0,
      });

      if (recentBookingsRes.data) {
        setRecentBookings(recentBookingsRes.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const statCards = [
    { 
      label: 'Gallery Photos', 
      value: stats.galleryCount, 
      icon: Image, 
      href: '/admin/dashboard/gallery',
      color: 'text-gold' 
    },
    { 
      label: 'New Bookings', 
      value: stats.newBookings, 
      icon: Calendar, 
      href: '/admin/dashboard/bookings',
      color: 'text-emerald-400' 
    },
    { 
      label: 'Pending Reviews', 
      value: stats.pendingReviews, 
      icon: Star, 
      href: '/admin/dashboard/testimonials',
      color: 'text-amber-400' 
    },
    { 
      label: 'Active Artists', 
      value: stats.activeArtists, 
      icon: Users, 
      href: '/admin/dashboard/artists',
      color: 'text-blue-400' 
    },
  ];

  const quickActions = [
    { title: 'Upload New Photo', href: '/admin/dashboard/gallery', icon: Image },
    { title: 'Add Artist', href: '/admin/dashboard/artists', icon: Users },
    { title: 'View Bookings', href: '/admin/dashboard/bookings', icon: Calendar },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-gold border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <div className="section-label">OVERVIEW</div>
        <h1 className="section-title text-5xl tracking-[-2px] mt-1">Dashboard</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Link href={stat.href} key={index} className="card-dark p-6 hover:border-gold/40 transition-all group">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-sm text-muted tracking-wider">{stat.label}</div>
                  <div className="font-heading text-5xl tracking-[-2px] mt-2 text-cream group-hover:text-gold transition-colors">
                    {stat.value}
                  </div>
                </div>
                <Icon className={`${stat.color} opacity-70`} size={28} />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="section-label">QUICK ACTIONS</div>
            <div className="font-heading text-2xl tracking-tight mt-1">What would you like to do?</div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Link 
                key={index} 
                href={action.href}
                className="card-dark p-6 flex items-center justify-between group hover:border-gold/40 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-dark flex items-center justify-center">
                    <Icon size={20} className="text-gold" />
                  </div>
                  <div className="font-medium">{action.title}</div>
                </div>
                <ArrowRight className="text-gold/60 group-hover:translate-x-1 transition" size={18} />
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Bookings */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="section-label">RECENT ACTIVITY</div>
            <div className="font-heading text-2xl tracking-tight mt-1">Latest Bookings</div>
          </div>
          <Link href="/admin/dashboard/bookings" className="text-sm text-gold flex items-center gap-1 hover:underline">
            View All <ArrowRight size={16} />
          </Link>
        </div>

        <div className="card-dark overflow-hidden">
          {recentBookings.length > 0 ? (
            <div className="divide-y divide-gold/10">
              {recentBookings.map((booking) => (
                <div key={booking.id} className="p-5 flex items-center justify-between hover:bg-dark/50 transition-colors">
                  <div>
                    <div className="font-medium">{booking.name}</div>
                    <div className="text-sm text-muted mt-0.5">
                      {booking.style || 'Custom'} • {booking.phone}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted">
                      {new Date(booking.created_at).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-gold capitalize mt-0.5">
                      {booking.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-muted">
              No bookings yet. New submissions will appear here.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
