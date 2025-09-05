# 🔧 Configuração do Storage via Interface Web - Supabase

Como o SQL direto não funciona para políticas de storage, siga este guia para configurar via interface web.

## 📋 Passo a Passo

### 1. Criar o Bucket
1. Acesse o **painel do Supabase**
2. Vá em **Storage** → **Buckets**
3. Clique em **"Create Bucket"**
4. Configure:
   - **Name**: `documentos`
   - **Public bucket**: ❌ **Desmarcar** (privado)
   - **File size limit**: `10485760` (10MB)
   - **Allowed MIME types**: `image/jpeg,image/png,application/pdf,image/jpg`
5. Clique **"Create bucket"**

### 2. Configurar Políticas RLS

Vá em **Storage** → **Policies** → Bucket "documentos" → **Add Policy**

#### Política 1: Ver próprios documentos
- **Policy name**: `Usuários podem ver seus próprios documentos`
- **Allowed operation**: `SELECT`
- **Target roles**: `authenticated`
- **USING expression**:
```sql
(storage.foldername(name))[1] = auth.uid()::text
```

#### Política 2: Upload em próprias pastas
- **Policy name**: `Usuários podem fazer upload em suas pastas`
- **Allowed operation**: `INSERT`
- **Target roles**: `authenticated`
- **WITH CHECK expression**:
```sql
(storage.foldername(name))[1] = auth.uid()::text
```

#### Política 3: Atualizar próprios documentos
- **Policy name**: `Usuários podem atualizar seus documentos`
- **Allowed operation**: `UPDATE`
- **Target roles**: `authenticated`
- **USING expression**:
```sql
(storage.foldername(name))[1] = auth.uid()::text
```
- **WITH CHECK expression**:
```sql
(storage.foldername(name))[1] = auth.uid()::text
```

#### Política 4: Deletar próprios documentos
- **Policy name**: `Usuários podem deletar seus documentos`
- **Allowed operation**: `DELETE`
- **Target roles**: `authenticated`
- **USING expression**:
```sql
(storage.foldername(name))[1] = auth.uid()::text
```

#### Política 5: Admins veem tudo (Opcional)
- **Policy name**: `Admins podem ver todos os documentos`
- **Allowed operation**: `SELECT`
- **Target roles**: `authenticated`
- **USING expression**:
```sql
EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() 
  AND profiles.role = 'admin' 
  AND profiles.is_active = true
)
```

### 3. Verificar Configuração

Execute no **SQL Editor**:

```sql
-- Verificar se o bucket foi criado
SELECT name, public, file_size_limit, allowed_mime_types, created_at
FROM storage.buckets 
WHERE name = 'documentos';

-- Verificar as políticas criadas
SELECT policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage'
AND policyname LIKE '%document%';
```

## ✅ Checklist de Configuração

- [ ] Bucket "documentos" criado (privado)
- [ ] Limite de 10MB configurado
- [ ] MIME types definidos (jpeg, png, pdf, jpg)
- [ ] 4-5 políticas RLS criadas
- [ ] Verificação via SQL executada com sucesso

## 🚨 Troubleshooting

### Problema: "Políticas não aparecem"
- Aguarde 1-2 minutos após criar
- Refresh na página
- Execute a query de verificação novamente

### Problema: "Upload falha com 403"
- Verificar se políticas estão ativas
- Confirmar que usuário está autenticado
- Verificar se a estrutura da pasta é `{user_id}/arquivo`

### Problema: "Bucket não encontrado"
- Verificar nome exato: `documentos` (sem acentos)
- Confirmar que foi criado como privado
- Aguardar propagação (1-2 minutos)

## 🔄 Teste Final

Após configurar, teste no código:

```javascript
// Testar se o bucket foi configurado corretamente
import { storageService } from '@/services/storage';

const testBucket = async () => {
  const initialized = await storageService.initializeBucket();
  console.log('Bucket configurado:', initialized);
};
```

---

**⚡ Dica**: É mais fácil configurar via interface web do que via SQL para storage policies!
