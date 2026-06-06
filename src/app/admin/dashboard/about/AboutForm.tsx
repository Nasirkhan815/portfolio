"use client";

import { useActionState, startTransition } from "react";
import { Terminal, Save, CheckCircle2, AlertCircle, Loader2, Sparkles, Award } from "lucide-react";
import { updateAbout } from "./actions";

interface StatItem {
  value: string;
  label: string;
  desc: string;
  color?: string;
  icon?: string;
}

interface AboutData {
  section_heading?: string;
  title: string;
  subtitle: string;
  paragraphs: string[];
  stats: StatItem[];
}

export default function AboutForm({ initialData }: { initialData: AboutData }) {
  const [state, formAction, isPending] = useActionState(updateAbout, {
    success: false,
    error: ""
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(() => {
      formAction(formData);
    });
  };

  const statColors = ["text-neon-purple", "text-neon-pink", "text-neon-blue", "text-neon-emerald"];

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl text-left">
      {/* Notifications */}
      {state.success && (
        <div className="p-4 rounded-xl bg-neon-emerald/10 border border-neon-emerald/20 flex items-center gap-3 text-neon-emerald text-xs font-semibold">
          <CheckCircle2 className="w-5 h-5" />
          <span>About section updated successfully! Frontend layouts revalidated.</span>
        </div>
      )}

      {state.error && (
        <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/20 flex items-center gap-3 text-red-400 text-xs font-semibold">
          <AlertCircle className="w-5 h-5" />
          <span>⚠️ {state.error}</span>
        </div>
      )}

      {/* Narrative Card */}
      <div className="glass-card rounded-2xl border border-white/[0.06] p-6 sm:p-8 relative overflow-hidden bg-obsidian-950/40">
        <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.005] to-white/[0.02] -z-10 rounded-2xl" />
        
        <h3 className="text-sm font-bold font-display text-white uppercase tracking-wider mb-6 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-neon-purple" /> Philosophy & Narrative Story
        </h3>

        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Subtitle */}
            <div className="flex flex-col space-y-2">
              <label htmlFor="subtitle" className="text-xs font-semibold text-gray-400">
                Philosophy Subtitle
              </label>
              <input
                type="text"
                id="subtitle"
                name="subtitle"
                defaultValue={initialData.subtitle}
                placeholder="Visual Architect"
                className="w-full px-4 py-3 rounded-xl text-xs bg-black/45 border border-white/[0.06] text-white focus:outline-none focus:border-neon-purple/50 transition-colors"
              />
            </div>

            {/* Title */}
            <div className="flex flex-col space-y-2">
              <label htmlFor="title" className="text-xs font-semibold text-gray-400">
                Story Header Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                defaultValue={initialData.title}
                placeholder="Bridging Artistic CGI Expression..."
                className="w-full px-4 py-3 rounded-xl text-xs bg-black/45 border border-white/[0.06] text-white focus:outline-none focus:border-neon-purple/50 transition-colors"
              />
            </div>
          </div>

          {/* Main Heading */}
          <div className="flex flex-col space-y-2">
            <label htmlFor="section_heading" className="text-xs font-semibold text-gray-400">
              Main Heading
            </label>
            <input
              type="text"
              id="section_heading"
              name="section_heading"
              defaultValue={initialData.section_heading || ""}
              placeholder="Creative Story & Branding Philosophy"
              className="w-full px-4 py-3 rounded-xl text-xs bg-black/45 border border-white/[0.06] text-white focus:outline-none focus:border-neon-purple/50 transition-colors"
            />
          </div>

          {/* Paragraph 1 */}
          <div className="flex flex-col space-y-2">
            <label htmlFor="paragraph_1" className="text-xs font-semibold text-gray-400">
              Biography Paragraph 1
            </label>
            <textarea
              id="paragraph_1"
              name="paragraph_1"
              rows={3}
              defaultValue={initialData.paragraphs[0] || ""}
              placeholder="Hi, I'm Nasir Khan. Over the past 10 years..."
              className="w-full px-4 py-3 rounded-xl text-xs bg-black/45 border border-white/[0.06] text-white focus:outline-none focus:border-neon-purple/50 resize-none transition-colors"
            />
          </div>

          {/* Paragraph 2 */}
          <div className="flex flex-col space-y-2">
            <label htmlFor="paragraph_2" className="text-xs font-semibold text-gray-400">
              Biography Paragraph 2
            </label>
            <textarea
              id="paragraph_2"
              name="paragraph_2"
              rows={3}
              defaultValue={initialData.paragraphs[1] || ""}
              placeholder="My creative philosophy relies on two cores..."
              className="w-full px-4 py-3 rounded-xl text-xs bg-black/45 border border-white/[0.06] text-white focus:outline-none focus:border-neon-purple/50 resize-none transition-colors"
            />
          </div>

          {/* Paragraph 3 */}
          <div className="flex flex-col space-y-2">
            <label htmlFor="paragraph_3" className="text-xs font-semibold text-gray-400">
              Biography Paragraph 3 (Optional)
            </label>
            <textarea
              id="paragraph_3"
              name="paragraph_3"
              rows={3}
              defaultValue={initialData.paragraphs[2] || ""}
              placeholder="From formulating extensive typography guides and interactive design systems..."
              className="w-full px-4 py-3 rounded-xl text-xs bg-black/45 border border-white/[0.06] text-white focus:outline-none focus:border-neon-purple/50 resize-none transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Metrics Stats Section */}
      <div className="glass-card rounded-2xl border border-white/[0.06] p-6 sm:p-8 relative overflow-hidden bg-obsidian-950/40">
        <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.005] to-white/[0.02] -z-10 rounded-2xl" />
        
        <h3 className="text-sm font-bold font-display text-white uppercase tracking-wider mb-6 flex items-center gap-2">
          <Award className="w-4 h-4 text-neon-pink" /> 2x2 Stats Grid Metrics
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, index) => {
            const stat = initialData.stats?.[index] || { value: "", label: "", desc: "" };
            return (
              <div 
                key={index} 
                className="p-5 rounded-2xl border border-white/[0.04] bg-white/[0.01] hover:border-white/[0.08] transition-colors space-y-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${statColors[index].replace("text-", "bg-")}`} />
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest font-mono">
                    Stat Card #{index + 1}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Stat Value */}
                  <div className="flex flex-col space-y-1.5">
                    <label htmlFor={`stat_${index}_value`} className="text-[10px] font-semibold text-gray-400">
                      Display Value
                    </label>
                    <input
                      type="text"
                      id={`stat_${index}_value`}
                      name={`stat_${index}_value`}
                      defaultValue={stat.value}
                      placeholder={index === 0 ? "10+" : index === 1 ? "150+" : "99%"}
                      className="w-full px-3 py-2 rounded-xl text-xs bg-black/45 border border-white/[0.06] text-white focus:outline-none focus:border-neon-purple/50 transition-colors"
                    />
                  </div>

                  {/* Stat Label */}
                  <div className="flex flex-col space-y-1.5">
                    <label htmlFor={`stat_${index}_label`} className="text-[10px] font-semibold text-gray-400">
                      Metric Label
                    </label>
                    <input
                      type="text"
                      id={`stat_${index}_label`}
                      name={`stat_${index}_label`}
                      defaultValue={stat.label}
                      placeholder={index === 0 ? "Years Experience" : "Client Satisfaction"}
                      className="w-full px-3 py-2 rounded-xl text-xs bg-black/45 border border-white/[0.06] text-white focus:outline-none focus:border-neon-purple/50 transition-colors"
                    />
                  </div>
                </div>

                {/* Stat Description */}
                <div className="flex flex-col space-y-1.5">
                  <label htmlFor={`stat_${index}_desc`} className="text-[10px] font-semibold text-gray-400">
                    Brief Summary
                  </label>
                  <input
                    type="text"
                    id={`stat_${index}_desc`}
                    name={`stat_${index}_desc`}
                    defaultValue={stat.desc}
                    placeholder="Brief explanation of the metric..."
                    className="w-full px-3 py-2 rounded-xl text-xs bg-black/45 border border-white/[0.06] text-white focus:outline-none focus:border-neon-purple/50 transition-colors"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end max-w-4xl">
        <button
          type="submit"
          disabled={isPending}
          className="px-8 py-4 rounded-xl bg-gradient-to-r from-neon-purple to-neon-pink text-neutral-950 font-bold flex items-center justify-center gap-2 shadow-lg shadow-neon-purple/20 hover:shadow-neon-purple/40 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 transition-all cursor-pointer"
        >
          {isPending ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save About Section Changes</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
