'use client';

import React, { useState } from 'react';
import { Check, X, Star } from 'lucide-react';
import { toast } from 'sonner';

interface Testimonial {
  id: number;
  client_name: string;
  rating: number;
  review_text: string;
  tattoo_type?: string;
  is_approved: boolean;
}

export default function TestimonialsManager() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([
    { id: 1, client_name: "Priya S.", rating: 5, review_text: "Bijay did my mandala sleeve and I am absolutely in love.", tattoo_type: "Mandala Sleeve", is_approved: true },
    { id: 2, client_name: "Rajan T.", rating: 5, review_text: "Got my Ganesh tattoo here. The team is so welcoming.", tattoo_type: "Ganesh Tattoo", is_approved: false },
    { id: 3, client_name: "Anisha K.", rating: 5, review_text: "Sunita did my fine line lotus and it's perfect.", tattoo_type: "Fine Line Lotus", is_approved: true },
  ]);

  const toggleApproval = (id: number) => {
    setTestimonials(testimonials.map(t =>
      t.id === id ? { ...t, is_approved: !t.is_approved } : t
    ));
    toast.success("Review status updated");
  };

  const deleteTestimonial = (id: number) => {
    if (!confirm("Delete this review?")) return;
    setTestimonials(testimonials.filter(t => t.id !== id));
    toast.success("Review deleted");
  };

  return (
    <div>
      <div className="mb-8">
        <div className="section-label">REVIEWS</div>
        <h1 className="font-heading text-5xl tracking-[-2px]">Testimonials</h1>
      </div>

      <div className="space-y-4">
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className="card-dark p-7">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-3">
                  <div className="font-medium text-xl">{testimonial.client_name}</div>
                  <div className="flex text-gold">
                    {Array.from({ length: testimonial.rating }).map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                  </div>
                </div>
                <div className="text-sm text-muted mt-1">{testimonial.tattoo_type}</div>
              </div>

              <div className={`px-4 py-1 rounded-full text-xs tracking-wider ${testimonial.is_approved ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                {testimonial.is_approved ? 'PUBLISHED' : 'PENDING'}
              </div>
            </div>

            <div className="mt-5 text-lg font-body-serif tracking-tight leading-snug text-cream/90">
              “{testimonial.review_text}”
            </div>

            <div className="flex gap-3 mt-6">
              <button 
                onClick={() => toggleApproval(testimonial.id)}
                className="btn-outline-gold text-sm flex items-center gap-2"
              >
                {testimonial.is_approved ? <X size={16} /> : <Check size={16} />}
                {testimonial.is_approved ? 'Hide' : 'Approve & Publish'}
              </button>
              <button 
                onClick={() => deleteTestimonial(testimonial.id)}
                className="px-5 py-2 text-sm text-red-400 hover:bg-red-950/30 rounded-xl flex items-center gap-2"
              >
                <X size={16} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
