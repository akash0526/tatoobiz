'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      if (data.session) {
        toast.success('Login successful!');
        
        // Force a hard navigation to ensure middleware picks up the session
        window.location.href = '/admin/dashboard';
      }
    } catch (err) {
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold to-gold-light flex items-center justify-center">
              <span className="text-black font-heading text-3xl font-bold tracking-tighter">TB</span>
            </div>
            <div>
              <div className="font-heading text-3xl tracking-[-1px] text-cream">TATTOO BIZ</div>
              <div className="text-xs text-gold/70 tracking-[3px] -mt-1">ADMIN</div>
            </div>
          </div>
        </div>

        <div className="card-dark p-10">
          <div className="text-center mb-8">
            <div className="font-heading text-3xl tracking-tight">Welcome Back</div>
            <p className="text-sm text-muted mt-2">Sign in to manage your studio</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="text-xs tracking-widest text-gold mb-2 block">EMAIL ADDRESS</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input-dark"
                placeholder="tattoobizbutwal@gmail.com"
              />
            </div>

            <div>
              <label className="text-xs tracking-widest text-gold mb-2 block">PASSWORD</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="input-dark"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-gold w-full py-4 mt-2 text-sm tracking-[2px] disabled:opacity-70"
            >
              {isLoading ? 'SIGNING IN...' : 'SIGN IN TO DASHBOARD'}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-muted">
            Use your Supabase admin account
          </div>
        </div>
      </div>
    </div>
  );
}
