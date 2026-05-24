import { createClient } from "@/utils/supabase/server";
import ExperienceManager from "./ExperienceManager";

export default async function ExperiencePage() {
  const supabase = await createClient();
  let experience: any[] = [];

  try {
    const { data, error } = await supabase
      .from("experience")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      experience = data;
    }
  } catch (err) {
    console.error("Experience server query error:", err);
  }

  return (
    <div className="space-y-6 text-left">
      <div>
        <span className="text-xs font-mono text-neon-purple tracking-widest uppercase block">
          CMS Manager
        </span>
        <h2 className="text-3xl font-black font-display text-white tracking-tight mt-1">
          Manage Experience Timeline
        </h2>
      </div>
      <ExperienceManager initialExperience={experience} />
    </div>
  );
}
