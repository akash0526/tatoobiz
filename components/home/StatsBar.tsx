'use client';

import { STUDIO_INFO } from '@/lib/constants';

export default function StatsBar() {
  const stats = [
    { number: STUDIO_INFO.years, label: "YEARS" },
    { number: STUDIO_INFO.clients, label: "CLIENTS" },
    { number: `${STUDIO_INFO.googleRating}★`, label: "GOOGLE" },
    { number: STUDIO_INFO.artists, label: "ARTISTS" },
  ];

  return (
    <div className="border-y border-gold/10 py-8 bg-dark/50">
      <div className="container-custom">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, idx) => (
            <div key={idx}>
              <div className="text-4xl md:text-5xl font-heading tracking-[-1.5px] text-gold">{stat.number}</div>
              <div className="text-xs tracking-[3px] text-muted mt-1 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
