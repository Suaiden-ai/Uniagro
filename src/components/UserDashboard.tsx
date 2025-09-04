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
}

const UserDashboard = () => {
  const { user, profile, signOut, loading: authLoading } = useUserAuth();
  const [showForm, setShowForm] = useState(false);
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  // Otimizar função para carregar submissions
  const loadUserSubmissions = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('cadastro_inicial')
        .select('id_linha, timestamp_cadastro, nome_completo, cpf')
        .eq('user_id', user.id)
        .order('timestamp_cadastro', { ascending: false });

      if (error) {
        console.warn('Erro ao carregar formulários:', error);
        setSubmissions([]);
      } else {
        setSubmissions(data || []);
      }
    } catch (error) {
      console.warn('Erro ao carregar formulários:', error);
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
                className="h-8 w-auto mr-3"
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
                {submissions.length === 0 ? (
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
                ) : (
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
                )}
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
                    {submissions.slice(0, 3).map((submission) => (
                      <div key={submission.id_linha} className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <div className="flex-1">
                          <p className="text-xs text-gray-500">
                            {new Date(submission.timestamp_cadastro).toLocaleDateString('pt-BR')}
                          </p>
                          <p className="text-sm text-gray-900">Questionário preenchido</p>
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
