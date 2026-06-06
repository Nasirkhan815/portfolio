alter table public.about_settings
add column if not exists section_heading text default 'Creative Story & Branding Philosophy';

NOTIFY pgrst, 'reload schema';
