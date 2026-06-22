import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// This route runs on the server, so it uses a plain server-side client
// instead of the cookie-based browser client in '@/lib/supabase'.
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { data, error } = await supabase
      .from('bookings')
      .insert([{
        name: body.name,
        phone: body.phone,
        email: body.email || null,
        design_idea: body.design_idea || null,
        style: body.style || null,
        body_part: body.body_part || null,
        preferred_date: body.preferred_date || null,
        preferred_artist: body.preferred_artist || null,
        message: body.message || null,
        status: 'new'
      }]);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
