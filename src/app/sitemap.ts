import type { MetadataRoute } from "next";
import { games } from "@/data/games";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://brainrush.example";
  const routes = [
    "",
    "games",
    "daily-challenge",
    "about",
    "contact",
    "privacy-policy",
    "terms",
    "cookie-policy",
  ];
  return [
    ...routes.map((path) => ({
      url: `${base}/${path ? path + "/" : ""}`,
      lastModified: new Date(),
      changeFrequency: path === "" ? ("daily" as const) : ("monthly" as const),
      priority: path === "" ? 1 : 0.6,
    })),
    ...games.map((g) => ({
      url: `${base}/games/${g.slug}/`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
