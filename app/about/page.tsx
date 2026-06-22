'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <div>
      {/* Header */}
      <div className="bg-dark2 py-20 border-b border-gold/10">
        <div className="container-custom text-center">
          <div className="section-label">OUR LEGACY</div>
          <h1 className="section-title text-6xl md:text-7xl tracking-[-3px] mt-2 mb-3">Our Story</h1>
          <p className="max-w-md mx-auto text-lg text-cream/70">A decade of sacred ink and meaningful art.</p>
          <div className="gold-divider mx-auto mt-8" />
        </div>
      </div>

      <div className="section bg-black">
        <div className="container-custom max-w-3xl">
          <div className="prose prose-invert max-w-none font-body-serif text-xl leading-tight tracking-[-0.2px] text-cream/90">
            <p>Tattoo Biz Butwal was founded in 2016 by Bijay with a simple vision: to create a space where sacred art and personal expression meet on the skin.</p>
            
            <p className="mt-7">What started as a small studio in B.P. Chowk has grown into one of Nepal’s most respected tattoo destinations — known for its dedication to hygiene, artistry, and respect for traditional and spiritual iconography.</p>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="section bg-dark2 border-y border-gold/10">
        <div className="container-custom">
          <div className="text-center mb-12">
            <div className="section-label">WHAT DRIVES US</div>
            <h2 className="section-title text-5xl tracking-tight mt-2">Our Values</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: "🎨", title: "Artistry", desc: "Every tattoo is treated as a work of art — never rushed, always intentional." },
              { icon: "🧪", title: "Hygiene", desc: "Medical-grade sterilization, single-use needles, and a sterile environment." },
              { icon: "🌈", title: "Inclusivity", desc: "LGBTQ+ friendly studio where everyone is welcome and respected." },
              { icon: "🏆", title: "Excellence", desc: "Award-winning artists recognized at the Nepal Tattoo Convention." },
            ].map((value, i) => (
              <div key={i} className="card-dark p-8 text-center">
                <div className="text-6xl mb-5 opacity-90">{value.icon}</div>
                <div className="font-heading text-3xl tracking-tight mb-3">{value.title}</div>
                <p className="text-sm text-cream/70">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Studio Timeline */}
      <div className="section bg-black">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto">
            <div className="section-label mb-4">MILESTONES</div>
            <div className="space-y-9 text-sm">
              {[
                { year: "2016", text: "Studio founded by Bijay in B.P. Chowk, Butwal." },
                { year: "2018", text: "First Nepal Tattoo Convention appearance." },
                { year: "2020", text: "Expanded team with Samir and Sunita." },
                { year: "2023", text: "Featured in national media for sacred tattoo art." },
                { year: "2025", text: "Over 500 clients served with 4.5★ Google rating." },
              ].map((milestone, idx) => (
                <div key={idx} className="flex gap-6 border-l border-gold/20 pl-7 relative">
                  <div className="absolute -left-[5px] top-1 w-3 h-3 rounded-full bg-gold" />
                  <div className="font-heading text-4xl tracking-[-2px] text-gold min-w-[70px]">{milestone.year}</div>
                  <div className="pt-1 text-lg text-cream/90">{milestone.text}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-dark2 py-20 text-center border-t border-gold/10">
        <div className="container-custom">
          <Link href="/contact" className="btn-gold inline-flex items-center gap-3 text-base px-9 py-4 group">
            VISIT THE STUDIO <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
          </Link>
        </div>
      </div>
    </div>
  );
}
