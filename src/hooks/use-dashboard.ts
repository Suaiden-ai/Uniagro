import { useState, useEffect, useCallback, useRef } from 'react';
import { getDashboardMetrics, getRegistrations } from '@/services/dashboard';
import type { DashboardMetrics, RegistrationsResponse, DateRange } from '@/types/dashboard';
import { subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const useDashboard = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [registrations, setRegistrations] = useState<RegistrationsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Refs para controlar debounce
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastLoadRef = useRef<string>('');

  const getDateRangeFilter = (range: string): DateRange => {
    const now = new Date();
    switch (range) {
      case '7days':
        return { start: subDays(now, 7), end: now };
      case '30days':
        return { start: subDays(now, 30), end: now };
      case 'thisWeek':
        return { start: startOfWeek(now, { locale: ptBR }), end: endOfWeek(now, { locale: ptBR }) };
      case 'thisMonth':
        return { start: startOfMonth(now), end: endOfMonth(now) };
      case 'lastMonth':
        return { 
          start: startOfMonth(subMonths(now, 1)), 
          end: endOfMonth(subMonths(now, 1)) 
        };
      default:
        return { start: subDays(now, 7), end: now };
    }
  };

  const loadMetrics = async (dateRange: DateRange) => {
    try {
      setError(null);
      const metricsData = await getDashboardMetrics(dateRange);
      setMetrics(metricsData);
    } catch (err) {
      console.error('Erro ao carregar métricas:', err);
      setError('Erro ao carregar métricas do dashboard');
    }
  };

  const loadRegistrations = async (
    page: number = 1, 
    limit: number = 10, 
    dateRange?: DateRange
  ) => {
    try {
      setError(null);
      const registrationsData = await getRegistrations({ page, limit, dateRange });
      setRegistrations(registrationsData);
    } catch (err) {
      console.error('Erro ao carregar registros:', err);
      setError('Erro ao carregar registros');
    }
  };

  const loadData = useCallback(async (
    dateRangeKey: string, 
    page: number = 1, 
    limit: number = 10
  ) => {
    // Gerar chave única para esta requisição
    const requestKey = `${dateRangeKey}_${page}_${limit}`;
    
    // Se já estamos carregando os mesmos dados, não fazer nova requisição
    if (lastLoadRef.current === requestKey && loading) {
      console.log('Já carregando os mesmos dados, ignorando requisição duplicada');
      return;
    }
    
    // Limpar timeout anterior
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    
    // Debounce de 300ms para evitar consultas excessivas
    debounceTimeoutRef.current = setTimeout(async () => {
      setLoading(true);
      lastLoadRef.current = requestKey;
      
      try {
        const dateRange = getDateRangeFilter(dateRangeKey);
        await Promise.all([
          loadMetrics(dateRange),
          loadRegistrations(page, limit, dateRange)
        ]);
      } catch (err) {
        console.error('Erro ao carregar dados:', err);
        setError('Erro ao carregar dados do dashboard');
      } finally {
        setLoading(false);
      }
    }, 300);
  }, [loading]);

  const refreshData = (dateRangeKey: string, page?: number, limit?: number) => {
    loadData(dateRangeKey, page, limit);
  };

  // Cleanup no unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  return {
    metrics,
    registrations,
    loading,
    error,
    loadData,
    refreshData,
    getDateRangeFilter
  };
};

export default useDashboard;
