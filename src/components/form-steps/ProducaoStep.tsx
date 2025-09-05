import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, ArrowRight, Save } from 'lucide-react';

interface ProducaoData {
  temPasto: boolean;
  areaPasto: number;
  temManga: boolean;
  areaManga: number;
  temProducaoAgricola: boolean;
  quaisProducoes: string;
  feijaoArea: number;
  feijaoInicioSafra: string;
  feijaoPrevisaoColheita: string;
  feijaoPrevisaoQuantidade: number;
  areaPermitidaSemUso: number;
  temCriacoes: boolean;
  tiposCriacoes: string[];
  frangosGranja: number;
  idadeFrangos: number;
  inicioFrangos: string;
  finalAbate: string;
  pesoFrangos: number;
  producaoArtesanalIndustrial: 'ARTESANAL' | 'INDUSTRIAL';
  tipoQueijo: string;
  pesoQueijo: number;
  quantidadeQueijo: number;
  producaoLeiteira: number;
  mediaLitroDia: number;
  totalProducaoLeite: number;
  temPescado: boolean;
  reservatorioPescado: string;
  especiePescado: string;
  inicioProducaoPescado: string;
  finalProducaoPescado: string;
  kgPescado: number;
  potencialExpansao: string;
  setorExpansao: 'AGRICULTURA' | 'PISCICULTURA' | 'APICULTURA' | 'AGROINDUSTRIA' | 'AGROEXTRATIVISMO';
  necessidadesExpansao: string;
  quantidadeNecessidades: string;
}

interface ProducaoStepProps {
  data: Partial<ProducaoData>;
  onNext: (data: ProducaoData) => void;
  onPrevious: () => void;
  onSave?: (data: ProducaoData) => void;
  isFirst: boolean;
  isLast: boolean;
}

export const ProducaoStep = ({ data, onNext, onPrevious, onSave, isFirst }: ProducaoStepProps) => {
  const [formData, setFormData] = useState<ProducaoData>({
    temPasto: data.temPasto || false,
    areaPasto: data.areaPasto || 0,
    temManga: data.temManga || false,
    areaManga: data.areaManga || 0,
    temProducaoAgricola: data.temProducaoAgricola || false,
    quaisProducoes: data.quaisProducoes || '',
    feijaoArea: data.feijaoArea || 0,
    feijaoInicioSafra: data.feijaoInicioSafra || '',
    feijaoPrevisaoColheita: data.feijaoPrevisaoColheita || '',
    feijaoPrevisaoQuantidade: data.feijaoPrevisaoQuantidade || 0,
    areaPermitidaSemUso: data.areaPermitidaSemUso || 0,
    temCriacoes: data.temCriacoes || false,
    tiposCriacoes: data.tiposCriacoes || [],
    frangosGranja: data.frangosGranja || 0,
    idadeFrangos: data.idadeFrangos || 0,
    inicioFrangos: data.inicioFrangos || '',
    finalAbate: data.finalAbate || '',
    pesoFrangos: data.pesoFrangos || 0,
    producaoArtesanalIndustrial: data.producaoArtesanalIndustrial || 'ARTESANAL',
    tipoQueijo: data.tipoQueijo || '',
    pesoQueijo: data.pesoQueijo || 0,
    quantidadeQueijo: data.quantidadeQueijo || 0,
    producaoLeiteira: data.producaoLeiteira || 0,
    mediaLitroDia: data.mediaLitroDia || 0,
    totalProducaoLeite: data.totalProducaoLeite || 0,
    temPescado: data.temPescado || false,
    reservatorioPescado: data.reservatorioPescado || '',
    especiePescado: data.especiePescado || '',
    inicioProducaoPescado: data.inicioProducaoPescado || '',
    finalProducaoPescado: data.finalProducaoPescado || '',
    kgPescado: data.kgPescado || 0,
    potencialExpansao: data.potencialExpansao || '',
    setorExpansao: data.setorExpansao || 'AGRICULTURA',
    necessidadesExpansao: data.necessidadesExpansao || '',
    quantidadeNecessidades: data.quantidadeNecessidades || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateFormData = (field: keyof ProducaoData, value: string | number | boolean | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpar erro do campo ao digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };


  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (formData.temPasto && formData.areaPasto <= 0) {
      newErrors.areaPasto = 'Área do pasto deve ser maior que zero';
    }

    if (formData.temManga && formData.areaManga <= 0) {
      newErrors.areaManga = 'Área de manga deve ser maior que zero';
    }

    if (formData.temProducaoAgricola && !formData.quaisProducoes.trim()) {
      newErrors.quaisProducoes = 'Especifique quais produções';
    }

    if (formData.temCriacoes && formData.tiposCriacoes.length === 0) {
      newErrors.tiposCriacoes = 'Selecione pelo menos um tipo de criação';
    }

    if (formData.temCriacoes && formData.tiposCriacoes.includes('FRANGOS') && formData.frangosGranja <= 0) {
      newErrors.frangosGranja = 'Quantidade de frangos deve ser maior que zero';
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
        <h2 className="text-2xl font-bold text-gray-900">Produção Agrícola</h2>
        <p className="text-gray-600 mt-2">
          Cultivos, plantações e criações
        </p>
      </div>

      <div className="space-y-8">
        {/* Pasto */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Pasto</h3>
          
          <div>
            <Label className="text-base font-semibold">Tem pasto?</Label>
            <Select
              value={formData.temPasto ? 'sim' : 'nao'}
              onValueChange={(value) => updateFormData('temPasto', value === 'sim')}
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

          {formData.temPasto && (
            <div>
              <Label htmlFor="areaPasto" className="text-base font-semibold">
                Área do pasto (hectares)
              </Label>
              <Input
                id="areaPasto"
                type="number"
                value={formData.areaPasto}
                onChange={(e) => updateFormData('areaPasto', parseFloat(e.target.value) || 0)}
                placeholder="0.0"
                className="mt-2 h-12"
              />
              {errors.areaPasto && <p className="text-red-600 text-sm mt-1">{errors.areaPasto}</p>}
            </div>
          )}
        </div>

        {/* Manga */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Manga</h3>
          
          <div>
            <Label className="text-base font-semibold">Tem manga?</Label>
            <Select
              value={formData.temManga ? 'sim' : 'nao'}
              onValueChange={(value) => updateFormData('temManga', value === 'sim')}
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

          {formData.temManga && (
            <div>
              <Label htmlFor="areaManga" className="text-base font-semibold">
                Área de manga (hectares)
              </Label>
              <Input
                id="areaManga"
                type="number"
                value={formData.areaManga}
                onChange={(e) => updateFormData('areaManga', parseFloat(e.target.value) || 0)}
                placeholder="0.0"
                className="mt-2 h-12"
              />
              {errors.areaManga && <p className="text-red-600 text-sm mt-1">{errors.areaManga}</p>}
            </div>
          )}
        </div>

        {/* Produção Agrícola */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Produção Agrícola</h3>
          
          <div>
            <Label className="text-base font-semibold">Tem produção agrícola?</Label>
            <Select
              value={formData.temProducaoAgricola ? 'sim' : 'nao'}
              onValueChange={(value) => updateFormData('temProducaoAgricola', value === 'sim')}
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

          {formData.temProducaoAgricola && (
            <div>
              <Label htmlFor="quaisProducoes" className="text-base font-semibold">
                Quais produções?
              </Label>
              <Input
                id="quaisProducoes"
                value={formData.quaisProducoes}
                onChange={(e) => updateFormData('quaisProducoes', e.target.value)}
                placeholder="Ex: Milho, Soja, Feijão"
                className="mt-2 h-12"
              />
              {errors.quaisProducoes && <p className="text-red-600 text-sm mt-1">{errors.quaisProducoes}</p>}
            </div>
          )}
        </div>

        {/* Feijão */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Feijão</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="feijaoArea" className="text-base font-semibold">
                Área (hectares)
              </Label>
              <Input
                id="feijaoArea"
                type="number"
                value={formData.feijaoArea}
                onChange={(e) => updateFormData('feijaoArea', parseFloat(e.target.value) || 0)}
                placeholder="0.0"
                className="mt-2 h-12"
              />
            </div>
            <div>
              <Label htmlFor="feijaoInicioSafra" className="text-base font-semibold">
                Início da safra
              </Label>
              <Input
                id="feijaoInicioSafra"
                type="date"
                value={formData.feijaoInicioSafra}
                onChange={(e) => updateFormData('feijaoInicioSafra', e.target.value)}
                className="mt-2 h-12"
              />
            </div>
            <div>
              <Label htmlFor="feijaoPrevisaoColheita" className="text-base font-semibold">
                Previsão de colheita
              </Label>
              <Input
                id="feijaoPrevisaoColheita"
                type="date"
                value={formData.feijaoPrevisaoColheita}
                onChange={(e) => updateFormData('feijaoPrevisaoColheita', e.target.value)}
                className="mt-2 h-12"
              />
            </div>
            <div>
              <Label htmlFor="feijaoPrevisaoQuantidade" className="text-base font-semibold">
                Previsão de quantidade (kg)
              </Label>
              <Input
                id="feijaoPrevisaoQuantidade"
                type="number"
                value={formData.feijaoPrevisaoQuantidade}
                onChange={(e) => updateFormData('feijaoPrevisaoQuantidade', parseFloat(e.target.value) || 0)}
                placeholder="0"
                className="mt-2 h-12"
              />
            </div>
          </div>
        </div>

        {/* Área sem uso */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Área sem uso</h3>
          
          <div>
            <Label htmlFor="areaPermitidaSemUso" className="text-base font-semibold">
              Área permitida sem uso (hectares)
            </Label>
            <Input
              id="areaPermitidaSemUso"
              type="number"
              value={formData.areaPermitidaSemUso}
              onChange={(e) => updateFormData('areaPermitidaSemUso', parseFloat(e.target.value) || 0)}
              placeholder="0.0"
              className="mt-2 h-12"
            />
          </div>
        </div>

        {/* Criações */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Criações</h3>
          
          <div>
            <Label className="text-base font-semibold">Tem criações?</Label>
            <Select
              value={formData.temCriacoes ? 'sim' : 'nao'}
              onValueChange={(value) => updateFormData('temCriacoes', value === 'sim')}
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

          {formData.temCriacoes && (
            <div className="space-y-4">
              <div>
                <Label className="text-base font-semibold">Quais tipos de criações?</Label>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      { value: 'FRANGOS', label: 'Frangos' },
                      { value: 'BOVINOS', label: 'Bovinos' },
                      { value: 'SUINOS', label: 'Suínos' },
                      { value: 'CAPRINOS', label: 'Caprinos' },
                      { value: 'OVINOS', label: 'Ovinos' },
                      { value: 'AVES', label: 'Aves (outras)' }
                    ].map((tipo) => (
                      <div key={tipo.value} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={tipo.value}
                          checked={formData.tiposCriacoes.includes(tipo.value)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData(prev => ({
                                ...prev,
                                tiposCriacoes: [...prev.tiposCriacoes, tipo.value]
                              }));
                            } else {
                              setFormData(prev => ({
                                ...prev,
                                tiposCriacoes: prev.tiposCriacoes.filter(t => t !== tipo.value)
                              }));
                            }
                          }}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor={tipo.value} className="text-sm font-medium text-gray-700">
                          {tipo.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                {errors.tiposCriacoes && <p className="text-red-600 text-sm mt-1">{errors.tiposCriacoes}</p>}
              </div>

              {formData.tiposCriacoes.includes('FRANGOS') && (
                <div className="space-y-4">
                  <h4 className="text-md font-semibold text-gray-800">Frango Granja</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="frangosGranja" className="text-base font-semibold">
                    Quantidade
                  </Label>
                  <Input
                    id="frangosGranja"
                    type="number"
                    value={formData.frangosGranja}
                    onChange={(e) => updateFormData('frangosGranja', parseInt(e.target.value) || 0)}
                    placeholder="0"
                    className="mt-2 h-12"
                  />
                  {errors.frangosGranja && <p className="text-red-600 text-sm mt-1">{errors.frangosGranja}</p>}
                </div>
                <div>
                  <Label htmlFor="idadeFrangos" className="text-base font-semibold">
                    Idade (dias)
                  </Label>
                  <Input
                    id="idadeFrangos"
                    type="number"
                    value={formData.idadeFrangos}
                    onChange={(e) => updateFormData('idadeFrangos', parseInt(e.target.value) || 0)}
                    placeholder="0"
                    className="mt-2 h-12"
                  />
                </div>
                <div>
                  <Label htmlFor="inicioFrangos" className="text-base font-semibold">
                    Início
                  </Label>
                  <Input
                    id="inicioFrangos"
                    type="date"
                    value={formData.inicioFrangos}
                    onChange={(e) => updateFormData('inicioFrangos', e.target.value)}
                    className="mt-2 h-12"
                  />
                </div>
                <div>
                  <Label htmlFor="finalAbate" className="text-base font-semibold">
                    Final para abate
                  </Label>
                  <Input
                    id="finalAbate"
                    type="date"
                    value={formData.finalAbate}
                    onChange={(e) => updateFormData('finalAbate', e.target.value)}
                    className="mt-2 h-12"
                  />
                </div>
                <div>
                  <Label htmlFor="pesoFrangos" className="text-base font-semibold">
                    Peso (kg)
                  </Label>
                  <Input
                    id="pesoFrangos"
                    type="number"
                    value={formData.pesoFrangos}
                    onChange={(e) => updateFormData('pesoFrangos', parseFloat(e.target.value) || 0)}
                    placeholder="0.0"
                    className="mt-2 h-12"
                  />
                </div>
              </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Produção Artesanal/Industrial */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Produção Artesanal/Industrial</h3>
          
          <div>
            <Label className="text-base font-semibold">Tipo de produção</Label>
            <Select
              value={formData.producaoArtesanalIndustrial}
              onValueChange={(value) => updateFormData('producaoArtesanalIndustrial', value as any)}
            >
              <SelectTrigger className="mt-2 h-12">
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ARTESANAL">Artesanal</SelectItem>
                <SelectItem value="INDUSTRIAL">Industrial</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <h4 className="text-md font-semibold text-gray-800">Queijo</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="tipoQueijo" className="text-base font-semibold">
                  Tipo
                </Label>
                <Input
                  id="tipoQueijo"
                  value={formData.tipoQueijo}
                  onChange={(e) => updateFormData('tipoQueijo', e.target.value)}
                  placeholder="Ex: Minas, Coalho"
                  className="mt-2 h-12"
                />
              </div>
              <div>
                <Label htmlFor="pesoQueijo" className="text-base font-semibold">
                  Peso/Litro
                </Label>
                <Input
                  id="pesoQueijo"
                  type="number"
                  value={formData.pesoQueijo}
                  onChange={(e) => updateFormData('pesoQueijo', parseFloat(e.target.value) || 0)}
                  placeholder="0.0"
                  className="mt-2 h-12"
                />
              </div>
              <div>
                <Label htmlFor="quantidadeQueijo" className="text-base font-semibold">
                  Quantidade
                </Label>
                <Input
                  id="quantidadeQueijo"
                  type="number"
                  value={formData.quantidadeQueijo}
                  onChange={(e) => updateFormData('quantidadeQueijo', parseInt(e.target.value) || 0)}
                  placeholder="0"
                  className="mt-2 h-12"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Produção Leiteira */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Produção Leiteira</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="producaoLeiteira" className="text-base font-semibold">
                Unidades
              </Label>
              <Input
                id="producaoLeiteira"
                type="number"
                value={formData.producaoLeiteira}
                onChange={(e) => updateFormData('producaoLeiteira', parseInt(e.target.value) || 0)}
                placeholder="0"
                className="mt-2 h-12"
              />
            </div>
            <div>
              <Label htmlFor="mediaLitroDia" className="text-base font-semibold">
                Média litro/dia
              </Label>
              <Input
                id="mediaLitroDia"
                type="number"
                value={formData.mediaLitroDia}
                onChange={(e) => updateFormData('mediaLitroDia', parseFloat(e.target.value) || 0)}
                placeholder="0.0"
                className="mt-2 h-12"
              />
            </div>
            <div>
              <Label htmlFor="totalProducaoLeite" className="text-base font-semibold">
                Total da produção
              </Label>
              <Input
                id="totalProducaoLeite"
                type="number"
                value={formData.totalProducaoLeite}
                onChange={(e) => updateFormData('totalProducaoLeite', parseFloat(e.target.value) || 0)}
                placeholder="0.0"
                className="mt-2 h-12"
              />
            </div>
          </div>
        </div>

        {/* Pescado */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Pescado</h3>
          
          <div>
            <Label className="text-base font-semibold">Tem pescado?</Label>
            <Select
              value={formData.temPescado ? 'sim' : 'nao'}
              onValueChange={(value) => updateFormData('temPescado', value === 'sim')}
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

          {formData.temPescado && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="reservatorioPescado" className="text-base font-semibold">
                  Reservatório
                </Label>
                <Input
                  id="reservatorioPescado"
                  value={formData.reservatorioPescado}
                  onChange={(e) => updateFormData('reservatorioPescado', e.target.value)}
                  placeholder="Ex: Tanque, Represa"
                  className="mt-2 h-12"
                />
              </div>
              <div>
                <Label htmlFor="especiePescado" className="text-base font-semibold">
                  Espécie
                </Label>
                <Input
                  id="especiePescado"
                  value={formData.especiePescado}
                  onChange={(e) => updateFormData('especiePescado', e.target.value)}
                  placeholder="Ex: Tilápia, Tambaqui"
                  className="mt-2 h-12"
                />
              </div>
              <div>
                <Label htmlFor="inicioProducaoPescado" className="text-base font-semibold">
                  Início da produção
                </Label>
                <Input
                  id="inicioProducaoPescado"
                  type="date"
                  value={formData.inicioProducaoPescado}
                  onChange={(e) => updateFormData('inicioProducaoPescado', e.target.value)}
                  className="mt-2 h-12"
                />
              </div>
              <div>
                <Label htmlFor="finalProducaoPescado" className="text-base font-semibold">
                  Final da produção
                </Label>
                <Input
                  id="finalProducaoPescado"
                  type="date"
                  value={formData.finalProducaoPescado}
                  onChange={(e) => updateFormData('finalProducaoPescado', e.target.value)}
                  className="mt-2 h-12"
                />
              </div>
              <div>
                <Label htmlFor="kgPescado" className="text-base font-semibold">
                  Peso (kg)
                </Label>
                <Input
                  id="kgPescado"
                  type="number"
                  value={formData.kgPescado}
                  onChange={(e) => updateFormData('kgPescado', parseFloat(e.target.value) || 0)}
                  placeholder="0.0"
                  className="mt-2 h-12"
                />
              </div>
            </div>
          )}
        </div>

        {/* Potencial de Expansão */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Potencial de Expansão</h3>
          
          <div>
            <Label htmlFor="potencialExpansao" className="text-base font-semibold">
              Qual potencial de expansão?
            </Label>
            <Input
              id="potencialExpansao"
              value={formData.potencialExpansao}
              onChange={(e) => updateFormData('potencialExpansao', e.target.value)}
              placeholder="Descreva o potencial"
              className="mt-2 h-12"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-base font-semibold">Setor</Label>
              <Select
                value={formData.setorExpansao}
                onValueChange={(value) => updateFormData('setorExpansao', value as any)}
              >
                <SelectTrigger className="mt-2 h-12">
                  <SelectValue placeholder="Selecione o setor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AGRICULTURA">Agricultura</SelectItem>
                  <SelectItem value="PISCICULTURA">Piscicultura</SelectItem>
                  <SelectItem value="APICULTURA">Apicultura</SelectItem>
                  <SelectItem value="AGROINDUSTRIA">Agroindústria</SelectItem>
                  <SelectItem value="AGROEXTRATIVISMO">Agroextrativismo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="necessidadesExpansao" className="text-base font-semibold">
                Necessidades
              </Label>
              <Input
                id="necessidadesExpansao"
                value={formData.necessidadesExpansao}
                onChange={(e) => updateFormData('necessidadesExpansao', e.target.value)}
                placeholder="Ex: Financiamento, Máquina, Estrada"
                className="mt-2 h-12"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="quantidadeNecessidades" className="text-base font-semibold">
              Quantidade das necessidades
            </Label>
            <Input
              id="quantidadeNecessidades"
              value={formData.quantidadeNecessidades}
              onChange={(e) => updateFormData('quantidadeNecessidades', e.target.value)}
              placeholder="Descreva as quantidades"
              className="mt-2 h-12"
            />
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
                console.log('💾 BOTÃO SALVAR CLICADO no ProducaoStep');
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
