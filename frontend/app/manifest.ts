import type { MetadataRoute } from "next";
import { siteConfig } from "@/shared/config/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    background_color: "#000000",
    description: siteConfig.description,
    display: "standalone",
    icons: [
      {
        purpose: "any",
        sizes: "192x192",
        src: "/android-chrome-192x192.png",
        type: "image/png"
      },
      {
        purpose: "any",
        sizes: "512x512",
        src: "/android-chrome-512x512.png",
        type: "image/png"
      },
      {
        purpose: "maskable",
        sizes: "512x512",
        src: "/android-chrome-512x512.png",
        type: "image/png"
      }
    ],
    name: siteConfig.name,
    short_name: siteConfig.shortName,
    start_url: "/",
    theme_color: "#c95b43"
  };
}
