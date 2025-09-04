-- Script para criar a nova tabela do questionário multi-step
-- Esta tabela contém todas as colunas necessárias para o novo questionário
-- Separada da tabela cadastro_inicial para manter compatibilidade

-- Criar a nova tabela
CREATE TABLE IF NOT EXISTS questionario_multistep (
    -- Campos de identificação e controle
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    uuid_usuario UUID NOT NULL,
    timestamp_cadastro TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    timestamp_atualizacao TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    user_id UUID NOT NULL,
    
    -- Dados básicos
    nome_completo VARCHAR(255) NOT NULL,
    telefone VARCHAR(20),
    cep VARCHAR(10),
    logradouro TEXT,
    numero VARCHAR(20),
    complemento VARCHAR(100),
    bairro VARCHAR(100),
    localidade VARCHAR(100),
    estado VARCHAR(2),
    estado_civil VARCHAR(50),
    qtd_filhos INTEGER DEFAULT 0,
    sexo VARCHAR(20),
    
    -- Dados da Entidade
    entidade_nome VARCHAR(255),
    entidade_municipio VARCHAR(100),
    entidade_estado VARCHAR(2),
    entidade_numero_socios_informados INTEGER,
    entidade_numero_socios_plataforma INTEGER,
    entidade_cnpj VARCHAR(18),
    entidade_endereco TEXT,
    entidade_telefone VARCHAR(20),
    entidade_email VARCHAR(255),
    entidade_link_site VARCHAR(255),
    entidade_link_redes_sociais VARCHAR(255),
    entidade_conta_bancaria VARCHAR(50),
    entidade_banco VARCHAR(100),
    
    -- Dados do Dirigente
    dirigente_nome VARCHAR(255),
    dirigente_apelido VARCHAR(100),
    dirigente_rg VARCHAR(20),
    dirigente_cpf VARCHAR(14),
    dirigente_endereco TEXT,
    dirigente_telefone VARCHAR(20),
    
    -- Dados Pessoais do Proprietário
    proprietario_nome VARCHAR(255),
    proprietario_sexo VARCHAR(20),
    proprietario_cor_pele VARCHAR(50),
    proprietario_religiao VARCHAR(100),
    proprietario_time VARCHAR(100),
    proprietario_esporte_preferido VARCHAR(100),
    proprietario_musica VARCHAR(100),
    proprietario_artista VARCHAR(100),
    
    -- Documentação Pessoal
    documentacao_rg VARCHAR(20),
    documentacao_cpf VARCHAR(14),
    documentacao_data_nascimento DATE,
    documentacao_idade INTEGER,
    documentacao_nis VARCHAR(20),
    documentacao_pis VARCHAR(20),
    documentacao_caf BOOLEAN DEFAULT FALSE,
    documentacao_cartao_produtor VARCHAR(50),
    
    -- Renda & Finanças
    renda_profissao1 VARCHAR(100),
    renda_profissao1_valor DECIMAL(10,2),
    renda_profissao2 VARCHAR(100),
    renda_profissao2_valor DECIMAL(10,2),
    renda_profissao3 VARCHAR(100),
    renda_profissao3_valor DECIMAL(10,2),
    renda_total DECIMAL(10,2),
    renda_possui_financiamento_ativo BOOLEAN,
    renda_banco_financiamento VARCHAR(100),
    renda_tem_veiculo BOOLEAN,
    renda_qual_veiculo VARCHAR(100),
    renda_casa_propria BOOLEAN,
    renda_onde_casa_propria VARCHAR(255),
    
    -- Saúde
    saude_tem_deficiencia BOOLEAN,
    saude_qual_deficiencia TEXT,
    saude_tem_cromoidade BOOLEAN,
    saude_qual_cromoidade TEXT,
    saude_faz_tratamento BOOLEAN,
    saude_qual_tratamento TEXT,
    saude_toma_medicacao_controlada BOOLEAN,
    saude_qual_medicacao TEXT,
    
    -- Propriedade Rural
    propriedade_nome VARCHAR(255),
    propriedade_endereco TEXT,
    propriedade_localizacao VARCHAR(255),
    
    -- Infraestrutura
    infraestrutura_tem_reserva BOOLEAN,
    infraestrutura_area_reserva DECIMAL(10,2),
    infraestrutura_area_produtiva DECIMAL(10,2),
    infraestrutura_tem_estrada BOOLEAN,
    infraestrutura_qualidade_estrada VARCHAR(50),
    infraestrutura_tem_energia BOOLEAN,
    infraestrutura_tipo_energia VARCHAR(50),
    infraestrutura_tipo_alternativo_energia VARCHAR(100),
    infraestrutura_tem_agua BOOLEAN,
    infraestrutura_tipo_agua VARCHAR(50),
    infraestrutura_agua_encanada BOOLEAN,
    infraestrutura_tipo_solo VARCHAR(50),
    infraestrutura_vegetacao VARCHAR(100),
    infraestrutura_possui_galpao BOOLEAN,
    infraestrutura_possui_silo BOOLEAN,
    infraestrutura_reservatorio_agua BOOLEAN,
    infraestrutura_energia_fotovoltaica BOOLEAN,
    infraestrutura_geracao_fotovoltaica DECIMAL(10,2),
    infraestrutura_sistema_irrigacao BOOLEAN,
    infraestrutura_tipo_irrigacao VARCHAR(50),
    infraestrutura_area_irrigada DECIMAL(10,2),
    
    -- Produção Agrícola
    producao_tem_pasto BOOLEAN,
    producao_area_pasto DECIMAL(10,2),
    producao_tem_manga BOOLEAN,
    producao_area_manga DECIMAL(10,2),
    producao_tem_producao_agricola BOOLEAN,
    producao_quais_producoes TEXT,
    producao_feijao_area DECIMAL(10,2),
    producao_feijao_inicio_safra DATE,
    producao_feijao_previsao_colheita DATE,
    producao_feijao_previsao_quantidade DECIMAL(10,2),
    producao_area_permitida_sem_uso DECIMAL(10,2),
    producao_tem_criacoes BOOLEAN,
    producao_frangos_granja INTEGER,
    producao_idade_frangos INTEGER,
    producao_inicio_frangos DATE,
    producao_final_abate DATE,
    producao_peso_frangos DECIMAL(10,2),
    producao_producao_artesanal_industrial VARCHAR(50),
    producao_tipo_queijo VARCHAR(100),
    producao_peso_queijo DECIMAL(10,2),
    producao_quantidade_queijo INTEGER,
    producao_producao_leiteira INTEGER,
    producao_media_litro_dia DECIMAL(10,2),
    producao_total_producao_leite DECIMAL(10,2),
    producao_tem_pescado BOOLEAN,
    producao_reservatorio_pescado VARCHAR(100),
    producao_especie_pescado VARCHAR(100),
    producao_inicio_producao_pescado DATE,
    producao_final_producao_pescado DATE,
    producao_kg_pescado DECIMAL(10,2),
    producao_potencial_expansao TEXT,
    producao_setor_expansao VARCHAR(50),
    producao_necessidades_expansao TEXT,
    producao_quantidade_necessidades VARCHAR(100),
    
    -- Comunicação
    comunicacao_tem_sinal_celular BOOLEAN,
    comunicacao_operadora_celular VARCHAR(50),
    comunicacao_tem_sinal_internet BOOLEAN,
    comunicacao_operadora_internet VARCHAR(50),
    comunicacao_tem_sinal_radio BOOLEAN,
    comunicacao_qual_radio VARCHAR(100),
    comunicacao_programa_radio_preferido VARCHAR(100),
    comunicacao_tem_sinal_tv BOOLEAN,
    comunicacao_qual_tv VARCHAR(100),
    comunicacao_programa_tv_preferido VARCHAR(100),
    
    -- Habitação
    habitacao_tem_casa_propriedade BOOLEAN,
    habitacao_tem_banheiro BOOLEAN,
    habitacao_cisterna_negra BOOLEAN,
    habitacao_saneamento BOOLEAN,
    
    -- Dados da Família (JSON)
    familia_conjuge JSONB,
    familia_filhos JSONB,
    familia_pai JSONB,
    familia_mae JSONB,
    
    -- Campos de controle de versão
    versao_questionario VARCHAR(10) DEFAULT '2.0',
    status_completo BOOLEAN DEFAULT FALSE,
    etapas_completas INTEGER DEFAULT 0,
    total_etapas INTEGER DEFAULT 12
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_questionario_multistep_user_id ON questionario_multistep(user_id);
CREATE INDEX IF NOT EXISTS idx_questionario_multistep_uuid_usuario ON questionario_multistep(uuid_usuario);
CREATE INDEX IF NOT EXISTS idx_questionario_multistep_cpf ON questionario_multistep(documentacao_cpf);
CREATE INDEX IF NOT EXISTS idx_questionario_multistep_timestamp ON questionario_multistep(timestamp_cadastro);

-- Criar trigger para atualizar timestamp_atualizacao automaticamente
CREATE OR REPLACE FUNCTION update_questionario_multistep_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.timestamp_atualizacao = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_questionario_multistep_timestamp
    BEFORE UPDATE ON questionario_multistep
    FOR EACH ROW
    EXECUTE FUNCTION update_questionario_multistep_timestamp();

-- Adicionar constraint para garantir que user_id seja único
ALTER TABLE questionario_multistep 
ADD CONSTRAINT unique_questionario_multistep_user_id UNIQUE (user_id);

-- Comentários para documentação
COMMENT ON TABLE questionario_multistep IS 'Tabela para armazenar dados do questionário multi-step versão 2.0';
COMMENT ON COLUMN questionario_multistep.versao_questionario IS 'Versão do questionário (2.0 para multi-step)';
COMMENT ON COLUMN questionario_multistep.status_completo IS 'Indica se o questionário foi completamente preenchido';
COMMENT ON COLUMN questionario_multistep.etapas_completas IS 'Número de etapas completadas';
COMMENT ON COLUMN questionario_multistep.total_etapas IS 'Total de etapas do questionário (12)';

-- RLS (Row Level Security) - se necessário
-- ALTER TABLE questionario_multistep ENABLE ROW LEVEL SECURITY;

-- Política de RLS para permitir que usuários vejam apenas seus próprios dados
-- CREATE POLICY "Users can view own questionario data" ON questionario_multistep
--     FOR SELECT USING (auth.uid() = user_id);

-- CREATE POLICY "Users can insert own questionario data" ON questionario_multistep
--     FOR INSERT WITH CHECK (auth.uid() = user_id);

-- CREATE POLICY "Users can update own questionario data" ON questionario_multistep
--     FOR UPDATE USING (auth.uid() = user_id);
