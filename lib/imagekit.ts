import ImageKit from 'imagekit';

const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
});

export default imagekit;

// Generate auth params for client-side upload
export async function getImageKitAuthParams() {
  const authParams = imagekit.getAuthenticationParameters();
  return authParams;
}

// Delete file from ImageKit
export async function deleteImageKitFile(fileId: string) {
  try {
    await imagekit.deleteFile(fileId);
    return { success: true };
  } catch (error) {
    console.error('ImageKit delete error:', error);
    return { success: false, error };
  }
}
