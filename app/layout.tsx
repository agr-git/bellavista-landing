import type { Metadata } from "next";
import { Instrument_Serif, JetBrains_Mono } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import Nav from "@/components/Nav";
import Providers from "@/components/Providers";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-instrument-serif",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: "Bellavista Coffee — Manizales, Colombia",
  description:
    "A small specialty coffee production project in the hills of Manizales — documented in drone footage, field notes, and every batch of coffee we ship.",
  metadataBase: new URL("https://www.bellavista-coffee.com.co"),
  openGraph: {
    title: "Bellavista Coffee",
    description:
      "Specialty coffee from the hills of Manizales, Colombia. Documented in drone footage and field notes.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${instrumentSerif.variable} ${GeistSans.variable} ${jetbrainsMono.variable}`}
    >
      <body id="top">
        <Providers>
          <Nav />
          {children}
        </Providers>
      </body>
    </html>
  );
}
