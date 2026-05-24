import { createClient } from "@/lib/supabase/server";
import ProcessForm from "./ProcessForm";
import { ProcessStep } from "./actions";

const DEFAULT_STEPS: ProcessStep[] = [
  {
    num: "01",
    icon: "search",
    title: "Discover & Research",
    subtitle: "Discovery Phase",
    description:
      "Aligning on core business goals, auditing competitor frameworks, and mapping target user demographics to outline detailed accessibility flowcharts.",
  },
  {
    num: "02",
    icon: "compass",
    title: "Define & Wireframe",
    subtitle: "Structure Phase",
    description:
      "Formulating cohesive user journey loops, establishing responsive screen structural blocks, and testing dynamic interactive low-fidelity layouts.",
  },
  {
    num: "03",
    icon: "palette",
    title: "High-Fidelity Design",
    subtitle: "Styling Phase",
    description:
      "Creating comprehensive, responsive design libraries, managing dynamic visual typography systems, and establishing complete vector layouts in Figma.",
  },
  {
    num: "04",
    icon: "sparkles",
    title: "CGI & 3D Rendering",
    subtitle: "Artistic Enhancement",
    description:
      "Modeling bespoke 3D products, composing lighting and texture coordinates, and rendering cinematic visual assets to elevate brand presentation.",
  },
  {
    num: "05",
    icon: "send",
    title: "Hand-Off & Delivery",
    subtitle: "Deployment Phase",
    description:
      "Delivering unified design tokens, organized component libraries, developer documentation, and overseeing code-verification alignments.",
  },
];

export default async function ProcessPage() {
  const supabase = await createClient();

  let subtitle = "How I Work";
  let title = "Creative Design & CGI Process";
  let steps: ProcessStep[] = DEFAULT_STEPS;
  let status: "draft" | "published" = "published";

  try {
    const { data, error } = await supabase
      .from("process_settings")
      .select("*")
      .eq("id", "process_settings")
      .single();

    if (!error && data) {
      subtitle = data.subtitle ?? subtitle;
      title = data.title ?? title;
      steps = Array.isArray(data.steps) && data.steps.length > 0 ? data.steps : steps;
      status = data.status ?? status;
    }
  } catch {
    // Table doesn't exist yet — use defaults silently
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-black font-display text-white tracking-tight">
          Workflow Process
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage the &quot;How I Work&quot; process steps displayed on the public portfolio.
        </p>
      </div>

      <ProcessForm
        initialSubtitle={subtitle}
        initialTitle={title}
        initialSteps={steps}
        initialStatus={status}
      />
    </div>
  );
}
