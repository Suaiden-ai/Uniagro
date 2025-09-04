import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, ArrowRight, Save } from 'lucide-react';

interface EntidadeData {
  nome: string;
  municipio: string;
  estado: string;
  numeroSociosInformados: number;
  numeroSociosPlataforma: number;
  cnpj: string;
  endereco: string;
  telefone: string;
  email: string;
  linkSite: string;
  linkRedesSociais: string;
  contaBancaria: string;
  banco: string;
}

interface EntidadeStepProps {
  data: Partial<EntidadeData>;
  onNext: (data: EntidadeData) => void;
  onPrevious: () => void;
  onSave?: () => void;
  isFirst: boolean;
  isLast: boolean;
}

export const EntidadeStep = ({ data, onNext, onPrevious, onSave, isFirst }: EntidadeStepProps) => {
  const [formData, setFormData] = useState<EntidadeData>({
    nome: data.nome || '',
    municipio: data.municipio || '',
    estado: data.estado || '',
    numeroSociosInformados: data.numeroSociosInformados || 0,
    numeroSociosPlataforma: data.numeroSociosPlataforma || 0,
    cnpj: data.cnpj || '',
    endereco: data.endereco || '',
    telefone: data.telefone || '',
    email: data.email || '',
    linkSite: data.linkSite || '',
    linkRedesSociais: data.linkRedesSociais || '',
    contaBancaria: data.contaBancaria || '',
    banco: data.banco || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateFormData = (field: keyof EntidadeData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpar erro do campo ao digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome da entidade é obrigatório';
    }

    if (!formData.municipio.trim()) {
      newErrors.municipio = 'Município é obrigatório';
    }

    if (!formData.estado.trim()) {
      newErrors.estado = 'Estado é obrigatório';
    }

    if (!formData.cnpj.trim()) {
      newErrors.cnpj = 'CNPJ é obrigatório';
    }

    if (!formData.telefone.trim()) {
      newErrors.telefone = 'Telefone é obrigatório';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
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
        <h2 className="text-2xl font-bold text-gray-900">Dados da Entidade</h2>
        <p className="text-gray-600 mt-2">
          Informações básicas sobre a cooperativa ou associação
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nome */}
        <div className="md:col-span-2">
          <Label htmlFor="nome" className="text-base font-semibold">
            Nome da Entidade *
          </Label>
          <Input
            id="nome"
            value={formData.nome}
            onChange={(e) => updateFormData('nome', e.target.value)}
            placeholder="Nome completo da cooperativa/associação"
            className="mt-2 h-12"
          />
          {errors.nome && <p className="text-red-600 text-sm mt-1">{errors.nome}</p>}
        </div>

        {/* Município */}
        <div>
          <Label htmlFor="municipio" className="text-base font-semibold">
            Município *
          </Label>
          <Input
            id="municipio"
            value={formData.municipio}
            onChange={(e) => updateFormData('municipio', e.target.value)}
            placeholder="Município"
            className="mt-2 h-12"
          />
          {errors.municipio && <p className="text-red-600 text-sm mt-1">{errors.municipio}</p>}
        </div>

        {/* Estado */}
        <div>
          <Label htmlFor="estado" className="text-base font-semibold">
            Estado *
          </Label>
          <Input
            id="estado"
            value={formData.estado}
            onChange={(e) => updateFormData('estado', e.target.value)}
            placeholder="Estado"
            className="mt-2 h-12"
          />
          {errors.estado && <p className="text-red-600 text-sm mt-1">{errors.estado}</p>}
        </div>

        {/* Número de Sócios */}
        <div>
          <Label htmlFor="numeroSociosInformados" className="text-base font-semibold">
            Nº Sócios Informados
          </Label>
          <Input
            id="numeroSociosInformados"
            type="number"
            value={formData.numeroSociosInformados}
            onChange={(e) => updateFormData('numeroSociosInformados', parseInt(e.target.value) || 0)}
            placeholder="0"
            className="mt-2 h-12"
          />
        </div>

        <div>
          <Label htmlFor="numeroSociosPlataforma" className="text-base font-semibold">
            Nº Sócios na Plataforma
          </Label>
          <Input
            id="numeroSociosPlataforma"
            type="number"
            value={formData.numeroSociosPlataforma}
            onChange={(e) => updateFormData('numeroSociosPlataforma', parseInt(e.target.value) || 0)}
            placeholder="0"
            className="mt-2 h-12"
          />
        </div>

        {/* CNPJ */}
        <div>
          <Label htmlFor="cnpj" className="text-base font-semibold">
            CNPJ *
          </Label>
          <Input
            id="cnpj"
            value={formData.cnpj}
            onChange={(e) => updateFormData('cnpj', e.target.value)}
            placeholder="00.000.000/0000-00"
            className="mt-2 h-12"
          />
          {errors.cnpj && <p className="text-red-600 text-sm mt-1">{errors.cnpj}</p>}
        </div>

        {/* Telefone */}
        <div>
          <Label htmlFor="telefone" className="text-base font-semibold">
            Telefone *
          </Label>
          <Input
            id="telefone"
            value={formData.telefone}
            onChange={(e) => updateFormData('telefone', e.target.value)}
            placeholder="(00) 00000-0000"
            className="mt-2 h-12"
          />
          {errors.telefone && <p className="text-red-600 text-sm mt-1">{errors.telefone}</p>}
        </div>

        {/* Email */}
        <div>
          <Label htmlFor="email" className="text-base font-semibold">
            Email *
          </Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => updateFormData('email', e.target.value)}
            placeholder="contato@entidade.com"
            className="mt-2 h-12"
          />
          {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
        </div>

        {/* Endereço */}
        <div>
          <Label htmlFor="endereco" className="text-base font-semibold">
            Endereço
          </Label>
          <Input
            id="endereco"
            value={formData.endereco}
            onChange={(e) => updateFormData('endereco', e.target.value)}
            placeholder="Endereço completo"
            className="mt-2 h-12"
          />
        </div>

        {/* Links */}
        <div>
          <Label htmlFor="linkSite" className="text-base font-semibold">
            Link do Site
          </Label>
          <Input
            id="linkSite"
            value={formData.linkSite}
            onChange={(e) => updateFormData('linkSite', e.target.value)}
            placeholder="https://www.site.com"
            className="mt-2 h-12"
          />
        </div>

        <div>
          <Label htmlFor="linkRedesSociais" className="text-base font-semibold">
            Redes Sociais
          </Label>
          <Input
            id="linkRedesSociais"
            value={formData.linkRedesSociais}
            onChange={(e) => updateFormData('linkRedesSociais', e.target.value)}
            placeholder="Links das redes sociais"
            className="mt-2 h-12"
          />
        </div>

        {/* Dados Bancários */}
        <div>
          <Label htmlFor="banco" className="text-base font-semibold">
            Banco
          </Label>
          <Input
            id="banco"
            value={formData.banco}
            onChange={(e) => updateFormData('banco', e.target.value)}
            placeholder="Nome do banco"
            className="mt-2 h-12"
          />
        </div>

        <div>
          <Label htmlFor="contaBancaria" className="text-base font-semibold">
            Conta Bancária
          </Label>
          <Input
            id="contaBancaria"
            value={formData.contaBancaria}
            onChange={(e) => updateFormData('contaBancaria', e.target.value)}
            placeholder="Agência e conta"
            className="mt-2 h-12"
          />
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
