import { MainFooter, MainGrid, MainHeader, NookDesktopTopbar, NookLeftSidebar, NookRightSidebar } from "@/components/main";
import { ReactNode } from "react";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto min-h-screen max-w-[1600px] lg:grid lg:grid-cols-[14.5rem_minmax(0,1fr)] xl:grid-cols-[14.5rem_minmax(0,1fr)_18rem]">
      <NookLeftSidebar />
      <div className="min-w-0">
        <MainHeader />
        <NookDesktopTopbar />
        <MainGrid>
          <main className="min-h-[calc(100vh-4rem)] px-5 py-8 sm:px-8 sm:py-10 lg:px-10 xl:px-12">
            <div className="mx-auto max-w-5xl">{children}</div>
          </main>
        </MainGrid>
        <MainFooter />
      </div>
      <NookRightSidebar />
    </div>
  );
}
