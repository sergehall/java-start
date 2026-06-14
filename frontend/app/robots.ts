import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/shared/config/site";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();

  return {
    host: siteUrl,
    rules: [
      {
        allow: ["/", "/java-basics", "/architecture", "/contact", "/favicon.ico", "/logo-rectangle.png"],
        disallow: ["/api/", "/dashboard", "/profile", "/settings", "/states", "/verify-email"],
        userAgent: "*"
      }
    ],
    sitemap: `${siteUrl}/sitemap.xml`
  };
}
