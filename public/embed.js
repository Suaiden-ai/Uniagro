(function() {
    'use strict';
    
    // Configurações do embed
    const EMBED_CONFIG = {
        baseUrl: window.location.origin, // URL atual do projeto
        defaultWidth: '100%',
        defaultHeight: '600px',
        className: 'uniagro-embed'
    };

    // Função para criar o iframe
    function createIframe(containerId, options = {}) {
        const container = typeof containerId === 'string' 
            ? document.getElementById(containerId) 
            : containerId;
            
        if (!container) {
            console.error(`Container com ID '${containerId}' não encontrado`);
            return null;
        }

        const iframe = document.createElement('iframe');
        
        // Configurações do iframe
        iframe.src = `${EMBED_CONFIG.baseUrl}${options.questionarioId ? `?questionario=${options.questionarioId}` : ''}`;
        iframe.width = options.width || EMBED_CONFIG.defaultWidth;
        iframe.height = options.height || EMBED_CONFIG.defaultHeight;
        iframe.frameBorder = '0';
        iframe.className = EMBED_CONFIG.className;
        iframe.style.border = 'none';
        iframe.style.borderRadius = '8px';
        iframe.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        iframe.style.maxWidth = '100%';
        
        // Atributos de segurança e acessibilidade
        iframe.setAttribute('allowfullscreen', 'true');
        iframe.setAttribute('allow', 'clipboard-write; web-share');
        iframe.setAttribute('loading', 'lazy');
        iframe.setAttribute('title', 'Questionário Uniagro');
        iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-forms allow-popups');

        container.appendChild(iframe);
        return iframe;
    }

    // Função para redimensionar automaticamente o iframe
    function setupAutoResize(iframe) {
        window.addEventListener('message', function(event) {
            // Verificar origem por segurança
            if (event.origin !== EMBED_CONFIG.baseUrl) return;
            
            if (event.data.type === 'uniagro-resize' && event.data.height) {
                iframe.style.height = event.data.height + 'px';
            }
        });
    }

    // API pública do UniAgroEmbed
    window.UniAgroEmbed = {
        // Método principal para criar embed
        create: function(containerId, options = {}) {
            const iframe = createIframe(containerId, options);
            if (iframe && options.autoResize !== false) {
                setupAutoResize(iframe);
            }
            return iframe;
        },

        // Método para configurar a URL base
        setBaseUrl: function(url) {
            EMBED_CONFIG.baseUrl = url.replace(/\/$/, '');
        },

        // Método para obter configurações atuais
        getConfig: function() {
            return { ...EMBED_CONFIG };
        },

        // Método para remover embed
        remove: function(iframe) {
            if (iframe && iframe.parentNode) {
                iframe.parentNode.removeChild(iframe);
            }
        }
    };

    // Auto-inicialização baseada em data-attributes
    function initializeAutoEmbeds() {
        const autoEmbeds = document.querySelectorAll('[data-uniagro-embed]');
        
        autoEmbeds.forEach(function(element) {
            // Evitar inicialização dupla
            if (element.hasAttribute('data-uniagro-initialized')) {
                return;
            }

            const options = {
                questionarioId: element.getAttribute('data-questionario-id'),
                width: element.getAttribute('data-width'),
                height: element.getAttribute('data-height'),
                autoResize: element.getAttribute('data-auto-resize') !== 'false'
            };

            const containerId = element.id || 'uniagro-' + Math.random().toString(36).substr(2, 9);
            if (!element.id) {
                element.id = containerId;
            }

            const iframe = createIframe(element, options);
            if (iframe && options.autoResize) {
                setupAutoResize(iframe);
            }

            element.setAttribute('data-uniagro-initialized', 'true');
        });
    }

    // Inicializar quando DOM estiver pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeAutoEmbeds);
    } else {
        initializeAutoEmbeds();
    }

    // Observer para elementos adicionados dinamicamente
    if (typeof MutationObserver !== 'undefined') {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1) { // ELEMENT_NODE
                        if (node.hasAttribute && node.hasAttribute('data-uniagro-embed')) {
                            initializeAutoEmbeds();
                        }
                        // Verificar elementos filhos
                        const embeds = node.querySelectorAll && node.querySelectorAll('[data-uniagro-embed]');
                        if (embeds && embeds.length > 0) {
                            initializeAutoEmbeds();
                        }
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
})();
