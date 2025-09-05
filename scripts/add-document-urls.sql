-- Script para adicionar campos de URLs de documentos na tabela questionario_multistep

-- Adicionar colunas para URLs dos documentos
ALTER TABLE questionario_multistep 
ADD COLUMN IF NOT EXISTS documentacao_rg_url TEXT,
ADD COLUMN IF NOT EXISTS documentacao_cpf_url TEXT;

-- Comentários para documentar as colunas
COMMENT ON COLUMN questionario_multistep.documentacao_rg_url IS 'URL do documento RG armazenado no Supabase Storage';
COMMENT ON COLUMN questionario_multistep.documentacao_cpf_url IS 'URL do documento CPF armazenado no Supabase Storage';

-- Configurar RLS (Row Level Security) se necessário
-- As políticas existentes já devem cobrir estas colunas pois seguem o padrão da tabela

-- Verificar se as colunas foram criadas
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'questionario_multistep' 
AND column_name IN ('documentacao_rg_url', 'documentacao_cpf_url');
