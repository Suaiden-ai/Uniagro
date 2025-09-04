import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface ComunicacaoData {
  temSinalCelular: boolean;
  operadoraCelular: string;
  temSinalInternet: boolean;
  operadoraInternet: string;
  temSinalRadio: boolean;
  qualRadio: string;
  programaRadioPreferido: string;
  temSinalTV: boolean;
  qualTV: string;
  programaTVPreferido: string;
}

interface ComunicacaoStepProps {
  data: Partial<ComunicacaoData>;
  onNext: (data: ComunicacaoData) => void;
  onPrevious: () => void;
  isFirst: boolean;
  isLast: boolean;
}

export const ComunicacaoStep = ({ data, onNext, onPrevious, isFirst }: ComunicacaoStepProps) => {
  const [formData, setFormData] = useState<ComunicacaoData>({
    temSinalCelular: data.temSinalCelular || false,
    operadoraCelular: data.operadoraCelular || '',
    temSinalInternet: data.temSinalInternet || false,
    operadoraInternet: data.operadoraInternet || '',
    temSinalRadio: data.temSinalRadio || false,
    qualRadio: data.qualRadio || '',
    programaRadioPreferido: data.programaRadioPreferido || '',
    temSinalTV: data.temSinalTV || false,
    qualTV: data.qualTV || '',
    programaTVPreferido: data.programaTVPreferido || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateFormData = (field: keyof ComunicacaoData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpar erro do campo ao digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validações condicionais
    if (formData.temSinalCelular && !formData.operadoraCelular.trim()) {
      newErrors.operadoraCelular = 'Especifique a operadora de celular';
    }

    if (formData.temSinalInternet && !formData.operadoraInternet.trim()) {
      newErrors.operadoraInternet = 'Especifique a operadora de internet';
    }

    if (formData.temSinalRadio && !formData.qualRadio.trim()) {
      newErrors.qualRadio = 'Especifique qual rádio';
    }

    if (formData.temSinalTV && !formData.qualTV.trim()) {
      newErrors.qualTV = 'Especifique qual TV';
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
        <h2 className="text-2xl font-bold text-gray-900">Comunicação</h2>
        <p className="text-gray-600 mt-2">
          Internet, TV, rádio e sinal de celular
        </p>
      </div>

      <div className="space-y-8">
        {/* Sinal de Celular */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Sinal de Celular</h3>
          
          <div>
            <Label className="text-base font-semibold">Tem sinal de celular?</Label>
            <Select
              value={formData.temSinalCelular ? 'sim' : 'nao'}
              onValueChange={(value) => updateFormData('temSinalCelular', value === 'sim')}
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

          {formData.temSinalCelular && (
            <div>
              <Label htmlFor="operadoraCelular" className="text-base font-semibold">
                Qual operadora?
              </Label>
              <Input
                id="operadoraCelular"
                value={formData.operadoraCelular}
                onChange={(e) => updateFormData('operadoraCelular', e.target.value)}
                placeholder="Ex: Vivo, Claro, Tim"
                className="mt-2 h-12"
              />
              {errors.operadoraCelular && <p className="text-red-600 text-sm mt-1">{errors.operadoraCelular}</p>}
            </div>
          )}
        </div>

        {/* Sinal de Internet */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Sinal de Internet</h3>
          
          <div>
            <Label className="text-base font-semibold">Tem sinal de internet?</Label>
            <Select
              value={formData.temSinalInternet ? 'sim' : 'nao'}
              onValueChange={(value) => updateFormData('temSinalInternet', value === 'sim')}
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

          {formData.temSinalInternet && (
            <div>
              <Label htmlFor="operadoraInternet" className="text-base font-semibold">
                Qual operadora?
              </Label>
              <Input
                id="operadoraInternet"
                value={formData.operadoraInternet}
                onChange={(e) => updateFormData('operadoraInternet', e.target.value)}
                placeholder="Ex: Vivo, Claro, Tim, Oi"
                className="mt-2 h-12"
              />
              {errors.operadoraInternet && <p className="text-red-600 text-sm mt-1">{errors.operadoraInternet}</p>}
            </div>
          )}
        </div>

        {/* Sinal de Rádio */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Sinal de Rádio</h3>
          
          <div>
            <Label className="text-base font-semibold">Tem sinal de rádio?</Label>
            <Select
              value={formData.temSinalRadio ? 'sim' : 'nao'}
              onValueChange={(value) => updateFormData('temSinalRadio', value === 'sim')}
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

          {formData.temSinalRadio && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="qualRadio" className="text-base font-semibold">
                  Qual rádio?
                </Label>
                <Input
                  id="qualRadio"
                  value={formData.qualRadio}
                  onChange={(e) => updateFormData('qualRadio', e.target.value)}
                  placeholder="Ex: Rádio Nacional, Rádio Globo"
                  className="mt-2 h-12"
                />
                {errors.qualRadio && <p className="text-red-600 text-sm mt-1">{errors.qualRadio}</p>}
              </div>
              <div>
                <Label htmlFor="programaRadioPreferido" className="text-base font-semibold">
                  Qual programa mais gosta?
                </Label>
                <Input
                  id="programaRadioPreferido"
                  value={formData.programaRadioPreferido}
                  onChange={(e) => updateFormData('programaRadioPreferido', e.target.value)}
                  placeholder="Ex: Jornal da Manhã, Programa do João"
                  className="mt-2 h-12"
                />
              </div>
            </div>
          )}
        </div>

        {/* Sinal de TV */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Sinal de TV</h3>
          
          <div>
            <Label className="text-base font-semibold">Tem sinal de TV?</Label>
            <Select
              value={formData.temSinalTV ? 'sim' : 'nao'}
              onValueChange={(value) => updateFormData('temSinalTV', value === 'sim')}
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

          {formData.temSinalTV && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="qualTV" className="text-base font-semibold">
                  Qual TV?
                </Label>
                <Input
                  id="qualTV"
                  value={formData.qualTV}
                  onChange={(e) => updateFormData('qualTV', e.target.value)}
                  placeholder="Ex: Globo, SBT, Record"
                  className="mt-2 h-12"
                />
                {errors.qualTV && <p className="text-red-600 text-sm mt-1">{errors.qualTV}</p>}
              </div>
              <div>
                <Label htmlFor="programaTVPreferido" className="text-base font-semibold">
                  Qual programa mais gosta?
                </Label>
                <Input
                  id="programaTVPreferido"
                  value={formData.programaTVPreferido}
                  onChange={(e) => updateFormData('programaTVPreferido', e.target.value)}
                  placeholder="Ex: Jornal Nacional, Novelas"
                  className="mt-2 h-12"
                />
              </div>
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

        <Button onClick={handleNext} className="bg-green-600 hover:bg-green-700">
          Próxima
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};
