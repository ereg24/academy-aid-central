import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import Dashboard from "@/pages/Dashboard";
import Register from "@/pages/Register";
import Attendance from "@/pages/Attendance";
import Payments from "@/pages/Payments";
import StudentManagement from "@/pages/StudentManagement";
import Reports from "@/pages/Reports";
import NotFound from "./pages/NotFound";
import { ThemeProvider } from "next-themes";
import { SchoolStoreProvider } from "@/context/school-store";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SchoolStoreProvider>
            <AppLayout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/register" element={<Register />} />
                <Route path="/attendance" element={<Attendance />} />
                <Route path="/payments" element={<Payments />} />
                <Route path="/student-management" element={<StudentManagement />} />
                <Route path="/reports" element={<Reports />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AppLayout>
          </SchoolStoreProvider>
        </ThemeProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
