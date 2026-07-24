-- SUPABASE DATABASE SCHEMA FOR MADHUSHANKA HERATH PORTFOLIO

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  technologies TEXT[] NOT NULL DEFAULT '{}',
  live_url TEXT,
  github_url TEXT,
  youtube_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  images TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Project Images Table (Optional relation if storing individual image records)
CREATE TABLE IF NOT EXISTS public.project_images (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  project_id TEXT REFERENCES public.projects(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Skills Table
CREATE TABLE IF NOT EXISTS public.skills (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  icon TEXT,
  proficiency INT DEFAULT 90,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Experiences Table
CREATE TABLE IF NOT EXISTS public.experiences (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  company TEXT NOT NULL,
  role TEXT NOT NULL,
  period TEXT NOT NULL,
  description TEXT NOT NULL,
  is_current BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Contact Messages Table
CREATE TABLE IF NOT EXISTS public.contacts (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

-- RLS Policies (Full Read/Write Access to allow real-time cross-browser updates)
DROP POLICY IF EXISTS "Public Read Projects" ON public.projects;
DROP POLICY IF EXISTS "Admin Projects Full Access" ON public.projects;
DROP POLICY IF EXISTS "Public Full Access Projects" ON public.projects;
CREATE POLICY "Public Full Access Projects" ON public.projects FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Read Project Images" ON public.project_images;
DROP POLICY IF EXISTS "Admin Images Full Access" ON public.project_images;
DROP POLICY IF EXISTS "Public Full Access Project Images" ON public.project_images;
CREATE POLICY "Public Full Access Project Images" ON public.project_images FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Read Skills" ON public.skills;
DROP POLICY IF EXISTS "Admin Skills Full Access" ON public.skills;
DROP POLICY IF EXISTS "Public Full Access Skills" ON public.skills;
CREATE POLICY "Public Full Access Skills" ON public.skills FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Read Experiences" ON public.experiences;
DROP POLICY IF EXISTS "Admin Experiences Full Access" ON public.experiences;
DROP POLICY IF EXISTS "Public Full Access Experiences" ON public.experiences;
CREATE POLICY "Public Full Access Experiences" ON public.experiences FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Insert Contacts" ON public.contacts;
DROP POLICY IF EXISTS "Admin Contacts Read Delete" ON public.contacts;
DROP POLICY IF EXISTS "Public Full Access Contacts" ON public.contacts;
CREATE POLICY "Public Full Access Contacts" ON public.contacts FOR ALL USING (true) WITH CHECK (true);

-- Storage Bucket Setup
INSERT INTO storage.buckets (id, name, public) 
VALUES ('portfolio-images', 'portfolio-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS Policies
DROP POLICY IF EXISTS "Public Read Storage" ON storage.objects;
DROP POLICY IF EXISTS "Admin Insert Storage" ON storage.objects;
DROP POLICY IF EXISTS "Public Storage Access" ON storage.objects;
CREATE POLICY "Public Storage Access" ON storage.objects FOR ALL USING (bucket_id = 'portfolio-images') WITH CHECK (bucket_id = 'portfolio-images');

-- SEED INITIAL DATA FOR MADHUSHANKA HERATH

-- Insert Experiences
INSERT INTO public.experiences (id, company, role, period, description, is_current) VALUES
('exp-1', 'Rabbit Solutions Pvt Ltd', 'Associate Software Engineer', 'Jan 2026 - Present', 'Developing and maintaining high-performance web and mobile applications using modern JavaScript/TypeScript stacks, optimizing backend queries, and leading feature development.', true),
('exp-2', 'Rabbit Solutions Pvt Ltd', 'Intern Software Engineer', 'Aug 2025 - Jan 2026', 'Engineered interactive front-end components, integrated REST APIs, developed database schemas, and assisted in mobile cross-platform app maintenance.', false)
ON CONFLICT (id) DO NOTHING;

-- Insert Skills
INSERT INTO public.skills (id, name, category, icon, proficiency) VALUES
-- Languages
('skl-1', 'PHP', 'Languages', 'php', 90),
('skl-2', 'Java', 'Languages', 'java', 85),
('skl-3', 'Python', 'Languages', 'python', 88),
('skl-4', 'Dart', 'Languages', 'dart', 85),
('skl-5', 'JavaScript', 'Languages', 'js', 95),
('skl-6', 'TypeScript', 'Languages', 'ts', 92),

-- Web Development
('skl-7', 'HTML', 'Web Development', 'html', 98),
('skl-8', 'CSS', 'Web Development', 'css', 95),
('skl-9', 'React', 'Web Development', 'react', 95),
('skl-10', 'Next.js', 'Web Development', 'nextjs', 92),

-- Mobile Development
('skl-11', 'React Native', 'Mobile Development', 'reactnative', 90),
('skl-12', 'Flutter', 'Mobile Development', 'flutter', 88),

-- Frameworks
('skl-13', 'React', 'Frameworks', 'react', 95),
('skl-14', 'Angular', 'Frameworks', 'angular', 80),
('skl-15', 'Next.js', 'Frameworks', 'nextjs', 92),
('skl-16', 'MERN', 'Frameworks', 'mern', 92),
('skl-17', 'Flutter', 'Frameworks', 'flutter', 88),
('skl-18', 'Laravel', 'Frameworks', 'laravel', 88),
('skl-19', 'Electron', 'Frameworks', 'electron', 85),

-- Tools
('skl-20', 'Git', 'Tools', 'git', 92),
('skl-21', 'GitHub', 'Tools', 'github', 95),
('skl-22', 'VS Code', 'Tools', 'vscode', 98),
('skl-23', 'Android Studio', 'Tools', 'androidstudio', 85),
('skl-24', 'Figma', 'Tools', 'figma', 88),

-- AI Tools
('skl-25', 'ChatGPT', 'AI Tools', 'chatgpt', 95),
('skl-26', 'GitHub Copilot', 'AI Tools', 'copilot', 92),
('skl-27', 'Claude', 'AI Tools', 'claude', 95),
('skl-28', 'Gemini', 'AI Tools', 'gemini', 92)
ON CONFLICT (id) DO NOTHING;

-- Insert Projects
INSERT INTO public.projects (id, title, category, description, technologies, live_url, github_url, youtube_url, is_featured, images) VALUES
('11111111-1111-1111-1111-111111111111', 'Accounting Guide LMS Platform', 'Web Applications', 'A comprehensive Learning Management System designed for accounting students with online courses, progress tracking, dynamic quizzes, and video lessons.', ARRAY['React', 'PHP', 'MySQL', 'Tailwind CSS'], 'https://accountingguide.lk', 'https://github.com/madhushanka/accounting-guide', 'https://youtube.com/watch?v=demo1', true, ARRAY['https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=80']),
('22222222-2222-2222-2222-222222222222', 'MyBulaBuy E-commerce Platform', 'Web Applications', 'High-traffic e-commerce marketplace featuring product catalog, multi-currency shopping cart, payment gateway integration, and order management admin.', ARRAY['PHP', 'MySQL', 'JavaScript', 'Bootstrap'], 'https://mybulabuy.com', 'https://github.com/madhushanka/mybulabuy', 'https://youtube.com/watch?v=demo2', true, ARRAY['https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1556742049-0a67daf40955?auto=format&fit=crop&w=1200&q=80']),
('33333333-3333-3333-3333-333333333333', 'Travel Lanka World Website', 'Web Applications', 'Tourism and travel booking platform highlighting Sri Lankan tour packages, custom itinerary booking, interactive maps, and localized recommendations.', ARRAY['PHP', 'MySQL', 'JavaScript', 'HTML5/CSS3'], 'https://travellankaworld.com', 'https://github.com/madhushanka/travel-lanka', 'https://youtube.com/watch?v=demo3', false, ARRAY['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=1200&q=80']),
('44444444-4444-4444-4444-444444444444', 'Devora Company Website', 'Web Applications', 'Modern software agency portal built with high-performance React, glassmorphism design, service offerings, and interactive consultation booking.', ARRAY['React', 'Next.js', 'Tailwind CSS', 'Framer Motion'], 'https://devora.lk', 'https://github.com/madhushanka/devora-website', 'https://youtube.com/watch?v=demo4', true, ARRAY['https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80']),
('55555555-5555-5555-5555-555555555555', 'Dragon Car Rent Mobile App', 'Mobile Applications', 'Cross-platform vehicle rental booking app featuring real-time vehicle availability, GPS location tracking, booking schedules, and digital receipts.', ARRAY['React Native', 'TypeScript', 'Redux', 'Node.js'], null, 'https://github.com/madhushanka/dragon-car-rent', 'https://youtube.com/watch?v=demo5', true, ARRAY['https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80']),
('66666666-6666-6666-6666-666666666666', 'Village Mart Mobile App', 'Mobile Applications', 'Hyperlocal grocery and fresh produce marketplace mobile application with real-time Firebase syncing, push notifications, and live order tracking.', ARRAY['React Native', 'Firebase', 'Context API'], null, 'https://github.com/madhushanka/village-mart', 'https://youtube.com/watch?v=demo6', false, ARRAY['https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=1200&q=80']),
('77777777-7777-7777-7777-777777777777', 'Smart Harvest Platform', 'Mobile Applications', 'AgriTech mobile and web ecosystem connecting farmers directly with markets, featuring crop analytics, harvest forecasting, and Supabase real-time DB.', ARRAY['React Native', 'Next.js', 'Supabase', 'Tailwind CSS'], null, 'https://github.com/madhushanka/smart-harvest', 'https://youtube.com/watch?v=demo7', true, ARRAY['https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=1200&q=80']),
('88888888-8888-8888-8888-888888888888', 'Medusa AI Learning Chatbot', 'Desktop Applications', 'Advanced desktop AI assistant featuring offline local LLM chat, speech recognition voice control, interactive 3D live avatar rendering, and automated PC system control.', ARRAY['Python', 'Electron', 'SQLite', 'PyTorch', 'JavaScript'], null, 'https://github.com/madhushanka/medusa-ai-desktop', 'https://youtube.com/watch?v=demo8', true, ARRAY['https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?auto=format&fit=crop&w=1200&q=80'])
ON CONFLICT (id) DO NOTHING;
