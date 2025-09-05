import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MobileSelect, MobileSelectContent, MobileSelectItem, MobileSelectTrigger, MobileSelectValue } from '@/components/ui/mobile-select';
import { useIsMobile } from '@/hooks/use-mobile';
import { ArrowLeft, ArrowRight, Save } from 'lucide-react';

interface InfraestruturaData {
  temReserva: boolean;
  areaReserva: number;
  areaProdutiva: number;
  temEstrada: boolean;
  qualidadeEstrada: 'OTIMA' | 'BOA' | 'REGULAR' | 'RUIM' | 'PESSIMA';
  temEnergia: boolean;
  tipoEnergia: 'MONOFASICO' | 'BIFASICO' | 'TRIFASICO';
  tipoAlternativoEnergia: 'OFFGRID' | 'GERADOR' | 'OUTRO';
  temAgua: boolean;
  tipoAgua: 'POCO' | 'RIO' | 'CORREGO' | 'REPRESA' | 'CACIMBA' | 'PIPA';
  aguaEncanada: boolean;
  tipoSolo: string;
  vegetacao: string;
  possuiGalpao: boolean;
  possuiSilo: boolean;
  reservatorioAgua: boolean;
  energiaFotovoltaica: boolean;
  geracaoFotovoltaica: string;
  sistemaIrrigacao: boolean;
  tipoIrrigacao: 'GOTEJO' | 'PIVO' | 'ASPERSOR';
  areaIrrigada: number;
}

interface InfraestruturaStepProps {
  data: Partial<InfraestruturaData>;
  onNext: (data: InfraestruturaData) => void;
  onPrevious: () => void;
  onSave?: (data: InfraestruturaData) => void;
  isFirst: boolean;
  isLast: boolean;
}

export const InfraestruturaStep = ({ data, onNext, onPrevious, onSave, isFirst }: InfraestruturaStepProps) => {
  const isMobile = useIsMobile();
  const [formData, setFormData] = useState<InfraestruturaData>({
    temReserva: data.temReserva || false,
    areaReserva: data.areaReserva || 0,
    areaProdutiva: data.areaProdutiva || 0,
    temEstrada: data.temEstrada || false,
    qualidadeEstrada: data.qualidadeEstrada || 'REGULAR',
    temEnergia: data.temEnergia || false,
    tipoEnergia: data.tipoEnergia || 'MONOFASICO',
    tipoAlternativoEnergia: data.tipoAlternativoEnergia || 'OFFGRID',
    temAgua: data.temAgua || false,
    tipoAgua: data.tipoAgua || 'POCO',
    aguaEncanada: data.aguaEncanada || false,
    tipoSolo: data.tipoSolo || '',
    vegetacao: data.vegetacao || '',
    possuiGalpao: data.possuiGalpao || false,
    possuiSilo: data.possuiSilo || false,
    reservatorioAgua: data.reservatorioAgua || false,
    energiaFotovoltaica: data.energiaFotovoltaica || false,
    geracaoFotovoltaica: data.geracaoFotovoltaica || '',
    sistemaIrrigacao: data.sistemaIrrigacao || false,
    tipoIrrigacao: data.tipoIrrigacao || 'GOTEJO',
    areaIrrigada: data.areaIrrigada || 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateFormData = (field: keyof InfraestruturaData, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpar erro do campo ao digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const renderSelect = (field: keyof InfraestruturaData, options: Array<{value: string, label: string}>, placeholder: string, value: string) => {
    if (isMobile) {
      return (
        <MobileSelect value={value} onValueChange={(newValue) => {
          if (field === 'temReserva') {
            updateFormData(field, newValue === 'sim');
          } else if (field === 'temEstrada') {
            updateFormData(field, newValue === 'sim');
          } else if (field === 'temEnergia') {
            updateFormData(field, newValue === 'sim');
          } else if (field === 'temAgua') {
            updateFormData(field, newValue === 'sim');
          } else if (field === 'aguaEncanada') {
            updateFormData(field, newValue === 'sim');
          } else if (field === 'possuiGalpao') {
            updateFormData(field, newValue === 'sim');
          } else if (field === 'possuiSilo') {
            updateFormData(field, newValue === 'sim');
          } else if (field === 'reservatorioAgua') {
            updateFormData(field, newValue === 'sim');
          } else if (field === 'energiaFotovoltaica') {
            updateFormData(field, newValue === 'sim');
          } else if (field === 'sistemaIrrigacao') {
            updateFormData(field, newValue === 'sim');
          } else {
            updateFormData(field, newValue);
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
        if (field === 'temReserva') {
          updateFormData(field, newValue === 'sim');
        } else if (field === 'temEstrada') {
          updateFormData(field, newValue === 'sim');
        } else if (field === 'temEnergia') {
          updateFormData(field, newValue === 'sim');
        } else if (field === 'temAgua') {
          updateFormData(field, newValue === 'sim');
        } else if (field === 'aguaEncanada') {
          updateFormData(field, newValue === 'sim');
        } else if (field === 'possuiGalpao') {
          updateFormData(field, newValue === 'sim');
        } else if (field === 'possuiSilo') {
          updateFormData(field, newValue === 'sim');
        } else if (field === 'reservatorioAgua') {
          updateFormData(field, newValue === 'sim');
        } else if (field === 'energiaFotovoltaica') {
          updateFormData(field, newValue === 'sim');
        } else if (field === 'sistemaIrrigacao') {
          updateFormData(field, newValue === 'sim');
        } else {
          updateFormData(field, newValue);
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

    if (formData.temReserva && formData.areaReserva <= 0) {
      newErrors.areaReserva = 'Área da reserva deve ser maior que zero';
    }

    if (formData.areaProdutiva <= 0) {
      newErrors.areaProdutiva = 'Área produtiva deve ser maior que zero';
    }

    if (formData.energiaFotovoltaica && !formData.geracaoFotovoltaica.trim()) {
      newErrors.geracaoFotovoltaica = 'Especifique a geração fotovoltaica';
    }

    if (formData.sistemaIrrigacao && formData.areaIrrigada <= 0) {
      newErrors.areaIrrigada = 'Área irrigada deve ser maior que zero';
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
        <h2 className="text-2xl font-bold text-gray-900">Infraestrutura</h2>
        <p className="text-gray-600 mt-2">
          Energia, água, estradas e infraestrutura da propriedade
        </p>
      </div>

      <div className="space-y-8">
        {/* Área */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Área</h3>
          
          <div>
            <Label className="text-base font-semibold">Possui reserva?</Label>
            {renderSelect(
              'temReserva',
              [
                { value: 'sim', label: 'Sim' },
                { value: 'nao', label: 'Não' }
              ],
              'Selecione uma opção',
              formData.temReserva ? 'sim' : 'nao'
            )}
          </div>

          {formData.temReserva && (
            <div>
              <Label htmlFor="areaReserva" className="text-base font-semibold">
                Área da Reserva (hectares)
              </Label>
              <Input
                id="areaReserva"
                type="number"
                value={formData.areaReserva}
                onChange={(e) => updateFormData('areaReserva', parseFloat(e.target.value) || 0)}
                placeholder="0.0"
                className="mt-2 h-12"
              />
              {errors.areaReserva && <p className="text-red-600 text-sm mt-1">{errors.areaReserva}</p>}
            </div>
          )}

          <div>
            <Label htmlFor="areaProdutiva" className="text-base font-semibold">
              Área Produtiva (hectares) *
            </Label>
            <Input
              id="areaProdutiva"
              type="number"
              value={formData.areaProdutiva}
              onChange={(e) => updateFormData('areaProdutiva', parseFloat(e.target.value) || 0)}
              placeholder="0.0"
              className="mt-2 h-12"
            />
            {errors.areaProdutiva && <p className="text-red-600 text-sm mt-1">{errors.areaProdutiva}</p>}
          </div>
        </div>

        {/* Acesso - Estrada */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Acesso - Estrada</h3>
          
          <div>
            <Label className="text-base font-semibold">Tem acesso por estrada?</Label>
            {renderSelect(
              'temEstrada',
              [
                { value: 'sim', label: 'Sim' },
                { value: 'nao', label: 'Não' }
              ],
              'Selecione uma opção',
              formData.temEstrada ? 'sim' : 'nao'
            )}
          </div>

          {formData.temEstrada && (
            <div>
              <Label className="text-base font-semibold">Qualidade da estrada</Label>
              {renderSelect(
                'qualidadeEstrada',
                [
                  { value: 'OTIMA', label: 'Ótima' },
                  { value: 'BOA', label: 'Boa' },
                  { value: 'REGULAR', label: 'Regular' },
                  { value: 'RUIM', label: 'Ruim' },
                  { value: 'PESSIMA', label: 'Péssima' }
                ],
                'Selecione a qualidade',
                formData.qualidadeEstrada
              )}
            </div>
          )}
        </div>

        {/* Acesso - Energia */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Acesso - Energia</h3>
          
          <div>
            <Label className="text-base font-semibold">Tem acesso à energia?</Label>
            {renderSelect(
              'temEnergia',
              [
                { value: 'sim', label: 'Sim' },
                { value: 'nao', label: 'Não' }
              ],
              'Selecione uma opção',
              formData.temEnergia ? 'sim' : 'nao'
            )}
          </div>

          {formData.temEnergia && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-base font-semibold">Tipo de energia</Label>
                {renderSelect(
                  'tipoEnergia',
                  [
                    { value: 'MONOFASICO', label: 'Monofásico' },
                    { value: 'BIFASICO', label: 'Bifásico' },
                    { value: 'TRIFASICO', label: 'Trifásico' }
                  ],
                  'Selecione o tipo',
                  formData.tipoEnergia
                )}
              </div>
              <div>
                <Label className="text-base font-semibold">Tipo alternativo</Label>
                {renderSelect(
                  'tipoAlternativoEnergia',
                  [
                    { value: 'OFFGRID', label: 'Off-grid' },
                    { value: 'GERADOR', label: 'Gerador' },
                    { value: 'OUTRO', label: 'Outro' }
                  ],
                  'Selecione o tipo',
                  formData.tipoAlternativoEnergia
                )}
              </div>
            </div>
          )}
        </div>

        {/* Acesso - Água */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Acesso - Água</h3>
          
          <div>
            <Label className="text-base font-semibold">Tem acesso à água?</Label>
            {renderSelect(
              'temAgua',
              [
                { value: 'sim', label: 'Sim' },
                { value: 'nao', label: 'Não' }
              ],
              'Selecione uma opção',
              formData.temAgua ? 'sim' : 'nao'
            )}
          </div>

          {formData.temAgua && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-base font-semibold">Tipo de água</Label>
                {renderSelect(
                  'tipoAgua',
                  [
                    { value: 'POCO', label: 'Poço' },
                    { value: 'RIO', label: 'Rio' },
                    { value: 'CORREGO', label: 'Córrego' },
                    { value: 'REPRESA', label: 'Represa' },
                    { value: 'CACIMBA', label: 'Cacimba' },
                    { value: 'PIPA', label: 'Pipa' }
                  ],
                  'Selecione o tipo',
                  formData.tipoAgua
                )}
              </div>
              <div>
                <Label className="text-base font-semibold">Água encanada?</Label>
                {renderSelect(
                  'aguaEncanada',
                  [
                    { value: 'sim', label: 'Sim' },
                    { value: 'nao', label: 'Não' }
                  ],
                  'Selecione uma opção',
                  formData.aguaEncanada ? 'sim' : 'nao'
                )}
              </div>
            </div>
          )}
        </div>

        {/* Características do Solo */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Características do Solo</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="tipoSolo" className="text-base font-semibold">
                Tipo de solo característico
              </Label>
              <Input
                id="tipoSolo"
                value={formData.tipoSolo}
                onChange={(e) => updateFormData('tipoSolo', e.target.value)}
                placeholder="Ex: Argiloso, Arenoso"
                className="mt-2 h-12"
              />
            </div>
            <div>
              <Label htmlFor="vegetacao" className="text-base font-semibold">
                Vegetação
              </Label>
              <Input
                id="vegetacao"
                value={formData.vegetacao}
                onChange={(e) => updateFormData('vegetacao', e.target.value)}
                placeholder="Ex: Cerrado, Mata Atlântica"
                className="mt-2 h-12"
              />
            </div>
          </div>
        </div>

        {/* Infraestrutura */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Infraestrutura</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <Label className="text-base font-semibold">Possui galpão?</Label>
              {renderSelect(
                'possuiGalpao',
                [
                  { value: 'sim', label: 'Sim' },
                  { value: 'nao', label: 'Não' }
                ],
                'Selecione uma opção',
                formData.possuiGalpao ? 'sim' : 'nao'
              )}
            </div>

            <div>
              <Label className="text-base font-semibold">Possui silo?</Label>
              {renderSelect(
                'possuiSilo',
                [
                  { value: 'sim', label: 'Sim' },
                  { value: 'nao', label: 'Não' }
                ],
                'Selecione uma opção',
                formData.possuiSilo ? 'sim' : 'nao'
              )}
            </div>

            <div>
              <Label className="text-base font-semibold">Reservatório de água?</Label>
              {renderSelect(
                'reservatorioAgua',
                [
                  { value: 'sim', label: 'Sim' },
                  { value: 'nao', label: 'Não' }
                ],
                'Selecione uma opção',
                formData.reservatorioAgua ? 'sim' : 'nao'
              )}
            </div>

            <div>
              <Label className="text-base font-semibold">Energia fotovoltaica?</Label>
              {renderSelect(
                'energiaFotovoltaica',
                [
                  { value: 'sim', label: 'Sim' },
                  { value: 'nao', label: 'Não' }
                ],
                'Selecione uma opção',
                formData.energiaFotovoltaica ? 'sim' : 'nao'
              )}
            </div>
          </div>

          {formData.energiaFotovoltaica && (
            <div>
              <Label htmlFor="geracaoFotovoltaica" className="text-base font-semibold">
                Qual geração fotovoltaica?
              </Label>
              <Input
                id="geracaoFotovoltaica"
                value={formData.geracaoFotovoltaica}
                onChange={(e) => updateFormData('geracaoFotovoltaica', e.target.value)}
                placeholder="Ex: 5kW"
                className="mt-2 h-12"
              />
              {errors.geracaoFotovoltaica && <p className="text-red-600 text-sm mt-1">{errors.geracaoFotovoltaica}</p>}
            </div>
          )}
        </div>

        {/* Sistema de Irrigação */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Sistema de Irrigação</h3>
          
          <div>
            <Label className="text-base font-semibold">Possui sistema de irrigação?</Label>
            {renderSelect(
              'sistemaIrrigacao',
              [
                { value: 'sim', label: 'Sim' },
                { value: 'nao', label: 'Não' }
              ],
              'Selecione uma opção',
              formData.sistemaIrrigacao ? 'sim' : 'nao'
            )}
          </div>

          {formData.sistemaIrrigacao && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-base font-semibold">Tipo de irrigação</Label>
                {renderSelect(
                  'tipoIrrigacao',
                  [
                    { value: 'GOTEJO', label: 'Gotejo' },
                    { value: 'PIVO', label: 'Pivô' },
                    { value: 'ASPERSOR', label: 'Aspersor' }
                  ],
                  'Selecione o tipo',
                  formData.tipoIrrigacao
                )}
              </div>
              <div>
                <Label htmlFor="areaIrrigada" className="text-base font-semibold">
                  Área irrigada (hectares)
                </Label>
                <Input
                  id="areaIrrigada"
                  type="number"
                  value={formData.areaIrrigada}
                  onChange={(e) => updateFormData('areaIrrigada', parseFloat(e.target.value) || 0)}
                  placeholder="0.0"
                  className="mt-2 h-12"
                />
                {errors.areaIrrigada && <p className="text-red-600 text-sm mt-1">{errors.areaIrrigada}</p>}
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
                console.log('💾 BOTÃO SALVAR CLICADO no InfraestruturaStep');
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
