-- Supabase Database Schema & Initial Data Seed for Madhushanka Herath's Portfolio

-- 1. Create Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT NOT NULL, -- 'Web Applications', 'Mobile Applications', 'Desktop Applications', 'Live Projects'
  description TEXT NOT NULL,
  technologies TEXT[] NOT NULL DEFAULT '{}',
  live_url TEXT,
  github_url TEXT,
  youtube_url TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Project Images Table
CREATE TABLE IF NOT EXISTS public.project_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Skills Table
CREATE TABLE IF NOT EXISTS public.skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL, -- 'Languages', 'Web Development', 'Mobile Development', 'Frameworks', 'Tools', 'AI Tools'
  icon TEXT,
  proficiency INT DEFAULT 90,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create Experiences Table
CREATE TABLE IF NOT EXISTS public.experiences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company TEXT NOT NULL,
  role TEXT NOT NULL,
  period TEXT NOT NULL,
  description TEXT NOT NULL,
  is_current BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Create Contacts Table
CREATE TABLE IF NOT EXISTS public.contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

-- RLS Policies

-- Public read access for Projects, Images, Skills, and Experiences
CREATE POLICY "Public Read Projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Public Read Project Images" ON public.project_images FOR SELECT USING (true);
CREATE POLICY "Public Read Skills" ON public.skills FOR SELECT USING (true);
CREATE POLICY "Public Read Experiences" ON public.experiences FOR SELECT USING (true);

-- Public insert access for Contact Messages
CREATE POLICY "Public Insert Contacts" ON public.contacts FOR INSERT WITH CHECK (true);

-- Admin (Authenticated user) full access for all operations
CREATE POLICY "Admin Projects Full Access" ON public.projects FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Images Full Access" ON public.project_images FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Skills Full Access" ON public.skills FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Experiences Full Access" ON public.experiences FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Contacts Read Delete" ON public.contacts FOR ALL USING (auth.role() = 'authenticated');

-- Storage Bucket Setup (Execute via Supabase UI or SQL if storage schema enabled)
-- Bucket name: portfolio-images (Public bucket)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('portfolio-images', 'portfolio-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS Policies
CREATE POLICY "Public Read Storage" ON storage.objects FOR SELECT USING (bucket_id = 'portfolio-images');
CREATE POLICY "Admin Insert Storage" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'portfolio-images' AND auth.role() = 'authenticated');
CREATE POLICY "Admin Update Storage" ON storage.objects FOR UPDATE USING (bucket_id = 'portfolio-images' AND auth.role() = 'authenticated');
CREATE POLICY "Admin Delete Storage" ON storage.objects FOR DELETE USING (bucket_id = 'portfolio-images' AND auth.role() = 'authenticated');

-- SEED INITIAL DATA FOR MADHUSHANKA HERATH

-- Insert Experiences
INSERT INTO public.experiences (company, role, period, description, is_current) VALUES
('Rabbit Solutions Pvt Ltd', 'Associate Software Engineer', 'Jan 2026 - Present', 'Developing and maintaining high-performance web and mobile applications using modern JavaScript/TypeScript stacks, optimizing backend queries, and leading feature development.', true),
('Rabbit Solutions Pvt Ltd', 'Intern Software Engineer', 'Aug 2025 - Jan 2026', 'Engineered interactive front-end components, integrated REST APIs, developed database schemas, and assisted in mobile cross-platform app maintenance.', false);

-- Insert Skills
INSERT INTO public.skills (name, category, icon, proficiency) VALUES
-- Languages
('PHP', 'Languages', 'php', 90),
('Java', 'Languages', 'java', 85),
('Python', 'Languages', 'python', 88),
('Dart', 'Languages', 'dart', 85),
('JavaScript', 'Languages', 'js', 95),
('TypeScript', 'Languages', 'ts', 92),

-- Web Development
('HTML', 'Web Development', 'html', 98),
('CSS', 'Web Development', 'css', 95),
('React', 'Web Development', 'react', 95),
('Next.js', 'Web Development', 'nextjs', 92),

-- Mobile Development
('React Native', 'Mobile Development', 'reactnative', 90),
('Flutter', 'Mobile Development', 'flutter', 88),

-- Frameworks
('React', 'Frameworks', 'react', 95),
('Angular', 'Frameworks', 'angular', 80),
('Next.js', 'Frameworks', 'nextjs', 92),
('MERN', 'Frameworks', 'mern', 92),
('Flutter', 'Frameworks', 'flutter', 88),
('Laravel', 'Frameworks', 'laravel', 88),
('Electron', 'Frameworks', 'electron', 85),

-- Tools
('Git', 'Tools', 'git', 92),
('GitHub', 'Tools', 'github', 95),
('VS Code', 'Tools', 'vscode', 98),
('Android Studio', 'Tools', 'androidstudio', 85),
('Figma', 'Tools', 'figma', 88),

-- AI Tools
('ChatGPT', 'AI Tools', 'chatgpt', 95),
('GitHub Copilot', 'AI Tools', 'copilot', 92),
('Claude', 'AI Tools', 'claude', 95),
('Gemini', 'AI Tools', 'gemini', 92);

-- Insert Projects
INSERT INTO public.projects (id, title, category, description, technologies, live_url, github_url, youtube_url, is_featured) VALUES
('11111111-1111-1111-1111-111111111111', 'Accounting Guide LMS Platform', 'Web Applications', 'A comprehensive Learning Management System designed for accounting students with online courses, progress tracking, dynamic quizzes, and video lessons.', ARRAY['React', 'PHP', 'MySQL', 'Tailwind CSS'], 'https://accountingguide.lk', 'https://github.com/madhushanka/accounting-guide', 'https://youtube.com/watch?v=demo1', true),
('22222222-2222-2222-2222-222222222222', 'MyBulaBuy E-commerce Platform', 'Web Applications', 'High-traffic e-commerce marketplace featuring product catalog, multi-currency shopping cart, payment gateway integration, and order management admin.', ARRAY['PHP', 'MySQL', 'JavaScript', 'Bootstrap'], 'https://mybulabuy.com', 'https://github.com/madhushanka/mybulabuy', 'https://youtube.com/watch?v=demo2', true),
('33333333-3333-3333-3333-333333333333', 'Travel Lanka World Website', 'Web Applications', 'Tourism and travel booking platform highlighting Sri Lankan tour packages, custom itinerary booking, interactive maps, and localized recommendations.', ARRAY['PHP', 'MySQL', 'JavaScript', 'HTML5/CSS3'], 'https://travellankaworld.com', 'https://github.com/madhushanka/travel-lanka', 'https://youtube.com/watch?v=demo3', false),
('44444444-4444-4444-4444-444444444444', 'Devora Company Website', 'Web Applications', 'Modern software agency portal built with high-performance React, glassmorphism design, service offerings, and interactive consultation booking.', ARRAY['React', 'Next.js', 'Tailwind CSS', 'Framer Motion'], 'https://devora.lk', 'https://github.com/madhushanka/devora-website', 'https://youtube.com/watch?v=demo4', true),
('55555555-5555-5555-5555-555555555555', 'Dragon Car Rent Mobile App', 'Mobile Applications', 'Cross-platform vehicle rental booking app featuring real-time vehicle availability, GPS location tracking, booking schedules, and digital receipts.', ARRAY['React Native', 'TypeScript', 'Redux', 'Node.js'], null, 'https://github.com/madhushanka/dragon-car-rent', 'https://youtube.com/watch?v=demo5', true),
('66666666-6666-6666-6666-666666666666', 'Village Mart Mobile App', 'Mobile Applications', 'Hyperlocal grocery and fresh produce marketplace mobile application with real-time Firebase syncing, push notifications, and live order tracking.', ARRAY['React Native', 'Firebase', 'Context API'], null, 'https://github.com/madhushanka/village-mart', 'https://youtube.com/watch?v=demo6', false),
('77777777-7777-7777-7777-777777777777', 'Smart Harvest Platform', 'Mobile Applications', 'AgriTech mobile and web ecosystem connecting farmers directly with markets, featuring crop analytics, harvest forecasting, and Supabase real-time DB.', ARRAY['React Native', 'Next.js', 'Supabase', 'Tailwind CSS'], null, 'https://github.com/madhushanka/smart-harvest', 'https://youtube.com/watch?v=demo7', true),
('88888888-8888-8888-8888-888888888888', 'Medusa AI Learning Chatbot', 'Desktop Applications', 'Advanced desktop AI assistant featuring offline local LLM chat, speech recognition voice control, interactive 3D live avatar rendering, and automated PC system control.', ARRAY['Python', 'Electron', 'SQLite', 'PyTorch', 'JavaScript'], null, 'https://github.com/madhushanka/medusa-ai-desktop', 'https://youtube.com/watch?v=demo8', true);
