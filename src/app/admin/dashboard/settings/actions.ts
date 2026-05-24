"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateSettings(prevState: any, formData: FormData) {
  const supabase = await createClient();

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const logo_url = formData.get("logo_url") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const address = formData.get("address") as string;
  
  const whatsapp_url = formData.get("whatsapp_url") as string;
  const linkedin_url = formData.get("linkedin_url") as string;
  const github_url = formData.get("github_url") as string;
  const resume_url = formData.get("resume_url") as string;

  const { error } = await supabase
    .from("site_settings")
    .update({
      title,
      description,
      logo_url,
      email,
      phone,
      address,
      whatsapp_url,
      linkedin_url,
      github_url,
      resume_url,
      updated_at: new Date().toISOString()
    })
    .eq("id", "global_settings");

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/admin/dashboard/settings");
  return { success: true, error: "" };
}
