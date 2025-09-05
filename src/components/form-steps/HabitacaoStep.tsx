import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, ArrowRight, Save } from 'lucide-react';

interface HabitacaoData {
  temCasaPropriedade: boolean;
  temBanheiro: boolean;
  cisternaNegra: boolean;
  saneamento: boolean;
}

interface HabitacaoStepProps {
  data: Partial<HabitacaoData>;
  onNext: (data: HabitacaoData) => void;
  onPrevious: () => void;
  onSave?: (data: HabitacaoData) => void;
  isFirst: boolean;
  isLast: boolean;
}

export const HabitacaoStep = ({ data, onNext, onPrevious, onSave, isFirst }: HabitacaoStepProps) => {
  const [formData, setFormData] = useState<HabitacaoData>({
    temCasaPropriedade: data.temCasaPropriedade || false,
    temBanheiro: data.temBanheiro || false,
    cisternaNegra: data.cisternaNegra || false,
    saneamento: data.saneamento || false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateFormData = (field: keyof HabitacaoData, value: boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpar erro do campo ao digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    // Esta etapa não tem validações obrigatórias
    return true;
  };

  const handleNext = () => {
    console.log('🏠 HabitacaoStep - handleNext chamado');
    console.log('🏠 Dados do formulário:', formData);
    
    if (validateForm()) {
      console.log('🏠 Validação passou - chamando onNext com:', formData);
      onNext(formData);
    } else {
      console.log('🏠 Validação falhou:', errors);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Habitação</h2>
        <p className="text-gray-600 mt-2">
          Informações sobre a habitação na propriedade
        </p>
      </div>

      <div className="space-y-8">
        {/* Casa na Propriedade */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Casa na Propriedade</h3>
          
          <div>
            <Label className="text-base font-semibold">Tem casa na propriedade?</Label>
            <Select
              value={formData.temCasaPropriedade ? 'sim' : 'nao'}
              onValueChange={(value) => updateFormData('temCasaPropriedade', value === 'sim')}
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
        </div>

        {/* Banheiro */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Banheiro</h3>
          
          <div>
            <Label className="text-base font-semibold">Tem banheiro?</Label>
            <Select
              value={formData.temBanheiro ? 'sim' : 'nao'}
              onValueChange={(value) => updateFormData('temBanheiro', value === 'sim')}
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
        </div>

        {/* Cisterna Negra */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Cisterna Negra</h3>
          
          <div>
            <Label className="text-base font-semibold">Tem cisterna negra?</Label>
            <Select
              value={formData.cisternaNegra ? 'sim' : 'nao'}
              onValueChange={(value) => updateFormData('cisternaNegra', value === 'sim')}
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
        </div>

        {/* Saneamento */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Saneamento</h3>
          
          <div>
            <Label className="text-base font-semibold">Tem saneamento?</Label>
            <Select
              value={formData.saneamento ? 'sim' : 'nao'}
              onValueChange={(value) => updateFormData('saneamento', value === 'sim')}
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
                console.log('💾 BOTÃO SALVAR CLICADO no HabitacaoStep');
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
