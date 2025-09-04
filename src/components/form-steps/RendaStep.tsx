import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, ArrowRight, Save } from 'lucide-react';

interface RendaData {
  profissao1: string;
  rendaProfissao1: number;
  profissao2: string;
  rendaProfissao2: number;
  profissao3: string;
  rendaProfissao3: number;
  rendaTotal: number;
  possuiFinanciamentoAtivo: boolean;
  bancoFinanciamento: string;
  temVeiculo: boolean;
  qualVeiculo: string;
  casaPropria: boolean;
  ondeCasaPropria: string;
}

interface RendaStepProps {
  data: Partial<RendaData>;
  onNext: (data: RendaData) => void;
  onPrevious: () => void;
  onSave?: () => void;
  isFirst: boolean;
  isLast: boolean;
}

export const RendaStep = ({ data, onNext, onPrevious, onSave, isFirst }: RendaStepProps) => {
  console.log('🔍 RENDA STEP - Dados recebidos como props:', data);
  
  const [formData, setFormData] = useState<RendaData>({
    profissao1: data.profissao1 || '',
    rendaProfissao1: data.rendaProfissao1 || 0,
    profissao2: data.profissao2 || '',
    rendaProfissao2: data.rendaProfissao2 || 0,
    profissao3: data.profissao3 || '',
    rendaProfissao3: data.rendaProfissao3 || 0,
    rendaTotal: data.rendaTotal || 0,
    possuiFinanciamentoAtivo: data.possuiFinanciamentoAtivo || false,
    bancoFinanciamento: data.bancoFinanciamento || '',
    temVeiculo: data.temVeiculo || false,
    qualVeiculo: data.qualVeiculo || '',
    casaPropria: data.casaPropria || false,
    ondeCasaPropria: data.ondeCasaPropria || '',
  });

  console.log('🔍 RENDA STEP - Estado inicial do formData:', formData);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateFormData = (field: keyof RendaData, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpar erro do campo ao digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const calculateRendaTotal = () => {
    const total = formData.rendaProfissao1 + formData.rendaProfissao2 + formData.rendaProfissao3;
    setFormData(prev => ({ ...prev, rendaTotal: total }));
  };

  // Recalcular renda total sempre que as rendas individuais mudarem
  useEffect(() => {
    calculateRendaTotal();
  }, [formData.rendaProfissao1, formData.rendaProfissao2, formData.rendaProfissao3]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    console.log('🔍 VALIDAÇÃO ETAPA 5 - Dados atuais:', formData);

    if (!formData.profissao1.trim()) {
      newErrors.profissao1 = 'Profissão 1 é obrigatória';
      console.log('❌ Erro: Profissão 1 vazia');
    }

    if (formData.rendaProfissao1 <= 0) {
      newErrors.rendaProfissao1 = 'Renda da profissão 1 deve ser maior que zero';
      console.log('❌ Erro: Renda da profissão 1 inválida:', formData.rendaProfissao1);
    }

    console.log('🔍 Erros encontrados:', newErrors);
    console.log('🔍 Validação passou?', Object.keys(newErrors).length === 0);

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    console.log('🔍 BOTÃO PRÓXIMA CLICADO - handleNext chamado');
    console.log('🔍 Dados atuais do formData:', formData);
    
    if (validateForm()) {
      console.log('✅ Validação passou - enviando dados para onNext');
      console.log('🔍 Dados sendo enviados para onNext:', formData);
      onNext(formData);
    } else {
      console.log('❌ Validação falhou - não enviando dados');
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Renda & Finanças</h2>
        <p className="text-gray-600 mt-2">
          Informações sobre sua situação financeira
        </p>
      </div>

      <div className="space-y-8">
        {/* Profissões e Rendas */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">Profissões e Rendas</h3>
          
          {/* Profissão 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="profissao1" className="text-base font-semibold">
                Profissão 1 *
              </Label>
              <Input
                id="profissao1"
                value={formData.profissao1}
                onChange={(e) => updateFormData('profissao1', e.target.value)}
                placeholder="Ex: Agricultor"
                className="mt-2 h-12"
              />
              {errors.profissao1 && <p className="text-red-600 text-sm mt-1">{errors.profissao1}</p>}
            </div>
            <div>
              <Label htmlFor="rendaProfissao1" className="text-base font-semibold">
                Renda Profissão 1 (R$) *
              </Label>
              <Input
                id="rendaProfissao1"
                type="number"
                value={formData.rendaProfissao1}
                onChange={(e) => {
                  updateFormData('rendaProfissao1', parseFloat(e.target.value) || 0);
                }}
                placeholder="0.00"
                className="mt-2 h-12"
              />
              {errors.rendaProfissao1 && <p className="text-red-600 text-sm mt-1">{errors.rendaProfissao1}</p>}
            </div>
          </div>

          {/* Profissão 2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="profissao2" className="text-base font-semibold">
                Profissão 2
              </Label>
              <Input
                id="profissao2"
                value={formData.profissao2}
                onChange={(e) => updateFormData('profissao2', e.target.value)}
                placeholder="Ex: Motorista"
                className="mt-2 h-12"
              />
            </div>
            <div>
              <Label htmlFor="rendaProfissao2" className="text-base font-semibold">
                Renda Profissão 2 (R$)
              </Label>
              <Input
                id="rendaProfissao2"
                type="number"
                value={formData.rendaProfissao2}
                onChange={(e) => {
                  updateFormData('rendaProfissao2', parseFloat(e.target.value) || 0);
                }}
                placeholder="0.00"
                className="mt-2 h-12"
              />
            </div>
          </div>

          {/* Profissão 3 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="profissao3" className="text-base font-semibold">
                Profissão 3
              </Label>
              <Input
                id="profissao3"
                value={formData.profissao3}
                onChange={(e) => updateFormData('profissao3', e.target.value)}
                placeholder="Ex: Comerciante"
                className="mt-2 h-12"
              />
            </div>
            <div>
              <Label htmlFor="rendaProfissao3" className="text-base font-semibold">
                Renda Profissão 3 (R$)
              </Label>
              <Input
                id="rendaProfissao3"
                type="number"
                value={formData.rendaProfissao3}
                onChange={(e) => {
                  updateFormData('rendaProfissao3', parseFloat(e.target.value) || 0);
                }}
                placeholder="0.00"
                className="mt-2 h-12"
              />
            </div>
          </div>

          {/* Renda Total */}
          <div>
            <Label htmlFor="rendaTotal" className="text-base font-semibold">
              Renda Total (R$)
            </Label>
            <Input
              id="rendaTotal"
              type="number"
              value={formData.rendaTotal}
              readOnly
              className="mt-2 h-12 bg-gray-50"
            />
          </div>
        </div>

        {/* Financiamento */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Financiamento</h3>
          
          <div>
            <Label className="text-base font-semibold">Possui financiamento ativo?</Label>
            <Select
              value={formData.possuiFinanciamentoAtivo ? 'sim' : 'nao'}
              onValueChange={(value) => updateFormData('possuiFinanciamentoAtivo', value === 'sim')}
            >
              <SelectTrigger className="mt-2 h-12">
                <SelectValue placeholder="Selecione uma opção" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sim">Sim</SelectItem>
                <SelectItem value="nao">Não</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.possuiFinanciamentoAtivo && (
            <div>
              <Label htmlFor="bancoFinanciamento" className="text-base font-semibold">
                Qual banco?
              </Label>
              <Input
                id="bancoFinanciamento"
                value={formData.bancoFinanciamento}
                onChange={(e) => updateFormData('bancoFinanciamento', e.target.value)}
                placeholder="Ex: Banco do Brasil"
                className="mt-2 h-12"
              />
            </div>
          )}
        </div>

        {/* Veículo */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Veículo</h3>
          
          <div>
            <Label className="text-base font-semibold">Tem veículo?</Label>
            <Select
              value={formData.temVeiculo ? 'sim' : 'nao'}
              onValueChange={(value) => updateFormData('temVeiculo', value === 'sim')}
            >
              <SelectTrigger className="mt-2 h-12">
                <SelectValue placeholder="Selecione uma opção" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sim">Sim</SelectItem>
                <SelectItem value="nao">Não</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.temVeiculo && (
            <div>
              <Label htmlFor="qualVeiculo" className="text-base font-semibold">
                Qual veículo?
              </Label>
              <Input
                id="qualVeiculo"
                value={formData.qualVeiculo}
                onChange={(e) => updateFormData('qualVeiculo', e.target.value)}
                placeholder="Ex: Carro, Moto, Caminhão"
                className="mt-2 h-12"
              />
            </div>
          )}
        </div>

        {/* Casa Própria */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Casa Própria</h3>
          
          <div>
            <Label className="text-base font-semibold">Casa própria fora da propriedade?</Label>
            <Select
              value={formData.casaPropria ? 'sim' : 'nao'}
              onValueChange={(value) => updateFormData('casaPropria', value === 'sim')}
            >
              <SelectTrigger className="mt-2 h-12">
                <SelectValue placeholder="Selecione uma opção" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sim">Sim</SelectItem>
                <SelectItem value="nao">Não</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.casaPropria && (
            <div>
              <Label htmlFor="ondeCasaPropria" className="text-base font-semibold">
                Onde?
              </Label>
              <Input
                id="ondeCasaPropria"
                value={formData.ondeCasaPropria}
                onChange={(e) => updateFormData('ondeCasaPropria', e.target.value)}
                placeholder="Ex: Centro da cidade"
                className="mt-2 h-12"
              />
            </div>
          )}
        </div>
      </div>

      {/* Botões de navegação */}
      <div className="flex justify-between pt-8">
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={isFirst}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Anterior
        </Button>

        <div className="flex space-x-4">
          {onSave && (
            <Button
              variant="outline"
              onClick={onSave}
              className="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
            >
              <Save className="h-4 w-4 mr-2" />
              Salvar informações
            </Button>
          )}
          
          <Button onClick={handleNext} className="bg-green-600 hover:bg-green-700">
            Próxima
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};
