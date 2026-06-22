'use client';

import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { STUDIO_INFO, SOCIAL_LINKS, STYLES, ARTISTS_LIST } from '@/lib/constants';
import { toast } from 'sonner';

interface BookingForm {
  name: string;
  phone: string;
  email: string;
  style: string;
  preferred_artist: string;
  body_part: string;
  design_idea: string;
  preferred_date: string;
  message: string;
}

export default function ContactPage() {
  const [formData, setFormData] = useState<BookingForm>({
    name: '', phone: '', email: '', style: '', preferred_artist: '', 
    body_part: '', design_idea: '', preferred_date: '', message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone) {
      toast.error("Please fill in your name and phone number");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to submit');

      toast.success("Booking request sent! We'll contact you shortly.", {
        description: "You can also message us on WhatsApp.",
        action: {
          label: "Open WhatsApp",
          onClick: () => window.open(SOCIAL_LINKS.whatsapp, '_blank')
        }
      });

      // Reset form
      setFormData({
        name: '', phone: '', email: '', style: '', preferred_artist: '', 
        body_part: '', design_idea: '', preferred_date: '', message: ''
      });
    } catch (error) {
      toast.error("Something went wrong. Please try again or message us on WhatsApp.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="bg-dark2 py-20 border-b border-gold/10">
        <div className="container-custom text-center">
          <div className="section-label">BOOK YOUR SESSION</div>
          <h1 className="section-title text-6xl md:text-7xl tracking-[-3px] mt-2 mb-3">Get In Touch</h1>
          <p className="max-w-md mx-auto text-lg text-cream/70">Let's create something meaningful together.</p>
          <div className="gold-divider mx-auto mt-8" />
        </div>
      </div>

      <div className="section bg-black">
        <div className="container-custom">
          <div className="grid lg:grid-cols-5 gap-16">
            
            {/* Contact Info */}
            <div className="lg:col-span-2">
              <div className="sticky top-24">
                <div className="font-heading text-4xl tracking-tight mb-7">Visit the Studio</div>
                
                <div className="space-y-7 text-[15px]">
                  <div className="flex gap-4">
                    <MapPin className="text-gold mt-1 flex-shrink-0" size={20} />
                    <div>
                      <div className="text-gold text-xs tracking-[2px]">LOCATION</div>
                      <div className="mt-1 text-cream/90">{STUDIO_INFO.location}</div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Phone className="text-gold mt-1 flex-shrink-0" size={20} />
                    <div>
                      <div className="text-gold text-xs tracking-[2px]">CALL US</div>
                      <a href={`tel:${STUDIO_INFO.phone}`} className="mt-1 block hover:text-gold transition-colors">{STUDIO_INFO.phone}</a>
                      <a href={SOCIAL_LINKS.whatsapp} target="_blank" className="mt-px block text-sm text-cream/70 hover:text-gold">+977 98570 89950 (WhatsApp)</a>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Mail className="text-gold mt-1 flex-shrink-0" size={20} />
                    <div>
                      <div className="text-gold text-xs tracking-[2px]">EMAIL</div>
                      <a href={`mailto:${STUDIO_INFO.email}`} className="mt-1 block hover:text-gold transition-colors">{STUDIO_INFO.email}</a>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Clock className="text-gold mt-1 flex-shrink-0" size={20} />
                    <div>
                      <div className="text-gold text-xs tracking-[2px]">STUDIO HOURS</div>
                      <div className="mt-1 text-cream/80 leading-snug text-sm">
                        Sunday – Thursday: 11:00 AM – 8:00 PM<br />
                        Friday – Saturday: 11:00 AM – 9:00 PM
                      </div>
                    </div>
                  </div>
                </div>

                {/* Socials */}
                <div className="mt-10 pt-8 border-t border-gold/10">
                  <div className="text-gold text-xs tracking-[2.5px] mb-3">FOLLOW US</div>
                  <div className="flex gap-5 text-sm">
                    <a href={SOCIAL_LINKS.instagram} target="_blank" className="hover:text-gold">Instagram</a>
                    <a href={SOCIAL_LINKS.facebook} target="_blank" className="hover:text-gold">Facebook</a>
                    <a href={SOCIAL_LINKS.tiktok} target="_blank" className="hover:text-gold">TikTok</a>
                  </div>
                </div>

                {/* Google Map Placeholder */}
                <div className="mt-8 rounded-2xl overflow-hidden border border-gold/10 aspect-video bg-dark2 flex items-center justify-center text-xs text-muted tracking-widest">
                  GOOGLE MAPS — B.P. CHOWK, BUTWAL
                </div>
              </div>
            </div>

            {/* Booking Form */}
            <div className="lg:col-span-3">
              <div className="card-dark p-9 md:p-11">
                <div className="mb-8">
                  <div className="font-heading text-3xl tracking-tight">Request a Booking</div>
                  <div className="text-sm text-muted mt-1">Fill out the form — we'll reach out within 24 hours</div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="text-xs tracking-widest text-gold mb-1.5 block">FULL NAME *</label>
                      <input type="text" name="name" value={formData.name} onChange={handleChange} required className="input-dark" placeholder="Your full name" />
                    </div>
                    <div>
                      <label className="text-xs tracking-widest text-gold mb-1.5 block">PHONE NUMBER *</label>
                      <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="input-dark" placeholder="+977 98XXXXXXXX" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="text-xs tracking-widest text-gold mb-1.5 block">EMAIL (OPTIONAL)</label>
                      <input type="email" name="email" value={formData.email} onChange={handleChange} className="input-dark" placeholder="you@email.com" />
                    </div>
                    <div>
                      <label className="text-xs tracking-widest text-gold mb-1.5 block">PREFERRED STYLE</label>
                      <select name="style" value={formData.style} onChange={handleChange} className="input-dark">
                        <option value="">Select a style</option>
                        {STYLES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="text-xs tracking-widest text-gold mb-1.5 block">PREFERRED ARTIST</label>
                      <select name="preferred_artist" value={formData.preferred_artist} onChange={handleChange} className="input-dark">
                        <option value="">No preference</option>
                        {ARTISTS_LIST.slice(0, 3).map(a => <option key={a} value={a}>{a}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs tracking-widest text-gold mb-1.5 block">BODY PLACEMENT</label>
                      <input type="text" name="body_part" value={formData.body_part} onChange={handleChange} className="input-dark" placeholder="e.g. Forearm, Sleeve, Back" />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs tracking-widest text-gold mb-1.5 block">DESIGN IDEA / DESCRIPTION</label>
                    <textarea name="design_idea" value={formData.design_idea} onChange={handleChange} className="input-dark" rows={3} placeholder="Describe your idea, reference images, or inspiration..." />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="text-xs tracking-widest text-gold mb-1.5 block">PREFERRED DATE</label>
                      <input type="date" name="preferred_date" value={formData.preferred_date} onChange={handleChange} className="input-dark" />
                    </div>
                    <div>
                      <label className="text-xs tracking-widest text-gold mb-1.5 block">ADDITIONAL NOTES</label>
                      <input type="text" name="message" value={formData.message} onChange={handleChange} className="input-dark" placeholder="Any special requests?" />
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="btn-gold w-full py-[17px] mt-4 text-sm tracking-[2px] disabled:opacity-75"
                  >
                    {isSubmitting ? "SENDING YOUR REQUEST..." : "SUBMIT BOOKING REQUEST"}
                  </button>
                </form>

                <div className="mt-7 pt-6 border-t border-gold/10 text-center">
                  <div className="text-xs text-muted tracking-wider">PREFER WHATSAPP?</div>
                  <a href={SOCIAL_LINKS.whatsapp} target="_blank" className="mt-3 inline-block btn-whatsapp">MESSAGE US DIRECTLY ON WHATSAPP</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
