import { LoginHeader, LoginSection } from "@/components/login";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const LoginPage = async () => {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // Reading the existing local session avoids a blocking network validation
  // before showing a page that is otherwise entirely local.
  const {
    data: { session },
  } = await supabase.auth.getSession();

  session?.user && redirect("/editor/posts");

  return (
    <>
      <LoginHeader />{" "}
      <div className="mx-auto mt-5 max-w-md">
        <LoginSection />
      </div>
    </>
  );
};

export default LoginPage;
