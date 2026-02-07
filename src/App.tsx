import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ROUTE_PATHS } from "@/lib/index";
import { Layout } from "@/components/Layout";
import Dashboard from "@/pages/Dashboard";
import Projects from "@/pages/Projects";
import Clients from "@/pages/Clients";
import Users from "@/pages/Users";
import ProjectsDetails from "./pages/ProjectsDetails";
import NotFound from "./pages/not-found/NotFound";

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
      <TooltipProvider>
        <div dir="rtl" lang="ar" className="min-h-screen bg-background font-sans antialiased selection:bg-primary/20 selection:text-primary">
          <Toaster />
          <Sonner position="top-center" richColors closeButton dir="rtl" />
          <BrowserRouter>
            <Layout>
              <Routes>
                <Route
                  path={ROUTE_PATHS.DASHBOARD}
                  element={<Dashboard />}
                />
                <Route
                  path={ROUTE_PATHS.PROJECTS}
                  element={<Projects />}
                />
                <Route
                  path={"/projects/:id"}
                  element={<ProjectsDetails />}
                />
                <Route
                  path={ROUTE_PATHS.CLIENTS}
                  element={<Clients />}
                />
                <Route
                  path={ROUTE_PATHS.USERS}
                  element={<Users />}
                />
                <Route
                  path="*"
                  element={<NotFound />}
                />
              </Routes>
            </Layout>
          </BrowserRouter>
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;