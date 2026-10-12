# Tattoo Biz Butwal — Website & Admin Panel

A full-featured website for a tattoo studio, built with **Next.js 16**, **React 19**, **Tailwind CSS 4**, **Supabase** (database, authentication, row-level security) and **ImageKit** (photo storage).

The studio owner can manage the whole site from a password-protected admin panel:

- **Site content:** studio name, tagline, address, phone, WhatsApp, email, social links, homepage stats, and About page copy
- **Gallery:** upload, feature on the homepage, and delete tattoo photos
- **Artists:** add, edit, show/hide and delete artists
- **Services:** add, edit, show/hide and delete services and prices
- **Bookings:** review booking requests, update status, call or WhatsApp clients, delete requests
- **Testimonials:** approve or hide client reviews, or add new ones manually

See [ADMIN_GUIDE.md](ADMIN_GUIDE.md) for a walkthrough of every admin page.

---

## Requirements

- Node.js 20.9 or newer (Next.js 16 requirement)
- A free [Supabase](https://supabase.com) project
- A free [ImageKit](https://imagekit.io) account (for photo uploads)

## 1. Install

```bash
npm install
cp .env.example .env.local
```

## 2. Set up Supabase

1. **Create a project** at supabase.com.
2. **Create the database tables.** Open *SQL Editor*, paste the contents of `supabase-schema.sql`, and run it. This creates the tables, the public read policies, and sample data.
3. **Enable admin controls.** In the SQL Editor, run `supabase/migrations/002_admin_controls.sql`. This adds the admin allowlist, the site settings table, and admin-only write permissions.
4. **Create the owner's login.** Go to *Authentication → Users → Add user → Create new user*, enter the owner's email and a strong password, and tick *Auto Confirm User*.
5. **Make that user an admin.** In the SQL Editor, run:
   ```sql
   INSERT INTO admin_users (user_id, email)
   SELECT id, email FROM auth.users WHERE email = 'owner@example.com'
   ON CONFLICT (user_id) DO NOTHING;
   ```
6. **Turn off public sign-up.** Go to *Authentication → Sign In / Providers → Email* and disable *Allow new users to sign up*. This prevents strangers from creating accounts.
7. **Copy the API keys.** Go to *Project Settings → API*. Copy the **Project URL** and the **anon public** key into `.env.local`.

## 3. Set up ImageKit

1. Go to *Developer Options* in the ImageKit dashboard.
2. Copy the **public key**, the **private key** and the **URL endpoint** into `.env.local`.

> The private key is used only on the server. Never prefix it with `NEXT_PUBLIC_`.

## 4. Run locally

```bash
npm run dev
```

- Website: http://localhost:3000
- Admin panel: http://localhost:3000/admin

## 5. Deploy

The easiest host is [Vercel](https://vercel.com):

1. Import the repository in Vercel.
2. Add every variable from `.env.example` under *Settings → Environment Variables*.
3. Deploy. Every `git push` to the main branch redeploys automatically.

Any Node.js host works too: run `npm run build` and then `npm start`.

## Environment variables

| Variable | Where it is used | Secret? |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Browser and server | No |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Browser and server (protected by RLS) | No |
| `NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY` | Browser (uploads) | No |
| `NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT` | Browser (image URLs) | No |
| `IMAGEKIT_PRIVATE_KEY` | Server only (signs uploads, deletes files) | **Yes** |

## Project structure

```
app/
  page.tsx, about/, artists/, services/, gallery/, contact/, aftercare/, blog/   Public pages
  admin/                       Login page and dashboard (dashboard/*)
  api/bookings/                Public endpoint for the booking form
  api/imagekit/               Admin-only upload auth and delete (session-checked)
components/                    Shared layout and homepage sections
components/providers/          SiteSettingsProvider (loads site content from Supabase)
lib/settings.ts                Default site content and typed settings model
lib/auth-server.ts             Server-side admin check used by API routes
supabase-schema.sql            Base database schema + sample data
supabase/migrations/           Admin controls migration (run after the schema)
middleware.ts                  Protects /admin/dashboard (admin accounts only)
```

## How content editing works

Studio details, contact info, socials, stats and About copy are stored in the `site_settings` table and edited at `/admin/dashboard/settings`. The site loads them in the browser through `SiteSettingsProvider`. If the database is unreachable, the website falls back to the defaults in `lib/settings.ts`, so pages still render.

Anything the admin panel does not cover (for example, the navigation menu, the "Values" and "Timeline" blocks on the About page, or the Aftercare guide) is in the component files and can be changed by a developer.

## Security model

- **Public visitors** can read published content and submit booking requests. They cannot change anything.
- **Admins** are Supabase users listed in `admin_users`. Row-level security policies (`is_admin()`) decide what they can change, so the database enforces the rules even if the browser is bypassed.
- **API routes** for ImageKit check the admin session on the server before uploading or deleting files.
- **The `/admin/dashboard` route** requires an admin session (checked in `middleware.ts`).

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build (needs internet access for Google Fonts) |
| `npm start` | Run the production build |
| `npm run lint` | Lint the code |

## Known limitations

- The Blog and Aftercare pages are placeholder/static content.
- Page `<title>` and meta descriptions are set in code (`app/layout.tsx`) and are not yet editable from the admin panel.
