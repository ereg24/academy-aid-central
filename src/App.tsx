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
import Login from "@/pages/Login";
import NotFound from "./pages/NotFound";
import { ThemeProvider } from "next-themes";
import { SchoolStoreProvider } from "@/context/school-store";
import { AuthProvider } from "@/context/auth-context";
import ProtectedRoute from "@/components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <SchoolStoreProvider>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Dashboard />
                    </AppLayout>
                  </ProtectedRoute>
                } />
                <Route path="/register" element={
                  <ProtectedRoute requiredRole="admin">
                    <AppLayout>
                      <Register />
                    </AppLayout>
                  </ProtectedRoute>
                } />
                <Route path="/attendance" element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Attendance />
                    </AppLayout>
                  </ProtectedRoute>
                } />
                <Route path="/payments" element={
                  <ProtectedRoute requiredRole="admin">
                    <AppLayout>
                      <Payments />
                    </AppLayout>
                  </ProtectedRoute>
                } />
                <Route path="/student-management" element={
                  <ProtectedRoute requiredRole="admin">
                    <AppLayout>
                      <StudentManagement />
                    </AppLayout>
                  </ProtectedRoute>
                } />
                <Route path="/reports" element={
                  <ProtectedRoute requiredRole="admin">
                    <AppLayout>
                      <Reports />
                    </AppLayout>
                  </ProtectedRoute>
                } />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </SchoolStoreProvider>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
