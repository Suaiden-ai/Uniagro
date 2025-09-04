import React from 'react';
import { useEmbedResize, isEmbedMode } from '@/hooks/use-embed';

interface EmbedWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export const EmbedWrapper: React.FC<EmbedWrapperProps> = ({ 
  children, 
  className = '' 
}) => {
  // Hook para auto-resize quando em iframe
  useEmbedResize();

  const embedMode = isEmbedMode();

  return (
    <div 
      className={`
        ${embedMode ? 'embed-mode' : ''} 
        ${className}
      `}
      style={{
        minHeight: embedMode ? 'auto' : '100vh',
        padding: embedMode ? '8px' : undefined,
        background: embedMode ? 'transparent' : undefined
      }}
    >
      {children}
    </div>
  );
};