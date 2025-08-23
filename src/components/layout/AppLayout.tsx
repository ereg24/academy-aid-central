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
        <div className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-6 h-6 md:w-8 md:h-8 bg-primary rounded-lg">
              <Home className="w-3 h-3 md:w-5 md:h-5 text-primary-foreground" />
            </div>
            <h1 className="text-lg md:text-xl font-semibold text-foreground">SchoolManager</h1>
          </div>
          <ThemeToggle />
        </div>
        <nav className="border-t overflow-x-auto">
          <div className="flex items-center px-4 md:px-6 min-w-max">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-1 md:gap-2 px-2 md:px-4 py-3 text-xs md:text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                    isActive
                      ? "border-primary text-primary bg-primary/5"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/50"
                  )
                }
              >
                <item.icon className="w-3 h-3 md:w-4 md:h-4" />
                <span className="hidden sm:inline">{item.label}</span>
                <span className="sm:hidden">{item.label.split(' ')[0]}</span>
              </NavLink>
            ))}
          </div>
        </nav>
      </header>
      <main className="p-4 md:p-6">
        {children}
      </main>
    </div>
  );
}
