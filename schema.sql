-- =========================================================================
-- COMPLETE SUPABASE PORTFOLIO BACKEND SCHEMA (ALIGNED WITH NEXT.JS QUERIES)
-- =========================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Trigger to automatically update updated_at timestamps
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;


-- 1. HERO SETTINGS TABLE (SINGLETON)
create table if not exists public.hero_settings (
    id text primary key default 'hero_settings',
    badge text default 'Senior Designer & Creative Director',
    name text default 'Nasir Khan',
    description text,
    image_url text,
    roles text[] default array['Senior UI/UX Designer', 'Product Designer', 'Graphic Designer', '3D CG Artist'],
    experience_badge text default '10+ Years Certified',
    rating_badge text default '5.0 ⭐',
    projects_badge text default '150+',
    cards_config jsonb default '{
      "scene_layers": {
        "visible": true,
        "title": "Scene Layers",
        "item1_text": "CGI_Render_Final",
        "item1_label": "3D",
        "item2_text": "UI_Layer_Kit",
        "item2_label": "Figma"
      },
      "visual_score": {
        "visible": true,
        "title": "Visual Score",
        "value": "5.0",
        "growth": "+4.2%"
      },
      "studio": {
        "visible": true,
        "title": "Axis Craft Studio",
        "badge": "10+ Years Certified",
        "reviews_label": "REVIEWS",
        "reviews_value": "5.0 ⭐",
        "projects_label": "PROJECTS",
        "projects_value": "150+"
      }
    }'::jsonb,
    social_links jsonb default '[
      { "icon": "globe", "url": "https://Axis-Craft.com", "visible": true },
      { "icon": "linkedin", "url": "https://www.linkedin.com/in/nasirkhan-uiux/", "visible": true },
      { "icon": "mail", "url": "mailto:nasir.khan815@gmail.com", "visible": true }
    ]'::jsonb,
    status text default 'published' check (status in ('draft', 'published')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

drop trigger if exists update_hero_settings_updated_at on public.hero_settings;
create trigger update_hero_settings_updated_at before update on public.hero_settings
    for each row execute function update_updated_at_column();


-- 2. ABOUT SETTINGS TABLE (SINGLETON)
create table if not exists public.about_settings (
    id text primary key default 'about_settings',
    subtitle text default 'Visual Architect',
    title text default 'Bridging Artistic CGI Expression with Pixel-Perfect Product UX',
    paragraphs text[] default array[]::text[],
    stats jsonb default '[]'::jsonb,
    status text default 'published' check (status in ('draft', 'published')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

drop trigger if exists update_about_settings_updated_at on public.about_settings;
create trigger update_about_settings_updated_at before update on public.about_settings
    for each row execute function update_updated_at_column();


-- 3. SKILLS TABLE
create table if not exists public.skills (
    id uuid primary key default uuid_generate_v4(),
    name text not null,
    category text not null,
    level text not null,
    description text,
    glow text,
    icon_bg text,
    tag_color text,
    order_number integer default 0 not null,
    status text default 'published' check (status in ('draft', 'published')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

drop trigger if exists update_skills_updated_at on public.skills;
create trigger update_skills_updated_at before update on public.skills
    for each row execute function update_updated_at_column();


-- 4. PROJECTS TABLE
create table if not exists public.projects (
    id uuid primary key default uuid_generate_v4(),
    title text not null,
    category text not null,
    description text,
    tools text[] default array[]::text[] not null,
    image_url text,
    case_study_url text,
    live_url text,
    featured boolean default false not null,
    order_number integer default 0 not null,
    status text default 'published' check (status in ('draft', 'published')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

drop trigger if exists update_projects_updated_at on public.projects;
create trigger update_projects_updated_at before update on public.projects
    for each row execute function update_updated_at_column();


-- 5. SERVICES TABLE
create table if not exists public.services (
    id uuid primary key default uuid_generate_v4(),
    title text not null,
    description text,
    icon text default 'Layout',
    features text[] default array[]::text[] not null,
    glow_color text,
    order_number integer default 0 not null,
    status text default 'published' check (status in ('draft', 'published')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

drop trigger if exists update_services_updated_at on public.services;
create trigger update_services_updated_at before update on public.services
    for each row execute function update_updated_at_column();


-- 6. EXPERIENCE TABLE
create table if not exists public.experience (
    id uuid primary key default uuid_generate_v4(),
    year text not null,
    role text not null,
    company text not null,
    description text,
    type text not null check (type in ('work', 'education')),
    tech text[] default array[]::text[] not null,
    order_number integer default 0 not null,
    status text default 'published' check (status in ('draft', 'published')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

drop trigger if exists update_experience_updated_at on public.experience;
create trigger update_experience_updated_at before update on public.experience
    for each row execute function update_updated_at_column();


-- 7. TESTIMONIALS TABLE
create table if not exists public.testimonials (
    id uuid primary key default uuid_generate_v4(),
    quote text not null,
    name text not null,
    role text not null,
    company text not null,
    initials text,
    color text default 'from-neon-purple to-neon-pink',
    order_number integer default 0 not null,
    status text default 'published' check (status in ('draft', 'published')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

drop trigger if exists update_testimonials_updated_at on public.testimonials;
create trigger update_testimonials_updated_at before update on public.testimonials
    for each row execute function update_updated_at_column();


-- 8. CONTACT MESSAGES TABLE
create table if not exists public.contact_messages (
    id uuid primary key default uuid_generate_v4(),
    name text not null,
    email text not null,
    subject text not null,
    message text not null,
    is_read boolean default false not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

drop trigger if exists update_contact_messages_updated_at on public.contact_messages;
create trigger update_contact_messages_updated_at before update on public.contact_messages
    for each row execute function update_updated_at_column();


-- 9. SITE SETTINGS TABLE (SINGLETON)
create table if not exists public.site_settings (
    id text primary key default 'site_settings',
    title text not null default 'Nasir Khan Portfolio',
    description text,
    logo_url text,
    email text default 'nasir.khan815@gmail.com',
    phone text,
    whatsapp_url text,
    linkedin_url text,
    github_url text,
    address text,
    resume_url text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

drop trigger if exists update_site_settings_updated_at on public.site_settings;
create trigger update_site_settings_updated_at before update on public.site_settings
    for each row execute function update_updated_at_column();


-- =========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================

-- Enable RLS on all tables
alter table public.hero_settings enable row level security;
alter table public.about_settings enable row level security;
alter table public.skills enable row level security;
alter table public.projects enable row level security;
alter table public.services enable row level security;
alter table public.experience enable row level security;
alter table public.testimonials enable row level security;
alter table public.contact_messages enable row level security;
alter table public.site_settings enable row level security;


-- A. PUBLIC READ ACCESS (Allow anyone to SELECT portfolio contents)
create policy "Allow public read access to hero_settings" on public.hero_settings for select using (true);
create policy "Allow public read access to about_settings" on public.about_settings for select using (true);
create policy "Allow public read access to skills" on public.skills for select using (true);
create policy "Allow public read access to projects" on public.projects for select using (true);
create policy "Allow public read access to services" on public.services for select using (true);
create policy "Allow public read access to experience" on public.experience for select using (true);
create policy "Allow public read access to testimonials" on public.testimonials for select using (true);
create policy "Allow public read access to site_settings" on public.site_settings for select using (true);


-- B. PUBLIC TRANSMISSIONS (Allow anonymous guests to submit contact messages)
create policy "Allow public insert access to contact_messages" on public.contact_messages for insert with check (true);


-- C. AUTHENTICATED ADMINISTRATOR ACCESS (Allow only logged-in sessions to create, update, delete)
create policy "Allow full admin access to hero_settings" on public.hero_settings for all using (auth.role() = 'authenticated');
create policy "Allow full admin access to about_settings" on public.about_settings for all using (auth.role() = 'authenticated');
create policy "Allow full admin access to skills" on public.skills for all using (auth.role() = 'authenticated');
create policy "Allow full admin access to projects" on public.projects for all using (auth.role() = 'authenticated');
create policy "Allow full admin access to services" on public.services for all using (auth.role() = 'authenticated');
create policy "Allow full admin access to experience" on public.experience for all using (auth.role() = 'authenticated');
create policy "Allow full admin access to testimonials" on public.testimonials for all using (auth.role() = 'authenticated');
create policy "Allow full admin access to contact_messages" on public.contact_messages for all using (auth.role() = 'authenticated');
create policy "Allow full admin access to site_settings" on public.site_settings for all using (auth.role() = 'authenticated');


-- =========================================================================
-- STORAGE BUCKET RLS POLICIES (Allow public reading and admin uploads)
-- =========================================================================

-- Drop any old policies to avoid duplicates
drop policy if exists "Allow public read access to portfolio-images" on storage.objects;
drop policy if exists "Allow authenticated insert to portfolio-images" on storage.objects;
drop policy if exists "Allow authenticated update to portfolio-images" on storage.objects;
drop policy if exists "Allow authenticated delete to portfolio-images" on storage.objects;
drop policy if exists "Allow public upload to portfolio-images" on storage.objects;
drop policy if exists "Allow public update to portfolio-images" on storage.objects;
drop policy if exists "Allow public delete to portfolio-images" on storage.objects;

-- Allow anyone to view images/PDF files in the portfolio-images bucket
create policy "Allow public read access to portfolio-images" on storage.objects
    for select using (bucket_id = 'portfolio-images');

-- Allow anyone to upload files to this bucket (fully open to avoid local RLS authentication blocks)
create policy "Allow public upload to portfolio-images" on storage.objects
    for insert with check (bucket_id = 'portfolio-images');

-- Allow anyone to update files in this bucket
create policy "Allow public update to portfolio-images" on storage.objects
    for update using (bucket_id = 'portfolio-images');

-- Allow anyone to delete files from this bucket
create policy "Allow public delete to portfolio-images" on storage.objects
    for delete using (bucket_id = 'portfolio-images');


