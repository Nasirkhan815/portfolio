"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function addProject(prevState: any, formData: FormData) {
  const supabase = await createClient();

  const title = formData.get("title") as string;
  const category = formData.get("category") as string;
  const description = formData.get("description") as string;
  const image_url = formData.get("image_url") as string;
  const case_study_url = formData.get("case_study_url") as string;
  const live_url = formData.get("live_url") as string;
  
  const toolsRaw = formData.get("tools") as string;
  const tools = toolsRaw 
    ? toolsRaw.split(",").map(t => t.trim()).filter(Boolean) 
    : [];

  if (!title || !category || !image_url) {
    return { success: false, error: "Title, category, and a project image are required." };
  }

  const { error } = await supabase
    .from("projects")
    .insert([{
      title,
      category,
      description,
      tools,
      image_url,
      case_study_url: case_study_url || "",
      live_url: live_url || "",
      order_number: 0
    }]);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/admin/dashboard/projects");
  return { success: true, error: "" };
}

export async function updateProject(prevState: any, formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const category = formData.get("category") as string;
  const description = formData.get("description") as string;
  const image_url = formData.get("image_url") as string;
  const case_study_url = formData.get("case_study_url") as string;
  const live_url = formData.get("live_url") as string;
  
  const toolsRaw = formData.get("tools") as string;
  const tools = toolsRaw 
    ? toolsRaw.split(",").map(t => t.trim()).filter(Boolean) 
    : [];

  if (!id || !title || !category || !image_url) {
    return { success: false, error: "ID, title, category, and a project image are required." };
  }

  const { error } = await supabase
    .from("projects")
    .update({
      title,
      category,
      description,
      tools,
      image_url,
      case_study_url: case_study_url || "",
      live_url: live_url || ""
    })
    .eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/admin/dashboard/projects");
  return { success: true, error: "" };
}

export async function deleteProject(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("projects")
    .delete()
    .eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/admin/dashboard/projects");
  return { success: true };
}
