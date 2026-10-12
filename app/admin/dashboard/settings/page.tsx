'use client';

import React, { useEffect, useState } from 'react';
import { ExternalLink, RotateCcw, Save } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import {
  DEFAULT_SETTINGS,
  mergeSettings,
  type SettingsKey,
  type SiteSettings,
} from '@/lib/settings';

interface FieldDef {
  /** Which settings row this field is stored in (defaults to the card's key). */
  section?: SettingsKey;
  name: string;
  label: string;
  type?: 'text' | 'number' | 'textarea';
  step?: string;
  hint?: string;
}

interface SectionDef {
  key: SettingsKey;
  title: string;
  description: string;
  fields: FieldDef[];
}

// Every field the admin can change. Anything added here shows up automatically.
const SECTIONS: SectionDef[] = [
  {
    key: 'studio',
    title: 'Studio Information',
    description: 'Name, tagline and location shown across the website.',
    fields: [
      { name: 'name', label: 'Studio name' },
      { name: 'tagline', label: 'Tagline (hero section)', type: 'textarea' },
      { name: 'location', label: 'Address / location' },
      { name: 'founded', label: 'Founded year', type: 'number' },
    ],
  },
  {
    key: 'social',
    title: 'Contact & Social Media',
    description: 'Phone, WhatsApp, email and social handles. Links are generated automatically.',
    fields: [
      { section: 'studio', name: 'phone', label: 'Phone number' },
      { section: 'studio', name: 'whatsappDisplay', label: 'WhatsApp (display format)', hint: 'e.g. +977 9857089950' },
      { section: 'studio', name: 'whatsappNumber', label: 'WhatsApp (digits only)', hint: 'Country code + number, no spaces or +. Used for the wa.me link.' },
      { section: 'studio', name: 'email', label: 'Email address' },
      { name: 'instagram', label: 'Instagram handle', hint: 'e.g. @tattoobizbutwal' },
      { name: 'facebook', label: 'Facebook page slug', hint: 'e.g. /tattoobizbutwal' },
      { name: 'tiktok', label: 'TikTok handle', hint: 'e.g. @tattoobizbutwal' },
    ],
  },
  {
    key: 'stats',
    title: 'Stats Bar',
    description: 'Numbers shown on the homepage and hero.',
    fields: [
      { name: 'years', label: 'Years in business', hint: 'e.g. 8+' },
      { name: 'clients', label: 'Clients served', hint: 'e.g. 500+' },
      { name: 'googleRating', label: 'Google rating', type: 'number', step: '0.1' },
      { name: 'artists', label: 'Number of artists', type: 'number' },
    ],
  },
  {
    key: 'home',
    title: 'Homepage "Our Story" Block',
    description: 'Paragraph and badge in the About preview on the homepage.',
    fields: [
      { name: 'aboutText', label: 'Paragraph', type: 'textarea' },
      { name: 'aboutBadgeTitle', label: 'Badge title' },
      { name: 'aboutBadgeSubtitle', label: 'Badge subtitle' },
    ],
  },
  {
    key: 'about',
    title: 'About Page',
    description: 'Story paragraphs on the /about page.',
    fields: [
      { name: 'paragraph1', label: 'Paragraph 1', type: 'textarea' },
      { name: 'paragraph2', label: 'Paragraph 2', type: 'textarea' },
    ],
  },
];

export default function SettingsManager() {
  const [draft, setDraft] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<SettingsKey | null>(null);

  useEffect(() => {
    let active = true;
    supabase
      .from('site_settings')
      .select('key, value')
      .then(({ data, error }) => {
        if (!active) return;
        if (error) {
          toast.error('Failed to load settings: ' + error.message);
        } else {
          const merged = mergeSettings(data);
          setDraft(merged);
          setSaved(merged);
        }
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const setField = (section: SettingsKey, field: string, value: string | number) => {
    setDraft((d) => ({ ...d, [section]: { ...d[section], [field]: value } }) as SiteSettings);
  };

  // Settings rows that a card writes to (a card can touch more than one row).
  const rowsFor = (sec: SectionDef): SettingsKey[] =>
    Array.from(new Set(sec.fields.map((f) => f.section ?? sec.key)));

  const isSectionDirty = (sec: SectionDef) =>
    rowsFor(sec).some((k) => JSON.stringify(draft[k]) !== JSON.stringify(saved[k]));

  const saveSection = async (sec: SectionDef) => {
    setSavingKey(sec.key);
    const rows = rowsFor(sec).map((k) => ({
      key: k,
      value: draft[k],
      updated_at: new Date().toISOString(),
    }));
    const { error } = await supabase.from('site_settings').upsert(rows, { onConflict: 'key' });
    setSavingKey(null);

    if (error) {
      toast.error(
        error.message.includes('row-level security')
          ? 'Not allowed: this account is not an admin.'
          : 'Failed to save: ' + error.message
      );
      return;
    }
    setSaved((s) => {
      const next = { ...s };
      for (const r of rows) (next as Record<string, unknown>)[r.key] = r.value;
      return next;
    });
    toast.success('Saved. Refresh the public site to see changes.');
  };

  const resetSection = (sec: SectionDef) => {
    if (!confirm('Discard unsaved changes in this section?')) return;
    setDraft((d) => {
      const next = { ...d };
      for (const k of rowsFor(sec)) (next as Record<string, unknown>)[k] = saved[k];
      return next;
    });
  };

  if (loading) return <div className="py-20 text-center text-muted">Loading settings...</div>;

  return (
    <div>
      <div className="mb-8 flex items-end justify-between gap-4 flex-wrap">
        <div>
          <div className="section-label">SITE SETTINGS</div>
          <h1 className="font-heading text-5xl tracking-[-2px]">Website Content</h1>
          <p className="text-muted mt-2 max-w-2xl">
            Edit the studio details, contact info, social links, stats and copy used across the public website.
          </p>
        </div>
        <a href="/" target="_blank" rel="noopener noreferrer" className="btn-outline-gold flex items-center gap-2 text-sm">
          VIEW WEBSITE <ExternalLink size={14} />
        </a>
      </div>

      <div className="space-y-6">
        {SECTIONS.map((section) => {
          const isDirty = isSectionDirty(section);
          return (
            <div key={section.key} className="card-dark p-6">
              <div className="flex items-start justify-between gap-4 mb-5">
                <div>
                  <div className="font-heading text-2xl tracking-tight">{section.title}</div>
                  <p className="text-sm text-muted mt-1">{section.description}</p>
                </div>
                {isDirty && (
                  <span className="px-3 py-1 rounded-full text-xs tracking-wider bg-yellow-500/10 text-yellow-400 whitespace-nowrap">
                    UNSAVED CHANGES
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {section.fields.map((field) => {
                  const owner = field.section ?? section.key;
                  const values = draft[owner] as unknown as Record<string, string | number>;
                  const inputValue = values[field.name] ?? '';
                  const common = {
                    value: inputValue,
                    onChange: (
                      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
                    ) =>
                      setField(
                        owner,
                        field.name,
                        field.type === 'number' ? Number(e.target.value) : e.target.value
                      ),
                    className: 'input-dark mt-1',
                  };
                  return (
                    <div key={field.name} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
                      <label className="text-xs text-gold tracking-wider uppercase">{field.label}</label>
                      {field.type === 'textarea' ? (
                        <textarea {...common} rows={3} />
                      ) : (
                        <input {...common} type={field.type === 'number' ? 'number' : 'text'} step={field.step} />
                      )}
                      {field.hint && <p className="text-[11px] text-muted mt-1">{field.hint}</p>}
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => resetSection(section)}
                  disabled={!isDirty}
                  className="px-4 py-2 hover:bg-dark rounded-xl flex items-center gap-2 text-sm disabled:opacity-40"
                >
                  <RotateCcw size={15} /> Discard
                </button>
                <button
                  onClick={() => saveSection(section)}
                  disabled={!isDirty || savingKey === section.key}
                  className="btn-gold px-6 py-2 flex items-center gap-2 text-sm disabled:opacity-40"
                >
                  <Save size={15} /> {savingKey === section.key ? 'SAVING...' : 'SAVE'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
