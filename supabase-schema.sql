-- =============================================
-- TATTOO BIZ BUTWAL — SUPABASE SCHEMA
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- TABLE: gallery_items
-- =============================================
CREATE TABLE IF NOT EXISTS gallery_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  style TEXT NOT NULL,
  artist_name TEXT NOT NULL,
  image_url TEXT NOT NULL,
  imagekit_file_id TEXT,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- TABLE: artists
-- =============================================
CREATE TABLE IF NOT EXISTS artists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  bio TEXT,
  specialties TEXT[] DEFAULT '{}',
  photo_url TEXT,
  imagekit_file_id TEXT,
  experience TEXT,
  instagram_url TEXT,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- TABLE: services
-- =============================================
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  icon TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  price TEXT,
  duration TEXT,
  is_active BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- TABLE: bookings
-- =============================================
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  design_idea TEXT,
  style TEXT,
  body_part TEXT,
  preferred_date DATE,
  preferred_artist TEXT,
  message TEXT,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- TABLE: testimonials
-- =============================================
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_name TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT NOT NULL,
  tattoo_type TEXT,
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

-- Enable RLS
ALTER TABLE gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Public can read
CREATE POLICY "Public can view gallery" ON gallery_items FOR SELECT USING (true);
CREATE POLICY "Public can view artists" ON artists FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view services" ON services FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view testimonials" ON testimonials FOR SELECT USING (is_approved = true);

-- Anyone can submit bookings
CREATE POLICY "Anyone can insert bookings" ON bookings FOR INSERT WITH CHECK (true);

-- Authenticated users can do everything
CREATE POLICY "Auth users manage gallery" ON gallery_items FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth users manage artists" ON artists FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth users manage services" ON services FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth users manage bookings" ON bookings FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth users manage testimonials" ON testimonials FOR ALL USING (auth.role() = 'authenticated');

-- =============================================
-- SEED DATA
-- =============================================

-- Services
INSERT INTO services (icon, title, description, price, duration, order_index) VALUES
('🕉️', 'Custom Tattoo Design', 'Every tattoo is a one-of-a-kind creation.', 'Starting NPR 3,000', '1–8+ hours', 1),
('☸️', 'Mandala & Sacred Geometry', 'Precision and spiritual depth.', 'Starting NPR 4,000', '2–6 hours', 2),
('🪬', 'Hindu Mythology Art', 'Ganesh, Shiva, Kali in black & gray.', 'Starting NPR 5,000', '3–10+ hours', 3),
('✒️', 'Fine Line Tattoo', 'Delicate and elegant work.', 'Starting NPR 2,500', '1–3 hours', 4),
('🎨', 'Cover-Up Tattoo', 'Transform old tattoos.', 'Starting NPR 4,500', '2–6 hours', 5),
('💎', 'Piercing', 'Professional piercing services.', 'Starting NPR 500', '15–30 min', 6);

-- Artists
INSERT INTO artists (name, role, bio, specialties, experience, order_index) VALUES
('Bijay', 'Founder & Lead Artist', 'Nationally recognized artist.', ARRAY['Hindu Mythology','Mandala','Black & Gray'], '8+ years', 1),
('Samir', 'Senior Tattoo Artist', 'Versatile artist.', ARRAY['Fine Line','Cover-Up','Geometric'], '5+ years', 2),
('Sunita Magar', 'Tattoo Artist', 'Rising talent.', ARRAY['Fine Line','Floral','Minimalist'], '2+ years', 3);

-- Testimonials
INSERT INTO testimonials (client_name, rating, review_text, tattoo_type, is_approved) VALUES
('Priya S.', 5, 'Bijay did my mandala sleeve and I am absolutely in love.', 'Mandala Sleeve', true),
('Rajan T.', 5, 'Got my Ganesh tattoo here. The team is so welcoming.', 'Ganesh Tattoo', true);
