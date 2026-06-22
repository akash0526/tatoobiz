'use client';

export default function MarqueeBanner() {
  const items = [
    "CUSTOM TATTOOS", "MANDALA ART", "HINDU MYTHOLOGY", "SACRED GEOMETRY", 
    "FINE LINE", "BLACK & GRAY", "COVER-UPS", "PIERCING", "LGBTQ+ FRIENDLY"
  ];

  return (
    <div className="bg-gradient-to-r from-gold to-gold-light py-3.5 overflow-hidden border-y border-black/20">
      <div className="flex items-center gap-8 animate-marquee whitespace-nowrap text-black text-xs tracking-[3.5px] font-medium">
        {[...items, ...items].map((item, index) => (
          <div key={index} className="flex items-center gap-8">
            <span>{item}</span>
            <span className="text-black/30">✦</span>
          </div>
        ))}
      </div>
    </div>
  );
}
