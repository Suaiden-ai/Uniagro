import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, ArrowRight, Save, Loader2, CheckSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { validateCEP, formatCEP } from '@/lib/validations';

interface EntidadeData {
  nome: string;
  cep: string;
  municipio: string;
  bairro: string;
  complemento: string;
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
  onSave?: (data: EntidadeData) => void;
  onFinish?: () => void;
  isFirst: boolean;
  isLast: boolean;
}

export const EntidadeStep = ({ data, onNext, onPrevious, onSave, onFinish, isFirst, isLast }: EntidadeStepProps) => {
  const [formData, setFormData] = useState<EntidadeData>({
    nome: data.nome || '',
    cep: data.cep || '',
    municipio: data.municipio || '',
    bairro: data.bairro || '',
    complemento: data.complemento || '',
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
  const [isLoadingCep, setIsLoadingCep] = useState(false);
  const { toast } = useToast();

  const updateFormData = (field: keyof EntidadeData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpar erro do campo ao digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const buscarCEP = async (cep: string) => {
    const cepLimpo = cep.replace(/\D/g, '');
    
    if (cepLimpo.length !== 8) return;
    
    setIsLoadingCep(true);
    
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data = await response.json();
      
      if (!data.erro) {
        console.log('🌐 VIA CEP - Dados recebidos:', data);
        console.log('🌐 VIA CEP - Campo bairro da API:', data.bairro);
        
        setFormData(prev => {
          const newData = {
            ...prev,
            endereco: data.logradouro || prev.endereco,
            municipio: data.localidade || prev.municipio,
            bairro: data.bairro || prev.bairro,
            estado: data.uf || prev.estado,
          };
          console.log('🌐 VIA CEP - Dados atualizados:', newData);
          return newData;
        });
        
        toast({
          title: "CEP encontrado!",
          description: "Endereço preenchido automaticamente.",
        });
      } else {
        toast({
          title: "CEP não encontrado",
          description: "Verifique se o CEP está correto.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro ao buscar CEP",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingCep(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    console.log('🔍 VALIDAÇÃO - Dados atuais do formulário:', formData);
    console.log('🔍 VALIDAÇÃO - Campo bairro:', { valor: formData.bairro, trim: formData.bairro.trim(), vazio: !formData.bairro.trim() });

    // 1. Nome da Entidade
    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome da entidade é obrigatório';
    }

    // 2. Email
    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    // 3. Telefone
    if (!formData.telefone.trim()) {
      newErrors.telefone = 'Telefone é obrigatório';
    }

    // 4. CNPJ
    if (!formData.cnpj.trim()) {
      newErrors.cnpj = 'CNPJ é obrigatório';
    }

    // 7. CEP
    if (!formData.cep.trim()) {
      newErrors.cep = 'CEP é obrigatório';
    } else if (!validateCEP(formData.cep)) {
      newErrors.cep = 'CEP deve conter 8 dígitos';
    }

    // 8. Estado
    if (!formData.estado.trim()) {
      newErrors.estado = 'Estado é obrigatório';
    }

    // 9. Município
    if (!formData.municipio.trim()) {
      newErrors.municipio = 'Município é obrigatório';
    }

    // 10. Bairro
    if (!formData.bairro.trim()) {
      newErrors.bairro = 'Bairro é obrigatório';
      console.log('❌ ERRO: Campo bairro está vazio!');
    } else {
      console.log('✅ Campo bairro preenchido:', formData.bairro);
    }

    // 11. Endereço
    if (!formData.endereco.trim()) {
      newErrors.endereco = 'Endereço é obrigatório';
    }

    console.log('🔍 VALIDAÇÃO - Erros encontrados:', newErrors);
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
        {/* 1. Nome da Entidade */}
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

        {/* 2. Email */}
        <div>
          <Label htmlFor="email" className="text-base font-semibold">
            Email *
          </Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => updateFormData('email', e.target.value)}
            placeholder="email@exemplo.com"
            className="mt-2 h-12"
          />
          {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
        </div>

        {/* 3. Telefone */}
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

        {/* 4. CNPJ */}
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

        {/* 5. Nº Sócios Informados */}
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

        {/* 6. Nº Sócios na Plataforma */}
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

        {/* 7. Redes Sociais */}
        <div className="md:col-span-2">
          <Label htmlFor="linkRedesSociais" className="text-base font-semibold">
            Redes Sociais
          </Label>
          <Input
            id="linkRedesSociais"
            value={formData.linkRedesSociais}
            onChange={(e) => updateFormData('linkRedesSociais', e.target.value)}
            placeholder="Link das redes sociais"
            className="mt-2 h-12"
          />
        </div>

        {/* 8. CEP */}
        <div>
          <Label htmlFor="cep" className="text-base font-semibold">
            CEP *
          </Label>
          <div className="relative">
            <Input
              id="cep"
              value={formData.cep}
              onChange={(e) => {
                const newCep = formatCEP(e.target.value);
                updateFormData('cep', newCep);
                if (newCep.replace(/\D/g, '').length === 8) {
                  buscarCEP(newCep);
                }
              }}
              placeholder="00000-000"
              className="mt-2 h-12 pr-10"
            />
            {isLoadingCep && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            )}
          </div>
          {errors.cep && (
            <p className="text-red-600 text-sm mt-1">
              {errors.cep}
            </p>
          )}
        </div>

        {/* 9. Estado */}
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

        {/* 10. Município */}
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

        {/* 11. Bairro */}
        <div>
          <Label htmlFor="bairro" className="text-base font-semibold">
            Bairro *
          </Label>
          <Input
            id="bairro"
            value={formData.bairro}
            onChange={(e) => updateFormData('bairro', e.target.value)}
            placeholder="Bairro"
            className="mt-2 h-12"
          />
          {errors.bairro && <p className="text-red-600 text-sm mt-1">{errors.bairro}</p>}
        </div>

        {/* 12. Complemento */}
        <div>
          <Label htmlFor="complemento" className="text-base font-semibold">
            Complemento
          </Label>
          <Input
            id="complemento"
            value={formData.complemento}
            onChange={(e) => updateFormData('complemento', e.target.value)}
            placeholder="Apartamento, sala, etc."
            className="mt-2 h-12"
          />
        </div>

        {/* 13. Endereço */}
        <div>
          <Label htmlFor="endereco" className="text-base font-semibold">
            Endereço *
          </Label>
          <Input
            id="endereco"
            value={formData.endereco}
            onChange={(e) => updateFormData('endereco', e.target.value)}
            placeholder="Rua, Avenida, etc."
            className="mt-2 h-12"
          />
          {errors.endereco && <p className="text-red-600 text-sm mt-1">{errors.endereco}</p>}
        </div>

        {/* 14. Banco */}
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

        {/* 15. Conta Bancária */}
        <div>
          <Label htmlFor="contaBancaria" className="text-base font-semibold">
            Conta Bancária
          </Label>
          <Input
            id="contaBancaria"
            value={formData.contaBancaria}
            onChange={(e) => updateFormData('contaBancaria', e.target.value)}
            placeholder="Número da conta"
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
                console.log('💾 BOTÃO SALVAR CLICADO no EntidadeStep');
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
