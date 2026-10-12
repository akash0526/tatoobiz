'use client';

import { useSiteSettings } from '@/components/providers/SiteSettingsProvider';

export default function StatsBar() {
  const { settings } = useSiteSettings();
  const stats = [
    { number: settings.stats.years, label: "YEARS" },
    { number: settings.stats.clients, label: "CLIENTS" },
    { number: `${settings.stats.googleRating}★`, label: "GOOGLE" },
    { number: settings.stats.artists, label: "ARTISTS" },
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
