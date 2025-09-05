import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MobileSelect, MobileSelectTrigger, MobileSelectContent, MobileSelectItem, MobileSelectValue } from '@/components/ui/mobile-select';
import { ArrowLeft, ArrowRight, Save, CheckSquare } from 'lucide-react';

interface ProprietarioData {
  nome: string;
  sexo: string;
  corPele: string;
  religiao: string;
  time: string;
  esportePreferido: string;
  musica: string;
  artista: string;
  estadoCivil: string;
  telefone: string;
}

interface ProprietarioStepProps {
  data: Partial<ProprietarioData>;
  onNext: (data: ProprietarioData) => void;
  onPrevious: () => void;
  onSave?: (data: ProprietarioData) => void;
  onFinish?: () => void;
  isFirst: boolean;
  isLast: boolean;
}

const SEXO_OPTIONS = [
  { value: 'MASCULINO', label: 'Masculino' },
  { value: 'FEMININO', label: 'Feminino' },
  { value: 'PREFIRO_NAO_DECLARAR', label: 'Prefiro não declarar' },
];

const COR_PELE_OPTIONS = [
  { value: 'BRANCA', label: 'Branca' },
  { value: 'PRETA', label: 'Preta' },
  { value: 'PARDA', label: 'Parda' },
  { value: 'AMARELA', label: 'Amarela' },
  { value: 'INDIGENA', label: 'Indígena' },
  { value: 'PREFIRO_NAO_DECLARAR', label: 'Prefiro não declarar' },
];

const ESTADO_CIVIL_OPTIONS = [
  { value: 'SOLTEIRO', label: 'Solteiro(a)' },
  { value: 'CASADO', label: 'Casado(a)' },
  { value: 'DIVORCIADO', label: 'Divorciado(a)' },
  { value: 'VIUVO', label: 'Viúvo(a)' },
  { value: 'UNIAO_ESTAVEL', label: 'União Estável' },
  { value: 'PREFIRO_NAO_DECLARAR', label: 'Prefiro não declarar' },
];

export const ProprietarioStep = ({ data, onNext, onPrevious, onSave, onFinish, isFirst, isLast }: ProprietarioStepProps) => {
  const [isMobile, setIsMobile] = useState(false);
  
  const [formData, setFormData] = useState<ProprietarioData>({
    nome: data.nome || '',
    sexo: data.sexo || '',
    corPele: data.corPele || '',
    religiao: data.religiao || '',
    time: data.time || '',
    esportePreferido: data.esportePreferido || '',
    musica: data.musica || '',
    artista: data.artista || '',
    estadoCivil: data.estadoCivil || '',
    telefone: data.telefone || '',
  });

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateFormData = (field: keyof ProprietarioData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpar erro do campo ao digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const renderSelect = (field: keyof ProprietarioData, options: Array<{value: string, label: string}>, placeholder: string) => {
    if (isMobile) {
      return (
        <MobileSelect value={formData[field]} onValueChange={(value) => updateFormData(field, value)}>
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
      <Select value={formData[field]} onValueChange={(value) => updateFormData(field, value)}>
        <SelectTrigger className="mobile-select-trigger mt-2">
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

  const formatPhone = (value: string) => {
    // Remove tudo que não é dígito
    const numbers = value.replace(/\D/g, '');
    
    // Aplica a máscara (XX) XXXXX-XXXX
    if (numbers.length <= 2) {
      return numbers;
    } else if (numbers.length <= 6) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    } else if (numbers.length <= 10) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
    } else {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
    }
  };

  const handlePhoneChange = (value: string) => {
    const formatted = formatPhone(value);
    updateFormData('telefone', formatted);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }

    if (formData.telefone && !/^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(formData.telefone)) {
      newErrors.telefone = 'Telefone deve estar no formato (XX) XXXXX-XXXX';
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
        <h2 className="text-2xl font-bold text-gray-900">Dados Pessoais do Proprietário</h2>
        <p className="text-gray-600 mt-2">
          Informações pessoais e preferências
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nome */}
        <div className="md:col-span-2">
          <Label htmlFor="nome" className="text-base font-semibold">
            Nome Completo *
          </Label>
          <Input
            id="nome"
            value={formData.nome}
            onChange={(e) => updateFormData('nome', e.target.value)}
            placeholder="Nome completo"
            className="mt-2 h-12"
          />
          {errors.nome && <p className="text-red-600 text-sm mt-1">{errors.nome}</p>}
        </div>

        {/* Estado Civil */}
        <div>
          <Label className="mobile-select-label">Estado Civil</Label>
          {renderSelect('estadoCivil', ESTADO_CIVIL_OPTIONS, 'Selecione o estado civil')}
        </div>

        {/* Telefone */}
        <div>
          <Label htmlFor="telefone" className="text-base font-semibold">
            Telefone
          </Label>
          <Input
            id="telefone"
            value={formData.telefone}
            onChange={(e) => handlePhoneChange(e.target.value)}
            placeholder="(XX) XXXXX-XXXX"
            className="mt-2 h-12"
          />
          {errors.telefone && <p className="text-red-600 text-sm mt-1">{errors.telefone}</p>}
        </div>

        {/* Sexo */}
        <div>
          <Label className="mobile-select-label">Sexo</Label>
          {renderSelect('sexo', SEXO_OPTIONS, 'Selecione o sexo')}
        </div>

        {/* Cor da Pele */}
        <div>
          <Label className="mobile-select-label">Cor da Pele</Label>
          {renderSelect('corPele', COR_PELE_OPTIONS, 'Selecione a cor da pele')}
        </div>

        {/* Religião */}
        <div>
          <Label htmlFor="religiao" className="text-base font-semibold">
            Religião
          </Label>
          <Input
            id="religiao"
            value={formData.religiao}
            onChange={(e) => updateFormData('religiao', e.target.value)}
            placeholder="Sua religião"
            className="mt-2 h-12"
          />
        </div>

        {/* Time */}
        <div>
          <Label htmlFor="time" className="text-base font-semibold">
            Time de Futebol
          </Label>
          <Input
            id="time"
            value={formData.time}
            onChange={(e) => updateFormData('time', e.target.value)}
            placeholder="Time que torce"
            className="mt-2 h-12"
          />
        </div>

        {/* Esporte Preferido */}
        <div>
          <Label htmlFor="esportePreferido" className="text-base font-semibold">
            Esporte Preferido
          </Label>
          <Input
            id="esportePreferido"
            value={formData.esportePreferido}
            onChange={(e) => updateFormData('esportePreferido', e.target.value)}
            placeholder="Esporte que mais gosta"
            className="mt-2 h-12"
          />
        </div>

        {/* Música */}
        <div>
          <Label htmlFor="musica" className="text-base font-semibold">
            Gênero Musical Preferido
          </Label>
          <Input
            id="musica"
            value={formData.musica}
            onChange={(e) => updateFormData('musica', e.target.value)}
            placeholder="Estilo musical favorito"
            className="mt-2 h-12"
          />
        </div>

        {/* Artista */}
        <div>
          <Label htmlFor="artista" className="text-base font-semibold">
            Artista Favorito
          </Label>
          <Input
            id="artista"
            value={formData.artista}
            onChange={(e) => updateFormData('artista', e.target.value)}
            placeholder="Cantor/banda favorito"
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
              onClick={() => {
                console.log('💾 BOTÃO SALVAR CLICADO no ProprietarioStep');
                console.log('💾 Dados atuais que serão enviados:', formData);
                onSave(formData);
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
