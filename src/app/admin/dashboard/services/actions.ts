"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

const themeMap: Record<string, { glow_color: string; icon: string }> = {
  purple: {
    glow_color: "group-hover:shadow-[0_0_50px_-12px_rgba(139,92,246,0.3)] group-hover:border-neon-purple/40",
    icon: "Layout"
  },
  blue: {
    glow_color: "group-hover:shadow-[0_0_50px_-12px_rgba(6,182,212,0.3)] group-hover:border-neon-blue/40",
    icon: "Palette"
  },
  pink: {
    glow_color: "group-hover:shadow-[0_0_50px_-12px_rgba(236,72,153,0.3)] group-hover:border-neon-pink/40",
    icon: "Sparkles"
  }
};

export async function addService(prevState: any, formData: FormData) {
  const supabase = await createClient();

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const theme = formData.get("theme") as string; // "purple" | "blue" | "pink"
  
  const featuresRaw = formData.get("features") as string;
  const features = featuresRaw 
    ? featuresRaw.split("\n").map(f => f.trim()).filter(Boolean) 
    : [];

  if (!title || !description || !theme) {
    return { success: false, error: "Title, description, and color theme are required." };
  }

  const selectedTheme = themeMap[theme] || themeMap.purple;

  const { error } = await supabase
    .from("services")
    .insert([{
      title,
      description,
      features,
      glow_color: selectedTheme.glow_color,
      icon: selectedTheme.icon,
      order_number: 0
    }]);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/admin/dashboard/services");
  return { success: true, error: "" };
}

export async function updateService(prevState: any, formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const theme = formData.get("theme") as string; // "purple" | "blue" | "pink"
  
  const featuresRaw = formData.get("features") as string;
  const features = featuresRaw 
    ? featuresRaw.split("\n").map(f => f.trim()).filter(Boolean) 
    : [];

  if (!id || !title || !description || !theme) {
    return { success: false, error: "ID, title, description, and color theme are required." };
  }

  const selectedTheme = themeMap[theme] || themeMap.purple;

  const { error } = await supabase
    .from("services")
    .update({
      title,
      description,
      features,
      glow_color: selectedTheme.glow_color,
      icon: selectedTheme.icon
    })
    .eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/admin/dashboard/services");
  return { success: true, error: "" };
}

export async function deleteService(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("services")
    .delete()
    .eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/admin/dashboard/services");
  return { success: true };
}
