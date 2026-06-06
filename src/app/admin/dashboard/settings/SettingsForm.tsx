"use client";

import { useActionState, startTransition, useState } from "react";
import { Terminal, Save, CheckCircle2, AlertCircle, Loader2, Sparkles, Globe, Link2, FileText } from "lucide-react";
import ImageUploader from "@/components/admin/ImageUploader";
import { updateSettings } from "./actions";

interface SettingsData {
  title: string;
  description: string;
  logo_url: string;
  email: string;
  phone: string;
  address: string;
  whatsapp_url: string;
  linkedin_url: string;
  github_url: string;
  resume_url: string;
  primary_color?: string;
  secondary_color?: string;
  accent_color?: string;
  background_color?: string;
  text_color?: string;
  font_family?: string;

  favicon_url?: string;
  og_image_url?: string;

  site_title?: string;
  site_description?: string;
  footer_text?: string;
}

export default function SettingsForm({ initialData }: { initialData: SettingsData }) {
  const [logoUrl, setLogoUrl] = useState(initialData.logo_url || "");
  const [resumeUrl, setResumeUrl] = useState(initialData.resume_url || "");

  const [state, formAction, isPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      formData.set("logo_url", logoUrl);
      formData.set("resume_url", resumeUrl);
      return await updateSettings(prevState, formData);
    },
    { success: false, error: "" }
  );

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl text-left">
      {/* Status Banners */}
      {state.success && (
        <div className="p-4 rounded-xl bg-neon-emerald/10 border border-neon-emerald/20 flex items-center gap-3 text-neon-emerald text-xs font-semibold">
          <CheckCircle2 className="w-5 h-5" />
          <span>Global site credentials committed successfully! Static paths revalidated.</span>
        </div>
      )}

      {state.error && (
        <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/20 flex items-center gap-3 text-red-400 text-xs font-semibold">
          <AlertCircle className="w-5 h-5" />
          <span>⚠️ {state.error}</span>
        </div>
      )}

      {/* Grid splits */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Form details (Col: 7) */}
        <div className="lg:col-span-7 space-y-6">
          {/* SEO & Meta */}
          <div className="glass-card rounded-2xl border border-white/[0.06] p-6 sm:p-8 relative overflow-hidden bg-obsidian-950/40">
            <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.005] to-white/[0.02] -z-10 rounded-2xl" />
            
            <h3 className="text-sm font-bold font-display text-white uppercase tracking-wider mb-6 flex items-center gap-2">
              <Globe className="w-4 h-4 text-neon-purple" /> Global Search Optimization (SEO)
            </h3>

            <div className="space-y-4">
              {/* Site Title */}
              <div className="flex flex-col space-y-2">
                <label htmlFor="title" className="text-xs font-semibold text-gray-400">
                  Global Meta Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  defaultValue={initialData.title}
                  placeholder="Nasir Khan | Premium UX/UI Designer & CGI Artist"
                  className="w-full px-4 py-3 rounded-xl text-xs bg-black/45 border border-white/[0.06] text-white focus:outline-none focus:border-neon-purple/50 transition-colors"
                />
              </div>

              {/* Site Description */}
              <div className="flex flex-col space-y-2">
                <label htmlFor="description" className="text-xs font-semibold text-gray-400">
                  Global Meta Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  defaultValue={initialData.description}
                  placeholder="Senior UX/UI Designer & 3D CG Artist at Axis Craft Studio..."
                  className="w-full px-4 py-3 rounded-xl text-xs bg-black/45 border border-white/[0.06] text-white focus:outline-none focus:border-neon-purple/50 resize-none transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Social Channels coordinates */}
          <div className="glass-card rounded-2xl border border-white/[0.06] p-6 sm:p-8 relative overflow-hidden bg-obsidian-950/40">
            <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.005] to-white/[0.02] -z-10 rounded-2xl" />
            
            <h3 className="text-sm font-bold font-display text-white uppercase tracking-wider mb-6 flex items-center gap-2">
              <Link2 className="w-4 h-4 text-neon-blue" /> Direct Contact & Social Links
            </h3>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Email */}
                <div className="flex flex-col space-y-2">
                  <label htmlFor="email" className="text-xs font-semibold text-gray-400">
                    Direct Contact Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    defaultValue={initialData.email}
                    placeholder="nasir.khan815@gmail.com"
                    className="w-full px-4 py-3 rounded-xl text-xs bg-black/45 border border-white/[0.06] text-white focus:outline-none focus:border-neon-blue/50 transition-colors"
                  />
                </div>

                {/* Phone */}
                <div className="flex flex-col space-y-2">
                  <label htmlFor="phone" className="text-xs font-semibold text-gray-400">
                    Contact Phone / WhatsApp
                  </label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    defaultValue={initialData.phone}
                    placeholder="+92 300 0000000"
                    className="w-full px-4 py-3 rounded-xl text-xs bg-black/45 border border-white/[0.06] text-white focus:outline-none focus:border-neon-blue/50 transition-colors"
                  />
                </div>

                    {/* Primary Color */}
                    <div className="flex flex-col space-y-2">
                      <label htmlFor="primary_color" className="text-xs font-semibold text-gray-400">
                        Primary Brand Color
                      </label>
                      <input
                        type="color"
                        id="primary_color"
                        name="primary_color"
                        defaultValue={initialData.primary_color}
                        className="w-16 h-8 rounded-md border border-white/[0.06] focus:outline-none"
                      />
                    </div>
                    {/* Secondary Color */}
                    <div className="flex flex-col space-y-2">
                      <label htmlFor="secondary_color" className="text-xs font-semibold text-gray-400">
                        Secondary Brand Color
                      </label>
                      <input
                        type="color"
                        id="secondary_color"
                        name="secondary_color"
                        defaultValue={initialData.secondary_color}
                        className="w-16 h-8 rounded-md border border-white/[0.06] focus:outline-none"
                      />
                    </div>
                    {/* Font Family */}
                    <div className="flex flex-col space-y-2">
                      <label htmlFor="font_family" className="text-xs font-semibold text-gray-400">
                        Base Font Family
                      </label>
                      <select
                        id="font_family"
                        name="font_family"
                        defaultValue={initialData.font_family}
                        className="w-full bg-black/45 border border-white/[0.06] rounded-xl px-2 py-1 text-xs text-white focus:outline-none focus:border-neon-purple/50"
                      >
                        <option value="Inter">Inter</option>
                        <option value="Outfit">Outfit</option>
                        <option value="Roboto">Roboto</option>
                        <option value="Poppins">Poppins</option>
                      </select>
                    </div>
                    {/* FAB Icon */}
                    <div className="flex flex-col space-y-2">
                      <label htmlFor="fab_icon" className="text-xs font-semibold text-gray-400">
                        FAB Icon
                      </label>
                      <select
                        id="fab_icon"
                        name="fab_icon"
                        defaultValue={initialData.fab_icon}
                        className="w-full bg-black/45 border border-white/[0.06] rounded-xl px-2 py-1 text-xs text-white focus:outline-none focus:border-neon-purple/50"
                      >
                        <option value="plus">Plus</option>
                        <option value="send">Send</option>
                        <option value="zap">Zap</option>
                        <option value="sparkles">Sparkles</option>
                        <option value="settings">Settings</option>
                      </select>
                    </div>
              </div>

              {/* Physical Location Address */}
              <div className="flex flex-col space-y-2">
                <label htmlFor="address" className="text-xs font-semibold text-gray-400">
                  Physical Office Address
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  defaultValue={initialData.address}
                  placeholder="Axis Craft Studio, Lahore, Pakistan"
                  className="w-full px-4 py-3 rounded-xl text-xs bg-black/45 border border-white/[0.06] text-white focus:outline-none focus:border-neon-blue/50 transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* WhatsApp Chat URL */}
                <div className="flex flex-col space-y-2">
                  <label htmlFor="whatsapp_url" className="text-xs font-semibold text-gray-400">
                    WhatsApp Chat URL
                  </label>
                  <input
                    type="url"
                    id="whatsapp_url"
                    name="whatsapp_url"
                    defaultValue={initialData.whatsapp_url}
                    placeholder="https://wa.me/923000000000"
                    className="w-full px-3 py-2.5 rounded-xl text-xs bg-black/45 border border-white/[0.06] text-white focus:outline-none focus:border-neon-blue/50 transition-colors"
                  />
                </div>

                {/* LinkedIn */}
                <div className="flex flex-col space-y-2">
                  <label htmlFor="linkedin_url" className="text-xs font-semibold text-gray-400">
                    LinkedIn Profile
                  </label>
                  <input
                    type="url"
                    id="linkedin_url"
                    name="linkedin_url"
                    defaultValue={initialData.linkedin_url}
                    placeholder="https://linkedin.com/in/username"
                    className="w-full px-3 py-2.5 rounded-xl text-xs bg-black/45 border border-white/[0.06] text-white focus:outline-none focus:border-neon-blue/50 transition-colors"
                  />
                </div>

                {/* GitHub */}
                <div className="flex flex-col space-y-2">
                  <label htmlFor="github_url" className="text-xs font-semibold text-gray-400">
                    GitHub URL
                  </label>
                  <input
                    type="url"
                    id="github_url"
                    name="github_url"
                    defaultValue={initialData.github_url}
                    placeholder="https://github.com/username"
                    className="w-full px-3 py-2.5 rounded-xl text-xs bg-black/45 border border-white/[0.06] text-white focus:outline-none focus:border-neon-blue/50 transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: PDF Resume & Logo uploaders (Col: 5) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Resume PDF */}
          <div className="glass-card rounded-2xl border border-white/[0.06] p-6 sm:p-8 relative overflow-hidden bg-obsidian-950/40">
            <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.005] to-white/[0.02] -z-10 rounded-2xl" />
            
            <h3 className="text-sm font-bold font-display text-white uppercase tracking-wider mb-6 flex items-center gap-2">
              <FileText className="w-4 h-4 text-neon-pink" /> Resume Document
            </h3>

            <ImageUploader
              value={resumeUrl}
              onChange={setResumeUrl}
              label="Downloadable CV PDF"
              bucket="portfolio-images"
              accept="application/pdf"
            />
          </div>

          {/* Logo Uploader */}
          <div className="glass-card rounded-2xl border border-white/[0.06] p-6 sm:p-8 relative overflow-hidden bg-obsidian-950/40">
            <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.005] to-white/[0.02] -z-10 rounded-2xl" />
            
            <h3 className="text-sm font-bold font-display text-white uppercase tracking-wider mb-6 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-neon-emerald" /> Branding Logo
            </h3>

            <ImageUploader
              value={logoUrl}
              onChange={setLogoUrl}
              label="Transparent Logo Icon"
              bucket="portfolio-images"
              accept="image/png, image/webp, image/svg+xml"
            />
          </div>

          {/* Submit */}
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
                  <span>Commit Global Credentials</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </form>
  );
}
