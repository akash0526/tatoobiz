'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { STUDIO_INFO } from '@/lib/constants';

export default function AboutPreview() {
  return (
    <section className="section bg-dark">
      <div className="container-custom">
        <div className="grid md:grid-cols-12 gap-12 items-center">
          {/* Left Image Area */}
          <div className="md:col-span-7 relative">
            <div className="aspect-[16/10] bg-dark2 rounded-3xl overflow-hidden relative border border-gold/20">
              <div className="absolute inset-0 bg-[radial-gradient(#c9a84c_0.8px,transparent_1px)] bg-[length:4px_4px] opacity-10" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-gold text-8xl font-heading tracking-[-4px] mb-1">2016</div>
                  <div className="text-xs tracking-[4px] text-cream/50">ESTABLISHED IN BUTWAL</div>
                </div>
              </div>
            </div>
            
            {/* Badge */}
            <div className="absolute -bottom-4 -right-4 bg-black border border-gold/40 px-5 py-2 rounded-2xl flex items-center gap-3">
              <div className="text-gold text-sm">🏆</div>
              <div>
                <div className="font-medium text-xs tracking-wider">NEPAL TATTOO CONVENTION</div>
                <div className="text-[10px] text-muted">Featured Artist</div>
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div className="md:col-span-5">
            <div className="section-label mb-3">OUR STORY</div>
            <h2 className="section-title tracking-[-1.5px] mb-6 leading-none">Rooted in Art.<br />Born from Passion.</h2>
            
            <div className="text-lg text-cream/90 font-body-serif leading-tight tracking-tight mb-8">
              Since 2016, Tattoo Biz has been the premier destination for sacred, meaningful tattoos in Nepal. 
              We specialize in Hindu mythology, mandalas, and fine line work — creating timeless art on skin.
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-5 mb-9">
              {[
                { icon: "🏆", label: "Nepal Convention" },
                { icon: "🧪", label: "Hygiene First" },
                { icon: "🎨", label: "Fully Custom" },
                { icon: "🌈", label: "LGBTQ+ Friendly" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-sm">
                  <span className="text-xl">{item.icon}</span>
                  <span className="text-cream/90">{item.label}</span>
                </div>
              ))}
            </div>

            <Link href="/about" className="btn-outline-gold inline-flex items-center gap-3 group">
              LEARN MORE ABOUT US <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
