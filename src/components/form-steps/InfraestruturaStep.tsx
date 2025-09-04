import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, ArrowRight } from 'lucide-react';

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
  isFirst: boolean;
  isLast: boolean;
}

export const InfraestruturaStep = ({ data, onNext, onPrevious, isFirst }: InfraestruturaStepProps) => {
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
            <Select
              value={formData.temReserva ? 'sim' : 'nao'}
              onValueChange={(value) => updateFormData('temReserva', value === 'sim')}
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
            <Select
              value={formData.temEstrada ? 'sim' : 'nao'}
              onValueChange={(value) => updateFormData('temEstrada', value === 'sim')}
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

          {formData.temEstrada && (
            <div>
              <Label className="text-base font-semibold">Qualidade da estrada</Label>
              <Select
                value={formData.qualidadeEstrada}
                onValueChange={(value) => updateFormData('qualidadeEstrada', value as any)}
              >
                <SelectTrigger className="mt-2 h-12">
                  <SelectValue placeholder="Selecione a qualidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="OTIMA">Ótima</SelectItem>
                  <SelectItem value="BOA">Boa</SelectItem>
                  <SelectItem value="REGULAR">Regular</SelectItem>
                  <SelectItem value="RUIM">Ruim</SelectItem>
                  <SelectItem value="PESSIMA">Péssima</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* Acesso - Energia */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Acesso - Energia</h3>
          
          <div>
            <Label className="text-base font-semibold">Tem acesso à energia?</Label>
            <Select
              value={formData.temEnergia ? 'sim' : 'nao'}
              onValueChange={(value) => updateFormData('temEnergia', value === 'sim')}
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

          {formData.temEnergia && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-base font-semibold">Tipo de energia</Label>
                <Select
                  value={formData.tipoEnergia}
                  onValueChange={(value) => updateFormData('tipoEnergia', value as any)}
                >
                  <SelectTrigger className="mt-2 h-12">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MONOFASICO">Monofásico</SelectItem>
                    <SelectItem value="BIFASICO">Bifásico</SelectItem>
                    <SelectItem value="TRIFASICO">Trifásico</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-base font-semibold">Tipo alternativo</Label>
                <Select
                  value={formData.tipoAlternativoEnergia}
                  onValueChange={(value) => updateFormData('tipoAlternativoEnergia', value as any)}
                >
                  <SelectTrigger className="mt-2 h-12">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="OFFGRID">Off-grid</SelectItem>
                    <SelectItem value="GERADOR">Gerador</SelectItem>
                    <SelectItem value="OUTRO">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>

        {/* Acesso - Água */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Acesso - Água</h3>
          
          <div>
            <Label className="text-base font-semibold">Tem acesso à água?</Label>
            <Select
              value={formData.temAgua ? 'sim' : 'nao'}
              onValueChange={(value) => updateFormData('temAgua', value === 'sim')}
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

          {formData.temAgua && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-base font-semibold">Tipo de água</Label>
                <Select
                  value={formData.tipoAgua}
                  onValueChange={(value) => updateFormData('tipoAgua', value as any)}
                >
                  <SelectTrigger className="mt-2 h-12">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="POCO">Poço</SelectItem>
                    <SelectItem value="RIO">Rio</SelectItem>
                    <SelectItem value="CORREGO">Córrego</SelectItem>
                    <SelectItem value="REPRESA">Represa</SelectItem>
                    <SelectItem value="CACIMBA">Cacimba</SelectItem>
                    <SelectItem value="PIPA">Pipa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-base font-semibold">Água encanada?</Label>
                <Select
                  value={formData.aguaEncanada ? 'sim' : 'nao'}
                  onValueChange={(value) => updateFormData('aguaEncanada', value === 'sim')}
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
              <Select
                value={formData.possuiGalpao ? 'sim' : 'nao'}
                onValueChange={(value) => updateFormData('possuiGalpao', value === 'sim')}
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

            <div>
              <Label className="text-base font-semibold">Possui silo?</Label>
              <Select
                value={formData.possuiSilo ? 'sim' : 'nao'}
                onValueChange={(value) => updateFormData('possuiSilo', value === 'sim')}
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

            <div>
              <Label className="text-base font-semibold">Reservatório de água?</Label>
              <Select
                value={formData.reservatorioAgua ? 'sim' : 'nao'}
                onValueChange={(value) => updateFormData('reservatorioAgua', value === 'sim')}
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

            <div>
              <Label className="text-base font-semibold">Energia fotovoltaica?</Label>
              <Select
                value={formData.energiaFotovoltaica ? 'sim' : 'nao'}
                onValueChange={(value) => updateFormData('energiaFotovoltaica', value === 'sim')}
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
            <Select
              value={formData.sistemaIrrigacao ? 'sim' : 'nao'}
              onValueChange={(value) => updateFormData('sistemaIrrigacao', value === 'sim')}
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

          {formData.sistemaIrrigacao && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-base font-semibold">Tipo de irrigação</Label>
                <Select
                  value={formData.tipoIrrigacao}
                  onValueChange={(value) => updateFormData('tipoIrrigacao', value as any)}
                >
                  <SelectTrigger className="mt-2 h-12">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GOTEJO">Gotejo</SelectItem>
                    <SelectItem value="PIVO">Pivô</SelectItem>
                    <SelectItem value="ASPERSOR">Aspersor</SelectItem>
                  </SelectContent>
                </Select>
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

        <Button onClick={handleNext} className="bg-green-600 hover:bg-green-700">
          Próxima
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};
