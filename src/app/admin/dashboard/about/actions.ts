"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateAbout(prevState: any, formData: FormData) {
  const supabase = await createClient();

  const title = formData.get("title") as string;
  const subtitle = formData.get("subtitle") as string;
  
  // Retrieve the three paragraphs
  const p1 = formData.get("paragraph_1") as string;
  const p2 = formData.get("paragraph_2") as string;
  const p3 = formData.get("paragraph_3") as string;
  const paragraphs = [p1, p2, p3].filter(Boolean);

  // Retrieve the four stats
  const stats = [
    {
      value: formData.get("stat_0_value") as string,
      label: formData.get("stat_0_label") as string,
      desc: formData.get("stat_0_desc") as string,
      color: "text-neon-purple",
      icon: "Award"
    },
    {
      value: formData.get("stat_1_value") as string,
      label: formData.get("stat_1_label") as string,
      desc: formData.get("stat_1_desc") as string,
      color: "text-neon-pink",
      icon: "Layers"
    },
    {
      value: formData.get("stat_2_value") as string,
      label: formData.get("stat_2_label") as string,
      desc: formData.get("stat_2_desc") as string,
      color: "text-neon-blue",
      icon: "Users"
    },
    {
      value: formData.get("stat_3_value") as string,
      label: formData.get("stat_3_label") as string,
      desc: formData.get("stat_3_desc") as string,
      color: "text-neon-emerald",
      icon: "Zap"
    }
  ];

  const { error } = await supabase
    .from("about_settings")
    .update({
      title,
      subtitle,
      paragraphs,
      stats,
      updated_at: new Date().toISOString()
    })
    .eq("id", "about_settings");

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/admin/dashboard/about");
  return { success: true, error: "" };
}
