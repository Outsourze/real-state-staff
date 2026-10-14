import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site-config";
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteUrl, changeFrequency: "monthly", priority: 1 },
    { url: `${siteUrl}/contact`, changeFrequency: "monthly", priority: 0.8 },
  ];
}
