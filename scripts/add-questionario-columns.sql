-- Script para adicionar colunas do questionário multi-step na tabela cadastro_inicial
-- Execute no Supabase SQL Editor

-- 1. Verificar estrutura atual da tabela
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'cadastro_inicial' AND table_schema = 'public'
ORDER BY column_name;

-- 2. Adicionar colunas para Dados da Entidade
ALTER TABLE cadastro_inicial ADD COLUMN IF NOT EXISTS entidade_nome VARCHAR(255);
ALTER TABLE cadastro_inicial ADD COLUMN IF NOT EXISTS entidade_municipio VARCHAR(100);
ALTER TABLE cadastro_inicial ADD COLUMN IF NOT EXISTS entidade_estado VARCHAR(2);
ALTER TABLE cadastro_inicial ADD COLUMN IF NOT EXISTS entidade_numero_socios_informados INTEGER;
ALTER TABLE cadastro_inicial ADD COLUMN IF NOT EXISTS entidade_numero_socios_plataforma INTEGER;
ALTER TABLE cadastro_inicial ADD COLUMN IF NOT EXISTS entidade_cnpj VARCHAR(18);
ALTER TABLE cadastro_inicial ADD COLUMN IF NOT EXISTS entidade_endereco TEXT;
ALTER TABLE cadastro_inicial ADD COLUMN IF NOT EXISTS entidade_email VARCHAR(255);
ALTER TABLE cadastro_inicial ADD COLUMN IF NOT EXISTS entidade_link_site VARCHAR(500);
ALTER TABLE cadastro_inicial ADD COLUMN IF NOT EXISTS entidade_link_redes_sociais VARCHAR(500);
ALTER TABLE cadastro_inicial ADD COLUMN IF NOT EXISTS entidade_conta_bancaria VARCHAR(50);
ALTER TABLE cadastro_inicial ADD COLUMN IF NOT EXISTS entidade_banco VARCHAR(100);

-- 3. Adicionar colunas para Dados do Dirigente
ALTER TABLE cadastro_inicial ADD COLUMN IF NOT EXISTS dirigente_nome VARCHAR(255);
ALTER TABLE cadastro_inicial ADD COLUMN IF NOT EXISTS dirigente_apelido VARCHAR(100);
ALTER TABLE cadastro_inicial ADD COLUMN IF NOT EXISTS dirigente_rg VARCHAR(20);
ALTER TABLE cadastro_inicial ADD COLUMN IF NOT EXISTS dirigente_cpf VARCHAR(14);
ALTER TABLE cadastro_inicial ADD COLUMN IF NOT EXISTS dirigente_endereco TEXT;
ALTER TABLE cadastro_inicial ADD COLUMN IF NOT EXISTS dirigente_telefone VARCHAR(20);

-- 4. Adicionar colunas para Dados Pessoais do Proprietário
ALTER TABLE cadastro_inicial ADD COLUMN IF NOT EXISTS proprietario_nome VARCHAR(255);
ALTER TABLE cadastro_inicial ADD COLUMN IF NOT EXISTS proprietario_sexo VARCHAR(20);
ALTER TABLE cadastro_inicial ADD COLUMN IF NOT EXISTS proprietario_cor_pele VARCHAR(50);
ALTER TABLE cadastro_inicial ADD COLUMN IF NOT EXISTS proprietario_religiao VARCHAR(100);
ALTER TABLE cadastro_inicial ADD COLUMN IF NOT EXISTS proprietario_time VARCHAR(100);
ALTER TABLE cadastro_inicial ADD COLUMN IF NOT EXISTS proprietario_esporte_preferido VARCHAR(100);
ALTER TABLE cadastro_inicial ADD COLUMN IF NOT EXISTS proprietario_musica VARCHAR(100);
ALTER TABLE cadastro_inicial ADD COLUMN IF NOT EXISTS proprietario_artista VARCHAR(100);

-- 5. Adicionar colunas para Documentação Pessoal
ALTER TABLE cadastro_inicial ADD COLUMN IF NOT EXISTS documentacao_rg VARCHAR(20);
ALTER TABLE cadastro_inicial ADD COLUMN IF NOT EXISTS documentacao_cpf VARCHAR(14);
ALTER TABLE cadastro_inicial ADD COLUMN IF NOT EXISTS documentacao_data_nascimento DATE;
ALTER TABLE cadastro_inicial ADD COLUMN IF NOT EXISTS documentacao_idade INTEGER;
ALTER TABLE cadastro_inicial ADD COLUMN IF NOT EXISTS documentacao_nis VARCHAR(20);
ALTER TABLE cadastro_inicial ADD COLUMN IF NOT EXISTS documentacao_pis VARCHAR(20);
ALTER TABLE cadastro_inicial ADD COLUMN IF NOT EXISTS documentacao_caf BOOLEAN DEFAULT FALSE;
ALTER TABLE cadastro_inicial ADD COLUMN IF NOT EXISTS documentacao_cartao_produtor VARCHAR(50);

-- 6. Adicionar colunas para Renda & Finanças
ALTER TABLE cadastro_inicial ADD COLUMN IF NOT EXISTS renda_profissao1 VARCHAR(100);
ALTER TABLE cadastro_inicial ADD COLUMN IF NOT EXISTS renda_profissao1_valor DECIMAL(10,2);
ALTER TABLE cadastro_inicial ADD COLUMN IF NOT EXISTS renda_profissao2 VARCHAR(100);
ALTER TABLE cadastro_inicial ADD COLUMN IF NOT EXISTS renda_profissao2_valor DECIMAL(10,2);
ALTER TABLE cadastro_inicial ADD COLUMN IF NOT EXISTS renda_profissao3 VARCHAR(100);
ALTER TABLE cadastro_inicial ADD COLUMN IF NOT EXISTS renda_profissao3_valor DECIMAL(10,2);
ALTER TABLE cadastro_inicial ADD COLUMN IF NOT EXISTS renda_total DECIMAL(10,2);
ALTER TABLE cadastro_inicial ADD COLUMN IF NOT EXISTS renda_possui_financiamento_ativo BOOLEAN DEFAULT FALSE;
ALTER TABLE cadastro_inicial ADD COLUMN IF NOT EXISTS renda_banco_financiamento VARCHAR(100);
ALTER TABLE cadastro_inicial ADD COLUMN IF NOT EXISTS renda_tem_veiculo BOOLEAN DEFAULT FALSE;
ALTER TABLE cadastro_inicial ADD COLUMN IF NOT EXISTS renda_qual_veiculo VARCHAR(100);
ALTER TABLE cadastro_inicial ADD COLUMN IF NOT EXISTS renda_casa_propria BOOLEAN DEFAULT FALSE;
ALTER TABLE cadastro_inicial ADD COLUMN IF NOT EXISTS renda_onde_casa_propria VARCHAR(255);

-- 7. Adicionar colunas para Saúde
ALTER TABLE cadastro_inicial ADD COLUMN IF NOT EXISTS saude_tem_deficiencia BOOLEAN DEFAULT FALSE;
ALTER TABLE cadastro_inicial ADD COLUMN IF NOT EXISTS saude_qual_deficiencia TEXT;
ALTER TABLE cadastro_inicial ADD COLUMN IF NOT EXISTS saude_tem_cromoidade BOOLEAN DEFAULT FALSE;
ALTER TABLE cadastro_inicial ADD COLUMN IF NOT EXISTS saude_qual_cromoidade TEXT;
ALTER TABLE cadastro_inicial ADD COLUMN IF NOT EXISTS saude_faz_tratamento BOOLEAN DEFAULT FALSE;
ALTER TABLE cadastro_inicial ADD COLUMN IF NOT EXISTS saude_qual_tratamento TEXT;
ALTER TABLE cadastro_inicial ADD COLUMN IF NOT EXISTS saude_toma_medicacao_controlada BOOLEAN DEFAULT FALSE;
ALTER TABLE cadastro_inicial ADD COLUMN IF NOT EXISTS saude_qual_medicacao TEXT;

-- 8. Adicionar colunas para Propriedade Rural
ALTER TABLE cadastro_inicial ADD COLUMN IF NOT EXISTS propriedade_nome VARCHAR(255);
ALTER TABLE cadastro_inicial ADD COLUMN IF NOT EXISTS propriedade_endereco TEXT;
ALTER TABLE cadastro_inicial ADD COLUMN IF NOT EXISTS propriedade_localizacao VARCHAR(255);

-- 9. Adicionar colunas para Infraestrutura
ALTER TABLE cadastro_inicial ADD COLUMN IF NOT EXISTS infraestrutura_tem_reserva BOOLEAN DEFAULT FALSE;
ALTER TABLE cadastro_inicial ADD COLUMN IF NOT EXISTS infraestrutura_area_reserva DECIMAL(10,2);
ALTER TABLE cadastro_inicial ADD COLUMN IF NOT EXISTS infraestrutura_area_produtiva DECIMAL(10,2);
ALTER TABLE cadastro_inicial ADD COLUMN IF NOT EXISTS infraestrutura_tem_estrada BOOLEAN DEFAULT FALSE;
ALTER TABLE cadastro_inicial ADD COLUMN IF NOT EXISTS infraestrutura_qualidade_estrada VARCHAR(20);
ALTER TABLE cadastro_inicial ADD COLUMN IF NOT EXISTS infraestrutura_tem_energia BOOLEAN DEFAULT FALSE;
ALTER TABLE cadastro_inicial ADD COLUMN IF NOT EXISTS infraestrutura_tipo_energia VARCHAR(20);
ALTER TABLE cadastro_inicial ADD COLUMN IF NOT EXISTS infraestrutura_tipo_alternativo_energia VARCHAR(20);
ALTER TABLE cadastro_inicial ADD COLUMN IF NOT EXISTS infraestrutura_tem_agua BOOLEAN DEFAULT FALSE;
ALTER TABLE cadastro_inicial ADD COLUMN IF NOT EXISTS infraestrutura_tipo_agua VARCHAR(20);
ALTER TABLE cadastro_inicial ADD COLUMN IF NOT EXISTS infraestrutura_agua_encanada BOOLEAN DEFAULT FALSE;
ALTER TABLE cadastro_inicial ADD COLUMN IF NOT EXISTS infraestrutura_tipo_solo VARCHAR(100);
ALTER TABLE cadastro_inicial ADD COLUMN IF NOT EXISTS infraestrutura_vegetacao VARCHAR(100);
ALTER TABLE cadastro_inicial ADD COLUMN IF NOT EXISTS infraestrutura_possui_galpao BOOLEAN DEFAULT FALSE;
ALTER TABLE cadastro_inicial ADD COLUMN IF NOT EXISTS infraestrutura_possui_silo BOOLEAN DEFAULT FALSE;
ALTER TABLE cadastro_inicial ADD COLUMN IF NOT EXISTS infraestrutura_reservatorio_agua BOOLEAN DEFAULT FALSE;
ALTER TABLE cadastro_inicial ADD COLUMN IF NOT EXISTS infraestrutura_energia_fotovoltaica BOOLEAN DEFAULT FALSE;
ALTER TABLE cadastro_inicial ADD COLUMN IF NOT EXISTS infraestrutura_geracao_fotovoltaica VARCHAR(100);
ALTER TABLE cadastro_inicial ADD COLUMN IF NOT EXISTS infraestrutura_sistema_irrigacao BOOLEAN DEFAULT FALSE;
ALTER TABLE cadastro_inicial ADD COLUMN IF NOT EXISTS infraestrutura_tipo_irrigacao VARCHAR(20);
ALTER TABLE cadastro_inicial ADD COLUMN IF NOT EXISTS infraestrutura_area_irrigada DECIMAL(10,2);

-- 10. Adicionar colunas para Produção Agrícola
ALTER TABLE cadastro_inicial ADD COLUMN IF NOT EXISTS producao_tem_pasto BOOLEAN DEFAULT FALSE;
ALTER TABLE cadastro_inicial ADD COLUMN IF NOT EXISTS producao_area_pasto DECIMAL(10,2);
ALTER TABLE cadastro_inicial ADD COLUMN IF NOT EXISTS producao_tem_manga BOOLEAN DEFAULT FALSE;
ALTER TABLE cadastro_inicial ADD COLUMN IF NOT EXISTS producao_area_manga DECIMAL(10,2);
ALTER TABLE cadastro_inicial ADD COLUMN IF NOT EXISTS producao_tem_producao_agricola BOOLEAN DEFAULT FALSE;
ALTER TABLE cadastro_inicial ADD COLUMN IF NOT EXISTS producao_quais_producoes TEXT;
ALTER TABLE cadastro_inicial ADD COLUMN IF NOT EXISTS producao_feijao_area DECIMAL(10,2);
ALTER TABLE cadastro_inicial ADD COLUMN IF NOT EXISTS producao_feijao_inicio_safra DATE;
ALTER TABLE cadastro_inicial ADD COLUMN IF NOT EXISTS producao_feijao_previsao_colheita DATE;
ALTER TABLE cadastro_inicial ADD COLUMN IF NOT EXISTS producao_feijao_previsao_quantidade DECIMAL(10,2);
ALTER TABLE cadastro_inicial ADD COLUMN IF NOT EXISTS producao_area_permitida_sem_uso DECIMAL(10,2);
ALTER TABLE cadastro_inicial ADD COLUMN IF NOT EXISTS producao_tem_criacoes BOOLEAN DEFAULT FALSE;
ALTER TABLE cadastro_inicial ADD COLUMN IF NOT EXISTS producao_frangos_granja INTEGER;
ALTER TABLE cadastro_inicial ADD COLUMN IF NOT EXISTS producao_idade_frangos INTEGER;
ALTER TABLE cadastro_inicial ADD COLUMN IF NOT EXISTS producao_inicio_frangos DATE;
ALTER TABLE cadastro_inicial ADD COLUMN IF NOT EXISTS producao_final_abate DATE;
ALTER TABLE cadastro_inicial ADD COLUMN IF NOT EXISTS producao_peso_frangos DECIMAL(5,2);
ALTER TABLE cadastro_inicial ADD COLUMN IF NOT EXISTS producao_producao_artesanal_industrial VARCHAR(20);
ALTER TABLE cadastro_inicial ADD COLUMN IF NOT EXISTS producao_tipo_queijo VARCHAR(100);
ALTER TABLE cadastro_inicial ADD COLUMN IF NOT EXISTS producao_peso_queijo DECIMAL(5,2);
ALTER TABLE cadastro_inicial ADD COLUMN IF NOT EXISTS producao_quantidade_queijo INTEGER;
ALTER TABLE cadastro_inicial ADD COLUMN IF NOT EXISTS producao_producao_leiteira INTEGER;
ALTER TABLE cadastro_inicial ADD COLUMN IF NOT EXISTS producao_media_litro_dia DECIMAL(5,2);
ALTER TABLE cadastro_inicial ADD COLUMN IF NOT EXISTS producao_total_producao_leite DECIMAL(10,2);
ALTER TABLE cadastro_inicial ADD COLUMN IF NOT EXISTS producao_tem_pescado BOOLEAN DEFAULT FALSE;
ALTER TABLE cadastro_inicial ADD COLUMN IF NOT EXISTS producao_reservatorio_pescado VARCHAR(100);
ALTER TABLE cadastro_inicial ADD COLUMN IF NOT EXISTS producao_especie_pescado VARCHAR(100);
ALTER TABLE cadastro_inicial ADD COLUMN IF NOT EXISTS producao_inicio_producao_pescado DATE;
ALTER TABLE cadastro_inicial ADD COLUMN IF NOT EXISTS producao_final_producao_pescado DATE;
ALTER TABLE cadastro_inicial ADD COLUMN IF NOT EXISTS producao_kg_pescado DECIMAL(10,2);
ALTER TABLE cadastro_inicial ADD COLUMN IF NOT EXISTS producao_potencial_expansao TEXT;
ALTER TABLE cadastro_inicial ADD COLUMN IF NOT EXISTS producao_setor_expansao VARCHAR(50);
ALTER TABLE cadastro_inicial ADD COLUMN IF NOT EXISTS producao_necessidades_expansao TEXT;
ALTER TABLE cadastro_inicial ADD COLUMN IF NOT EXISTS producao_quantidade_necessidades VARCHAR(100);

-- 11. Adicionar colunas para Comunicação
ALTER TABLE cadastro_inicial ADD COLUMN IF NOT EXISTS comunicacao_tem_sinal_celular BOOLEAN DEFAULT FALSE;
ALTER TABLE cadastro_inicial ADD COLUMN IF NOT EXISTS comunicacao_operadora_celular VARCHAR(50);
ALTER TABLE cadastro_inicial ADD COLUMN IF NOT EXISTS comunicacao_tem_sinal_internet BOOLEAN DEFAULT FALSE;
ALTER TABLE cadastro_inicial ADD COLUMN IF NOT EXISTS comunicacao_operadora_internet VARCHAR(50);
ALTER TABLE cadastro_inicial ADD COLUMN IF NOT EXISTS comunicacao_tem_sinal_radio BOOLEAN DEFAULT FALSE;
ALTER TABLE cadastro_inicial ADD COLUMN IF NOT EXISTS comunicacao_qual_radio VARCHAR(100);
ALTER TABLE cadastro_inicial ADD COLUMN IF NOT EXISTS comunicacao_programa_radio_preferido VARCHAR(100);
ALTER TABLE cadastro_inicial ADD COLUMN IF NOT EXISTS comunicacao_tem_sinal_tv BOOLEAN DEFAULT FALSE;
ALTER TABLE cadastro_inicial ADD COLUMN IF NOT EXISTS comunicacao_qual_tv VARCHAR(100);
ALTER TABLE cadastro_inicial ADD COLUMN IF NOT EXISTS comunicacao_programa_tv_preferido VARCHAR(100);

-- 12. Adicionar colunas para Habitação
ALTER TABLE cadastro_inicial ADD COLUMN IF NOT EXISTS habitacao_tem_casa_propriedade BOOLEAN DEFAULT FALSE;
ALTER TABLE cadastro_inicial ADD COLUMN IF NOT EXISTS habitacao_tem_banheiro BOOLEAN DEFAULT FALSE;
ALTER TABLE cadastro_inicial ADD COLUMN IF NOT EXISTS habitacao_cisterna_negra BOOLEAN DEFAULT FALSE;
ALTER TABLE cadastro_inicial ADD COLUMN IF NOT EXISTS habitacao_saneamento BOOLEAN DEFAULT FALSE;

-- 13. Adicionar colunas para Dados da Família (JSON)
ALTER TABLE cadastro_inicial ADD COLUMN IF NOT EXISTS familia_conjuge JSONB;
ALTER TABLE cadastro_inicial ADD COLUMN IF NOT EXISTS familia_filhos JSONB;
ALTER TABLE cadastro_inicial ADD COLUMN IF NOT EXISTS familia_pai JSONB;
ALTER TABLE cadastro_inicial ADD COLUMN IF NOT EXISTS familia_mae JSONB;

-- 14. Adicionar comentários para documentação
COMMENT ON COLUMN cadastro_inicial.entidade_nome IS 'Nome da entidade/cooperativa';
COMMENT ON COLUMN cadastro_inicial.dirigente_nome IS 'Nome do dirigente principal';
COMMENT ON COLUMN cadastro_inicial.proprietario_nome IS 'Nome do proprietário da propriedade';
COMMENT ON COLUMN cadastro_inicial.renda_total IS 'Renda total mensal em reais';
COMMENT ON COLUMN cadastro_inicial.familia_conjuge IS 'Dados do cônjuge em formato JSON';
COMMENT ON COLUMN cadastro_inicial.familia_filhos IS 'Dados dos filhos em formato JSON array';

-- 15. Verificar estrutura final da tabela
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'cadastro_inicial' AND table_schema = 'public'
ORDER BY column_name;
