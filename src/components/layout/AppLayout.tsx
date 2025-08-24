import ThemeToggle from "@/components/ThemeToggle";
import { Home, LogOut, User } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, signOut } = useAuth();

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4">
              <div className="flex items-center gap-2">
                <SidebarTrigger className="md:hidden" />
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-6 h-6 md:w-8 md:h-8 bg-gradient-to-br from-primary to-blue-600 rounded-lg shadow-lg">
                    <Home className="w-3 h-3 md:w-5 md:h-5 text-primary-foreground" />
                  </div>
                  <h1 className="text-lg md:text-xl font-semibold text-foreground">SchoolManager</h1>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                {user && (
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center justify-center w-8 h-8 bg-muted rounded-full">
                        <User className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div className="hidden md:block text-right">
                        <div className="text-sm font-medium">{user.full_name}</div>
                        <Badge variant={user.role === 'admin' ? 'default' : 'secondary'} className="text-xs">
                          {user.role === 'admin' ? 'Administrator' : 'Attendance Only'}
                        </Badge>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={signOut}
                      className="flex items-center gap-2 hover:bg-destructive/10 hover:text-destructive"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="hidden md:inline">Sign Out</span>
                    </Button>
                  </div>
                )}
                <ThemeToggle />
              </div>
            </div>
          </header>
          <main className="flex-1 p-4 md:p-6 bg-gradient-to-br from-background via-background to-muted/20">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
