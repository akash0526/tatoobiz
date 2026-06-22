'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const aftercareSteps = [
  { num: "01", title: "Keep It Clean", desc: "Wash gently with lukewarm water and mild unscented soap twice daily. Pat dry with a clean towel." },
  { num: "02", title: "Moisturize", desc: "Apply a thin layer of fragrance-free moisturizer (like Aquaphor or tattoo balm) 3–4 times a day." },
  { num: "03", title: "Avoid Sun & Water", desc: "No sun exposure, swimming, or soaking for at least 2 weeks. UV rays can fade fresh ink." },
  { num: "04", title: "Don't Pick or Scratch", desc: "Let scabs fall off naturally. Picking can damage the tattoo and cause scarring." },
  { num: "05", title: "Wear Loose Clothing", desc: "Avoid tight or abrasive clothing that may rub against the fresh tattoo." },
  { num: "06", title: "Healing Timeline", desc: "Initial healing: 2–4 weeks. Full color vibrancy returns in 6–8 weeks." },
];

export default function AftercarePage() {
  return (
    <div>
      <div className="bg-dark2 py-20 border-b border-gold/10">
        <div className="container-custom text-center">
          <div className="section-label">AFTERCARE</div>
          <h1 className="section-title text-6xl md:text-7xl tracking-[-3px] mt-2 mb-3">Tattoo Aftercare</h1>
          <p className="max-w-md mx-auto text-lg text-cream/70">Proper care ensures your tattoo heals beautifully and lasts a lifetime.</p>
          <div className="gold-divider mx-auto mt-8" />
        </div>
      </div>

      <div className="section bg-black">
        <div className="container-custom max-w-4xl">
          <div className="grid gap-6 md:gap-7">
            {aftercareSteps.map((step, index) => (
              <div key={index} className="flex flex-col md:flex-row gap-7 border-b border-gold/10 pb-8 last:border-none last:pb-0 group">
                <div className="md:w-20 text-gold text-5xl font-heading tracking-tighter">{step.num}</div>
                <div className="flex-1">
                  <div className="font-heading text-3xl tracking-tight mb-2.5">{step.title}</div>
                  <p className="text-cream/80 text-[15px] leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Free Touch-Up Promise */}
      <div className="bg-dark py-16 border-t border-gold/10">
        <div className="container-custom max-w-xl text-center">
          <div className="mx-auto w-16 h-px bg-gradient-to-r from-transparent via-gold to-transparent mb-8" />
          <div className="text-gold font-medium tracking-widest text-xs mb-4">OUR PROMISE</div>
          <div className="font-heading text-4xl tracking-tight">Free Touch-Up</div>
          <p className="mt-4 text-lg text-cream/80">We offer a complimentary touch-up within 3 months of your original session.</p>
          
          <Link href="/contact" className="mt-8 inline-flex btn-gold items-center gap-2.5 group">
            BOOK YOUR TOUCH-UP <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
