import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient(await cookies());
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) redirect("/login");

  // This only protects the dashboard shell. Every write action separately
  // verifies the database admin role before making a change.
  if (session.user.email?.toLowerCase() !== process.env.ADMIN_EMAIL?.toLowerCase()) notFound();

  return children;
}
