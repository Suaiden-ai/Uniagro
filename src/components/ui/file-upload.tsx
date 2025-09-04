import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, X, File, CheckCircle, AlertCircle } from 'lucide-react';
import { Label } from '@/components/ui/label';

interface FileUploadProps {
  id: string;
  label: string;
  description?: string;
  acceptedFileTypes?: string;
  maxFileSize?: number; // em MB
  multiple?: boolean;
  files: File[];
  onFilesChange: (files: File[]) => void;
  required?: boolean;
  error?: string;
}

export const FileUpload = ({
  id,
  label,
  description,
  acceptedFileTypes = ".pdf,.jpg,.jpeg,.png,.doc,.docx",
  maxFileSize = 10,
  multiple = false,
  files,
  onFilesChange,
  required = false,
  error
}: FileUploadProps) => {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateFile = (file: File): string | null => {
    // Verificar tamanho
    if (file.size > maxFileSize * 1024 * 1024) {
      return `Arquivo muito grande. Máximo: ${maxFileSize}MB`;
    }

    // Verificar tipo
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    const acceptedTypes = acceptedFileTypes.toLowerCase().split(',').map(type => type.trim());
    
    if (!acceptedTypes.includes(fileExtension)) {
      return `Tipo de arquivo não aceito. Aceitos: ${acceptedFileTypes}`;
    }

    return null;
  };

  const handleFiles = (newFiles: FileList | File[]) => {
    const fileArray = Array.from(newFiles);
    const validFiles: File[] = [];
    let hasError = false;

    fileArray.forEach(file => {
      const error = validateFile(file);
      if (!error) {
        validFiles.push(file);
      } else {
        hasError = true;
        console.warn(`Erro no arquivo ${file.name}: ${error}`);
      }
    });

    if (multiple) {
      onFilesChange([...files, ...validFiles]);
    } else {
      onFilesChange(validFiles.slice(0, 1));
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const removeFile = (indexToRemove: number) => {
    const updatedFiles = files.filter((_, index) => index !== indexToRemove);
    onFilesChange(updatedFiles);
  };

  const openFileDialog = () => {
    inputRef.current?.click();
  };

  return (
    <div className="space-y-3">
      <Label htmlFor={id} className="text-base font-semibold">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      
      {description && (
        <p className="text-sm text-gray-600">{description}</p>
      )}

      {/* Área de Upload */}
      <Card className={`border-2 border-dashed transition-colors ${
        dragActive 
          ? 'border-green-500 bg-green-50' 
          : error 
            ? 'border-red-300 bg-red-50' 
            : 'border-gray-300 hover:border-gray-400'
      }`}>
        <CardContent 
          className="p-6 text-center cursor-pointer"
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={openFileDialog}
        >
          <input
            ref={inputRef}
            id={id}
            type="file"
            className="hidden"
            multiple={multiple}
            accept={acceptedFileTypes}
            onChange={handleChange}
          />
          
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <div className="space-y-2">
            <p className="text-lg font-medium text-gray-700">
              Clique aqui ou arraste arquivos para fazer upload
            </p>
            <p className="text-sm text-gray-500">
              {acceptedFileTypes} • Máximo {maxFileSize}MB {multiple && '• Múltiplos arquivos'}
            </p>
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="flex items-center space-x-2 text-red-600 text-sm">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Lista de Arquivos */}
      {files.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Arquivos selecionados:</p>
          {files.map((file, index) => (
            <Card key={`${file.name}-${index}`} className="bg-green-50 border-green-200">
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <File className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{file.name}</p>
                      <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(index);
                    }}
                    className="text-red-600 hover:text-red-800 hover:bg-red-100"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
