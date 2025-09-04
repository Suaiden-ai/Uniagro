import { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Users, TrendingUp, MapPin, Phone, Mail, Download } from 'lucide-react';
import { getDashboardMetrics, getRegistrations, exportRegistrations } from '@/services/dashboard';
import type { DashboardMetrics, Registration } from '@/types/dashboard';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subDays, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
  Area,
  AreaChart
} from 'recharts';

const Dashboard = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('7days');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  // Cores para os gráficos
  const COLORS = useMemo(() => ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16'], []);

  // Função para formatar dados para gráficos
  const formatChartData = (data: any[]) => {
    return data?.map(item => ({
      ...item,
      name: item.name || item.day || item.sexo || item.estado_civil || item.estado || item.profile,
      value: item.count || item.value
    })) || [];
  };

  const getDateRangeFilter = useCallback((range: string) => {
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
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const dateFilter = getDateRangeFilter(dateRange);
      
      const [metricsData, registrationsData] = await Promise.all([
        getDashboardMetrics(dateFilter),
        getRegistrations({ 
          page: currentPage, 
          limit: itemsPerPage,
          dateRange: dateFilter 
        })
      ]);

      setMetrics(metricsData);
      setRegistrations(registrationsData.data);
      setTotalPages(Math.ceil(registrationsData.total / itemsPerPage));
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  }, [dateRange, currentPage, itemsPerPage, getDateRangeFilter]);

  const handleExport = useCallback(async () => {
    try {
      const dateFilter = getDateRangeFilter(dateRange);
      await exportRegistrations(dateFilter);
    } catch (error) {
      console.error('Erro ao exportar dados:', error);
    }
  }, [dateRange, getDateRangeFilter]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (loading && !metrics) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Administrativo</h1>
          <p className="text-gray-600 mt-1">Métricas e dados dos formulários Uniagro</p>
        </div>
        
        <div className="flex items-center gap-4">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Selecionar período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Últimos 7 dias</SelectItem>
              <SelectItem value="30days">Últimos 30 dias</SelectItem>
              <SelectItem value="thisWeek">Esta semana</SelectItem>
              <SelectItem value="thisMonth">Este mês</SelectItem>
              <SelectItem value="lastMonth">Mês passado</SelectItem>
            </SelectContent>
          </Select>
          
          <Button onClick={handleExport} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Cadastros</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.totalRegistrations || 0}</div>
            <p className="text-xs text-muted-foreground">
              {metrics?.registrationsGrowth && metrics.registrationsGrowth > 0 
                ? `+${metrics.registrationsGrowth}%` 
                : `${metrics?.registrationsGrowth || 0}%`} vs período anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cadastros Hoje</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.todayRegistrations || 0}</div>
            <p className="text-xs text-muted-foreground">
              Registros realizados hoje
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estados Ativos</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.uniqueStates || 0}</div>
            <p className="text-xs text-muted-foreground">
              Estados com cadastros
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.conversionRate || 0}%</div>
            <p className="text-xs text-muted-foreground">
              Formulários finalizados
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs para diferentes visualizações */}
      <Tabs defaultValue="registrations" className="space-y-4">
        <TabsList>
          <TabsTrigger value="registrations">Cadastros Recentes</TabsTrigger>
          <TabsTrigger value="analytics">Análises</TabsTrigger>
          <TabsTrigger value="temporal">Análise Temporal</TabsTrigger>
          <TabsTrigger value="quality">Qualidade dos Dados</TabsTrigger>
          <TabsTrigger value="family">Análise Familiar</TabsTrigger>
          <TabsTrigger value="locations">Por Localização</TabsTrigger>
        </TabsList>

        <TabsContent value="registrations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cadastros Recentes</CardTitle>
              <CardDescription>
                Lista dos últimos cadastros realizados no sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>CPF</TableHead>
                      <TableHead>Telefone</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Cidade</TableHead>
                      <TableHead>Data</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {registrations.map((registration) => (
                      <TableRow key={registration.id_linha}>
                        <TableCell className="font-medium">
                          {registration.nome_completo}
                        </TableCell>
                        <TableCell>
                          {registration.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.***.***-$4')}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Phone className="w-3 h-3" />
                            {registration.telefone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{registration.estado}</Badge>
                        </TableCell>
                        <TableCell>{registration.localidade}</TableCell>
                        <TableCell>
                          {format(new Date(registration.timestamp_cadastro), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Paginação */}
              <div className="flex items-center justify-between pt-4">
                <p className="text-sm text-muted-foreground">
                  Página {currentPage} de {totalPages}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    Anterior
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Próxima
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfico de Pizza para Gênero */}
            <Card>
              <CardHeader>
                <CardTitle>Distribuição por Gênero</CardTitle>
                <CardDescription>Proporção visual por gênero</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={metrics?.genderDistribution?.map(item => ({
                        name: item.sexo,
                        value: item.count
                      }))}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {metrics?.genderDistribution?.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Gráfico de Pizza para Estado Civil */}
            <Card>
              <CardHeader>
                <CardTitle>Distribuição por Estado Civil</CardTitle>
                <CardDescription>Proporção visual por estado civil</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={metrics?.maritalStatusDistribution?.map(item => ({
                        name: item.estado_civil,
                        value: item.count
                      }))}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {metrics?.maritalStatusDistribution?.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Tabelas detalhadas mantidas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Detalhes por Gênero</CardTitle>
                <CardDescription>Números e percentuais exatos</CardDescription>
              </CardHeader>
              <CardContent>
                {metrics?.genderDistribution?.map((item) => (
                  <div key={item.sexo} className="flex items-center justify-between py-2">
                    <span className="text-sm">{item.sexo}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 text-right">
                        <Badge variant="outline">{item.count}</Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {((item.count / (metrics?.totalRegistrations || 1)) * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Detalhes por Estado Civil</CardTitle>
                <CardDescription>Números e percentuais exatos</CardDescription>
              </CardHeader>
              <CardContent>
                {metrics?.maritalStatusDistribution?.map((item) => (
                  <div key={item.estado_civil} className="flex items-center justify-between py-2">
                    <span className="text-sm">{item.estado_civil}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 text-right">
                        <Badge variant="outline">{item.count}</Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {((item.count / (metrics?.totalRegistrations || 1)) * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="temporal" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfico de Horários de Pico */}
            <Card>
              <CardHeader>
                <CardTitle>Horários de Pico</CardTitle>
                <CardDescription>Cadastros por hora do dia</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={metrics?.hourlyDistribution?.map(item => ({
                    hora: `${String(item.hour).padStart(2, '0')}:00`,
                    cadastros: item.count
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hora" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="cadastros" fill="#22c55e" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Gráfico de Barras para Distribuição Semanal */}
            <Card>
              <CardHeader>
                <CardTitle>Distribuição Semanal</CardTitle>
                <CardDescription>Cadastros por dia da semana</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={metrics?.weeklyDistribution?.map(item => ({
                    dia: item.day.substring(0, 3),
                    cadastros: item.count
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="dia" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="cadastros" fill="#22c55e" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Gráfico de Tendências Diárias */}
          <Card>
            <CardHeader>
              <CardTitle>Tendência dos Últimos 7 Dias</CardTitle>
              <CardDescription>Evolução diária dos cadastros</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={metrics?.dailyRegistrations?.map(item => ({
                  data: format(new Date(item.date), 'dd/MM'),
                  cadastros: item.count
                }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="data" />
                  <YAxis />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="cadastros" 
                    stroke="#22c55e" 
                    fill="#22c55e" 
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Tabelas detalhadas mantidas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Detalhes por Horário</CardTitle>
                <CardDescription>Lista completa de horários</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {metrics?.hourlyDistribution?.map((item) => (
                    <div key={item.hour} className="flex items-center justify-between">
                      <span className="text-sm">{String(item.hour).padStart(2, '0')}:00</span>
                      <Badge variant="outline">{item.count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Detalhes por Dia</CardTitle>
                <CardDescription>Lista completa semanal</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {metrics?.weeklyDistribution?.map((item) => (
                    <div key={item.day} className="flex items-center justify-between">
                      <span className="text-sm w-20">{item.day}</span>
                      <Badge variant="outline">{item.count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="quality" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Score Geral</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics?.dataQualityMetrics?.averageCompleteness || 0}%</div>
                <p className="text-xs text-muted-foreground">Completude média dos perfis</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Telefone</CardTitle>
                <Phone className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics?.dataQualityMetrics?.telefoneRate || 0}%</div>
                <p className="text-xs text-muted-foreground">Campos preenchidos</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">CEP</CardTitle>
                <MapPin className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics?.dataQualityMetrics?.cepRate || 0}%</div>
                <p className="text-xs text-muted-foreground">Campos preenchidos</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Complemento</CardTitle>
                <Mail className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics?.dataQualityMetrics?.complementoRate || 0}%</div>
                <p className="text-xs text-muted-foreground">Campos preenchidos</p>
              </CardContent>
            </Card>
          </div>

          {/* Gráfico de Qualidade dos Dados */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Distribuição de Completude</CardTitle>
                <CardDescription>Proporção visual da qualidade por campo</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { 
                          name: 'Telefone', 
                          value: metrics?.dataQualityMetrics?.telefoneRate || 0
                        },
                        { 
                          name: 'CEP', 
                          value: metrics?.dataQualityMetrics?.cepRate || 0
                        },
                        { 
                          name: 'Complemento', 
                          value: metrics?.dataQualityMetrics?.complementoRate || 0
                        }
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value.toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      <Cell fill="#22c55e" />
                      <Cell fill="#3b82f6" />
                      <Cell fill="#f59e0b" />
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, 'Taxa de Preenchimento']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Score Geral de Qualidade</CardTitle>
                <CardDescription>Indicador circular de completude</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-[300px]">
                  <div className="relative w-48 h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Preenchido', value: metrics?.dataQualityMetrics?.averageCompleteness || 0 },
                            { name: 'Não preenchido', value: 100 - (metrics?.dataQualityMetrics?.averageCompleteness || 0) }
                          ]}
                          cx="50%"
                          cy="50%"
                          startAngle={90}
                          endAngle={450}
                          innerRadius={60}
                          outerRadius={80}
                          dataKey="value"
                        >
                          <Cell fill="#22c55e" />
                          <Cell fill="#e5e7eb" />
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {metrics?.dataQualityMetrics?.averageCompleteness || 0}%
                        </div>
                        <div className="text-sm text-muted-foreground">Score Geral</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabela detalhada mantida */}
          <Card>
            <CardHeader>
              <CardTitle>Análise Detalhada de Completude</CardTitle>
              <CardDescription>Detalhamento da qualidade dos dados por campo</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Telefone</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${metrics?.dataQualityMetrics?.telefoneRate || 0}%` }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground w-12 text-right">
                      {metrics?.dataQualityMetrics?.telefoneRate || 0}%
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">CEP</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${metrics?.dataQualityMetrics?.cepRate || 0}%` }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground w-12 text-right">
                      {metrics?.dataQualityMetrics?.cepRate || 0}%
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Complemento</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-yellow-600 h-2 rounded-full"
                        style={{ width: `${metrics?.dataQualityMetrics?.complementoRate || 0}%` }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground w-12 text-right">
                      {metrics?.dataQualityMetrics?.complementoRate || 0}%
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="family" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Análise Familiar Geral</CardTitle>
                <CardDescription>Estatísticas sobre composição familiar</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">
                      {metrics?.familyAnalysis?.averageChildren || 0}
                    </div>
                    <p className="text-sm text-muted-foreground">Média de filhos por cadastro</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Gráfico de Pizza para Perfis Familiares */}
            <Card>
              <CardHeader>
                <CardTitle>Perfis Familiares</CardTitle>
                <CardDescription>Distribuição dos principais perfis</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={metrics?.familyAnalysis?.familyProfiles?.slice(0, 5).map(item => ({
                        name: item.profile.split(' - ')[0],
                        value: item.count
                      }))}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={70}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {metrics?.familyAnalysis?.familyProfiles?.slice(0, 5).map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Filhos por Estado Civil</CardTitle>
                <CardDescription>Percentual com filhos por categoria</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={metrics?.familyAnalysis?.childrenByMaritalStatus?.map(item => ({
                    status: item.status,
                    comFilhos: item.withChildren,
                    semFilhos: item.total - item.withChildren,
                    percentual: item.percentageWithChildren
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="status" angle={-45} textAnchor="end" height={60} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="comFilhos" stackId="a" fill="#22c55e" name="Com filhos" />
                    <Bar dataKey="semFilhos" stackId="a" fill="#e5e7eb" name="Sem filhos" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Perfis Familiares Detalhados</CardTitle>
              <CardDescription>Combinações completas de estado civil e número de filhos</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={metrics?.familyAnalysis?.familyProfiles?.slice(0, 8).map(item => ({
                  perfil: item.profile.length > 20 ? item.profile.substring(0, 20) + '...' : item.profile,
                  quantidade: item.count
                }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="perfil" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="quantidade" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="locations" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfico de Pizza para Estados */}
            <Card>
              <CardHeader>
                <CardTitle>Distribuição por Estado</CardTitle>
                <CardDescription>Proporção visual dos 8 principais estados</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <PieChart>
                    <Pie
                      data={metrics?.stateDistribution?.slice(0, 8).map(item => ({
                        name: item.estado,
                        value: item.count
                      }))}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {metrics?.stateDistribution?.slice(0, 8).map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Gráfico de Barras para Ranking */}
            <Card>
              <CardHeader>
                <CardTitle>Ranking dos Estados</CardTitle>
                <CardDescription>Top 10 estados com mais cadastros</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={metrics?.stateDistribution?.slice(0, 10).map(item => ({
                    estado: item.estado,
                    cadastros: item.count
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="estado" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="cadastros" fill="#06b6d4" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Cards detalhados mantidos */}
          <Card>
            <CardHeader>
              <CardTitle>Detalhes por Estado</CardTitle>
              <CardDescription>
                Lista completa da distribuição geográfica
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {metrics?.stateDistribution?.map((item) => (
                  <Card key={item.estado}>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-green-600" />
                          <span className="font-medium">{item.estado}</span>
                        </div>
                        <Badge>{item.count}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;