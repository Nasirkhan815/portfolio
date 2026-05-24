"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { 
  LayoutDashboard, Zap, User, Code2, Briefcase, 
  Sparkles, GraduationCap, Quote, Mail, Settings, 
  LogOut, Menu, X, ArrowLeft, Milestone
} from "lucide-react";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

interface SidebarItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: SidebarItem[] = [
  { name: "Overview", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Hero Section", href: "/admin/dashboard/hero", icon: Zap },
  { name: "About Section", href: "/admin/dashboard/about", icon: User },
  { name: "Skills Core", href: "/admin/dashboard/skills", icon: Code2 },
  { name: "Projects Portfolio", href: "/admin/dashboard/projects", icon: Briefcase },
  { name: "Services", href: "/admin/dashboard/services", icon: Sparkles },
  { name: "Workflow Process", href: "/admin/dashboard/process", icon: Milestone },
  { name: "Experience Timeline", href: "/admin/dashboard/experience", icon: GraduationCap },
  { name: "Testimonials", href: "/admin/dashboard/testimonials", icon: Quote },
  { name: "Messages Inbox", href: "/admin/dashboard/messages", icon: Mail },
  { name: "Site Settings", href: "/admin/dashboard/settings", icon: Settings },
];


export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Fetch initial count of unread messages
    const fetchUnreadCount = async () => {
      const { count, error } = await supabase
        .from("contact_messages")
        .select("*", { count: "exact", head: true })
        .eq("is_read", false);

      if (!error && count !== null) {
        setUnreadCount(count);
      }
    };

    fetchUnreadCount();

    // Subscribe to new contact messages
    const channel = supabase
      .channel("messages-count-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "contact_messages" },
        () => {
          fetchUnreadCount();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <>
      {/* Mobile Toggle Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-obsidian-950/80 backdrop-blur-xl border-b border-white/[0.06] flex items-center justify-between px-6 z-50">
        <div className="flex items-center gap-2">
          <div className="relative w-7 h-7">
            <Image src="/logo.png" alt="Logo" fill className="object-contain" />
          </div>
          <span className="font-display text-sm font-bold tracking-wider text-white uppercase">NK Admin</span>
        </div>
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="p-2 text-gray-400 hover:text-white rounded-lg border border-white/[0.08]"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Container */}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-obsidian-950/45 backdrop-blur-2xl border-r border-white/[0.06] flex flex-col justify-between py-6 z-40 transition-transform duration-300 lg:translate-x-0 ${
        isOpen ? "translate-x-0 pt-20 lg:pt-6" : "-translate-x-full lg:translate-x-0"
      }`}>
        {/* Upper Brand & Nav List */}
        <div className="flex flex-col flex-1 px-4">
          {/* Brand header */}
          <div className="hidden lg:flex items-center gap-3 px-3 mb-8">
            <div className="relative w-8 h-8 flex items-center justify-center p-1 bg-obsidian-900/40 rounded-xl border border-white/[0.06]">
              <Image src="/logo.png" alt="Logo" fill className="object-contain p-1" />
            </div>
            <div className="flex flex-col">
              <span className="font-display text-sm font-black tracking-wider text-white uppercase leading-none">Nasir Khan</span>
              <span className="text-[9px] font-mono text-neon-purple tracking-widest uppercase mt-1">Control Panel</span>
            </div>
          </div>

          {/* Nav List */}
          <nav className="space-y-1 flex-1 overflow-y-auto pr-1 select-none">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              const isMail = item.name === "Messages Inbox";

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all duration-300 relative group cursor-pointer ${
                    isActive 
                      ? "text-white bg-white/[0.06] border border-white/[0.08] shadow-inner" 
                      : "text-gray-400 hover:text-white hover:bg-white/[0.02] border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <Icon className={`w-4 h-4 transition-colors ${isActive ? "text-neon-purple" : "text-gray-400 group-hover:text-white"}`} />
                    <span>{item.name}</span>
                  </div>

                  {/* Mail Badging */}
                  {isMail && unreadCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold text-neutral-950 bg-gradient-to-r from-neon-purple to-neon-pink">
                      {unreadCount}
                    </span>
                  )}

                  {/* Border indicator */}
                  {isActive && (
                    <div className="absolute left-0 top-3 bottom-3 w-0.75 rounded-r bg-neon-purple" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer actions */}
        <div className="px-4 border-t border-white/[0.06] pt-4 mt-4 space-y-2">
          {/* Back to Site */}
          <Link
            href="/"
            className="flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-gray-500 hover:text-white hover:bg-white/[0.01] transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Site</span>
          </Link>

          {/* Sign out */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3.5 w-full px-4 py-2.5 rounded-xl text-xs font-semibold text-red-400/70 hover:text-red-400 hover:bg-red-950/10 transition-all cursor-pointer text-left"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Screen Backdrop for Mobile when Sidebar open */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)} 
          className="lg:hidden fixed inset-0 bg-black/45 backdrop-blur-sm z-30"
        />
      )}
    </>
  );
}
