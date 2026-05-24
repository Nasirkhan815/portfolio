import { createClient } from "@/utils/supabase/server";
import SettingsForm from "./SettingsForm";

export default async function SettingsPage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", "global_settings")
    .single();

  const defaults = {
    title: "Nasir Khan | Premium UX/UI Designer & CGI Artist",
    description: "Senior UX/UI Designer & 3D CG Artist at Axis Craft Studio. Bridging the boundary between artistic CGI rendering and functional UX architecture.",
    logo_url: "/logo.png",
    email: "nasir.khan815@gmail.com",
    phone: "+92 300 0000000",
    address: "Axis Craft Studio, Lahore, Pakistan",
    whatsapp_url: "https://wa.me/923000000000",
    linkedin_url: "https://www.linkedin.com/in/nasirkhan-uiux/",
    github_url: "https://github.com",
    resume_url: ""
  };

  const initialData = data || defaults;

  return (
    <div className="space-y-6 text-left">
      <div>
        <span className="text-xs font-mono text-neon-purple tracking-widest uppercase block">
          Settings Manager
        </span>
        <h2 className="text-3xl font-black font-display text-white tracking-tight mt-1">
          Manage Site Settings
        </h2>
      </div>
      <SettingsForm initialData={initialData} />
    </div>
  );
}
