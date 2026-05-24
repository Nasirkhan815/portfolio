"use client";

import { useActionState, startTransition, useState } from "react";
import { Plus, Trash2, Edit3, CheckCircle2, AlertCircle, Loader2, Sparkles, Command, Briefcase, Eye } from "lucide-react";
import { addService, updateService, deleteService } from "./actions";

interface ServiceItem {
  id: string;
  title: string;
  description: string;
  features: string[];
  icon: string;
  glow_color: string;
}

export default function ServicesManager({ initialServices }: { initialServices: ServiceItem[] }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<ServiceItem | null>(null);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);

  const [state, formAction, isPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      let res;
      if (editingItem) {
        formData.set("id", editingItem.id);
        res = await updateService(prevState, formData);
      } else {
        res = await addService(prevState, formData);
      }

      if (res.success) {
        setShowAddForm(false);
        setEditingItem(null);
      }
      return res;
    },
    { success: false, error: "" }
  );

  const handleAddSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(() => {
      formAction(formData);
    });
  };

  const handleEditInit = (service: ServiceItem) => {
    setEditingItem(service);
    setShowAddForm(true);
    // Smooth scroll up to form
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
    setShowAddForm(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this service entry?")) {
      setIsDeletingId(id);
      try {
        await deleteService(id);
      } catch (err) {
        console.error(err);
      } finally {
        setIsDeletingId(null);
      }
    }
  };

  const getThemeValue = (service: ServiceItem) => {
    if (service.glow_color?.includes("rgba(6,182,212")) return "blue"; // Cyan theme
    if (service.glow_color?.includes("rgba(236,72,153")) return "pink"; // Pink theme
    return "purple"; // default Purple theme
  };

  const themeDisplayNames: Record<string, string> = {
    "group-hover:shadow-[0_0_50px_-12px_rgba(139,92,246,0.3)] group-hover:border-neon-purple/40": "Purple (UI/UX - Layout)",
    "group-hover:shadow-[0_0_50px_-12px_rgba(6,182,212,0.3)] group-hover:border-neon-blue/40": "Cyan (CGI - Palette)",
    "group-hover:shadow-[0_0_50px_-12px_rgba(236,72,153,0.3)] group-hover:border-neon-pink/40": "Pink (Branding - Sparkles)"
  };

  return (
    <div className="space-y-6 max-w-5xl text-left">
      {/* Banner statuses */}
      {state.success && (
        <div className="p-4 rounded-xl bg-neon-emerald/10 border border-neon-emerald/20 flex items-center gap-3 text-neon-emerald text-xs font-semibold">
          <CheckCircle2 className="w-5 h-5" />
          <span>Services updated successfully! Landing page revalidated.</span>
        </div>
      )}

      {state.error && (
        <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/20 flex items-center gap-3 text-red-400 text-xs font-semibold">
          <AlertCircle className="w-5 h-5" />
          <span>⚠️ {state.error}</span>
        </div>
      )}

      {/* Header and Toggle */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold font-display text-white uppercase tracking-wider">
          Professional Services ({initialServices.length})
        </h3>
        <button
          onClick={() => {
            if (showAddForm) {
              handleCancelEdit();
            } else {
              setShowAddForm(true);
            }
          }}
          className="px-4 py-2 rounded-xl text-xs font-bold bg-white/[0.03] hover:bg-white/[0.08] text-white border border-white/[0.06] flex items-center gap-2 transition-all cursor-pointer animate-pulse duration-[4000ms]"
        >
          <Plus className={`w-4 h-4 transition-transform duration-300 ${showAddForm ? "rotate-45 text-red-400" : ""}`} />
          <span>{showAddForm ? "Close Panel" : "Add Service"}</span>
        </button>
      </div>

      {/* Collapsible form card */}
      {showAddForm && (
        <div className="glass-card rounded-2xl border border-neon-purple/20 bg-obsidian-950/40 p-6 relative overflow-hidden animate-slide-down">
          <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.005] to-white/[0.02] -z-10 rounded-2xl" />
          
          <h4 className="text-xs font-black text-neon-purple uppercase tracking-widest mb-4 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5" />
            {editingItem ? "Refine Studio Service Settings" : "Initialize New Studio Service"}
          </h4>

          <form 
            key={editingItem ? `edit-${editingItem.id}` : "new-service"}
            onSubmit={handleAddSubmit} 
            className="space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Title */}
              <div className="flex flex-col space-y-2">
                <label htmlFor="title" className="text-[10px] font-semibold text-gray-400">
                  Service Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  defaultValue={editingItem?.title || ""}
                  placeholder="e.g. 3D CGI & Cinematic Art"
                  className="w-full px-3 py-2 rounded-xl text-xs bg-black/45 border border-white/[0.06] text-white focus:outline-none focus:border-neon-purple/50 transition-colors"
                />
              </div>

              {/* Theme Selector */}
              <div className="flex flex-col space-y-2">
                <label htmlFor="theme" className="text-[10px] font-semibold text-gray-400">
                  Color & Icon Template
                </label>
                <select
                  id="theme"
                  name="theme"
                  required
                  defaultValue={editingItem ? getThemeValue(editingItem) : "purple"}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-black/45 border border-white/[0.06] text-white focus:outline-none focus:border-neon-purple/50 transition-colors cursor-pointer"
                >
                  <option value="purple">Purple Theme (Layout / UI/UX)</option>
                  <option value="blue">Cyan Theme (Palette / 3D CGI)</option>
                  <option value="pink">Pink Theme (Sparkles / Branding)</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div className="flex flex-col space-y-2">
              <label htmlFor="description" className="text-[10px] font-semibold text-gray-400">
                Service Description Summary
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={3}
                defaultValue={editingItem?.description || ""}
                placeholder="Crafting beautiful high-fidelity component layouts, interactive micro-animations..."
                className="w-full px-3 py-2 rounded-xl text-xs bg-black/45 border border-white/[0.06] text-white focus:outline-none focus:border-neon-purple/50 resize-none transition-colors"
              />
            </div>

            {/* Features (One per line) */}
            <div className="flex flex-col space-y-2">
              <label htmlFor="features" className="text-[10px] font-semibold text-gray-400">
                Service Features Bullets (One per line)
              </label>
              <textarea
                id="features"
                name="features"
                required
                rows={4}
                defaultValue={editingItem?.features?.join("\n") || ""}
                placeholder="Figma & FigJam Prototyping&#10;Design System Development&#10;User Flows & Wireframing"
                className="w-full px-3 py-2 rounded-xl text-xs bg-black/45 border border-white/[0.06] text-white focus:outline-none focus:border-neon-purple/50 resize-none transition-colors"
              />
              <span className="text-[9px] text-gray-600 font-mono">
                Press Enter to list each feature on a new line. They will render as a bullet list.
              </span>
            </div>

            {/* Submit */}
            <div className="flex justify-end items-center gap-3 pt-2">
              {editingItem && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-6 py-2.5 rounded-xl border border-white/[0.08] hover:bg-white/[0.05] text-white font-bold transition-all cursor-pointer text-xs"
                >
                  Cancel
                </button>
              )}
              
              <button
                type="submit"
                disabled={isPending}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-neon-purple to-neon-pink text-neutral-950 font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-neon-purple/20 hover:shadow-neon-purple/40 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 transition-all cursor-pointer text-xs"
              >
                {isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Sparkles className="w-4.5 h-4.5" />
                    <span>{editingItem ? "Commit Updates" : "Deploy Service"}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Services List table */}
      {initialServices.length === 0 ? (
        <div className="py-20 border border-dashed border-white/[0.06] rounded-2xl flex flex-col items-center justify-center text-center p-6 bg-black/10">
          <Briefcase className="w-10 h-10 text-gray-600 mb-4 animate-pulse" />
          <span className="text-xs font-bold text-gray-400">No services in database</span>
          <p className="text-[10px] text-gray-500 max-w-[240px] mt-1 leading-relaxed">
            Click the "Add Service" button above to populate your professional capabilities.
          </p>
        </div>
      ) : (
        <div className="glass-card rounded-2xl border border-white/[0.06] overflow-hidden bg-obsidian-950/15">
          <div className="overflow-x-auto w-full">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-white/[0.06] bg-white/[0.01]">
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Icon</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Service Title</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Theme / Glow</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Bullet Features</th>
                  <th className="px-6 py-4 text-right text-[10px] font-bold text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {initialServices.map((service) => (
                  <tr key={service.id} className="hover:bg-white/[0.005] transition-colors group">
                    {/* Icon */}
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold text-neon-purple bg-neon-purple/10 border border-neon-purple/20">
                        {service.icon}
                      </span>
                    </td>

                    {/* Title & Description */}
                    <td className="px-6 py-4 max-w-[200px]">
                      <div className="text-xs font-bold text-white truncate">{service.title}</div>
                      <div className="text-[10px] text-gray-500 truncate mt-0.5">{service.description}</div>
                    </td>

                    {/* Theme */}
                    <td className="px-6 py-4 text-[10px] text-gray-400 font-light max-w-[150px] truncate">
                      {themeDisplayNames[service.glow_color] || "Custom Accent"}
                    </td>

                    {/* Features list */}
                    <td className="px-6 py-4 max-w-[200px]">
                      <div className="flex flex-col gap-0.5">
                        {service.features?.slice(0, 2).map((feat) => (
                          <div key={feat} className="text-[9.5px] text-gray-400 truncate flex items-center gap-1">
                            <span className="w-1 h-1 rounded-full bg-neon-purple" />
                            {feat}
                          </div>
                        ))}
                        {service.features?.length > 2 && (
                          <span className="text-[8px] font-bold text-gray-600 px-2 mt-0.5">
                            +{service.features.length - 2} more features
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleEditInit(service)}
                          className="p-2 rounded-lg border border-transparent hover:border-neon-purple/20 text-gray-500 hover:text-neon-purple hover:bg-neon-purple/10 transition-all cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(service.id)}
                          disabled={isDeletingId === service.id}
                          className="p-2 rounded-lg border border-transparent hover:border-red-500/20 text-gray-500 hover:text-red-400 hover:bg-red-950/10 transition-all cursor-pointer disabled:opacity-40"
                        >
                          {isDeletingId === service.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
