import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bellavista Coffee — Manizales, Colombia",
  description:
    "A small specialty coffee production project in the hills of Manizales — documented in drone footage, field notes, and every batch of coffee we ship.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
