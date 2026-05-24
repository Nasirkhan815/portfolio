"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function addExperience(prevState: any, formData: FormData) {
  const supabase = await createClient();

  const year = formData.get("year") as string;
  const role = formData.get("role") as string;
  const company = formData.get("company") as string;
  const description = formData.get("description") as string;
  const type = formData.get("type") as string; // "work" | "education"
  
  const techRaw = formData.get("tech") as string;
  const tech = techRaw 
    ? techRaw.split(",").map(t => t.trim()).filter(Boolean) 
    : [];

  if (!year || !role || !company || !type) {
    return { success: false, error: "Year, role, company, and type are required." };
  }

  const { error } = await supabase
    .from("experience")
    .insert([{
      year,
      role,
      company,
      description,
      type,
      tech,
      order_number: 0
    }]);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/admin/dashboard/experience");
  return { success: true, error: "" };
}

export async function updateExperience(prevState: any, formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string;
  const year = formData.get("year") as string;
  const role = formData.get("role") as string;
  const company = formData.get("company") as string;
  const description = formData.get("description") as string;
  const type = formData.get("type") as string; // "work" | "education"
  
  const techRaw = formData.get("tech") as string;
  const tech = techRaw 
    ? techRaw.split(",").map(t => t.trim()).filter(Boolean) 
    : [];

  if (!id || !year || !role || !company || !type) {
    return { success: false, error: "ID, year, role, company, and type are required." };
  }

  const { error } = await supabase
    .from("experience")
    .update({
      year,
      role,
      company,
      description,
      type,
      tech
    })
    .eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/admin/dashboard/experience");
  return { success: true, error: "" };
}

export async function deleteExperience(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("experience")
    .delete()
    .eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/admin/dashboard/experience");
  return { success: true };
}
