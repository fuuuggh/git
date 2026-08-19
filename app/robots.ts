import type { MetadataRoute } from "next";
import { getUrl } from "@/lib/utils";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/editor/", "/settings/", "/bookmarks/", "/login/"],
    },
    sitemap: `${getUrl()}/sitemap.xml`,
  };
}
