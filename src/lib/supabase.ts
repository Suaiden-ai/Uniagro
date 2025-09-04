import { createClient } from '@supabase/supabase-js'

// IMPORTANTE: Configure as variáveis de ambiente no arquivo .env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY são obrigatórias. ' +
    'Configure-as no arquivo .env'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Interface para User
export interface User {
  id: string;
  email: string;
  email_confirmed_at?: string;
  created_at: string;
}

// Interface para Profile
export interface Profile {
  id: string;
  user_id: string;
  email: string;
  nome_completo?: string;
  telefone?: string;
  user_type: 'individual' | 'empresa' | 'admin';
  created_at: string;
  updated_at: string;
}

// Interface para corresponder à estrutura da tabela "cadastro_inicial"
export interface QuestionarioMultiStep {
  // Campos de identificação e controle
  id?: string;
  uuid_usuario: string;
  timestamp_cadastro: string;
  timestamp_atualizacao?: string;
  user_id: string;
  
  // Dados básicos
  nome_completo: string;
  telefone?: string;
  cep?: string;
  logradouro?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  localidade?: string;
  estado?: string;
  estado_civil?: string;
  qtd_filhos: number;
  sexo?: string;
  
  // Dados da Entidade
  entidade_nome?: string;
  entidade_municipio?: string;
  entidade_estado?: string;
  entidade_numero_socios_informados?: number;
  entidade_numero_socios_plataforma?: number;
  entidade_cnpj?: string;
  entidade_endereco?: string;
  entidade_telefone?: string;
  entidade_email?: string;
  entidade_link_site?: string;
  entidade_link_redes_sociais?: string;
  entidade_conta_bancaria?: string;
  entidade_banco?: string;
  
  // Dados do Dirigente
  dirigente_nome?: string;
  dirigente_apelido?: string;
  dirigente_rg?: string;
  dirigente_cpf?: string;
  dirigente_endereco?: string;
  dirigente_telefone?: string;
  
  // Dados Pessoais do Proprietário
  proprietario_nome?: string;
  proprietario_sexo?: string;
  proprietario_cor_pele?: string;
  proprietario_religiao?: string;
  proprietario_time?: string;
  proprietario_esporte_preferido?: string;
  proprietario_musica?: string;
  proprietario_artista?: string;
  
  // Documentação Pessoal
  documentacao_rg?: string;
  documentacao_cpf?: string;
  documentacao_data_nascimento?: string;
  documentacao_idade?: number;
  documentacao_nis?: string;
  documentacao_pis?: string;
  documentacao_caf?: boolean;
  documentacao_cartao_produtor?: string;
  
  // Renda & Finanças
  renda_profissao1?: string;
  renda_profissao1_valor?: number;
  renda_profissao2?: string;
  renda_profissao2_valor?: number;
  renda_profissao3?: string;
  renda_profissao3_valor?: number;
  renda_total?: number;
  renda_possui_financiamento_ativo?: boolean;
  renda_banco_financiamento?: string;
  renda_tem_veiculo?: boolean;
  renda_qual_veiculo?: string;
  renda_casa_propria?: boolean;
  renda_onde_casa_propria?: string;
  
  // Saúde
  saude_tem_deficiencia?: boolean;
  saude_qual_deficiencia?: string;
  saude_tem_cromoidade?: boolean;
  saude_qual_cromoidade?: string;
  saude_faz_tratamento?: boolean;
  saude_qual_tratamento?: string;
  saude_toma_medicacao_controlada?: boolean;
  saude_qual_medicacao?: string;
  
  // Propriedade Rural
  propriedade_nome?: string;
  propriedade_endereco?: string;
  propriedade_localizacao?: string;
  
  // Infraestrutura
  infraestrutura_tem_reserva?: boolean;
  infraestrutura_area_reserva?: number;
  infraestrutura_area_produtiva?: number;
  infraestrutura_tem_estrada?: boolean;
  infraestrutura_qualidade_estrada?: string;
  infraestrutura_tem_energia?: boolean;
  infraestrutura_tipo_energia?: string;
  infraestrutura_tipo_alternativo_energia?: string;
  infraestrutura_tem_agua?: boolean;
  infraestrutura_tipo_agua?: string;
  infraestrutura_agua_encanada?: boolean;
  infraestrutura_tipo_solo?: string;
  infraestrutura_vegetacao?: string;
  infraestrutura_possui_galpao?: boolean;
  infraestrutura_possui_silo?: boolean;
  infraestrutura_reservatorio_agua?: boolean;
  infraestrutura_energia_fotovoltaica?: boolean;
  infraestrutura_geracao_fotovoltaica?: number;
  infraestrutura_sistema_irrigacao?: boolean;
  infraestrutura_tipo_irrigacao?: string;
  infraestrutura_area_irrigada?: number;
  
  // Produção Agrícola
  producao_tem_pasto?: boolean;
  producao_area_pasto?: number;
  producao_tem_manga?: boolean;
  producao_area_manga?: number;
  producao_tem_producao_agricola?: boolean;
  producao_quais_producoes?: string;
  producao_feijao_area?: number;
  producao_feijao_inicio_safra?: string;
  producao_feijao_previsao_colheita?: string;
  producao_feijao_previsao_quantidade?: number;
  producao_area_permitida_sem_uso?: number;
  producao_tem_criacoes?: boolean;
  producao_frangos_granja?: number;
  producao_idade_frangos?: number;
  producao_inicio_frangos?: string;
  producao_final_abate?: string;
  producao_peso_frangos?: number;
  producao_producao_artesanal_industrial?: string;
  producao_tipo_queijo?: string;
  producao_peso_queijo?: number;
  producao_quantidade_queijo?: number;
  producao_producao_leiteira?: number;
  producao_media_litro_dia?: number;
  producao_total_producao_leite?: number;
  producao_tem_pescado?: boolean;
  producao_reservatorio_pescado?: string;
  producao_especie_pescado?: string;
  producao_inicio_producao_pescado?: string;
  producao_final_producao_pescado?: string;
  producao_kg_pescado?: number;
  producao_potencial_expansao?: string;
  producao_setor_expansao?: string;
  producao_necessidades_expansao?: string;
  producao_quantidade_necessidades?: string;
  
  // Comunicação
  comunicacao_tem_sinal_celular?: boolean;
  comunicacao_operadora_celular?: string;
  comunicacao_tem_sinal_internet?: boolean;
  comunicacao_operadora_internet?: string;
  comunicacao_tem_sinal_radio?: boolean;
  comunicacao_qual_radio?: string;
  comunicacao_programa_radio_preferido?: string;
  comunicacao_tem_sinal_tv?: boolean;
  comunicacao_qual_tv?: string;
  comunicacao_programa_tv_preferido?: string;
  
  // Habitação
  habitacao_tem_casa_propriedade?: boolean;
  habitacao_tem_banheiro?: boolean;
  habitacao_cisterna_negra?: boolean;
  habitacao_saneamento?: boolean;
  
  // Dados da Família (JSON)
  familia_conjuge?: any;
  familia_filhos?: any;
  familia_pai?: any;
  familia_mae?: any;
  
  // Campos de controle de versão
  versao_questionario?: string;
  status_completo?: boolean;
  etapas_completas?: number;
  total_etapas?: number;
}

export interface CadastroInicial {
  id_linha?: number;
  uuid_usuario?: string;
  timestamp_cadastro?: string;
  nome_completo: string;
  cpf: string;
  telefone: string;
  cep: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  localidade: string;
  estado: string;
  estado_civil: string;
  qtd_filhos: number;
  sexo: string;
  user_id?: string;
  
  // Dados da Entidade
  entidade_nome?: string;
  entidade_municipio?: string;
  entidade_estado?: string;
  entidade_numero_socios_informados?: number;
  entidade_numero_socios_plataforma?: number;
  entidade_cnpj?: string;
  entidade_endereco?: string;
  entidade_email?: string;
  entidade_link_site?: string;
  entidade_link_redes_sociais?: string;
  entidade_conta_bancaria?: string;
  entidade_banco?: string;
  
  // Dados do Dirigente
  dirigente_nome?: string;
  dirigente_apelido?: string;
  dirigente_rg?: string;
  dirigente_cpf?: string;
  dirigente_endereco?: string;
  dirigente_telefone?: string;
  
  // Dados Pessoais do Proprietário
  proprietario_nome?: string;
  proprietario_sexo?: string;
  proprietario_cor_pele?: string;
  proprietario_religiao?: string;
  proprietario_time?: string;
  proprietario_esporte_preferido?: string;
  proprietario_musica?: string;
  proprietario_artista?: string;
  
  // Documentação Pessoal
  documentacao_rg?: string;
  documentacao_cpf?: string;
  documentacao_data_nascimento?: string;
  documentacao_idade?: number;
  documentacao_nis?: string;
  documentacao_pis?: string;
  documentacao_caf?: boolean;
  documentacao_cartao_produtor?: string;
  
  // Renda & Finanças
  renda_profissao1?: string;
  renda_profissao1_valor?: number;
  renda_profissao2?: string;
  renda_profissao2_valor?: number;
  renda_profissao3?: string;
  renda_profissao3_valor?: number;
  renda_total?: number;
  renda_possui_financiamento_ativo?: boolean;
  renda_banco_financiamento?: string;
  renda_tem_veiculo?: boolean;
  renda_qual_veiculo?: string;
  renda_casa_propria?: boolean;
  renda_onde_casa_propria?: string;
  
  // Saúde
  saude_tem_deficiencia?: boolean;
  saude_qual_deficiencia?: string;
  saude_tem_cromoidade?: boolean;
  saude_qual_cromoidade?: string;
  saude_faz_tratamento?: boolean;
  saude_qual_tratamento?: string;
  saude_toma_medicacao_controlada?: boolean;
  saude_qual_medicacao?: string;
  
  // Propriedade Rural
  propriedade_nome?: string;
  propriedade_endereco?: string;
  propriedade_localizacao?: string;
  
  // Infraestrutura
  infraestrutura_tem_reserva?: boolean;
  infraestrutura_area_reserva?: number;
  infraestrutura_area_produtiva?: number;
  infraestrutura_tem_estrada?: boolean;
  infraestrutura_qualidade_estrada?: string;
  infraestrutura_tem_energia?: boolean;
  infraestrutura_tipo_energia?: string;
  infraestrutura_tipo_alternativo_energia?: string;
  infraestrutura_tem_agua?: boolean;
  infraestrutura_tipo_agua?: string;
  infraestrutura_agua_encanada?: boolean;
  infraestrutura_tipo_solo?: string;
  infraestrutura_vegetacao?: string;
  infraestrutura_possui_galpao?: boolean;
  infraestrutura_possui_silo?: boolean;
  infraestrutura_reservatorio_agua?: boolean;
  infraestrutura_energia_fotovoltaica?: boolean;
  infraestrutura_geracao_fotovoltaica?: string;
  infraestrutura_sistema_irrigacao?: boolean;
  infraestrutura_tipo_irrigacao?: string;
  infraestrutura_area_irrigada?: number;
  
  // Produção Agrícola
  producao_tem_pasto?: boolean;
  producao_area_pasto?: number;
  producao_tem_manga?: boolean;
  producao_area_manga?: number;
  producao_tem_producao_agricola?: boolean;
  producao_quais_producoes?: string;
  producao_feijao_area?: number;
  producao_feijao_inicio_safra?: string;
  producao_feijao_previsao_colheita?: string;
  producao_feijao_previsao_quantidade?: number;
  producao_area_permitida_sem_uso?: number;
  producao_tem_criacoes?: boolean;
  producao_frangos_granja?: number;
  producao_idade_frangos?: number;
  producao_inicio_frangos?: string;
  producao_final_abate?: string;
  producao_peso_frangos?: number;
  producao_producao_artesanal_industrial?: string;
  producao_tipo_queijo?: string;
  producao_peso_queijo?: number;
  producao_quantidade_queijo?: number;
  producao_producao_leiteira?: number;
  producao_media_litro_dia?: number;
  producao_total_producao_leite?: number;
  producao_tem_pescado?: boolean;
  producao_reservatorio_pescado?: string;
  producao_especie_pescado?: string;
  producao_inicio_producao_pescado?: string;
  producao_final_producao_pescado?: string;
  producao_kg_pescado?: number;
  producao_potencial_expansao?: string;
  producao_setor_expansao?: string;
  producao_necessidades_expansao?: string;
  producao_quantidade_necessidades?: string;
  
  // Comunicação
  comunicacao_tem_sinal_celular?: boolean;
  comunicacao_operadora_celular?: string;
  comunicacao_tem_sinal_internet?: boolean;
  comunicacao_operadora_internet?: string;
  comunicacao_tem_sinal_radio?: boolean;
  comunicacao_qual_radio?: string;
  comunicacao_programa_radio_preferido?: string;
  comunicacao_tem_sinal_tv?: boolean;
  comunicacao_qual_tv?: string;
  comunicacao_programa_tv_preferido?: string;
  
  // Habitação
  habitacao_tem_casa_propriedade?: boolean;
  habitacao_tem_banheiro?: boolean;
  habitacao_cisterna_negra?: boolean;
  habitacao_saneamento?: boolean;
  
  // Dados da Família (JSON)
  familia_conjuge?: string; // JSON string
  familia_filhos?: string; // JSON string
  familia_pai?: string; // JSON string
  familia_mae?: string; // JSON string
}
