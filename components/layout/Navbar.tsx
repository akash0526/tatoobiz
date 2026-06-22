'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Phone } from 'lucide-react';
import { NAV_LINKS, STUDIO_INFO, SOCIAL_LINKS } from '@/lib/constants';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-lg border-b border-gold/10">
      <div className="container-custom">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gold to-gold-light flex items-center justify-center">
              <span className="text-black font-heading text-xl font-bold tracking-tighter">TB</span>
            </div>
            <div>
              <div className="font-heading text-xl tracking-[-1px] text-cream">TATTOO BIZ</div>
              <div className="text-[10px] text-gold/70 -mt-1 tracking-[2px]">BUTWAL</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-10">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="nav-link"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            <a 
              href={SOCIAL_LINKS.whatsapp} 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn-whatsapp text-sm px-6 py-2.5"
            >
              <Phone className="w-4 h-4" /> Book Now
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-cream"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden mobile-menu">
          <div className="container-custom pt-24 pb-10">
            <div className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-cream text-xl py-4 border-b border-gold/10"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="mt-8">
              <a 
                href={SOCIAL_LINKS.whatsapp} 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn-whatsapp w-full justify-center"
                onClick={() => setIsOpen(false)}
              >
                <Phone className="w-4 h-4" /> Book on WhatsApp
              </a>
            </div>

            <div className="mt-8 text-center text-sm text-muted">
              {STUDIO_INFO.phone} • {STUDIO_INFO.location}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
