'use client';

import { SOCIAL_LINKS, STUDIO_INFO } from '@/lib/constants';
import { MessageCircle } from 'lucide-react';

export default function WhatsAppFAB() {
  return (
    <a
      href={SOCIAL_LINKS.whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#25D366] text-white px-5 py-3.5 rounded-2xl shadow-2xl hover:bg-[#1da851] active:scale-[0.985] transition-all duration-200 group"
      aria-label="Book on WhatsApp"
    >
      <MessageCircle className="w-5 h-5" />
      <span className="font-medium text-sm tracking-wider hidden sm:block">Book on WhatsApp</span>
      <span className="font-medium text-sm tracking-wider sm:hidden">Book Now</span>
    </a>
  );
}
