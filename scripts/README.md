# Script de Configuração da Autenticação Admin

Este script configura a autenticação de administradores integrada com o Supabase Authentication.

## Como usar:

### 1. Execute o Script SQL
- Vá para: https://supabase.com/dashboard/project/ycmclhodbxgujrdsrijs
- Entre na seção **"SQL Editor"**
- Execute o script `flexible-system.sql` (sistema mais flexível)

### 2. Como Funciona:
✅ **Qualquer usuário** criado no Authentication vira automaticamente um registro na tabela `profiles`
✅ **Por padrão** todos são criados como `role: user` e `is_active: false`
✅ **Você controla** quem é admin diretamente no banco de dados

### 3. Gerenciar Administradores:

#### Para tornar alguém admin:
```sql
UPDATE profiles 
SET role = 'admin', is_active = true 
WHERE email = 'usuario@exemplo.com';
```

#### Para desativar alguém:
```sql
UPDATE profiles 
SET is_active = false 
WHERE email = 'usuario@exemplo.com';
```

#### Para ver todos os perfis:
```sql
SELECT id, email, name, role, is_active, created_at 
FROM profiles 
ORDER BY created_at DESC;
```

### 4. Roles disponíveis:
- **`admin`** - Acesso total ao dashboard
- **`gestor`** - Acesso de gestão 
- **`analista`** - Acesso de análise
- **`user`** - Usuário comum (sem acesso admin)

## 🔒 Sistema de Segurança:

### Controle Total:
✅ **Sem lista hardcoded** - Controle 100% via banco
✅ **Flexibilidade total** - Adicione/remova admins quando quiser
✅ **Auditoria completa** - Veja histórico na tabela
✅ **Desativação fácil** - Remova acesso sem deletar dados

### Autenticação Dupla:
1. **Supabase Auth**: Valida email/senha
2. **Tabela profiles**: Verifica se é admin ativo (`role = admin` E `is_active = true`)

### Row Level Security (RLS):
- ✅ Usuários só podem ver/editar seu próprio perfil
- ✅ Apenas emails autorizados podem virar admin

### Emails Autorizados:
Apenas estes emails podem se tornar administradores:
- `admin@uniagro.com`
- `gestor@uniagro.com`
- `analista@uniagro.com`

## 📋 Estrutura da Tabela:

```sql
profiles:
- id (UUID, referencia auth.users.id)
- email (VARCHAR, Unique)
- name (VARCHAR)
- role (VARCHAR: admin, gestor, analista)
- is_active (BOOLEAN)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

## ⚠️ Para Produção:

1. **Altere a lista de emails autorizados** na função `handle_new_admin_user()`
2. **Use senhas fortes** nas contas do Authentication
3. **Configure 2FA** no Supabase para maior segurança
4. **Monitore logs** de acesso admin
