import { NavLink, useLocation } from "react-router-dom";
import { Home, UserPlus, Users, DollarSign, FileText, BarChart3, Shield, Clock, Calendar } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

export function AppSidebar() {
  const { user } = useAuth();
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  
  // Menu items based on user role
  const adminItems = [
    { title: "Dashboard", url: "/", icon: Home },
    { title: "Registration", url: "/register", icon: UserPlus },
    { title: "Attendance", url: "/attendance", icon: Calendar },
    { title: "Payments", url: "/payments", icon: DollarSign },
    { title: "Student Management", url: "/student-management", icon: FileText },
    { title: "Reports", url: "/reports", icon: BarChart3 },
  ];

  const attendanceItems = [
    { title: "Dashboard", url: "/", icon: Home },
    { title: "Attendance", url: "/attendance", icon: Calendar },
  ];

  const items = user?.role === 'admin' ? adminItems : attendanceItems;
  
  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium border-r-2 border-sidebar-primary" : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-200";

  return (
    <Sidebar className="border-r border-border/40">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-primary font-semibold flex items-center gap-2">
            {user?.role === 'admin' ? (
              <>
                <Shield className="w-4 h-4" />
                Full Access
              </>
            ) : (
              <>
                <Clock className="w-4 h-4" />
                Attendance Only
              </>
            )}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end={item.url === "/"}
                      className={getNavCls}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}