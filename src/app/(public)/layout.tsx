import { Footer } from "@/components/layout/footer";
import { PublicHeader } from "@/components/layout/public-header";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return <div className="flex min-h-[100svh] flex-col"><PublicHeader /><main>{children}</main><Footer /></div>;
}
