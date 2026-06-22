'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, Image, Users, Scissors, Calendar, Star, LogOut 
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/dashboard/gallery', label: 'Gallery', icon: Image },
  { href: '/admin/dashboard/artists', label: 'Artists', icon: Users },
  { href: '/admin/dashboard/services', label: 'Services', icon: Scissors },
  { href: '/admin/dashboard/bookings', label: 'Bookings', icon: Calendar },
  { href: '/admin/dashboard/testimonials', label: 'Testimonials', icon: Star },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success('Logged out successfully');
    router.push('/admin');
  };

  return (
    <div className="flex min-h-screen bg-black">
      {/* Sidebar */}
      <div className="w-64 bg-dark2 border-r border-gold/10 flex flex-col">
        <div className="p-6 border-b border-gold/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gold to-gold-light flex items-center justify-center">
              <span className="text-black font-heading text-xl font-bold tracking-tighter">TB</span>
            </div>
            <div>
              <div className="font-heading text-xl tracking-[-1px]">TATTOO BIZ</div>
              <div className="text-[10px] text-gold/60 -mt-1 tracking-widest">ADMIN PANEL</div>
            </div>
          </div>
        </div>

        <div className="flex-1 p-4">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${
                    isActive 
                      ? 'bg-gold/10 text-gold border border-gold/20' 
                      : 'text-cream/70 hover:bg-dark hover:text-cream'
                  }`}
                >
                  <Icon size={18} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-gold/10">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-400 hover:bg-dark rounded-xl transition-all"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="h-16 border-b border-gold/10 bg-dark2 flex items-center justify-between px-8">
          <div className="text-sm text-muted">Studio Management • Butwal, Nepal</div>
          <div className="flex items-center gap-3 text-sm">
            <div className="px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-xs tracking-wider">LIVE</div>
            <span className="text-cream/60">tattoobizbutwal@gmail.com</span>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 p-8 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
