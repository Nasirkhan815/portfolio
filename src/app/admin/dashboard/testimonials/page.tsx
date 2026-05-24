import { createClient } from "@/utils/supabase/server";
import TestimonialsManager from "./TestimonialsManager";

export default async function TestimonialsPage() {
  const supabase = await createClient();
  let testimonials: any[] = [];

  try {
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      testimonials = data;
    }
  } catch (err) {
    console.error("Testimonials server query error:", err);
  }

  return (
    <div className="space-y-6 text-left">
      <div>
        <span className="text-xs font-mono text-neon-purple tracking-widest uppercase block">
          CMS Manager
        </span>
        <h2 className="text-3xl font-black font-display text-white tracking-tight mt-1">
          Manage Testimonials
        </h2>
      </div>
      <TestimonialsManager initialTestimonials={testimonials} />
    </div>
  );
}
