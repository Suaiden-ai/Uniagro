import { useState, useMemo, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, User, LogOut, CheckCircle, Circle, Lock, Save, CheckSquare, Menu, X } from 'lucide-react';
import { MultiStepFormData } from '@/types/form';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { saveMultiStepFormData, savePartialMultiStepFormData, checkExistingRecord, loadExistingFormData } from '@/services/database';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { supabase } from '@/lib/supabase';

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
  const isMobile = useIsMobile();
  
  // Estado para controlar a sidebar mobile
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
  const [showFinishConfirmation, setShowFinishConfirmation] = useState(false);
  const [showFinalConfirmation, setShowFinalConfirmation] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);

  // Verificar se já existe um registro para este usuário e carregar dados
  useEffect(() => {
    const checkAndLoadRecord = async () => {
      if (userId) {
        console.log('🔍 Verificando registro existente para user_id:', userId);
        
        const result = await checkExistingRecord(userId);
        setHasExistingRecord(result.exists);
        setRecordUuid(result.uuid || null);
        
        console.log('✅ Resultado da verificação:', { exists: result.exists, uuid: result.uuid });
        
        if (result.exists) {
          console.log('📥 Carregando dados existentes...');
          
          const loadResult = await loadExistingFormData(userId);
          if (loadResult.success && loadResult.data) {
            console.log('✅ Dados carregados com sucesso:', loadResult.data);
            
            // Atualizar o formData com os dados carregados
            setFormData(loadResult.data);
            
            // Limpar dados do localStorage para usar os dados do banco
            try {
              localStorage.removeItem(getStorageKey('formData'));
              console.log('🧹 Dados do localStorage limpos - usando dados do banco');
            } catch (e) {
              console.warn('Erro ao limpar localStorage:', e);
            }
            
            // Determinar quais etapas foram preenchidas baseado nos dados
            const completedStepsList: number[] = [];
            
            if (loadResult.data.entidade?.nome) completedStepsList.push(1);
            if (loadResult.data.dirigente?.nome) completedStepsList.push(2);
            if (loadResult.data.proprietario?.nome) completedStepsList.push(3);
            if (loadResult.data.documentacao?.cpf) completedStepsList.push(4);
            if (loadResult.data.renda?.rendaTotal !== undefined) completedStepsList.push(5);
            if (loadResult.data.saude?.temDeficiencia !== undefined) completedStepsList.push(6);
            if (loadResult.data.propriedade?.nome) completedStepsList.push(7);
            if (loadResult.data.infraestrutura?.temEnergia !== undefined) completedStepsList.push(8);
            if (loadResult.data.producao?.temProducaoAgricola !== undefined) completedStepsList.push(9);
            if (loadResult.data.comunicacao?.temSinalInternet !== undefined) completedStepsList.push(10);
            if (loadResult.data.habitacao?.temCasaPropriedade !== undefined) completedStepsList.push(11);
            
            // Verificação mais robusta para família (etapa 12)
            const familiaCompleta = loadResult.data.familia?.conjuge?.nome || 
                                  (loadResult.data.familia?.filhos && loadResult.data.familia.filhos.length > 0) ||
                                  loadResult.data.familia?.pai?.nome ||
                                  loadResult.data.familia?.mae?.nome;
            if (familiaCompleta) completedStepsList.push(12);
            
            console.log('📊 DEBUG - Dados da família detectados:', {
              conjuge: loadResult.data.familia?.conjuge,
              filhos: loadResult.data.familia?.filhos,
              pai: loadResult.data.familia?.pai,
              mae: loadResult.data.familia?.mae,
              familiaCompleta
            });
            
            console.log('📊 Etapas detectadas como completas:', completedStepsList);
            setCompletedSteps(new Set(completedStepsList));
            
            // Definir a etapa atual como a próxima não completada
            const nextStep = completedStepsList.length < 12 ? completedStepsList.length + 1 : 12;
            setCurrentStep(nextStep);
            
            console.log('➡️ Etapa atual definida como:', nextStep);
          } else {
            console.warn('⚠️ Erro ao carregar dados existentes:', loadResult.error);
          }
        } else {
          console.log('📝 Nenhum registro existente - começando novo questionário');
        }
      }
    };
    
    checkAndLoadRecord();
  }, [userId, getStorageKey]);

  // Função para salvar dados automaticamente no banco
  const saveToDatabase = useCallback(async (data: Partial<MultiStepFormData>, isUpdate: boolean = false): Promise<{ success: boolean; error?: string } | undefined> => {
    if (isSaving) return; // Evitar múltiplos salvamentos simultâneos
    
    setIsSaving(true);
    try {
      // Log específico para dados do dirigente (etapa 2)
      if (data.dirigente) {
        console.log('👔 DADOS DO DIRIGENTE sendo enviados para o banco:');
        console.log('dirigente object:', data.dirigente);
        console.log('nome:', data.dirigente.nome);
        console.log('apelido:', data.dirigente.apelido);
        console.log('rg:', data.dirigente.rg);
        console.log('cpf:', data.dirigente.cpf);
        console.log('endereco:', data.dirigente.endereco);
        console.log('telefone:', data.dirigente.telefone);
      }
      
      // Log específico para dados da entidade
      if (data.entidade) {
        console.log('🏢 DADOS DA ENTIDADE sendo enviados para o banco:');
        console.log('entidade object:', data.entidade);
        console.log('nome:', data.entidade.nome);
        console.log('municipio:', data.entidade.municipio);
        console.log('estado:', data.entidade.estado);
        console.log('cnpj:', data.entidade.cnpj);
        console.log('endereco:', data.entidade.endereco);
        console.log('telefone:', data.entidade.telefone);
        console.log('email:', data.entidade.email);
      }
      
      // Log específico para dados de renda
      if (data.renda) {
        console.log('💰 DADOS DE RENDA sendo enviados para o banco:');
        console.log('renda object:', data.renda);
        console.log('profissao1:', data.renda.profissao1);
        console.log('rendaProfissao1:', data.renda.rendaProfissao1);
        console.log('rendaTotal:', data.renda.rendaTotal);
        console.log('possuiFinanciamentoAtivo:', data.renda.possuiFinanciamentoAtivo);
      }
      
      // Log específico para dados de saúde
      if (data.saude) {
        console.log('🏥 DADOS DE SAÚDE sendo enviados para o banco:');
        console.log('saude object:', data.saude);
        console.log('temDeficiencia:', data.saude.temDeficiencia);
        console.log('qualDeficiencia:', data.saude.qualDeficiencia);
        console.log('temCromoidade:', data.saude.temCromoidade);
        console.log('qualCromoidade:', data.saude.qualCromoidade);
        console.log('fazTratamento:', data.saude.fazTratamento);
        console.log('qualTratamento:', data.saude.qualTratamento);
        console.log('tomaMedicacaoControlada:', data.saude.tomaMedicacaoControlada);
        console.log('qualMedicacao:', data.saude.qualMedicacao);
      }
      
      // Log específico para dados de infraestrutura
      if (data.infraestrutura) {
        console.log('🏗️ DADOS DE INFRAESTRUTURA sendo enviados para o banco:');
        console.log('infraestrutura object:', data.infraestrutura);
        console.log('temReserva:', data.infraestrutura.temReserva);
        console.log('areaReserva:', data.infraestrutura.areaReserva);
        console.log('areaProdutiva:', data.infraestrutura.areaProdutiva);
        console.log('temEstrada:', data.infraestrutura.temEstrada);
        console.log('qualidadeEstrada:', data.infraestrutura.qualidadeEstrada);
        console.log('temEnergia:', data.infraestrutura.temEnergia);
        console.log('tipoEnergia:', data.infraestrutura.tipoEnergia);
        console.log('temAgua:', data.infraestrutura.temAgua);
        console.log('tipoAgua:', data.infraestrutura.tipoAgua);
        console.log('aguaEncanada:', data.infraestrutura.aguaEncanada);
        console.log('tipoSolo:', data.infraestrutura.tipoSolo);
        console.log('vegetacao:', data.infraestrutura.vegetacao);
        console.log('possuiGalpao:', data.infraestrutura.possuiGalpao);
        console.log('possuiSilo:', data.infraestrutura.possuiSilo);
        console.log('reservatorioAgua:', data.infraestrutura.reservatorioAgua);
        console.log('energiaFotovoltaica:', data.infraestrutura.energiaFotovoltaica);
        console.log('geracaoFotovoltaica:', data.infraestrutura.geracaoFotovoltaica);
        console.log('sistemaIrrigacao:', data.infraestrutura.sistemaIrrigacao);
        console.log('tipoIrrigacao:', data.infraestrutura.tipoIrrigacao);
        console.log('areaIrrigada:', data.infraestrutura.areaIrrigada);
      }
      
      // Log específico para dados de comunicação
      if (data.comunicacao) {
        console.log('📡 DADOS DE COMUNICAÇÃO sendo enviados para o banco:');
        console.log('comunicacao object:', data.comunicacao);
        console.log('temSinalCelular:', data.comunicacao.temSinalCelular);
        console.log('operadoraCelular:', data.comunicacao.operadoraCelular);
        console.log('temSinalInternet:', data.comunicacao.temSinalInternet);
        console.log('operadoraInternet:', data.comunicacao.operadoraInternet);
        console.log('temSinalRadio:', data.comunicacao.temSinalRadio);
        console.log('qualRadio:', data.comunicacao.qualRadio);
        console.log('programaRadioPreferido:', data.comunicacao.programaRadioPreferido);
        console.log('temSinalTV:', data.comunicacao.temSinalTV);
        console.log('qualTV:', data.comunicacao.qualTV);
        console.log('programaTVPreferido:', data.comunicacao.programaTVPreferido);
      }
      
      // Log específico para dados de habitação
      if (data.habitacao) {
        console.log('🏠 DADOS DE HABITAÇÃO sendo enviados para o banco:');
        console.log('habitacao object:', data.habitacao);
        console.log('temCasaPropriedade:', data.habitacao.temCasaPropriedade);
        console.log('temBanheiro:', data.habitacao.temBanheiro);
        console.log('cisternaNegra:', data.habitacao.cisternaNegra);
        console.log('saneamento:', data.habitacao.saneamento);
      }
      
      const result = await savePartialMultiStepFormData({ ...defaultFormData, ...data } as MultiStepFormData, userId, isUpdate, recordUuid || undefined);
      
      if (result.success) {
        if (!isUpdate) {
          setHasExistingRecord(true);
        }
        console.log('Dados salvos automaticamente no banco');
        
        // NOVO: Atualizar contador de etapas completas no banco
        try {
          const etapasCompletas = completedSteps.size + (completedSteps.has(currentStep) ? 0 : 1); // +1 se a etapa atual ainda não foi marcada
          console.log('📊 Atualizando contador de etapas:', { etapasCompletas, totalSteps, currentStep, completedSteps: Array.from(completedSteps) });
          
          const { error: updateError } = await supabase
            .from('questionario_multistep')
            .update({ 
              etapas_completas: etapasCompletas,
              total_etapas: totalSteps
            })
            .eq('user_id', userId);
            
          if (updateError) {
            console.warn('Erro ao atualizar contador de etapas:', updateError);
          } else {
            console.log('✅ Contador de etapas atualizado com sucesso');
          }
        } catch (counterError) {
          console.warn('Erro ao atualizar contador de etapas:', counterError);
        }
        
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
      
      return result; // Retornar o resultado para quem chama a função
    } catch (error) {
      console.error('Erro inesperado ao salvar no banco:', error);
      return { success: false, error: 'Erro inesperado ao salvar os dados' };
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

  const handleNext = useCallback(async () => {
    if (currentStep < totalSteps) {
      // Salvar dados da etapa atual antes de avançar
      const currentStepData = formData[getStepKey(currentStep)];
      if (currentStepData && Object.keys(currentStepData).length > 0) {
        console.log('💾 AUTO-SAVE: Salvando dados da etapa atual antes de avançar');
        console.log('💾 Dados da etapa:', currentStepData);
        
        // Mostrar indicador de salvamento
        setIsSaving(true);
        try {
          await saveToDatabase(formData, hasExistingRecord);
          toast({
            title: "Dados salvos automaticamente",
            description: "As informações da etapa atual foram salvas.",
          });
        } catch (error) {
          console.error('Erro ao salvar automaticamente:', error);
          toast({
            title: "Erro ao salvar",
            description: "Houve um problema ao salvar os dados. Tente usar o botão 'Salvar informações'.",
            variant: "destructive"
          });
        } finally {
          setIsSaving(false);
        }
      }
      
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      saveToStorage('currentStep', nextStep);
    }
  }, [currentStep, totalSteps, saveToStorage, formData, getStepKey, saveToDatabase, hasExistingRecord, toast, setIsSaving]);

  // Função específica para avançar sem auto-save (usada pelo handleStepComplete)
  const handleNextWithoutSave = useCallback(() => {
    if (currentStep < totalSteps) {
      console.log('➡️ Avançando para próxima etapa sem auto-save');
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
    
    // Log detalhado para debug
    console.log('🔍 DEBUG STEP COMPLETE:');
    console.log('currentStep:', currentStep);
    console.log('stepKey:', stepKey);
    console.log('stepData recebido:', stepData);
    console.log('formData atual antes da atualização:', formData[stepKey]);
    
    const updatedFormData = {
      ...formData,
      [stepKey]: { ...formData[stepKey as keyof MultiStepFormData], ...stepData }
    };
    
    // Log detalhado após atualização
    console.log('formData atualizado após merge:', updatedFormData[stepKey]);
    console.log('Dados completos que serão salvos:', updatedFormData);
    
    setFormData(updatedFormData);
    
    // Marcar etapa como completa
    const newCompletedSteps = new Set([...completedSteps, currentStep]);
    setCompletedSteps(newCompletedSteps);
    
    // Salvar no localStorage
    saveToStorage('formData', updatedFormData);
    saveToStorage('completedSteps', Array.from(newCompletedSteps));
    
    // 🔍 LOGGING ABRANGENTE PARA TODAS AS ETAPAS
    const stepNames = {
      1: 'ENTIDADE',
      2: 'DIRIGENTE', 
      3: 'PROPRIETÁRIO',
      4: 'DOCUMENTAÇÃO',
      5: 'RENDA',
      6: 'SAÚDE',
      7: 'PROPRIEDADE',
      8: 'INFRAESTRUTURA',
      9: 'PRODUÇÃO',
      10: 'COMUNICAÇÃO',
      11: 'HABITAÇÃO',
      12: 'FAMÍLIA'
    };
    
    console.log(`🚀 STEP ${currentStep} (${stepNames[currentStep]}) - DEBUG COMPLETO:`);

    // LOGGING ESPECÍFICO PARA STEP 5 (RENDA)
    if (currentStep === 5) {
      console.log('💰 STEP 5 (RENDA) - DEBUG ESPECÍFICO:');
      console.log('💰 Dados de renda recebidos:', stepData);
      console.log('💰 Dados de renda no formData atualizado:', updatedFormData.renda);
      console.log('💰 Estrutura completa do updatedFormData:', updatedFormData);
    }

    // 📡 LOGGING ESPECÍFICO PARA STEP 10 (COMUNICAÇÃO)
    if (currentStep === 10) {
      console.log('📡 STEP 10 (COMUNICAÇÃO) - DEBUG ESPECÍFICO:');
      console.log('📡 Dados de comunicação recebidos:', stepData);
      console.log('📡 Dados de comunicação no formData atualizado:', updatedFormData.comunicacao);
      console.log('📡 Estrutura completa do updatedFormData:', updatedFormData);
    }

    // 🏠 LOGGING ESPECÍFICO PARA STEP 11 (HABITAÇÃO)
    if (currentStep === 11) {
      console.log('🏠 STEP 11 (HABITAÇÃO) - DEBUG ESPECÍFICO:');
      console.log('🏠 Dados de habitação recebidos:', stepData);
      console.log('🏠 Dados de habitação no formData atualizado:', updatedFormData.habitacao);
      console.log('🏠 Estrutura completa do updatedFormData:', updatedFormData);
    }

    // Salvar automaticamente no banco (isso vai atualizar os contadores também)
    try {
      console.log(`� STEP ${currentStep} (${stepNames[currentStep]}) - Iniciando salvamento no banco...`);
      
      const result = await saveToDatabase(updatedFormData, hasExistingRecord);
      
      if (result.success) {
        console.log(`✅ STEP ${currentStep} (${stepNames[currentStep]}) - Dados salvos com sucesso no banco`);
      } else {
        console.error(`❌ STEP ${currentStep} (${stepNames[currentStep]}) - Erro específico:`, result.error);
        toast({
          title: "Erro ao salvar dados",
          description: result.error || "Houve um problema ao salvar os dados. Tente novamente.",
          variant: "destructive"
        });
        return; // Para aqui e não avança para próxima etapa
      }
    } catch (error) {
      console.error(`❌ STEP ${currentStep} (${stepNames[currentStep]}) - Erro de exceção:`, error);
      toast({
        title: "Erro ao salvar dados",
        description: "Houve um problema ao salvar os dados. Tente novamente.",
        variant: "destructive"
      });
      return; // Para aqui e não avança para próxima etapa
    }
    
    // Auto-avançar para próxima etapa (sem auto-save pois já salvamos)
    if (currentStep < totalSteps) {
      handleNextWithoutSave();
    }
  }, [currentStep, formData, completedSteps, getStepKey, saveToStorage, totalSteps, handleNextWithoutSave, saveToDatabase, hasExistingRecord]);

    // Função para salvar dados no banco sem avançar
  const handleSaveData = useCallback(async (stepData?: any) => {
    console.log('💾 BOTÃO SALVAR CLICADO - handleSaveData chamado');
    console.log('💾 currentStep:', currentStep);
    console.log('💾 Dados atuais do formData:', formData);
    console.log('💾 Dados da etapa atual:', formData[getStepKey(currentStep)]);
    console.log('💾 Dados recebidos do componente:', stepData);
    
    let dataToSave = formData;
    
    // Se recebeu dados da etapa atual, mesclar com o formData
    if (stepData) {
      const stepKey = getStepKey(currentStep);
      dataToSave = {
        ...formData,
        [stepKey]: { ...formData[stepKey as keyof MultiStepFormData], ...stepData }
      };
      console.log('💾 stepKey:', stepKey);
      console.log('💾 Dados mesclados para salvar:', dataToSave);
      console.log('💾 Dados específicos da etapa:', dataToSave[stepKey]);
      
      // IMPORTANTE: Atualizar o estado global do formulário
      setFormData(dataToSave);
      
      // Salvar no localStorage também
      saveToStorage('formData', dataToSave);
      
      console.log('💾 Estado global do formulário atualizado com os dados da etapa atual');
    }
    
    try {
      const result = await saveToDatabase(dataToSave, hasExistingRecord);
      if (result && result.success) {
        console.log('✅ Dados salvos no banco com sucesso via handleSaveData');
        toast({
          title: "Dados salvos",
          description: "As informações foram salvas com sucesso.",
        });
      } else {
        console.error('❌ Erro ao salvar dados via handleSaveData:', result?.error);
        toast({
          title: "Erro ao salvar",
          description: result?.error || "Houve um problema ao salvar os dados. Tente novamente.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('❌ Erro inesperado ao salvar dados via handleSaveData:', error);
      toast({
        title: "Erro ao salvar",
        description: "Houve um problema ao salvar os dados. Tente novamente.",
        variant: "destructive"
      });
    }
  }, [formData, saveToDatabase, hasExistingRecord, getStepKey, currentStep, saveToStorage, toast]);

  const handleFinalSubmit = useCallback(async () => {
    setIsFinishing(true);
    try {
      console.log('Dados completos do formulário:', formData);
      
      // Primeiro, salvar/atualizar dados na tabela questionario_multistep como completo
      const questionarioData = { ...defaultFormData, ...formData } as MultiStepFormData;
      const questionarioResult = await savePartialMultiStepFormData(questionarioData, userId, true, recordUuid);
      
      if (questionarioResult.success) {
        // Marcar como completo na tabela questionario_multistep
        const { error: updateError } = await supabase
          .from('questionario_multistep')
          .update({ 
            status_completo: true,
            etapas_completas: totalSteps,
            total_etapas: totalSteps
          })
          .eq('user_id', userId);
          
        if (updateError) {
          console.warn('Erro ao marcar questionário como completo:', updateError);
        }
        
        // Também salvar na tabela cadastro_inicial para compatibilidade
        const cadastroResult = await saveMultiStepFormData(questionarioData, userId, recordUuid || undefined);
        
        if (cadastroResult.success) {
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
          console.error('Erro ao salvar no cadastro_inicial:', cadastroResult.error);
          toast({
            title: "Formulário salvo parcialmente",
            description: "O questionário foi salvo, mas houve um problema com o backup. Seus dados estão seguros.",
          });
          onSuccess?.(formData);
        }
      } else {
        console.error('Erro ao salvar no questionario_multistep:', questionarioResult.error);
        
        // Diferentes tipos de mensagens baseadas no erro
        let errorTitle = "Erro ao enviar dados";
        let errorDescription = questionarioResult.error || "Tente novamente em alguns instantes.";
        
        if (questionarioResult.error?.includes('CPF já foi cadastrado')) {
          errorTitle = "CPF já cadastrado";
          errorDescription = questionarioResult.error;
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
    } finally {
      setIsFinishing(false);
      setShowFinalConfirmation(false);
    }
  }, [formData, getStorageKey, userId, toast, onSuccess, recordUuid, totalSteps]);

  // Função para lidar com o clique no botão "Finalizar Questionário"
  const handleFinishQuestionnaire = useCallback(() => {
    setShowFinishConfirmation(true);
  }, []);

  // Função para confirmar a finalização
  const handleConfirmFinish = useCallback(() => {
    setShowFinishConfirmation(false);
    setShowFinalConfirmation(true);
  }, []);

  // Função para lidar com o clique no botão "Finalizar" da última etapa
  const handleLastStepFinish = useCallback(() => {
    setShowFinalConfirmation(true);
  }, []);

  // Memoizar dados do passo atual para evitar re-renders
  const currentStepData = useMemo(() => STEPS.find(step => step.id === currentStep), [currentStep]);
  const StepComponent = currentStepData?.component;

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
            {/* Dashboard Header */}
      {showDashboardHeader && (
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center py-4 md:h-16 space-y-4 md:space-y-0">
              <div className="flex items-center flex-shrink-0 min-w-0">
                <img 
                  src="/uniagro-logo.png" 
                  alt="Uniagro" 
                  className="header-logo mr-3"
                />
                <h1 className="text-lg md:text-xl font-semibold text-gray-900 truncate">Dashboard - Questionário</h1>
              </div>
              
              <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
                <div className="flex items-center space-x-4 md:space-x-6">
                  {userInfo && (
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full">
                        <User className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{userInfo.name}</p>
                        {userInfo.email && (
                          <p className="text-xs text-gray-500">{userInfo.email}</p>
                        )}
                      </div>
                    </div>
                  )}
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
      
      <div className="py-4 md:py-8 px-2 md:px-4 max-w-full overflow-x-hidden">
        <div className="max-w-7xl mx-auto">
          {/* Botão Voltar */}
          {onBack && (
            <div className="mb-4 md:mb-6">
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  onBack?.();
                }}
                className="text-green-600 hover:text-green-700 hover:bg-green-50"
                size={isMobile ? "sm" : "default"}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                <span>Voltar</span>
              </Button>
            </div>
          )}

          {/* Progress Bar */}
          <Card className="mb-4 md:mb-8 mx-2 md:mx-0">
            <CardHeader className="pb-3 md:pb-6">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-2">
                <CardTitle className="text-base md:text-lg mb-2 md:mb-0">
                  Questionário de Cadastro Completo
                </CardTitle>
                <span className="text-xs md:text-sm text-gray-500">
                  {completedSteps.size} de {totalSteps} etapas completas ({Math.round(progress)}%)
                </span>
              </div>
              <Progress value={progress} className="w-full" />
            </CardHeader>
          </Card>

          {/* Botão do Menu Mobile */}
          {isMobile && (
            <div className="mb-4 mx-2">
              <Button
                variant="outline"
                onClick={() => setIsSidebarOpen(true)}
                className="w-full flex items-center justify-center space-x-2"
              >
                <Menu className="h-4 w-4" />
                <span>Ver Etapas do Questionário</span>
              </Button>
            </div>
          )}

          {/* Layout com Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-8">
            {/* Sidebar - Lista de Etapas */}
            {!isMobile && (
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
                    
                    {/* Botão Finalizar Questionário */}
                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <Button
                        onClick={handleFinishQuestionnaire}
                        className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                        disabled={isFinishing}
                      >
                        <CheckSquare className="h-4 w-4 mr-2" />
                        {isFinishing ? 'Finalizando...' : 'Finalizar Questionário'}
                      </Button>
                      <p className="text-xs text-gray-500 mt-2 text-center">
                        Conclua o questionário a qualquer momento
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Sidebar Mobile - Overlay */}
            {isMobile && isSidebarOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
                <div className="fixed inset-y-0 left-0 w-80 max-w-[85vw] bg-white overflow-y-auto">
                  <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-lg font-semibold">Etapas do Questionário</h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsSidebarOpen(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="p-4">
                    <div className="space-y-2 mb-6">
                      {STEPS.map((step) => {
                        const isCompleted = isStepCompleted(step.id);
                        const isAccessible = isStepAccessible(step.id);
                        const isCurrent = currentStep === step.id;
                        
                        return (
                          <button
                            key={step.id}
                            onClick={() => {
                              navigateToStep(step.id);
                              setIsSidebarOpen(false);
                            }}
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
                    
                    {/* Botão Finalizar Questionário */}
                    <div className="pt-4 border-t border-gray-200">
                      <Button
                        onClick={() => {
                          handleFinishQuestionnaire();
                          setIsSidebarOpen(false);
                        }}
                        className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                        disabled={isFinishing}
                      >
                        <CheckSquare className="h-4 w-4 mr-2" />
                        {isFinishing ? 'Finalizando...' : 'Finalizar Questionário'}
                      </Button>
                      <p className="text-xs text-gray-500 mt-2 text-center">
                        Conclua o questionário a qualquer momento
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Conteúdo Principal */}
            <div className="lg:col-span-3 px-2 md:px-0">
              <Card className="w-full max-w-full">
                <CardContent className="p-4 md:p-8 overflow-x-auto">
              {StepComponent ? (
                <StepComponent
                  data={formData[getStepKey(currentStep)] as any || {}}
                  onNext={handleStepComplete}
                  onPrevious={handlePrevious}
                  onSave={handleSaveData}
                  onFinish={handleLastStepFinish}
                  isFirst={currentStep === 1}
                  isLast={currentStep === totalSteps}
                  userId={userId} // Adicionar userId para upload de documentos
                />
              ) : (
                <div className="text-center py-8 md:py-12">
                  <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-4">
                    {currentStepData?.title}
                  </h3>
                  <p className="text-gray-600 mb-2">
                    {currentStepData?.description}
                  </p>
                  <p className="text-gray-500 mb-6 md:mb-8">
                    Esta etapa está sendo desenvolvida. Por enquanto, você pode marcar como concluída e prosseguir.
                  </p>
                  
                  <div className="flex flex-col md:flex-row md:justify-between space-y-4 md:space-y-0">
                    <Button
                      variant="outline"
                      onClick={handlePrevious}
                      disabled={currentStep === 1}
                      size={isMobile ? "default" : "default"}
                      className="w-full md:w-auto"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Anterior
                    </Button>
                    
                    <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
                      <Button
                        variant="outline"
                        onClick={() => {
                          const newCompletedSteps = new Set([...completedSteps, currentStep]);
                          setCompletedSteps(newCompletedSteps);
                          saveToStorage('completedSteps', Array.from(newCompletedSteps));
                        }}
                        disabled={isStepCompleted(currentStep)}
                        size={isMobile ? "default" : "default"}
                        className="w-full md:w-auto"
                      >
                        {isStepCompleted(currentStep) ? 'Concluída' : 'Marcar como Concluída'}
                      </Button>
                      
                      <Button
                        variant="outline"
                        onClick={handleSaveData}
                        disabled={isSaving}
                        className="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200 w-full md:w-auto"
                        size={isMobile ? "default" : "default"}
                      >
                        <Save className="h-4 w-4 mr-2" />
                        {isSaving ? 'Salvando...' : 'Salvar informações'}
                      </Button>
                      
                      {currentStep === totalSteps ? (
                        <Button 
                          onClick={handleFinalSubmit} 
                          className="bg-green-600 hover:bg-green-700 w-full md:w-auto"
                          size={isMobile ? "default" : "default"}
                        >
                          Finalizar Questionário
                        </Button>
                      ) : (
                        <Button 
                          onClick={handleNext} 
                          className="bg-green-600 hover:bg-green-700 w-full md:w-auto"
                          size={isMobile ? "default" : "default"}
                        >
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

      {/* Diálogos de Confirmação */}
      <ConfirmationDialog
        isOpen={showFinishConfirmation}
        onClose={() => setShowFinishConfirmation(false)}
        onConfirm={handleConfirmFinish}
        title="Finalizar Questionário"
        description="Você tem certeza que deseja finalizar o questionário? Todas as informações preenchidas serão salvas e o questionário será concluído."
        confirmText="Sim, Finalizar"
        cancelText="Cancelar"
        variant="warning"
      />

      <ConfirmationDialog
        isOpen={showFinalConfirmation}
        onClose={() => setShowFinalConfirmation(false)}
        onConfirm={handleFinalSubmit}
        title="Confirmar Finalização"
        description="Por favor, confirme que todas as informações estão corretas e que você deseja finalizar o questionário. Após a confirmação, os dados serão salvos permanentemente."
        confirmText="Sim, Confirmar e Finalizar"
        cancelText="Revisar Informações"
        variant="success"
        isLoading={isFinishing}
      />
    </div>
  );
};
