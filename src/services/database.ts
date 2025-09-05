import { supabase, CadastroInicial, QuestionarioMultiStep } from '@/lib/supabase';
import { FormData, MultiStepFormData } from '@/types/form';
import { v4 as uuidv4 } from 'uuid';
import { storageService, DocumentUpload } from '@/services/storage';

// Função auxiliar para converter valores vazios em null para campos numéricos
const toNumeric = (value: any): number | null => {
  if (value === null || value === undefined || value === '') {
    return null;
  }
  const num = Number(value);
  return isNaN(num) ? null : num;
};

// Função auxiliar para converter strings vazias em null
const toStringOrNull = (value: any): string | null => {
  if (value === null || value === undefined || value === '') {
    return null;
  }
  return String(value);
};

// Mapeamento dos valores do formulário para os valores do banco
const mapEstadoCivil = (estadoCivil: string): string => {
  // Os valores no banco estão em maiúsculas, então não precisamos mapear
  return estadoCivil;
};

const mapSexo = (sexo: string): string => {
  const mapping: { [key: string]: string } = {
    'MASCULINO': 'MASCULINO',
    'FEMININO': 'FEMININO',
    'PREFIRO_NAO_DECLARAR': 'PREFIRO NÃO DECLARAR'
  };
  return mapping[sexo] || sexo;
};

// Função para mapear nome do estado para sigla (2 caracteres)
const mapEstadoToSigla = (estado: string): string | null => {
  if (!estado || estado.trim() === '') return null;
  
  const estadoSigla: { [key: string]: string } = {
    'ACRE': 'AC',
    'ALAGOAS': 'AL',
    'AMAPÁ': 'AP',
    'AMAZONAS': 'AM',
    'BAHIA': 'BA',
    'CEARÁ': 'CE',
    'DISTRITO FEDERAL': 'DF',
    'ESPÍRITO SANTO': 'ES',
    'GOIÁS': 'GO',
    'MARANHÃO': 'MA',
    'MATO GROSSO': 'MT',
    'MATO GROSSO DO SUL': 'MS',
    'MINAS GERAIS': 'MG',
    'PARÁ': 'PA',
    'PARAÍBA': 'PB',
    'PARANÁ': 'PR',
    'PERNAMBUCO': 'PE',
    'PIAUÍ': 'PI',
    'RIO DE JANEIRO': 'RJ',
    'RIO GRANDE DO NORTE': 'RN',
    'RIO GRANDE DO SUL': 'RS',
    'RONDÔNIA': 'RO',
    'RORAIMA': 'RR',
    'SANTA CATARINA': 'SC',
    'SÃO PAULO': 'SP',
    'SERGIPE': 'SE',
    'TOCANTINS': 'TO',
    // Adicionar variações comuns
    'AC': 'AC',
    'AL': 'AL',
    'AP': 'AP',
    'AM': 'AM',
    'BA': 'BA',
    'CE': 'CE',
    'DF': 'DF',
    'ES': 'ES',
    'GO': 'GO',
    'MA': 'MA',
    'MT': 'MT',
    'MS': 'MS',
    'MG': 'MG',
    'PA': 'PA',
    'PB': 'PB',
    'PR': 'PR',
    'PE': 'PE',
    'PI': 'PI',
    'RJ': 'RJ',
    'RN': 'RN',
    'RS': 'RS',
    'RO': 'RO',
    'RR': 'RR',
    'SC': 'SC',
    'SP': 'SP',
    'SE': 'SE',
    'TO': 'TO'
  };
  
  const estadoUpper = estado.toUpperCase().trim();
  return estadoSigla[estadoUpper] || null;
};

// Função para mapear dados do MultiStepFormData para QuestionarioMultiStep
const mapMultiStepFormDataToNewTable = (formData: MultiStepFormData, userId?: string, existingUuid?: string, isUpdate: boolean = false): QuestionarioMultiStep => {
  const baseData: QuestionarioMultiStep = {
    // Campos de identificação e controle
    ...(isUpdate ? {} : { 
      uuid_usuario: existingUuid || uuidv4(),
      timestamp_cadastro: new Date().toISOString(),
    }),
    user_id: userId || '',
    
    // Dados básicos
    nome_completo: formData.documentacao?.nome || formData.proprietario?.nome || 'Nome não informado',
    telefone: formData.entidade?.telefone?.replace(/\D/g, '') || formData.dirigente?.telefone?.replace(/\D/g, '') || '',
    cep: formData.entidade?.cep?.replace(/\D/g, '') || null,
    logradouro: formData.entidade?.endereco || null,
    numero: null,
    complemento: null,
    bairro: null,
    localidade: formData.entidade?.municipio || '',
    estado: (() => {
      const estadoOriginal = formData.entidade?.estado || '';
      const estadoConvertido = mapEstadoToSigla(estadoOriginal);
      console.log(`🔄 Conversão de estado (principal): "${estadoOriginal}" -> "${estadoConvertido}"`);
      return estadoConvertido;
    })(),
    estado_civil: formData.proprietario?.estadoCivil || null,
    qtd_filhos: formData.familia?.filhos?.length || 0,
    sexo: formData.proprietario?.sexo || null,
    
    // Dados da Entidade
    entidade_nome: toStringOrNull(formData.entidade?.nome),
    entidade_cep: formData.entidade?.cep?.replace(/\D/g, '') || null,
    entidade_municipio: toStringOrNull(formData.entidade?.municipio),
    entidade_bairro: toStringOrNull(formData.entidade?.bairro),
    entidade_complemento: toStringOrNull(formData.entidade?.complemento),
    entidade_estado: (() => {
      const estadoOriginal = formData.entidade?.estado || '';
      const estadoConvertido = mapEstadoToSigla(estadoOriginal);
      console.log(`🔄 Conversão de estado: "${estadoOriginal}" -> "${estadoConvertido}"`);
      return estadoConvertido;
    })(),
    entidade_numero_socios_informados: toNumeric(formData.entidade?.numeroSociosInformados),
    entidade_numero_socios_plataforma: toNumeric(formData.entidade?.numeroSociosPlataforma),
    entidade_cnpj: toStringOrNull(formData.entidade?.cnpj),
    entidade_endereco: toStringOrNull(formData.entidade?.endereco),
    entidade_telefone: toStringOrNull(formData.entidade?.telefone),
    entidade_email: toStringOrNull(formData.entidade?.email),
    entidade_link_site: toStringOrNull(formData.entidade?.linkSite),
    entidade_link_redes_sociais: toStringOrNull(formData.entidade?.linkRedesSociais),
    entidade_conta_bancaria: toStringOrNull(formData.entidade?.contaBancaria),
    entidade_banco: toStringOrNull(formData.entidade?.banco),
    
    // Dados do Dirigente
    dirigente_nome: formData.dirigente?.nome,
    dirigente_apelido: formData.dirigente?.apelido,
    dirigente_rg: formData.dirigente?.rg,
    dirigente_cpf: formData.dirigente?.cpf?.replace(/\D/g, ''),
    dirigente_endereco: formData.dirigente?.endereco,
    dirigente_telefone: formData.dirigente?.telefone?.replace(/\D/g, ''),
    
    // Dados Pessoais do Proprietário
    proprietario_nome: formData.proprietario?.nome,
    proprietario_sexo: formData.proprietario?.sexo,
    proprietario_cor_pele: formData.proprietario?.corPele,
    proprietario_religiao: formData.proprietario?.religiao,
    proprietario_time: formData.proprietario?.time,
    proprietario_esporte_preferido: formData.proprietario?.esportePreferido,
    proprietario_musica: formData.proprietario?.musica,
    proprietario_artista: formData.proprietario?.artista,
    
    // Documentação Pessoal
    documentacao_rg: formData.documentacao?.rg,
    documentacao_cpf: formData.documentacao?.cpf?.replace(/\D/g, ''),
    documentacao_data_nascimento: formData.documentacao?.dataNascimento || null,
    documentacao_idade: toNumeric(formData.documentacao?.idade),
    documentacao_nis: formData.documentacao?.nis,
    documentacao_pis: formData.documentacao?.pis,
    documentacao_caf: formData.documentacao?.caf,
    documentacao_cartao_produtor: formData.documentacao?.cartaoProdutor,
    
    // Renda & Finanças
    renda_profissao1: toStringOrNull(formData.renda?.profissao1),
    renda_profissao1_valor: toNumeric(formData.renda?.rendaProfissao1),
    renda_profissao2: toStringOrNull(formData.renda?.profissao2),
    renda_profissao2_valor: toNumeric(formData.renda?.rendaProfissao2),
    renda_profissao3: toStringOrNull(formData.renda?.profissao3),
    renda_profissao3_valor: toNumeric(formData.renda?.rendaProfissao3),
    renda_total: toNumeric(formData.renda?.rendaTotal),
    renda_possui_financiamento_ativo: formData.renda?.possuiFinanciamentoAtivo === true || formData.renda?.possuiFinanciamentoAtivo === 'Sim' ? true : formData.renda?.possuiFinanciamentoAtivo === false || formData.renda?.possuiFinanciamentoAtivo === 'Não' ? false : undefined,
    renda_banco_financiamento: toStringOrNull(formData.renda?.bancoFinanciamento),
    renda_tem_veiculo: formData.renda?.temVeiculo === true || formData.renda?.temVeiculo === 'Sim' ? true : formData.renda?.temVeiculo === false || formData.renda?.temVeiculo === 'Não' ? false : undefined,
    renda_qual_veiculo: toStringOrNull(formData.renda?.qualVeiculo),
    renda_casa_propria: formData.renda?.casaPropria === true || formData.renda?.casaPropria === 'Sim' ? true : formData.renda?.casaPropria === false || formData.renda?.casaPropria === 'Não' ? false : undefined,
    renda_onde_casa_propria: toStringOrNull(formData.renda?.ondeCasaPropria),
    
    // Saúde
    saude_tem_deficiencia: formData.saude?.temDeficiencia === true || formData.saude?.temDeficiencia === 'Sim' ? true : formData.saude?.temDeficiencia === false || formData.saude?.temDeficiencia === 'Não' ? false : undefined,
    saude_qual_deficiencia: toStringOrNull(formData.saude?.qualDeficiencia),
    saude_tem_cromoidade: formData.saude?.temCromoidade === true || formData.saude?.temCromoidade === 'Sim' ? true : formData.saude?.temCromoidade === false || formData.saude?.temCromoidade === 'Não' ? false : undefined,
    saude_qual_cromoidade: toStringOrNull(formData.saude?.qualCromoidade),
    saude_faz_tratamento: formData.saude?.fazTratamento === true || formData.saude?.fazTratamento === 'Sim' ? true : formData.saude?.fazTratamento === false || formData.saude?.fazTratamento === 'Não' ? false : undefined,
    saude_qual_tratamento: toStringOrNull(formData.saude?.qualTratamento),
    saude_toma_medicacao_controlada: formData.saude?.tomaMedicacaoControlada === true || formData.saude?.tomaMedicacaoControlada === 'Sim' ? true : formData.saude?.tomaMedicacaoControlada === false || formData.saude?.tomaMedicacaoControlada === 'Não' ? false : undefined,
    saude_qual_medicacao: toStringOrNull(formData.saude?.qualMedicacao),
    
    // Propriedade Rural
    propriedade_nome: formData.propriedade?.nome,
    propriedade_endereco: formData.propriedade?.endereco,
    propriedade_localizacao: formData.propriedade?.localizacao,
    
    // Infraestrutura
    infraestrutura_tem_reserva: formData.infraestrutura?.temReserva === 'Sim' ? true : formData.infraestrutura?.temReserva === 'Não' ? false : formData.infraestrutura?.temReserva,
    infraestrutura_area_reserva: toNumeric(formData.infraestrutura?.areaReserva),
    infraestrutura_area_produtiva: toNumeric(formData.infraestrutura?.areaProdutiva),
    infraestrutura_tem_estrada: formData.infraestrutura?.temEstrada === 'Sim' ? true : formData.infraestrutura?.temEstrada === 'Não' ? false : formData.infraestrutura?.temEstrada,
    infraestrutura_qualidade_estrada: formData.infraestrutura?.qualidadeEstrada,
    infraestrutura_tem_energia: formData.infraestrutura?.temEnergia === 'Sim' ? true : formData.infraestrutura?.temEnergia === 'Não' ? false : formData.infraestrutura?.temEnergia,
    infraestrutura_tipo_energia: formData.infraestrutura?.tipoEnergia,
    infraestrutura_tipo_alternativo_energia: formData.infraestrutura?.tipoAlternativoEnergia,
    infraestrutura_tem_agua: formData.infraestrutura?.temAgua === 'Sim' ? true : formData.infraestrutura?.temAgua === 'Não' ? false : formData.infraestrutura?.temAgua,
    infraestrutura_tipo_agua: formData.infraestrutura?.tipoAgua,
    infraestrutura_agua_encanada: formData.infraestrutura?.aguaEncanada === 'Sim' ? true : formData.infraestrutura?.aguaEncanada === 'Não' ? false : formData.infraestrutura?.aguaEncanada,
    infraestrutura_tipo_solo: formData.infraestrutura?.tipoSolo,
    infraestrutura_vegetacao: formData.infraestrutura?.vegetacao,
    infraestrutura_possui_galpao: formData.infraestrutura?.possuiGalpao === 'Sim' ? true : formData.infraestrutura?.possuiGalpao === 'Não' ? false : formData.infraestrutura?.possuiGalpao,
    infraestrutura_possui_silo: formData.infraestrutura?.possuiSilo === 'Sim' ? true : formData.infraestrutura?.possuiSilo === 'Não' ? false : formData.infraestrutura?.possuiSilo,
    infraestrutura_reservatorio_agua: formData.infraestrutura?.reservatorioAgua === 'Sim' ? true : formData.infraestrutura?.reservatorioAgua === 'Não' ? false : formData.infraestrutura?.reservatorioAgua,
    infraestrutura_energia_fotovoltaica: formData.infraestrutura?.energiaFotovoltaica === 'Sim' ? true : formData.infraestrutura?.energiaFotovoltaica === 'Não' ? false : formData.infraestrutura?.energiaFotovoltaica,
    infraestrutura_geracao_fotovoltaica: formData.infraestrutura?.geracaoFotovoltaica ? formData.infraestrutura.geracaoFotovoltaica : null,
    infraestrutura_sistema_irrigacao: formData.infraestrutura?.sistemaIrrigacao === 'Sim' ? true : formData.infraestrutura?.sistemaIrrigacao === 'Não' ? false : formData.infraestrutura?.sistemaIrrigacao,
    infraestrutura_tipo_irrigacao: formData.infraestrutura?.tipoIrrigacao,
    infraestrutura_area_irrigada: toNumeric(formData.infraestrutura?.areaIrrigada),
    
    // Produção Agrícola
    producao_tem_pasto: formData.producao?.temPasto,
    producao_area_pasto: toNumeric(formData.producao?.areaPasto),
    producao_tem_manga: formData.producao?.temManga,
    producao_area_manga: toNumeric(formData.producao?.areaManga),
    producao_tem_producao_agricola: formData.producao?.temProducaoAgricola,
    producao_quais_producoes: toStringOrNull(formData.producao?.quaisProducoes),
    producao_feijao_area: toNumeric(formData.producao?.feijaoArea),
    producao_feijao_inicio_safra: formData.producao?.feijaoInicioSafra || null,
    producao_feijao_previsao_colheita: formData.producao?.feijaoPrevisaoColheita || null,
    producao_feijao_previsao_quantidade: toNumeric(formData.producao?.feijaoPrevisaoQuantidade),
    producao_area_permitida_sem_uso: toNumeric(formData.producao?.areaPermitidaSemUso),
    producao_tem_criacoes: formData.producao?.temCriacoes,
    producao_tipos_criacoes: formData.producao?.tiposCriacoes ? formData.producao.tiposCriacoes.join(',') : null,
    producao_frangos_granja: toNumeric(formData.producao?.frangosGranja),
    producao_idade_frangos: toNumeric(formData.producao?.idadeFrangos),
    producao_inicio_frangos: formData.producao?.inicioFrangos || null,
    producao_final_abate: formData.producao?.finalAbate || null,
    producao_peso_frangos: toNumeric(formData.producao?.pesoFrangos),
    producao_producao_artesanal_industrial: formData.producao?.producaoArtesanalIndustrial,
    producao_tipo_queijo: toStringOrNull(formData.producao?.tipoQueijo),
    producao_peso_queijo: toNumeric(formData.producao?.pesoQueijo),
    producao_quantidade_queijo: toNumeric(formData.producao?.quantidadeQueijo),
    producao_producao_leiteira: toNumeric(formData.producao?.producaoLeiteira),
    producao_media_litro_dia: toNumeric(formData.producao?.mediaLitroDia),
    producao_total_producao_leite: toNumeric(formData.producao?.totalProducaoLeite),
    producao_tem_pescado: formData.producao?.temPescado,
    producao_reservatorio_pescado: formData.producao?.reservatorioPescado,
    producao_especie_pescado: formData.producao?.especiePescado,
    producao_inicio_producao_pescado: formData.producao?.inicioProducaoPescado || null,
    producao_final_producao_pescado: formData.producao?.finalProducaoPescado || null,
    producao_kg_pescado: toNumeric(formData.producao?.kgPescado),
    producao_potencial_expansao: formData.producao?.potencialExpansao,
    producao_setor_expansao: formData.producao?.setorExpansao,
    producao_necessidades_expansao: formData.producao?.necessidadesExpansao,
    producao_quantidade_necessidades: formData.producao?.quantidadeNecessidades,
    
    // Comunicação
    comunicacao_tem_sinal_celular: formData.comunicacao?.temSinalCelular,
    comunicacao_operadora_celular: formData.comunicacao?.operadoraCelular,
    comunicacao_tem_sinal_internet: formData.comunicacao?.temSinalInternet,
    comunicacao_operadora_internet: formData.comunicacao?.operadoraInternet,
    comunicacao_tem_sinal_radio: formData.comunicacao?.temSinalRadio,
    comunicacao_qual_radio: formData.comunicacao?.qualRadio,
    comunicacao_programa_radio_preferido: formData.comunicacao?.programaRadioPreferido,
    comunicacao_tem_sinal_tv: formData.comunicacao?.temSinalTV,
    comunicacao_qual_tv: formData.comunicacao?.qualTV,
    comunicacao_programa_tv_preferido: formData.comunicacao?.programaTVPreferido,
    
    // Habitação
    habitacao_tem_casa_propriedade: formData.habitacao?.temCasaPropriedade,
    habitacao_tem_banheiro: formData.habitacao?.temBanheiro,
    habitacao_cisterna_negra: formData.habitacao?.cisternaNegra,
    habitacao_saneamento: formData.habitacao?.saneamento,
    
    // Dados da Família (JSON)
    familia_conjuge: formData.familia?.conjuge ? JSON.stringify(formData.familia.conjuge) : undefined,
    familia_filhos: formData.familia?.filhos ? JSON.stringify(formData.familia.filhos) : undefined,
    familia_pai: formData.familia?.pai ? JSON.stringify(formData.familia.pai) : undefined,
    familia_mae: formData.familia?.mae ? JSON.stringify(formData.familia.mae) : undefined,
    
    // Campos de controle de versão
    versao_questionario: '2.0',
    status_completo: false,
    etapas_completas: 0,
    total_etapas: 12
  };

  return baseData;
};

// Função para mapear dados do MultiStepFormData para CadastroInicial (versão antiga)
const mapMultiStepFormData = (formData: MultiStepFormData, userId?: string, existingUuid?: string, isUpdate: boolean = false): CadastroInicial => {
  const baseData = {
    // Campos que não devem ser atualizados durante UPDATE
    ...(isUpdate ? {} : { 
      uuid_usuario: existingUuid || uuidv4(),
      timestamp_cadastro: new Date().toISOString(),
      cpf: formData.documentacao?.cpf?.replace(/\D/g, '') || (formData.dirigente?.cpf?.replace(/\D/g, '') || '00000000000')
    }),
    
    // Dados básicos (usando dados da documentação como base)
    nome_completo: formData.documentacao?.nome || formData.proprietario?.nome || 'Nome não informado',
    telefone: formData.entidade?.telefone?.replace(/\D/g, '') || formData.dirigente?.telefone?.replace(/\D/g, '') || '',
    cep: formData.entidade?.cep?.replace(/\D/g, '') || null,
    logradouro: formData.entidade?.endereco || null,
    numero: null, // Não temos número específico
    complemento: null,
    bairro: null, // Não temos bairro específico
    localidade: formData.entidade?.municipio || '',
    estado: (() => {
      const estadoOriginal = formData.entidade?.estado || '';
      const estadoConvertido = mapEstadoToSigla(estadoOriginal);
      console.log(`🔄 Conversão de estado (secundário): "${estadoOriginal}" -> "${estadoConvertido}"`);
      return estadoConvertido;
    })(),
    estado_civil: null, // Não temos estado civil no questionário multi-step
    qtd_filhos: formData.familia?.filhos?.length || 0,
    sexo: formData.proprietario?.sexo || null,
    user_id: userId,
    
    // Dados da Entidade
    entidade_nome: formData.entidade?.nome,
    entidade_municipio: formData.entidade?.municipio,
    entidade_bairro: formData.entidade?.bairro,
    entidade_complemento: formData.entidade?.complemento,
    entidade_estado: (() => {
      const estadoOriginal = formData.entidade?.estado || '';
      const estadoConvertido = mapEstadoToSigla(estadoOriginal);
      console.log(`🔄 Conversão de estado (entidade): "${estadoOriginal}" -> "${estadoConvertido}"`);
      return estadoConvertido;
    })(),
    entidade_numero_socios_informados: formData.entidade?.numeroSociosInformados,
    entidade_numero_socios_plataforma: formData.entidade?.numeroSociosPlataforma,
    entidade_cnpj: formData.entidade?.cnpj,
    entidade_endereco: formData.entidade?.endereco,
    entidade_email: formData.entidade?.email,
    entidade_link_site: formData.entidade?.linkSite,
    entidade_link_redes_sociais: formData.entidade?.linkRedesSociais,
    entidade_conta_bancaria: formData.entidade?.contaBancaria,
    entidade_banco: formData.entidade?.banco,
    
    // Dados do Dirigente
    dirigente_nome: formData.dirigente?.nome,
    dirigente_apelido: formData.dirigente?.apelido,
    dirigente_rg: formData.dirigente?.rg,
    dirigente_cpf: formData.dirigente?.cpf?.replace(/\D/g, ''),
    dirigente_endereco: formData.dirigente?.endereco,
    dirigente_telefone: formData.dirigente?.telefone?.replace(/\D/g, ''),
    
    // Dados Pessoais do Proprietário
    proprietario_nome: formData.proprietario?.nome,
    proprietario_sexo: formData.proprietario?.sexo,
    proprietario_cor_pele: formData.proprietario?.corPele,
    proprietario_religiao: formData.proprietario?.religiao,
    proprietario_time: formData.proprietario?.time,
    proprietario_esporte_preferido: formData.proprietario?.esportePreferido,
    proprietario_musica: formData.proprietario?.musica,
    proprietario_artista: formData.proprietario?.artista,
    
    // Dados Pessoais do Proprietário - Campos adicionais
    estado_civil: formData.proprietario?.estadoCivil || null,
    telefone: formData.proprietario?.telefone?.replace(/\D/g, '') || formData.dirigente?.telefone?.replace(/\D/g, '') || '',
    
    // Documentação Pessoal
    documentacao_rg: formData.documentacao?.rg,
    documentacao_cpf: formData.documentacao?.cpf?.replace(/\D/g, ''),
    documentacao_data_nascimento: formData.documentacao?.dataNascimento || null,
    documentacao_idade: toNumeric(formData.documentacao?.idade),
    documentacao_nis: formData.documentacao?.nis,
    documentacao_pis: formData.documentacao?.pis,
    documentacao_caf: formData.documentacao?.caf,
    documentacao_cartao_produtor: formData.documentacao?.cartaoProdutor,
    
    // Renda & Finanças
    renda_profissao1: toStringOrNull(formData.renda?.profissao1),
    renda_profissao1_valor: toNumeric(formData.renda?.rendaProfissao1),
    renda_profissao2: toStringOrNull(formData.renda?.profissao2),
    renda_profissao2_valor: toNumeric(formData.renda?.rendaProfissao2),
    renda_profissao3: toStringOrNull(formData.renda?.profissao3),
    renda_profissao3_valor: toNumeric(formData.renda?.rendaProfissao3),
    renda_total: toNumeric(formData.renda?.rendaTotal),
    renda_possui_financiamento_ativo: formData.renda?.possuiFinanciamentoAtivo === true || formData.renda?.possuiFinanciamentoAtivo === 'Sim' ? true : formData.renda?.possuiFinanciamentoAtivo === false || formData.renda?.possuiFinanciamentoAtivo === 'Não' ? false : undefined,
    renda_banco_financiamento: toStringOrNull(formData.renda?.bancoFinanciamento),
    renda_tem_veiculo: formData.renda?.temVeiculo === true || formData.renda?.temVeiculo === 'Sim' ? true : formData.renda?.temVeiculo === false || formData.renda?.temVeiculo === 'Não' ? false : undefined,
    renda_qual_veiculo: toStringOrNull(formData.renda?.qualVeiculo),
    renda_casa_propria: formData.renda?.casaPropria === true || formData.renda?.casaPropria === 'Sim' ? true : formData.renda?.casaPropria === false || formData.renda?.casaPropria === 'Não' ? false : undefined,
    renda_onde_casa_propria: toStringOrNull(formData.renda?.ondeCasaPropria),
    
    // Saúde
    saude_tem_deficiencia: formData.saude?.temDeficiencia === true || formData.saude?.temDeficiencia === 'Sim' ? true : formData.saude?.temDeficiencia === false || formData.saude?.temDeficiencia === 'Não' ? false : undefined,
    saude_qual_deficiencia: toStringOrNull(formData.saude?.qualDeficiencia),
    saude_tem_cromoidade: formData.saude?.temCromoidade === true || formData.saude?.temCromoidade === 'Sim' ? true : formData.saude?.temCromoidade === false || formData.saude?.temCromoidade === 'Não' ? false : undefined,
    saude_qual_cromoidade: toStringOrNull(formData.saude?.qualCromoidade),
    saude_faz_tratamento: formData.saude?.fazTratamento === true || formData.saude?.fazTratamento === 'Sim' ? true : formData.saude?.fazTratamento === false || formData.saude?.fazTratamento === 'Não' ? false : undefined,
    saude_qual_tratamento: toStringOrNull(formData.saude?.qualTratamento),
    saude_toma_medicacao_controlada: formData.saude?.tomaMedicacaoControlada === true || formData.saude?.tomaMedicacaoControlada === 'Sim' ? true : formData.saude?.tomaMedicacaoControlada === false || formData.saude?.tomaMedicacaoControlada === 'Não' ? false : undefined,
    saude_qual_medicacao: toStringOrNull(formData.saude?.qualMedicacao),
    
    // Propriedade Rural
    propriedade_nome: formData.propriedade?.nome,
    propriedade_endereco: formData.propriedade?.endereco,
    propriedade_localizacao: formData.propriedade?.localizacao,
    
    // Infraestrutura
    infraestrutura_tem_reserva: formData.infraestrutura?.temReserva === 'Sim' ? true : formData.infraestrutura?.temReserva === 'Não' ? false : formData.infraestrutura?.temReserva,
    infraestrutura_area_reserva: toNumeric(formData.infraestrutura?.areaReserva),
    infraestrutura_area_produtiva: toNumeric(formData.infraestrutura?.areaProdutiva),
    infraestrutura_tem_estrada: formData.infraestrutura?.temEstrada === 'Sim' ? true : formData.infraestrutura?.temEstrada === 'Não' ? false : formData.infraestrutura?.temEstrada,
    infraestrutura_qualidade_estrada: formData.infraestrutura?.qualidadeEstrada,
    infraestrutura_tem_energia: formData.infraestrutura?.temEnergia === 'Sim' ? true : formData.infraestrutura?.temEnergia === 'Não' ? false : formData.infraestrutura?.temEnergia,
    infraestrutura_tipo_energia: formData.infraestrutura?.tipoEnergia,
    infraestrutura_tipo_alternativo_energia: formData.infraestrutura?.tipoAlternativoEnergia,
    infraestrutura_tem_agua: formData.infraestrutura?.temAgua === 'Sim' ? true : formData.infraestrutura?.temAgua === 'Não' ? false : formData.infraestrutura?.temAgua,
    infraestrutura_tipo_agua: formData.infraestrutura?.tipoAgua,
    infraestrutura_agua_encanada: formData.infraestrutura?.aguaEncanada === 'Sim' ? true : formData.infraestrutura?.aguaEncanada === 'Não' ? false : formData.infraestrutura?.aguaEncanada,
    infraestrutura_tipo_solo: formData.infraestrutura?.tipoSolo,
    infraestrutura_vegetacao: formData.infraestrutura?.vegetacao,
    infraestrutura_possui_galpao: formData.infraestrutura?.possuiGalpao === 'Sim' ? true : formData.infraestrutura?.possuiGalpao === 'Não' ? false : formData.infraestrutura?.possuiGalpao,
    infraestrutura_possui_silo: formData.infraestrutura?.possuiSilo === 'Sim' ? true : formData.infraestrutura?.possuiSilo === 'Não' ? false : formData.infraestrutura?.possuiSilo,
    infraestrutura_reservatorio_agua: formData.infraestrutura?.reservatorioAgua === 'Sim' ? true : formData.infraestrutura?.reservatorioAgua === 'Não' ? false : formData.infraestrutura?.reservatorioAgua,
    infraestrutura_energia_fotovoltaica: formData.infraestrutura?.energiaFotovoltaica === 'Sim' ? true : formData.infraestrutura?.energiaFotovoltaica === 'Não' ? false : formData.infraestrutura?.energiaFotovoltaica,
    infraestrutura_geracao_fotovoltaica: formData.infraestrutura?.geracaoFotovoltaica ? formData.infraestrutura.geracaoFotovoltaica : null,
    infraestrutura_sistema_irrigacao: formData.infraestrutura?.sistemaIrrigacao === 'Sim' ? true : formData.infraestrutura?.sistemaIrrigacao === 'Não' ? false : formData.infraestrutura?.sistemaIrrigacao,
    infraestrutura_tipo_irrigacao: formData.infraestrutura?.tipoIrrigacao,
    infraestrutura_area_irrigada: toNumeric(formData.infraestrutura?.areaIrrigada),
    
    // Produção Agrícola
    producao_tem_pasto: formData.producao?.temPasto,
    producao_area_pasto: toNumeric(formData.producao?.areaPasto),
    producao_tem_manga: formData.producao?.temManga,
    producao_area_manga: toNumeric(formData.producao?.areaManga),
    producao_tem_producao_agricola: formData.producao?.temProducaoAgricola,
    producao_quais_producoes: toStringOrNull(formData.producao?.quaisProducoes),
    producao_feijao_area: toNumeric(formData.producao?.feijaoArea),
    producao_feijao_inicio_safra: formData.producao?.feijaoInicioSafra || null,
    producao_feijao_previsao_colheita: formData.producao?.feijaoPrevisaoColheita || null,
    producao_feijao_previsao_quantidade: toNumeric(formData.producao?.feijaoPrevisaoQuantidade),
    producao_area_permitida_sem_uso: toNumeric(formData.producao?.areaPermitidaSemUso),
    producao_tem_criacoes: formData.producao?.temCriacoes,
    producao_tipos_criacoes: formData.producao?.tiposCriacoes ? formData.producao.tiposCriacoes.join(',') : null,
    producao_frangos_granja: toNumeric(formData.producao?.frangosGranja),
    producao_idade_frangos: toNumeric(formData.producao?.idadeFrangos),
    producao_inicio_frangos: formData.producao?.inicioFrangos || null,
    producao_final_abate: formData.producao?.finalAbate || null,
    producao_peso_frangos: toNumeric(formData.producao?.pesoFrangos),
    producao_producao_artesanal_industrial: formData.producao?.producaoArtesanalIndustrial,
    producao_tipo_queijo: toStringOrNull(formData.producao?.tipoQueijo),
    producao_peso_queijo: toNumeric(formData.producao?.pesoQueijo),
    producao_quantidade_queijo: toNumeric(formData.producao?.quantidadeQueijo),
    producao_producao_leiteira: toNumeric(formData.producao?.producaoLeiteira),
    producao_media_litro_dia: toNumeric(formData.producao?.mediaLitroDia),
    producao_total_producao_leite: toNumeric(formData.producao?.totalProducaoLeite),
    producao_tem_pescado: formData.producao?.temPescado,
    producao_reservatorio_pescado: formData.producao?.reservatorioPescado,
    producao_especie_pescado: formData.producao?.especiePescado,
    producao_inicio_producao_pescado: formData.producao?.inicioProducaoPescado || null,
    producao_final_producao_pescado: formData.producao?.finalProducaoPescado || null,
    producao_kg_pescado: toNumeric(formData.producao?.kgPescado),
    producao_potencial_expansao: formData.producao?.potencialExpansao,
    producao_setor_expansao: formData.producao?.setorExpansao,
    producao_necessidades_expansao: formData.producao?.necessidadesExpansao,
    producao_quantidade_necessidades: formData.producao?.quantidadeNecessidades,
    
    // Comunicação
    comunicacao_tem_sinal_celular: formData.comunicacao?.temSinalCelular,
    comunicacao_operadora_celular: formData.comunicacao?.operadoraCelular,
    comunicacao_tem_sinal_internet: formData.comunicacao?.temSinalInternet,
    comunicacao_operadora_internet: formData.comunicacao?.operadoraInternet,
    comunicacao_tem_sinal_radio: formData.comunicacao?.temSinalRadio,
    comunicacao_qual_radio: formData.comunicacao?.qualRadio,
    comunicacao_programa_radio_preferido: formData.comunicacao?.programaRadioPreferido,
    comunicacao_tem_sinal_tv: formData.comunicacao?.temSinalTV,
    comunicacao_qual_tv: formData.comunicacao?.qualTV,
    comunicacao_programa_tv_preferido: formData.comunicacao?.programaTVPreferido,
    
    // Habitação
    habitacao_tem_casa_propriedade: formData.habitacao?.temCasaPropriedade,
    habitacao_tem_banheiro: formData.habitacao?.temBanheiro,
    habitacao_cisterna_negra: formData.habitacao?.cisternaNegra,
    habitacao_saneamento: formData.habitacao?.saneamento,
    
    // Dados da Família (JSON)
    familia_conjuge: formData.familia?.conjuge ? JSON.stringify(formData.familia.conjuge) : undefined,
    familia_filhos: formData.familia?.filhos ? JSON.stringify(formData.familia.filhos) : undefined,
    familia_pai: formData.familia?.pai ? JSON.stringify(formData.familia.pai) : undefined,
    familia_mae: formData.familia?.mae ? JSON.stringify(formData.familia.mae) : undefined,
  };

  return baseData;
};

// Função para verificar se CPF já existe em outro registro
const checkCpfExistsInOtherRecord = async (cpf: string, currentUserId: string): Promise<boolean> => {
  try {
    console.log('🔎 checkCpfExistsInOtherRecord - Iniciando verificação');
    console.log('🔎 CPF a verificar:', cpf);
    console.log('🔎 CurrentUserId (excluir da busca):', currentUserId);
    
    if (!cpf || cpf === '00000000000') {
      console.log('🔎 CPF vazio ou temporário - retornando false');
      return false; // CPF temporário ou vazio não precisa ser verificado
    }

    const { data, error } = await supabase
      .from('questionario_multistep')
      .select('user_id, documentacao_cpf, dirigente_cpf')
      .or(`documentacao_cpf.eq.${cpf},dirigente_cpf.eq.${cpf}`)
      .neq('user_id', currentUserId)
      .limit(5); // Aumentei para ver mais registros

    console.log('🔎 Resultado da consulta:', { data, error });
    
    if (error) {
      console.error('🔎 Erro ao verificar CPF:', error);
      return false;
    }

    const exists = data && data.length > 0;
    console.log('🔎 CPF existe em outro registro?', exists);
    console.log('🔎 Registros encontrados:', data);
    console.log('🔎 Detalhes completos dos registros encontrados:', JSON.stringify(data, null, 2));
    
    return exists;
  } catch (error) {
    console.error('Erro ao verificar CPF:', error);
    return false;
  }
};

// Função para salvar dados parciais do MultiStepForm na nova tabela (a cada etapa)
export const savePartialMultiStepFormData = async (formData: MultiStepFormData, userId?: string, isUpdate: boolean = false, existingUuid?: string): Promise<{ success: boolean; error?: string; isUpdate?: boolean }> => {
  try {
    // Converter os dados do formulário para o formato da nova tabela
    const cadastroData = mapMultiStepFormDataToNewTable(formData, userId, existingUuid, isUpdate);

    console.log('Salvando dados parciais no Supabase:', { isUpdate, userId, cadastroData });
    console.log('Dados de entidade recebidos:', formData.entidade);
    console.log('Dados de entidade mapeados:', {
      entidade_nome: cadastroData.entidade_nome,
      entidade_municipio: cadastroData.entidade_municipio,
      entidade_bairro: cadastroData.entidade_bairro,
      entidade_complemento: cadastroData.entidade_complemento,
      entidade_estado: cadastroData.entidade_estado,
      entidade_cnpj: cadastroData.entidade_cnpj,
      entidade_endereco: cadastroData.entidade_endereco,
      entidade_telefone: cadastroData.entidade_telefone,
      entidade_email: cadastroData.entidade_email
    });
    
    // 🎯 DEBUG ESPECÍFICO: Dados do Dirigente
    console.log('🎯 Dados de dirigente recebidos:', formData.dirigente);
    console.log('🎯 Dados de dirigente mapeados:', {
      dirigente_nome: cadastroData.dirigente_nome,
      dirigente_cpf: cadastroData.dirigente_cpf,
      dirigente_rg: cadastroData.dirigente_rg,
      dirigente_telefone: cadastroData.dirigente_telefone,
      dirigente_endereco: cadastroData.dirigente_endereco,
      dirigente_apelido: cadastroData.dirigente_apelido
    });
    
    // 💰 DEBUG ESPECÍFICO: Dados de Renda (Step 5)
    console.log('💰 Dados de renda recebidos:', formData.renda);
    console.log('💰 Dados de renda mapeados:', {
      renda_profissao1: cadastroData.renda_profissao1,
      renda_profissao1_valor: cadastroData.renda_profissao1_valor,
      renda_profissao2: cadastroData.renda_profissao2,
      renda_profissao2_valor: cadastroData.renda_profissao2_valor,
      renda_profissao3: cadastroData.renda_profissao3,
      renda_profissao3_valor: cadastroData.renda_profissao3_valor,
      renda_total: cadastroData.renda_total,
      renda_possui_financiamento_ativo: cadastroData.renda_possui_financiamento_ativo,
      renda_banco_financiamento: cadastroData.renda_banco_financiamento,
      renda_tem_veiculo: cadastroData.renda_tem_veiculo,
      renda_qual_veiculo: cadastroData.renda_qual_veiculo,
      renda_casa_propria: cadastroData.renda_casa_propria,
      renda_onde_casa_propria: cadastroData.renda_onde_casa_propria
    });

    // 📡 DEBUG ESPECÍFICO: Dados de Comunicação (Step 10)
    console.log('📡 Dados de comunicação recebidos:', formData.comunicacao);
    console.log('📡 Dados de comunicação mapeados:', {
      comunicacao_tem_sinal_celular: cadastroData.comunicacao_tem_sinal_celular,
      comunicacao_operadora_celular: cadastroData.comunicacao_operadora_celular,
      comunicacao_tem_sinal_internet: cadastroData.comunicacao_tem_sinal_internet,
      comunicacao_operadora_internet: cadastroData.comunicacao_operadora_internet,
      comunicacao_tem_sinal_radio: cadastroData.comunicacao_tem_sinal_radio,
      comunicacao_qual_radio: cadastroData.comunicacao_qual_radio,
      comunicacao_programa_radio_preferido: cadastroData.comunicacao_programa_radio_preferido,
      comunicacao_tem_sinal_tv: cadastroData.comunicacao_tem_sinal_tv,
      comunicacao_qual_tv: cadastroData.comunicacao_qual_tv,
      comunicacao_programa_tv_preferido: cadastroData.comunicacao_programa_tv_preferido
    });

    // 🏠 DEBUG ESPECÍFICO: Dados de Habitação (Step 11)
    console.log('🏠 Dados de habitação recebidos:', formData.habitacao);
    console.log('🏠 Dados de habitação mapeados:', {
      habitacao_tem_casa_propriedade: cadastroData.habitacao_tem_casa_propriedade,
      habitacao_tem_banheiro: cadastroData.habitacao_tem_banheiro,
      habitacao_cisterna_negra: cadastroData.habitacao_cisterna_negra,
      habitacao_saneamento: cadastroData.habitacao_saneamento
    });
    
    // Log específico para o campo bairro
    console.log('🏘️ CAMPO BAIRRO - Debug detalhado:');
    console.log('🏘️ Dados de entidade recebidos:', formData.entidade);
    console.log('🏘️ Campo bairro original:', formData.entidade?.bairro);
    console.log('🏘️ Campo bairro mapeado para cadastroData.bairro:', cadastroData.bairro);
    console.log('🏘️ Tipo do campo bairro:', typeof formData.entidade?.bairro);
    console.log('🏘️ Campo bairro é string vazia?', formData.entidade?.bairro === '');
    console.log('🏘️ Campo bairro é null?', formData.entidade?.bairro === null);
    console.log('🏘️ Campo bairro é undefined?', formData.entidade?.bairro === undefined);
    console.log('Telefone principal mapeado:', {
      telefone_principal: cadastroData.telefone,
      telefone_entidade: cadastroData.entidade_telefone,
      telefone_dirigente: cadastroData.dirigente_telefone
    });
    console.log('Dados de renda recebidos:', formData.renda);
    console.log('Dados de renda mapeados:', {
      renda_profissao1: cadastroData.renda_profissao1,
      renda_profissao1_valor: cadastroData.renda_profissao1_valor,
      renda_profissao2: cadastroData.renda_profissao2,
      renda_profissao2_valor: cadastroData.renda_profissao2_valor,
      renda_profissao3: cadastroData.renda_profissao3,
      renda_profissao3_valor: cadastroData.renda_profissao3_valor,
      renda_total: cadastroData.renda_total,
      renda_possui_financiamento_ativo: cadastroData.renda_possui_financiamento_ativo,
      renda_banco_financiamento: cadastroData.renda_banco_financiamento,
      renda_tem_veiculo: cadastroData.renda_tem_veiculo,
      renda_qual_veiculo: cadastroData.renda_qual_veiculo,
      renda_casa_propria: cadastroData.renda_casa_propria,
      renda_onde_casa_propria: cadastroData.renda_onde_casa_propria
    });

    // Log para identificar campos com strings vazias que podem causar erro
    console.log('Verificando campos problemáticos:');
    Object.entries(cadastroData).forEach(([key, value]) => {
      if (value === '' || value === '""') {
        console.warn(`⚠️ Campo ${key} tem string vazia:`, value);
      }
    });
    console.log('Campos obrigatórios:', {
      ...(isUpdate ? {} : { 
        uuid_usuario: cadastroData.uuid_usuario,
        timestamp_cadastro: cadastroData.timestamp_cadastro,
        dirigente_cpf: cadastroData.dirigente_cpf,
        documentacao_cpf: cadastroData.documentacao_cpf
      }),
      nome_completo: cadastroData.nome_completo,
      qtd_filhos: cadastroData.qtd_filhos,
      user_id: cadastroData.user_id
    });

    console.log('🎯 PONTO DE CONTROLE: Antes da verificação do registro');
    console.log('🎯 isUpdate atual:', isUpdate);
    console.log('🎯 userId:', userId);

    let result;
    
    if (isUpdate) {
      // Verificar se o registro realmente existe antes de tentar atualizar
      console.log('🔍 Verificando se registro existe para user_id:', userId);
      const existingRecord = await supabase
        .from('questionario_multistep')
        .select('id, user_id, dirigente_nome, dirigente_cpf')
        .eq('user_id', userId)
        .single();
      
      console.log('🔍 Registro existente encontrado:', existingRecord);
      
      if (existingRecord.error && existingRecord.error.code === 'PGRST116') {
        console.log('⚠️ Nenhum registro encontrado - convertendo para INSERT');
        isUpdate = false;
      } else if (existingRecord.error) {
        console.log('⚠️ Erro ao verificar registro existente:', existingRecord.error);
        isUpdate = false;
      } else if (existingRecord.data) {
        console.log('✅ Registro existe - continuando com UPDATE');
        console.log('✅ Dados do registro existente:', existingRecord.data);
      }
      
      if (!isUpdate) {
        console.log('➡️ Redirecionando para INSERT porque não há registro existente');
      } else {
        console.log('🔍 Iniciando verificação de CPF duplicado');
        // Verificar se algum CPF específico já existe em outro registro antes de atualizar
        const cpfsToCheck = [...new Set([
          cadastroData.documentacao_cpf,
          cadastroData.dirigente_cpf
        ])].filter(cpf => cpf && cpf !== '00000000000');

        console.log('🔍 CPFs para verificar (sem duplicatas):', cpfsToCheck);

        for (const cpf of cpfsToCheck) {
          if (cpf && userId) {
            console.log('🔍 Verificando CPF:', cpf);
            const cpfExists = await checkCpfExistsInOtherRecord(cpf, userId);
            console.log('🔍 CPF existe em outro registro?', cpfExists);
            if (cpfExists) {
              console.log('❌ CPF duplicado encontrado - retornando erro');
              return {
                success: false,
                error: `O CPF ${cpf} já está sendo usado por outro usuário. Por favor, verifique o número digitado.`
              };
            }
          }
        }

        console.log('✅ Verificação de CPF concluída - prosseguindo para UPDATE');

        // Atualizar registro existente usando user_id
        console.log('🔄 Tentando atualizar registro para user_id:', userId);
        console.log('🔄 Dados que serão enviados para o update:', {
          dirigente_nome: cadastroData.dirigente_nome,
          dirigente_cpf: cadastroData.dirigente_cpf,
          dirigente_rg: cadastroData.dirigente_rg,
          dirigente_telefone: cadastroData.dirigente_telefone,
          dirigente_endereco: cadastroData.dirigente_endereco,
          dirigente_apelido: cadastroData.dirigente_apelido
        });
        
        result = await supabase
          .from('questionario_multistep')
          .update(cadastroData)
          .eq('user_id', userId)
          .select();
        
        console.log('🔄 Resultado completo da atualização:', result);
        console.log('🔄 Dados retornados após update:', result.data);
        console.log('🔄 Número de registros afetados:', result.data?.length || 0);
        console.log('🔄 FIM DO BLOCO UPDATE');
      }
    }
    
    if (!isUpdate) {
      // Inserir novo registro
      console.log('📝 Tentando inserir novo registro');
      result = await supabase
        .from('questionario_multistep')
        .insert([cadastroData])
        .select();
      console.log('📝 Resultado da inserção:', result);
      console.log('📝 FIM DO BLOCO INSERT');
    }

    console.log('🎯 FINAL: result definido como:', result ? 'EXISTE' : 'UNDEFINED');

    if (result.error) {
      console.error('Erro do Supabase:', result.error);
      console.error('Detalhes do erro:', {
        code: result.error.code,
        message: result.error.message,
        details: result.error.details,
        hint: result.error.hint
      });
      
      // Tratar erros específicos com mensagens mais amigáveis
      if (result.error.code === '23505' && result.error.message.includes('cadastro_inicial_cpf_key')) {
        return { 
          success: false, 
          error: 'Este CPF já foi cadastrado anteriormente. Cada CPF pode ser registrado apenas uma vez.' 
        };
      }
      
      // Outros erros específicos podem ser adicionados aqui
      if (result.error.code === '23502') {
        return { 
          success: false, 
          error: 'Alguns campos obrigatórios não foram preenchidos corretamente.' 
        };
      }
      
      return { success: false, error: result.error.message };
    }

    console.log('Dados salvos com sucesso:', result.data);
    console.log('Resultado da operação:', { 
      isUpdate, 
      userId, 
      rowsAffected: result.data?.length || 0,
      data: result.data 
    });
    return { success: true, isUpdate };
    
  } catch (error) {
    console.error('Erro ao salvar dados:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    };
  }
};

// Função para verificar se já existe um registro para este usuário
export const checkExistingRecord = async (userId?: string): Promise<{ exists: boolean; uuid?: string }> => {
  try {
    if (!userId) {
      return { exists: false };
    }

    const { data, error } = await supabase
      .from('questionario_multistep')
      .select('uuid_usuario')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
      console.error('Erro ao verificar registro existente:', error);
      return { exists: false };
    }

    return { exists: !!data, uuid: data?.uuid_usuario };
  } catch (error) {
    console.error('Erro ao verificar registro existente:', error);
    return { exists: false };
  }
};

// Nova função para carregar dados existentes do banco
export const loadExistingFormData = async (userId?: string): Promise<{ success: boolean; data?: MultiStepFormData; error?: string }> => {
  try {
    if (!userId) {
      return { success: false, error: 'User ID não fornecido' };
    }

    console.log('🔍 Carregando dados existentes para user_id:', userId);

    const { data: record, error } = await supabase
      .from('questionario_multistep')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        console.log('📝 Nenhum registro existente encontrado');
        return { success: true, data: undefined };
      }
      console.error('❌ Erro ao carregar dados existentes:', error);
      return { success: false, error: error.message };
    }

    console.log('✅ Dados existentes carregados:', record);
    
    // Log específico para todos os campos da família (JSONB)
    console.log('🔍 DEBUG FAMÍLIA - Campos JSONB:', {
      familia_conjuge: record.familia_conjuge,
      familia_filhos: record.familia_filhos,
      familia_pai: record.familia_pai,
      familia_mae: record.familia_mae
    });
    
    // Log específico para campos JSONB
    console.log('🔍 DEBUG JSONB - familia_filhos:', {
      raw: record.familia_filhos,
      type: typeof record.familia_filhos,
      isArray: Array.isArray(record.familia_filhos)
    });
    
    console.log('🔍 DEBUG JSONB - producao_tipos_criacoes:', {
      raw: record.producao_tipos_criacoes,
      type: typeof record.producao_tipos_criacoes,
      isArray: Array.isArray(record.producao_tipos_criacoes)
    });

    // Converter dados do banco de volta para o formato do formulário
    const formData: MultiStepFormData = {
      entidade: {
        nome: record.entidade_nome || '',
        cep: record.entidade_cep || '',
        municipio: record.entidade_municipio || '',
        bairro: record.entidade_bairro || '',
        complemento: record.entidade_complemento || '',
        estado: record.entidade_estado || '',
        numeroSociosInformados: record.entidade_numero_socios_informados || 0,
        numeroSociosPlataforma: record.entidade_numero_socios_plataforma || 0,
        cnpj: record.entidade_cnpj || '',
        endereco: record.entidade_endereco || '',
        telefone: record.entidade_telefone || '',
        email: record.entidade_email || '',
        linkSite: record.entidade_link_site || '',
        linkRedesSociais: record.entidade_redes_sociais || '',
        contaBancaria: record.entidade_conta_bancaria || '',
        banco: record.entidade_banco || ''
      },
      dirigente: {
        nome: record.dirigente_nome || '',
        apelido: record.dirigente_apelido || '',
        rg: record.dirigente_rg || '',
        cpf: record.dirigente_cpf || '',
        endereco: record.dirigente_endereco || '',
        telefone: record.dirigente_telefone || ''
      },
      proprietario: {
        nome: record.nome_completo || '',
        sexo: record.sexo || '',
        corPele: record.cor_pele || '',
        religiao: record.religiao || '',
        time: record.time || '',
        esportePreferido: record.esporte_preferido || '',
        musica: record.musica || '',
        artista: record.artista || '',
        estadoCivil: record.estado_civil || '',
        telefone: record.telefone || ''
      },
      documentacao: {
        rg: record.documentacao_rg || '',
        cpf: record.documentacao_cpf || '',
        dataNascimento: record.data_nascimento || '',
        idade: record.idade || 0,
        nis: record.documentacao_nis || '',
        pis: record.documentacao_pis || '',
        caf: record.documentacao_caf || false,
        cartaoProdutor: record.documentacao_cartao_produtor || '',
        anexos: {
          rgFile: null,
          cpfFile: null
        }
      },
      renda: {
        profissao1: record.renda_profissao1 || '',
        rendaProfissao1: record.renda_profissao1_valor || 0,
        profissao2: record.renda_profissao2 || '',
        rendaProfissao2: record.renda_profissao2_valor || 0,
        profissao3: record.renda_profissao3 || '',
        rendaProfissao3: record.renda_profissao3_valor || 0,
        rendaTotal: record.renda_total || 0,
        possuiFinanciamentoAtivo: record.renda_possui_financiamento_ativo || false,
        bancoFinanciamento: record.renda_banco_financiamento || '',
        temVeiculo: record.renda_tem_veiculo || false,
        qualVeiculo: record.renda_qual_veiculo || '',
        casaPropria: record.renda_casa_propria || false,
        ondeCasaPropria: record.renda_onde_casa_propria || ''
      },
      saude: {
        temDeficiencia: record.saude_tem_deficiencia || false,
        qualDeficiencia: record.saude_qual_deficiencia || '',
        temCromoidade: record.saude_tem_cromoidade || false,
        qualCromoidade: record.saude_qual_cromoidade || '',
        fazTratamento: record.saude_faz_tratamento || false,
        qualTratamento: record.saude_qual_tratamento || '',
        tomaMedicacaoControlada: record.saude_toma_medicacao_controlada || false,
        qualMedicacao: record.saude_qual_medicacao || ''
      },
      propriedade: {
        nome: record.propriedade_nome || '',
        endereco: record.propriedade_endereco || '',
        localizacao: record.propriedade_localizacao || ''
      },
      infraestrutura: {
        temReserva: record.infraestrutura_tem_reserva || false,
        areaReserva: record.infraestrutura_area_reserva || 0,
        areaProdutiva: record.infraestrutura_area_produtiva || 0,
        temEstrada: record.infraestrutura_tem_estrada || false,
        qualidadeEstrada: record.infraestrutura_qualidade_estrada || 'REGULAR',
        temEnergia: record.infraestrutura_tem_energia || false,
        tipoEnergia: record.infraestrutura_tipo_energia || 'MONOFASICO',
        tipoAlternativoEnergia: record.infraestrutura_tipo_alternativo_energia || 'GERADOR',
        temAgua: record.infraestrutura_tem_agua || false,
        tipoAgua: record.infraestrutura_tipo_agua || 'POCO',
        aguaEncanada: record.infraestrutura_agua_encanada || false,
        tipoSolo: record.infraestrutura_tipo_solo || '',
        vegetacao: record.infraestrutura_vegetacao || '',
        possuiGalpao: record.infraestrutura_possui_galpao || false,
        possuiSilo: record.infraestrutura_possui_silo || false,
        reservatorioAgua: record.infraestrutura_reservatorio_agua || false,
        energiaFotovoltaica: record.infraestrutura_energia_fotovoltaica || false,
        geracaoFotovoltaica: record.infraestrutura_geracao_fotovoltaica || '',
        sistemaIrrigacao: record.infraestrutura_sistema_irrigacao || false,
        tipoIrrigacao: record.infraestrutura_tipo_irrigacao || 'GOTEJO',
        areaIrrigada: record.infraestrutura_area_irrigada || 0
      },
      producao: {
        temPasto: record.producao_tem_pasto || false,
        areaPasto: record.producao_area_pasto || 0,
        temManga: record.producao_tem_manga || false,
        areaManga: record.producao_area_manga || 0,
        temProducaoAgricola: record.producao_tem_producao_agricola || false,
        quaisProducoes: record.producao_quais_producoes || '',
        feijaoArea: record.producao_feijao_area || 0,
        feijaoInicioSafra: record.producao_feijao_inicio_safra || '',
        feijaoPrevisaoColheita: record.producao_feijao_previsao_colheita || '',
        feijaoPrevisaoQuantidade: record.producao_feijao_previsao_quantidade || 0,
        areaPermitidaSemUso: record.producao_area_permitida_sem_uso || 0,
        temCriacoes: record.producao_tem_criacoes || false,
        tiposCriacoes: (() => {
          try {
            if (record.producao_tipos_criacoes && typeof record.producao_tipos_criacoes === 'string') {
              return JSON.parse(record.producao_tipos_criacoes);
            } else if (Array.isArray(record.producao_tipos_criacoes)) {
              return record.producao_tipos_criacoes;
            }
            return [];
          } catch (e) {
            console.warn('Erro ao fazer parse de producao_tipos_criacoes:', e);
            return [];
          }
        })(),
        frangosGranja: record.producao_frangos_granja || 0,
        idadeFrangos: record.producao_idade_frangos || 0,
        inicioFrangos: record.producao_inicio_frangos || '',
        finalAbate: record.producao_final_abate || '',
        pesoFrangos: record.producao_peso_frangos || 0,
        producaoArtesanalIndustrial: record.producao_producao_artesanal_industrial || 'ARTESANAL',
        tipoQueijo: record.producao_tipo_queijo || '',
        pesoQueijo: record.producao_peso_queijo || 0,
        quantidadeQueijo: record.producao_quantidade_queijo || 0,
        producaoLeiteira: record.producao_producao_leiteira || 0,
        mediaLitroDia: record.producao_media_litro_dia || 0,
        totalProducaoLeite: record.producao_total_producao_leite || 0,
        temPescado: record.producao_tem_pescado || false,
        reservatorioPescado: record.producao_reservatorio_pescado || '',
        especiePescado: record.producao_especie_pescado || '',
        inicioProducaoPescado: record.producao_inicio_producao_pescado || '',
        finalProducaoPescado: record.producao_final_producao_pescado || '',
        kgPescado: record.producao_kg_pescado || 0,
        potencialExpansao: record.producao_potencial_expansao || '',
        setorExpansao: record.producao_setor_expansao || 'AGRICULTURA',
        necessidadesExpansao: record.producao_necessidades_expansao || '',
        quantidadeNecessidades: record.producao_quantidade_necessidades || ''
      },
      comunicacao: {
        temSinalCelular: record.comunicacao_tem_sinal_celular || false,
        operadoraCelular: record.comunicacao_operadora_celular || '',
        temSinalInternet: record.comunicacao_tem_sinal_internet || false,
        operadoraInternet: record.comunicacao_operadora_internet || '',
        temSinalRadio: record.comunicacao_tem_sinal_radio || false,
        qualRadio: record.comunicacao_qual_radio || '',
        programaRadioPreferido: record.comunicacao_programa_radio_preferido || '',
        temSinalTV: record.comunicacao_tem_sinal_tv || false,
        qualTV: record.comunicacao_qual_tv || '',
        programaTVPreferido: record.comunicacao_programa_tv_preferido || ''
      },
      habitacao: {
        temCasaPropriedade: record.habitacao_tem_casa_propriedade || false,
        temBanheiro: record.habitacao_tem_banheiro || false,
        cisternaNegra: record.habitacao_cisterna_negra || false,
        saneamento: record.habitacao_saneamento || false
      },
      familia: {
        conjuge: (() => {
          try {
            if (record.familia_conjuge && typeof record.familia_conjuge === 'string') {
              return JSON.parse(record.familia_conjuge);
            } else if (typeof record.familia_conjuge === 'object' && record.familia_conjuge !== null) {
              return record.familia_conjuge;
            }
            return { nome: '', idade: 0, profissao: '' };
          } catch (e) {
            console.warn('Erro ao fazer parse de familia_conjuge:', e);
            return { nome: '', idade: 0, profissao: '' };
          }
        })(),
        filhos: (() => {
          try {
            if (record.familia_filhos && typeof record.familia_filhos === 'string') {
              return JSON.parse(record.familia_filhos);
            } else if (Array.isArray(record.familia_filhos)) {
              return record.familia_filhos;
            }
            return [];
          } catch (e) {
            console.warn('Erro ao fazer parse de familia_filhos:', e);
            return [];
          }
        })(),
        pai: (() => {
          try {
            if (record.familia_pai && typeof record.familia_pai === 'string') {
              return JSON.parse(record.familia_pai);
            } else if (typeof record.familia_pai === 'object' && record.familia_pai !== null) {
              return record.familia_pai;
            }
            return { nome: '', idade: 0, profissao: '' };
          } catch (e) {
            console.warn('Erro ao fazer parse de familia_pai:', e);
            return { nome: '', idade: 0, profissao: '' };
          }
        })(),
        mae: (() => {
          try {
            if (record.familia_mae && typeof record.familia_mae === 'string') {
              return JSON.parse(record.familia_mae);
            } else if (typeof record.familia_mae === 'object' && record.familia_mae !== null) {
              return record.familia_mae;
            }
            return { nome: '', idade: 0, profissao: '' };
          } catch (e) {
            console.warn('Erro ao fazer parse de familia_mae:', e);
            return { nome: '', idade: 0, profissao: '' };
          }
        })()
      }
    };

    console.log('🔄 Dados convertidos para formato do formulário:', formData);
    
    // Log específico da conversão da família
    console.log('🏠 DEBUG FAMÍLIA CONVERTIDA:', {
      conjuge: formData.familia.conjuge,
      filhos: formData.familia.filhos,
      pai: formData.familia.pai,
      mae: formData.familia.mae
    });

    return { success: true, data: formData };
  } catch (error) {
    console.error('❌ Erro inesperado ao carregar dados:', error);
    return { success: false, error: 'Erro inesperado ao carregar dados' };
  }
};

// Função para salvar dados do MultiStepForm
export const saveMultiStepFormData = async (formData: MultiStepFormData, userId?: string, existingUuid?: string): Promise<{ success: boolean; error?: string }> => {
  try {
    // Converter os dados do formulário para o formato da tabela
    const cadastroData = mapMultiStepFormData(formData, userId, existingUuid, false);

    console.log('Dados que serão enviados para o Supabase:', cadastroData);

    const { data, error } = await supabase
      .from('cadastro_inicial')
      .insert([cadastroData])
      .select();

    if (error) {
      console.error('Erro do Supabase:', error);
      
      // Tratar erros específicos com mensagens mais amigáveis
      if (error.code === '23505' && error.message.includes('cadastro_inicial_cpf_key')) {
        return { 
          success: false, 
          error: 'Este CPF já foi cadastrado anteriormente. Cada CPF pode ser registrado apenas uma vez.' 
        };
      }
      
      // Outros erros específicos podem ser adicionados aqui
      if (error.code === '23502') {
        return { 
          success: false, 
          error: 'Alguns campos obrigatórios não foram preenchidos corretamente.' 
        };
      }
      
      return { success: false, error: error.message };
    }

    console.log('Dados salvos com sucesso:', data);
    return { success: true };
    
  } catch (error) {
    console.error('Erro ao salvar dados:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    };
  }
};

export const saveFormData = async (formData: FormData, userId?: string): Promise<{ success: boolean; error?: string }> => {
  try {
    // Converter os dados do formulário para o formato da tabela
    const cadastroData: CadastroInicial = {
      uuid_usuario: uuidv4(),
      timestamp_cadastro: new Date().toISOString(),
      nome_completo: formData.nomeCompleto,
      cpf: formData.cpf.replace(/\D/g, ''), // Remove formatação
      telefone: formData.telefone.replace(/\D/g, ''), // Remove formatação (parênteses, espaços, hífen)
      cep: formData.cep.replace(/\D/g, ''), // Remove formatação
      logradouro: formData.logradouro,
      numero: formData.numero,
      complemento: formData.complemento || null,
      bairro: formData.bairro,
      localidade: formData.localidade,
      estado: formData.estado,
      estado_civil: mapEstadoCivil(formData.estadoCivil),
      qtd_filhos: formData.possuiFilhos === 'sim' ? (formData.quantidadeFilhos || 0) : 0,
      sexo: mapSexo(formData.sexo),
      ...(userId && { user_id: userId }), // Adiciona user_id se fornecido
    };

    console.log('Dados que serão enviados para o Supabase:', cadastroData);

    const { data, error } = await supabase
      .from('cadastro_inicial')
      .insert([cadastroData])
      .select();

    if (error) {
      console.error('Erro do Supabase:', error);
      
      // Tratar erros específicos com mensagens mais amigáveis
      if (error.code === '23505' && error.message.includes('cadastro_inicial_cpf_key')) {
        return { 
          success: false, 
          error: 'Este CPF já foi cadastrado anteriormente. Cada CPF pode ser registrado apenas uma vez.' 
        };
      }
      
      // Outros erros específicos podem ser adicionados aqui
      if (error.code === '23502') {
        return { 
          success: false, 
          error: 'Alguns campos obrigatórios não foram preenchidos corretamente.' 
        };
      }
      
      return { success: false, error: error.message };
    }

    console.log('Dados salvos com sucesso:', data);
    return { success: true };
    
  } catch (error) {
    console.error('Erro ao salvar dados:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    };
  }
};

// Função para verificar se CPF já existe no banco
export const checkCpfExists = async (cpf: string): Promise<{ exists: boolean; error?: string }> => {
  try {
    const cleanCpf = cpf.replace(/\D/g, '');
    
    const { data, error } = await supabase
      .from('cadastro_inicial')
      .select('cpf')
      .eq('cpf', cleanCpf)
      .limit(1);

    if (error) {
      console.error('Erro ao verificar CPF:', error);
      return { exists: false, error: error.message };
    }

    return { exists: data && data.length > 0 };
    
  } catch (error) {
    console.error('Erro ao verificar CPF:', error);
    return { 
      exists: false, 
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    };
  }
};

/**
 * Upload de documentos para o storage e atualização no banco
 */
export const uploadDocumentsAndUpdate = async (
  userId: string,
  rgFile: File | null,
  cpfFile: File | null
): Promise<{ success: boolean; error?: string; urls?: DocumentUpload }> => {
  try {
    console.log('🔄 Iniciando upload de documentos...');
    console.log('📄 RG File:', rgFile?.name);
    console.log('📄 CPF File:', cpfFile?.name);
    
    // Fazer upload dos documentos
    const uploadResult = await storageService.uploadDocuments(rgFile, cpfFile, userId);
    
    if (!uploadResult.success) {
      console.error('❌ Erro no upload:', uploadResult.error);
      return { success: false, error: uploadResult.error };
    }
    
    console.log('✅ Upload realizado com sucesso:', uploadResult);
    
    // Atualizar registro no banco com URLs dos documentos
    const updateData: any = {};
    
    if (uploadResult.rgUrl) {
      updateData.documentacao_rg_url = uploadResult.rgUrl;
    }
    
    if (uploadResult.cpfUrl) {
      updateData.documentacao_cpf_url = uploadResult.cpfUrl;
    }
    
    // Se temos URLs para atualizar, fazer o update
    if (Object.keys(updateData).length > 0) {
      const { error: updateError } = await supabase
        .from('questionario_multistep')
        .update(updateData)
        .eq('user_id', userId);
      
      if (updateError) {
        console.error('❌ Erro ao atualizar URLs no banco:', updateError);
        return { success: false, error: 'Erro ao salvar URLs dos documentos no banco' };
      }
      
      console.log('✅ URLs atualizadas no banco:', updateData);
    }
    
    return { 
      success: true, 
      urls: { 
        rgUrl: uploadResult.rgUrl, 
        cpfUrl: uploadResult.cpfUrl 
      }
    };
    
  } catch (error) {
    console.error('❌ Erro no processo de upload:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Erro interno no upload' 
    };
  }
};

/**
 * Função para salvar dados da documentação incluindo upload de arquivos
 */
export const saveDocumentacaoWithFiles = async (
  userId: string,
  documentacaoData: any,
  rgFile: File | null,
  cpfFile: File | null
): Promise<{ success: boolean; error?: string }> => {
  try {
    console.log('💾 Salvando dados de documentação...');
    console.log('👤 User ID:', userId);
    console.log('📋 Dados:', documentacaoData);
    
    // 1. Primeiro salvar/atualizar os dados básicos de documentação
    const updateData = {
      documentacao_rg: documentacaoData.rg,
      documentacao_cpf: documentacaoData.cpf?.replace(/\D/g, ''),
      documentacao_data_nascimento: documentacaoData.dataNascimento || null,
      documentacao_idade: documentacaoData.idade || null,
      documentacao_nis: documentacaoData.nis || null,
      documentacao_pis: documentacaoData.pis || null,
      documentacao_caf: documentacaoData.caf || false,
      documentacao_cartao_produtor: documentacaoData.cartaoProdutor || null,
    };
    
    const { error: updateError } = await supabase
      .from('questionario_multistep')
      .update(updateData)
      .eq('user_id', userId);
    
    if (updateError) {
      console.error('❌ Erro ao salvar dados de documentação:', updateError);
      return { success: false, error: 'Erro ao salvar dados de documentação' };
    }
    
    console.log('✅ Dados básicos salvos com sucesso');
    
    // 2. Se há arquivos, fazer upload e atualizar URLs
    if (rgFile || cpfFile) {
      const uploadResult = await uploadDocumentsAndUpdate(userId, rgFile, cpfFile);
      
      if (!uploadResult.success) {
        // Os dados básicos já foram salvos, mas falhou o upload
        console.warn('⚠️ Dados salvos, mas falha no upload:', uploadResult.error);
        return { 
          success: false, 
          error: `Dados salvos, mas erro no upload de documentos: ${uploadResult.error}`
        };
      }
      
      console.log('✅ Upload e atualização de URLs concluídos');
    }
    
    return { success: true };
    
  } catch (error) {
    console.error('❌ Erro no processo completo:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Erro interno' 
    };
  }
};
