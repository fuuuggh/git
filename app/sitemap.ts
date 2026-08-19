import type { MetadataRoute } from "next";
import { getUrl } from "@/lib/utils";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getUrl();
  const lastModified = new Date();

  return ["/", "/about", "/contact", "/policy", "/terms"].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.5,
  }));
}
