# 🌱 Uniagro - Sistema de Embed

## Visão Geral

O sistema de embed do Uniagro permite incorporar o questionário em qualquer site através de um iframe responsivo e seguro.

## 🚀 Instalação Rápida

### 1. Incluir o Script

```html
<script src="https://seu-dominio.com/embed.js"></script>
```

### 2. Criar o Embed

#### Opção 1: Auto-inicialização (Recomendado)
```html
<div data-uniagro-embed 
     data-width="100%" 
     data-height="600px"
     data-auto-resize="true">
</div>
```

#### Opção 2: JavaScript Manual
```html
<div id="meu-questionario"></div>
<script>
    UniAgroEmbed.create('meu-questionario', {
        width: '100%',
        height: '600px',
        autoResize: true
    });
</script>
```

## 📋 Parâmetros Disponíveis

| Parâmetro | Tipo | Padrão | Descrição |
|-----------|------|--------|-----------|
| `width` | string | '100%' | Largura do iframe |
| `height` | string | '600px' | Altura do iframe |
| `questionarioId` | string | - | ID específico do questionário |
| `autoResize` | boolean | true | Redimensionamento automático |

### Data Attributes

| Atributo | Equivalente |
|----------|-------------|
| `data-width` | `width` |
| `data-height` | `height` |
| `data-questionario-id` | `questionarioId` |
| `data-auto-resize` | `autoResize` |

## 🛠️ API JavaScript

### `UniAgroEmbed.create(containerId, options)`
Cria um novo embed no container especificado.

```javascript
const iframe = UniAgroEmbed.create('container', {
    width: '800px',
    height: '700px',
    questionarioId: '123',
    autoResize: false
});
```

### `UniAgroEmbed.setBaseUrl(url)`
Configura a URL base do embed.

```javascript
UniAgroEmbed.setBaseUrl('https://meu-dominio.com');
```

### `UniAgroEmbed.getConfig()`
Retorna as configurações atuais.

```javascript
const config = UniAgroEmbed.getConfig();
console.log(config.baseUrl);
```

### `UniAgroEmbed.remove(iframe)`
Remove um embed específico.

```javascript
UniAgroEmbed.remove(iframe);
```

## 🎨 Personalização CSS

O iframe possui a classe CSS `uniagro-embed` que pode ser personalizada:

```css
.uniagro-embed {
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.15);
    transition: all 0.3s ease;
}

.uniagro-embed:hover {
    box-shadow: 0 6px 25px rgba(0,0,0,0.2);
}
```

## 📱 Responsividade

O embed é totalmente responsivo por padrão. Para maior controle:

```css
@media (max-width: 768px) {
    .uniagro-embed {
        height: 500px !important;
    }
}
```

## 🔒 Segurança

- **Sandbox**: O iframe usa sandbox para maior segurança
- **HTTPS**: Sempre use HTTPS em produção
- **CSP**: Compatible com Content Security Policy
- **Origem**: Verificação automática de origem para mensagens

## 🚀 Exemplos de Uso

### Site Corporativo
```html
<section class="questionario-section">
    <h2>Faça seu cadastro</h2>
    <div data-uniagro-embed 
         data-auto-resize="true"
         data-width="100%">
    </div>
</section>
```

### Blog WordPress
```html
<div class="wp-block-embed">
    <div data-uniagro-embed 
         data-height="500px">
    </div>
</div>
```

### Landing Page
```javascript
// Carregar embed após interação do usuário
document.getElementById('btn-questionario').addEventListener('click', function() {
    const container = document.getElementById('questionario-container');
    UniAgroEmbed.create(container, {
        autoResize: true,
        questionarioId: 'landing-123'
    });
});
```

## 🔧 Build e Deploy

### Desenvolvimento
```bash
npm run dev
```

### Build do Embed
```bash
npm run build:embed
```

### Build Completo
```bash
npm run build:all
```

Os arquivos do embed serão gerados em `dist-embed/` e `public/embed.js`.

## 📞 Suporte

- 📧 Email: suporte@uniagro.com
- 📚 Documentação: [docs.uniagro.com](https://docs.uniagro.com)
- 🐛 Issues: [GitHub Issues](https://github.com/seu-usuario/uniagro/issues)

## 🔄 Atualizações

### v1.0.0
- ✅ Sistema de embed básico
- ✅ Auto-resize
- ✅ Responsividade
- ✅ API JavaScript

### Roadmap
- 🔄 Temas personalizáveis
- 🔄 Callbacks de eventos
- 🔄 Multi-idiomas
- 🔄 Analytics integrado

---

**Desenvolvido com ❤️ pela equipe Uniagro**
