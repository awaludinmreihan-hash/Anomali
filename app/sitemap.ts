import type { MetadataRoute } from "next";
import { supabasePublic } from "@/lib/supabase";
import { SITE } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const db = supabasePublic();
  const { data } = await db
    .from("stories")
    .select("slug, updated_at")
    .eq("published", true);

  const storyUrls: MetadataRoute.Sitemap = (data || []).map((s) => ({
    url: `${SITE.url}/cerita/${s.slug}`,
    lastModified: s.updated_at,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [
    { url: SITE.url, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${SITE.url}/cari`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    ...storyUrls,
  ];
}
