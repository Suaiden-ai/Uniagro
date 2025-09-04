import { supabase, CadastroInicial, QuestionarioMultiStep } from '@/lib/supabase';
import { FormData, MultiStepFormData } from '@/types/form';
import { v4 as uuidv4 } from 'uuid';

// Função auxiliar para converter valores vazios em null para campos numéricos
const toNumeric = (value: any): number | null => {
  if (value === null || value === undefined || value === '' || value === 0) {
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
    telefone: formData.dirigente?.telefone?.replace(/\D/g, '') || '',
    cep: null,
    logradouro: formData.entidade?.endereco || null,
    numero: null,
    complemento: null,
    bairro: null,
    localidade: formData.entidade?.municipio || '',
    estado: formData.entidade?.estado || '',
    estado_civil: formData.proprietario?.estadoCivil || null,
    qtd_filhos: formData.familia?.filhos?.length || 0,
    sexo: formData.proprietario?.sexo || null,
    
    // Dados da Entidade
    entidade_nome: toStringOrNull(formData.entidade?.nome),
    entidade_municipio: toStringOrNull(formData.entidade?.municipio),
    entidade_estado: toStringOrNull(formData.entidade?.estado),
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
    saude_tem_deficiencia: formData.saude?.temDeficiencia === 'Sim' ? true : formData.saude?.temDeficiencia === 'Não' ? false : undefined,
    saude_qual_deficiencia: formData.saude?.qualDeficiencia,
    saude_tem_cromoidade: formData.saude?.temCromoidade === 'Sim' ? true : formData.saude?.temCromoidade === 'Não' ? false : undefined,
    saude_qual_cromoidade: formData.saude?.qualCromoidade,
    saude_faz_tratamento: formData.saude?.fazTratamento === 'Sim' ? true : formData.saude?.fazTratamento === 'Não' ? false : undefined,
    saude_qual_tratamento: formData.saude?.qualTratamento,
    saude_toma_medicacao_controlada: formData.saude?.tomaMedicacaoControlada === 'Sim' ? true : formData.saude?.tomaMedicacaoControlada === 'Não' ? false : undefined,
    saude_qual_medicacao: formData.saude?.qualMedicacao,
    
    // Propriedade Rural
    propriedade_nome: formData.propriedade?.nome,
    propriedade_endereco: formData.propriedade?.endereco,
    propriedade_localizacao: formData.propriedade?.localizacao,
    
    // Infraestrutura
    infraestrutura_tem_reserva: formData.infraestrutura?.temReserva === 'Sim' ? true : formData.infraestrutura?.temReserva === 'Não' ? false : undefined,
    infraestrutura_area_reserva: toNumeric(formData.infraestrutura?.areaReserva),
    infraestrutura_area_produtiva: toNumeric(formData.infraestrutura?.areaProdutiva),
    infraestrutura_tem_estrada: formData.infraestrutura?.temEstrada === 'Sim' ? true : formData.infraestrutura?.temEstrada === 'Não' ? false : undefined,
    infraestrutura_qualidade_estrada: formData.infraestrutura?.qualidadeEstrada,
    infraestrutura_tem_energia: formData.infraestrutura?.temEnergia === 'Sim' ? true : formData.infraestrutura?.temEnergia === 'Não' ? false : undefined,
    infraestrutura_tipo_energia: formData.infraestrutura?.tipoEnergia,
    infraestrutura_tipo_alternativo_energia: formData.infraestrutura?.tipoAlternativoEnergia,
    infraestrutura_tem_agua: formData.infraestrutura?.temAgua === 'Sim' ? true : formData.infraestrutura?.temAgua === 'Não' ? false : undefined,
    infraestrutura_tipo_agua: formData.infraestrutura?.tipoAgua,
    infraestrutura_agua_encanada: formData.infraestrutura?.aguaEncanada === 'Sim' ? true : formData.infraestrutura?.aguaEncanada === 'Não' ? false : undefined,
    infraestrutura_tipo_solo: formData.infraestrutura?.tipoSolo,
    infraestrutura_vegetacao: formData.infraestrutura?.vegetacao,
    infraestrutura_possui_galpao: formData.infraestrutura?.possuiGalpao === 'Sim' ? true : formData.infraestrutura?.possuiGalpao === 'Não' ? false : undefined,
    infraestrutura_possui_silo: formData.infraestrutura?.possuiSilo === 'Sim' ? true : formData.infraestrutura?.possuiSilo === 'Não' ? false : undefined,
    infraestrutura_reservatorio_agua: formData.infraestrutura?.reservatorioAgua === 'Sim' ? true : formData.infraestrutura?.reservatorioAgua === 'Não' ? false : undefined,
    infraestrutura_energia_fotovoltaica: formData.infraestrutura?.energiaFotovoltaica === 'Sim' ? true : formData.infraestrutura?.energiaFotovoltaica === 'Não' ? false : undefined,
    infraestrutura_geracao_fotovoltaica: toNumeric(formData.infraestrutura?.geracaoFotovoltaica),
    infraestrutura_sistema_irrigacao: formData.infraestrutura?.sistemaIrrigacao === 'Sim' ? true : formData.infraestrutura?.sistemaIrrigacao === 'Não' ? false : undefined,
    infraestrutura_tipo_irrigacao: formData.infraestrutura?.tipoIrrigacao,
    infraestrutura_area_irrigada: toNumeric(formData.infraestrutura?.areaIrrigada),
    
    // Produção Agrícola
    producao_tem_pasto: formData.producao?.temPasto === 'Sim' ? true : formData.producao?.temPasto === 'Não' ? false : undefined,
    producao_area_pasto: toNumeric(formData.producao?.areaPasto),
    producao_tem_manga: formData.producao?.temManga === 'Sim' ? true : formData.producao?.temManga === 'Não' ? false : undefined,
    producao_area_manga: toNumeric(formData.producao?.areaManga),
    producao_tem_producao_agricola: formData.producao?.temProducaoAgricola === 'Sim' ? true : formData.producao?.temProducaoAgricola === 'Não' ? false : undefined,
    producao_quais_producoes: toStringOrNull(formData.producao?.quaisProducoes),
    producao_feijao_area: toNumeric(formData.producao?.feijaoArea),
    producao_feijao_inicio_safra: formData.producao?.feijaoInicioSafra || null,
    producao_feijao_previsao_colheita: formData.producao?.feijaoPrevisaoColheita || null,
    producao_feijao_previsao_quantidade: toNumeric(formData.producao?.feijaoPrevisaoQuantidade),
    producao_area_permitida_sem_uso: toNumeric(formData.producao?.areaPermitidaSemUso),
    producao_tem_criacoes: formData.producao?.temCriacoes === 'Sim' ? true : formData.producao?.temCriacoes === 'Não' ? false : undefined,
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
    producao_tem_pescado: formData.producao?.temPescado === 'Sim' ? true : formData.producao?.temPescado === 'Não' ? false : undefined,
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
    comunicacao_tem_sinal_celular: formData.comunicacao?.temSinalCelular === 'Sim' ? true : formData.comunicacao?.temSinalCelular === 'Não' ? false : undefined,
    comunicacao_operadora_celular: formData.comunicacao?.operadoraCelular,
    comunicacao_tem_sinal_internet: formData.comunicacao?.temSinalInternet === 'Sim' ? true : formData.comunicacao?.temSinalInternet === 'Não' ? false : undefined,
    comunicacao_operadora_internet: formData.comunicacao?.operadoraInternet,
    comunicacao_tem_sinal_radio: formData.comunicacao?.temSinalRadio === 'Sim' ? true : formData.comunicacao?.temSinalRadio === 'Não' ? false : undefined,
    comunicacao_qual_radio: formData.comunicacao?.qualRadio,
    comunicacao_programa_radio_preferido: formData.comunicacao?.programaRadioPreferido,
    comunicacao_tem_sinal_tv: formData.comunicacao?.temSinalTV === 'Sim' ? true : formData.comunicacao?.temSinalTV === 'Não' ? false : undefined,
    comunicacao_qual_tv: formData.comunicacao?.qualTV,
    comunicacao_programa_tv_preferido: formData.comunicacao?.programaTVPreferido,
    
    // Habitação
    habitacao_tem_casa_propriedade: formData.habitacao?.temCasaPropriedade === 'Sim' ? true : formData.habitacao?.temCasaPropriedade === 'Não' ? false : undefined,
    habitacao_tem_banheiro: formData.habitacao?.temBanheiro === 'Sim' ? true : formData.habitacao?.temBanheiro === 'Não' ? false : undefined,
    habitacao_cisterna_negra: formData.habitacao?.cisternaNegra === 'Sim' ? true : formData.habitacao?.cisternaNegra === 'Não' ? false : undefined,
    habitacao_saneamento: formData.habitacao?.saneamento === 'Sim' ? true : formData.habitacao?.saneamento === 'Não' ? false : undefined,
    
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
    telefone: formData.dirigente?.telefone?.replace(/\D/g, '') || '',
    cep: null, // Não temos CEP no questionário multi-step
    logradouro: formData.entidade?.endereco || null,
    numero: null, // Não temos número específico
    complemento: null,
    bairro: null, // Não temos bairro específico
    localidade: formData.entidade?.municipio || '',
    estado: formData.entidade?.estado || '',
    estado_civil: null, // Não temos estado civil no questionário multi-step
    qtd_filhos: formData.familia?.filhos?.length || 0,
    sexo: formData.proprietario?.sexo || null,
    user_id: userId,
    
    // Dados da Entidade
    entidade_nome: formData.entidade?.nome,
    entidade_municipio: formData.entidade?.municipio,
    entidade_estado: formData.entidade?.estado,
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
    saude_tem_deficiencia: formData.saude?.temDeficiencia === 'Sim' ? true : formData.saude?.temDeficiencia === 'Não' ? false : undefined,
    saude_qual_deficiencia: formData.saude?.qualDeficiencia,
    saude_tem_cromoidade: formData.saude?.temCromoidade === 'Sim' ? true : formData.saude?.temCromoidade === 'Não' ? false : undefined,
    saude_qual_cromoidade: formData.saude?.qualCromoidade,
    saude_faz_tratamento: formData.saude?.fazTratamento === 'Sim' ? true : formData.saude?.fazTratamento === 'Não' ? false : undefined,
    saude_qual_tratamento: formData.saude?.qualTratamento,
    saude_toma_medicacao_controlada: formData.saude?.tomaMedicacaoControlada === 'Sim' ? true : formData.saude?.tomaMedicacaoControlada === 'Não' ? false : undefined,
    saude_qual_medicacao: formData.saude?.qualMedicacao,
    
    // Propriedade Rural
    propriedade_nome: formData.propriedade?.nome,
    propriedade_endereco: formData.propriedade?.endereco,
    propriedade_localizacao: formData.propriedade?.localizacao,
    
    // Infraestrutura
    infraestrutura_tem_reserva: formData.infraestrutura?.temReserva === 'Sim' ? true : formData.infraestrutura?.temReserva === 'Não' ? false : undefined,
    infraestrutura_area_reserva: toNumeric(formData.infraestrutura?.areaReserva),
    infraestrutura_area_produtiva: toNumeric(formData.infraestrutura?.areaProdutiva),
    infraestrutura_tem_estrada: formData.infraestrutura?.temEstrada === 'Sim' ? true : formData.infraestrutura?.temEstrada === 'Não' ? false : undefined,
    infraestrutura_qualidade_estrada: formData.infraestrutura?.qualidadeEstrada,
    infraestrutura_tem_energia: formData.infraestrutura?.temEnergia === 'Sim' ? true : formData.infraestrutura?.temEnergia === 'Não' ? false : undefined,
    infraestrutura_tipo_energia: formData.infraestrutura?.tipoEnergia,
    infraestrutura_tipo_alternativo_energia: formData.infraestrutura?.tipoAlternativoEnergia,
    infraestrutura_tem_agua: formData.infraestrutura?.temAgua === 'Sim' ? true : formData.infraestrutura?.temAgua === 'Não' ? false : undefined,
    infraestrutura_tipo_agua: formData.infraestrutura?.tipoAgua,
    infraestrutura_agua_encanada: formData.infraestrutura?.aguaEncanada === 'Sim' ? true : formData.infraestrutura?.aguaEncanada === 'Não' ? false : undefined,
    infraestrutura_tipo_solo: formData.infraestrutura?.tipoSolo,
    infraestrutura_vegetacao: formData.infraestrutura?.vegetacao,
    infraestrutura_possui_galpao: formData.infraestrutura?.possuiGalpao === 'Sim' ? true : formData.infraestrutura?.possuiGalpao === 'Não' ? false : undefined,
    infraestrutura_possui_silo: formData.infraestrutura?.possuiSilo === 'Sim' ? true : formData.infraestrutura?.possuiSilo === 'Não' ? false : undefined,
    infraestrutura_reservatorio_agua: formData.infraestrutura?.reservatorioAgua === 'Sim' ? true : formData.infraestrutura?.reservatorioAgua === 'Não' ? false : undefined,
    infraestrutura_energia_fotovoltaica: formData.infraestrutura?.energiaFotovoltaica === 'Sim' ? true : formData.infraestrutura?.energiaFotovoltaica === 'Não' ? false : undefined,
    infraestrutura_geracao_fotovoltaica: toNumeric(formData.infraestrutura?.geracaoFotovoltaica),
    infraestrutura_sistema_irrigacao: formData.infraestrutura?.sistemaIrrigacao === 'Sim' ? true : formData.infraestrutura?.sistemaIrrigacao === 'Não' ? false : undefined,
    infraestrutura_tipo_irrigacao: formData.infraestrutura?.tipoIrrigacao,
    infraestrutura_area_irrigada: toNumeric(formData.infraestrutura?.areaIrrigada),
    
    // Produção Agrícola
    producao_tem_pasto: formData.producao?.temPasto === 'Sim' ? true : formData.producao?.temPasto === 'Não' ? false : undefined,
    producao_area_pasto: toNumeric(formData.producao?.areaPasto),
    producao_tem_manga: formData.producao?.temManga === 'Sim' ? true : formData.producao?.temManga === 'Não' ? false : undefined,
    producao_area_manga: toNumeric(formData.producao?.areaManga),
    producao_tem_producao_agricola: formData.producao?.temProducaoAgricola === 'Sim' ? true : formData.producao?.temProducaoAgricola === 'Não' ? false : undefined,
    producao_quais_producoes: toStringOrNull(formData.producao?.quaisProducoes),
    producao_feijao_area: toNumeric(formData.producao?.feijaoArea),
    producao_feijao_inicio_safra: formData.producao?.feijaoInicioSafra || null,
    producao_feijao_previsao_colheita: formData.producao?.feijaoPrevisaoColheita || null,
    producao_feijao_previsao_quantidade: toNumeric(formData.producao?.feijaoPrevisaoQuantidade),
    producao_area_permitida_sem_uso: toNumeric(formData.producao?.areaPermitidaSemUso),
    producao_tem_criacoes: formData.producao?.temCriacoes === 'Sim' ? true : formData.producao?.temCriacoes === 'Não' ? false : undefined,
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
    producao_tem_pescado: formData.producao?.temPescado === 'Sim' ? true : formData.producao?.temPescado === 'Não' ? false : undefined,
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
    comunicacao_tem_sinal_celular: formData.comunicacao?.temSinalCelular === 'Sim' ? true : formData.comunicacao?.temSinalCelular === 'Não' ? false : undefined,
    comunicacao_operadora_celular: formData.comunicacao?.operadoraCelular,
    comunicacao_tem_sinal_internet: formData.comunicacao?.temSinalInternet === 'Sim' ? true : formData.comunicacao?.temSinalInternet === 'Não' ? false : undefined,
    comunicacao_operadora_internet: formData.comunicacao?.operadoraInternet,
    comunicacao_tem_sinal_radio: formData.comunicacao?.temSinalRadio === 'Sim' ? true : formData.comunicacao?.temSinalRadio === 'Não' ? false : undefined,
    comunicacao_qual_radio: formData.comunicacao?.qualRadio,
    comunicacao_programa_radio_preferido: formData.comunicacao?.programaRadioPreferido,
    comunicacao_tem_sinal_tv: formData.comunicacao?.temSinalTV === 'Sim' ? true : formData.comunicacao?.temSinalTV === 'Não' ? false : undefined,
    comunicacao_qual_tv: formData.comunicacao?.qualTV,
    comunicacao_programa_tv_preferido: formData.comunicacao?.programaTVPreferido,
    
    // Habitação
    habitacao_tem_casa_propriedade: formData.habitacao?.temCasaPropriedade === 'Sim' ? true : formData.habitacao?.temCasaPropriedade === 'Não' ? false : undefined,
    habitacao_tem_banheiro: formData.habitacao?.temBanheiro === 'Sim' ? true : formData.habitacao?.temBanheiro === 'Não' ? false : undefined,
    habitacao_cisterna_negra: formData.habitacao?.cisternaNegra === 'Sim' ? true : formData.habitacao?.cisternaNegra === 'Não' ? false : undefined,
    habitacao_saneamento: formData.habitacao?.saneamento === 'Sim' ? true : formData.habitacao?.saneamento === 'Não' ? false : undefined,
    
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
    if (!cpf || cpf === '00000000000') {
      return false; // CPF temporário ou vazio não precisa ser verificado
    }

    const { data, error } = await supabase
      .from('questionario_multistep')
      .select('user_id')
      .or(`documentacao_cpf.eq.${cpf},dirigente_cpf.eq.${cpf}`)
      .neq('user_id', currentUserId)
      .limit(1);

    if (error) {
      console.error('Erro ao verificar CPF:', error);
      return false;
    }

    return data && data.length > 0;
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
        cpf: cadastroData.cpf
      }),
      nome_completo: cadastroData.nome_completo,
      qtd_filhos: cadastroData.qtd_filhos,
      user_id: cadastroData.user_id
    });

    let result;
    
    if (isUpdate) {
      // Verificar se algum CPF específico já existe em outro registro antes de atualizar
      const cpfsToCheck = [
        cadastroData.documentacao_cpf,
        cadastroData.dirigente_cpf
      ].filter(cpf => cpf && cpf !== '00000000000');

      for (const cpf of cpfsToCheck) {
        if (cpf && userId) {
          const cpfExists = await checkCpfExistsInOtherRecord(cpf, userId);
          if (cpfExists) {
            return {
              success: false,
              error: `O CPF ${cpf} já está sendo usado por outro usuário. Por favor, verifique o número digitado.`
            };
          }
        }
      }

      // Atualizar registro existente usando user_id
      console.log('Tentando atualizar registro para user_id:', userId);
      result = await supabase
        .from('questionario_multistep')
        .update(cadastroData)
        .eq('user_id', userId)
        .select();
      console.log('Resultado da atualização:', result);
    } else {
      // Inserir novo registro
      console.log('Tentando inserir novo registro');
      result = await supabase
        .from('questionario_multistep')
        .insert([cadastroData])
        .select();
      console.log('Resultado da inserção:', result);
    }

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
