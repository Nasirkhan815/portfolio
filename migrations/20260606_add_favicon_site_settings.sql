alter table public.site_settings
add column if not exists favicon_url text default '/favicon.ico';

NOTIFY pgrst, 'reload schema';
