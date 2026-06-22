'use client';

import React from 'react';
import Link from 'next/link';

export default function BlogPage() {
  return (
    <div>
      <div className="bg-dark2 py-20 border-b border-gold/10">
        <div className="container-custom text-center">
          <div className="section-label">STUDIO JOURNAL</div>
          <h1 className="section-title text-6xl md:text-7xl tracking-[-3px] mt-2 mb-3">Insights &amp; News</h1>
          <p className="max-w-md mx-auto text-lg text-cream/70">Stories, tattoo culture, and studio updates.</p>
          <div className="gold-divider mx-auto mt-8" />
        </div>
      </div>

      <div className="section bg-black">
        <div className="container-custom max-w-2xl text-center py-16">
          <div className="mx-auto w-14 h-px bg-gradient-to-r from-transparent via-gold to-transparent mb-7" />
          <div className="font-heading text-4xl tracking-tight">Coming Soon</div>
          <p className="mt-4 text-lg text-cream/70">We're working on a beautiful blog section with tattoo stories, aftercare guides, and artist spotlights.</p>
          
          <div className="mt-10">
            <Link href="/contact" className="btn-outline-gold">STAY UPDATED — MESSAGE US</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
