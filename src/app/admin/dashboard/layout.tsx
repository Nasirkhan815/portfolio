import Sidebar from "@/components/admin/Sidebar";

export const dynamic = "force-dynamic";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-[#050508] text-white flex flex-col lg:flex-row overflow-x-hidden">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Administrative Workspace */}
      <main className="flex-1 w-full pt-20 lg:pt-8 pb-16 px-6 sm:px-8 md:px-10 lg:pl-72 max-w-7xl mx-auto overflow-y-auto">
        <div className="space-y-8">
          {children}
        </div>
      </main>
    </div>
  );
}
