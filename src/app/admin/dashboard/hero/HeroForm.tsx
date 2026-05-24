"use client";

import { useActionState, startTransition, useState } from "react";
import { 
  Terminal, Save, CheckCircle2, AlertCircle, Loader2, 
  Plus, Trash2, Eye, EyeOff, Link2, Globe, Mail, 
  Sparkles, Layers, BarChart3, HelpCircle 
} from "lucide-react";
import ImageUploader from "@/components/admin/ImageUploader";
import { updateHero } from "./actions";

interface HeroData {
  badge: string;
  name: string;
  roles: string[];
  description: string;
  experience_badge: string;
  rating_badge: string;
  projects_badge: string;
  image_url: string;
  cards_config?: any;
  social_links?: any;
}

const defaultCardsConfig = {
  scene_layers: {
    visible: true,
    title: "Scene Layers",
    item1_text: "CGI_Render_Final",
    item1_label: "3D",
    item2_text: "UI_Layer_Kit",
    item2_label: "Figma"
  },
  visual_score: {
    visible: true,
    title: "Visual Score",
    value: "5.0",
    growth: "+4.2%"
  },
  studio: {
    visible: true,
    title: "Axis Craft Studio",
    badge: "10+ Years Certified",
    reviews_label: "REVIEWS",
    reviews_value: "5.0 ⭐",
    projects_label: "PROJECTS",
    projects_value: "150+"
  }
};

const defaultSocialLinks = [
  { icon: "globe", url: "https://Axis-Craft.com", visible: true },
  { icon: "linkedin", url: "https://www.linkedin.com/in/nasirkhan-uiux/", visible: true },
  { icon: "mail", url: "mailto:nasir.khan815@gmail.com", visible: true }
];

export default function HeroForm({ initialData }: { initialData: HeroData }) {
  const [imageUrl, setImageUrl] = useState(initialData.image_url || "");
  
  // Custom states for JSONB flexible configurations
  const [cardsConfig, setCardsConfig] = useState<any>(
    initialData.cards_config || defaultCardsConfig
  );
  const [socialLinks, setSocialLinks] = useState<any[]>(
    initialData.social_links || defaultSocialLinks
  );

  const [state, formAction, isPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      // Inject variables since they aren't standard input elements
      formData.set("image_url", imageUrl);
      formData.set("cards_config", JSON.stringify(cardsConfig));
      formData.set("social_links", JSON.stringify(socialLinks));
      return await updateHero(prevState, formData);
    },
    { success: false, error: "", warning: "" }
  );

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(() => {
      formAction(formData);
    });
  };

  // Helper to update specific card config nested values
  const updateCardConfig = (cardKey: string, field: string, value: any) => {
    setCardsConfig((prev: any) => ({
      ...prev,
      [cardKey]: {
        ...prev[cardKey],
        [field]: value
      }
    }));
  };

  // Bottom Social Link Managers
  const handleAddSocial = () => {
    setSocialLinks((prev) => [
      ...prev,
      { icon: "globe", url: "https://", visible: true }
    ]);
  };

  const handleRemoveSocial = (index: number) => {
    setSocialLinks((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleUpdateSocial = (index: number, field: string, value: any) => {
    setSocialLinks((prev) =>
      prev.map((item, idx) => (idx === index ? { ...item, [field]: value } : item))
    );
  };

  // Helper to render icon preview in admin panel
  const renderSocialIcon = (iconName: string) => {
    const className = "w-4 h-4";
    switch (iconName) {
      case "globe": return <Globe className={`${className} text-neon-blue`} />;
      case "mail": return <Mail className={`${className} text-neon-pink`} />;
      case "linkedin": return (
        <svg className={`${className} text-neon-purple`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect width="4" height="12" x="2" y="9"></rect><circle cx="4" cy="4" r="2"></circle></svg>
      );
      case "github": return (
        <svg className={`${className} text-white`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
      );
      case "twitter": return (
        <svg className={`${className} text-sky-400`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
      );
      case "instagram": return (
        <svg className={`${className} text-pink-500`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
      );
      case "youtube": return (
        <svg className={`${className} text-red-500`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"></path><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"></polygon></svg>
      );
      default: return <HelpCircle className={`${className} text-gray-400`} />;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl text-left pb-20">
      {/* Save Success / Error banners */}
      {state.success && !state.warning && (
        <div className="p-4 rounded-xl bg-neon-emerald/10 border border-neon-emerald/20 flex items-center gap-3 text-neon-emerald text-xs font-semibold">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>Hero presentation settings updated successfully! Frontend layouts revalidated.</span>
        </div>
      )}

      {state.warning && (
        <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/20 flex flex-col gap-2 text-amber-300 text-xs font-semibold">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{state.warning}</span>
          </div>
        </div>
      )}

      {state.error && (
        <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/20 flex items-center gap-3 text-red-400 text-xs font-semibold">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>⚠️ {state.error}</span>
        </div>
      )}

      {/* Main split grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Bio Typography & Badges (Col: 7) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-card rounded-2xl border border-white/[0.06] p-6 sm:p-8 relative overflow-hidden bg-obsidian-950/40">
            <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.005] to-white/[0.02] -z-10 rounded-2xl" />
            
            <h3 className="text-sm font-bold font-display text-white uppercase tracking-wider mb-6 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-neon-purple" /> Typography & Bio Text
            </h3>

            <div className="space-y-5">
              {/* Badge text */}
              <div className="flex flex-col space-y-2">
                <label htmlFor="badge" className="text-xs font-semibold text-gray-400">
                  Hero Header Badge
                </label>
                <input
                  type="text"
                  id="badge"
                  name="badge"
                  defaultValue={initialData.badge}
                  placeholder="Senior Designer & Creative Director"
                  className="w-full px-4 py-3 rounded-xl text-xs bg-black/45 border border-white/[0.06] text-white focus:outline-none focus:border-neon-purple/50 transition-colors"
                />
              </div>

              {/* Name */}
              <div className="flex flex-col space-y-2">
                <label htmlFor="name" className="text-xs font-semibold text-gray-400">
                  Full Profile Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  defaultValue={initialData.name}
                  placeholder="Nasir Khan"
                  className="w-full px-4 py-3 rounded-xl text-xs bg-black/45 border border-white/[0.06] text-white focus:outline-none focus:border-neon-purple/50 transition-colors"
                />
              </div>

              {/* Roles rotates (Comma separated) */}
              <div className="flex flex-col space-y-2">
                <label htmlFor="roles" className="text-xs font-semibold text-gray-400">
                  Rotating Roles (Comma separated)
                </label>
                <input
                  type="text"
                  id="roles"
                  name="roles"
                  defaultValue={initialData.roles?.join(", ") || ""}
                  placeholder="Senior UI/UX Designer, Product Designer, 3D CG Artist"
                  className="w-full px-4 py-3 rounded-xl text-xs bg-black/45 border border-white/[0.06] text-white focus:outline-none focus:border-neon-purple/50 transition-colors"
                />
                <span className="text-[9px] text-gray-600 font-mono">
                  Separate distinct specialties using a comma. They will spin sequentially in the visual hero loop.
                </span>
              </div>

              {/* Narrative description */}
              <div className="flex flex-col space-y-2">
                <label htmlFor="description" className="text-xs font-semibold text-gray-400">
                  Narrative Introduction Bio
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  defaultValue={initialData.description}
                  placeholder="Hi, I'm Nasir Khan. Over the past 10 years..."
                  className="w-full px-4 py-3 rounded-xl text-xs bg-black/45 border border-white/[0.06] text-white focus:outline-none focus:border-neon-purple/50 resize-none transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Quick Metrics Badges Card */}
          <div className="glass-card rounded-2xl border border-white/[0.06] p-6 sm:p-8 relative overflow-hidden bg-obsidian-950/40">
            <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.005] to-white/[0.02] -z-10 rounded-2xl" />
            
            <h3 className="text-sm font-bold font-display text-white uppercase tracking-wider mb-6 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-neon-blue" /> Dashboard Stats Overlay Badges
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {/* Experience Badge */}
              <div className="flex flex-col space-y-2">
                <label htmlFor="experience_badge" className="text-xs font-semibold text-gray-400">
                  Experience Badge
                </label>
                <input
                  type="text"
                  id="experience_badge"
                  name="experience_badge"
                  defaultValue={initialData.experience_badge}
                  placeholder="10+ Years Certified"
                  className="w-full px-3 py-2.5 rounded-xl text-xs bg-black/45 border border-white/[0.06] text-white focus:outline-none focus:border-neon-blue/50 transition-colors"
                />
              </div>

              {/* Rating Badge */}
              <div className="flex flex-col space-y-2">
                <label htmlFor="rating_badge" className="text-xs font-semibold text-gray-400">
                  Reviews Badge
                </label>
                <input
                  type="text"
                  id="rating_badge"
                  name="rating_badge"
                  defaultValue={initialData.rating_badge}
                  placeholder="5.0 ⭐"
                  className="w-full px-3 py-2.5 rounded-xl text-xs bg-black/45 border border-white/[0.06] text-white focus:outline-none focus:border-neon-blue/50 transition-colors"
                />
              </div>

              {/* Projects Badge */}
              <div className="flex flex-col space-y-2">
                <label htmlFor="projects_badge" className="text-xs font-semibold text-gray-400">
                  Projects Badge
                </label>
                <input
                  type="text"
                  id="projects_badge"
                  name="projects_badge"
                  defaultValue={initialData.projects_badge}
                  placeholder="150+"
                  className="w-full px-3 py-2.5 rounded-xl text-xs bg-black/45 border border-white/[0.06] text-white focus:outline-none focus:border-neon-blue/50 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Social Links / Bottom Icons Manager Section */}
          <div className="glass-card rounded-2xl border border-white/[0.06] p-6 sm:p-8 relative overflow-hidden bg-obsidian-950/40">
            <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.005] to-white/[0.02] -z-10 rounded-2xl" />
            
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-bold font-display text-white uppercase tracking-wider flex items-center gap-2">
                <Link2 className="w-4 h-4 text-neon-pink" /> Social Links & Bottom Icons
              </h3>
              <button
                type="button"
                onClick={handleAddSocial}
                className="px-2.5 py-1 rounded-lg border border-neon-pink/20 bg-neon-pink/5 hover:bg-neon-pink/15 text-neon-pink text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Link
              </button>
            </div>

            <div className="space-y-4">
              {socialLinks.map((link, index) => (
                <div 
                  key={index}
                  className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-3.5 rounded-xl border border-white/[0.04] bg-black/20"
                >
                  {/* Icon Selector dropdown */}
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-white/[0.02] border border-white/[0.06] flex items-center justify-center flex-shrink-0">
                      {renderSocialIcon(link.icon)}
                    </div>
                    <select
                      value={link.icon}
                      onChange={(e) => handleUpdateSocial(index, "icon", e.target.value)}
                      className="bg-black/60 border border-white/[0.06] rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-neon-pink/50 cursor-pointer"
                    >
                      <option value="globe">Globe (Web)</option>
                      <option value="linkedin">LinkedIn</option>
                      <option value="mail">Email</option>
                      <option value="github">GitHub</option>
                      <option value="twitter">Twitter</option>
                      <option value="instagram">Instagram</option>
                      <option value="youtube">YouTube</option>
                    </select>
                  </div>

                  {/* URL Input */}
                  <input
                    type="text"
                    value={link.url}
                    placeholder={link.icon === "mail" ? "mailto:email@example.com" : "https://url.com"}
                    onChange={(e) => handleUpdateSocial(index, "url", e.target.value)}
                    className="flex-grow min-w-0 px-3 py-1.5 rounded-lg text-xs bg-black/45 border border-white/[0.06] text-white focus:outline-none focus:border-neon-pink/50"
                  />

                  {/* Actions (Toggle, Delete) */}
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleUpdateSocial(index, "visible", !link.visible)}
                      className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                        link.visible
                          ? "border-neon-emerald/20 bg-neon-emerald/5 text-neon-emerald"
                          : "border-white/[0.06] bg-transparent text-gray-500 hover:text-gray-400"
                      }`}
                      title={link.visible ? "Visible on Frontend" : "Hidden"}
                    >
                      {link.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveSocial(index)}
                      className="p-1.5 rounded-lg border border-red-500/10 hover:border-red-500/20 bg-transparent text-red-400 hover:bg-red-500/5 transition-all cursor-pointer"
                      title="Remove Link"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              {socialLinks.length === 0 && (
                <div className="py-6 border border-dashed border-white/[0.06] rounded-xl text-center text-xs text-gray-500">
                  No social links registered. Click "Add Link" to create one.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Image and Floating Cards Control (Col: 5) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Portrait silhouette */}
          <div className="glass-card rounded-2xl border border-white/[0.06] p-6 sm:p-8 relative overflow-hidden bg-obsidian-950/40">
            <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.005] to-white/[0.02] -z-10 rounded-2xl" />
            
            <h3 className="text-sm font-bold font-display text-white uppercase tracking-wider mb-6 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-neon-pink" /> Portrait Silhouette
            </h3>

            <ImageUploader
              value={imageUrl}
              onChange={setImageUrl}
              label="Transparent Portrait PNG"
              bucket="portfolio-images"
              accept="image/png, image/webp"
            />
            
            <span className="text-[9.5px] text-gray-500 leading-relaxed block mt-3 font-mono">
              ⚠️ Recommendation: Use a high-definition transparent PNG file to preserve the parallax glowing elements on the Landing screen.
            </span>
          </div>

          {/* Floating Cards configurations */}
          <div className="glass-card rounded-2xl border border-white/[0.06] p-6 sm:p-8 relative overflow-hidden bg-obsidian-950/40">
            <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.005] to-white/[0.02] -z-10 rounded-2xl" />
            
            <h3 className="text-sm font-bold font-display text-white uppercase tracking-wider mb-6 flex items-center gap-2">
              <Layers className="w-4 h-4 text-neon-emerald" /> Portrait Floating Cards
            </h3>

            <div className="space-y-6 text-left">
              
              {/* Card 1: Figma/Scene Layers */}
              <div className="p-4 rounded-xl border border-white/[0.04] bg-black/20 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-white/[0.05]">
                  <span className="text-xs font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-neon-purple" />
                    Card 1: Scene Layers
                  </span>
                  <button
                    type="button"
                    onClick={() => updateCardConfig("scene_layers", "visible", !cardsConfig.scene_layers?.visible)}
                    className={`p-1 rounded-lg border transition-all cursor-pointer ${
                      cardsConfig.scene_layers?.visible
                        ? "border-neon-emerald/20 bg-neon-emerald/5 text-neon-emerald"
                        : "border-white/[0.06] bg-transparent text-gray-500"
                    }`}
                  >
                    {cardsConfig.scene_layers?.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {cardsConfig.scene_layers?.visible && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col space-y-1">
                        <span className="text-[10px] text-gray-400 font-semibold">Card Title</span>
                        <input
                          type="text"
                          value={cardsConfig.scene_layers?.title || ""}
                          onChange={(e) => updateCardConfig("scene_layers", "title", e.target.value)}
                          className="px-2.5 py-1.5 rounded-lg text-xs bg-black/40 border border-white/[0.06] text-white focus:outline-none"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2">
                      <div className="col-span-2 flex flex-col space-y-1">
                        <span className="text-[9px] text-gray-500 font-semibold">Layer 1 Text</span>
                        <input
                          type="text"
                          value={cardsConfig.scene_layers?.item1_text || ""}
                          onChange={(e) => updateCardConfig("scene_layers", "item1_text", e.target.value)}
                          className="px-2.5 py-1 rounded-lg text-[11px] bg-black/40 border border-white/[0.06] text-white focus:outline-none"
                        />
                      </div>
                      <div className="flex flex-col space-y-1">
                        <span className="text-[9px] text-gray-500 font-semibold">Label</span>
                        <input
                          type="text"
                          value={cardsConfig.scene_layers?.item1_label || ""}
                          onChange={(e) => updateCardConfig("scene_layers", "item1_label", e.target.value)}
                          className="px-2 py-1 rounded-lg text-[11px] bg-black/40 border border-white/[0.06] text-white focus:outline-none text-center"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div className="col-span-2 flex flex-col space-y-1">
                        <span className="text-[9px] text-gray-500 font-semibold">Layer 2 Text</span>
                        <input
                          type="text"
                          value={cardsConfig.scene_layers?.item2_text || ""}
                          onChange={(e) => updateCardConfig("scene_layers", "item2_text", e.target.value)}
                          className="px-2.5 py-1 rounded-lg text-[11px] bg-black/40 border border-white/[0.06] text-white focus:outline-none"
                        />
                      </div>
                      <div className="flex flex-col space-y-1">
                        <span className="text-[9px] text-gray-500 font-semibold">Label</span>
                        <input
                          type="text"
                          value={cardsConfig.scene_layers?.item2_label || ""}
                          onChange={(e) => updateCardConfig("scene_layers", "item2_label", e.target.value)}
                          className="px-2 py-1 rounded-lg text-[11px] bg-black/40 border border-white/[0.06] text-white focus:outline-none text-center"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Card 2: Visual Score */}
              <div className="p-4 rounded-xl border border-white/[0.04] bg-black/20 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-white/[0.05]">
                  <span className="text-xs font-bold text-white flex items-center gap-2">
                    <BarChart3 className="w-3.5 h-3.5 text-neon-blue" />
                    Card 2: Visual Score
                  </span>
                  <button
                    type="button"
                    onClick={() => updateCardConfig("visual_score", "visible", !cardsConfig.visual_score?.visible)}
                    className={`p-1 rounded-lg border transition-all cursor-pointer ${
                      cardsConfig.visual_score?.visible
                        ? "border-neon-emerald/20 bg-neon-emerald/5 text-neon-emerald"
                        : "border-white/[0.06] bg-transparent text-gray-500"
                    }`}
                  >
                    {cardsConfig.visual_score?.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {cardsConfig.visual_score?.visible && (
                  <div className="grid grid-cols-3 gap-2">
                    <div className="flex flex-col space-y-1 col-span-1">
                      <span className="text-[9px] text-gray-500 font-semibold">Title</span>
                      <input
                        type="text"
                        value={cardsConfig.visual_score?.title || ""}
                        onChange={(e) => updateCardConfig("visual_score", "title", e.target.value)}
                        className="px-2 py-1 rounded-lg text-[11px] bg-black/40 border border-white/[0.06] text-white focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-col space-y-1 col-span-1">
                      <span className="text-[9px] text-gray-500 font-semibold">Value</span>
                      <input
                        type="text"
                        value={cardsConfig.visual_score?.value || ""}
                        onChange={(e) => updateCardConfig("visual_score", "value", e.target.value)}
                        className="px-2 py-1 rounded-lg text-[11px] bg-black/40 border border-white/[0.06] text-white focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-col space-y-1 col-span-1">
                      <span className="text-[9px] text-gray-500 font-semibold">Growth</span>
                      <input
                        type="text"
                        value={cardsConfig.visual_score?.growth || ""}
                        onChange={(e) => updateCardConfig("visual_score", "growth", e.target.value)}
                        className="px-2 py-1 rounded-lg text-[11px] bg-black/40 border border-white/[0.06] text-white focus:outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Card 3: Axis Craft Studio / Profiler Metrics */}
              <div className="p-4 rounded-xl border border-white/[0.04] bg-black/20 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-white/[0.05]">
                  <span className="text-xs font-bold text-white flex items-center gap-2">
                    <Layers className="w-3.5 h-3.5 text-neon-pink" />
                    Card 3: Metrics Studio
                  </span>
                  <button
                    type="button"
                    onClick={() => updateCardConfig("studio", "visible", !cardsConfig.studio?.visible)}
                    className={`p-1 rounded-lg border transition-all cursor-pointer ${
                      cardsConfig.studio?.visible
                        ? "border-neon-emerald/20 bg-neon-emerald/5 text-neon-emerald"
                        : "border-white/[0.06] bg-transparent text-gray-500"
                    }`}
                  >
                    {cardsConfig.studio?.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {cardsConfig.studio?.visible && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col space-y-1">
                        <span className="text-[9px] text-gray-500 font-semibold">Studio Name</span>
                        <input
                          type="text"
                          value={cardsConfig.studio?.title || ""}
                          onChange={(e) => updateCardConfig("studio", "title", e.target.value)}
                          className="px-2 py-1 rounded-lg text-[11px] bg-black/40 border border-white/[0.06] text-white focus:outline-none"
                        />
                      </div>
                      <div className="flex flex-col space-y-1">
                        <span className="text-[9px] text-gray-500 font-semibold">Studio Subtitle</span>
                        <input
                          type="text"
                          value={cardsConfig.studio?.badge || ""}
                          onChange={(e) => updateCardConfig("studio", "badge", e.target.value)}
                          className="px-2 py-1 rounded-lg text-[11px] bg-black/40 border border-white/[0.06] text-white focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 p-2 bg-black/10 rounded-lg">
                      <div className="space-y-2">
                        <span className="text-[8px] text-neon-purple uppercase font-bold tracking-wider block">Metric 1</span>
                        <div className="flex flex-col space-y-1">
                          <span className="text-[8px] text-gray-500 font-semibold">Label</span>
                          <input
                            type="text"
                            value={cardsConfig.studio?.reviews_label || ""}
                            onChange={(e) => updateCardConfig("studio", "reviews_label", e.target.value)}
                            className="px-2 py-1 rounded bg-black/40 border border-white/[0.04] text-[10px] text-white focus:outline-none"
                          />
                        </div>
                        <div className="flex flex-col space-y-1">
                          <span className="text-[8px] text-gray-500 font-semibold">Value</span>
                          <input
                            type="text"
                            value={cardsConfig.studio?.reviews_value || ""}
                            onChange={(e) => updateCardConfig("studio", "reviews_value", e.target.value)}
                            className="px-2 py-1 rounded bg-black/40 border border-white/[0.04] text-[10px] text-white focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <span className="text-[8px] text-neon-pink uppercase font-bold tracking-wider block">Metric 2</span>
                        <div className="flex flex-col space-y-1">
                          <span className="text-[8px] text-gray-500 font-semibold">Label</span>
                          <input
                            type="text"
                            value={cardsConfig.studio?.projects_label || ""}
                            onChange={(e) => updateCardConfig("studio", "projects_label", e.target.value)}
                            className="px-2 py-1 rounded bg-black/40 border border-white/[0.04] text-[10px] text-white focus:outline-none"
                          />
                        </div>
                        <div className="flex flex-col space-y-1">
                          <span className="text-[8px] text-gray-500 font-semibold">Value</span>
                          <input
                            type="text"
                            value={cardsConfig.studio?.projects_value || ""}
                            onChange={(e) => updateCardConfig("studio", "projects_value", e.target.value)}
                            className="px-2 py-1 rounded bg-black/40 border border-white/[0.04] text-[10px] text-white focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Trigger Card */}
          <div className="p-6 rounded-2xl border border-white/[0.06] bg-white/[0.01] flex flex-col justify-end">
            <button
              type="submit"
              disabled={isPending}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-neon-purple to-neon-pink text-neutral-950 font-bold flex items-center justify-center gap-2 shadow-lg shadow-neon-purple/20 hover:shadow-neon-purple/40 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 transition-all cursor-pointer"
            >
              {isPending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Commit System Updates</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </form>
  );
}
