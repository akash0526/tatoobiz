'use client';

import React, { useState, useEffect } from 'react';
import { Check, X, Star } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

interface Testimonial {
  id: string;
  client_name: string;
  rating: number;
  review_text: string;
  tattoo_type?: string;
  is_approved: boolean;
  created_at: string;
}

export default function TestimonialsManager() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTestimonials = async () => {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error) setTestimonials(data || []);
    else toast.error('Failed to load testimonials');
    setLoading(false);
  };

  useEffect(() => { fetchTestimonials(); }, []);

  const toggleApproval = async (id: string, currentApproved: boolean) => {
    const { error } = await supabase
      .from('testimonials')
      .update({ is_approved: !currentApproved })
      .eq('id', id);

    if (!error) {
      toast.success('Review status updated');
      fetchTestimonials();
    } else {
      toast.error('Failed to update review');
    }
  };

  const deleteTestimonial = async (id: string) => {
    if (!confirm('Delete this review?')) return;

    const { error } = await supabase
      .from('testimonials')
      .delete()
      .eq('id', id);

    if (!error) {
      toast.success('Review deleted');
      fetchTestimonials();
    } else {
      toast.error('Failed to delete review');
    }
  };

  if (loading) return <div className="py-20 text-center">Loading testimonials...</div>;

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
              &ldquo;{testimonial.review_text}&rdquo;
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => toggleApproval(testimonial.id, testimonial.is_approved)}
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

        {testimonials.length === 0 && (
          <div className="card-dark p-8 text-center text-muted">
            No testimonials yet. Reviews submitted by clients will appear here.
          </div>
        )}
      </div>
    </div>
  );
}