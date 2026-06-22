'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface ArtistPreview {
  name: string;
  role: string;
  specialties: string[];
  photo: string;
}

const artists: ArtistPreview[] = [
  { 
    name: "Bijay", 
    role: "Founder & Lead Artist", 
    specialties: ["Hindu Mythology", "Mandala"], 
    photo: "https://picsum.photos/id/1005/600/700" 
  },
  { 
    name: "Samir", 
    role: "Senior Tattoo Artist", 
    specialties: ["Fine Line", "Cover-Up"], 
    photo: "https://picsum.photos/id/1011/600/700" 
  },
  { 
    name: "Sunita Magar", 
    role: "Tattoo Artist", 
    specialties: ["Sacred Geometry", "Floral"], 
    photo: "https://picsum.photos/id/1009/600/700" 
  },
];

export default function ArtistsPreview() {
  return (
    <section className="section bg-black">
      <div className="container-custom">
        <div className="flex justify-between items-end mb-10">
          <div>
            <div className="section-label">THE TEAM</div>
            <h2 className="section-title">Meet Our Artists</h2>
          </div>
          <Link href="/artists" className="hidden md:flex btn-outline-gold items-center gap-2 group">
            MEET THE TEAM <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {artists.map((artist, index) => (
            <div key={index} className="group">
              <div className="aspect-[4/3.3] overflow-hidden rounded-2xl mb-5 relative">
                <img 
                  src={artist.photo} 
                  alt={artist.name}
                  className="w-full h-full object-cover grayscale-[0.15] group-hover:grayscale-0 transition-all duration-700"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent h-1/3" />
              </div>
              <div>
                <div className="font-heading text-3xl tracking-tight text-cream mb-1">{artist.name}</div>
                <div className="text-gold text-xs tracking-[2px] mb-4">{artist.role}</div>
                <div className="flex flex-wrap gap-1.5">
                  {artist.specialties.map((spec, i) => (
                    <span key={i} className="px-3 py-px rounded-full border border-gold/30 text-xs tracking-wider text-gold/80">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-9 md:hidden">
          <Link href="/artists" className="btn-outline-gold">MEET THE TEAM</Link>
        </div>
      </div>
    </section>
  );
}
