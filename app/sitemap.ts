import type { MetadataRoute } from "next";
import { getPublicEntries } from "@/lib/journal";

const BASE = "https://www.bellavista-coffee.com.co";

export default function sitemap(): MetadataRoute.Sitemap {
  const entries = getPublicEntries();

  const journalRoutes: MetadataRoute.Sitemap = entries.map((e) => ({
    url: `${BASE}/journal/${e.slug}`,
    lastModified: new Date(e.frontmatter.date),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const lastJournal =
    entries.length > 0 ? new Date(entries[0].frontmatter.date) : new Date();

  return [
    {
      url: `${BASE}/`,
      lastModified: lastJournal,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...journalRoutes,
  ];
}
