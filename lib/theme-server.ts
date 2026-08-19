import { cookies } from "next/headers";

export async function getRequestTheme() {
  return (await cookies()).get("site_theme")?.value === "dark" ? "dark" : "light";
}
