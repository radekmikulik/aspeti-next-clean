import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ASPETi – Můj účet (app)",
  description: "Poskytovatelský účet ASPETi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs-CZ">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-[#F5F7F6] text-gray-900 antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
