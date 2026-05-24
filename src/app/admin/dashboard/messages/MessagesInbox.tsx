"use client";

import { useState, useTransition } from "react";
import { Mail, Trash2, CheckCircle2, ChevronRight, Search, Inbox, MailOpen, AlertCircle, Loader2, ArrowRight } from "lucide-react";
import { markMessageRead, deleteMessage } from "./actions";

interface MessageItem {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export default function MessagesInbox({ initialMessages }: { initialMessages: MessageItem[] }) {
  const [messages, setMessages] = useState<MessageItem[]>(initialMessages);
  const [selectedId, setSelectedId] = useState<string | null>(initialMessages[0]?.id || null);
  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSelect = async (msg: MessageItem) => {
    setSelectedId(msg.id);
    if (!msg.is_read) {
      // Mark as read in background
      startTransition(async () => {
        try {
          await markMessageRead(msg.id);
          // Optimistically update read status locally
          setMessages(prev =>
            prev.map(m => (m.id === msg.id ? { ...m, is_read: true } : m))
          );
        } catch (err) {
          console.error(err);
        }
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this contact message permanently?")) {
      startTransition(async () => {
        try {
          await deleteMessage(id);
          setMessages(prev => prev.filter(m => m.id !== id));
          if (selectedId === id) {
            setSelectedId(null);
          }
        } catch (err) {
          console.error(err);
        }
      });
    }
  };

  const filteredMessages = messages.filter(
    msg =>
      msg.name.toLowerCase().includes(search.toLowerCase()) ||
      msg.email.toLowerCase().includes(search.toLowerCase()) ||
      msg.subject.toLowerCase().includes(search.toLowerCase()) ||
      msg.message.toLowerCase().includes(search.toLowerCase())
  );

  const activeMessage = messages.find(m => m.id === selectedId);

  return (
    <div className="glass-card rounded-2xl border border-white/[0.06] overflow-hidden bg-obsidian-950/20 backdrop-blur-xl grid grid-cols-1 md:grid-cols-12 min-h-[600px] max-w-5xl text-left">
      
      {/* Left Column: Messages List (Col: 5) */}
      <div className="md:col-span-5 border-r border-white/[0.06] flex flex-col h-[600px]">
        {/* Search Bar header */}
        <div className="p-4 border-b border-white/[0.06] bg-white/[0.01] relative flex items-center">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search inbox transmissions..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-xs bg-black/45 border border-white/[0.06] text-white focus:outline-none focus:border-neon-purple/50 transition-colors"
          />
          <Search className="absolute left-7 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        </div>

        {/* List items */}
        <div className="flex-1 overflow-y-auto divide-y divide-white/[0.04]">
          {filteredMessages.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center text-center p-4">
              <Inbox className="w-8 h-8 text-gray-600 mb-3" />
              <span className="text-xs text-gray-500 font-medium">Inbox is empty</span>
              <p className="text-[9.5px] text-gray-600 max-w-[160px] mt-1 leading-relaxed">No signals found matching your filter criteria.</p>
            </div>
          ) : (
            filteredMessages.map(msg => {
              const isSelected = msg.id === selectedId;
              const date = new Date(msg.created_at).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric"
              });

              return (
                <div
                  key={msg.id}
                  onClick={() => handleSelect(msg)}
                  className={`p-4 transition-all cursor-pointer relative ${
                    isSelected 
                      ? "bg-white/[0.04]" 
                      : "hover:bg-white/[0.01]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`text-xs font-bold truncate max-w-[120px] ${!msg.is_read ? "text-white" : "text-gray-300"}`}>
                      {msg.name}
                    </span>
                    <span className="text-[9px] text-gray-500 font-mono">{date}</span>
                  </div>

                  <span className={`text-[11px] block truncate ${!msg.is_read ? "text-neon-purple font-semibold" : "text-gray-400"}`}>
                    {msg.subject}
                  </span>

                  <p className="text-[10px] text-gray-500 truncate mt-1 leading-relaxed font-light">
                    {msg.message}
                  </p>

                  {/* Unread Glow dot */}
                  {!msg.is_read && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-neon-purple shadow-[0_0_10px_rgba(139,92,246,0.8)] animate-pulse" />
                  )}

                  {/* Selected indicator */}
                  {isSelected && (
                    <div className="absolute left-0 top-0 bottom-0 w-0.75 bg-neon-purple" />
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Right Column: Detailed Signal Inspect Panel (Col: 7) */}
      <div className="md:col-span-7 h-[600px] flex flex-col">
        {activeMessage ? (
          <div className="flex flex-col h-full p-6 sm:p-8 justify-between relative bg-black/10">
            {/* Upper Details */}
            <div className="space-y-6">
              {/* Header block */}
              <div className="flex items-start justify-between pb-4 border-b border-white/[0.06]">
                <div className="text-left space-y-1">
                  <span className="text-[9px] font-mono text-neon-purple tracking-widest uppercase block">Secure Signal Channel</span>
                  <h3 className="text-base font-bold text-white leading-none">{activeMessage.name}</h3>
                  <a href={`mailto:${activeMessage.email}`} className="text-[10px] font-mono text-gray-400 hover:text-neon-blue transition-colors block mt-1">
                    {activeMessage.email}
                  </a>
                </div>

                <span className="text-[9.5px] text-gray-500 font-mono">
                  {new Date(activeMessage.created_at).toLocaleString(undefined, {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
                </span>
              </div>

              {/* Subject */}
              <div className="text-left">
                <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest block">Transmission Subject</span>
                <span className="text-sm font-bold text-white block mt-1.5 leading-snug">
                  {activeMessage.subject}
                </span>
              </div>

              {/* Body */}
              <div className="text-left">
                <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest block">Message Payload</span>
                <div className="p-4 rounded-xl border border-white/[0.04] bg-black/35 mt-2.5 min-h-[160px] overflow-y-auto">
                  <p className="text-xs text-gray-300 font-light leading-relaxed whitespace-pre-wrap">
                    {activeMessage.message}
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Actions footer */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-6 border-t border-white/[0.06]">
              {/* Reply */}
              <a
                href={`mailto:${activeMessage.email}?subject=RE: ${activeMessage.subject}`}
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-neon-purple to-neon-pink text-neutral-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
              >
                <span>Draft Reply Transmission</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              {/* Delete */}
              <button
                onClick={() => handleDelete(activeMessage.id)}
                className="p-3 rounded-xl border border-white/[0.06] bg-white/[0.01] text-red-400 hover:text-white hover:border-red-500/20 hover:bg-red-950/15 transition-all cursor-pointer flex items-center gap-2 text-xs font-semibold"
              >
                <Trash2 className="w-4 h-4" />
                <span className="hidden sm:inline">Purge Signal</span>
              </button>
            </div>
          </div>
        ) : (
          // Placeholder state if no message selected
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-black/15">
            <div className="w-12 h-12 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-center text-gray-400 mb-4 shadow-lg shadow-black/40">
              <MailOpen className="w-5 h-5 text-neon-purple animate-pulse" />
            </div>
            <span className="text-xs font-bold text-gray-300">Signal Inspector Terminal</span>
            <p className="text-[10px] text-gray-500 max-w-[200px] mt-1 leading-relaxed">
              Select an active transmission from the left panel to inspect payload, audit logs, and draft secure replies.
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
