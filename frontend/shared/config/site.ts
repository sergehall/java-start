export const siteConfig = {
  description: "A learning app that pairs Next.js with a Java Spring Boot backend.",
  githubUrl: "https://github.com/SergeHall",
  name: "Java Start",
  shortName: "Java Start"
} as const;

export const publicSiteRoutes = [
  {
    changeFrequency: "weekly",
    path: "/",
    priority: 1
  },
  {
    changeFrequency: "monthly",
    path: "/stack",
    priority: 0.8
  },
  {
    changeFrequency: "monthly",
    path: "/contact",
    priority: 0.6
  }
] as const;

export function getSiteUrl() {
  const rawUrl = process.env.FRONTEND_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return rawUrl.replace(/\/+$/, "");
}
