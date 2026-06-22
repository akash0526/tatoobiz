import Link from 'next/link';
import { NAV_LINKS, STUDIO_INFO, SOCIAL_LINKS } from '@/lib/constants';
import { Phone, MessageCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-dark2 border-t border-gold/10 pt-16 pb-8">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gold to-gold-light flex items-center justify-center">
                <span className="text-black font-heading text-xl font-bold tracking-tighter">TB</span>
              </div>
              <div>
                <div className="font-heading text-2xl tracking-[-1px] text-cream">TATTOO BIZ</div>
                <div className="text-[10px] text-gold/70 -mt-1 tracking-[2px]">EST 2016</div>
              </div>
            </div>
            <p className="text-muted text-sm max-w-[220px]">
              Where Art Meets Skin — Sacred Stories Inked for Eternity
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <div className="text-gold text-xs tracking-[2px] font-medium mb-4">EXPLORE</div>
            <div className="flex flex-col gap-2.5 text-sm">
              {NAV_LINKS.map((link) => (
                <Link key={link.href} href={link.href} className="hover:text-gold transition-colors text-cream/80">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <div className="text-gold text-xs tracking-[2px] font-medium mb-4">CONTACT</div>
            <div className="space-y-3 text-sm">
              <div className="text-cream/80">{STUDIO_INFO.location}</div>
              <a href={`tel:${STUDIO_INFO.phone}`} className="block hover:text-gold transition-colors">{STUDIO_INFO.phone}</a>
              <a href={SOCIAL_LINKS.whatsapp} target="_blank" className="block hover:text-gold transition-colors flex items-center gap-2">
                <Phone size={15} /> {STUDIO_INFO.whatsapp}
              </a>
              <a href={`mailto:${STUDIO_INFO.email}`} className="block hover:text-gold transition-colors">{STUDIO_INFO.email}</a>
            </div>
          </div>

          {/* Social + Hours */}
          <div>
            <div className="text-gold text-xs tracking-[2px] font-medium mb-4">CONNECT</div>
            
            {/* Only WhatsApp remains */}
            <div className="flex gap-4 mb-8">
              <a href={SOCIAL_LINKS.whatsapp} target="_blank" className="text-cream/70 hover:text-gold transition-colors">
                <MessageCircle size={20} />
              </a>
            </div>

            <div>
              <div className="text-gold text-xs tracking-[2px] font-medium mb-2">STUDIO HOURS</div>
              <div className="text-sm text-cream/80 leading-relaxed">
                Sun–Thu: 11:00 AM – 8:00 PM<br />
                Fri–Sat: 11:00 AM – 9:00 PM
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-gold/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted">
          <div>© {new Date().getFullYear()} Tattoo Biz Butwal. All Rights Reserved.</div>
          <div className="flex gap-4">
            <span>LGBTQ+ Friendly</span>
            <span>•</span>
            <span>Nepal Tattoo Convention Artist</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
