import type { Metadata } from "next";
import { connection } from "next/server";
import { getSiteUrl, siteConfig } from "@/shared/config/site";
import "./globals.css";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  alternates: {
    canonical: "/"
  },
  applicationName: siteConfig.name,
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: siteConfig.shortName
  },
  authors: [{ name: "Serge Hall", url: siteConfig.githubUrl }],
  creator: "Serge Hall",
  description: siteConfig.description,
  icons: {
    apple: [
      { sizes: "180x180", url: "/apple-touch-icon.png" },
      { sizes: "180x180", url: "/apple-touch-icon-precomposed.png" }
    ],
    icon: [
      { sizes: "16x16", type: "image/png", url: "/favicon-16x16.png" },
      { sizes: "32x32", type: "image/png", url: "/favicon-32x32.png" },
      { url: "/favicon.ico" }
    ]
  },
  keywords: ["Java", "Spring Boot", "Next.js", "TypeScript", "PostgreSQL", "fullstack learning"],
  manifest: "/manifest.webmanifest",
  metadataBase: new URL(siteUrl),
  openGraph: {
    description: siteConfig.description,
    images: [
      {
        alt: "Java Start logo with Java and Next.js branding",
        height: 630,
        url: "/logo-rectangle.png",
        width: 1200
      }
    ],
    locale: "en_US",
    siteName: siteConfig.name,
    title: siteConfig.name,
    type: "website",
    url: "/"
  },
  publisher: "Serge Hall",
  robots: {
    follow: true,
    googleBot: {
      follow: true,
      index: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1
    },
    index: true
  },
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`
  },
  twitter: {
    card: "summary_large_image",
    description: siteConfig.description,
    images: ["/logo-rectangle.png"],
    title: siteConfig.name
  }
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  await connection();

  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
