-- Script de teste para a nova tabela questionario_multistep
-- Execute este script após criar a tabela para verificar se está funcionando

-- 1. Verificar se a tabela foi criada
SELECT 
    table_name, 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'questionario_multistep' 
ORDER BY ordinal_position;

-- 2. Verificar se os índices foram criados
SELECT 
    indexname, 
    indexdef
FROM pg_indexes 
WHERE tablename = 'questionario_multistep';

-- 3. Verificar se o trigger foi criado
SELECT 
    trigger_name, 
    event_manipulation, 
    action_statement
FROM information_schema.triggers 
WHERE event_object_table = 'questionario_multistep';

-- 4. Testar inserção de dados de exemplo
INSERT INTO questionario_multistep (
    uuid_usuario,
    user_id,
    nome_completo,
    telefone,
    localidade,
    estado,
    qtd_filhos,
    versao_questionario,
    status_completo,
    etapas_completas,
    total_etapas,
    -- Dados de renda para teste
    renda_profissao1,
    renda_profissao1_valor,
    renda_profissao2,
    renda_profissao2_valor,
    renda_profissao3,
    renda_profissao3_valor,
    renda_total,
    renda_possui_financiamento_ativo,
    renda_banco_financiamento,
    renda_tem_veiculo,
    renda_qual_veiculo,
    renda_casa_propria,
    renda_onde_casa_propria
) VALUES (
    gen_random_uuid(),
    'test-user-123',
    'João da Silva Teste',
    '11999999999',
    'São Paulo',
    'SP',
    2,
    '2.0',
    false,
    1,
    12,
    'Agricultor',
    5000.00,
    'Motorista',
    2000.00,
    'Comerciante',
    1000.00,
    8000.00,
    true,
    'Banco do Brasil',
    true,
    'Carro',
    true,
    'Centro da cidade'
);

-- 5. Verificar se os dados foram inseridos
SELECT 
    id,
    uuid_usuario,
    user_id,
    nome_completo,
    renda_profissao1,
    renda_profissao1_valor,
    renda_total,
    versao_questionario,
    status_completo,
    etapas_completas,
    timestamp_cadastro,
    timestamp_atualizacao
FROM questionario_multistep 
WHERE user_id = 'test-user-123';

-- 6. Testar atualização de dados
UPDATE questionario_multistep 
SET 
    renda_profissao1_valor = 6000.00,
    renda_total = 9000.00,
    etapas_completas = 2,
    timestamp_atualizacao = NOW()
WHERE user_id = 'test-user-123';

-- 7. Verificar se a atualização funcionou e o trigger atualizou o timestamp
SELECT 
    id,
    renda_profissao1_valor,
    renda_total,
    etapas_completas,
    timestamp_cadastro,
    timestamp_atualizacao
FROM questionario_multistep 
WHERE user_id = 'test-user-123';

-- 8. Limpar dados de teste
DELETE FROM questionario_multistep WHERE user_id = 'test-user-123';

-- 9. Verificar se a limpeza funcionou
SELECT COUNT(*) as total_registros FROM questionario_multistep WHERE user_id = 'test-user-123';

-- 10. Verificar constraints e chaves únicas
SELECT 
    constraint_name, 
    constraint_type,
    table_name
FROM information_schema.table_constraints 
WHERE table_name = 'questionario_multistep';
