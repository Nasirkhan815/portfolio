"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

// 1. PUBLIC SUBMISSION ACTION
export async function submitContactMessage(prevState: any, formData: FormData) {
  const supabase = await createClient();

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const subject = formData.get("subject") as string;
  const message = formData.get("message") as string;

  if (!name || !email || !subject || !message) {
    return { success: false, error: "All form fields are required to transmit a secure signal." };
  }

  // Simple email regex validation
  if (!/\S+@\S+\.\S+/.test(email)) {
    return { success: false, error: "Please input a valid email address." };
  }

  const { error } = await supabase
    .from("contact_messages")
    .insert([{
      name,
      email,
      subject,
      message,
      is_read: false
    }]);

  if (error) {
    return { success: false, error: error.message };
  }

  // Revalidate dashboard overview and messages inbox
  revalidatePath("/admin/dashboard");
  revalidatePath("/admin/dashboard/messages");
  return { success: true, error: "" };
}

// 2. ADMIN READ ACTION
export async function markMessageRead(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("contact_messages")
    .update({ is_read: true })
    .eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/dashboard");
  revalidatePath("/admin/dashboard/messages");
  return { success: true };
}

// 3. ADMIN DELETE ACTION
export async function deleteMessage(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("contact_messages")
    .delete()
    .eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/dashboard");
  revalidatePath("/admin/dashboard/messages");
  return { success: true };
}
