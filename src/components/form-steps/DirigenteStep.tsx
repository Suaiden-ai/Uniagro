import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, ArrowRight, Save, CheckSquare } from 'lucide-react';

interface DirigenteData {
  nome: string;
  apelido: string;
  rg: string;
  cpf: string;
  endereco: string;
  telefone: string;
}

interface DirigenteStepProps {
  data: Partial<DirigenteData>;
  onNext: (data: DirigenteData) => void;
  onPrevious: () => void;
  onSave?: (data: DirigenteData) => void;
  onFinish?: () => void;
  isFirst: boolean;
  isLast: boolean;
}

export const DirigenteStep = ({ data, onNext, onPrevious, onSave, onFinish, isFirst, isLast }: DirigenteStepProps) => {
  const [formData, setFormData] = useState<DirigenteData>({
    nome: data.nome || '',
    apelido: data.apelido || '',
    rg: data.rg || '',
    cpf: data.cpf || '',
    endereco: data.endereco || '',
    telefone: data.telefone || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateFormData = (field: keyof DirigenteData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpar erro do campo ao digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    console.log('🔍 DirigenteStep - validateForm iniciada');
    console.log('🔍 Dados atuais:', formData);
    
    const newErrors: Record<string, string> = {};

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }

    if (!formData.cpf.trim()) {
      newErrors.cpf = 'CPF é obrigatório';
    }

    if (!formData.rg.trim()) {
      newErrors.rg = 'RG é obrigatório';
    }

    if (!formData.telefone.trim()) {
      newErrors.telefone = 'Telefone é obrigatório';
    }

    console.log('🔍 Erros encontrados:', newErrors);
    console.log('🔍 Formulário válido:', Object.keys(newErrors).length === 0);

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    console.log('🎯 DirigenteStep - handleNext chamado');
    console.log('🎯 Dados do formulário antes da validação:', formData);
    
    if (validateForm()) {
      console.log('✅ Validação passou - enviando dados:', formData);
      onNext(formData);
    } else {
      console.log('❌ Validação falhou - erros:', errors);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Dados do Dirigente</h2>
        <p className="text-gray-600 mt-2">
          Informações sobre o dirigente principal da entidade
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nome */}
        <div>
          <Label htmlFor="nome" className="text-base font-semibold">
            Nome Completo *
          </Label>
          <Input
            id="nome"
            value={formData.nome}
            onChange={(e) => updateFormData('nome', e.target.value)}
            placeholder="Nome completo do dirigente"
            className="mt-2 h-12"
          />
          {errors.nome && <p className="text-red-600 text-sm mt-1">{errors.nome}</p>}
        </div>

        {/* Apelido */}
        <div>
          <Label htmlFor="apelido" className="text-base font-semibold">
            Apelido
          </Label>
          <Input
            id="apelido"
            value={formData.apelido}
            onChange={(e) => updateFormData('apelido', e.target.value)}
            placeholder="Como é conhecido"
            className="mt-2 h-12"
          />
        </div>

        {/* RG */}
        <div>
          <Label htmlFor="rg" className="text-base font-semibold">
            RG *
          </Label>
          <Input
            id="rg"
            value={formData.rg}
            onChange={(e) => updateFormData('rg', e.target.value)}
            placeholder="00.000.000-0"
            className="mt-2 h-12"
          />
          {errors.rg && <p className="text-red-600 text-sm mt-1">{errors.rg}</p>}
        </div>

        {/* CPF */}
        <div>
          <Label htmlFor="cpf" className="text-base font-semibold">
            CPF *
          </Label>
          <Input
            id="cpf"
            value={formData.cpf}
            onChange={(e) => updateFormData('cpf', e.target.value)}
            placeholder="000.000.000-00"
            className="mt-2 h-12"
          />
          {errors.cpf && <p className="text-red-600 text-sm mt-1">{errors.cpf}</p>}
        </div>

        {/* Endereço */}
        <div className="md:col-span-2">
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
                console.log('💾 BOTÃO SALVAR CLICADO no DirigenteStep');
                console.log('💾 Dados atuais que serão enviados:', formData);
                console.log('💾 Validação antes do salvamento:', validateForm());
                if (validateForm()) {
                  console.log('✅ Dados válidos - enviando para onSave:', formData);
                  onSave(formData);
                } else {
                  console.log('❌ Dados inválidos - não será salvo. Erros:', errors);
                }
              }}
              className="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
            >
              <Save className="h-4 w-4 mr-2" />
              Salvar informações
            </Button>
          )}
          
          {isLast ? (
            <Button onClick={onFinish} className="bg-green-600 hover:bg-green-700">
              <CheckSquare className="h-4 w-4 mr-2" />
              Finalizar
            </Button>
          ) : (
            <Button onClick={handleNext} className="bg-green-600 hover:bg-green-700">
              Próxima
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
