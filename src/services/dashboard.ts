import { supabase } from '@/lib/supabase';
import type { DashboardMetrics, Registration, DateRange, RegistrationsResponse } from '@/types/dashboard';
import { format, startOfDay, endOfDay, subDays } from 'date-fns';

export const getDashboardMetrics = async (dateRange: DateRange): Promise<DashboardMetrics> => {
  try {
    const startDate = format(startOfDay(dateRange.start), 'yyyy-MM-dd HH:mm:ss');
    const endDate = format(endOfDay(dateRange.end), 'yyyy-MM-dd HH:mm:ss');

    // Total de registros no período
    const { data: totalData, error: totalError } = await supabase
      .from('cadastro_inicial')
      .select('id_linha', { count: 'exact' })
      .gte('timestamp_cadastro', startDate)
      .lte('timestamp_cadastro', endDate);

    if (totalError) throw totalError;

    const totalRegistrations = totalData?.length || 0;

    // Registros de hoje
    const todayStart = format(startOfDay(new Date()), 'yyyy-MM-dd HH:mm:ss');
    const todayEnd = format(endOfDay(new Date()), 'yyyy-MM-dd HH:mm:ss');

    const { data: todayData, error: todayError } = await supabase
      .from('cadastro_inicial')
      .select('id_linha', { count: 'exact' })
      .gte('timestamp_cadastro', todayStart)
      .lte('timestamp_cadastro', todayEnd);

    if (todayError) throw todayError;

    const todayRegistrations = todayData?.length || 0;

    // Crescimento comparado ao período anterior
    const previousRangeStart = new Date(dateRange.start);
    previousRangeStart.setDate(previousRangeStart.getDate() - (dateRange.end.getTime() - dateRange.start.getTime()) / (1000 * 60 * 60 * 24));
    const previousRangeEnd = new Date(dateRange.start);

    const { data: previousData, error: previousError } = await supabase
      .from('cadastro_inicial')
      .select('id_linha', { count: 'exact' })
      .gte('timestamp_cadastro', format(startOfDay(previousRangeStart), 'yyyy-MM-dd HH:mm:ss'))
      .lte('timestamp_cadastro', format(endOfDay(previousRangeEnd), 'yyyy-MM-dd HH:mm:ss'));

    if (previousError) throw previousError;

    const previousRegistrations = previousData?.length || 0;
    const registrationsGrowth = previousRegistrations > 0 
      ? Math.round(((totalRegistrations - previousRegistrations) / previousRegistrations) * 100)
      : 0;

    // Estados únicos
    const { data: statesData, error: statesError } = await supabase
      .from('cadastro_inicial')
      .select('estado')
      .gte('timestamp_cadastro', startDate)
      .lte('timestamp_cadastro', endDate);

    if (statesError) throw statesError;

    const uniqueStates = new Set(statesData?.map(item => item.estado) || []).size;

    // Distribuição por gênero
    const { data: genderData, error: genderError } = await supabase
      .from('cadastro_inicial')
      .select('sexo')
      .gte('timestamp_cadastro', startDate)
      .lte('timestamp_cadastro', endDate);

    if (genderError) throw genderError;

    const genderCount = genderData?.reduce((acc, item) => {
      acc[item.sexo] = (acc[item.sexo] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {};

    const genderDistribution = Object.entries(genderCount).map(([sexo, count]) => ({
      sexo,
      count
    }));

    // Distribuição por estado civil
    const { data: maritalData, error: maritalError } = await supabase
      .from('cadastro_inicial')
      .select('estado_civil')
      .gte('timestamp_cadastro', startDate)
      .lte('timestamp_cadastro', endDate);

    if (maritalError) throw maritalError;

    const maritalCount = maritalData?.reduce((acc, item) => {
      acc[item.estado_civil] = (acc[item.estado_civil] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {};

    const maritalStatusDistribution = Object.entries(maritalCount).map(([estado_civil, count]) => ({
      estado_civil,
      count
    }));

    // Distribuição por estado
    const stateCount = statesData?.reduce((acc, item) => {
      acc[item.estado] = (acc[item.estado] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {};

    const stateDistribution = Object.entries(stateCount)
      .map(([estado, count]) => ({ estado, count }))
      .sort((a, b) => b.count - a.count);

    // Registros diários (últimos 7 dias)
    const dailyRegistrations = [];
    for (let i = 6; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const dayStart = format(startOfDay(date), 'yyyy-MM-dd HH:mm:ss');
      const dayEnd = format(endOfDay(date), 'yyyy-MM-dd HH:mm:ss');

      const { data: dayData, error: dayError } = await supabase
        .from('cadastro_inicial')
        .select('id_linha', { count: 'exact' })
        .gte('timestamp_cadastro', dayStart)
        .lte('timestamp_cadastro', dayEnd);

      if (!dayError) {
        dailyRegistrations.push({
          date: format(date, 'yyyy-MM-dd'),
          count: dayData?.length || 0
        });
      }
    }

    // FASE 1: Métricas temporais avançadas
    // Cadastros por hora do dia
    const { data: hourlyData, error: hourlyError } = await supabase
      .from('cadastro_inicial')
      .select('timestamp_cadastro')
      .gte('timestamp_cadastro', startDate)
      .lte('timestamp_cadastro', endDate);

    let hourlyDistribution = [];
    if (!hourlyError && hourlyData) {
      const hourlyCount = Array.from({ length: 24 }, (_, i) => ({ hour: i, count: 0 }));
      hourlyData.forEach(item => {
        const hour = new Date(item.timestamp_cadastro).getHours();
        hourlyCount[hour].count++;
      });
      hourlyDistribution = hourlyCount;
    }

    // Cadastros por dia da semana (consulta independente)
    const { data: weeklyData, error: weeklyError } = await supabase
      .from('cadastro_inicial')
      .select('timestamp_cadastro')
      .gte('timestamp_cadastro', startDate)
      .lte('timestamp_cadastro', endDate);

    let weeklyDistribution = [];
    if (!weeklyError && weeklyData) {
      const weekDays = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
      const weeklyCount = Array.from({ length: 7 }, (_, i) => ({ day: weekDays[i], count: 0 }));
      weeklyData.forEach(item => {
        const dayOfWeek = new Date(item.timestamp_cadastro).getDay();
        weeklyCount[dayOfWeek].count++;
      });
      weeklyDistribution = weeklyCount;
    }

    // FASE 1: Score de qualidade dos dados
    const { data: qualityData, error: qualityError } = await supabase
      .from('cadastro_inicial')
      .select('complemento, telefone, cep')
      .gte('timestamp_cadastro', startDate)
      .lte('timestamp_cadastro', endDate);

    let dataQualityMetrics = {
      totalRecords: 0,
      complementoRate: 0,
      telefoneRate: 0,
      cepRate: 0,
      averageCompleteness: 0
    };

    if (!qualityError && qualityData) {
      const total = qualityData.length;
      const complementoFilled = qualityData.filter(item => item.complemento).length;
      const telefoneFilled = qualityData.filter(item => item.telefone).length;
      const cepFilled = qualityData.filter(item => item.cep).length;

      dataQualityMetrics = {
        totalRecords: total,
        complementoRate: total > 0 ? Math.round((complementoFilled / total) * 100) : 0,
        telefoneRate: total > 0 ? Math.round((telefoneFilled / total) * 100) : 0,
        cepRate: total > 0 ? Math.round((cepFilled / total) * 100) : 0,
        averageCompleteness: total > 0 ? Math.round(((complementoFilled + telefoneFilled + cepFilled) / (total * 3)) * 100) : 0
      };
    }

    // FASE 1: Análise familiar detalhada
    const { data: familyData, error: familyError } = await supabase
      .from('cadastro_inicial')
      .select('estado_civil, qtd_filhos, sexo')
      .gte('timestamp_cadastro', startDate)
      .lte('timestamp_cadastro', endDate);

    let familyAnalysis = {
      averageChildren: 0,
      familyProfiles: [],
      childrenByMaritalStatus: []
    };

    if (!familyError && familyData) {
      const totalChildren = familyData.reduce((sum, item) => sum + (item.qtd_filhos || 0), 0);
      familyAnalysis.averageChildren = familyData.length > 0 ? Math.round((totalChildren / familyData.length) * 100) / 100 : 0;

      // Perfis familiares
      const profiles = familyData.reduce((acc, item) => {
        const profile = `${item.estado_civil || 'N/A'} - ${item.qtd_filhos} ${item.qtd_filhos === 1 ? 'filho' : 'filhos'}`;
        acc[profile] = (acc[profile] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      familyAnalysis.familyProfiles = Object.entries(profiles).map(([profile, count]) => ({
        profile,
        count
      })).sort((a, b) => b.count - a.count);

      // Filhos por estado civil
      const childrenByStatus = familyData.reduce((acc, item) => {
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

    return {
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

    return {
      data: data || [],
      total: count || 0,
      page,
      limit
    };

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
