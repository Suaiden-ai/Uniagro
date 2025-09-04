import { useState, useMemo, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, User, LogOut, CheckCircle, Circle, Lock, Save } from 'lucide-react';
import { MultiStepFormData } from '@/types/form';
import { useToast } from '@/hooks/use-toast';
import { saveMultiStepFormData, savePartialMultiStepFormData, checkExistingRecord } from '@/services/database';

// Componentes de etapas individuais
import { EntidadeStep } from '@/components/form-steps/EntidadeStep';
import { DirigenteStep } from '@/components/form-steps/DirigenteStep';
import { ProprietarioStep } from '@/components/form-steps/ProprietarioStep';
import { DocumentacaoStep } from '@/components/form-steps/DocumentacaoStep';
import { RendaStep } from '@/components/form-steps/RendaStep';
import { SaudeStep } from '@/components/form-steps/SaudeStep';
import { PropriedadeStep } from '@/components/form-steps/PropriedadeStep';
import { InfraestruturaStep } from '@/components/form-steps/InfraestruturaStep';
import { ProducaoStep } from '@/components/form-steps/ProducaoStep';
import { ComunicacaoStep } from '@/components/form-steps/ComunicacaoStep';
import { HabitacaoStep } from '@/components/form-steps/HabitacaoStep';
import { FamiliaStep } from '@/components/form-steps/FamiliaStep';

interface MultiStepFormProps {
  onBack?: () => void;
  userId?: string;
  onSuccess?: (data: any) => void;
  showDashboardHeader?: boolean;
  userInfo?: {
    name: string;
    email?: string;
  };
  onSignOut?: () => void;
}

const STEPS = [
  { id: 1, title: 'Dados da Entidade', component: EntidadeStep, description: 'Informações da cooperativa' },
  { id: 2, title: 'Dados do Dirigente', component: DirigenteStep, description: 'Dirigente principal' },
  { id: 3, title: 'Dados Pessoais', component: ProprietarioStep, description: 'Informações pessoais' },
  { id: 4, title: 'Documentação', component: DocumentacaoStep, description: 'Documentos oficiais' },
  { id: 5, title: 'Renda & Finanças', component: RendaStep, description: 'Situação financeira' },
  { id: 6, title: 'Saúde', component: SaudeStep, description: 'Informações de saúde' },
  { id: 7, title: 'Propriedade Rural', component: PropriedadeStep, description: 'Dados da propriedade' },
  { id: 8, title: 'Infraestrutura', component: InfraestruturaStep, description: 'Energia, água, estradas' },
  { id: 9, title: 'Produção Agrícola', component: ProducaoStep, description: 'Cultivos e plantações' },
  { id: 10, title: 'Comunicação', component: ComunicacaoStep, description: 'Internet, TV, rádio' },
  { id: 11, title: 'Habitação', component: HabitacaoStep, description: 'Casa, banheiro, saneamento' },
  { id: 12, title: 'Dados da Família', component: FamiliaStep, description: 'Informações familiares' },
];

export const MultiStepForm = ({ 
  onBack, 
  userId, 
  onSuccess, 
  showDashboardHeader = false, 
  userInfo, 
  onSignOut 
}: MultiStepFormProps) => {
  const { toast } = useToast();

  // Funções para persistir dados no localStorage - otimizadas com useCallback
  const getStorageKey = useCallback((suffix: string) => `multiStepForm_${userId}_${suffix}`, [userId]);
  
  const saveToStorage = useCallback((key: string, data: any) => {
    try {
      const fullKey = getStorageKey(key);
      const value = JSON.stringify(data);
      localStorage.setItem(fullKey, value);
    } catch (error) {
      console.warn('Erro ao salvar no localStorage:', error);
    }
  }, [getStorageKey]);

  const loadFromStorage = useCallback((key: string, defaultValue: any) => {
    try {
      const fullKey = getStorageKey(key);
      const stored = localStorage.getItem(fullKey);
      const result = stored ? JSON.parse(stored) : defaultValue;
      return result;
    } catch (error) {
      console.warn('Erro ao carregar do localStorage:', error);
      return defaultValue;
    }
  }, [getStorageKey]);

  // Dados padrão do formulário
  const defaultFormData = {
      entidade: {
        nome: '',
        municipio: '',
        estado: '',
        numeroSociosInformados: 0,
        numeroSociosPlataforma: 0,
        cnpj: '',
        endereco: '',
        telefone: '',
        email: '',
        linkSite: '',
        linkRedesSociais: '',
        contaBancaria: '',
        banco: '',
      },
      dirigente: {
        nome: '',
        apelido: '',
        rg: '',
        cpf: '',
        endereco: '',
        telefone: '',
      },
      proprietario: {
        nome: '',
        sexo: '',
        corPele: '',
        religiao: '',
        time: '',
        esportePreferido: '',
        musica: '',
        artista: '',
        estadoCivil: '',
        telefone: '',
      },
      documentacao: {
        rg: '',
        cpf: '',
        dataNascimento: '',
        idade: 0,
        nis: '',
        pis: '',
        caf: false,
        cartaoProdutor: '',
        anexos: {
          rgFile: null,
          cpfFile: null,
        },
      },
      renda: {
        profissao1: '',
        rendaProfissao1: 0,
        profissao2: '',
        rendaProfissao2: 0,
        profissao3: '',
        rendaProfissao3: 0,
        rendaTotal: 0,
        possuiFinanciamentoAtivo: false,
        bancoFinanciamento: '',
        temVeiculo: false,
        qualVeiculo: '',
        casaPropria: false,
        ondeCasaPropria: '',
      },
      saude: {
        temDeficiencia: false,
        qualDeficiencia: '',
        temCromoidade: false,
        qualCromoidade: '',
        fazTratamento: false,
        qualTratamento: '',
        tomaMedicacaoControlada: false,
        qualMedicacao: '',
      },
      propriedade: {
        nome: '',
        endereco: '',
        localizacao: '',
      },
      infraestrutura: {
        temReserva: false,
        areaReserva: 0,
        areaProdutiva: 0,
        temEstrada: false,
        qualidadeEstrada: 'REGULAR' as const,
        temEnergia: false,
        tipoEnergia: 'MONOFASICO' as const,
        tipoAlternativoEnergia: 'OFFGRID' as const,
        temAgua: false,
        tipoAgua: 'POCO' as const,
        aguaEncanada: false,
        tipoSolo: '',
        vegetacao: '',
        possuiGalpao: false,
        possuiSilo: false,
        reservatorioAgua: false,
        energiaFotovoltaica: false,
        geracaoFotovoltaica: '',
        sistemaIrrigacao: false,
        tipoIrrigacao: 'GOTEJO' as const,
        areaIrrigada: 0,
      },
      producao: {
        temPasto: false,
        areaPasto: 0,
        temManga: false,
        areaManga: 0,
        temProducaoAgricola: false,
        quaisProducoes: '',
        feijaoArea: 0,
        feijaoInicioSafra: '',
        feijaoPrevisaoColheita: '',
        feijaoPrevisaoQuantidade: 0,
        areaPermitidaSemUso: 0,
        temCriacoes: false,
        frangosGranja: 0,
        idadeFrangos: 0,
        inicioFrangos: '',
        finalAbate: '',
        pesoFrangos: 0,
        producaoArtesanalIndustrial: 'ARTESANAL' as const,
        tipoQueijo: '',
        pesoQueijo: 0,
        quantidadeQueijo: 0,
        producaoLeiteira: 0,
        mediaLitroDia: 0,
        totalProducaoLeite: 0,
        temPescado: false,
        reservatorioPescado: '',
        especiePescado: '',
        inicioProducaoPescado: '',
        finalProducaoPescado: '',
        kgPescado: 0,
        potencialExpansao: '',
        setorExpansao: 'AGRICULTURA' as const,
        necessidadesExpansao: '',
        quantidadeNecessidades: '',
      },
      comunicacao: {
        temSinalCelular: false,
        operadoraCelular: '',
        temSinalInternet: false,
        operadoraInternet: '',
        temSinalRadio: false,
        qualRadio: '',
        programaRadioPreferido: '',
        temSinalTV: false,
        qualTV: '',
        programaTVPreferido: '',
      },
      habitacao: {
        temCasaPropriedade: false,
        temBanheiro: false,
        cisternaNegra: false,
        saneamento: false,
      },
      familia: {
        conjuge: { nome: '', idade: 0, profissao: '' },
        filhos: [],
        pai: { nome: '', idade: 0, profissao: '' },
        mae: { nome: '', idade: 0, profissao: '' },
      }
    };

  // Função para inicializar dados do localStorage
  const initializeFromStorage = useMemo(() => {
    const loadData = (key: string, defaultValue: any) => {
      try {
        const fullKey = `multiStepForm_${userId}_${key}`;
        const stored = localStorage.getItem(fullKey);
        return stored ? JSON.parse(stored) : defaultValue;
      } catch (error) {
        console.warn('Erro ao carregar do localStorage:', error);
        return defaultValue;
      }
    };

    return {
      currentStep: loadData('currentStep', 1),
      completedSteps: new Set<number>(loadData('completedSteps', [])),
      formData: loadData('formData', defaultFormData)
    };
  }, [userId, defaultFormData]);

  // Estados inicializados com dados do localStorage
  const [currentStep, setCurrentStep] = useState(initializeFromStorage.currentStep);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(initializeFromStorage.completedSteps);
  const [formData, setFormData] = useState<Partial<MultiStepFormData>>(initializeFromStorage.formData);
  const [isSaving, setIsSaving] = useState(false);
  const [hasExistingRecord, setHasExistingRecord] = useState(false);
  const [recordUuid, setRecordUuid] = useState<string | null>(null);

  // Verificar se já existe um registro para este usuário
  useEffect(() => {
    const checkRecord = async () => {
      if (userId) {
        const result = await checkExistingRecord(userId);
        setHasExistingRecord(result.exists);
        setRecordUuid(result.uuid || null);
      }
    };
    checkRecord();
  }, [userId]);

  // Função para salvar dados automaticamente no banco
  const saveToDatabase = useCallback(async (data: Partial<MultiStepFormData>, isUpdate: boolean = false) => {
    if (isSaving) return; // Evitar múltiplos salvamentos simultâneos
    
    setIsSaving(true);
    try {
      // Log específico para dados de renda
      if (data.renda) {
        console.log('💰 DADOS DE RENDA sendo enviados para o banco:');
        console.log('renda object:', data.renda);
        console.log('profissao1:', data.renda.profissao1);
        console.log('rendaProfissao1:', data.renda.rendaProfissao1);
        console.log('rendaTotal:', data.renda.rendaTotal);
        console.log('possuiFinanciamentoAtivo:', data.renda.possuiFinanciamentoAtivo);
      }
      
      const result = await savePartialMultiStepFormData({ ...defaultFormData, ...data } as MultiStepFormData, userId, isUpdate, recordUuid || undefined);
      
      if (result.success) {
        if (!isUpdate) {
          setHasExistingRecord(true);
        }
        console.log('Dados salvos automaticamente no banco');
        
        // Mostrar toast de confirmação discreto
        toast({
          title: "Dados salvos",
          description: "Suas informações foram salvas automaticamente.",
          duration: 2000,
        });
      } else {
        console.warn('Erro ao salvar no banco:', result.error);
        // Mostrar toast de erro apenas se for um erro crítico
        if (result.error?.includes('CPF já foi cadastrado')) {
          toast({
            title: "Erro ao salvar",
            description: result.error,
            variant: "destructive",
            duration: 5000,
          });
        }
      }
    } catch (error) {
      console.error('Erro inesperado ao salvar no banco:', error);
    } finally {
      setIsSaving(false);
    }
  }, [isSaving, userId, toast]);

  // Memoizar valores calculados
  const totalSteps = useMemo(() => STEPS.length, []);
  const progress = useMemo(() => (completedSteps.size / totalSteps) * 100, [completedSteps.size, totalSteps]);

  // Otimizar funções com useCallback
  const navigateToStep = useCallback((stepId: number) => {
    // Permite navegar livremente entre todas as etapas
    setCurrentStep(stepId);
    saveToStorage('currentStep', stepId);
  }, [saveToStorage]);

  const isStepAccessible = useCallback((stepId: number): boolean => {
    // Todas as etapas são acessíveis
    return true;
  }, []);

  const isStepCompleted = useCallback((stepId: number): boolean => {
    return completedSteps.has(stepId);
  }, [completedSteps]);

  const getStepKey = useCallback((step: number): keyof MultiStepFormData => {
    const keys: Record<number, keyof MultiStepFormData> = {
      1: 'entidade',
      2: 'dirigente', 
      3: 'proprietario',
      4: 'documentacao',
      5: 'renda',
      6: 'saude',
      7: 'propriedade',
      8: 'infraestrutura',
      9: 'producao',
      10: 'comunicacao',
      11: 'habitacao',
      12: 'familia',
    };
    return keys[step] || 'entidade';
  }, []);

  const validateCurrentStepData = useCallback((): boolean => {
    const stepKey = getStepKey(currentStep);
    const stepData = formData[stepKey];
    
    // Validações básicas por etapa
    switch (currentStep) {
      case 1: // Entidade
        return !!(stepData as any)?.nome && !!(stepData as any)?.cnpj && !!(stepData as any)?.email;
      case 2: // Dirigente
        return !!(stepData as any)?.nome && !!(stepData as any)?.cpf;
      case 3: // Proprietário
        return !!(stepData as any)?.nome;
      case 4: // Documentação
        return !!(stepData as any)?.rg && !!(stepData as any)?.cpf && !!(stepData as any)?.dataNascimento;
      case 5: // Renda
        return !!(stepData as any)?.profissao1 && (stepData as any)?.rendaProfissao1 > 0;
      case 6: // Saúde
        return true; // Validação feita no componente
      case 7: // Propriedade
        return !!(stepData as any)?.nome && !!(stepData as any)?.endereco && !!(stepData as any)?.localizacao;
      case 8: // Infraestrutura
        return (stepData as any)?.areaProdutiva > 0;
      case 9: // Produção
        return true; // Validação feita no componente
      case 10: // Comunicação
        return true; // Validação feita no componente
      case 11: // Habitação
        return true; // Validação feita no componente
      case 12: // Família
        return !!(stepData as any)?.conjuge?.nome && !!(stepData as any)?.pai?.nome && !!(stepData as any)?.mae?.nome;
      default:
        return true;
    }
  }, [currentStep, formData, getStepKey]);

  const handleNext = useCallback(() => {
    if (currentStep < totalSteps) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      saveToStorage('currentStep', nextStep);
    }
  }, [currentStep, totalSteps, saveToStorage]);

  const handlePrevious = useCallback(() => {
    if (currentStep > 1) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      saveToStorage('currentStep', prevStep);
    }
  }, [currentStep, saveToStorage]);

  const handleStepComplete = useCallback(async (stepData: any) => {
    const stepKey = getStepKey(currentStep);
    
    // Log detalhado para debug da etapa 5
    if (currentStep === 5) {
      console.log('🔍 DEBUG ETAPA 5 - RENDA:');
      console.log('stepKey:', stepKey);
      console.log('stepData recebido:', stepData);
      console.log('formData atual antes da atualização:', formData.renda);
    }
    
    const updatedFormData = {
      ...formData,
      [stepKey]: { ...formData[stepKey as keyof MultiStepFormData], ...stepData }
    };
    
    // Log detalhado após atualização
    if (currentStep === 5) {
      console.log('formData atualizado após merge:', updatedFormData.renda);
      console.log('Dados completos que serão salvos:', updatedFormData);
    }
    
    setFormData(updatedFormData);
    
    // Marcar etapa como completa
    const newCompletedSteps = new Set([...completedSteps, currentStep]);
    setCompletedSteps(newCompletedSteps);
    
    // Salvar no localStorage
    saveToStorage('formData', updatedFormData);
    saveToStorage('completedSteps', Array.from(newCompletedSteps));
    
    // Salvar automaticamente no banco
    await saveToDatabase(updatedFormData, hasExistingRecord);
    
    // Auto-avançar para próxima etapa
    if (currentStep < totalSteps) {
      handleNext();
    }
  }, [currentStep, formData, completedSteps, getStepKey, saveToStorage, totalSteps, handleNext, saveToDatabase, hasExistingRecord]);

  // Função para salvar dados no banco sem avançar
  const handleSaveData = useCallback(async () => {
    console.log('💾 BOTÃO SALVAR CLICADO - handleSaveData chamado');
    console.log('💾 Dados atuais do formData:', formData);
    console.log('💾 Dados da etapa atual:', formData[getStepKey(currentStep)]);
    
    // IMPORTANTE: O botão "Salvar Informações" não captura os dados da etapa atual
    // porque os dados ficam no estado local do componente da etapa
    // Para resolver isso, precisamos que o usuário clique em "Próxima" primeiro
    // ou implementar uma forma de capturar os dados da etapa atual
    
    console.log('⚠️ ATENÇÃO: O botão "Salvar Informações" não captura dados da etapa atual!');
    console.log('⚠️ Os dados preenchidos ficam no estado local do componente');
    console.log('⚠️ Para salvar os dados, clique em "Próxima" primeiro');
    
    await saveToDatabase(formData, hasExistingRecord);
  }, [formData, saveToDatabase, hasExistingRecord, getStepKey, currentStep]);

  const handleFinalSubmit = useCallback(async () => {
    try {
      console.log('Dados completos do formulário:', formData);
      
      // Salvar dados no banco de dados
      const result = await saveMultiStepFormData({ ...defaultFormData, ...formData } as MultiStepFormData, userId, recordUuid || undefined);
      
      if (result.success) {
        // Limpar dados do localStorage após sucesso
        try {
          localStorage.removeItem(getStorageKey('currentStep'));
          localStorage.removeItem(getStorageKey('completedSteps'));
          localStorage.removeItem(getStorageKey('formData'));
          // Limpar dados de scroll também (se houver algum)
          const scrollKey = `scroll_form_${userId}`;
          sessionStorage.removeItem(scrollKey);
        } catch (e) {
          console.warn('Erro ao limpar localStorage:', e);
        }
        
        toast({
          title: "Formulário enviado com sucesso!",
          description: "Todos os seus dados foram salvos no banco de dados.",
        });
        
        onSuccess?.(formData);
      } else {
        console.error('Erro ao salvar no Supabase:', result.error);
        
        // Diferentes tipos de mensagens baseadas no erro
        let errorTitle = "Erro ao enviar dados";
        let errorDescription = result.error || "Tente novamente em alguns instantes.";
        
        if (result.error?.includes('CPF já foi cadastrado')) {
          errorTitle = "CPF já cadastrado";
          errorDescription = result.error;
        }
        
        toast({
          title: errorTitle,
          description: errorDescription,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast({
        title: "Erro ao enviar formulário",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    }
  }, [formData, getStorageKey, userId, toast, onSuccess]);

  // Memoizar dados do passo atual para evitar re-renders
  const currentStepData = useMemo(() => STEPS.find(step => step.id === currentStep), [currentStep]);
  const StepComponent = currentStepData?.component;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard Header */}
      {showDashboardHeader && (
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <img 
                  src="/uniagro-logo.png" 
                  alt="Uniagro" 
                  className="h-8 w-auto mr-3"
                />
                <h1 className="text-xl font-semibold text-gray-900">Dashboard - Questionário</h1>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-700">{userInfo?.name}</span>
                </div>
                
                {/* Indicador de salvamento */}
                {isSaving && (
                  <div className="flex items-center space-x-2 text-sm text-green-600">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-green-600 border-t-transparent"></div>
                    <span>Salvando...</span>
                  </div>
                )}
                
                {onSignOut && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onSignOut}
                    className="flex items-center space-x-2"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sair</span>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </header>
      )}
      
      <div className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Botão Voltar */}
          {onBack && (
            <div className="mb-6">
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  onBack?.();
                }}
                className="text-green-600 hover:text-green-700 hover:bg-green-50"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                <span>Voltar</span>
              </Button>
            </div>
          )}

          {/* Progress Bar */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex justify-between items-center mb-2">
                <CardTitle className="text-lg">
                  Questionário de Cadastro Completo
                </CardTitle>
                <span className="text-sm text-gray-500">
                  {completedSteps.size} de {totalSteps} etapas completas ({Math.round(progress)}%)
                </span>
              </div>
              <Progress value={progress} className="w-full" />
            </CardHeader>
          </Card>

          {/* Layout com Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar - Lista de Etapas */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle className="text-base">Etapas do Questionário</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    {STEPS.map((step) => {
                      const isCompleted = isStepCompleted(step.id);
                      const isAccessible = isStepAccessible(step.id);
                      const isCurrent = currentStep === step.id;
                      
                      return (
                        <button
                          key={step.id}
                          onClick={() => navigateToStep(step.id)}
                          disabled={!isAccessible}
                          className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                            isCurrent
                              ? 'bg-green-100 border-2 border-green-500 text-green-900'
                              : isCompleted
                              ? 'bg-green-50 text-green-800 hover:bg-green-100'
                              : isAccessible
                              ? 'bg-gray-50 hover:bg-gray-100 text-gray-900'
                              : 'bg-gray-25 text-gray-400 cursor-not-allowed opacity-50'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0">
                              {isCompleted ? (
                                <CheckCircle className="h-5 w-5 text-green-600" />
                              ) : isAccessible ? (
                                <Circle className={`h-5 w-5 ${isCurrent ? 'text-green-600' : 'text-gray-400'}`} />
                              ) : (
                                <Lock className="h-5 w-5 text-gray-300" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm font-medium ${
                                isCurrent ? 'text-green-900' : isCompleted ? 'text-green-800' : 'text-gray-900'
                              }`}>
                                {step.id}. {step.title}
                              </p>
                              <p className={`text-xs ${
                                isCurrent ? 'text-green-700' : isCompleted ? 'text-green-600' : 'text-gray-500'
                              }`}>
                                {step.description}
                              </p>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Conteúdo Principal */}
            <div className="lg:col-span-3">
              <Card>
                <CardContent className="p-8">
              {StepComponent ? (
                <StepComponent
                  data={formData[getStepKey(currentStep)] as any || {}}
                  onNext={handleStepComplete}
                  onPrevious={handlePrevious}
                  onSave={handleSaveData}
                  isFirst={currentStep === 1}
                  isLast={currentStep === totalSteps}
                />
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {currentStepData?.title}
                  </h3>
                  <p className="text-gray-600 mb-2">
                    {currentStepData?.description}
                  </p>
                  <p className="text-gray-500 mb-8">
                    Esta etapa está sendo desenvolvida. Por enquanto, você pode marcar como concluída e prosseguir.
                  </p>
                  
                  <div className="flex justify-between">
                    <Button
                      variant="outline"
                      onClick={handlePrevious}
                      disabled={currentStep === 1}
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Anterior
                    </Button>
                    
                    <div className="flex space-x-4">
                      <Button
                        variant="outline"
                        onClick={() => {
                          const newCompletedSteps = new Set([...completedSteps, currentStep]);
                          setCompletedSteps(newCompletedSteps);
                          saveToStorage('completedSteps', Array.from(newCompletedSteps));
                        }}
                        disabled={isStepCompleted(currentStep)}
                      >
                        {isStepCompleted(currentStep) ? 'Concluída' : 'Marcar como Concluída'}
                      </Button>
                      
                      <Button
                        variant="outline"
                        onClick={handleSaveData}
                        disabled={isSaving}
                        className="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        {isSaving ? 'Salvando...' : 'Salvar informações'}
                      </Button>
                      
                      {currentStep === totalSteps ? (
                        <Button onClick={handleFinalSubmit} className="bg-green-600 hover:bg-green-700">
                          Finalizar Questionário
                        </Button>
                      ) : (
                        <Button onClick={handleNext} className="bg-green-600 hover:bg-green-700">
                          Próxima
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
