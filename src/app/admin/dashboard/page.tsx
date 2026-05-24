import { createClient } from "@/utils/supabase/server";
import { 
  Briefcase, Code2, Mail, Quote, ExternalLink, 
  Terminal, ShieldCheck, FileText, ChevronRight, Settings, Sparkles 
} from "lucide-react";
import Link from "next/link";

interface MessageItem {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export default async function DashboardOverview() {
  let stats = {
    projects: 0,
    skills: 0,
    unreadMessages: 0,
    testimonials: 0,
  };
  let recentMessages: MessageItem[] = [];
  let databaseNeedsSetup = false;
  let connectionError = "";

  try {
    const supabase = await createClient();

    // Query statistics from Supabase in parallel
    const [
      projectsRes,
      skillsRes,
      unreadRes,
      testimonialsRes,
      messagesRes
    ] = await Promise.all([
      supabase.from("projects").select("*", { count: "exact", head: true }),
      supabase.from("skills").select("*", { count: "exact", head: true }),
      supabase.from("contact_messages").select("*", { count: "exact", head: true }).eq("is_read", false),
      supabase.from("testimonials").select("*", { count: "exact", head: true }),
      supabase.from("contact_messages").select("*").order("created_at", { ascending: false }).limit(3),
    ]);

    // Check if tables are missing or not created yet (42P01 is PostgreSQL's undefined_table error code)
    if (
      projectsRes.error?.code === "42P01" || 
      skillsRes.error?.code === "42P01" || 
      unreadRes.error?.code === "42P01" || 
      testimonialsRes.error?.code === "42P01"
    ) {
      databaseNeedsSetup = true;
    } else {
      stats.projects = projectsRes.count || 0;
      stats.skills = skillsRes.count || 0;
      stats.unreadMessages = unreadRes.count || 0;
      stats.testimonials = testimonialsRes.count || 0;
      recentMessages = (messagesRes.data as MessageItem[]) || [];
    }
  } catch (err: any) {
    console.error("Dashboard overview query error:", err);
    connectionError = err.message || "Failed to establish a connection to Supabase.";
  }

  const statCards = [
    { name: "Portfolio Projects", value: stats.projects, icon: Briefcase, href: "/admin/dashboard/projects", color: "from-neon-purple to-neon-pink", glow: "shadow-neon-purple/10" },
    { name: "Core Capabilities", value: stats.skills, icon: Code2, href: "/admin/dashboard/skills", color: "from-neon-blue to-neon-purple", glow: "shadow-neon-blue/10" },
    { name: "Unread Messages", value: stats.unreadMessages, icon: Mail, href: "/admin/dashboard/messages", color: "from-neon-pink to-neon-blue", glow: "shadow-neon-pink/10", badge: stats.unreadMessages > 0 },
    { name: "Client Reviews", value: stats.testimonials, icon: Quote, href: "/admin/dashboard/testimonials", color: "from-neon-emerald to-neon-blue", glow: "shadow-neon-emerald/10" },
  ];

  return (
    <div className="space-y-8 text-left">
      {/* Overview Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-neon-purple tracking-widest uppercase block">
            System Control Terminal
          </span>
          <h1 className="text-3xl font-black font-display text-white tracking-tight mt-1">
            Dashboard Overview
          </h1>
        </div>
        <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-md">
          <ShieldCheck className="w-4 h-4 text-neon-emerald" />
          <span className="text-[10px] font-mono tracking-wider text-gray-300 uppercase">Authenticated Session Secure</span>
        </div>
      </div>

      {/* RLS Warning / DB Setup Required Helper Box */}
      {databaseNeedsSetup && (
        <div className="p-6 rounded-2xl bg-amber-950/20 border border-amber-500/20 shadow-lg text-left space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
              <Terminal className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white leading-none">Database Schema Setup Required</h3>
              <p className="text-[11px] text-gray-400 mt-1">We noticed that the required tables do not exist in your Supabase project yet.</p>
            </div>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed max-w-3xl">
            Please copy the comprehensive SQL dump from your local file 
            <code className="px-1.5 py-0.5 rounded bg-black/45 text-neon-purple font-mono mx-1">implementation_plan.md</code>,
            navigate to your <strong className="text-white">Supabase Dashboard &gt; SQL Editor</strong>, paste it, and run it to create all tables and secure RLS policies instantly.
          </p>
        </div>
      )}

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link key={card.name} href={card.href} className="group cursor-pointer block">
              <div className={`glass-card p-6 rounded-2xl border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300 relative shadow-lg ${card.glow}`}>
                <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.005] to-white/[0.02] rounded-2xl -z-10" />
                
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-none">
                    {card.name}
                  </span>
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${card.color} p-0.5 group-hover:scale-105 transition-transform duration-300`}>
                    <div className="w-full h-full rounded-[6px] bg-obsidian-950 flex items-center justify-center">
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black font-display text-white group-hover:text-neon-purple transition-colors duration-300">
                    {card.value}
                  </span>
                  {card.badge && (
                    <span className="animate-pulse px-2 py-0.5 rounded-full text-[8px] font-black text-neutral-950 bg-gradient-to-r from-neon-purple to-neon-pink">
                      Pending
                    </span>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Main Grid: Messages Inbox & Quick Shortcuts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Recent Messages Area (Col: 7) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-card rounded-2xl border border-white/[0.06] p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.005] to-white/[0.02] -z-10 rounded-2xl" />
            
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-bold font-display text-white uppercase tracking-wider">
                Recent Secure Signals
              </h3>
              <Link 
                href="/admin/dashboard/messages" 
                className="text-[10px] font-bold text-neon-purple hover:underline flex items-center gap-1"
              >
                Open Inbox <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {recentMessages.length === 0 ? (
              <div className="py-12 border border-dashed border-white/[0.06] rounded-xl flex flex-col items-center justify-center text-center p-4">
                <Mail className="w-8 h-8 text-gray-600 mb-3" />
                <span className="text-xs text-gray-500 font-medium">No signals received yet</span>
                <p className="text-[10px] text-gray-600 max-w-[200px] mt-1 leading-relaxed">Form submissions will be transmitted to this terminal instantly.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentMessages.map((msg) => (
                  <div 
                    key={msg.id}
                    className="p-4 rounded-xl border border-white/[0.04] bg-white/[0.01] hover:border-white/[0.08] transition-colors relative flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-left">
                        <span className="text-xs font-bold text-white block">{msg.name}</span>
                        <span className="text-[9px] font-mono text-gray-500 block mt-0.5">{msg.email}</span>
                      </div>
                      <span className="text-[9px] text-gray-600 font-mono">
                        {new Date(msg.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                      </span>
                    </div>
                    <span className="text-[11px] font-semibold text-neon-purple block text-left truncate">{msg.subject}</span>
                    <p className="text-xs text-gray-400 font-light mt-1.5 leading-relaxed text-left line-clamp-2">
                      {msg.message}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Setup shortcuts (Col: 5) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-card rounded-2xl border border-white/[0.06] p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.005] to-white/[0.02] -z-10 rounded-2xl" />
            
            <h3 className="text-sm font-bold font-display text-white uppercase tracking-wider mb-6 text-left">
              Quick Studio Editors
            </h3>

            <div className="space-y-3">
              <Link 
                href="/admin/dashboard/hero" 
                className="flex items-center justify-between p-3.5 rounded-xl border border-white/[0.04] bg-white/[0.01] hover:border-neon-purple/40 hover:bg-white/[0.03] transition-all group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-8 h-8 rounded-lg bg-neon-purple/10 flex items-center justify-center text-neon-purple group-hover:scale-105 transition-transform">
                    <Terminal className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <span className="text-xs font-bold text-white block">Hero Presentation</span>
                    <span className="text-[9px] text-gray-500 block mt-0.5">Edit greeting title, roles list & portrait</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors" />
              </Link>

              <Link 
                href="/admin/dashboard/about" 
                className="flex items-center justify-between p-3.5 rounded-xl border border-white/[0.04] bg-white/[0.01] hover:border-neon-blue/40 hover:bg-white/[0.03] transition-all group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-8 h-8 rounded-lg bg-neon-blue/10 flex items-center justify-center text-neon-blue group-hover:scale-105 transition-transform">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <span className="text-xs font-bold text-white block">Story Philosophy</span>
                    <span className="text-[9px] text-gray-500 block mt-0.5">Edit bio summaries & metric parameters</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors" />
              </Link>

              <Link 
                href="/admin/dashboard/settings" 
                className="flex items-center justify-between p-3.5 rounded-xl border border-white/[0.04] bg-white/[0.01] hover:border-neon-pink/40 hover:bg-white/[0.03] transition-all group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-8 h-8 rounded-lg bg-neon-pink/10 flex items-center justify-center text-neon-pink group-hover:scale-105 transition-transform">
                    <Settings className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <span className="text-xs font-bold text-white block">Global Credentials</span>
                    <span className="text-[9px] text-gray-500 block mt-0.5">Upload resume, update logo & social coordinates</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors" />
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
