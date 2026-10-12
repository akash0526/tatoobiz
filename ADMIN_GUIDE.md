# Admin Panel Guide

The admin panel lets the studio owner control everything on the website without touching code.

- **Login:** `/admin` (use an account that has been added to the admin allowlist; see the README, step 3)
- **Logout:** sidebar, bottom left

Changes appear on the public website after a page refresh.

---

## Dashboard (`/admin/dashboard`)
- Overview counters (gallery photos, new bookings, pending reviews, active artists)
- Five most recent booking requests

## Site Settings (`/admin/dashboard/settings`) — the main control panel for copy and contact info
Each card has its own **SAVE** button. **Discard** reverts unsaved edits in that card.

| Card | What it controls |
|---|---|
| Studio Information | Studio name, hero tagline, address, founded year (shown in the hero, footer, and About section) |
| Contact & Social Media | Phone, WhatsApp (display + digits used for the `wa.me` link), email, Instagram / Facebook / TikTok. Links are generated automatically. |
| Stats Bar | "Years", "Clients", Google rating, number of artists (hero and stats bar) |
| Homepage "Our Story" Block | Paragraph and badge text in the About preview on the homepage |
| About Page | The two story paragraphs on `/about` |

**WhatsApp tip:** the "digits only" field must contain the country code and number with no `+`, spaces or dashes (for example `9779857089950`).

## Gallery (`/admin/dashboard/gallery`)
- Upload tattoo photos (stored on ImageKit)
- Mark photos as **Featured** to show them on the homepage
- Delete photos

## Artists (`/admin/dashboard/artists`)
- Add, edit and delete artists, including photo, role, bio, experience and specialties
- Show or hide an artist (hidden artists are not shown publicly)

## Services (`/admin/dashboard/services`)
- **Add service:** icon (emoji), title, description, price and duration
- Edit price, description and duration of existing services
- Show or hide a service, or delete it permanently

## Bookings (`/admin/dashboard/bookings`)
- All booking requests submitted through the website contact form
- Change status: New → Contacted → Booked → Completed (or Cancelled)
- Call or WhatsApp the client in one click
- Delete a request permanently

## Testimonials (`/admin/dashboard/testimonials`)
- Review client reviews submitted by visitors
- Approve or hide a review (only approved reviews are public)
- **Add review** to enter a review manually (for example, one received by phone or on social media)
- Delete a review

---

## Security notes for the owner
- Only accounts on the admin allowlist can sign in to the dashboard. Anyone else who signs in sees an "access denied" message.
- Public sign-up should stay **disabled** in Supabase (see the README). Otherwise, anyone can create an account, but they still will not be able to use the admin panel.
- Never share the Supabase `service_role` key or the ImageKit private key. They belong only in the server environment.
- Change the password of any account that was ever shared in plain text.

## Changing the admin login
- **Change password:** Supabase Dashboard → Authentication → Users → select the user → Send password recovery, or set a new password.
- **Add another admin:** create the user in Supabase Authentication, then run the `INSERT INTO admin_users ...` snippet from `supabase/migrations/002_admin_controls.sql` with their email.
- **Remove an admin:** `DELETE FROM admin_users WHERE email = 'person@example.com';`
