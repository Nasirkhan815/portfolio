import { createClient } from "@/utils/supabase/server";
import MessagesInbox from "./MessagesInbox";

export default async function MessagesPage() {
  const supabase = await createClient();
  let messages: any[] = [];

  try {
    const { data, error } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      messages = data;
    }
  } catch (err) {
    console.error("Messages server query error:", err);
  }

  return (
    <div className="space-y-6 text-left">
      <div>
        <span className="text-xs font-mono text-neon-purple tracking-widest uppercase block">
          Communications Terminal
        </span>
        <h2 className="text-3xl font-black font-display text-white tracking-tight mt-1">
          Messages Inbox
        </h2>
      </div>
      <MessagesInbox initialMessages={messages} />
    </div>
  );
}
