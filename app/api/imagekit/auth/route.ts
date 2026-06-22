import { NextResponse } from 'next/server';
import imagekit from '@/lib/imagekit';

export async function GET() {
  try {
    const authParams = imagekit.getAuthenticationParameters();
    return NextResponse.json(authParams);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate auth params' },
      { status: 500 }
    );
  }
}
