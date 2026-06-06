import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";
import { createClient } from "@/utils/supabase/server";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://artixor.com"),
  title: "Nasir Khan | UI/UX Designer & CG Artist",
  description: "Portfolio of Nasir Khan, a senior UI/UX Designer, Product Designer, Graphic Designer, and CG Artist with 10+ years of experience.",

  keywords: ["Nasir Khan", "UI/UX Designer", "CG Artist", "Product Designer", "Graphic Designer", "3D Artist", "Creative Director", "Artixor"],
  authors: [{ name: "Nasir Khan" }],
  openGraph: {
    title: "Nasir Khan | UI/UX Designer & CG Artist",
    description: "Portfolio of Nasir Khan, a senior UI/UX Designer, Product Designer, Graphic Designer, and CG Artist with 10+ years of experience.",
    url: "https://artixor.com",
    siteName: "Nasir Khan Portfolio",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/images/ai-crm.png",
        width: 1200,
        height: 630,
        alt: "Nasir Khan Portfolio Showcase",
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Nasir Khan | UI/UX Designer & CG Artist",
    description: "Portfolio of Nasir Khan, a senior UI/UX Designer, Product Designer, Graphic Designer, and CG Artist with 10+ years of experience.",
    images: ["/images/ai-crm.png"],
  }
};


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch site settings to get favicon_url (try both common singleton ids)
  let favicon = "/favicon.ico";
  try {
    const supabase = await createClient();
    let { data } = await supabase
      .from("site_settings")
      .select("favicon_url, updated_at")
      .eq("id", "global_settings")
      .single();
    if (!data) {
      const res = await supabase
        .from("site_settings")
        .select("favicon_url, updated_at")
        .eq("id", "site_settings")
        .single();
      data = res.data;
    }
    if (data?.favicon_url) {
      const base = data.favicon_url;
      const ver = data.updated_at ? new Date(data.updated_at).getTime() : Date.now();
      favicon = base.includes("?") ? `${base}&v=${ver}` : `${base}?v=${ver}`;
    }
  } catch (err) {
    // ignore and fallback to default
    console.error("Failed to fetch favicon_url:", err);
  }

  return (
    <html
      lang="en"
      className={`${outfit.variable} ${inter.variable} scroll-smooth dark antialiased`}
    >
      <head>
        <link rel="icon" href={favicon} />
        <link rel="shortcut icon" href={favicon} />
        <link rel="apple-touch-icon" href={favicon} />
      </head>
      <body className="bg-[#050508] text-gray-100 font-sans min-h-screen selection:bg-indigo-500/30 selection:text-indigo-200">
        {children}
      </body>
    </html>
  );
}

