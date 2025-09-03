import { useState, useEffect } from 'react';
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

const Dashboard = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('7days');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  const getDateRangeFilter = (range: string) => {
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

  const loadData = async () => {
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
  };

  const handleExport = async () => {
    try {
      const dateFilter = getDateRangeFilter(dateRange);
      await exportRegistrations(dateFilter);
    } catch (error) {
      console.error('Erro ao exportar dados:', error);
    }
  };

  useEffect(() => {
    loadData();
  }, [dateRange, currentPage]);

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
            <CardTitle className="text-sm font-medium">Score de Qualidade</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.dataQualityMetrics?.averageCompleteness || 0}%</div>
            <p className="text-xs text-muted-foreground">
              Completude dos dados
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs para diferentes visualizações */}
      <Tabs defaultValue="registrations" className="space-y-4">
        <TabsList>
          <TabsTrigger value="registrations">Cadastros Recentes</TabsTrigger>
          <TabsTrigger value="temporal">Análise Temporal</TabsTrigger>
          <TabsTrigger value="quality">Qualidade dos Dados</TabsTrigger>
          <TabsTrigger value="family">Análise Familiar</TabsTrigger>
          <TabsTrigger value="analytics">Distribuições</TabsTrigger>
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
                            {registration.telefone?.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')}
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

        <TabsContent value="temporal" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Cadastros por Hora do Dia */}
            <Card>
              <CardHeader>
                <CardTitle>Horários de Pico</CardTitle>
                <CardDescription>Cadastros por hora do dia</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {metrics?.hourlyDistribution?.map((item) => (
                    <div key={item.hour} className="flex items-center justify-between">
                      <span className="text-sm">{String(item.hour).padStart(2, '0')}:00</span>
                      <div className="flex items-center gap-2 flex-1 mx-4">
                        <div 
                          className="bg-green-200 h-2 rounded"
                          style={{ 
                            width: `${(item.count / Math.max(...(metrics?.hourlyDistribution?.map(h => h.count) || [1]))) * 100}%`,
                            minWidth: item.count > 0 ? '8px' : '0px'
                          }}
                        />
                      </div>
                      <Badge variant="outline">{item.count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Cadastros por Dia da Semana */}
            <Card>
              <CardHeader>
                <CardTitle>Distribuição Semanal</CardTitle>
                <CardDescription>Cadastros por dia da semana</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {metrics?.weeklyDistribution?.map((item) => (
                    <div key={item.day} className="flex items-center justify-between">
                      <span className="text-sm w-20">{item.day}</span>
                      <div className="flex items-center gap-2 flex-1 mx-4">
                        <div 
                          className="bg-blue-200 h-2 rounded"
                          style={{ 
                            width: `${(item.count / Math.max(...(metrics?.weeklyDistribution?.map(d => d.count) || [1]))) * 100}%`,
                            minWidth: item.count > 0 ? '8px' : '0px'
                          }}
                        />
                      </div>
                      <Badge variant="outline">{item.count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tendências Diárias */}
          <Card>
            <CardHeader>
              <CardTitle>Tendência dos Últimos 7 Dias</CardTitle>
              <CardDescription>Evolução diária dos cadastros</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-end space-x-2 h-32">
                {metrics?.dailyRegistrations?.map((item) => (
                  <div key={item.date} className="flex flex-col items-center flex-1">
                    <div 
                      className="bg-green-500 w-full rounded-t"
                      style={{ 
                        height: `${(item.count / Math.max(...(metrics?.dailyRegistrations?.map(d => d.count) || [1]))) * 100}%`,
                        minHeight: item.count > 0 ? '4px' : '2px'
                      }}
                    />
                    <span className="text-xs mt-1">{format(new Date(item.date), 'dd/MM')}</span>
                    <span className="text-xs text-muted-foreground">{item.count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
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

          <Card>
            <CardHeader>
              <CardTitle>Análise de Completude</CardTitle>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

            <Card>
              <CardHeader>
                <CardTitle>Filhos por Estado Civil</CardTitle>
                <CardDescription>Percentual com filhos por categoria</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {metrics?.familyAnalysis?.childrenByMaritalStatus?.map((item) => (
                    <div key={item.status} className="flex items-center justify-between">
                      <span className="text-sm">{item.status}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          {item.withChildren}/{item.total}
                        </span>
                        <Badge variant="outline">{item.percentageWithChildren}%</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Perfis Familiares Mais Comuns</CardTitle>
              <CardDescription>Combinações de estado civil e quantidade de filhos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {metrics?.familyAnalysis?.familyProfiles?.slice(0, 6).map((profile, index) => (
                  <Card key={index}>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{profile.profile}</span>
                        <Badge>{profile.count} {profile.count === 1 ? 'pessoa' : 'pessoas'}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Distribuição por Gênero</CardTitle>
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
                <CardTitle>Distribuição por Estado Civil</CardTitle>
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

        <TabsContent value="locations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cadastros por Estado</CardTitle>
              <CardDescription>
                Distribuição geográfica dos cadastros
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
