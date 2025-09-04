import React from 'react';
import Index from '@/pages/Index';
import { EmbedWrapper } from '@/components/EmbedWrapper';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export const EmbedApp: React.FC = () => {
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
};