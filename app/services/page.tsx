'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface Service {
  icon: string;
  title: string;
  description: string;
  price: string;
  duration: string;
}

const services: Service[] = [
  { icon: "🕉️", title: "Custom Tattoo Design", description: "Every tattoo is a one-of-a-kind creation. We collaborate with you to design something deeply personal — your vision, our artistry.", price: "Starting NPR 3,000", duration: "1–8+ hours" },
  { icon: "☸️", title: "Mandala & Sacred Geometry", description: "Our signature style. Precision, symmetry, and spiritual depth combined into timeless geometric masterpieces.", price: "Starting NPR 4,000", duration: "2–6 hours" },
  { icon: "🪬", title: "Hindu Mythology Art", description: "Ganesh, Shiva, Kali, sacred yantras, guardian tigers — we breathe life into the divine with masterful black & gray artistry.", price: "Starting NPR 5,000", duration: "3–10+ hours" },
  { icon: "✒️", title: "Fine Line Tattoo", description: "Delicate, precise, and eternally elegant. Perfect for minimalist designs, florals, and subtle personal symbols.", price: "Starting NPR 2,500", duration: "1–3 hours" },
  { icon: "🎨", title: "Cover-Up Tattoo", description: "Transform an old tattoo into something you love. Our artists specialize in creative cover-up solutions.", price: "Starting NPR 4,500", duration: "2–6 hours" },
  { icon: "💎", title: "Piercing", description: "Professional piercing services with top-grade hypoallergenic jewelry. Safe, hygienic, and stylish.", price: "Starting NPR 500", duration: "15–30 min" },
];

export default function ServicesPage() {
  return (
    <div>
      <div className="bg-dark2 py-20 border-b border-gold/10">
        <div className="container-custom text-center">
          <div className="section-label">EXPERTISE</div>
          <h1 className="section-title text-6xl md:text-7xl tracking-[-3px] mt-2 mb-3">Our Services</h1>
          <p className="max-w-md mx-auto text-lg text-cream/70">Premium tattoo and piercing experiences.</p>
          <div className="gold-divider mx-auto mt-8" />
        </div>
      </div>

      <div className="section bg-black">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <div key={index} className="card-dark p-8 group hover:border-gold/70">
                <div className="text-[52px] mb-6 opacity-90 group-hover:opacity-100 transition">{service.icon}</div>
                
                <h3 className="font-heading text-3xl tracking-[-1px] mb-3">{service.title}</h3>
                
                <p className="text-[15px] text-cream/80 leading-snug mb-8 pr-3">{service.description}</p>
                
                <div className="flex items-center justify-between text-sm mt-auto pt-4 border-t border-gold/10">
                  <div>
                    <div className="text-xs text-muted tracking-wider">STARTING FROM</div>
                    <div className="text-gold font-medium tracking-tight">{service.price}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted tracking-wider">DURATION</div>
                    <div className="text-cream/80">{service.duration}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-dark py-14 border-t border-gold/10">
        <div className="container-custom text-center max-w-lg mx-auto">
          <div className="text-xs tracking-[3px] text-gold">PRICING NOTE</div>
          <p className="mt-4 text-sm text-cream/80">All prices are starting rates. Final price depends on size, complexity, placement, and number of sessions. Free consultation before every session.</p>
          
          <Link href="/contact" className="mt-8 inline-flex btn-gold items-center gap-3 group">
            BOOK YOUR CONSULTATION <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
