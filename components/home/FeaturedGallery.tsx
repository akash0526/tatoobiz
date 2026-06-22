'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface FeaturedItem {
  id: number;
  title: string;
  style: string;
  artist: string;
  image: string;
}

const featuredItems: FeaturedItem[] = [
  { id: 1, title: "Lord Shiva", style: "Hindu Mythology", artist: "Bijay", image: "https://picsum.photos/id/1015/800/900" },
  { id: 2, title: "Mandala Sleeve", style: "Mandala", artist: "Samir", image: "https://picsum.photos/id/1005/800/900" },
  { id: 3, title: "Geometric Lotus", style: "Sacred Geometry", artist: "Sunita", image: "https://picsum.photos/id/106/800/900" },
  { id: 4, title: "Fine Line Rose", style: "Fine Line", artist: "Sunita", image: "https://picsum.photos/id/201/800/900" },
  { id: 5, title: "Ganesh Portrait", style: "Hindu Mythology", artist: "Bijay", image: "https://picsum.photos/id/160/800/900" },
  { id: 6, title: "Black & Gray Tiger", style: "Black & Gray", artist: "Samir", image: "https://picsum.photos/id/251/800/900" },
];

export default function FeaturedGallery() {
  return (
    <section className="section bg-black">
      <div className="container-custom">
        <div className="flex justify-between items-end mb-10">
          <div>
            <div className="section-label">PORTFOLIO</div>
            <h2 className="section-title text-5xl md:text-6xl">Featured Work</h2>
          </div>
          <Link href="/gallery" className="hidden md:flex btn-outline-gold items-center gap-2 group">
            VIEW FULL GALLERY <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featuredItems.map((item, index) => (
            <div key={index} className="gallery-item group">
              <img 
                src={item.image} 
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="gallery-overlay">
                <div>
                  <div className="font-heading text-xl tracking-tight text-cream mb-1">{item.title}</div>
                  <div className="flex justify-between items-end">
                    <div>
                      <div className="text-gold text-sm tracking-wider">{item.style}</div>
                      <div className="text-xs text-cream/60 mt-0.5">by {item.artist}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-9 md:hidden">
          <Link href="/gallery" className="btn-outline-gold">VIEW FULL GALLERY</Link>
        </div>
      </div>
    </section>
  );
}
