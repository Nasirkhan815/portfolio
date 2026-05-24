"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

const themeMap: Record<string, { glow: string; icon_bg: string; tag_color: string }> = {
  green: {
    glow: "group-hover:border-[#0ACF83]/40 group-hover:shadow-[0_0_30px_-5px_rgba(10,207,131,0.15)]",
    icon_bg: "bg-[#0ACF83]/10 text-[#0ACF83]",
    tag_color: "text-[#0ACF83] bg-[#0ACF83]/10 border-[#0ACF83]/20"
  },
  blue: {
    glow: "group-hover:border-[#31A8FF]/40 group-hover:shadow-[0_0_30px_-5px_rgba(49,168,255,0.15)]",
    icon_bg: "bg-[#31A8FF]/10 text-[#31A8FF]",
    tag_color: "text-[#31A8FF] bg-[#31A8FF]/10 border-[#31A8FF]/20"
  },
  pink: {
    glow: "group-hover:border-[#FF26BE]/40 group-hover:shadow-[0_0_30px_-5px_rgba(255,38,190,0.15)]",
    icon_bg: "bg-[#FF26BE]/10 text-[#FF26BE]",
    tag_color: "text-[#FF26BE] bg-[#FF26BE]/10 border-[#FF26BE]/20"
  },
  purple: {
    glow: "group-hover:border-[#8B5CF6]/40 group-hover:shadow-[0_0_30px_-5px_rgba(139,92,246,0.15)]",
    icon_bg: "bg-[#8B5CF6]/10 text-[#8B5CF6]",
    tag_color: "text-[#8B5CF6] bg-[#8B5CF6]/10 border-[#8B5CF6]/20"
  },
  orange: {
    glow: "group-hover:border-[#EA7600]/40 group-hover:shadow-[0_0_30px_-5px_rgba(234,118,0,0.15)]",
    icon_bg: "bg-[#EA7600]/10 text-[#EA7600]",
    tag_color: "text-[#EA7600] bg-[#EA7600]/10 border-[#EA7600]/20"
  },
  white: {
    glow: "group-hover:border-white/20 group-hover:shadow-[0_0_30px_-5px_rgba(255,255,255,0.05)]",
    icon_bg: "bg-white/10 text-white",
    tag_color: "text-white bg-white/5 border-white/10"
  }
};

export async function addSkill(prevState: any, formData: FormData) {
  const supabase = await createClient();

  const name = formData.get("name") as string;
  const category = formData.get("category") as string;
  const level = formData.get("level") as string;
  const description = formData.get("description") as string;
  const theme = formData.get("theme") as string;

  if (!name || !category || !level) {
    return { success: false, error: "Name, category, and level are required." };
  }

  const selectedTheme = themeMap[theme] || themeMap.purple;

  const { error } = await supabase
    .from("skills")
    .insert([{
      name,
      category,
      level,
      description,
      glow: selectedTheme.glow,
      icon_bg: selectedTheme.icon_bg,
      tag_color: selectedTheme.tag_color,
      order_number: 0
    }]);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/admin/dashboard/skills");
  return { success: true, error: "" };
}

export async function updateSkill(prevState: any, formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const category = formData.get("category") as string;
  const level = formData.get("level") as string;
  const description = formData.get("description") as string;
  const theme = formData.get("theme") as string;

  if (!id || !name || !category || !level) {
    return { success: false, error: "ID, Name, category, and level are required." };
  }

  const selectedTheme = themeMap[theme] || themeMap.purple;

  const { error } = await supabase
    .from("skills")
    .update({
      name,
      category,
      level,
      description,
      glow: selectedTheme.glow,
      icon_bg: selectedTheme.icon_bg,
      tag_color: selectedTheme.tag_color
    })
    .eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/admin/dashboard/skills");
  return { success: true, error: "" };
}

export async function deleteSkill(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("skills")
    .delete()
    .eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/admin/dashboard/skills");
  return { success: true };
}
