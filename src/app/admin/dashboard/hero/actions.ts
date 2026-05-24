"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateHero(prevState: any, formData: FormData) {
  const supabase = await createClient();

  const badge = formData.get("badge") as string;
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const experience_badge = formData.get("experience_badge") as string;
  const rating_badge = formData.get("rating_badge") as string;
  const projects_badge = formData.get("projects_badge") as string;
  const image_url = formData.get("image_url") as string;
  
  const rolesRaw = formData.get("roles") as string;
  const roles = rolesRaw 
    ? rolesRaw.split(",").map(r => r.trim()).filter(Boolean) 
    : [];

  const cards_config_raw = formData.get("cards_config") as string;
  let cards_config = null;
  if (cards_config_raw) {
    try {
      cards_config = JSON.parse(cards_config_raw);
    } catch (e) {
      console.error("Error parsing cards_config:", e);
    }
  }

  const social_links_raw = formData.get("social_links") as string;
  let social_links = null;
  if (social_links_raw) {
    try {
      social_links = JSON.parse(social_links_raw);
    } catch (e) {
      console.error("Error parsing social_links:", e);
    }
  }

  const updatePayload: any = {
    badge,
    name,
    roles,
    description,
    experience_badge,
    rating_badge,
    projects_badge,
    image_url,
    updated_at: new Date().toISOString()
  };

  if (cards_config) {
    updatePayload.cards_config = cards_config;
  }
  if (social_links) {
    updatePayload.social_links = social_links;
  }

  const { error } = await supabase
    .from("hero_settings")
    .update(updatePayload)
    .eq("id", "hero_settings");

  if (error) {
    // Check if error code 42703 (undefined_column) is returned
    if (error.code === "42703") {
      const fallbackPayload = {
        badge,
        name,
        roles,
        description,
        experience_badge,
        rating_badge,
        projects_badge,
        image_url,
        updated_at: new Date().toISOString()
      };

      const { error: fallbackError } = await supabase
        .from("hero_settings")
        .update(fallbackPayload)
        .eq("id", "hero_settings");

      if (fallbackError) {
        return { success: false, error: fallbackError.message };
      }

      return {
        success: true,
        warning: "Basic typography updated! However, your floating cards and social links configuration could not be saved because the required columns do not exist in your Supabase database yet. Please run the SQL migration script in your Supabase Dashboard > SQL Editor (provided in implementation_plan.md) to enable full management.",
        error: ""
      };
    }
    return { success: false, error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/admin/dashboard/hero");
  return { success: true, error: "" };
}
