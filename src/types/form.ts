export interface FormData {
  nomeCompleto: string;
  cpf: string;
  telefone: string;
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  localidade: string;
  estado: string;
  estadoCivil: 'SOLTEIRO' | 'CASADO' | 'DIVORCIADO' | 'VIUVO' | 'UNIAO_ESTAVEL' | '';
  possuiFilhos: 'sim' | 'nao' | '';
  quantidadeFilhos?: number;
  sexo: 'MASCULINO' | 'FEMININO' | 'PREFIRO_NAO_DECLARAR' | '';
}

// Novo formulário multi-step
export interface MultiStepFormData {
  // Dados da Entidade
  entidade: {
    nome: string;
    municipio: string;
    estado: string;
    numeroSociosInformados: number;
    numeroSociosPlataforma: number;
    cnpj: string;
    endereco: string;
    telefone: string;
    email: string;
    linkSite: string;
    linkRedesSociais: string;
    contaBancaria: string;
    banco: string;
  };
  
  // Dados do Dirigente
  dirigente: {
    nome: string;
    apelido: string;
    rg: string;
    cpf: string;
    endereco: string;
    telefone: string;
  };
  
  // Dados Pessoais do Proprietário
  proprietario: {
    nome: string;
    sexo: string;
    corPele: string;
    religiao: string;
    time: string;
    esportePreferido: string;
    musica: string;
    artista: string;
    estadoCivil: string;
    telefone: string;
  };
  
  // Documentação Pessoal
  documentacao: {
    rg: string;
    cpf: string;
    dataNascimento: string;
    idade: number;
    nis: string;
    pis: string;
    caf: boolean;
    cartaoProdutor: string;
    // Anexos de documentos
    anexos: {
      rgFile?: File | null;
      cpfFile?: File | null;
    };
  };
  
  // Renda & Finanças
  renda: {
    profissao1: string;
    rendaProfissao1: number;
    profissao2: string;
    rendaProfissao2: number;
    profissao3: string;
    rendaProfissao3: number;
    rendaTotal: number;
    possuiFinanciamentoAtivo: boolean;
    bancoFinanciamento: string;
    temVeiculo: boolean;
    qualVeiculo: string;
    casaPropria: boolean;
    ondeCasaPropria: string;
  };
  
  // Saúde
  saude: {
    temDeficiencia: boolean;
    qualDeficiencia: string;
    temCromoidade: boolean;
    qualCromoidade: string;
    fazTratamento: boolean;
    qualTratamento: string;
    tomaMedicacaoControlada: boolean;
    qualMedicacao: string;
  };
  
  // Propriedade Rural
  propriedade: {
    nome: string;
    endereco: string;
    localizacao: string;
  };
  
  // Infraestrutura
  infraestrutura: {
    temReserva: boolean;
    areaReserva: number;
    areaProdutiva: number;
    temEstrada: boolean;
    qualidadeEstrada: 'OTIMA' | 'BOA' | 'REGULAR' | 'RUIM' | 'PESSIMA';
    temEnergia: boolean;
    tipoEnergia: 'MONOFASICO' | 'BIFASICO' | 'TRIFASICO';
    tipoAlternativoEnergia: 'OFFGRID' | 'GERADOR' | 'OUTRO';
    temAgua: boolean;
    tipoAgua: 'POCO' | 'RIO' | 'CORREGO' | 'REPRESA' | 'CACIMBA' | 'PIPA';
    aguaEncanada: boolean;
    tipoSolo: string;
    vegetacao: string;
    possuiGalpao: boolean;
    possuiSilo: boolean;
    reservatorioAgua: boolean;
    energiaFotovoltaica: boolean;
    geracaoFotovoltaica: string;
    sistemaIrrigacao: boolean;
    tipoIrrigacao: 'GOTEJO' | 'PIVO' | 'ASPERSOR';
    areaIrrigada: number;
  };
  
  // Produção Agrícola
  producao: {
    temPasto: boolean;
    areaPasto: number;
    temManga: boolean;
    areaManga: number;
    temProducaoAgricola: boolean;
    quaisProducoes: string;
    feijaoArea: number;
    feijaoInicioSafra: string;
    feijaoPrevisaoColheita: string;
    feijaoPrevisaoQuantidade: number;
    areaPermitidaSemUso: number;
    temCriacoes: boolean;
    frangosGranja: number;
    idadeFrangos: number;
    inicioFrangos: string;
    finalAbate: string;
    pesoFrangos: number;
    producaoArtesanalIndustrial: 'ARTESANAL' | 'INDUSTRIAL';
    tipoQueijo: string;
    pesoQueijo: number;
    quantidadeQueijo: number;
    producaoLeiteira: number;
    mediaLitroDia: number;
    totalProducaoLeite: number;
    temPescado: boolean;
    reservatorioPescado: string;
    especiePescado: string;
    inicioProducaoPescado: string;
    finalProducaoPescado: string;
    kgPescado: number;
    potencialExpansao: string;
    setorExpansao: 'AGRICULTURA' | 'PISCICULTURA' | 'APICULTURA' | 'AGROINDUSTRIA' | 'AGROEXTRATIVISMO';
    necessidadesExpansao: string;
    quantidadeNecessidades: string;
  };
  
  // Comunicação
  comunicacao: {
    temSinalCelular: boolean;
    operadoraCelular: string;
    temSinalInternet: boolean;
    operadoraInternet: string;
    temSinalRadio: boolean;
    qualRadio: string;
    programaRadioPreferido: string;
    temSinalTV: boolean;
    qualTV: string;
    programaTVPreferido: string;
  };
  
  // Habitação
  habitacao: {
    temCasaPropriedade: boolean;
    temBanheiro: boolean;
    cisternaNegra: boolean;
    saneamento: boolean;
  };
  
  // Dados da Família
  familia: {
    conjuge: {
      nome: string;
      idade: number;
      profissao: string;
    };
    filhos: Array<{
      nome: string;
      idade: number;
      escolaridade: string;
    }>;
    pai: {
      nome: string;
      idade: number;
      profissao: string;
    };
    mae: {
      nome: string;
      idade: number;
      profissao: string;
    };
  };
}

export const ESTADO_CIVIL_OPTIONS = [
  { value: 'SOLTEIRO', label: 'Solteiro(a)' },
  { value: 'CASADO', label: 'Casado(a)' },
  { value: 'DIVORCIADO', label: 'Divorciado(a)' },
  { value: 'VIUVO', label: 'Viúvo(a)' },
  { value: 'UNIAO_ESTAVEL', label: 'União Estável' },
] as const;

export const SEXO_OPTIONS = [
  { value: 'MASCULINO', label: 'Masculino' },
  { value: 'FEMININO', label: 'Feminino' },
  { value: 'PREFIRO_NAO_DECLARAR', label: 'Prefiro não declarar' },
] as const;