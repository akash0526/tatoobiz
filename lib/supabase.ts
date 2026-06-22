import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
}

// Use the SSR browser client so the auth session is stored in COOKIES
// (not localStorage). This is what lets middleware.ts read the session and
// keep the user logged in on /admin/dashboard.
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
