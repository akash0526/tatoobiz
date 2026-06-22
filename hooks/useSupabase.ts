'use client';

import { supabase } from '@/lib/supabase';
import { useState } from 'react';

export function useSupabase() {
  const [loading, setLoading] = useState(false);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    return { data, error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return { signIn, signOut, loading };
}
