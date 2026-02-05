import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: "CIT - Criminal Investigation Tracker",
  description: "Enterprise-grade Criminal Investigation Management System. Project Antigravity Ultra.",
  keywords: ["criminal investigation", "case management", "law enforcement", "evidence tracking"],
  authors: [{ name: "CBI Technology Division" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased bg-bureau-950 text-bureau-100`}
      >
        {children}
      </body>
    </html>
  );
}
