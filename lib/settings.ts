// Central definition of every admin-editable site setting.
// The values here are the fallback used when the database has no row yet
// (or Supabase is unreachable). The live values come from the `site_settings`
// table and are edited at /admin/dashboard/settings.

export interface StudioSettings {
  name: string;
  tagline: string;
  location: string;
  phone: string;
  whatsappDisplay: string;
  whatsappNumber: string; // digits only, country code included, e.g. 9779857089950
  email: string;
  founded: number;
}

export interface SocialSettings {
  instagram: string; // handle, e.g. @tattoobizbutwal
  facebook: string; // page slug, e.g. /tattoobizbutwal
  tiktok: string; // handle, e.g. @tattoobizbutwal
}

export interface StatsSettings {
  years: string;
  clients: string;
  googleRating: number;
  artists: number;
}

export interface HomeSettings {
  aboutText: string;
  aboutBadgeTitle: string;
  aboutBadgeSubtitle: string;
}

export interface AboutPageSettings {
  paragraph1: string;
  paragraph2: string;
}

export interface SiteSettings {
  studio: StudioSettings;
  social: SocialSettings;
  stats: StatsSettings;
  home: HomeSettings;
  about: AboutPageSettings;
}

export const DEFAULT_SETTINGS: SiteSettings = {
  studio: {
    name: 'Tattoo Biz Butwal',
    tagline: 'Where Art Meets Skin — Sacred Stories Inked for Eternity',
    location: 'B.P. Chowk, Butwal, Nepal',
    phone: '071-590044',
    whatsappDisplay: '+977 9857089950',
    whatsappNumber: '9779857089950',
    email: 'tattoobizbutwal@gmail.com',
    founded: 2016,
  },
  social: {
    instagram: '@tattoobizbutwal',
    facebook: '/tattoobizbutwal',
    tiktok: '@tattoobizbutwal',
  },
  stats: {
    years: '8+',
    clients: '500+',
    googleRating: 4.5,
    artists: 3,
  },
  home: {
    aboutText:
      'Since 2016, Tattoo Biz has been the premier destination for sacred, meaningful tattoos in Nepal. We specialize in Hindu mythology, mandalas, and fine line work — creating timeless art on skin.',
    aboutBadgeTitle: 'NEPAL TATTOO CONVENTION',
    aboutBadgeSubtitle: 'Featured Artist',
  },
  about: {
    paragraph1:
      'Tattoo Biz Butwal was founded in 2016 by Bijay with a simple vision: to create a space where sacred art and personal expression meet on the skin.',
    paragraph2:
      'What started as a small studio in B.P. Chowk has grown into one of Nepal’s most respected tattoo destinations — known for its dedication to hygiene, artistry, and respect for traditional and spiritual iconography.',
  },
};

export const SETTINGS_KEYS = ['studio', 'social', 'stats', 'home', 'about'] as const;
export type SettingsKey = (typeof SETTINGS_KEYS)[number];

/** Merge rows from the site_settings table over the defaults, section by section. */
export function mergeSettings(
  rows: { key: string; value: unknown }[] | null | undefined
): SiteSettings {
  const merged: SiteSettings = {
    studio: { ...DEFAULT_SETTINGS.studio },
    social: { ...DEFAULT_SETTINGS.social },
    stats: { ...DEFAULT_SETTINGS.stats },
    home: { ...DEFAULT_SETTINGS.home },
    about: { ...DEFAULT_SETTINGS.about },
  };
  for (const row of rows ?? []) {
    if (!(SETTINGS_KEYS as readonly string[]).includes(row.key)) continue;
    if (!row.value || typeof row.value !== 'object') continue;
    const key = row.key as SettingsKey;
    // Object.assign keeps the typed shape; unknown keys are simply ignored by the UI.
    Object.assign(merged[key], row.value);
  }
  return merged;
}

export interface SiteLinks {
  whatsapp: string;
  instagram: string;
  facebook: string;
  tiktok: string;
}

/** Build public URLs from the handles stored in settings. */
export function buildLinks(settings: SiteSettings): SiteLinks {
  const digits = settings.studio.whatsappNumber.replace(/\D/g, '');
  const igHandle = settings.social.instagram.replace(/^@/, '');
  const fbSlug = settings.social.facebook.replace(/^\//, '');
  const ttHandle = settings.social.tiktok.replace(/^@/, '');
  return {
    whatsapp: `https://wa.me/${digits}`,
    instagram: `https://www.instagram.com/${igHandle}`,
    facebook: `https://www.facebook.com/${fbSlug}`,
    tiktok: `https://www.tiktok.com/@${ttHandle}`,
  };
}
