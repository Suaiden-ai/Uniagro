import { useIsMobile } from '@/hooks/use-mobile';

/**
 * Hook que retorna classes CSS condicionais baseadas no tipo de dispositivo
 * Útil para aplicar estilos diferentes entre mobile e desktop
 */
export const useMobileClasses = () => {
  const isMobile = useIsMobile();
  
  return {
    // Grid responsivo
    gridCols: isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-1 md:grid-cols-3 gap-4',
    
    // Flexbox responsivo
    flexDirection: isMobile ? 'flex-col space-y-3' : 'flex justify-between items-center',
    
    // Largura dos botões
    buttonWidth: isMobile ? 'w-full' : '',
    
    // Espaçamento vertical
    spaceY: isMobile ? 'space-y-4' : 'space-y-6',
    
    // Padding responsivo
    padding: isMobile ? 'p-4' : 'p-6 md:p-8',
    
    // Margin responsivo
    margin: isMobile ? 'mx-2' : 'mx-0',
    
    // Text size responsivo
    titleSize: isMobile ? 'text-lg' : 'text-xl',
    descSize: isMobile ? 'text-sm' : 'text-base',
    
    // Container responsivo
    container: isMobile ? 'max-w-full overflow-hidden px-2' : 'max-w-7xl mx-auto',
    
    // Card responsivo
    card: isMobile ? 'w-full max-w-full mx-2' : 'w-full',
    
    // Input responsivo
    input: isMobile ? 'h-12 text-base' : 'h-12',
    
    // Button group responsivo
    buttonGroup: isMobile ? 'space-y-3' : 'flex space-x-4'
  };
};

/**
 * Utilitário para condicionar classes baseado no tipo de dispositivo
 */
export const mobileCondition = (isMobile: boolean, mobileClass: string, desktopClass: string = '') => {
  return isMobile ? mobileClass : desktopClass;
};
