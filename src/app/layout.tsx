import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Moro TW Awards 2025",
  description: "Los premios más importantes de MoroTwitter",
  openGraph: {
    title: "Moro TW Awards 2025",
    description: "Los premios más importantes de MoroTwitter",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <Header />
        <main className="min-h-screen pt-20">{children}</main>
      </body>
    </html>
  );
}
