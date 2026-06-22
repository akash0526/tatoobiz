'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface Service {
  icon: string;
  title: string;
  description: string;
  price: string;
}

const services: Service[] = [
  { 
    icon: "🕉️", 
    title: "Custom Tattoo Design", 
    description: "One-of-a-kind creations tailored to your vision and story.", 
    price: "Starting NPR 3,000" 
  },
  { 
    icon: "☸️", 
    title: "Mandala & Sacred Geometry", 
    description: "Precision, symmetry, and spiritual depth in every piece.", 
    price: "Starting NPR 4,000" 
  },
  { 
    icon: "🪬", 
    title: "Hindu Mythology Art", 
    description: "Ganesh, Shiva, Kali & sacred yantras in masterful black & gray.", 
    price: "Starting NPR 5,000" 
  },
];

export default function ServicesPreview() {
  return (
    <section className="section bg-dark2">
      <div className="container-custom">
        <div className="text-center mb-12">
          <div className="section-label">WHAT WE OFFER</div>
          <h2 className="section-title">Signature Services</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <div key={index} className="card-dark p-8 group hover:border-gold/60 transition-all">
              <div className="text-5xl mb-6 opacity-80 group-hover:opacity-100 transition">{service.icon}</div>
              <h3 className="font-heading text-2xl tracking-tight mb-3">{service.title}</h3>
              <p className="text-cream/80 text-[15px] leading-snug mb-6">{service.description}</p>
              <div className="text-gold text-sm font-medium tracking-wider mt-auto">{service.price}</div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link href="/services" className="btn-outline-gold inline-flex items-center gap-3 group">
            SEE ALL SERVICES <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
          </Link>
        </div>
      </div>
    </section>
  );
}
