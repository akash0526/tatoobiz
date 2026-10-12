'use client';

import React, { useState, useEffect } from 'react';
import { Edit2, Plus, Save, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

interface Service {
  id: string;
  icon: string;
  title: string;
  description: string;
  price: string;
  duration: string;
  is_active: boolean;
  order_index: number;
}

export default function ServicesManager() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [showNew, setShowNew] = useState(false);
  const emptyService = { icon: '', title: '', description: '', price: '', duration: '' };
  const [newForm, setNewForm] = useState(emptyService);

  const fetchServices = async () => {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('order_index');

    if (!error) setServices(data || []);
    else toast.error('Failed to load services');
    setLoading(false);
  };

  useEffect(() => { fetchServices(); }, []);

  const startEdit = (service: Service) => {
    setEditingId(service.id);
    setEditForm({ ...service });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = async () => {
    const { error } = await supabase
      .from('services')
      .update({
        icon: editForm.icon,
        title: editForm.title,
        description: editForm.description,
        price: editForm.price,
        duration: editForm.duration,
      })
      .eq('id', editingId);

    if (!error) {
      toast.success('Service updated successfully');
      cancelEdit();
      fetchServices();
    } else {
      toast.error('Failed to update service');
    }
  };

  const toggleActive = async (id: string, currentActive: boolean) => {
    const { error } = await supabase
      .from('services')
      .update({ is_active: !currentActive })
      .eq('id', id);

    if (!error) {
      toast.success('Service status updated');
      fetchServices();
    }
  };

  const addService = async () => {
    if (!newForm.title.trim() || !newForm.icon.trim()) {
      toast.error('Icon (emoji) and title are required');
      return;
    }
    const nextOrder = services.reduce((max, s) => Math.max(max, s.order_index), 0) + 1;
    const { error } = await supabase.from('services').insert([{ ...newForm, order_index: nextOrder, is_active: true }]);
    if (!error) {
      toast.success('Service added');
      setNewForm(emptyService);
      setShowNew(false);
      fetchServices();
    } else {
      toast.error('Failed to add service');
    }
  };

  const deleteService = async (id: string) => {
    if (!confirm('Delete this service permanently?')) return;
    const { error } = await supabase.from('services').delete().eq('id', id);
    if (!error) {
      toast.success('Service deleted');
      fetchServices();
    } else {
      toast.error('Failed to delete service');
    }
  };

  if (loading) return <div className="py-20 text-center">Loading services...</div>;

  return (
    <div>
      <div className="mb-8">
        <div className="section-label">SERVICES</div>
        <h1 className="font-heading text-5xl tracking-[-2px]">Manage Services</h1>
      </div>

      <div className="mb-6">
        {!showNew ? (
          <button onClick={() => setShowNew(true)} className="btn-gold px-5 py-2 flex items-center gap-2 text-sm">
            <Plus size={16} /> ADD SERVICE
          </button>
        ) : (
          <div className="card-dark p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-xs text-gold tracking-wider">ICON (EMOJI)</label>
                <input value={newForm.icon} onChange={e => setNewForm({ ...newForm, icon: e.target.value })} className="input-dark mt-1" />
              </div>
              <div className="md:col-span-3">
                <label className="text-xs text-gold tracking-wider">TITLE</label>
                <input value={newForm.title} onChange={e => setNewForm({ ...newForm, title: e.target.value })} className="input-dark mt-1" />
              </div>
            </div>
            <div>
              <label className="text-xs text-gold tracking-wider">DESCRIPTION</label>
              <textarea value={newForm.description} onChange={e => setNewForm({ ...newForm, description: e.target.value })} className="input-dark mt-1" rows={2} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-gold tracking-wider">PRICE</label>
                <input value={newForm.price} onChange={e => setNewForm({ ...newForm, price: e.target.value })} className="input-dark mt-1" placeholder="Starting NPR 3,000" />
              </div>
              <div>
                <label className="text-xs text-gold tracking-wider">DURATION</label>
                <input value={newForm.duration} onChange={e => setNewForm({ ...newForm, duration: e.target.value })} className="input-dark mt-1" placeholder="1–3 hours" />
              </div>
              <div className="flex items-end gap-3">
                <button onClick={addService} className="btn-gold flex-1">SAVE</button>
                <button onClick={() => { setShowNew(false); setNewForm(emptyService); }} className="btn-outline-gold flex-1">CANCEL</button>
              </div>
            </div>
          </div>
        )}
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
                  <button onClick={() => toggleActive(service.id, service.is_active)} className="px-4 py-2 hover:bg-dark rounded-xl text-sm">
                    {service.is_active ? 'Hide' : 'Show'}
                  </button>
                  <button onClick={() => deleteService(service.id)} title="Delete service" className="px-3 py-2 hover:bg-red-900/30 rounded-xl text-red-400">
                    <Trash2 size={16} />
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