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
import { UserAuthProvider, useUserAuth } from "./contexts/UserAuthContext";

const queryClient = new QueryClient();

// Componente que gerencia o fluxo de autenticação
const AuthenticatedApp = () => {
  const { user, profile, loading } = useUserAuth();

  // Debug logs iniciais
  console.log('=== DEBUG INICIAL ===');
  console.log('Loading:', loading);
  console.log('User:', user);
  console.log('Profile:', profile);
  console.log('====================');

  // Se está carregando, mostrar loading
  if (loading) {
    console.log('Mostrando loading...');
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
    console.log('Usuário não logado, mostrando LandingPage');
    return <LandingPage />;
  }

  // Se usuário está logado, verificar o role
  if (user && profile) {
    const isAdmin = profile.role && ['admin', 'gestor', 'analista'].includes(profile.role);
    
    // Debug logs
    console.log('=== DEBUG REDIRECIONAMENTO ===');
    console.log('User:', user);
    console.log('Profile:', profile);
    console.log('Role:', profile.role);
    console.log('isAdmin:', isAdmin);
    console.log('===============================');
    
    if (isAdmin) {
      console.log('Redirecionando para AdminPanel');
      return <AdminPanel />;
    } else {
      console.log('Redirecionando para UserDashboard');
      // Usuário comum (role: user, cliente, etc.) vai para UserDashboard
      return <UserDashboard />;
    }
  }

  // Se usuário está logado mas perfil é null, assumir usuário comum
  console.log('Usuário logado mas profile é null, assumindo usuário comum');
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
        </UserAuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
