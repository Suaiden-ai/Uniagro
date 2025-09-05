import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
            <Select
              value={formData.temDeficiencia ? 'sim' : 'nao'}
              onValueChange={(value) => updateFormData('temDeficiencia', value === 'sim')}
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
            <Select
              value={formData.temCromoidade ? 'sim' : 'nao'}
              onValueChange={(value) => updateFormData('temCromoidade', value === 'sim')}
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
            <Select
              value={formData.fazTratamento ? 'sim' : 'nao'}
              onValueChange={(value) => updateFormData('fazTratamento', value === 'sim')}
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
            <Select
              value={formData.tomaMedicacaoControlada ? 'sim' : 'nao'}
              onValueChange={(value) => updateFormData('tomaMedicacaoControlada', value === 'sim')}
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
