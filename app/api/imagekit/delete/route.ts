import { NextRequest, NextResponse } from 'next/server';
import imagekit from '@/lib/imagekit';

export async function POST(request: NextRequest) {
  try {
    const { fileId } = await request.json();

    if (!fileId) {
      return NextResponse.json({ error: 'File ID required' }, { status: 400 });
    }

    await imagekit.deleteFile(fileId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('ImageKit delete error:', error);
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}
