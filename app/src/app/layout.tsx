import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SIPANDA | Sistem Informasi Pengajuan Dana Ramah Lingkungan",
  description: "Platform digitalisasi pengajuan dana dan LPJ ormawa FILKOM Universitas Brawijaya berbasis prinsip Green Software Engineering dan pengukuran CO₂e.",
  keywords: ["SIPANDA", "FILKOM UB", "Green Computing", "Green Software Engineering", "Pengajuan Dana", "Triple Bottom Line", "Carbon Footprint"],
  authors: [
    { name: "Fayyadh Radhwa Ferdia (235150401111058)" },
    { name: "Muhammad Nabil Fatahilah (235150401111063)" },
    { name: "Muhammad Zaidan Rabbani (245150407111040)" },
  ],
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#15803d" },
    { media: "(prefers-color-scheme: dark)", color: "#090d16" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="h-full">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
