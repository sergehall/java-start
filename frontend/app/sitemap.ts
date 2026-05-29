import type { MetadataRoute } from "next";
import { getSiteUrl, publicSiteRoutes } from "@/shared/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const lastModified = new Date();

  return publicSiteRoutes.map((route) => ({
    changeFrequency: route.changeFrequency,
    lastModified,
    priority: route.priority,
    url: `${siteUrl}${route.path}`
  }));
}
