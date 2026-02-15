
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ROUTE_PATHS } from "@/lib/index";
import { AuthProvider } from "@/contexts/AuthContext";
import { Layout } from "@/components/Layout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Projects from "@/pages/Projects";
import Clients from "@/pages/Clients";
import Users from "@/pages/Users";
import ProjectsDetails from "./pages/ProjectsDetails";
import NotFound from "./pages/not-found/NotFound";
import { Toaster } from "react-hot-toast";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <div dir="rtl" lang="ar" className="min-h-screen bg-background font-sans antialiased selection:bg-primary/20 selection:text-primary">

            <BrowserRouter>
              <Routes>
                <Route path={ROUTE_PATHS.LOGIN} element={<Login />} />
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Layout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Dashboard />} />
                  <Route path={ROUTE_PATHS.PROJECTS} element={<Projects />} />
                  <Route path={ROUTE_PATHS.PROJECTS + "/:id"} element={<ProjectsDetails />} />
                  <Route path={ROUTE_PATHS.CLIENTS} element={<Clients />} />
                  <Route path={ROUTE_PATHS.USERS} element={<Users />} />
                  <Route path="*" element={<NotFound />} />
                </Route>
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </BrowserRouter>
          </div>
          <Toaster
            position="top-center"
            reverseOrder={false}
            gutter={8}
            toastOptions={{
              duration: 5000,
              removeDelay: 1000,
              success: { duration: 3000 },
            }}
          />

        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;