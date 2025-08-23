import ThemeToggle from "@/components/ThemeToggle";
import { Home } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="border-b bg-background">
            <div className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4">
              <div className="flex items-center gap-2">
                <SidebarTrigger className="md:hidden" />
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-6 h-6 md:w-8 md:h-8 bg-primary rounded-lg">
                    <Home className="w-3 h-3 md:w-5 md:h-5 text-primary-foreground" />
                  </div>
                  <h1 className="text-lg md:text-xl font-semibold text-foreground">SchoolManager</h1>
                </div>
              </div>
              <ThemeToggle />
            </div>
          </header>
          <main className="flex-1 p-4 md:p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
