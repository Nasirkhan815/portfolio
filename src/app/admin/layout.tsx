import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "NK - Admin Control Center",
  description: "Secure administrative dashboard for Nasir Khan's portfolio",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${inter.className} bg-[#050508] min-h-screen text-white antialiased`}>
      {children}
    </div>
  );
}
