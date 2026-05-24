"use client";

import { useState, useTransition, useRef } from "react";
import {
  Search, Compass, Palette, Sparkles, Send,
  Terminal, Code, Layers, Users, Award, Zap,
  Plus, Trash2, GripVertical, ChevronUp, ChevronDown,
  Save, Loader2, CheckCircle2, AlertCircle, Eye, EyeOff,
} from "lucide-react";
import { updateProcess, ProcessStep } from "./actions";

// ── Icon registry ──────────────────────────────────────────────────────────────
const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  search: Search,
  compass: Compass,
  palette: Palette,
  sparkles: Sparkles,
  send: Send,
  terminal: Terminal,
  code: Code,
  layers: Layers,
  users: Users,
  award: Award,
  zap: Zap,
};

const ICON_OPTIONS = Object.keys(ICON_MAP);

// ── Glow colour cycle ──────────────────────────────────────────────────────────
const GLOW_CYCLE = [
  "text-neon-purple",
  "text-neon-pink",
  "text-neon-blue",
  "text-neon-emerald",
  "text-neon-purple",
];

// ── Props ──────────────────────────────────────────────────────────────────────
interface Props {
  initialSubtitle: string;
  initialTitle: string;
  initialSteps: ProcessStep[];
  initialStatus: "draft" | "published";
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function ProcessForm({
  initialSubtitle,
  initialTitle,
  initialSteps,
  initialStatus,
}: Props) {
  const [subtitle, setSubtitle] = useState(initialSubtitle);
  const [title, setTitle] = useState(initialTitle);
  const [steps, setSteps] = useState<ProcessStep[]>(initialSteps);
  const [status, setStatus] = useState<"draft" | "published">(initialStatus);

  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ success: boolean; error?: string } | null>(null);

  // ── Drag state ───────────────────────────────────────────────────────────────
  const dragIndexRef = useRef<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // ── Step helpers ─────────────────────────────────────────────────────────────
  const updateStep = (idx: number, patch: Partial<ProcessStep>) => {
    setSteps((prev) => prev.map((s, i) => (i === idx ? { ...s, ...patch } : s)));
  };

  const addStep = () => {
    const num = String(steps.length + 1).padStart(2, "0");
    setSteps((prev) => [
      ...prev,
      { num, icon: "search", title: "New Step", subtitle: "New Phase", description: "" },
    ]);
  };

  const removeStep = (idx: number) => {
    setSteps((prev) =>
      prev
        .filter((_, i) => i !== idx)
        .map((s, i) => ({ ...s, num: String(i + 1).padStart(2, "0") }))
    );
  };

  const moveStep = (idx: number, dir: -1 | 1) => {
    const target = idx + dir;
    if (target < 0 || target >= steps.length) return;
    setSteps((prev) => {
      const next = [...prev];
      [next[idx], next[target]] = [next[target], next[idx]];
      return next.map((s, i) => ({ ...s, num: String(i + 1).padStart(2, "0") }));
    });
  };

  const reorderSteps = (fromIdx: number, toIdx: number) => {
    if (fromIdx === toIdx) return;
    setSteps((prev) => {
      const next = [...prev];
      const [moved] = next.splice(fromIdx, 1);
      next.splice(toIdx, 0, moved);
      return next.map((s, i) => ({ ...s, num: String(i + 1).padStart(2, "0") }));
    });
  };

  // ── Drag handlers ────────────────────────────────────────────────────────────
  const handleDragStart = (idx: number) => {
    dragIndexRef.current = idx;
    setIsDragging(true);
  };

  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverIndex(idx);
  };

  const handleDrop = (e: React.DragEvent, toIdx: number) => {
    e.preventDefault();
    if (dragIndexRef.current !== null) {
      reorderSteps(dragIndexRef.current, toIdx);
    }
    dragIndexRef.current = null;
    setDragOverIndex(null);
    setIsDragging(false);
  };

  const handleDragEnd = () => {
    dragIndexRef.current = null;
    setDragOverIndex(null);
    setIsDragging(false);
  };

  // ── Save ─────────────────────────────────────────────────────────────────────
  const handleSave = () => {
    setResult(null);
    startTransition(async () => {
      const res = await updateProcess({ subtitle, title, steps, status });
      setResult(res);
    });
  };

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">

      {/* ── Section Header Card ─────────────────────────────────────────────── */}
      <div className="glass-card rounded-2xl border border-white/[0.06] p-6">
        <h2 className="text-xs font-bold tracking-widest text-neon-purple uppercase mb-5">
          Section Header
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Subtitle */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
              Eyebrow Label
            </label>
            <input
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="How I Work"
              className="w-full bg-obsidian-900/60 border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-neon-purple/50 transition-colors"
            />
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
              Section Title
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Creative Design & CGI Process"
              className="w-full bg-obsidian-900/60 border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-neon-purple/50 transition-colors"
            />
          </div>
        </div>

        {/* Status toggle */}
        <div className="mt-4 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setStatus((s) => (s === "published" ? "draft" : "published"))}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border transition-all duration-300 ${
              status === "published"
                ? "bg-neon-emerald/10 border-neon-emerald/30 text-neon-emerald"
                : "bg-white/[0.03] border-white/[0.08] text-gray-500"
            }`}
          >
            {status === "published" ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            {status === "published" ? "Published" : "Draft"}
          </button>
          <span className="text-xs text-gray-600">
            {status === "published"
              ? "Section is visible on the portfolio."
              : "Section is hidden from public view."}
          </span>
        </div>
      </div>

      {/* ── Steps Editor ────────────────────────────────────────────────────── */}
      <div className="glass-card rounded-2xl border border-white/[0.06] p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xs font-bold tracking-widest text-neon-purple uppercase">
              Workflow Steps{" "}
              <span className="text-gray-600 font-normal normal-case">({steps.length})</span>
            </h2>
            {isDragging && (
              <p className="text-[10px] text-gray-600 mt-0.5">Drop to reorder</p>
            )}
          </div>
          <button
            type="button"
            onClick={addStep}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neon-purple/10 border border-neon-purple/30 text-neon-purple text-xs font-semibold hover:bg-neon-purple/20 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Step
          </button>
        </div>

        <div className="space-y-4">
          {steps.map((step, idx) => {
            const IconComp = ICON_MAP[step.icon] ?? Search;
            const glowColor = GLOW_CYCLE[idx % GLOW_CYCLE.length];
            const isBeingDraggedOver = dragOverIndex === idx && dragIndexRef.current !== idx;

            return (
              <div
                key={`step-${idx}`}
                draggable
                onDragStart={() => handleDragStart(idx)}
                onDragOver={(e) => handleDragOver(e, idx)}
                onDrop={(e) => handleDrop(e, idx)}
                onDragEnd={handleDragEnd}
                className={`group relative bg-obsidian-900/40 border rounded-2xl p-5 transition-all duration-200 ${
                  isBeingDraggedOver
                    ? "border-neon-purple/50 shadow-[0_0_20px_-5px_rgba(139,92,246,0.3)] scale-[1.01]"
                    : dragIndexRef.current === idx && isDragging
                    ? "border-white/[0.04] opacity-40 scale-[0.98]"
                    : "border-white/[0.06] hover:border-white/[0.12]"
                }`}
              >
                {/* Step number badge */}
                <div className="absolute -top-3 left-5 px-2.5 py-0.5 bg-obsidian-950 border border-white/[0.08] rounded-full text-[10px] font-black font-display text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-pink">
                  {step.num}
                </div>

                {/* Controls row */}
                <div className="flex items-center justify-between mb-4 pt-1">
                  <div className="flex items-center gap-2">
                    {/* ── Drag Handle ── */}
                    <div
                      title="Drag to reorder"
                      className="cursor-grab active:cursor-grabbing p-1 rounded-lg text-gray-600 hover:text-gray-300 hover:bg-white/[0.04] transition-colors"
                    >
                      <GripVertical className="w-4 h-4" />
                    </div>
                    <IconComp className={`w-5 h-5 ${glowColor}`} />
                    <span className="text-sm font-semibold text-white">
                      {step.title || "Untitled Step"}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => moveStep(idx, -1)}
                      disabled={idx === 0}
                      title="Move up"
                      className="p-1.5 rounded-lg text-gray-600 hover:text-white hover:bg-white/[0.05] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveStep(idx, 1)}
                      disabled={idx === steps.length - 1}
                      title="Move down"
                      className="p-1.5 rounded-lg text-gray-600 hover:text-white hover:bg-white/[0.05] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeStep(idx)}
                      disabled={steps.length <= 1}
                      title="Remove step"
                      className="p-1.5 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-950/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Drop indicator line */}
                {isBeingDraggedOver && (
                  <div className="absolute -top-px left-4 right-4 h-0.5 bg-gradient-to-r from-neon-purple to-neon-pink rounded-full" />
                )}

                {/* Fields grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Icon picker */}
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">
                      Icon
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {ICON_OPTIONS.map((iconKey) => {
                        const IC = ICON_MAP[iconKey];
                        const isSelected = step.icon === iconKey;
                        return (
                          <button
                            key={iconKey}
                            type="button"
                            title={iconKey}
                            onClick={() => updateStep(idx, { icon: iconKey })}
                            className={`p-2 rounded-lg border transition-all duration-200 ${
                              isSelected
                                ? "bg-neon-purple/15 border-neon-purple/50 text-neon-purple"
                                : "bg-white/[0.02] border-white/[0.06] text-gray-600 hover:text-white hover:border-white/20"
                            }`}
                          >
                            <IC className="w-3.5 h-3.5" />
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Step Title */}
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">
                      Step Title
                    </label>
                    <input
                      value={step.title}
                      onChange={(e) => updateStep(idx, { title: e.target.value })}
                      placeholder="e.g. Discover & Research"
                      className="w-full bg-obsidian-900/60 border border-white/[0.08] rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-neon-purple/50 transition-colors"
                    />
                  </div>

                  {/* Phase Subtitle */}
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">
                      Phase Label
                    </label>
                    <input
                      value={step.subtitle}
                      onChange={(e) => updateStep(idx, { subtitle: e.target.value })}
                      placeholder="e.g. Discovery Phase"
                      className="w-full bg-obsidian-900/60 border border-white/[0.08] rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-neon-purple/50 transition-colors"
                    />
                  </div>

                  {/* Description */}
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">
                      Description
                    </label>
                    <textarea
                      value={step.description}
                      onChange={(e) => updateStep(idx, { description: e.target.value })}
                      placeholder="Describe what happens in this phase..."
                      rows={2}
                      className="w-full bg-obsidian-900/60 border border-white/[0.08] rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-neon-purple/50 transition-colors resize-none"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {steps.length === 0 && (
          <div className="text-center py-12 text-gray-600 text-sm">
            No steps yet. Click{" "}
            <span className="text-neon-purple">+ Add Step</span> to begin.
          </div>
        )}
      </div>

      {/* ── Save Bar ─────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-4 bg-obsidian-900/40 border border-white/[0.06] rounded-2xl px-6 py-4">
        {/* Feedback */}
        <div className="flex-1">
          {result?.success && (
            <div className="flex items-center gap-2 text-neon-emerald text-sm font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              Process settings saved successfully!
            </div>
          )}
          {result?.error && (
            <div className="flex items-start gap-2 text-red-400 text-xs font-medium">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{result.error}</span>
            </div>
          )}
          {!result && (
            <p className="text-xs text-gray-600">
              {steps.length} step{steps.length !== 1 ? "s" : ""} configured
              {isDragging && " · Drag to reorder"}
            </p>
          )}
        </div>

        {/* Save button — text-obsidian-950 for contrast on bright neon gradient */}
        <button
          type="button"
          onClick={handleSave}
          disabled={isPending}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-neon-purple to-neon-pink text-obsidian-950 text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving…
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Commit System Updates
            </>
          )}
        </button>
      </div>

    </div>
  );
}
