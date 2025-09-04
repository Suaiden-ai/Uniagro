# Nova Tabela do Questionário Multi-Step

## Visão Geral

Foi criada uma nova tabela `questionario_multistep` para armazenar os dados do novo questionário multi-step versão 2.0. Esta tabela é separada da tabela `cadastro_inicial` para manter compatibilidade com a versão anterior.

## Estrutura da Tabela

### Campos de Identificação e Controle
- `id`: UUID primário gerado automaticamente
- `uuid_usuario`: UUID único do usuário
- `timestamp_cadastro`: Data/hora de criação do registro
- `timestamp_atualizacao`: Data/hora da última atualização (atualizada automaticamente)
- `user_id`: ID do usuário (único)

### Campos de Dados Básicos
- `nome_completo`: Nome completo (obrigatório)
- `telefone`, `cep`, `logradouro`, `numero`, `complemento`, `bairro`
- `localidade`, `estado`, `estado_civil`
- `qtd_filhos`: Quantidade de filhos
- `sexo`: Sexo do proprietário

### Seções do Questionário
1. **Entidade**: Dados da cooperativa/entidade
2. **Dirigente**: Dados do dirigente principal
3. **Proprietário**: Dados pessoais do proprietário
4. **Documentação**: Documentos oficiais (RG, CPF, etc.)
5. **Renda & Finanças**: Informações financeiras e renda
6. **Saúde**: Informações de saúde
7. **Propriedade Rural**: Dados da propriedade
8. **Infraestrutura**: Energia, água, estradas, etc.
9. **Produção Agrícola**: Cultivos e plantações
10. **Comunicação**: Internet, TV, rádio
11. **Habitação**: Casa, banheiro, saneamento
12. **Família**: Informações familiares (JSON)

### Campos de Controle de Versão
- `versao_questionario`: Versão do questionário (2.0)
- `status_completo`: Se o questionário foi completamente preenchido
- `etapas_completas`: Número de etapas completadas
- `total_etapas`: Total de etapas (12)

## Scripts Disponíveis

### 1. Criação da Tabela
```sql
-- Execute este script para criar a nova tabela
\i scripts/create-questionario-multistep-table.sql
```

### 2. Teste da Tabela
```sql
-- Execute este script para testar a nova tabela
\i scripts/test-questionario-multistep-table.sql
```

## Características Técnicas

### Índices
- `idx_questionario_multistep_user_id`: Índice no user_id
- `idx_questionario_multistep_uuid_usuario`: Índice no uuid_usuario
- `idx_questionario_multistep_cpf`: Índice no CPF
- `idx_questionario_multistep_timestamp`: Índice no timestamp

### Triggers
- **Trigger de atualização automática**: Atualiza `timestamp_atualizacao` automaticamente quando o registro é modificado

### Constraints
- **Chave única**: `user_id` deve ser único
- **Chave primária**: `id` (UUID)

### Tipos de Dados
- **DECIMAL(10,2)**: Para valores monetários e áreas
- **JSONB**: Para dados estruturados da família
- **BOOLEAN**: Para campos sim/não
- **VARCHAR**: Para textos com tamanhos específicos
- **TEXT**: Para textos longos

## Migração dos Dados

### Vantagens da Nova Tabela
1. **Estrutura limpa**: Organizada especificamente para o questionário multi-step
2. **Tipos de dados corretos**: DECIMAL para valores monetários, JSONB para dados estruturados
3. **Campos de controle**: Versão, status de conclusão, etapas completadas
4. **Performance**: Índices otimizados para consultas frequentes
5. **Manutenibilidade**: Separada da tabela antiga, sem conflitos

### Compatibilidade
- A tabela `cadastro_inicial` continua funcionando para a versão anterior
- A nova tabela `questionario_multistep` é usada apenas para o novo questionário
- Não há conflito entre as duas versões

## Uso no Código

### Interface TypeScript
```typescript
import { QuestionarioMultiStep } from '@/lib/supabase';
```

### Funções de Banco
```typescript
// Salvar dados parciais (a cada etapa)
await savePartialMultiStepFormData(formData, userId, isUpdate, existingUuid);

// Verificar se existe registro
await checkExistingRecord(userId);
```

### Mapeamento de Dados
```typescript
// Mapear dados do formulário para a nova tabela
const cadastroData = mapMultiStepFormDataToNewTable(formData, userId, existingUuid, isUpdate);
```

## Monitoramento

### Logs Importantes
- Dados de renda recebidos e mapeados
- Operações de inserção/atualização
- Erros de validação e constraints

### Métricas Úteis
- Total de questionários iniciados
- Taxa de conclusão por etapa
- Tempo médio de preenchimento
- Dados mais comuns por região

## Próximos Passos

1. **Executar o script de criação** no Supabase
2. **Testar a nova tabela** com dados de exemplo
3. **Atualizar o frontend** para usar a nova tabela
4. **Migrar dados existentes** (se necessário)
5. **Monitorar performance** e ajustar índices se necessário

## Suporte

Para dúvidas ou problemas:
1. Verificar logs do console do navegador
2. Verificar logs do Supabase
3. Executar scripts de teste
4. Consultar documentação da API do Supabase
