import { createClient } from "@/utils/supabase/server";
import SkillsManager from "./SkillsManager";

export default async function SkillsPage() {
  const supabase = await createClient();
  let skills: any[] = [];

  try {
    const { data, error } = await supabase
      .from("skills")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      skills = data;
    }
  } catch (err) {
    console.error("Skills server query error:", err);
  }

  return (
    <div className="space-y-6 text-left">
      <div>
        <span className="text-xs font-mono text-neon-purple tracking-widest uppercase block">
          CMS Manager
        </span>
        <h2 className="text-3xl font-black font-display text-white tracking-tight mt-1">
          Manage Studio Skills
        </h2>
      </div>
      <SkillsManager initialSkills={skills} />
    </div>
  );
}
