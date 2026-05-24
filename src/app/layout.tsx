import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";

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


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${inter.variable} scroll-smooth dark antialiased`}
    >
      <body className="bg-[#050508] text-gray-100 font-sans min-h-screen selection:bg-indigo-500/30 selection:text-indigo-200">
        {children}
      </body>
    </html>
  );
}

