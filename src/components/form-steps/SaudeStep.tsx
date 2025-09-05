import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MobileSelect, MobileSelectContent, MobileSelectItem, MobileSelectTrigger, MobileSelectValue } from '@/components/ui/mobile-select';
import { useIsMobile } from '@/hooks/use-mobile';
import { ArrowLeft, ArrowRight, Save } from 'lucide-react';

interface SaudeData {
  temDeficiencia: boolean;
  qualDeficiencia: string;
  temCromoidade: boolean;
  qualCromoidade: string;
  fazTratamento: boolean;
  qualTratamento: string;
  tomaMedicacaoControlada: boolean;
  qualMedicacao: string;
}

interface SaudeStepProps {
  data: Partial<SaudeData>;
  onNext: (data: SaudeData) => void;
  onPrevious: () => void;
  onSave?: (data: SaudeData) => void;
  isFirst: boolean;
  isLast: boolean;
}

export const SaudeStep = ({ data, onNext, onPrevious, onSave, isFirst }: SaudeStepProps) => {
  const isMobile = useIsMobile();
  const [formData, setFormData] = useState<SaudeData>({
    temDeficiencia: data.temDeficiencia || false,
    qualDeficiencia: data.qualDeficiencia || '',
    temCromoidade: data.temCromoidade || false,
    qualCromoidade: data.qualCromoidade || '',
    fazTratamento: data.fazTratamento || false,
    qualTratamento: data.qualTratamento || '',
    tomaMedicacaoControlada: data.tomaMedicacaoControlada || false,
    qualMedicacao: data.qualMedicacao || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateFormData = (field: keyof SaudeData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpar erro do campo ao digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const renderSelect = (field: keyof SaudeData, options: Array<{value: string, label: string}>, placeholder: string, value: string) => {
    if (isMobile) {
      return (
        <MobileSelect value={value} onValueChange={(newValue) => {
          if (field === 'temDeficiencia') {
            updateFormData(field, newValue === 'sim');
          } else if (field === 'temCromoidade') {
            updateFormData(field, newValue === 'sim');
          } else if (field === 'fazTratamento') {
            updateFormData(field, newValue === 'sim');
          } else if (field === 'tomaMedicacaoControlada') {
            updateFormData(field, newValue === 'sim');
          }
        }}>
          <MobileSelectTrigger>
            <MobileSelectValue placeholder={placeholder} />
          </MobileSelectTrigger>
          <MobileSelectContent>
            {options.map((option) => (
              <MobileSelectItem key={option.value} value={option.value}>
                {option.label}
              </MobileSelectItem>
            ))}
          </MobileSelectContent>
        </MobileSelect>
      );
    }

    return (
      <Select value={value} onValueChange={(newValue) => {
        if (field === 'temDeficiencia') {
          updateFormData(field, newValue === 'sim');
        } else if (field === 'temCromoidade') {
          updateFormData(field, newValue === 'sim');
        } else if (field === 'fazTratamento') {
          updateFormData(field, newValue === 'sim');
        } else if (field === 'tomaMedicacaoControlada') {
          updateFormData(field, newValue === 'sim');
        }
      }}>
        <SelectTrigger className="mobile-select-trigger mt-2 h-12">
          <SelectValue placeholder={placeholder} className="mobile-select-placeholder" />
        </SelectTrigger>
        <SelectContent className="mobile-select-content">
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value} className="mobile-select-item">
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validações condicionais
    if (formData.temDeficiencia && !formData.qualDeficiencia.trim()) {
      newErrors.qualDeficiencia = 'Especifique qual deficiência';
    }

    if (formData.temCromoidade && !formData.qualCromoidade.trim()) {
      newErrors.qualCromoidade = 'Especifique qual cromoidade';
    }

    if (formData.fazTratamento && !formData.qualTratamento.trim()) {
      newErrors.qualTratamento = 'Especifique qual tratamento';
    }

    if (formData.tomaMedicacaoControlada && !formData.qualMedicacao.trim()) {
      newErrors.qualMedicacao = 'Especifique qual medicação';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      onNext(formData);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Saúde</h2>
        <p className="text-gray-600 mt-2">
          Informações sobre sua situação de saúde
        </p>
      </div>

      <div className="space-y-8">
        {/* Deficiência */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Deficiência</h3>
          
          <div>
            <Label className="text-base font-semibold">Possui deficiência?</Label>
            {renderSelect(
              'temDeficiencia',
              [
                { value: 'sim', label: 'Sim' },
                { value: 'nao', label: 'Não' }
              ],
              'Selecione uma opção',
              formData.temDeficiencia ? 'sim' : 'nao'
            )}
          </div>

          {formData.temDeficiencia && (
            <div>
              <Label htmlFor="qualDeficiencia" className="text-base font-semibold">
                Qual deficiência?
              </Label>
              <Input
                id="qualDeficiencia"
                value={formData.qualDeficiencia}
                onChange={(e) => updateFormData('qualDeficiencia', e.target.value)}
                placeholder="Descreva a deficiência"
                className="mt-2 h-12"
              />
              {errors.qualDeficiencia && <p className="text-red-600 text-sm mt-1">{errors.qualDeficiencia}</p>}
            </div>
          )}
        </div>

        {/* Cromoidade */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Cromoidade</h3>
          
          <div>
            <Label className="text-base font-semibold">Possui cromoidade?</Label>
            {renderSelect(
              'temCromoidade',
              [
                { value: 'sim', label: 'Sim' },
                { value: 'nao', label: 'Não' }
              ],
              'Selecione uma opção',
              formData.temCromoidade ? 'sim' : 'nao'
            )}
          </div>

          {formData.temCromoidade && (
            <div>
              <Label htmlFor="qualCromoidade" className="text-base font-semibold">
                Qual cromoidade?
              </Label>
              <Input
                id="qualCromoidade"
                value={formData.qualCromoidade}
                onChange={(e) => updateFormData('qualCromoidade', e.target.value)}
                placeholder="Descreva a cromoidade"
                className="mt-2 h-12"
              />
              {errors.qualCromoidade && <p className="text-red-600 text-sm mt-1">{errors.qualCromoidade}</p>}
            </div>
          )}
        </div>

        {/* Tratamento */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Tratamento</h3>
          
          <div>
            <Label className="text-base font-semibold">Faz tratamento?</Label>
            {renderSelect(
              'fazTratamento',
              [
                { value: 'sim', label: 'Sim' },
                { value: 'nao', label: 'Não' }
              ],
              'Selecione uma opção',
              formData.fazTratamento ? 'sim' : 'nao'
            )}
          </div>

          {formData.fazTratamento && (
            <div>
              <Label htmlFor="qualTratamento" className="text-base font-semibold">
                Qual tratamento?
              </Label>
              <Input
                id="qualTratamento"
                value={formData.qualTratamento}
                onChange={(e) => updateFormData('qualTratamento', e.target.value)}
                placeholder="Descreva o tratamento"
                className="mt-2 h-12"
              />
              {errors.qualTratamento && <p className="text-red-600 text-sm mt-1">{errors.qualTratamento}</p>}
            </div>
          )}
        </div>

        {/* Medicação Controlada */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Medicação Controlada</h3>
          
          <div>
            <Label className="text-base font-semibold">Toma medicação controlada?</Label>
            {renderSelect(
              'tomaMedicacaoControlada',
              [
                { value: 'sim', label: 'Sim' },
                { value: 'nao', label: 'Não' }
              ],
              'Selecione uma opção',
              formData.tomaMedicacaoControlada ? 'sim' : 'nao'
            )}
          </div>

          {formData.tomaMedicacaoControlada && (
            <div>
              <Label htmlFor="qualMedicacao" className="text-base font-semibold">
                Qual medicação?
              </Label>
              <Input
                id="qualMedicacao"
                value={formData.qualMedicacao}
                onChange={(e) => updateFormData('qualMedicacao', e.target.value)}
                placeholder="Nome da medicação"
                className="mt-2 h-12"
              />
              {errors.qualMedicacao && <p className="text-red-600 text-sm mt-1">{errors.qualMedicacao}</p>}
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
              onClick={() => {
                console.log('💾 BOTÃO SALVAR CLICADO no SaudeStep');
                console.log('💾 Dados atuais que serão enviados:', formData);
                onSave(formData);
              }}
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
