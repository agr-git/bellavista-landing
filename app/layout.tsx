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

const SITE_URL = "https://bellavista-coffee.com.co";
const SOCIAL_IMAGE_URL = `${SITE_URL}/og/bellavista-coffee.jpg`;

const pageTitle = "Bellavista Coffee — Manizales, Colombia";
const pageDescription =
  "A small specialty coffee production project in the hills of Manizales — documented in drone footage, field notes, and every batch of coffee we ship.";
const socialTitle = "Bellavista Coffee";
const socialDescription =
  "Specialty coffee from the hills of Manizales, Colombia. Documented in drone footage and field notes.";
const socialImageAlt =
  "Aerial view of Bellavista Coffee Farm in the hills of Manizales, Colombia";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: pageTitle,
  description: pageDescription,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: socialTitle,
    description: socialDescription,
    url: SITE_URL,
    siteName: "Bellavista Coffee",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: SOCIAL_IMAGE_URL,
        width: 1200,
        height: 630,
        alt: socialImageAlt,
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: socialTitle,
    description: socialDescription,
    images: [
      {
        url: SOCIAL_IMAGE_URL,
        alt: socialImageAlt,
        width: 1200,
        height: 630,
      },
    ],
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
