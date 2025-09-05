import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { FileUpload } from '@/components/ui/file-upload';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, ArrowRight, FileText, Upload, Save, CheckSquare } from 'lucide-react';
import { saveDocumentacaoWithFiles } from '@/services/database';
import { toast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { debugFileUpload, simulateUpload } from '@/utils/mobile-file-debug';

interface DocumentacaoData {
  rg: string;
  cpf: string;
  dataNascimento: string;
  idade: number;
  nis: string;
  pis: string;
  caf: boolean;
  cartaoProdutor: string;
  anexos: {
    rgFile?: File | null;
    cpfFile?: File | null;
  };
}

interface DocumentacaoStepProps {
  data: Partial<DocumentacaoData>;
  onNext: (data: DocumentacaoData) => void;
  onPrevious: () => void;
  onSave?: (data: DocumentacaoData) => void;
  onFinish?: () => void;
  isFirst: boolean;
  isLast: boolean;
  userId?: string; // Adicionado para upload de documentos
}

export const DocumentacaoStep = ({ data, onNext, onPrevious, onSave, onFinish, isFirst, isLast, userId }: DocumentacaoStepProps) => {
  const isMobile = useIsMobile();
  
  const [formData, setFormData] = useState<DocumentacaoData>({
    rg: data.rg || '',
    cpf: data.cpf || '',
    dataNascimento: data.dataNascimento || '',
    idade: data.idade || 0,
    nis: data.nis || '',
    pis: data.pis || '',
    caf: data.caf || false,
    cartaoProdutor: data.cartaoProdutor || '',
    anexos: {
      rgFile: data.anexos?.rgFile || null,
      cpfFile: data.anexos?.cpfFile || null,
    },
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isUploading, setIsUploading] = useState(false);

  const updateFormData = (field: keyof DocumentacaoData, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpar erro do campo ao digitar
    if (errors[field as string]) {
      setErrors(prev => ({ ...prev, [field as string]: '' }));
    }
  };

  // Função específica para atualizar anexos
  const updateAnexos = (field: keyof DocumentacaoData['anexos'], files: File[]) => {
    console.log(`📱 [${isMobile ? 'MOBILE' : 'DESKTOP'}] updateAnexos called:`, {
      field,
      filesCount: files.length,
      files: files.map(f => ({ name: f.name, size: f.size, type: f.type }))
    });
    
    // Debug detalhado para cada arquivo
    files.forEach((file, index) => {
      console.log(`📄 Arquivo ${index + 1}:`, debugFileUpload(file, `${field} - updateAnexos`));
    });
    
    setFormData(prev => ({
      ...prev,
      anexos: {
        ...prev.anexos,
        [field]: field === 'rgFile' || field === 'cpfFile' ? files[0] || null : files
      }
    }));
    
    // Limpar erro se arquivo foi adicionado
    if (files.length > 0 && errors[field as string]) {
      setErrors(prev => ({ ...prev, [field as string]: '' }));
    }
  };

  // Calcular idade automaticamente quando data de nascimento muda
  const handleDateChange = (dateString: string) => {
    updateFormData('dataNascimento', dateString);
    
    if (dateString) {
      const birthDate = new Date(dateString);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      updateFormData('idade', age);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.rg.trim()) {
      newErrors.rg = 'RG é obrigatório';
    }

    if (!formData.cpf.trim()) {
      newErrors.cpf = 'CPF é obrigatório';
    }

    if (!formData.dataNascimento) {
      newErrors.dataNascimento = 'Data de nascimento é obrigatória';
    }

    // Validações para arquivos obrigatórios
    if (!formData.anexos.rgFile) {
      newErrors.rgFile = 'Anexo do RG é obrigatório';
    }

    if (!formData.anexos.cpfFile) {
      newErrors.cpfFile = 'Anexo do CPF é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      onNext(formData);
    }
  };

  // Função específica para salvar com upload de documentos
  const handleSaveWithUpload = async () => {
    console.log(`🚀 [${isMobile ? 'MOBILE' : 'DESKTOP'}] handleSaveWithUpload iniciado`);
    
    if (!userId) {
      console.log('❌ Usuário não identificado');
      toast({
        title: "Erro",
        description: "Usuário não identificado para upload",
        variant: "destructive"
      });
      return;
    }

    console.log('👤 UserID:', userId);
    console.log('📋 FormData:', formData);
    console.log('📄 Arquivos:', {
      rgFile: formData.anexos.rgFile ? { name: formData.anexos.rgFile.name, size: formData.anexos.rgFile.size } : null,
      cpfFile: formData.anexos.cpfFile ? { name: formData.anexos.cpfFile.name, size: formData.anexos.cpfFile.size } : null
    });
    
    // Debug dos arquivos
    if (formData.anexos.rgFile) {
      console.log('🔍 Debug RG File:');
      debugFileUpload(formData.anexos.rgFile, 'handleSaveWithUpload - RG');
      
      const rgTestResult = await simulateUpload(formData.anexos.rgFile);
      console.log('🧪 RG Simulation Result:', rgTestResult);
    }
    
    if (formData.anexos.cpfFile) {
      console.log('🔍 Debug CPF File:');
      debugFileUpload(formData.anexos.cpfFile, 'handleSaveWithUpload - CPF');
      
      const cpfTestResult = await simulateUpload(formData.anexos.cpfFile);
      console.log('🧪 CPF Simulation Result:', cpfTestResult);
    }

    if (!validateForm()) {
      console.log('❌ Formulário inválido');
      toast({
        title: "Erro de validação",
        description: "Corrija os erros do formulário antes de salvar",
        variant: "destructive"
      });
      return;
    }

    console.log('✅ Formulário válido, iniciando upload...');
    setIsUploading(true);
    
    try {
      console.log('📡 Chamando saveDocumentacaoWithFiles...');
      const result = await saveDocumentacaoWithFiles(
        userId,
        formData,
        formData.anexos.rgFile,
        formData.anexos.cpfFile
      );
      
      console.log('🔄 Resultado do saveDocumentacaoWithFiles:', result);
      
      if (result.success) {
        console.log('✅ Upload realizado com sucesso!');
        toast({
          title: "Sucesso!",
          description: "Documentos salvos e enviados com sucesso",
        });
        
        // Chamar onSave original se existir
        if (onSave) {
          onSave(formData);
        }
      } else {
        console.log('❌ Erro no upload:', result.error);
        toast({
          title: "Erro no upload",
          description: result.error || "Erro ao salvar documentos",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error(`💥 [${isMobile ? 'MOBILE' : 'DESKTOP'}] Exceção capturada no upload:`, error);
      console.error('Stack trace:', error instanceof Error ? error.stack : 'N/A');
      toast({
        title: "Erro",
        description: "Erro interno ao salvar documentos",
        variant: "destructive"
      });
    } finally {
      console.log('🔚 Finalizando upload process...');
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Documentação Pessoal</h2>
        <p className="text-gray-600 mt-2">
          Documentos e informações oficiais
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

        {/* Data de Nascimento */}
        <div>
          <Label htmlFor="dataNascimento" className="text-base font-semibold">
            Data de Nascimento *
          </Label>
          <Input
            id="dataNascimento"
            type="date"
            value={formData.dataNascimento}
            onChange={(e) => handleDateChange(e.target.value)}
            className="mt-2 h-12"
          />
          {errors.dataNascimento && <p className="text-red-600 text-sm mt-1">{errors.dataNascimento}</p>}
        </div>

        {/* Idade (calculada automaticamente) */}
        <div>
          <Label htmlFor="idade" className="text-base font-semibold">
            Idade
          </Label>
          <Input
            id="idade"
            type="number"
            value={formData.idade}
            readOnly
            placeholder="Calculado automaticamente"
            className="mt-2 h-12 bg-gray-100"
          />
        </div>

        {/* NIS */}
        <div>
          <Label htmlFor="nis" className="text-base font-semibold">
            NIS
          </Label>
          <Input
            id="nis"
            value={formData.nis}
            onChange={(e) => updateFormData('nis', e.target.value)}
            placeholder="Número de Identificação Social"
            className="mt-2 h-12"
          />
        </div>

        {/* PIS */}
        <div>
          <Label htmlFor="pis" className="text-base font-semibold">
            PIS
          </Label>
          <Input
            id="pis"
            value={formData.pis}
            onChange={(e) => updateFormData('pis', e.target.value)}
            placeholder="000.00000.00-0"
            className="mt-2 h-12"
          />
        </div>

        {/* CAF */}
        <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
          <Switch
            id="caf"
            checked={formData.caf}
            onCheckedChange={(checked) => updateFormData('caf', checked)}
          />
          <Label htmlFor="caf" className="text-base font-semibold">
            Possui CAF (Cadastro de Pessoa Física)
          </Label>
        </div>

        {/* Cartão de Produtor */}
        <div>
          <Label htmlFor="cartaoProdutor" className="text-base font-semibold">
            Cartão de Produtor
          </Label>
          <Input
            id="cartaoProdutor"
            value={formData.cartaoProdutor}
            onChange={(e) => updateFormData('cartaoProdutor', e.target.value)}
            placeholder="Número do cartão de produtor"
            className="mt-2 h-12"
          />
        </div>
      </div>

      <Separator className="my-8" />

      {/* Seção de Upload de Documentos */}
      <div className="space-y-6">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Upload className="h-8 w-8 text-green-600 mr-2" />
            <h3 className="text-xl font-semibold text-gray-900">Anexar Documentos</h3>
          </div>
          <p className="text-gray-600">
            Faça upload dos documentos digitalizados para validação
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload RG */}
          <FileUpload
            id="rg-upload"
            label="Documento de Identidade (RG)"
            description="Anexe uma foto clara e legível do seu RG (frente e verso)"
            acceptedFileTypes=".pdf,.jpg,.jpeg,.png"
            maxFileSize={5}
            multiple={false}
            files={formData.anexos.rgFile ? [formData.anexos.rgFile] : []}
            onFilesChange={(files) => updateAnexos('rgFile', files)}
            required={true}
            error={errors.rgFile}
          />

          {/* Upload CPF */}
          <FileUpload
            id="cpf-upload"
            label="Comprovante de CPF"
            description="Anexe seu comprovante de situação cadastral do CPF ou cartão CPF"
            acceptedFileTypes=".pdf,.jpg,.jpeg,.png"
            maxFileSize={5}
            multiple={false}
            files={formData.anexos.cpfFile ? [formData.anexos.cpfFile] : []}
            onFilesChange={(files) => updateAnexos('cpfFile', files)}
            required={true}
            error={errors.cpfFile}
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
              onClick={handleSaveWithUpload}
              disabled={isUploading}
              className="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
            >
              <Save className="h-4 w-4 mr-2" />
              {isUploading ? 'Salvando...' : 'Salvar informações'}
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
