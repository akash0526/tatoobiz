'use client';

import React from 'react';
import { SOCIAL_LINKS } from '@/lib/constants';
import { MessageCircle } from 'lucide-react';

interface Artist {
  name: string;
  role: string;
  bio: string;
  specialties: string[];
  experience: string;
  photo: string;
  instagram?: string;
}

const artists: Artist[] = [
  {
    name: "Bijay",
    role: "Founder & Lead Artist",
    bio: "Bijay is the founder of Tattoo Biz and a nationally recognized artist who has represented Nepal at the International Nepal Tattoo Convention. His work is deeply rooted in Hindu mythology and sacred geometry.",
    specialties: ["Hindu Mythology", "Mandala", "Black & Gray", "Sacred Geometry"],
    experience: "8+ years",
    photo: "https://picsum.photos/id/1005/700/900",
    instagram: "tattoobizbutwal"
  },
  {
    name: "Samir",
    role: "Senior Tattoo Artist",
    bio: "Samir brings a bold yet precise style to every piece. From custom designs to fine line work, his versatility makes every tattoo a unique masterpiece.",
    specialties: ["Custom Design", "Fine Line", "Cover-Up", "Geometric"],
    experience: "5+ years",
    photo: "https://picsum.photos/id/1011/700/900",
  },
  {
    name: "Sunita Magar",
    role: "Tattoo Artist",
    bio: "Sunita is a rising talent at Tattoo Biz, learning and growing with every piece she creates. Her fresh perspective brings unique energy to the studio.",
    specialties: ["Fine Line", "Floral", "Minimalist", "Animal Art"],
    experience: "2+ years",
    photo: "https://picsum.photos/id/1009/700/900",
  }
];

export default function ArtistsPage() {
  return (
    <div>
      {/* Header */}
      <div className="bg-dark2 py-20 border-b border-gold/10">
        <div className="container-custom text-center">
          <div className="section-label">THE ARTISTS</div>
          <h1 className="section-title text-6xl md:text-7xl tracking-[-3px] mt-2 mb-3">Meet the Team</h1>
          <p className="max-w-md mx-auto text-lg text-cream/70">Passionate artists dedicated to sacred, meaningful ink.</p>
          <div className="gold-divider mx-auto mt-8" />
        </div>
      </div>

      <div className="section bg-black">
        <div className="container-custom">
          <div className="grid md:grid-cols-3 gap-x-8 gap-y-14">
            {artists.map((artist, index) => (
              <div key={index} className="group">
                <div className="aspect-[4/4.2] overflow-hidden rounded-3xl mb-6 relative border border-gold/10">
                  <img 
                    src={artist.photo} 
                    alt={artist.name} 
                    className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700" 
                  />
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 to-transparent" />
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-heading text-[32px] tracking-[-1px] leading-none">{artist.name}</div>
                      <div className="text-gold text-xs tracking-[3px] mt-1.5">{artist.role}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-muted tracking-widest">EXPERIENCE</div>
                      <div className="text-gold text-xl tracking-tight font-medium">{artist.experience}</div>
                    </div>
                  </div>

                  <div className="mt-6 text-[15px] text-cream/85 leading-snug font-body-serif tracking-tight">
                    {artist.bio}
                  </div>

                  <div className="mt-6">
                    <div className="text-xs tracking-[2.5px] text-gold mb-3">SPECIALTIES</div>
                    <div className="flex flex-wrap gap-1.5">
                      {artist.specialties.map((spec, idx) => (
                        <span key={idx} className="px-4 py-1 text-xs tracking-wider border border-gold/30 rounded-full text-cream/80">
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>

                  {artist.instagram && (
                    <a 
                      href={SOCIAL_LINKS.instagram} 
                      target="_blank"
                      className="mt-8 inline-flex items-center gap-2 text-sm text-gold hover:text-gold-light transition-colors"
                    >
                      <MessageCircle size={16} /> FOLLOW ON INSTAGRAM
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Join CTA */}
      <div className="bg-dark2 py-16 border-t border-gold/10">
        <div className="container-custom text-center">
          <div className="max-w-xs mx-auto">
            <div className="text-gold text-sm tracking-[3px]">LOOKING FOR TALENT?</div>
            <div className="text-2xl font-heading tracking-tight mt-2">We're always looking for passionate artists.</div>
            <a href={SOCIAL_LINKS.whatsapp} target="_blank" className="mt-7 inline-block btn-gold">MESSAGE US ON WHATSAPP</a>
          </div>
        </div>
      </div>
    </div>
  );
}
