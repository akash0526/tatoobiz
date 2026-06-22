'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Phone } from 'lucide-react';
import { STUDIO_INFO, SOCIAL_LINKS } from '@/lib/constants';

export default function Hero() {
  return (
    <section className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden pt-10">
      {/* Background with Mandala Overlay */}
      <div className="absolute inset-0 bg-[var(--color-black)]">
        <div className="absolute inset-0 mandala-bg opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/70 to-black" />
      </div>

      {/* Content */}
      <div className="container-custom relative z-10 text-center px-6 pt-12">
        <div className="max-w-4xl mx-auto">
          {/* Greeting */}
          <div className="inline-block px-5 py-1.5 rounded-full border border-gold/30 mb-6 text-xs tracking-[3px] text-gold">
            नमस्ते · EST. {STUDIO_INFO.founded}
          </div>

          {/* Main Title */}
          <h1 className="font-heading text-[72px] sm:text-[92px] md:text-[110px] leading-[0.88] tracking-[-6.5px] text-cream mb-3">
            TATTOO<br />BIZ
          </h1>
          
          <div className="text-gold text-2xl md:text-3xl tracking-[4px] mb-4 font-light">BUTWAL • NEPAL</div>

          {/* Tagline */}
          <p className="max-w-lg mx-auto text-xl md:text-2xl text-cream/90 font-body-serif tracking-tight mb-10">
            {STUDIO_INFO.tagline}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a 
              href={SOCIAL_LINKS.whatsapp} 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn-whatsapp px-10 py-4 text-base flex items-center gap-3 group"
            >
              <Phone className="w-4 h-4" /> BOOK ON WHATSAPP
            </a>
            
            <Link 
              href="/gallery" 
              className="btn-outline-gold px-10 py-4 text-base group flex items-center gap-3"
            >
              VIEW OUR WORK <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
            </Link>
          </div>

          {/* Trust Bar */}
          <div className="mt-16 flex flex-wrap justify-center gap-x-10 gap-y-3 text-xs uppercase tracking-[2.5px] text-cream/60">
            <div>{STUDIO_INFO.years} YEARS</div>
            <div>{STUDIO_INFO.clients} CLIENTS</div>
            <div>{STUDIO_INFO.googleRating}★ GOOGLE</div>
            <div>{STUDIO_INFO.artists} ARTISTS</div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-gold/60 text-xs tracking-widest">
        SCROLL TO EXPLORE
        <div className="h-px w-6 bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
      </div>
    </section>
  );
}
