import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, ArrowRight, Save } from 'lucide-react';

interface PropriedadeData {
  nome: string;
  endereco: string;
  localizacao: string;
}

interface PropriedadeStepProps {
  data: Partial<PropriedadeData>;
  onNext: (data: PropriedadeData) => void;
  onPrevious: () => void;
  onSave?: (data: PropriedadeData) => void;
  isFirst: boolean;
  isLast: boolean;
}

export const PropriedadeStep = ({ data, onNext, onPrevious, onSave, isFirst }: PropriedadeStepProps) => {
  const [formData, setFormData] = useState<PropriedadeData>({
    nome: data.nome || '',
    endereco: data.endereco || '',
    localizacao: data.localizacao || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateFormData = (field: keyof PropriedadeData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpar erro do campo ao digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome da propriedade é obrigatório';
    }

    if (!formData.endereco.trim()) {
      newErrors.endereco = 'Endereço é obrigatório';
    }

    if (!formData.localizacao.trim()) {
      newErrors.localizacao = 'Localização é obrigatória';
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
        <h2 className="text-2xl font-bold text-gray-900">Propriedade Rural</h2>
        <p className="text-gray-600 mt-2">
          Dados da propriedade rural do cadastro
        </p>
      </div>

      <div className="space-y-6">
        {/* Nome da Propriedade */}
        <div>
          <Label htmlFor="nome" className="text-base font-semibold">
            Nome da Propriedade *
          </Label>
          <Input
            id="nome"
            value={formData.nome}
            onChange={(e) => updateFormData('nome', e.target.value)}
            placeholder="Nome da propriedade"
            className="mt-2 h-12"
          />
          {errors.nome && <p className="text-red-600 text-sm mt-1">{errors.nome}</p>}
        </div>

        {/* Endereço */}
        <div>
          <Label htmlFor="endereco" className="text-base font-semibold">
            Endereço *
          </Label>
          <Input
            id="endereco"
            value={formData.endereco}
            onChange={(e) => updateFormData('endereco', e.target.value)}
            placeholder="Endereço completo da propriedade"
            className="mt-2 h-12"
          />
          {errors.endereco && <p className="text-red-600 text-sm mt-1">{errors.endereco}</p>}
        </div>

        {/* Localização */}
        <div>
          <Label htmlFor="localizacao" className="text-base font-semibold">
            Localização *
          </Label>
          <Input
            id="localizacao"
            value={formData.localizacao}
            onChange={(e) => updateFormData('localizacao', e.target.value)}
            placeholder="Cidade, Estado, Região"
            className="mt-2 h-12"
          />
          {errors.localizacao && <p className="text-red-600 text-sm mt-1">{errors.localizacao}</p>}
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
                console.log('💾 BOTÃO SALVAR CLICADO no PropriedadeStep');
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
