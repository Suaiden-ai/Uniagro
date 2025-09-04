import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, ArrowRight, Plus, Trash2 } from 'lucide-react';

interface PessoaFamilia {
  nome: string;
  idade: number;
  profissao?: string;
  escolaridade?: string;
}

interface FamiliaData {
  conjuge: PessoaFamilia;
  filhos: PessoaFamilia[];
  pai: PessoaFamilia;
  mae: PessoaFamilia;
}

interface FamiliaStepProps {
  data: Partial<FamiliaData>;
  onNext: (data: FamiliaData) => void;
  onPrevious: () => void;
  isFirst: boolean;
  isLast: boolean;
}

export const FamiliaStep = ({ data, onNext, onPrevious, isFirst }: FamiliaStepProps) => {
  const [formData, setFormData] = useState<FamiliaData>({
    conjuge: data.conjuge || { nome: '', idade: 0, profissao: '' },
    filhos: data.filhos || [],
    pai: data.pai || { nome: '', idade: 0, profissao: '' },
    mae: data.mae || { nome: '', idade: 0, profissao: '' },
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const updatePessoa = (tipo: 'conjuge' | 'pai' | 'mae', field: keyof PessoaFamilia, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [tipo]: { ...prev[tipo], [field]: value }
    }));
  };

  const updateFilho = (index: number, field: keyof PessoaFamilia, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      filhos: prev.filhos.map((filho, i) => 
        i === index ? { ...filho, [field]: value } : filho
      )
    }));
  };

  const addFilho = () => {
    setFormData(prev => ({
      ...prev,
      filhos: [...prev.filhos, { nome: '', idade: 0, escolaridade: '' }]
    }));
  };

  const removeFilho = (index: number) => {
    setFormData(prev => ({
      ...prev,
      filhos: prev.filhos.filter((_, i) => i !== index)
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validações básicas para cônjuge
    if (!formData.conjuge.nome.trim()) {
      newErrors.conjuge_nome = 'Nome do cônjuge é obrigatório';
    }

    if (formData.conjuge.idade <= 0) {
      newErrors.conjuge_idade = 'Idade do cônjuge deve ser maior que zero';
    }

    // Validações para filhos
    formData.filhos.forEach((filho, index) => {
      if (!filho.nome.trim()) {
        newErrors[`filho_${index}_nome`] = 'Nome do filho é obrigatório';
      }
      if (filho.idade <= 0) {
        newErrors[`filho_${index}_idade`] = 'Idade do filho deve ser maior que zero';
      }
    });

    // Validações para pai
    if (!formData.pai.nome.trim()) {
      newErrors.pai_nome = 'Nome do pai é obrigatório';
    }

    if (formData.pai.idade <= 0) {
      newErrors.pai_idade = 'Idade do pai deve ser maior que zero';
    }

    // Validações para mãe
    if (!formData.mae.nome.trim()) {
      newErrors.mae_nome = 'Nome da mãe é obrigatório';
    }

    if (formData.mae.idade <= 0) {
      newErrors.mae_idade = 'Idade da mãe deve ser maior que zero';
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
        <h2 className="text-2xl font-bold text-gray-900">Dados da Família</h2>
        <p className="text-gray-600 mt-2">
          Informações sobre os membros da família
        </p>
      </div>

      <div className="space-y-8">
        {/* Cônjuge */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Cônjuge</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="conjuge_nome" className="text-base font-semibold">
                Nome *
              </Label>
              <Input
                id="conjuge_nome"
                value={formData.conjuge.nome}
                onChange={(e) => updatePessoa('conjuge', 'nome', e.target.value)}
                placeholder="Nome completo"
                className="mt-2 h-12"
              />
              {errors.conjuge_nome && <p className="text-red-600 text-sm mt-1">{errors.conjuge_nome}</p>}
            </div>
            <div>
              <Label htmlFor="conjuge_idade" className="text-base font-semibold">
                Idade *
              </Label>
              <Input
                id="conjuge_idade"
                type="number"
                value={formData.conjuge.idade}
                onChange={(e) => updatePessoa('conjuge', 'idade', parseInt(e.target.value) || 0)}
                placeholder="0"
                className="mt-2 h-12"
              />
              {errors.conjuge_idade && <p className="text-red-600 text-sm mt-1">{errors.conjuge_idade}</p>}
            </div>
            <div>
              <Label htmlFor="conjuge_profissao" className="text-base font-semibold">
                Profissão
              </Label>
              <Input
                id="conjuge_profissao"
                value={formData.conjuge.profissao || ''}
                onChange={(e) => updatePessoa('conjuge', 'profissao', e.target.value)}
                placeholder="Profissão"
                className="mt-2 h-12"
              />
            </div>
          </div>
        </div>

        {/* Filhos */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Filhos</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addFilho}
              className="flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Adicionar Filho</span>
            </Button>
          </div>
          
          {formData.filhos.map((filho, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-md font-semibold text-gray-800">Filho {index + 1}</h4>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeFilho(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor={`filho_${index}_nome`} className="text-base font-semibold">
                    Nome *
                  </Label>
                  <Input
                    id={`filho_${index}_nome`}
                    value={filho.nome}
                    onChange={(e) => updateFilho(index, 'nome', e.target.value)}
                    placeholder="Nome completo"
                    className="mt-2 h-12"
                  />
                  {errors[`filho_${index}_nome`] && <p className="text-red-600 text-sm mt-1">{errors[`filho_${index}_nome`]}</p>}
                </div>
                <div>
                  <Label htmlFor={`filho_${index}_idade`} className="text-base font-semibold">
                    Idade *
                  </Label>
                  <Input
                    id={`filho_${index}_idade`}
                    type="number"
                    value={filho.idade}
                    onChange={(e) => updateFilho(index, 'idade', parseInt(e.target.value) || 0)}
                    placeholder="0"
                    className="mt-2 h-12"
                  />
                  {errors[`filho_${index}_idade`] && <p className="text-red-600 text-sm mt-1">{errors[`filho_${index}_idade`]}</p>}
                </div>
                <div>
                  <Label htmlFor={`filho_${index}_escolaridade`} className="text-base font-semibold">
                    Escolaridade
                  </Label>
                  <Input
                    id={`filho_${index}_escolaridade`}
                    value={filho.escolaridade || ''}
                    onChange={(e) => updateFilho(index, 'escolaridade', e.target.value)}
                    placeholder="Ex: Ensino Fundamental"
                    className="mt-2 h-12"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pai */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Pai</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="pai_nome" className="text-base font-semibold">
                Nome *
              </Label>
              <Input
                id="pai_nome"
                value={formData.pai.nome}
                onChange={(e) => updatePessoa('pai', 'nome', e.target.value)}
                placeholder="Nome completo"
                className="mt-2 h-12"
              />
              {errors.pai_nome && <p className="text-red-600 text-sm mt-1">{errors.pai_nome}</p>}
            </div>
            <div>
              <Label htmlFor="pai_idade" className="text-base font-semibold">
                Idade *
              </Label>
              <Input
                id="pai_idade"
                type="number"
                value={formData.pai.idade}
                onChange={(e) => updatePessoa('pai', 'idade', parseInt(e.target.value) || 0)}
                placeholder="0"
                className="mt-2 h-12"
              />
              {errors.pai_idade && <p className="text-red-600 text-sm mt-1">{errors.pai_idade}</p>}
            </div>
            <div>
              <Label htmlFor="pai_profissao" className="text-base font-semibold">
                Profissão
              </Label>
              <Input
                id="pai_profissao"
                value={formData.pai.profissao || ''}
                onChange={(e) => updatePessoa('pai', 'profissao', e.target.value)}
                placeholder="Profissão"
                className="mt-2 h-12"
              />
            </div>
          </div>
        </div>

        {/* Mãe */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Mãe</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="mae_nome" className="text-base font-semibold">
                Nome *
              </Label>
              <Input
                id="mae_nome"
                value={formData.mae.nome}
                onChange={(e) => updatePessoa('mae', 'nome', e.target.value)}
                placeholder="Nome completo"
                className="mt-2 h-12"
              />
              {errors.mae_nome && <p className="text-red-600 text-sm mt-1">{errors.mae_nome}</p>}
            </div>
            <div>
              <Label htmlFor="mae_idade" className="text-base font-semibold">
                Idade *
              </Label>
              <Input
                id="mae_idade"
                type="number"
                value={formData.mae.idade}
                onChange={(e) => updatePessoa('mae', 'idade', parseInt(e.target.value) || 0)}
                placeholder="0"
                className="mt-2 h-12"
              />
              {errors.mae_idade && <p className="text-red-600 text-sm mt-1">{errors.mae_idade}</p>}
            </div>
            <div>
              <Label htmlFor="mae_profissao" className="text-base font-semibold">
                Profissão
              </Label>
              <Input
                id="mae_profissao"
                value={formData.mae.profissao || ''}
                onChange={(e) => updatePessoa('mae', 'profissao', e.target.value)}
                placeholder="Profissão"
                className="mt-2 h-12"
              />
            </div>
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

        <Button onClick={handleNext} className="bg-green-600 hover:bg-green-700">
          Próxima
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};
