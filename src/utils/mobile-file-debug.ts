/**
 * Utilitário para debug de upload de arquivos em dispositivos móveis
 */

export const debugFileUpload = (file: File | null, context: string = '') => {
  console.log(`🔍 Debug File Upload - ${context}`);
  
  if (!file) {
    console.log('❌ Nenhum arquivo fornecido');
    return;
  }
  
  // Informações básicas do arquivo
  console.log('📁 Informações do arquivo:');
  console.log('  - Nome:', file.name);
  console.log('  - Tamanho:', file.size, 'bytes');
  console.log('  - Tipo:', file.type);
  console.log('  - Última modificação:', new Date(file.lastModified));
  
  // Verificar se é um arquivo válido
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
  const isValidType = validTypes.includes(file.type);
  console.log('✅ Tipo válido:', isValidType);
  
  // Verificar tamanho
  const maxSize = 5 * 1024 * 1024; // 5MB
  const isValidSize = file.size <= maxSize;
  console.log('✅ Tamanho válido:', isValidSize, `(${(file.size / 1024 / 1024).toFixed(2)}MB)`);
  
  // Verificar informações do dispositivo
  console.log('📱 Informações do dispositivo:');
  console.log('  - User Agent:', navigator.userAgent);
  console.log('  - Platform:', navigator.platform);
  console.log('  - Touch Support:', 'ontouchstart' in window);
  console.log('  - Mobile Detected:', /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
  
  // Verificar APIs disponíveis
  console.log('🔧 APIs disponíveis:');
  console.log('  - FileReader:', typeof FileReader !== 'undefined');
  console.log('  - Blob:', typeof Blob !== 'undefined');
  console.log('  - FormData:', typeof FormData !== 'undefined');
  
  return {
    file: {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified
    },
    validation: {
      validType: isValidType,
      validSize: isValidSize
    },
    device: {
      isMobile: /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
      hasTouch: 'ontouchstart' in window,
      userAgent: navigator.userAgent
    }
  };
};

export const debugFileInput = (inputElement: HTMLInputElement | null) => {
  console.log('🔍 Debug File Input Element');
  
  if (!inputElement) {
    console.log('❌ Elemento input não encontrado');
    return;
  }
  
  console.log('📋 Propriedades do input:');
  console.log('  - Type:', inputElement.type);
  console.log('  - Accept:', inputElement.accept);
  console.log('  - Multiple:', inputElement.multiple);
  console.log('  - Disabled:', inputElement.disabled);
  console.log('  - Files:', inputElement.files?.length || 0);
  
  // Listar arquivos selecionados
  if (inputElement.files && inputElement.files.length > 0) {
    console.log('📁 Arquivos selecionados:');
    Array.from(inputElement.files).forEach((file, index) => {
      console.log(`  ${index + 1}. ${file.name} (${file.size} bytes)`);
    });
  }
};

/**
 * Testa se é possível ler um arquivo usando FileReader
 */
export const testFileReader = (file: File): Promise<boolean> => {
  return new Promise((resolve) => {
    try {
      const reader = new FileReader();
      
      reader.onload = () => {
        console.log('✅ FileReader: Arquivo lido com sucesso');
        resolve(true);
      };
      
      reader.onerror = () => {
        console.log('❌ FileReader: Erro ao ler arquivo');
        resolve(false);
      };
      
      // Tentar ler apenas os primeiros 100 bytes para teste
      reader.readAsArrayBuffer(file.slice(0, 100));
    } catch (error) {
      console.log('❌ FileReader: Exceção capturada:', error);
      resolve(false);
    }
  });
};

/**
 * Simula o processo de upload (sem enviar para o servidor)
 */
export const simulateUpload = async (file: File): Promise<boolean> => {
  try {
    console.log('🔄 Simulando processo de upload...');
    
    // Simular criação de FormData
    const formData = new FormData();
    formData.append('file', file);
    
    console.log('✅ FormData criado com sucesso');
    
    // Simular leitura do arquivo
    const readSuccess = await testFileReader(file);
    
    if (!readSuccess) {
      console.log('❌ Falha na leitura do arquivo');
      return false;
    }
    
    console.log('✅ Simulação de upload concluída com sucesso');
    return true;
    
  } catch (error) {
    console.log('❌ Erro na simulação de upload:', error);
    return false;
  }
};
