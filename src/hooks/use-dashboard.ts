import { useState, useEffect } from 'react';
import { getDashboardMetrics, getRegistrations } from '@/services/dashboard';
import type { DashboardMetrics, RegistrationsResponse, DateRange } from '@/types/dashboard';
import { subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const useDashboard = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [registrations, setRegistrations] = useState<RegistrationsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const loadData = async (
    dateRangeKey: string, 
    page: number = 1, 
    limit: number = 10
  ) => {
    setLoading(true);
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
  };

  const refreshData = (dateRangeKey: string, page?: number, limit?: number) => {
    loadData(dateRangeKey, page, limit);
  };

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
