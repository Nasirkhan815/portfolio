"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

const colorThemes: Record<string, string> = {
  purple: "from-neon-purple to-neon-pink",
  blue: "from-neon-blue to-neon-purple",
  pink: "from-neon-pink to-neon-blue"
};

export async function addTestimonial(prevState: any, formData: FormData) {
  const supabase = await createClient();

  const quote = formData.get("quote") as string;
  const name = formData.get("name") as string;
  const role = formData.get("role") as string;
  const company = formData.get("company") as string;
  const theme = formData.get("theme") as string; // "purple" | "blue" | "pink"

  if (!quote || !name || !role || !company) {
    return { success: false, error: "Quote, name, role, and company are required." };
  }

  // Calculate initials automatically
  const initials = name
    .split(" ")
    .map(n => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  const color = colorThemes[theme] || colorThemes.purple;

  const { error } = await supabase
    .from("testimonials")
    .insert([{
      quote,
      name,
      role,
      company,
      initials,
      color,
      order_number: 0
    }]);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/admin/dashboard/testimonials");
  return { success: true, error: "" };
}

export async function updateTestimonial(prevState: any, formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string;
  const quote = formData.get("quote") as string;
  const name = formData.get("name") as string;
  const role = formData.get("role") as string;
  const company = formData.get("company") as string;
  const theme = formData.get("theme") as string; // "purple" | "blue" | "pink"

  if (!id || !quote || !name || !role || !company) {
    return { success: false, error: "ID, Quote, name, role, and company are required." };
  }

  // Calculate initials automatically
  const initials = name
    .split(" ")
    .map(n => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  const color = colorThemes[theme] || colorThemes.purple;

  const { error } = await supabase
    .from("testimonials")
    .update({
      quote,
      name,
      role,
      company,
      initials,
      color
    })
    .eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/admin/dashboard/testimonials");
  return { success: true, error: "" };
}

export async function deleteTestimonial(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("testimonials")
    .delete()
    .eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/admin/dashboard/testimonials");
  return { success: true };
}
