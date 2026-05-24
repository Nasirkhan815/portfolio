"use client";

import { useActionState, startTransition, useState } from "react";
import { Plus, Trash2, Edit3, CheckCircle2, AlertCircle, Loader2, Sparkles, GraduationCap, Briefcase, Calendar } from "lucide-react";
import { addExperience, updateExperience, deleteExperience } from "./actions";

interface ExperienceItem {
  id: string;
  year: string;
  role: string;
  company: string;
  description: string;
  type: string;
  tech: string[];
}

export default function ExperienceManager({ initialExperience }: { initialExperience: ExperienceItem[] }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<ExperienceItem | null>(null);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);

  const [state, formAction, isPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      let res;
      if (editingItem) {
        formData.set("id", editingItem.id);
        res = await updateExperience(prevState, formData);
      } else {
        res = await addExperience(prevState, formData);
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

  const handleEditInit = (exp: ExperienceItem) => {
    setEditingItem(exp);
    setShowAddForm(true);
    // Smooth scroll up to form
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
    setShowAddForm(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this journey entry?")) {
      setIsDeletingId(id);
      try {
        await deleteExperience(id);
      } catch (err) {
        console.error(err);
      } finally {
        setIsDeletingId(null);
      }
    }
  };

  return (
    <div className="space-y-6 max-w-5xl text-left">
      {/* Notifications */}
      {state.success && (
        <div className="p-4 rounded-xl bg-neon-emerald/10 border border-neon-emerald/20 flex items-center gap-3 text-neon-emerald text-xs font-semibold">
          <CheckCircle2 className="w-5 h-5" />
          <span>Timeline entries updated successfully! Landing revalidated.</span>
        </div>
      )}

      {state.error && (
        <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/20 flex items-center gap-3 text-red-400 text-xs font-semibold">
          <AlertCircle className="w-5 h-5" />
          <span>⚠️ {state.error}</span>
        </div>
      )}

      {/* Header and Add button */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold font-display text-white uppercase tracking-wider">
          Journey Entries ({initialExperience.length})
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
          <span>{showAddForm ? "Close Panel" : "Add Journey Item"}</span>
        </button>
      </div>

      {/* Collapsible publish form card */}
      {showAddForm && (
        <div className="glass-card rounded-2xl border border-neon-purple/20 bg-obsidian-950/40 p-6 relative overflow-hidden animate-slide-down">
          <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.005] to-white/[0.02] -z-10 rounded-2xl" />
          
          <h4 className="text-xs font-black text-neon-purple uppercase tracking-widest mb-4 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5" />
            {editingItem ? "Refine Timeline Journey Node Details" : "Deploy New Timeline Journey Node"}
          </h4>

          <form 
            key={editingItem ? `edit-${editingItem.id}` : "new-exp"}
            onSubmit={handleAddSubmit} 
            className="space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Year Period */}
              <div className="flex flex-col space-y-2">
                <label htmlFor="year" className="text-[10px] font-semibold text-gray-400">
                  Duration Period
                </label>
                <input
                  type="text"
                  id="year"
                  name="year"
                  required
                  defaultValue={editingItem?.year || ""}
                  placeholder="e.g. 2024 - Present, 2021 - 2024"
                  className="w-full px-3 py-2 rounded-xl text-xs bg-black/45 border border-white/[0.06] text-white focus:outline-none focus:border-neon-purple/50 transition-colors"
                />
              </div>

              {/* Role Title */}
              <div className="flex flex-col space-y-2">
                <label htmlFor="role" className="text-[10px] font-semibold text-gray-400">
                  Position / Degree Title
                </label>
                <input
                  type="text"
                  id="role"
                  name="role"
                  required
                  defaultValue={editingItem?.role || ""}
                  placeholder="e.g. Senior UX/UI Designer"
                  className="w-full px-3 py-2 rounded-xl text-xs bg-black/45 border border-white/[0.06] text-white focus:outline-none focus:border-neon-purple/50 transition-colors"
                />
              </div>

              {/* Company */}
              <div className="flex flex-col space-y-2">
                <label htmlFor="company" className="text-[10px] font-semibold text-gray-400">
                  Company / Institution
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  required
                  defaultValue={editingItem?.company || ""}
                  placeholder="e.g. Artixor Studio"
                  className="w-full px-3 py-2 rounded-xl text-xs bg-black/45 border border-white/[0.06] text-white focus:outline-none focus:border-neon-purple/50 transition-colors"
                />
              </div>

              {/* Entry Type */}
              <div className="flex flex-col space-y-2">
                <label htmlFor="type" className="text-[10px] font-semibold text-gray-400">
                  Journey Classification
                </label>
                <select
                  id="type"
                  name="type"
                  required
                  defaultValue={editingItem?.type || "work"}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-black/45 border border-white/[0.06] text-white focus:outline-none focus:border-neon-purple/50 transition-colors cursor-pointer"
                >
                  <option value="work">Work Experience</option>
                  <option value="education">Education Journey</option>
                </select>
              </div>
            </div>

            {/* Description details */}
            <div className="flex flex-col space-y-2">
              <label htmlFor="description" className="text-[10px] font-semibold text-gray-400">
                Narrative details
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                defaultValue={editingItem?.description || ""}
                placeholder="Managed brand architecture projects for international clients..."
                className="w-full px-3 py-2 rounded-xl text-xs bg-black/45 border border-white/[0.06] text-white focus:outline-none focus:border-neon-purple/50 resize-none transition-colors"
              />
            </div>

            {/* Tech chips (work only) */}
            <div className="flex flex-col space-y-2">
              <label htmlFor="tech" className="text-[10px] font-semibold text-gray-400">
                Technologies / Core Areas (Comma separated - Optional)
              </label>
              <input
                type="text"
                id="tech"
                name="tech"
                defaultValue={editingItem?.tech?.join(", ") || ""}
                placeholder="e.g. Figma, Brand Identity, Interaction Design"
                className="w-full px-3 py-2.5 rounded-xl text-xs bg-black/45 border border-white/[0.06] text-white focus:outline-none focus:border-neon-purple/50 transition-colors"
              />
              <span className="text-[9px] text-gray-600 font-mono">
                Separate distinct domains using a comma. They will appear as chips on your experience card.
              </span>
            </div>

            {/* Actions Buttons */}
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
                    <span>{editingItem ? "Commit Updates" : "Deploy Node"}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Experience Timeline Entries Table */}
      {initialExperience.length === 0 ? (
        <div className="py-20 border border-dashed border-white/[0.06] rounded-2xl flex flex-col items-center justify-center text-center p-6 bg-black/10">
          <Calendar className="w-10 h-10 text-gray-600 mb-4 animate-pulse" />
          <span className="text-xs font-bold text-gray-400">No journey entries found</span>
          <p className="text-[10px] text-gray-500 max-w-[240px] mt-1 leading-relaxed">
            Click the "Add Journey Item" button above to populate your work and education timelines.
          </p>
        </div>
      ) : (
        <div className="glass-card rounded-2xl border border-white/[0.06] overflow-hidden bg-obsidian-950/15">
          <div className="overflow-x-auto w-full">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-white/[0.06] bg-white/[0.01]">
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Classification</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Period</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Role & Host</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-4 text-right text-[10px] font-bold text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {initialExperience.map((exp) => (
                  <tr key={exp.id} className="hover:bg-white/[0.005] transition-colors group">
                    {/* Classification */}
                    <td className="px-6 py-4">
                      {exp.type === "work" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.75 rounded-md text-[9px] font-bold text-neon-purple bg-neon-purple/10 border border-neon-purple/20">
                          <Briefcase className="w-3 h-3" /> Work
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.75 rounded-md text-[9px] font-bold text-neon-blue bg-neon-blue/10 border border-neon-blue/20">
                          <GraduationCap className="w-3.5 h-3.5" /> Education
                        </span>
                      )}
                    </td>

                    {/* Period */}
                    <td className="px-6 py-4 font-mono font-bold text-xs text-white">
                      {exp.year}
                    </td>

                    {/* Role & host */}
                    <td className="px-6 py-4 max-w-[200px]">
                      <div className="text-xs font-bold text-white truncate">{exp.role}</div>
                      <div className="text-[10px] text-gray-500 truncate mt-0.5">{exp.company}</div>
                    </td>

                    {/* Description details */}
                    <td className="px-6 py-4 text-[11px] font-light text-gray-400 max-w-[200px] truncate">
                      {exp.description || "-"}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleEditInit(exp)}
                          className="p-2 rounded-lg border border-transparent hover:border-neon-purple/20 text-gray-500 hover:text-neon-purple hover:bg-neon-purple/10 transition-all cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(exp.id)}
                          disabled={isDeletingId === exp.id}
                          className="p-2 rounded-lg border border-transparent hover:border-red-500/20 text-gray-500 hover:text-red-400 hover:bg-red-950/10 transition-all cursor-pointer disabled:opacity-40"
                        >
                          {isDeletingId === exp.id ? (
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
