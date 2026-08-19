import { mainPostConfig } from "@/config/main";
import { getMinutes, shimmer, toBase64 } from "@/lib/utils";
import { PostWithCategoryWithProfile } from "@/types/collection";
import { createClient } from "@/utils/supabase/server";
import { format, parseISO } from "date-fns";
import { CalendarIcon, Clock10Icon } from "lucide-react";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import readingTime from "reading-time";

export const dynamic = "force-dynamic";

async function getPublicImageUrl(postId: string, fileName: string) {
  if (!fileName) return "/images/not-found.jpg";
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const bucketName =
    process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET_POSTS || "posts";
  const { data } = supabase.storage
    .from(bucketName)
    .getPublicUrl(`${postId}/${fileName}`);

  if (data && data.publicUrl) return data.publicUrl;

  return "/images/not-found.jpg";
}

interface MainPostItemProps {
  post: PostWithCategoryWithProfile;
}

const MainPostItem: React.FC<MainPostItemProps> = async ({ post }) => {
  const readTime = readingTime(post.content ? post.content : "");

  return (
    <>
      <div className="group relative w-full rounded-2xl bg-card p-1 shadow-sm ring-1 ring-border transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-md">
        <div className="relative max-w-full rounded-[0.72rem]">
          <Link href={`/posts/${post.slug}`}>
            <article className="relative isolate flex max-w-3xl flex-col gap-2 rounded-xl bg-card px-5 py-5 sm:gap-8 sm:px-8 sm:py-7 lg:flex-row">
              <div className="relative aspect-[16/9] sm:aspect-[2/1] lg:aspect-square lg:w-64 lg:shrink-0">
                <Image
                  src={await getPublicImageUrl(post.id, post.image || "")}
                  alt={post.title ?? "Cover"}
                  height={256}
                  width={256}
                  placeholder={`data:image/svg+xml;base64,${toBase64(
                    shimmer(256, 256),
                  )}`}
                  className="absolute inset-0 h-full w-full rounded-2xl bg-muted object-cover"
                />
                <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-foreground/10" />
              </div>
              <div>
                {/* Desktop category view */}
                <div className="hidden items-center gap-x-3 text-sm sm:flex">
                  <span className="relative z-10 rounded-full bg-secondary px-3 py-1.5 font-medium text-secondary-foreground">
                    {(post.categories as any)?.name ?? "文章"}
                  </span>
                </div>

                <div className="group relative max-w-xl">
                  <h3 className="mt-3 text-lg font-semibold leading-6 text-foreground transition-colors group-hover:text-primary">
                    <span className="absolute inset-0" />
                    {post.title}
                  </h3>
                  {/* Mobile category and toolbar view*/}
                  <div className="mt-2 flex items-center gap-x-3 text-sm sm:hidden">
                    <div className="inline-flex items-center text-muted-foreground">
                      <span className="relative z-10 rounded-full bg-secondary px-3 py-1.5 font-medium text-secondary-foreground">
                        {(post.categories as any)?.name ?? "文章"}
                      </span>
                    </div>
                    <div className="inline-flex items-center text-muted-foreground">
                      <CalendarIcon className="h-4 w-4" />
                      <span className="ml-1">
                        {format(parseISO(post.updated_at!), "dd/MM/yyyy")}
                      </span>
                    </div>
                    <div className="inline-flex items-center text-muted-foreground">
                      <Clock10Icon className="h-4 w-4" />
                      <span className="ml-1">
                        {getMinutes(readTime.minutes ? readTime.minutes : 0)}
                      </span>
                    </div>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {post.description}
                  </p>
                  {/* Desktop toolbar view */}
                  <div className="mt-3 hidden items-center gap-x-3 text-sm sm:flex">
                    <div className="inline-flex items-center text-muted-foreground">
                      <CalendarIcon className="h-4 w-4" />
                      <span className="ml-1">
                        {format(parseISO(post.updated_at!), "MMMM dd, yyyy")}
                      </span>
                    </div>
                    <div className="inline-flex items-center text-muted-foreground">
                      <Clock10Icon className="h-4 w-4" />
                      <span className="ml-1">
                        {getMinutes(readTime.minutes)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex border-t border-border pt-3">
                  <div className="relative flex items-center gap-x-2">
                    <Image
                      src={post.profiles?.avatar_url ?? "/images/avatar.png"}
                      alt={post.profiles?.full_name ?? "Avatar"}
                      height={40}
                      width={40}
                      placeholder={`data:image/svg+xml;base64,${toBase64(
                        shimmer(40, 40),
                      )}`}
                      className="h-[40px] w-[40px] rounded-full bg-muted object-cover"
                    />
                    <div className="text-sm">
                      <p className="font-semibold text-foreground">
                        {post.profiles?.full_name ?? "本站作者"}
                      </p>
                      <p className="text-muted-foreground">{mainPostConfig.author}</p>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          </Link>
        </div>
      </div>
    </>
  );
};

export default MainPostItem;
