import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

export interface UploadResult {
  success: boolean;
  url?: string;
  path?: string;
  error?: string;
}

export interface DocumentUpload {
  rgUrl?: string;
  cpfUrl?: string;
}

/**
 * Serviço para gerenciar uploads de documentos no Supabase Storage
 */
class StorageService {
  private readonly bucketName = 'documentos';
  
  /**
   * Verifica se o bucket de documentos existe
   */
  async initializeBucket(): Promise<boolean> {
    try {
      console.log('🔍 Verificando buckets disponíveis...');
      
      // Verificar se o bucket existe (assumindo que foi criado manualmente)
      const { data: buckets, error: listError } = await supabase.storage.listBuckets();
      
      if (listError) {
        console.error('❌ Erro ao listar buckets:', listError);
        return false;
      }
      
      console.log('📋 Buckets encontrados:', buckets?.map(b => b.name));
      
      const bucketExists = buckets?.some(bucket => bucket.name === this.bucketName);
      
      if (bucketExists) {
        console.log('✅ Bucket "documentos" encontrado e pronto para uso');
        return true;
      } else {
        console.error(`❌ Bucket "${this.bucketName}" não encontrado.`);
        console.log('💡 Buckets disponíveis:', buckets?.map(b => b.name));
        console.log('💡 Crie um bucket com nome exato: "documentos" no painel do Supabase.');
        return false;
      }
    } catch (error) {
      console.error('❌ Erro ao verificar bucket:', error);
      return false;
    }
  }
  
  /**
   * Upload de um arquivo para o storage (sem verificar bucket - assume que existe)
   */
  async uploadFile(file: File, userId: string, documentType: string): Promise<UploadResult> {
    try {
      console.log('🚀 Fazendo upload direto (assumindo bucket existe)...');
      
      // Gerar nome único para o arquivo
      const fileExtension = file.name.split('.').pop();
      const fileName = `${documentType}_${Date.now()}_${uuidv4()}.${fileExtension}`;
      const filePath = `${userId}/${fileName}`;
      
      console.log('📁 Caminho do arquivo:', filePath);
      
      // Fazer upload do arquivo diretamente
      const { data, error } = await supabase.storage
        .from(this.bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (error) {
        console.error('❌ Erro no upload:', error);
        return { success: false, error: error.message };
      }
      
      console.log('✅ Upload realizado:', data);
      
      // Obter URL pública do arquivo (bucket público - sem necessidade de URL assinada)
      const { data: urlData } = await supabase.storage
        .from(this.bucketName)
        .getPublicUrl(filePath);
      
      console.log('🔗 URL gerada:', urlData?.publicUrl);
      
      return {
        success: true,
        url: urlData?.publicUrl,
        path: filePath
      };
      
    } catch (error) {
      console.error('❌ Erro no upload:', error);
      return { success: false, error: 'Erro interno no upload' };
    }
  }
  
  /**
   * Upload de documentos RG e CPF
   */
  async uploadDocuments(
    rgFile: File | null, 
    cpfFile: File | null, 
    userId: string
  ): Promise<DocumentUpload & { success: boolean; error?: string }> {
    try {
      const results: DocumentUpload = {};
      
      // Upload RG
      if (rgFile) {
        const rgResult = await this.uploadFile(rgFile, userId, 'rg');
        if (rgResult.success && rgResult.url) {
          results.rgUrl = rgResult.url;
        } else {
          return { success: false, error: `Erro no upload do RG: ${rgResult.error}` };
        }
      }
      
      // Upload CPF
      if (cpfFile) {
        const cpfResult = await this.uploadFile(cpfFile, userId, 'cpf');
        if (cpfResult.success && cpfResult.url) {
          results.cpfUrl = cpfResult.url;
        } else {
          return { success: false, error: `Erro no upload do CPF: ${cpfResult.error}` };
        }
      }
      
      return { success: true, ...results };
      
    } catch (error) {
      console.error('Erro no upload de documentos:', error);
      return { success: false, error: 'Erro interno no upload de documentos' };
    }
  }
  
  /**
   * Deletar arquivo do storage
   */
  async deleteFile(filePath: string): Promise<boolean> {
    try {
      const { error } = await supabase.storage
        .from(this.bucketName)
        .remove([filePath]);
      
      if (error) {
        console.error('Erro ao deletar arquivo:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Erro ao deletar arquivo:', error);
      return false;
    }
  }
  
  /**
   * Obter URL pública para visualizar documento
   */
  async getPublicUrl(filePath: string): Promise<string | null> {
    try {
      const { data } = await supabase.storage
        .from(this.bucketName)
        .getPublicUrl(filePath);
      
      return data?.publicUrl || null;
    } catch (error) {
      console.error('Erro ao obter URL:', error);
      return null;
    }
  }
  
  /**
   * Listar arquivos de um usuário
   */
  async listUserFiles(userId: string): Promise<string[]> {
    try {
      const { data, error } = await supabase.storage
        .from(this.bucketName)
        .list(userId);
      
      if (error) {
        console.error('Erro ao listar arquivos:', error);
        return [];
      }
      
      return data?.map(file => `${userId}/${file.name}`) || [];
    } catch (error) {
      console.error('Erro ao listar arquivos:', error);
      return [];
    }
  }
}

// Exportar instância única do serviço
export const storageService = new StorageService();
