import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar2";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="md:pl-72">
        <Header />
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-6 md:gap-8">
          {children}
        </main>
      </div>
      <Sidebar />
    </div>
  );
}