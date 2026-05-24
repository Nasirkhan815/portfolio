import { createClient } from "@/utils/supabase/server";
import ProjectsManager from "./ProjectsManager";

export default async function ProjectsPage() {
  const supabase = await createClient();
  let projects: any[] = [];

  try {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      projects = data;
    }
  } catch (err) {
    console.error("Projects server query error:", err);
  }

  return (
    <div className="space-y-6 text-left">
      <div>
        <span className="text-xs font-mono text-neon-purple tracking-widest uppercase block">
          CMS Manager
        </span>
        <h2 className="text-3xl font-black font-display text-white tracking-tight mt-1">
          Manage Projects Portfolio
        </h2>
      </div>
      <ProjectsManager initialProjects={projects} />
    </div>
  );
}
