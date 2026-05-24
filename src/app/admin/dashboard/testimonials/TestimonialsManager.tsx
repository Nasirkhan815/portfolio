"use client";

import { useActionState, startTransition, useState } from "react";
import { Plus, Trash2, Edit3, CheckCircle2, AlertCircle, Loader2, Sparkles, Quote, Calendar } from "lucide-react";
import { addTestimonial, updateTestimonial, deleteTestimonial } from "./actions";

interface TestimonialItem {
  id: string;
  quote: string;
  name: string;
  role: string;
  company: string;
  initials: string;
  color: string;
}

export default function TestimonialsManager({ initialTestimonials }: { initialTestimonials: TestimonialItem[] }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<TestimonialItem | null>(null);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);

  const [state, formAction, isPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      let res;
      if (editingItem) {
        formData.set("id", editingItem.id);
        res = await updateTestimonial(prevState, formData);
      } else {
        res = await addTestimonial(prevState, formData);
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

  const handleEditInit = (test: TestimonialItem) => {
    setEditingItem(test);
    setShowAddForm(true);
    // Smooth scroll up to form
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
    setShowAddForm(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this testimonial?")) {
      setIsDeletingId(id);
      try {
        await deleteTestimonial(id);
      } catch (err) {
        console.error(err);
      } finally {
        setIsDeletingId(null);
      }
    }
  };

  const getThemeValue = (test: TestimonialItem) => {
    if (test.color?.includes("neon-blue to-neon-purple")) return "blue";
    if (test.color?.includes("neon-pink to-neon-blue")) return "pink";
    return "purple"; // default
  };

  const themeDisplayNames: Record<string, string> = {
    "from-neon-purple to-neon-pink": "Purple-Pink Gradient",
    "from-neon-blue to-neon-purple": "Blue-Purple Gradient",
    "from-neon-pink to-neon-blue": "Pink-Blue Gradient"
  };

  return (
    <div className="space-y-6 max-w-5xl text-left">
      {/* Save Success / Error banners */}
      {state.success && (
        <div className="p-4 rounded-xl bg-neon-emerald/10 border border-neon-emerald/20 flex items-center gap-3 text-neon-emerald text-xs font-semibold">
          <CheckCircle2 className="w-5 h-5" />
          <span>Testimonial catalog updated successfully! Landing revalidated.</span>
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
          Client Testimonials ({initialTestimonials.length})
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
          <span>{showAddForm ? "Close Panel" : "Add Testimonial"}</span>
        </button>
      </div>

      {/* Collapsible publish form card */}
      {showAddForm && (
        <div className="glass-card rounded-2xl border border-neon-purple/20 bg-obsidian-950/40 p-6 relative overflow-hidden animate-slide-down">
          <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.005] to-white/[0.02] -z-10 rounded-2xl" />
          
          <h4 className="text-xs font-black text-neon-purple uppercase tracking-widest mb-4 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5" />
            {editingItem ? "Refine Client Transmission Settings" : "Publish New Client Transmission"}
          </h4>

          <form 
            key={editingItem ? `edit-${editingItem.id}` : "new-test"}
            onSubmit={handleAddSubmit} 
            className="space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Client Name */}
              <div className="flex flex-col space-y-2">
                <label htmlFor="name" className="text-[10px] font-semibold text-gray-400">
                  Client Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  defaultValue={editingItem?.name || ""}
                  placeholder="e.g. Sarah Jenkins"
                  className="w-full px-3 py-2 rounded-xl text-xs bg-black/45 border border-white/[0.06] text-white focus:outline-none focus:border-neon-purple/50 transition-colors"
                />
              </div>

              {/* Role */}
              <div className="flex flex-col space-y-2">
                <label htmlFor="role" className="text-[10px] font-semibold text-gray-400">
                  Creative Role / Position
                </label>
                <input
                  type="text"
                  id="role"
                  name="role"
                  required
                  defaultValue={editingItem?.role || ""}
                  placeholder="e.g. Design Director"
                  className="w-full px-3 py-2 rounded-xl text-xs bg-black/45 border border-white/[0.06] text-white focus:outline-none focus:border-neon-purple/50 transition-colors"
                />
              </div>

              {/* Company */}
              <div className="flex flex-col space-y-2">
                <label htmlFor="company" className="text-[10px] font-semibold text-gray-400">
                  Company / Organization
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  required
                  defaultValue={editingItem?.company || ""}
                  placeholder="e.g. Apex Agency"
                  className="w-full px-3 py-2 rounded-xl text-xs bg-black/45 border border-white/[0.06] text-white focus:outline-none focus:border-neon-purple/50 transition-colors"
                />
              </div>

              {/* Badge Theme */}
              <div className="flex flex-col space-y-2">
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
                  <option value="purple">Purple-Pink Gradient</option>
                  <option value="blue">Blue-Purple Gradient</option>
                  <option value="pink">Pink-Blue Gradient</option>
                </select>
              </div>
            </div>

            {/* Quote details */}
            <div className="flex flex-col space-y-2">
              <label htmlFor="quote" className="text-[10px] font-semibold text-gray-400">
                Client Narrative Review / Quote
              </label>
              <textarea
                id="quote"
                name="quote"
                required
                rows={4}
                defaultValue={editingItem?.quote || ""}
                placeholder="Nasir Khan's capability to orchestrate high-fidelity interface systems in Figma..."
                className="w-full px-3 py-2 rounded-xl text-xs bg-black/45 border border-white/[0.06] text-white focus:outline-none focus:border-neon-purple/50 resize-none transition-colors"
              />
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
                    <span>{editingItem ? "Commit Updates" : "Publish Review"}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Testimonials List Table */}
      {initialTestimonials.length === 0 ? (
        <div className="py-20 border border-dashed border-white/[0.06] rounded-2xl flex flex-col items-center justify-center text-center p-6 bg-black/10">
          <Quote className="w-10 h-10 text-gray-600 mb-4 animate-pulse" />
          <span className="text-xs font-bold text-gray-400">No testimonials published</span>
          <p className="text-[10px] text-gray-500 max-w-[240px] mt-1 leading-relaxed">
            Click the "Add Testimonial" button above to publish client reviews directly.
          </p>
        </div>
      ) : (
        <div className="glass-card rounded-2xl border border-white/[0.06] overflow-hidden bg-obsidian-950/15">
          <div className="overflow-x-auto w-full">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-white/[0.06] bg-white/[0.01]">
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Badge</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Client & Bio</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Review Quote</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Glow Gradient</th>
                  <th className="px-6 py-4 text-right text-[10px] font-bold text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {initialTestimonials.map((test) => (
                  <tr key={test.id} className="hover:bg-white/[0.005] transition-colors group">
                    {/* Badge */}
                    <td className="px-6 py-4">
                      <div className={`w-8 h-8 rounded-full bg-gradient-to-tr ${test.color} p-[1.5px] shadow-lg`}>
                        <div className="w-full h-full rounded-full bg-obsidian-950 flex items-center justify-center text-[9px] font-black text-white">
                          {test.initials}
                        </div>
                      </div>
                    </td>

                    {/* Name & role */}
                    <td className="px-6 py-4 max-w-[150px]">
                      <div className="text-xs font-bold text-white truncate">{test.name}</div>
                      <div className="text-[9.5px] text-gray-500 truncate mt-0.5">{test.role} at {test.company}</div>
                    </td>

                    {/* Narrative details */}
                    <td className="px-6 py-4 text-[11px] font-light text-gray-400 max-w-[240px] truncate">
                      "{test.quote}"
                    </td>

                    {/* Gradient name */}
                    <td className="px-6 py-4 text-[10px] text-gray-400 font-mono">
                      {themeDisplayNames[test.color] || test.color}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleEditInit(test)}
                          className="p-2 rounded-lg border border-transparent hover:border-neon-purple/20 text-gray-500 hover:text-neon-purple hover:bg-neon-purple/10 transition-all cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(test.id)}
                          disabled={isDeletingId === test.id}
                          className="p-2 rounded-lg border border-transparent hover:border-red-500/20 text-gray-500 hover:text-red-400 hover:bg-red-950/10 transition-all cursor-pointer disabled:opacity-40"
                        >
                          {isDeletingId === test.id ? (
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
