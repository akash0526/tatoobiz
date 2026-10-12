'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase';
import {
  DEFAULT_SETTINGS,
  buildLinks,
  mergeSettings,
  type SiteLinks,
  type SiteSettings,
} from '@/lib/settings';

interface SiteSettingsContextValue {
  settings: SiteSettings;
  links: SiteLinks;
  refresh: () => Promise<void>;
}

const SiteSettingsContext = createContext<SiteSettingsContextValue | null>(null);

/**
 * Loads the public `site_settings` rows (readable by anyone via RLS) and makes
 * them available to every component. Until the fetch finishes, the defaults in
 * lib/settings.ts are shown, so the page is never empty.
 */
export function SiteSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    let active = true;
    supabase
      .from('site_settings')
      .select('key, value')
      .then(({ data, error }) => {
        if (!active) return;
        if (error) {
          console.error('Failed to load site settings:', error.message);
          return;
        }
        setSettings(mergeSettings(data));
      });
    return () => {
      active = false;
    };
  }, []);

  // Re-fetch on demand (e.g. after an admin saves). Safe to call from event handlers.
  const refresh = useCallback(async () => {
    const { data, error } = await supabase.from('site_settings').select('key, value');
    if (!error) setSettings(mergeSettings(data));
  }, []);

  const value = useMemo(
    () => ({ settings, links: buildLinks(settings), refresh }),
    [settings, refresh]
  );

  return <SiteSettingsContext.Provider value={value}>{children}</SiteSettingsContext.Provider>;
}

export function useSiteSettings(): SiteSettingsContextValue {
  const ctx = useContext(SiteSettingsContext);
  if (!ctx) {
    // Fallback so components still render if used outside the provider.
    return { settings: DEFAULT_SETTINGS, links: buildLinks(DEFAULT_SETTINGS), refresh: async () => {} };
  }
  return ctx;
}
