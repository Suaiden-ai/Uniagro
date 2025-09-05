export interface DashboardMetrics {
  totalRegistrations: number;
  todayRegistrations: number;
  registrationsGrowth: number;
  uniqueStates: number;
  conversionRate: number;
  genderDistribution: Array<{
    sexo: string;
    count: number;
  }>;
  maritalStatusDistribution: Array<{
    estado_civil: string;
    count: number;
  }>;
  stateDistribution: Array<{
    estado: string;
    count: number;
  }>;
  dailyRegistrations: Array<{
    date: string;
    count: number;
  }>;
  // FASE 1: Novas métricas
  hourlyDistribution: Array<{
    hour: number;
    count: number;
  }>;
  weeklyDistribution: Array<{
    day: string;
    count: number;
  }>;
  dataQualityMetrics: {
    totalRecords: number;
    complementoRate: number;
    telefoneRate: number;
    cepRate: number;
    averageCompleteness: number;
  };
  familyAnalysis: {
    averageChildren: number;
    familyProfiles: Array<{
      profile: string;
      count: number;
    }>;
    childrenByMaritalStatus: Array<{
      status: string;
      total: number;
      withChildren: number;
      percentageWithChildren: number;
    }>;
  };
}

export interface Registration {
  id: number | string;
  source: 'cadastro_inicial' | 'questionario_multistep';
  uuid_usuario?: string;
  timestamp_cadastro: string;
  nome_completo: string;
  cpf?: string;
  documentacao_cpf?: string;
  telefone?: string;
  cep?: string;
  logradouro?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  localidade?: string;
  estado?: string;
  estado_civil?: string;
  qtd_filhos?: number;
  sexo?: string;
  // Campos específicos do questionario_multistep
  status_completo?: boolean;
  etapas_completas?: number;
  total_etapas?: number;
  // Campos específicos do cadastro_inicial
  id_linha?: number;
}

export interface DateRange {
  start: Date;
  end: Date;
}

export interface RegistrationsResponse {
  data: Registration[];
  total: number;
  page: number;
  limit: number;
}
