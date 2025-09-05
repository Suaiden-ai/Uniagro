import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MobileSelect, MobileSelectContent, MobileSelectItem, MobileSelectTrigger, MobileSelectValue } from '@/components/ui/mobile-select';
import { useIsMobile } from '@/hooks/use-mobile';
import { ArrowLeft, ArrowRight, Save } from 'lucide-react';

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
  onSave?: (data: ComunicacaoData) => void;
  isFirst: boolean;
  isLast: boolean;
}

export const ComunicacaoStep = ({ data, onNext, onPrevious, onSave, isFirst }: ComunicacaoStepProps) => {
  const isMobile = useIsMobile();
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

  const renderSelect = (field: keyof ComunicacaoData, options: Array<{value: string, label: string}>, placeholder: string, value: string) => {
    if (isMobile) {
      return (
        <MobileSelect value={value} onValueChange={(newValue) => {
          if (field === 'temSinalCelular') {
            updateFormData(field, newValue === 'sim');
          } else if (field === 'temSinalInternet') {
            updateFormData(field, newValue === 'sim');
          } else if (field === 'temSinalRadio') {
            updateFormData(field, newValue === 'sim');
          } else if (field === 'temSinalTV') {
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
        if (field === 'temSinalCelular') {
          updateFormData(field, newValue === 'sim');
        } else if (field === 'temSinalInternet') {
          updateFormData(field, newValue === 'sim');
        } else if (field === 'temSinalRadio') {
          updateFormData(field, newValue === 'sim');
        } else if (field === 'temSinalTV') {
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
    console.log('📡 ComunicacaoStep - handleNext chamado');
    console.log('📡 Dados do formulário:', formData);
    
    if (validateForm()) {
      console.log('📡 Validação passou - chamando onNext com:', formData);
      onNext(formData);
    } else {
      console.log('📡 Validação falhou:', errors);
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
            {renderSelect(
              'temSinalCelular',
              [
                { value: 'sim', label: 'Sim' },
                { value: 'nao', label: 'Não' }
              ],
              'Selecione uma opção',
              formData.temSinalCelular ? 'sim' : 'nao'
            )}
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
            {renderSelect(
              'temSinalInternet',
              [
                { value: 'sim', label: 'Sim' },
                { value: 'nao', label: 'Não' }
              ],
              'Selecione uma opção',
              formData.temSinalInternet ? 'sim' : 'nao'
            )}
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
            {renderSelect(
              'temSinalRadio',
              [
                { value: 'sim', label: 'Sim' },
                { value: 'nao', label: 'Não' }
              ],
              'Selecione uma opção',
              formData.temSinalRadio ? 'sim' : 'nao'
            )}
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
            {renderSelect(
              'temSinalTV',
              [
                { value: 'sim', label: 'Sim' },
                { value: 'nao', label: 'Não' }
              ],
              'Selecione uma opção',
              formData.temSinalTV ? 'sim' : 'nao'
            )}
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

        <div className="flex space-x-4">
          {onSave && (
            <Button
              variant="outline"
              onClick={() => {
                console.log('💾 BOTÃO SALVAR CLICADO no ComunicacaoStep');
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
