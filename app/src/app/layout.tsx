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
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
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
    <html lang="id" className="h-full" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" sizes="any" />
        <link rel="shortcut icon" href="/icon.svg" type="image/svg+xml" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme:dark)').matches)){document.documentElement.classList.add('dark')}else{document.documentElement.classList.remove('dark')}}catch(e){}})()`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
