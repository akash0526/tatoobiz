'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

interface Artist {
  id: string;
  name: string;
  role: string;
  bio: string;
  specialties: string[];
  experience: string;
  is_active: boolean;
  photo_url: string;
}

export default function ArtistsManager() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingArtist, setEditingArtist] = useState<Artist | null>(null);
  const [formData, setFormData] = useState({
    name: '', role: '', bio: '', experience: '', photo_url: '', specialties: ''
  });

  const fetchArtists = async () => {
    const { data, error } = await supabase.from('artists').select('*').order('order_index');
    if (!error) setArtists(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchArtists(); }, []);

  const resetForm = () => {
    setFormData({ name: '', role: '', bio: '', experience: '', photo_url: '', specialties: '' });
    setEditingArtist(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const artistData = {
      name: formData.name,
      role: formData.role,
      bio: formData.bio,
      specialties: formData.specialties.split(',').map(s => s.trim()),
      experience: formData.experience,
      photo_url: formData.photo_url || "https://picsum.photos/id/1005/400/500",
      is_active: true
    };

    if (editingArtist) {
      const { error } = await supabase.from('artists').update(artistData).eq('id', editingArtist.id);
      if (!error) toast.success("Artist updated");
    } else {
      const { error } = await supabase.from('artists').insert([artistData]);
      if (!error) toast.success("Artist added");
    }

    fetchArtists();
    resetForm();
  };

  const editArtist = (artist: Artist) => {
    setEditingArtist(artist);
    setFormData({
      name: artist.name,
      role: artist.role,
      bio: artist.bio,
      experience: artist.experience,
      photo_url: artist.photo_url,
      specialties: artist.specialties.join(', ')
    });
    setShowForm(true);
  };

  const deleteArtist = async (id: string) => {
    if (!confirm("Delete this artist?")) return;
    await supabase.from('artists').delete().eq('id', id);
    toast.success("Artist deleted");
    fetchArtists();
  };

  if (loading) return <div className="py-20 text-center">Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-end mb-8">
        <div>
          <div className="section-label">TEAM</div>
          <h1 className="font-heading text-5xl tracking-[-2px]">Manage Artists</h1>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-gold flex items-center gap-2">
          <Plus size={18} /> ADD ARTIST
        </button>
      </div>

      {showForm && (
        <div className="card-dark p-8 mb-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid md:grid-cols-2 gap-5">
              <input type="text" placeholder="Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="input-dark" required />
              <input type="text" placeholder="Role" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="input-dark" required />
            </div>
            <textarea placeholder="Bio" value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} className="input-dark" rows={3} required />
            <div className="grid md:grid-cols-2 gap-5">
              <input type="text" placeholder="Experience" value={formData.experience} onChange={e => setFormData({...formData, experience: e.target.value})} className="input-dark" />
              <input type="text" placeholder="Specialties (comma separated)" value={formData.specialties} onChange={e => setFormData({...formData, specialties: e.target.value})} className="input-dark" />
            </div>
            <div className="flex gap-3">
              <button type="submit" className="btn-gold">{editingArtist ? 'UPDATE' : 'ADD ARTIST'}</button>
              <button type="button" onClick={resetForm} className="btn-outline-gold">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {artists.map((artist) => (
          <div key={artist.id} className="card-dark p-6 flex gap-6">
            <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-dark">
              <img src={artist.photo_url} alt={artist.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <div className="font-heading text-2xl tracking-tight">{artist.name}</div>
              <div className="text-gold text-sm tracking-wider">{artist.role}</div>
              <p className="text-sm mt-3 text-cream/80">{artist.bio}</p>
            </div>
            <div className="flex flex-col gap-2">
              <button onClick={() => editArtist(artist)} className="px-4 py-2 hover:bg-dark rounded-xl flex items-center gap-2 text-sm">
                <Edit2 size={16} /> Edit
              </button>
              <button onClick={() => deleteArtist(artist.id)} className="px-4 py-2 text-sm text-red-400 hover:bg-red-950/30 rounded-xl flex items-center gap-2">
                <Trash2 size={16} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
