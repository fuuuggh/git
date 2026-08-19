import { createPublicClient } from "@/utils/supabase/public";
import { getUrl } from "@/lib/utils";

const escapeXml = (value: string) => value.replace(/[<>&'\"]/g, (character) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" })[character] ?? character);

export async function GET() {
  const supabase = createPublicClient();
  const { data: posts } = await (supabase.from("posts" as never) as any)
    .select("title,slug,description,created_at,updated_at")
    .eq("published", true)
    .order("created_at", { ascending: false })
    .limit(30);
  const baseUrl = getUrl();
  const items = (posts ?? []).map((post) => `<item><title>${escapeXml(post.title ?? "未命名文章")}</title><link>${baseUrl}/blog/${post.slug}</link><guid>${baseUrl}/blog/${post.slug}</guid><description>${escapeXml(post.description ?? "")}</description><pubDate>${new Date(post.updated_at ?? post.created_at ?? Date.now()).toUTCString()}</pubDate></item>`).join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>公益资源与博客</title><link>${baseUrl}</link><description>免费资源与知识分享</description><language>zh-CN</language>${items}</channel></rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
}
