import { createClient } from "@/utils/supabase/server";
import HeroForm from "./HeroForm";

export default async function HeroPage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("hero_settings")
    .select("*")
    .eq("id", "hero_settings")
    .single();

  const defaults = {
    badge: "Senior Designer & Creative Director",
    name: "Nasir Khan",
    roles: ["Senior UI/UX Designer", "Product Designer", "Graphic Designer", "3D CG Artist"],
    description: "Hi, I'm Nasir Khan. Over the past 10 years, I've designed digital products and immersive CG visual assets at Axis Craft. I bridge the boundary between artistic CGI rendering and functional UX architecture.",
    experience_badge: "10+ Years Certified",
    rating_badge: "5.0 ⭐",
    projects_badge: "150+",
    image_url: ""
  };

  const initialData = data || defaults;

  return (
    <div className="space-y-6 text-left">
      <div>
        <span className="text-xs font-mono text-neon-purple tracking-widest uppercase block">
          CMS Manager
        </span>
        <h2 className="text-3xl font-black font-display text-white tracking-tight mt-1">
          Manage Hero Presentation
        </h2>
      </div>
      <HeroForm initialData={initialData} />
    </div>
  );
}
