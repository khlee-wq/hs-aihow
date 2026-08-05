import { Footer } from "@/components/layout/footer";
import { PublicHeader } from "@/components/layout/public-header";
import { PublicLightTheme } from "@/components/theme/public-light-theme";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <PublicLightTheme>
      <div className="flex min-h-[100svh] flex-col">
        <PublicHeader />
        <main>{children}</main>
        <Footer />
      </div>
    </PublicLightTheme>
  );
}
