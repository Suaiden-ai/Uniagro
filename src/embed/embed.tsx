import React from 'react';
import { SinglePageForm } from '@/components/SinglePageForm';
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
          <div className="container mx-auto p-4">
            <SinglePageForm />
          </div>
        </EmbedWrapper>
      </TooltipProvider>
    </QueryClientProvider>
  );
};