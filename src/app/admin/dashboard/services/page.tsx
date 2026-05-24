import { createClient } from "@/utils/supabase/server";
import ServicesManager from "./ServicesManager";

export default async function ServicesPage() {
  const supabase = await createClient();
  let services: any[] = [];

  try {
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      services = data;
    }
  } catch (err) {
    console.error("Services server query error:", err);
  }

  return (
    <div className="space-y-6 text-left">
      <div>
        <span className="text-xs font-mono text-neon-purple tracking-widest uppercase block">
          CMS Manager
        </span>
        <h2 className="text-3xl font-black font-display text-white tracking-tight mt-1">
          Manage Services
        </h2>
      </div>
      <ServicesManager initialServices={services} />
    </div>
  );
}
