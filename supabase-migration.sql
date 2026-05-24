-- =========================================================================
-- MIGRATION: Add cards_config and social_links to hero_settings
-- Run this in your Supabase Dashboard > SQL Editor
-- =========================================================================

-- Add cards_config JSONB column (stores floating card visibility & text)
ALTER TABLE public.hero_settings
  ADD COLUMN IF NOT EXISTS cards_config jsonb DEFAULT '{
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
      "reviews_value": "5.0 \u2b50",
      "projects_label": "PROJECTS",
      "projects_value": "150+"
    }
  }'::jsonb;

-- Add social_links JSONB column (stores bottom icon links array)
ALTER TABLE public.hero_settings
  ADD COLUMN IF NOT EXISTS social_links jsonb DEFAULT '[
    { "icon": "globe", "url": "https://Axis-Craft.com", "visible": true },
    { "icon": "linkedin", "url": "https://www.linkedin.com/in/nasirkhan-uiux/", "visible": true },
    { "icon": "mail", "url": "mailto:nasir.khan815@gmail.com", "visible": true }
  ]'::jsonb;

-- Backfill the default values into the existing row (safe, won't overwrite if already set)
UPDATE public.hero_settings
SET
  cards_config = COALESCE(cards_config, '{
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
      "reviews_value": "5.0 \u2b50",
      "projects_label": "PROJECTS",
      "projects_value": "150+"
    }
  }'::jsonb),
  social_links = COALESCE(social_links, '[
    { "icon": "globe", "url": "https://Axis-Craft.com", "visible": true },
    { "icon": "linkedin", "url": "https://www.linkedin.com/in/nasirkhan-uiux/", "visible": true },
    { "icon": "mail", "url": "mailto:nasir.khan815@gmail.com", "visible": true }
  ]'::jsonb)
WHERE id = 'hero_settings';

-- Confirm the columns were added
SELECT id, cards_config IS NOT NULL AS has_cards_config, social_links IS NOT NULL AS has_social_links
FROM public.hero_settings
WHERE id = 'hero_settings';
