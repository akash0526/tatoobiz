'use client';

import React, { useState } from 'react';
import { Edit2, Save, X } from 'lucide-react';
import { toast } from 'sonner';

interface Service {
  id: number;
  icon: string;
  title: string;
  description: string;
  price: string;
  duration: string;
  is_active: boolean;
}

export default function ServicesManager() {
  const [services, setServices] = useState<Service[]>([
    { id: 1, icon: "🕉️", title: "Custom Tattoo Design", description: "One-of-a-kind creations tailored to your vision.", price: "Starting NPR 3,000", duration: "1–8+ hours", is_active: true },
    { id: 2, icon: "☸️", title: "Mandala & Sacred Geometry", description: "Precision and spiritual depth.", price: "Starting NPR 4,000", duration: "2–6 hours", is_active: true },
    { id: 3, icon: "🪬", title: "Hindu Mythology Art", description: "Ganesh, Shiva, Kali in black & gray.", price: "Starting NPR 5,000", duration: "3–10+ hours", is_active: true },
    { id: 4, icon: "✒️", title: "Fine Line Tattoo", description: "Delicate and elegant work.", price: "Starting NPR 2,500", duration: "1–3 hours", is_active: true },
    { id: 5, icon: "🎨", title: "Cover-Up Tattoo", description: "Transform old tattoos.", price: "Starting NPR 4,500", duration: "2–6 hours", is_active: true },
    { id: 6, icon: "💎", title: "Piercing", description: "Professional piercing services.", price: "Starting NPR 500", duration: "15–30 min", is_active: true },
  ]);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<any>({});

  const startEdit = (service: Service) => {
    setEditingId(service.id);
    setEditForm({ ...service });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = () => {
    setServices(services.map(s => 
      s.id === editingId ? { ...editForm } : s
    ));
    setEditingId(null);
    toast.success("Service updated successfully");
  };

  const toggleActive = (id: number) => {
    setServices(services.map(s =>
      s.id === id ? { ...s, is_active: !s.is_active } : s
    ));
    toast.success("Service status updated");
  };

  return (
    <div>
      <div className="mb-8">
        <div className="section-label">SERVICES</div>
        <h1 className="font-heading text-5xl tracking-[-2px]">Manage Services</h1>
      </div>

      <div className="space-y-4">
        {services.map((service) => (
          <div key={service.id} className="card-dark p-6">
            {editingId === service.id ? (
              // Edit Mode
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="text-xs text-gold tracking-wider">ICON</label>
                    <input 
                      value={editForm.icon} 
                      onChange={e => setEditForm({...editForm, icon: e.target.value})}
                      className="input-dark mt-1" 
                    />
                  </div>
                  <div className="md:col-span-3">
                    <label className="text-xs text-gold tracking-wider">TITLE</label>
                    <input 
                      value={editForm.title} 
                      onChange={e => setEditForm({...editForm, title: e.target.value})}
                      className="input-dark mt-1" 
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-gold tracking-wider">DESCRIPTION</label>
                  <textarea 
                    value={editForm.description} 
                    onChange={e => setEditForm({...editForm, description: e.target.value})}
                    className="input-dark mt-1" rows={2} 
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs text-gold tracking-wider">PRICE</label>
                    <input 
                      value={editForm.price} 
                      onChange={e => setEditForm({...editForm, price: e.target.value})}
                      className="input-dark mt-1" 
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gold tracking-wider">DURATION</label>
                    <input 
                      value={editForm.duration} 
                      onChange={e => setEditForm({...editForm, duration: e.target.value})}
                      className="input-dark mt-1" 
                    />
                  </div>
                  <div className="flex items-end gap-3">
                    <button onClick={saveEdit} className="btn-gold flex-1">SAVE</button>
                    <button onClick={cancelEdit} className="btn-outline-gold flex-1">CANCEL</button>
                  </div>
                </div>
              </div>
            ) : (
              // View Mode
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="text-6xl opacity-90">{service.icon}</div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="font-heading text-2xl tracking-tight">{service.title}</div>
                    <div className={`px-3 py-1 rounded-full text-xs tracking-wider ${service.is_active ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                      {service.is_active ? 'ACTIVE' : 'INACTIVE'}
                    </div>
                  </div>
                  
                  <p className="text-cream/80 mt-2 max-w-2xl">{service.description}</p>
                  
                  <div className="flex gap-8 mt-4 text-sm">
                    <div>
                      <span className="text-muted text-xs block">PRICE</span>
                      <span className="text-gold">{service.price}</span>
                    </div>
                    <div>
                      <span className="text-muted text-xs block">DURATION</span>
                      <span>{service.duration}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mt-4 md:mt-0">
                  <button onClick={() => startEdit(service)} className="px-4 py-2 hover:bg-dark rounded-xl flex items-center gap-2 text-sm">
                    <Edit2 size={16} /> Edit
                  </button>
                  <button onClick={() => toggleActive(service.id)} className="px-4 py-2 hover:bg-dark rounded-xl text-sm">
                    {service.is_active ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
