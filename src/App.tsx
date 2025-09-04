import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Index from "./pages/Index";
import LandingPage from "./pages/LandingPage";
import NotFound from "./pages/NotFound";
import AdminPanel from "./pages/AdminPanel";
import { EmbedWrapper } from "./components/EmbedWrapper";
import UserAuth from "./components/UserAuth";
import UserDashboard from "./components/UserDashboard";
import { isEmbedMode } from "./hooks/use-embed";
import { AuthProvider } from "./contexts/AuthContext";
import { UserAuthProvider, useUserAuth } from "./contexts/UserAuthContext";

const queryClient = new QueryClient();

// Componente que gerencia o fluxo de autenticação
const AuthenticatedApp = () => {
  const { user, profile, loading } = useUserAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // Se não está logado, mostra a landing page
  if (!user) {
    return <LandingPage />;
  }

  // Se usuário está logado e temos o perfil, verificar o tipo
  if (user && profile) {
    const isAdmin = profile.role && ['admin', 'gestor', 'analista'].includes(profile.role);
    
    if (isAdmin) {
      return <AdminPanel />;
    } else {
      return <UserDashboard />;
    }
  }

  // Se usuário está logado mas perfil é null, assumir usuário comum
  return <UserDashboard />;
};

const App = () => {
  const embedMode = isEmbedMode();

  if (embedMode) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <EmbedWrapper>
            <Index />
          </EmbedWrapper>
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <UserAuthProvider>
          <AuthProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<AuthenticatedApp />} />
                <Route path="/landing" element={<LandingPage />} />
                <Route path="/login" element={<UserAuth />} />
                <Route path="/public" element={<Index />} />
                <Route path="/admin" element={<AdminPanel />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </AuthProvider>
        </UserAuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
