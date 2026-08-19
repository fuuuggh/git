import { MainDesktopNavigation, MainMobileNavigation } from "./navigations";

export default function MainHeader() {
  return (
    <div className="sticky top-0 z-50 border-b border-border/80 bg-background/85 backdrop-blur-xl">
      <MainDesktopNavigation />
      <MainMobileNavigation />
    </div>
  );
}
