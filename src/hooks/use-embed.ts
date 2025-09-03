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
        let resizeObserver: ResizeObserver | null = null;

        // Função para notificar resize
        const notifyResize = () => {
            notifyParentResize();
        };

        // Observer para mudanças no DOM
        if (typeof ResizeObserver !== 'undefined') {
            resizeObserver = new ResizeObserver(notifyResize);
            resizeObserver.observe(document.body);
        }

        // Listener para mudanças na janela
        window.addEventListener('resize', notifyResize);
        
        // Observer para mudanças no DOM
        const mutationObserver = new MutationObserver(notifyResize);
        mutationObserver.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true
        });

        // Primeira medição
        setTimeout(notifyResize, 100);

        return () => {
            if (resizeObserver) {
                resizeObserver.disconnect();
            }
            window.removeEventListener('resize', notifyResize);
            mutationObserver.disconnect();
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
