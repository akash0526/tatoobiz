import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-black">
      <div className="text-center px-6">
        <div className="text-gold text-[140px] font-heading tracking-[-12px] leading-none mb-2">404</div>
        <div className="text-3xl tracking-tight">Page Not Found</div>
        <p className="mt-4 text-cream/70 max-w-xs mx-auto">The page you're looking for doesn't exist or has been moved.</p>
        
        <Link href="/" className="mt-10 inline-flex btn-outline-gold items-center gap-2 group">
          <ArrowLeft className="w-4 h-4" /> BACK TO HOME
        </Link>
      </div>
    </div>
  );
}
