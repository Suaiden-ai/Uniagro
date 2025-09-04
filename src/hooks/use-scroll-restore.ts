import { useEffect, useLayoutEffect } from 'react';

export const useScrollRestore = (key: string, enabled: boolean = true) => {
  const storageKey = `scroll_${key}`;

  const saveScrollPosition = () => {
    if (!enabled) return;
    try {
      const scrollY = window.scrollY;
      sessionStorage.setItem(storageKey, scrollY.toString());
    } catch (error) {
      console.warn('Erro ao salvar posição do scroll:', error);
    }
  };

  const restoreScrollPosition = () => {
    if (!enabled) return;
    try {
      const scrollY = sessionStorage.getItem(storageKey);
      
      if (scrollY && parseInt(scrollY) > 0) {
        const scrollTop = parseInt(scrollY);
        
        // Múltiplas tentativas para garantir que o scroll seja restaurado
        const restore = () => {
          window.scrollTo({
            top: scrollTop,
            behavior: 'instant'
          });
        };

        // Tentar imediatamente
        restore();
        
        // E depois de um pequeno delay para garantir que o DOM esteja pronto
        setTimeout(restore, 10);
        setTimeout(restore, 50);
        setTimeout(restore, 100);
        setTimeout(restore, 200);
      }
    } catch (error) {
      console.warn('Erro ao restaurar posição do scroll:', error);
    }
  };

  // Usar useLayoutEffect para restaurar antes da renderização
  useLayoutEffect(() => {
    if (enabled) {
      restoreScrollPosition();
    }
  }, []);

  // Salvar posição durante o scroll
  useEffect(() => {
    if (!enabled) return;

    let timeoutId: NodeJS.Timeout;
    
    const handleScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(saveScrollPosition, 100);
    };

    const handleBeforeUnload = () => {
      saveScrollPosition();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Salvar quando o componente for desmontado
    return () => {
      clearTimeout(timeoutId);
      saveScrollPosition();
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [enabled]);

  // Função para limpar dados salvos
  const clearScrollData = () => {
    try {
      sessionStorage.removeItem(storageKey);
    } catch (error) {
      console.warn('Erro ao limpar dados do scroll:', error);
    }
  };

  return { saveScrollPosition, restoreScrollPosition, clearScrollData };
};
