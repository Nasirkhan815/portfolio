"use client";

import { useActionState, startTransition, useState } from "react";
import { Plus, Trash2, Edit3, CheckCircle2, AlertCircle, Loader2, Sparkles, Command } from "lucide-react";
import { addSkill, updateSkill, deleteSkill } from "./actions";

interface SkillItem {
  id: string;
  name: string;
  category: string;
  level: string;
  description: string;
  glow?: string;
  icon_bg?: string;
  tag_color?: string;
}

export default function SkillsManager({ initialSkills }: { initialSkills: SkillItem[] }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<SkillItem | null>(null);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);

  // States for custom category and custom level inputs
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [customCategory, setCustomCategory] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("design");

  const [isCustomLevel, setIsCustomLevel] = useState(false);
  const [customLevel, setCustomLevel] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("Master");

  const [state, formAction, isPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      let res;
      if (editingItem) {
        formData.set("id", editingItem.id);
        res = await updateSkill(prevState, formData);
      } else {
        res = await addSkill(prevState, formData);
      }

      if (res.success) {
        setShowAddForm(false);
        setEditingItem(null);
        setIsCustomCategory(false);
        setCustomCategory("");
        setSelectedCategory("design");
        setIsCustomLevel(false);
        setCustomLevel("");
        setSelectedLevel("Master");
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
    if (isCustomLevel) {
      formData.set("level", customLevel);
    }
    startTransition(() => {
      formAction(formData);
    });
  };

  const handleEditInit = (skill: SkillItem) => {
    setEditingItem(skill);
    
    // Category check
    const standardCategories = ["design", "cgi", "web", "collab"];
    if (!standardCategories.includes(skill.category)) {
      setIsCustomCategory(true);
      setCustomCategory(skill.category);
      setSelectedCategory("custom");
    } else {
      setIsCustomCategory(false);
      setCustomCategory("");
      setSelectedCategory(skill.category);
    }

    // Level check
    const standardLevels = ["Master", "Expert", "Advanced", "Fluent"];
    if (!standardLevels.includes(skill.level)) {
      setIsCustomLevel(true);
      setCustomLevel(skill.level);
      setSelectedLevel("custom");
    } else {
      setIsCustomLevel(false);
      setCustomLevel("");
      setSelectedLevel(skill.level);
    }

    setShowAddForm(true);
    // Smooth scroll up to form
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
    setIsCustomCategory(false);
    setCustomCategory("");
    setSelectedCategory("design");
    setIsCustomLevel(false);
    setCustomLevel("");
    setSelectedLevel("Master");
    setShowAddForm(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to remove this capability from your stack?")) {
      setIsDeletingId(id);
      try {
        await deleteSkill(id);
      } catch (err) {
        console.error(err);
      } finally {
        setIsDeletingId(null);
      }
    }
  };

  // Helper to reverse map tags to the form option names
  const getThemeValue = (skill: SkillItem) => {
    if (skill.glow?.includes("#0ACF83")) return "green";
    if (skill.glow?.includes("#31A8FF")) return "blue";
    if (skill.glow?.includes("#FF26BE")) return "pink";
    if (skill.glow?.includes("#EA7600")) return "orange";
    if (skill.glow?.includes("white/20")) return "white";
    return "purple"; // default
  };

  const categoriesMap: Record<string, string> = {
    design: "UI/UX & Graphics",
    cgi: "3D & Motion",
    web: "Web Layouts",
    collab: "Collaboration"
  };

  return (
    <div className="space-y-6 max-w-5xl text-left">
      
      {/* Save Success / Error banners */}
      {state.success && (
        <div className="p-4 rounded-xl bg-neon-emerald/10 border border-neon-emerald/20 flex items-center gap-3 text-neon-emerald text-xs font-semibold">
          <CheckCircle2 className="w-5 h-5" />
          <span>Capability matrices updated successfully! Landing stack revalidated.</span>
        </div>
      )}

      {state.error && (
        <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/20 flex items-center gap-3 text-red-400 text-xs font-semibold">
          <AlertCircle className="w-5 h-5" />
          <span>⚠️ {state.error}</span>
        </div>
      )}

      {/* Header and Add Toggle */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold font-display text-white uppercase tracking-wider">
          Core Capability Matrices ({initialSkills.length})
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
          <span>{showAddForm ? "Close Panel" : "Add New Skill"}</span>
        </button>
      </div>

      {/* Add Skill Form Collapsible */}
      {showAddForm && (
        <div className="glass-card rounded-2xl border border-neon-purple/20 bg-obsidian-950/40 p-6 relative overflow-hidden animate-slide-down">
          <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.005] to-white/[0.02] -z-10 rounded-2xl" />
          
          <h4 className="text-xs font-black text-neon-purple uppercase tracking-widest mb-4 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5" />
            {editingItem ? "Refine Stack Capability Settings" : "Initialize New Stack Capability"}
          </h4>

          <form 
            key={editingItem ? `edit-${editingItem.id}` : "new-skill"}
            onSubmit={handleAddSubmit} 
            className="grid grid-cols-1 md:grid-cols-12 gap-5"
          >
            {/* Skill Name */}
            <div className="md:col-span-3 flex flex-col space-y-2">
              <label htmlFor="name" className="text-[10px] font-semibold text-gray-400">
                Skill Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                defaultValue={editingItem?.name || ""}
                placeholder="e.g. Figma, Next.js"
                className="w-full px-3 py-2 rounded-xl text-xs bg-black/45 border border-white/[0.06] text-white focus:outline-none focus:border-neon-purple/50 transition-colors"
              />
            </div>

            {/* Category Select */}
            <div className="md:col-span-3 flex flex-col space-y-2">
              <label htmlFor="category" className="text-[10px] font-semibold text-gray-400">
                Stack Category
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
                <option value="design">UI/UX & Graphics</option>
                <option value="cgi">3D & Motion</option>
                <option value="web">Web Layouts</option>
                <option value="collab">Collaboration</option>
                <option value="custom">Other / Custom Category...</option>
              </select>

              {isCustomCategory && (
                <div className="flex flex-col space-y-1 mt-1 animate-slide-down">
                  <label htmlFor="custom_category" className="text-[9px] font-semibold text-neon-purple flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-neon-purple" />
                    Custom Category
                  </label>
                  <input
                    type="text"
                    id="custom_category"
                    name="custom_category"
                    required
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    placeholder="e.g. AI & Automation"
                    className="w-full px-3 py-1.5 rounded-xl text-xs bg-black/45 border border-neon-purple/30 text-white focus:outline-none focus:border-neon-purple/50 transition-colors"
                  />
                </div>
              )}
            </div>

            {/* Mastery Level */}
            <div className="md:col-span-3 flex flex-col space-y-2">
              <label htmlFor="level" className="text-[10px] font-semibold text-gray-400">
                Mastery Level
              </label>
              <select
                id="level"
                name="level"
                required
                value={isCustomLevel ? "custom" : selectedLevel}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "custom") {
                    setIsCustomLevel(true);
                  } else {
                    setIsCustomLevel(false);
                    setSelectedLevel(val);
                  }
                }}
                className="w-full px-3 py-2 rounded-xl text-xs bg-black/45 border border-white/[0.06] text-white focus:outline-none focus:border-neon-purple/50 transition-colors cursor-pointer"
              >
                <option value="Master">Master</option>
                <option value="Expert">Expert</option>
                <option value="Advanced">Advanced</option>
                <option value="Fluent">Fluent</option>
                <option value="custom">Other / Custom Level...</option>
              </select>

              {isCustomLevel && (
                <div className="flex flex-col space-y-1 mt-1 animate-slide-down">
                  <label htmlFor="custom_level" className="text-[9px] font-semibold text-neon-purple flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-neon-purple" />
                    Custom Mastery Level
                  </label>
                  <input
                    type="text"
                    id="custom_level"
                    name="custom_level"
                    required
                    value={customLevel}
                    onChange={(e) => setCustomLevel(e.target.value)}
                    placeholder="e.g. Professional, Specialist"
                    className="w-full px-3 py-1.5 rounded-xl text-xs bg-black/45 border border-neon-purple/30 text-white focus:outline-none focus:border-neon-purple/50 transition-colors"
                  />
                </div>
              )}
            </div>

            {/* Color Theme Selector */}
            <div className="md:col-span-3 flex flex-col space-y-2">
              <label htmlFor="theme" className="text-[10px] font-semibold text-gray-400">
                Aesthetic Color Theme
              </label>
              <select
                id="theme"
                name="theme"
                required
                defaultValue={editingItem ? getThemeValue(editingItem) : "purple"}
                className="w-full px-3 py-2 rounded-xl text-xs bg-black/45 border border-white/[0.06] text-white focus:outline-none focus:border-neon-purple/50 transition-colors cursor-pointer"
              >
                <option value="purple">Purple Theme (Next.js/Default)</option>
                <option value="green">Green Theme (Figma)</option>
                <option value="blue">Blue Theme (Photoshop/CGI)</option>
                <option value="pink">Pink Theme (Illustrator)</option>
                <option value="orange">Orange Theme (Blender)</option>
                <option value="white">White Theme (Minimalist)</option>
              </select>
            </div>

            {/* Brief Description */}
            <div className="md:col-span-8 flex flex-col space-y-2">
              <label htmlFor="description" className="text-[10px] font-semibold text-gray-400">
                Brief Capability Description
              </label>
              <input
                type="text"
                id="description"
                name="description"
                defaultValue={editingItem?.description || ""}
                placeholder="e.g. UI Systems, Auto-Layout, Variables & Prototyping"
                className="w-full px-3 py-2.5 rounded-xl text-xs bg-black/45 border border-white/[0.06] text-white focus:outline-none focus:border-neon-purple/50 transition-colors"
              />
            </div>

            {/* Actions Buttons */}
            <div className="md:col-span-4 flex items-end gap-3">
              {editingItem && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="flex-1 py-2.5 rounded-xl border border-white/[0.08] hover:bg-white/[0.05] text-white font-bold transition-all cursor-pointer text-xs"
                >
                  Cancel
                </button>
              )}
              
              <button
                type="submit"
                disabled={isPending}
                className="flex-2 py-2.5 rounded-xl bg-gradient-to-r from-neon-purple to-neon-pink text-neutral-950 font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-neon-purple/20 hover:shadow-neon-purple/40 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 transition-all cursor-pointer text-xs"
              >
                {isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>{editingItem ? "Commit Changes" : "Deploy Capability"}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Skills list table/grid */}
      {initialSkills.length === 0 ? (
        <div className="py-20 border border-dashed border-white/[0.06] rounded-2xl flex flex-col items-center justify-center text-center p-6 bg-black/10">
          <Command className="w-10 h-10 text-gray-600 mb-4 animate-pulse" />
          <span className="text-xs font-bold text-gray-400">No capabilities in database</span>
          <p className="text-[10px] text-gray-500 max-w-[240px] mt-1 leading-relaxed">
            Click the "Add New Skill" button above to populate your studio capability matrices.
          </p>
        </div>
      ) : (
        <div className="glass-card rounded-2xl border border-white/[0.06] overflow-hidden bg-obsidian-950/15">
          <div className="overflow-x-auto w-full">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-white/[0.06] bg-white/[0.01]">
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Skill Name</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Mastery Level</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-4 text-right text-[10px] font-bold text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {initialSkills.map((skill) => (
                  <tr key={skill.id} className="hover:bg-white/[0.005] transition-colors group">
                    {/* Name */}
                    <td className="px-6 py-4 font-display font-bold text-xs text-white">
                      {skill.name}
                    </td>

                    {/* Category */}
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-0.75 rounded-md text-[9px] font-bold text-gray-400 bg-white/[0.02] border border-white/[0.04]">
                        {categoriesMap[skill.category] || skill.category}
                      </span>
                    </td>

                    {/* Level */}
                    <td className="px-6 py-4 text-xs font-semibold text-gray-300">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border bg-white/[0.01] border-white/[0.06] text-gray-400 ${
                        skill.tag_color || ""
                      }`}>
                        {skill.level}
                      </span>
                    </td>

                    {/* Description */}
                    <td className="px-6 py-4 text-[11px] font-light text-gray-400 max-w-[200px] truncate">
                      {skill.description || "-"}
                    </td>

                    {/* Action buttons */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleEditInit(skill)}
                          className="p-2 rounded-lg border border-transparent hover:border-neon-purple/20 text-gray-500 hover:text-neon-purple hover:bg-neon-purple/10 transition-all cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(skill.id)}
                          disabled={isDeletingId === skill.id}
                          className="p-2 rounded-lg border border-transparent hover:border-red-500/20 text-gray-500 hover:text-red-400 hover:bg-red-950/10 transition-all cursor-pointer disabled:opacity-40"
                        >
                          {isDeletingId === skill.id ? (
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
