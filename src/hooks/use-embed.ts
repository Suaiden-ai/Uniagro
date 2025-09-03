import { useEffect } from 'react';

// Função para notificar o iframe pai sobre mudanças de altura
export function notifyParentResize() {
    if (window.parent !== window) {
        const height = Math.max(
            document.documentElement.scrollHeight,
            document.documentElement.offsetHeight,
            document.body.scrollHeight,
            document.body.offsetHeight
        );
        
        window.parent.postMessage({
            type: 'uniagro-resize',
            height: height
        }, '*');
    }
}

// Hook para usar em componentes React
export function useEmbedResize() {
    useEffect(() => {
        let hasNotified = false;
        let notifyTimeout: NodeJS.Timeout | null = null;

        // Função simples para notificar apenas uma vez
        const notifyResize = () => {
            if (hasNotified || notifyTimeout) return;
            
            notifyTimeout = setTimeout(() => {
                const height = Math.max(
                    document.documentElement.scrollHeight,
                    document.body.scrollHeight
                );
                
                // Limitar altura
                const finalHeight = Math.min(height, 1200);
                
                if (window.parent !== window && finalHeight > 500) {
                    window.parent.postMessage({
                        type: 'uniagro-resize',
                        height: finalHeight
                    }, '*');
                    
                    hasNotified = true; // Notificar apenas uma vez
                    console.log('📤 Tamanho enviado uma única vez:', finalHeight);
                }
                
                notifyTimeout = null;
            }, 2000); // Delay maior para garantir carregamento completo
        };

        // Apenas uma notificação após carregamento completo
        const loadTimer = setTimeout(notifyResize, 3000);

        return () => {
            if (notifyTimeout) clearTimeout(notifyTimeout);
            clearTimeout(loadTimer);
        };
    }, []);
}

// Verificar se está sendo executado dentro de um iframe
export function isInIframe(): boolean {
    return window.parent !== window;
}

// Função para detectar se está em modo embed
export function isEmbedMode(): boolean {
    return isInIframe() || window.location.search.includes('embed=true');
}
