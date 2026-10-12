import { NextRequest, NextResponse } from 'next/server';
import imagekit from '@/lib/imagekit';
import { getAdminUser, unauthorized } from '@/lib/auth-server';

export async function POST(request: NextRequest) {
  // Deleting media is a privileged action: admins only.
  const admin = await getAdminUser();
  if (!admin) return unauthorized();

  try {
    const { fileId } = await request.json();

    if (!fileId || typeof fileId !== 'string') {
      return NextResponse.json({ error: 'File ID required' }, { status: 400 });
    }

    await imagekit.deleteFile(fileId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('ImageKit delete error:', error);
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}
