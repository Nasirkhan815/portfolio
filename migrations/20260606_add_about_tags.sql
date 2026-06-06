alter table public.about_settings
add column if not exists tag_one_text text default 'UI/UX Design Systems';

alter table public.about_settings
add column if not exists tag_two_text text default 'Branding & Visual Design';

NOTIFY pgrst, 'reload schema';
