# Sistema de Upload de Documentos - Uniagro

Este documento explica como configurar e usar o sistema de upload de documentos na etapa 4 do questionário.

## 📁 Estrutura do Sistema

### Arquivos Criados/Modificados:
- `src/services/storage.ts` - Serviço para gerenciar uploads no Supabase Storage
- `src/services/database.ts` - Funções adicionais para salvar documentos
- `src/components/form-steps/DocumentacaoStep.tsx` - Etapa 4 com upload
- `scripts/add-document-urls.sql` - Script para adicionar colunas no banco
- `scripts/setup-storage-bucket.sql` - Script para configurar storage

## 🚀 Configuração do Supabase

### 1. Executar Scripts SQL

No SQL Editor do Supabase, execute na ordem:

```sql
-- 1. Adicionar colunas para URLs dos documentos
-- Execute o conteúdo de: scripts/add-document-urls.sql

-- 2. Configurar políticas RLS para storage
-- Execute o conteúdo de: scripts/setup-storage-bucket.sql
```

### 2. Criar Bucket via Interface

1. Acesse o painel do Supabase
2. Vá em **Storage** > **Buckets**
3. Clique em **Create Bucket**
4. Nome: `documentos`
5. **Público**: Desmarcar (privado)
6. **File size limit**: 10MB
7. **Allowed MIME types**: `image/jpeg,image/png,application/pdf,image/jpg`

## 📋 Como Funciona

### Fluxo de Upload:

1. **Usuário seleciona arquivos** na etapa 4 (DocumentacaoStep)
2. **Clica em "Salvar informações"**
3. **Sistema valida** os arquivos (tipo e tamanho)
4. **Faz upload** para Supabase Storage na pasta `/{user_id}/`
5. **Salva URLs** dos documentos na tabela `questionario_multistep`
6. **Mostra feedback** de sucesso/erro

### Validações Automáticas:
- ✅ Tipos aceitos: JPG, PNG, PDF
- ✅ Tamanho máximo: 5MB por arquivo
- ✅ RG e CPF são obrigatórios
- ✅ Nomes únicos para evitar conflitos

## 🔒 Segurança

### Políticas RLS (Row Level Security):
- Usuários só podem ver/editar seus próprios documentos
- Pasta isolada por usuário (`/{user_id}/nome_do_arquivo`)
- URLs assinadas com validade de 1 ano
- Admins podem visualizar todos os documentos

### Estrutura de Arquivos:
```
Bucket: documentos/
├── {user_id_1}/
│   ├── rg_1234567890_uuid.jpg
│   └── cpf_1234567890_uuid.pdf
├── {user_id_2}/
│   ├── rg_1234567890_uuid.png
│   └── cpf_1234567890_uuid.jpg
```

## 📊 Banco de Dados

### Colunas Adicionadas na tabela `questionario_multistep`:

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `documentacao_rg_url` | TEXT | URL do documento RG |
| `documentacao_cpf_url` | TEXT | URL do documento CPF |

### Exemplo de Uso:

```typescript
// Upload de documentos
const result = await saveDocumentacaoWithFiles(
  userId,
  formData,
  rgFile,
  cpfFile
);

if (result.success) {
  console.log('Documentos salvos com sucesso');
}
```

## 🛠️ Funções Principais

### `storageService.uploadDocuments()`
- Faz upload dos arquivos RG e CPF
- Retorna URLs assinadas
- Trata erros de upload

### `saveDocumentacaoWithFiles()`
- Salva dados básicos no banco
- Chama upload de documentos
- Atualiza URLs no banco de dados

### `uploadDocumentsAndUpdate()`
- Upload individual de documentos
- Atualização das URLs no registro existente

## 🔧 Desenvolvimento

### Testando o Upload:

1. **Executar scripts** SQL no Supabase
2. **Criar bucket** "documentos" 
3. **Reiniciar aplicação** (`npm run dev`)
4. **Acessar etapa 4** do questionário
5. **Selecionar arquivos** RG e CPF
6. **Clicar "Salvar"** e verificar console

### Debug:

```javascript
// Verificar arquivos no Storage
const files = await storageService.listUserFiles(userId);
console.log('Arquivos do usuário:', files);

// Verificar URLs no banco
const { data } = await supabase
  .from('questionario_multistep')
  .select('documentacao_rg_url, documentacao_cpf_url')
  .eq('user_id', userId);
```

## 📱 Interface do Usuário

### Componente FileUpload:
- **Drag & drop** de arquivos
- **Validação visual** de tipos e tamanhos
- **Preview** dos arquivos selecionados
- **Remoção** de arquivos antes do upload

### Feedback ao Usuário:
- ✅ **Sucesso**: "Documentos salvos e enviados com sucesso"
- ❌ **Erro de validação**: "Corrija os erros do formulário"
- ❌ **Erro de upload**: Mensagem específica do erro
- ⏳ **Carregamento**: Botão "Salvando..." com disable

## 🚨 Troubleshooting

### Problemas Comuns:

1. **Erro: "Bucket não existe"**
   - Criar bucket "documentos" no Supabase Storage

2. **Erro: "Permissão negada"**
   - Executar script de políticas RLS
   - Verificar se usuário está autenticado

3. **Arquivo não aceito**
   - Verificar se é JPG, PNG ou PDF
   - Tamanho máximo 5MB

4. **URLs não salvam no banco**
   - Executar script add-document-urls.sql
   - Verificar se colunas foram criadas

### Logs para Debug:
```javascript
// Ativar logs detalhados
console.log('Upload result:', uploadResult);
console.log('Database update:', updateData);
console.log('Final result:', result);
```

## 🔄 Próximos Passos

- [ ] Implementar preview de documentos enviados
- [ ] Adicionar opção para substituir documentos
- [ ] Implementar compressão automática de imagens
- [ ] Adicionar mais tipos de documentos (CNH, Carteira de Trabalho)
- [ ] Implementar relatório de documentos para admins

---

**Desenvolvido com ❤️ pela equipe Uniagro**
