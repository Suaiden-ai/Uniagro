import { supabase } from '@/lib/supabase';
import type { DashboardMetrics, Registration, DateRange, RegistrationsResponse } from '@/types/dashboard';
import { format, startOfDay, endOfDay, subDays } from 'date-fns';

// Cache simples para evitar consultas excessivas
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

// Função para gerar chave de cache
const getCacheKey = (dateRange: DateRange, type: string) => {
  const start = format(dateRange.start, 'yyyy-MM-dd');
  const end = format(dateRange.end, 'yyyy-MM-dd');
  return `${type}_${start}_${end}`;
};

// Função para verificar se o cache é válido
const isCacheValid = (timestamp: number) => {
  return Date.now() - timestamp < CACHE_DURATION;
};

// Função para limpar cache expirado
const cleanExpiredCache = () => {
  for (const [key, value] of cache.entries()) {
    if (!isCacheValid(value.timestamp)) {
      cache.delete(key);
    }
  }
};

export const getDashboardMetrics = async (dateRange: DateRange): Promise<DashboardMetrics> => {
  try {
    // Limpar cache expirado
    cleanExpiredCache();
    
    // Verificar cache
    const cacheKey = getCacheKey(dateRange, 'metrics');
    const cached = cache.get(cacheKey);
    if (cached && isCacheValid(cached.timestamp)) {
      console.log('Retornando dados do cache para métricas');
      return cached.data;
    }

    const startDate = format(startOfDay(dateRange.start), 'yyyy-MM-dd HH:mm:ss');
    const endDate = format(endOfDay(dateRange.end), 'yyyy-MM-dd HH:mm:ss');

    // CONSULTA ÚNICA OTIMIZADA - Buscar todos os dados necessários em uma única consulta
    const { data: allData, error: allDataError } = await supabase
      .from('cadastro_inicial')
      .select('id_linha, timestamp_cadastro, estado, sexo, estado_civil, qtd_filhos, complemento, telefone, cep')
      .gte('timestamp_cadastro', startDate)
      .lte('timestamp_cadastro', endDate);

    if (allDataError) throw allDataError;

    const totalRegistrations = allData?.length || 0;

    // Registros de hoje (consulta separada apenas se necessário)
    const todayStart = format(startOfDay(new Date()), 'yyyy-MM-dd HH:mm:ss');
    const todayEnd = format(endOfDay(new Date()), 'yyyy-MM-dd HH:mm:ss');
    
    let todayRegistrations = 0;
    if (startDate <= todayStart && endDate >= todayEnd) {
      // Se o período inclui hoje, calcular dos dados já carregados
      todayRegistrations = allData?.filter(item => {
        const itemDate = new Date(item.timestamp_cadastro);
        return itemDate >= new Date(todayStart) && itemDate <= new Date(todayEnd);
      }).length || 0;
    } else {
      // Se não inclui, fazer consulta específica
      const { data: todayData, error: todayError } = await supabase
        .from('cadastro_inicial')
        .select('id_linha', { count: 'exact' })
        .gte('timestamp_cadastro', todayStart)
        .lte('timestamp_cadastro', todayEnd);
      
      if (!todayError) {
        todayRegistrations = todayData?.length || 0;
      }
    }

    // Crescimento comparado ao período anterior (consulta separada)
    const previousRangeStart = new Date(dateRange.start);
    previousRangeStart.setDate(previousRangeStart.getDate() - (dateRange.end.getTime() - dateRange.start.getTime()) / (1000 * 60 * 60 * 24));
    const previousRangeEnd = new Date(dateRange.start);

    const { data: previousData, error: previousError } = await supabase
      .from('cadastro_inicial')
      .select('id_linha', { count: 'exact' })
      .gte('timestamp_cadastro', format(startOfDay(previousRangeStart), 'yyyy-MM-dd HH:mm:ss'))
      .lte('timestamp_cadastro', format(endOfDay(previousRangeEnd), 'yyyy-MM-dd HH:mm:ss'));

    const previousRegistrations = previousData?.length || 0;
    const registrationsGrowth = previousRegistrations > 0 
      ? Math.round(((totalRegistrations - previousRegistrations) / previousRegistrations) * 100)
      : 0;

    // Processar dados da consulta única
    const uniqueStates = new Set(allData?.map(item => item.estado) || []).size;

    // Distribuição por gênero
    const genderCount = allData?.reduce((acc, item) => {
      acc[item.sexo] = (acc[item.sexo] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {};

    const genderDistribution = Object.entries(genderCount).map(([sexo, count]) => ({
      sexo,
      count
    }));

    // Distribuição por estado civil
    const maritalCount = allData?.reduce((acc, item) => {
      acc[item.estado_civil] = (acc[item.estado_civil] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {};

    const maritalStatusDistribution = Object.entries(maritalCount).map(([estado_civil, count]) => ({
      estado_civil,
      count
    }));

    // Distribuição por estado
    const stateCount = allData?.reduce((acc, item) => {
      acc[item.estado] = (acc[item.estado] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {};

    const stateDistribution = Object.entries(stateCount)
      .map(([estado, count]) => ({ estado, count }))
      .sort((a, b) => b.count - a.count);

    // Registros diários (últimos 7 dias) - calcular dos dados existentes se possível
    const dailyRegistrations = [];
    for (let i = 6; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const dayStart = format(startOfDay(date), 'yyyy-MM-dd HH:mm:ss');
      const dayEnd = format(endOfDay(date), 'yyyy-MM-dd HH:mm:ss');
      
      let dayCount = 0;
      if (startDate <= dayStart && endDate >= dayEnd) {
        // Se o período inclui este dia, calcular dos dados já carregados
        dayCount = allData?.filter(item => {
          const itemDate = new Date(item.timestamp_cadastro);
          return itemDate >= new Date(dayStart) && itemDate <= new Date(dayEnd);
        }).length || 0;
      } else {
        // Se não inclui, fazer consulta específica
        const { data: dayData, error: dayError } = await supabase
          .from('cadastro_inicial')
          .select('id_linha', { count: 'exact' })
          .gte('timestamp_cadastro', dayStart)
          .lte('timestamp_cadastro', dayEnd);
        
        if (!dayError) {
          dayCount = dayData?.length || 0;
        }
      }
      
      dailyRegistrations.push({
        date: format(date, 'yyyy-MM-dd'),
        count: dayCount
      });
    }

    // Métricas temporais - processar dos dados existentes
    let hourlyDistribution = [];
    if (allData) {
      const hourlyCount = Array.from({ length: 24 }, (_, i) => ({ hour: i, count: 0 }));
      allData.forEach(item => {
        const hour = new Date(item.timestamp_cadastro).getHours();
        hourlyCount[hour].count++;
      });
      hourlyDistribution = hourlyCount;
    }

    let weeklyDistribution = [];
    if (allData) {
      const weekDays = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
      const weeklyCount = Array.from({ length: 7 }, (_, i) => ({ day: weekDays[i], count: 0 }));
      allData.forEach(item => {
        const dayOfWeek = new Date(item.timestamp_cadastro).getDay();
        weeklyCount[dayOfWeek].count++;
      });
      weeklyDistribution = weeklyCount;
    }

    // Score de qualidade dos dados - processar dos dados existentes
    let dataQualityMetrics = {
      totalRecords: 0,
      complementoRate: 0,
      telefoneRate: 0,
      cepRate: 0,
      averageCompleteness: 0
    };

    if (allData) {
      const total = allData.length;
      const complementoFilled = allData.filter(item => item.complemento).length;
      const telefoneFilled = allData.filter(item => item.telefone).length;
      const cepFilled = allData.filter(item => item.cep).length;

      dataQualityMetrics = {
        totalRecords: total,
        complementoRate: total > 0 ? Math.round((complementoFilled / total) * 100) : 0,
        telefoneRate: total > 0 ? Math.round((telefoneFilled / total) * 100) : 0,
        cepRate: total > 0 ? Math.round((cepFilled / total) * 100) : 0,
        averageCompleteness: total > 0 ? Math.round(((complementoFilled + telefoneFilled + cepFilled) / (total * 3)) * 100) : 0
      };
    }

    // Análise familiar - processar dos dados existentes
    let familyAnalysis = {
      averageChildren: 0,
      familyProfiles: [],
      childrenByMaritalStatus: []
    };

    if (allData) {
      const totalChildren = allData.reduce((sum, item) => sum + (item.qtd_filhos || 0), 0);
      familyAnalysis.averageChildren = allData.length > 0 ? Math.round((totalChildren / allData.length) * 100) / 100 : 0;

      // Perfis familiares
      const profiles = allData.reduce((acc, item) => {
        const profile = `${item.estado_civil || 'N/A'} - ${item.qtd_filhos} ${item.qtd_filhos === 1 ? 'filho' : 'filhos'}`;
        acc[profile] = (acc[profile] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      familyAnalysis.familyProfiles = Object.entries(profiles).map(([profile, count]) => ({
        profile,
        count
      })).sort((a, b) => b.count - a.count);

      // Filhos por estado civil
      const childrenByStatus = allData.reduce((acc, item) => {
        const status = item.estado_civil || 'N/A';
        if (!acc[status]) {
          acc[status] = { total: 0, withChildren: 0, averageChildren: 0 };
        }
        acc[status].total++;
        if ((item.qtd_filhos || 0) > 0) {
          acc[status].withChildren++;
        }
        return acc;
      }, {} as Record<string, { total: number; withChildren: number; averageChildren: number }>);

      familyAnalysis.childrenByMaritalStatus = Object.entries(childrenByStatus).map(([status, data]) => ({
        status,
        total: data.total,
        withChildren: data.withChildren,
        percentageWithChildren: Math.round((data.withChildren / data.total) * 100)
      }));
    }

    const result = {
      totalRegistrations,
      todayRegistrations,
      registrationsGrowth,
      uniqueStates,
      conversionRate: 85, // Placeholder - você pode calcular baseado em métricas específicas
      genderDistribution,
      maritalStatusDistribution,
      stateDistribution,
      dailyRegistrations,
      // FASE 1: Novas métricas
      hourlyDistribution,
      weeklyDistribution,
      dataQualityMetrics,
      familyAnalysis
    };

    // Salvar no cache
    cache.set(cacheKey, { data: result, timestamp: Date.now() });
    console.log('Dados salvos no cache para métricas');

    return result;

  } catch (error) {
    console.error('Erro ao buscar métricas:', error);
    throw error;
  }
};

export const getRegistrations = async ({
  page = 1,
  limit = 10,
  dateRange
}: {
  page?: number;
  limit?: number;
  dateRange?: DateRange;
}): Promise<RegistrationsResponse> => {
  try {
    // Verificar cache para registros
    if (dateRange) {
      const cacheKey = getCacheKey(dateRange, `registrations_${page}_${limit}`);
      const cached = cache.get(cacheKey);
      if (cached && isCacheValid(cached.timestamp)) {
        console.log('Retornando registros do cache');
        return cached.data;
      }
    }

    let query = supabase
      .from('cadastro_inicial')
      .select('*', { count: 'exact' })
      .order('timestamp_cadastro', { ascending: false });

    if (dateRange) {
      const startDate = format(startOfDay(dateRange.start), 'yyyy-MM-dd HH:mm:ss');
      const endDate = format(endOfDay(dateRange.end), 'yyyy-MM-dd HH:mm:ss');
      query = query.gte('timestamp_cadastro', startDate).lte('timestamp_cadastro', endDate);
    }

    const { data, error, count } = await query
      .range((page - 1) * limit, page * limit - 1);

    if (error) throw error;

    const result = {
      data: data || [],
      total: count || 0,
      page,
      limit
    };

    // Salvar no cache se tiver dateRange
    if (dateRange) {
      const cacheKey = getCacheKey(dateRange, `registrations_${page}_${limit}`);
      cache.set(cacheKey, { data: result, timestamp: Date.now() });
      console.log('Registros salvos no cache');
    }

    return result;

  } catch (error) {
    console.error('Erro ao buscar registros:', error);
    throw error;
  }
};

export const exportRegistrations = async (dateRange: DateRange): Promise<void> => {
  try {
    const startDate = format(startOfDay(dateRange.start), 'yyyy-MM-dd HH:mm:ss');
    const endDate = format(endOfDay(dateRange.end), 'yyyy-MM-dd HH:mm:ss');

    const { data, error } = await supabase
      .from('cadastro_inicial')
      .select('*')
      .gte('timestamp_cadastro', startDate)
      .lte('timestamp_cadastro', endDate)
      .order('timestamp_cadastro', { ascending: false });

    if (error) throw error;

    if (!data || data.length === 0) {
      alert('Nenhum registro encontrado para o período selecionado');
      return;
    }

    // Converter para CSV
    const headers = [
      'Data/Hora',
      'Nome Completo',
      'CPF',
      'Telefone',
      'CEP',
      'Logradouro',
      'Número',
      'Complemento',
      'Bairro',
      'Cidade',
      'Estado',
      'Estado Civil',
      'Quantidade de Filhos',
      'Sexo'
    ];

    const csvContent = [
      headers.join(','),
      ...data.map(row => [
        new Date(row.timestamp_cadastro).toLocaleString('pt-BR'),
        `"${row.nome_completo}"`,
        row.cpf,
        row.telefone,
        row.cep,
        `"${row.logradouro}"`,
        row.numero,
        `"${row.complemento || ''}"`,
        `"${row.bairro}"`,
        `"${row.localidade}"`,
        row.estado,
        `"${row.estado_civil}"`,
        row.qtd_filhos,
        `"${row.sexo}"`
      ].join(','))
    ].join('\n');

    // Criar e fazer download do arquivo
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `cadastros_uniagro_${format(new Date(), 'yyyy-MM-dd_HH-mm')}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

  } catch (error) {
    console.error('Erro ao exportar registros:', error);
    alert('Erro ao exportar registros. Tente novamente.');
  }
};
