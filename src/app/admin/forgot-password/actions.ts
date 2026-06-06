"use server";

import { createClient } from "@/utils/supabase/server";

export type ForgotPasswordState = {
  error: string;
  success: boolean;
};

export async function requestPasswordReset(
  prevState: ForgotPasswordState,
  formData: FormData
): Promise<ForgotPasswordState> {
  const email = formData.get("email") as string;

  if (!email) {
    return {
      error: "Email is required.",
      success: false,
    };
  }

  const supabase = await createClient();

  const origin =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "http://localhost:3000";

  const redirectUrl = `${origin}/admin/reset-password`;

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: redirectUrl,
  });

  if (error) {
    return {
      error: error.message,
      success: false,
    };
  }

  return {
    error: "",
    success: true,
  };
}