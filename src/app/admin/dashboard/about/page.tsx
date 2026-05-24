import { createClient } from "@/utils/supabase/server";
import AboutForm from "./AboutForm";

export default async function AboutPage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("about_settings")
    .select("*")
    .eq("id", "about_settings")
    .single();

  const defaults = {
    title: "Bridging Artistic CGI Expression with Pixel-Perfect Product UX",
    subtitle: "Visual Architect",
    paragraphs: [
      "Hi, I'm Nasir Khan. Over the past 10 years, I've functioned as a Senior UI/UX Designer, Product Designer, Graphic Layout Architect, and 3D CG Artist. I established my visual studio brand Artixor to build spatial interactive digital models and responsive software frameworks.",
      "My creative philosophy relies on two cores: absolute functional simplicity in user experience and hyper-realistic aesthetic rendering in visual branding. I believe a digital interface must be as responsive and accessible as it is stunning to look at.",
      "From formulating extensive typography guides and interactive design systems in Figma to building complex lighting schemas, texturing visual maps, and rendering real-time cinematic cinematics in Blender and Unreal Engine 5—I deliver a unified visual signature."
    ],
    stats: [
      { value: "10+", label: "Years Experience", color: "text-neon-purple", desc: "Crafting digital systems since 2016." },
      { value: "150+", label: "Projects Finished", color: "text-neon-pink", desc: "UX interfaces, 3D CGI & graphics." },
      { value: "100+", label: "Happy Clients", color: "text-neon-blue", desc: "Corporate agencies & startups globally." },
      { value: "99%", label: "Client Satisfaction", color: "text-neon-emerald", desc: "Consistently highly rated ratings." }
    ]
  };

  const initialData = data || defaults;

  return (
    <div className="space-y-6 text-left">
      <div>
        <span className="text-xs font-mono text-neon-purple tracking-widest uppercase block">
          CMS Manager
        </span>
        <h2 className="text-3xl font-black font-display text-white tracking-tight mt-1">
          Manage About Section
        </h2>
      </div>
      <AboutForm initialData={initialData} />
    </div>
  );
}
