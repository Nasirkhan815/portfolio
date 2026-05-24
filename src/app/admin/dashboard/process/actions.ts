"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export interface ProcessStep {
  num: string;
  icon: string;
  title: string;
  subtitle: string;
  description: string;
}

export interface ProcessData {
  subtitle: string;
  title: string;
  steps: ProcessStep[];
  status: "draft" | "published";
}

export async function updateProcess(data: ProcessData): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("process_settings")
    .upsert({
      id: "process_settings",
      subtitle: data.subtitle,
      title: data.title,
      steps: data.steps,
      status: data.status,
    });

  if (error) {
    // Table may not exist yet — return a friendly message
    if (error.code === "42P01") {
      return {
        success: false,
        error:
          "The 'process_settings' table does not exist yet. Please run the SQL script from the implementation plan in your Supabase Dashboard → SQL Editor.",
      };
    }
    return { success: false, error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/admin/dashboard/process");
  return { success: true };
}
