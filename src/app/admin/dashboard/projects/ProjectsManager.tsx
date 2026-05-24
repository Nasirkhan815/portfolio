"use client";

import { useActionState, startTransition, useState } from "react";
import { Plus, Trash2, Edit3, CheckCircle2, AlertCircle, Loader2, Sparkles, Folder, ExternalLink, Image as ImageIcon } from "lucide-react";
import ImageUploader from "@/components/admin/ImageUploader";
import Image from "next/image";
import { addProject, updateProject, deleteProject } from "./actions";

interface ProjectItem {
  id: string;
  title: string;
  category: string;
  description: string;
  tools: string[];
  image_url: string;
  case_study_url: string;
  live_url: string;
}

export default function ProjectsManager({ initialProjects }: { initialProjects: ProjectItem[] }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<ProjectItem | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);

  // States for custom category inputs
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [customCategory, setCustomCategory] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("uiux");

  const [state, formAction, isPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      formData.set("image_url", imageUrl);
      
      let res;
      if (editingItem) {
        formData.set("id", editingItem.id);
        res = await updateProject(prevState, formData);
      } else {
        res = await addProject(prevState, formData);
      }

      if (res.success) {
        setShowAddForm(false);
        setImageUrl("");
        setEditingItem(null);
        setIsCustomCategory(false);
        setCustomCategory("");
        setSelectedCategory("uiux");
      }
      return res;
    },
    { success: false, error: "" }
  );

  const handleAddSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    if (isCustomCategory) {
      formData.set("category", customCategory);
    }
    startTransition(() => {
      formAction(formData);
    });
  };

  const handleEditInit = (proj: ProjectItem) => {
    setEditingItem(proj);
    setImageUrl(proj.image_url || "");
    
    const standardCategories = ["uiux", "web", "graphics"];
    if (!standardCategories.includes(proj.category)) {
      setIsCustomCategory(true);
      setCustomCategory(proj.category);
      setSelectedCategory("custom");
    } else {
      setIsCustomCategory(false);
      setCustomCategory("");
      setSelectedCategory(proj.category);
    }

    setShowAddForm(true);
    // Smooth scroll up to form
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
    setImageUrl("");
    setIsCustomCategory(false);
    setCustomCategory("");
    setSelectedCategory("uiux");
    setShowAddForm(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to permanently delete this project from your portfolio?")) {
      setIsDeletingId(id);
      try {
        await deleteProject(id);
      } catch (err) {
        console.error(err);
      } finally {
        setIsDeletingId(null);
      }
    }
  };

  const categoryNames: Record<string, string> = {
    uiux: "UI/UX & Mobile",
    web: "Web & E-Commerce",
    graphics: "Graphics & Branding"
  };

  return (
    <div className="space-y-6 max-w-5xl text-left">
      {/* Banner status notifications */}
      {state.success && (
        <div className="p-4 rounded-xl bg-neon-emerald/10 border border-neon-emerald/20 flex items-center gap-3 text-neon-emerald text-xs font-semibold">
          <CheckCircle2 className="w-5 h-5" />
          <span>Portfolio catalog committed successfully! Landing page revalidated.</span>
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
          Portfolio Items ({initialProjects.length})
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
          <span>{showAddForm ? "Close Panel" : "Publish Project"}</span>
        </button>
      </div>

      {/* Collapsible publish form card */}
      {showAddForm && (
        <div className="glass-card rounded-2xl border border-neon-purple/20 bg-obsidian-950/40 p-6 sm:p-8 relative overflow-hidden animate-slide-down">
          <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.005] to-white/[0.02] -z-10 rounded-2xl" />
          
          <h4 className="text-xs font-black text-neon-purple uppercase tracking-widest mb-6 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5" />
            {editingItem ? "Refine Visual Masterpiece Details" : "Deploy New Visual Masterpiece"}
          </h4>

          <form 
            key={editingItem ? `edit-${editingItem.id}` : "new-project"}
            onSubmit={handleAddSubmit} 
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* Left Column: Form Details (Col: 7) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Title */}
                <div className="flex flex-col space-y-2">
                  <label htmlFor="title" className="text-[10px] font-semibold text-gray-400">
                    Project Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    required
                    defaultValue={editingItem?.title || ""}
                    placeholder="e.g. Laundry App UI Design"
                    className="w-full px-3 py-2 rounded-xl text-xs bg-black/45 border border-white/[0.06] text-white focus:outline-none focus:border-neon-purple/50 transition-colors"
                  />
                </div>

                {/* Category Selector */}
                <div className="flex flex-col space-y-2">
                  <label htmlFor="category" className="text-[10px] font-semibold text-gray-400">
                    Design Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    required
                    value={isCustomCategory ? "custom" : selectedCategory}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === "custom") {
                        setIsCustomCategory(true);
                      } else {
                        setIsCustomCategory(false);
                        setSelectedCategory(val);
                      }
                    }}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-black/45 border border-white/[0.06] text-white focus:outline-none focus:border-neon-purple/50 transition-colors cursor-pointer"
                  >
                    <option value="uiux">UI/UX & Mobile</option>
                    <option value="web">Web & E-Commerce</option>
                    <option value="graphics">Graphics & Branding</option>
                    <option value="custom">Other / Custom Category...</option>
                  </select>

                  {isCustomCategory && (
                    <div className="flex flex-col space-y-1.5 mt-1 animate-slide-down">
                      <label htmlFor="custom_category" className="text-[9px] font-semibold text-neon-purple flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-neon-purple" />
                        Enter Custom Category Name
                      </label>
                      <input
                        type="text"
                        id="custom_category"
                        name="custom_category"
                        required
                        value={customCategory}
                        onChange={(e) => setCustomCategory(e.target.value)}
                        placeholder="e.g. 3D Rendering, Illustration, VR Design"
                        className="w-full px-3 py-2 rounded-xl text-xs bg-black/45 border border-neon-purple/30 text-white focus:outline-none focus:border-neon-purple/50 transition-colors"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Tools chips input */}
              <div className="flex flex-col space-y-2">
                <label htmlFor="tools" className="text-[10px] font-semibold text-gray-400">
                  Tech / Tools Used (Comma separated)
                </label>
                <input
                  type="text"
                  id="tools"
                  name="tools"
                  defaultValue={editingItem?.tools?.join(", ") || ""}
                  placeholder="e.g. Figma, Next.js, Framer Motion, Tailwind CSS"
                  className="w-full px-3 py-2.5 rounded-xl text-xs bg-black/45 border border-white/[0.06] text-white focus:outline-none focus:border-neon-purple/50 transition-colors"
                />
                <span className="text-[9px] text-gray-600 font-mono">
                  Separate distinct tools or technologies with a comma. They will appear as chips on your card.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Case study link */}
                <div className="flex flex-col space-y-2">
                  <label htmlFor="case_study_url" className="text-[10px] font-semibold text-gray-400">
                    Case Study URL
                  </label>
                  <input
                    type="url"
                    id="case_study_url"
                    name="case_study_url"
                    defaultValue={editingItem?.case_study_url || ""}
                    placeholder="https://artixor.com/case-study"
                    className="w-full px-3 py-2 rounded-xl text-xs bg-black/45 border border-white/[0.06] text-white focus:outline-none focus:border-neon-purple/50 transition-colors"
                  />
                </div>

                {/* Live Link */}
                <div className="flex flex-col space-y-2">
                  <label htmlFor="live_url" className="text-[10px] font-semibold text-gray-400">
                    Live Demo Link
                  </label>
                  <input
                    type="url"
                    id="live_url"
                    name="live_url"
                    defaultValue={editingItem?.live_url || ""}
                    placeholder="https://artixor.com/demo"
                    className="w-full px-3 py-2 rounded-xl text-xs bg-black/45 border border-white/[0.06] text-white focus:outline-none focus:border-neon-purple/50 transition-colors"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="flex flex-col space-y-2">
                <label htmlFor="description" className="text-[10px] font-semibold text-gray-400">
                  Project Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  defaultValue={editingItem?.description || ""}
                  placeholder="Crafting beautiful high-fidelity component layouts, interactive micro-animations..."
                  className="w-full px-3 py-2 rounded-xl text-xs bg-black/45 border border-white/[0.06] text-white focus:outline-none focus:border-neon-purple/50 resize-none transition-colors"
                />
              </div>
            </div>

            {/* Right Column: Image Uploader & Submit (Col: 5) */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
              <ImageUploader
                value={imageUrl}
                onChange={setImageUrl}
                label="Project Thumbnail Mockup"
                bucket="portfolio-images"
                accept="image/*"
              />

              <div className="flex items-center gap-3">
                {editingItem && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="flex-1 py-4 rounded-xl border border-white/[0.08] hover:bg-white/[0.05] text-white font-bold transition-all cursor-pointer text-xs"
                  >
                    Cancel
                  </button>
                )}
                
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex-2 py-4 rounded-xl bg-gradient-to-r from-neon-purple to-neon-pink text-neutral-950 font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-neon-purple/20 hover:shadow-neon-purple/40 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 transition-all cursor-pointer text-xs"
                >
                  {isPending ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>{editingItem ? "Commit Updates" : "Publish to Studio"}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Projects dynamic table list */}
      {initialProjects.length === 0 ? (
        <div className="py-20 border border-dashed border-white/[0.06] rounded-2xl flex flex-col items-center justify-center text-center p-6 bg-black/10">
          <Folder className="w-10 h-10 text-gray-600 mb-4 animate-pulse" />
          <span className="text-xs font-bold text-gray-400">No project items found</span>
          <p className="text-[10px] text-gray-500 max-w-[240px] mt-1 leading-relaxed">
            Click the "Publish Project" button above to upload thumbnails and deploy works to your landing page.
          </p>
        </div>
      ) : (
        <div className="glass-card rounded-2xl border border-white/[0.06] overflow-hidden bg-obsidian-950/15">
          <div className="overflow-x-auto w-full">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-white/[0.06] bg-white/[0.01]">
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Preview</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Tools & Tags</th>
                  <th className="px-6 py-4 text-right text-[10px] font-bold text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {initialProjects.map((proj) => (
                  <tr key={proj.id} className="hover:bg-white/[0.005] transition-colors group">
                    {/* Thumbnail */}
                    <td className="px-6 py-4">
                      <div className="relative w-16 h-10 rounded-lg border border-white/[0.06] bg-black/35 overflow-hidden flex items-center justify-center">
                        {proj.image_url ? (
                          <Image
                            src={proj.image_url}
                            alt={proj.title}
                            fill
                            sizes="64px"
                            className="object-cover"
                            unoptimized
                          />
                        ) : (
                          <ImageIcon className="w-4 h-4 text-gray-600" />
                        )}
                      </div>
                    </td>

                    {/* Title & description link overlays */}
                    <td className="px-6 py-4 max-w-[200px]">
                      <div className="text-xs font-bold text-white truncate">{proj.title}</div>
                      <div className="flex items-center gap-2.5 mt-1">
                        {proj.case_study_url && (
                          <a href={proj.case_study_url} target="_blank" rel="noreferrer" className="text-[9px] text-gray-500 hover:text-neon-purple flex items-center gap-0.5">
                            CS <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                        {proj.live_url && (
                          <a href={proj.live_url} target="_blank" rel="noreferrer" className="text-[9px] text-gray-500 hover:text-neon-blue flex items-center gap-0.5">
                            Live <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-6 py-4 text-xs font-semibold text-gray-300">
                      <span className="px-2.5 py-0.75 rounded-md text-[9px] font-bold text-gray-400 bg-white/[0.02] border border-white/[0.04]">
                        {categoryNames[proj.category] || proj.category}
                      </span>
                    </td>

                    {/* Tools Chips */}
                    <td className="px-6 py-4 max-w-[200px]">
                      <div className="flex flex-wrap gap-1">
                        {proj.tools?.slice(0, 3).map((tool) => (
                          <span key={tool} className="px-1.5 py-0.5 rounded text-[8.5px] font-bold text-gray-500 bg-white/[0.01] border border-white/[0.04]">
                            {tool}
                          </span>
                        ))}
                        {proj.tools?.length > 3 && (
                          <span className="text-[8px] font-bold text-gray-600 px-1">
                            +{proj.tools.length - 3} more
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleEditInit(proj)}
                          className="p-2 rounded-lg border border-transparent hover:border-neon-purple/20 text-gray-500 hover:text-neon-purple hover:bg-neon-purple/10 transition-all cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(proj.id)}
                          disabled={isDeletingId === proj.id}
                          className="p-2 rounded-lg border border-transparent hover:border-red-500/20 text-gray-500 hover:text-red-400 hover:bg-red-950/10 transition-all cursor-pointer disabled:opacity-40"
                        >
                          {isDeletingId === proj.id ? (
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
