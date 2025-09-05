# Configuração do Template de Email de Confirmação - UNIAGRO

## 📧 Templates Criados

Foram criados dois templates de email para confirmação de conta:

1. **`email-confirmation-template.html`** - Template completo com design avançado
2. **`email-confirmation-template-simple.html`** - Template simplificado para compatibilidade

## 🎨 Características dos Templates

### Design Visual
- **Cores da UNIAGRO**: Verde principal (#2E7D32) e verde claro (#66BB6A)
- **Logo**: Placeholder para o logo da UNIAGRO
- **Tipografia**: Fontes modernas e legíveis
- **Layout**: Responsivo para desktop e mobile

### Conteúdo
- **Saudação personalizada** com o nome do usuário
- **Instruções claras** sobre como confirmar a conta
- **Informações sobre a UNIAGRO** e sua missão
- **Dados de contato** da organização
- **Avisos de segurança** sobre o link de confirmação

## ⚙️ Como Configurar no Supabase

### 1. Acesse o Painel do Supabase
1. Faça login no [Supabase Dashboard](https://app.supabase.com)
2. Selecione seu projeto
3. Vá para **Authentication** > **Email Templates**

### 2. Configure o Template de Confirmação
1. Clique em **Confirm signup**
2. Cole o conteúdo do arquivo `email-confirmation-template.html` no campo **Body**
3. Configure o **Subject** como: `Confirme sua conta na UNIAGRO Brasil`
4. Salve as alterações

### 3. Variáveis Disponíveis
O template utiliza as seguintes variáveis do Supabase:
- `{{user_name}}` - Nome do usuário
- `{{confirmation_url}}` - URL de confirmação gerada pelo Supabase

### 4. Personalizações Recomendadas

#### Substituir o Logo
```html
<!-- Substitua esta linha: -->
<img src="https://via.placeholder.com/80x80/2E7D32/FFFFFF?text=UNIAGRO" alt="UNIAGRO Brasil" class="logo">

<!-- Por: -->
<img src="https://seu-dominio.com/uniagro-logo.png" alt="UNIAGRO Brasil" class="logo">
```

#### Ajustar URLs de Contato
Atualize as informações de contato no template conforme necessário:
- Email: `institucional@uniagro.com.br`
- Telefone: `+1 (407) 533-3005`
- Site: `@uniagro.brasil`

### 5. Teste o Template
1. Crie uma conta de teste
2. Verifique se o email é enviado corretamente
3. Teste o link de confirmação
4. Verifique a renderização em diferentes clientes de email

## 🔧 Configurações Adicionais do Supabase

### Configurar SMTP (Opcional)
Se quiser usar um provedor SMTP personalizado:
1. Vá para **Settings** > **Auth**
2. Configure **SMTP Settings**
3. Use suas credenciais de email

### Configurar Domínio de Email
1. Vá para **Settings** > **Auth**
2. Configure **Site URL** com seu domínio
3. Adicione domínios permitidos se necessário

## 📱 Compatibilidade

### Clientes de Email Suportados
- ✅ Gmail
- ✅ Outlook
- ✅ Apple Mail
- ✅ Yahoo Mail
- ✅ Thunderbird

### Dispositivos
- ✅ Desktop
- ✅ Mobile
- ✅ Tablet

## 🚀 Próximos Passos

1. **Configure o template** no Supabase
2. **Teste o fluxo completo** de cadastro
3. **Monitore os emails** enviados
4. **Ajuste conforme necessário** baseado no feedback

## 📞 Suporte

Se precisar de ajuda com a configuração:
- Consulte a [documentação do Supabase](https://supabase.com/docs/guides/auth/email-templates)
- Entre em contato com a equipe de desenvolvimento

---

**Template criado para UNIAGRO Brasil**  
*Plataforma digital para o agronegócio brasileiro*
