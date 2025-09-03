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
        let resizeTimeout: NodeJS.Timeout | null = null;
        let lastHeight = 0;

        // Função para calcular altura precisa
        const calculateHeight = () => {
            // Aguardar renderização completa
            return new Promise<number>((resolve) => {
                setTimeout(() => {
                    const heights = [
                        document.documentElement.scrollHeight,
                        document.documentElement.offsetHeight,
                        document.body.scrollHeight,
                        document.body.offsetHeight
                    ];
                    
                    const maxHeight = Math.max(...heights);
                    console.log('📐 Alturas calculadas:', heights, 'Máximo:', maxHeight);
                    resolve(maxHeight);
                }, 100);
            });
        };

        // Função para notificar resize
        const notifyResize = async () => {
            if (resizeTimeout) clearTimeout(resizeTimeout);
            
            resizeTimeout = setTimeout(async () => {
                const height = await calculateHeight();
                
                // Evitar mudanças muito pequenas
                if (Math.abs(height - lastHeight) < 20) return;
                
                // Limitar altura máxima
                const maxHeight = 2500;
                const finalHeight = Math.min(height, maxHeight);
                
                if (window.parent !== window) {
                    window.parent.postMessage({
                        type: 'uniagro-resize',
                        height: finalHeight
                    }, '*');
                    
                    lastHeight = finalHeight;
                    console.log('📤 Enviado novo tamanho:', finalHeight);
                }
            }, 200);
        };

        // Responder a solicitações de tamanho
        const messageHandler = (event: MessageEvent) => {
            if (event.data.type === 'uniagro-request-size') {
                console.log('📥 Solicitação de tamanho recebida');
                notifyResize();
            }
        };

        window.addEventListener('message', messageHandler);

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
            attributes: false
        });

        // Medições iniciais
        setTimeout(notifyResize, 1000);
        setTimeout(notifyResize, 3000); // Segunda verificação

        return () => {
            if (resizeObserver) {
                resizeObserver.disconnect();
            }
            if (resizeTimeout) {
                clearTimeout(resizeTimeout);
            }
            window.removeEventListener('resize', notifyResize);
            window.removeEventListener('message', messageHandler);
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
