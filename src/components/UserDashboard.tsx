import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { User, FileText, LogOut, CheckCircle, Clock } from 'lucide-react';
import { useUserAuth } from '@/contexts/UserAuthContext';
import { MultiStepForm } from '@/components/MultiStepForm';
import { supabase } from '@/lib/supabase';

interface FormSubmission {
  id_linha: number;
  timestamp_cadastro: string;
  nome_completo: string;
  cpf: string;
  source?: string;
  status_completo?: boolean;
  etapas_completas?: number;
  total_etapas?: number;
}

const UserDashboard = () => {
  const { user, profile, signOut, loading: authLoading } = useUserAuth();
  const [showForm, setShowForm] = useState(false);
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  // Função para carregar dados do questionário multistep
  const loadUserSubmissions = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // Buscar apenas da tabela questionario_multistep
      const { data: questionarioData, error: questionarioError } = await supabase
        .from('questionario_multistep')
        .select('id, timestamp_cadastro, nome_completo, documentacao_cpf, status_completo, etapas_completas, total_etapas')
        .eq('user_id', user.id)
        .order('timestamp_cadastro', { ascending: false });

      if (questionarioError) {
        console.warn('Erro ao carregar questionario_multistep:', questionarioError);
        setSubmissions([]);
        return;
      }

      // Converter dados do questionário para o formato esperado
      const submissions = (questionarioData || []).map(item => ({
        id_linha: item.id,
        timestamp_cadastro: item.timestamp_cadastro,
        nome_completo: item.nome_completo,
        cpf: item.documentacao_cpf,
        source: 'questionario_multistep',
        status_completo: item.status_completo,
        etapas_completas: item.etapas_completas,
        total_etapas: item.total_etapas
      }));

      setSubmissions(submissions);
    } catch (error) {
      console.warn('Erro ao carregar questionário:', error);
      setSubmissions([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Ref para controlar se já carregamos os dados para este usuário
  const loadedUserIdRef = useRef<string | null>(null);

  // Otimizar useEffect para evitar re-renders desnecessários
  useEffect(() => {
    // Só carregar submissions quando o usuário estiver carregado E for um usuário diferente
    if (!authLoading && user && loadedUserIdRef.current !== user.id) {
      loadedUserIdRef.current = user.id;
      loadUserSubmissions();
    } else if (!authLoading && !user) {
      loadedUserIdRef.current = null;
      setLoading(false);
    }
  }, [user, authLoading, loadUserSubmissions]);

  // Memoizar função de sucesso do formulário
  const handleFormSuccess = useCallback(() => {
    setShowForm(false);
    loadUserSubmissions(); // Recarregar lista
  }, [loadUserSubmissions]);

  // Memoizar informações do usuário para o formulário
  const userFormInfo = useMemo(() => ({
    name: profile?.name || user?.email || 'Usuário',
    email: profile?.email || user?.email
  }), [profile?.name, profile?.email, user?.email]);

  // Memoizar handlers para evitar re-renders
  const handleStartForm = useCallback(() => setShowForm(true), []);
  const handleBackToDashboard = useCallback(() => setShowForm(false), []);

  // Função para recalcular etapas (debug/correção)
  const recalculateSteps = useCallback(async () => {
    if (!user) return;
    
    try {
      // Buscar o registro atual
      const { data: currentRecord } = await supabase
        .from('questionario_multistep')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (!currentRecord) {
        return;
      }
      
      // Contar quantos campos/etapas foram preenchidos
      const etapasPreenchidas = [
        currentRecord.entidade_nome ? 1 : 0, // Entidade
        currentRecord.dirigente_nome ? 1 : 0, // Dirigente  
        currentRecord.nome_completo ? 1 : 0, // Proprietário
        currentRecord.documentacao_cpf ? 1 : 0, // Documentação
        currentRecord.renda_total !== null ? 1 : 0, // Renda
        currentRecord.saude_tem_plano_saude !== null ? 1 : 0, // Saúde
        currentRecord.propriedade_area_hectares !== null ? 1 : 0, // Propriedade
        currentRecord.infraestrutura_tem_energia_eletrica !== null ? 1 : 0, // Infraestrutura
        currentRecord.producao_cultiva_algo !== null ? 1 : 0, // Produção
        currentRecord.comunicacao_tem_internet !== null ? 1 : 0, // Comunicação
        currentRecord.habitacao_tem_casa_propriedade !== null ? 1 : 0, // Habitação
        currentRecord.familia_qtd_pessoas !== null ? 1 : 0, // Família
      ].reduce((a, b) => a + b, 0);
      
      // Atualizar no banco
      const { error } = await supabase
        .from('questionario_multistep')
        .update({
          etapas_completas: etapasPreenchidas,
          total_etapas: 12
        })
        .eq('user_id', user.id);
      
      if (!error) {
        // Recarregar dados
        loadUserSubmissions();
      }
    } catch (error) {
      console.error('Erro ao recalcular etapas:', error);
    }
  }, [user, loadUserSubmissions]);


  // Memoizar dados derivados
  const userName = useMemo(() => {
    // Priorizar o nome do perfil, depois user_metadata, depois email
    const profileName = profile?.name;
    const metadataName = user?.user_metadata?.name || user?.user_metadata?.nome;
    const emailName = user?.email?.split('@')[0];
    
    return profileName || metadataName || emailName || 'Usuário';
  }, [profile?.name, user?.user_metadata?.name, user?.user_metadata?.nome, user?.email]);

  const displayEmail = useMemo(() => 
    profile?.email || user?.email, 
    [profile?.email, user?.email]
  );

  const memberSince = useMemo(() => 
    profile?.created_at ? new Date(profile.created_at).toLocaleDateString('pt-BR') : null,
    [profile?.created_at]
  );

  // Mostrar loading apenas se auth ainda está carregando OU se estamos carregando dados
  if (authLoading || (loading && user)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (showForm) {
    return (
      <MultiStepForm 
        key={`form-${user?.id}`}
        onBack={handleBackToDashboard}
        onSuccess={handleFormSuccess}
        userId={user?.id}
        showDashboardHeader={true}
        userInfo={userFormInfo}
        onSignOut={signOut}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img 
                src="/uniagro-logo.png" 
                alt="Uniagro" 
                className="header-logo mr-3"
              />
              <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-700">{userName}</span>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={signOut}
                className="flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Sair</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Bem-vindo, {userName}!</h2>
          <p className="text-gray-600">Gerencie seus questionários e informações aqui.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Card de Ação Principal */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-green-600" />
                  <span>Questionário de Cadastro</span>
                </CardTitle>
                <CardDescription>
                  Preencha o questionário para nos ajudar a conhecer melhor seu perfil
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                {(() => {
                  // Verificar se há questionário na tabela questionario_multistep
                  const questionario = submissions.find(sub => sub.source === 'questionario_multistep');
                  
                  if (!questionario) {
                    // Nenhum questionário iniciado
                    return (
                      <div className="text-center py-8">
                        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          Nenhum questionário preenchido
                        </h3>
                        <p className="text-gray-500 mb-6">
                          Você ainda não preencheu o questionário. Clique no botão abaixo para começar.
                        </p>
                        
                        <Button
                          onClick={handleStartForm}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Preencher Questionário
                        </Button>
                      </div>
                    );
                  }
                  
                  if (questionario.status_completo) {
                    // Questionário completo
                    return (
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="h-5 w-5 text-green-500" />
                            <span className="font-medium text-gray-900">Questionário Preenchido</span>
                            <Badge variant="outline" className="text-green-600">
                              Completo
                            </Badge>
                          </div>
                          
                          <Button
                            variant="outline"
                            onClick={handleStartForm}
                            size="sm"
                          >
                            Preencher Novamente
                          </Button>
                        </div>
                        
                        <Alert>
                          <CheckCircle className="h-4 w-4" />
                          <AlertDescription>
                            Obrigado por preencher o questionário! Suas informações foram salvas com sucesso.
                            Você pode preencher novamente se desejar atualizar seus dados.
                          </AlertDescription>
                        </Alert>
                      </div>
                    );
                  }
                  
                  // Questionário em andamento
                  const progresso = questionario.etapas_completas && questionario.total_etapas 
                    ? Math.round((questionario.etapas_completas / questionario.total_etapas) * 100)
                    : 0;
                  
                  return (
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <Clock className="h-5 w-5 text-yellow-500" />
                          <span className="font-medium text-gray-900">Questionário em Andamento</span>
                          <Badge variant="outline" className="text-yellow-600">
                            {progresso}% completo
                          </Badge>
                        </div>
                        
                        <Button
                          onClick={handleStartForm}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Continuar Questionário
                        </Button>
                      </div>
                      
                      <div className="mb-4">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>Progresso</span>
                          <span>{questionario.etapas_completas || 0} de {questionario.total_etapas || 12} etapas</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progresso}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <Alert>
                        <Clock className="h-4 w-4" />
                        <AlertDescription>
                          Você tem um questionário em andamento. Clique no botão acima para continuar de onde parou.
                        </AlertDescription>
                      </Alert>
                    </div>
                  );
                })()}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Informações do Perfil */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Informações do Perfil</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-gray-500">Nome</label>
                  <p className="text-sm text-gray-900">{userName}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">Email</label>
                  <p className="text-sm text-gray-900">{displayEmail}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">Membro desde</label>
                  <p className="text-sm text-gray-900">{memberSince}</p>
                </div>
              </CardContent>
            </Card>

            {/* Histórico de Formulários */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Histórico</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="text-sm text-gray-500">Carregando...</p>
                ) : submissions.length === 0 ? (
                  <p className="text-sm text-gray-500">Nenhum formulário preenchido ainda</p>
                ) : (
                  <div className="space-y-3">
                    {submissions.map((submission) => (
                      <div key={submission.id_linha} className="flex items-center space-x-2">
                        {submission.status_completo ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <Clock className="h-4 w-4 text-yellow-500" />
                        )}
                        <div className="flex-1">
                          <p className="text-xs text-gray-500">
                            {new Date(submission.timestamp_cadastro).toLocaleDateString('pt-BR')}
                          </p>
                          <p className="text-sm text-gray-900">
                            {submission.status_completo 
                              ? 'Questionário completo' 
                              : `Questionário em andamento (${submission.etapas_completas || 0}/${submission.total_etapas || 12} etapas)`
                            }
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;
