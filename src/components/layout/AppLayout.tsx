import { Link, NavLink } from "react-router-dom";
import ThemeToggle from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";
import { Home, UserPlus, Users, DollarSign, FileText, BarChart3 } from "lucide-react";

const navItems = [
  { to: "/", label: "Home", icon: Home },
  { to: "/register", label: "Registration", icon: UserPlus },
  { to: "/attendance", label: "Attendance", icon: Users },
  { to: "/payments", label: "Payments", icon: DollarSign },
  { to: "/student-management", label: "Student Management", icon: FileText },
  { to: "/reports", label: "Reports", icon: BarChart3 },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
              <Home className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-semibold text-foreground">SchoolManager</h1>
          </div>
          <ThemeToggle />
        </div>
        <nav className="border-t">
          <div className="flex items-center px-6">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors",
                    isActive
                      ? "border-primary text-primary bg-primary/5"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/50"
                  )
                }
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </NavLink>
            ))}
          </div>
        </nav>
      </header>
      <main className="p-6">
        {children}
      </main>
    </div>
  );
}
