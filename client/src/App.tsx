import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import MainLayout from "@/components/layouts/MainLayout";
import AdminLayout from "@/components/layouts/AdminLayout";
import NotFound from "@/pages/not-found";
import UserRoutes from "@/routes/UserRoutes";
import AdminRoutes from "@/routes/AdminRoutes";

function AppRouter() {
  return (
    <Router>
      <Routes>
        {/* User facing routes */}
        <Route path="/*" element={
          <MainLayout>
            <UserRoutes />
          </MainLayout>
        } />
        
        {/* Admin routes */}
        <Route path="/admin/*" element={
          <AdminLayout>
            <AdminRoutes />
          </AdminLayout>
        } />
        
        {/* Fallback to 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <AppRouter />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
