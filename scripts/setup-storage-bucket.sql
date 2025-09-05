-- Script para configurar o Storage bucket para documentos

-- IMPORTANTE: Este script deve ser executado no SQL Editor do Supabase
-- As políticas RLS para storage.objects devem ser criadas via interface web

-- 1. Criar bucket (isso deve ser feito via JavaScript/código ou interface web)
-- Via código: supabase.storage.createBucket('documentos', { public: false })
-- Via interface: Storage > Create Bucket > Nome: "documentos" > Public: false

-- 2. Configurar políticas RLS para o bucket 'documentos'
-- ATENÇÃO: Execute estas políticas na interface do Supabase Storage, não via SQL

/*
  Políticas que devem ser criadas via interface web do Supabase Storage:
  
  1. "Usuários podem ver seus próprios documentos"
     Operação: SELECT
     Target roles: authenticated
     Policy definition: (storage.foldername(name))[1] = auth.uid()::text
  
  2. "Usuários podem fazer upload em suas pastas"
     Operação: INSERT
     Target roles: authenticated
     Policy definition: (storage.foldername(name))[1] = auth.uid()::text
  
  3. "Usuários podem atualizar seus documentos"
     Operação: UPDATE
     Target roles: authenticated
     Policy definition: (storage.foldername(name))[1] = auth.uid()::text
  
  4. "Usuários podem deletar seus documentos"
     Operação: DELETE
     Target roles: authenticated
     Policy definition: (storage.foldername(name))[1] = auth.uid()::text
  
  5. "Admins podem ver todos os documentos"
     Operação: SELECT
     Target roles: authenticated
     Policy definition: 
     EXISTS (
       SELECT 1 FROM profiles 
       WHERE profiles.id = auth.uid() 
       AND profiles.role = 'admin' 
       AND profiles.is_active = true
     )
*/

-- Como alternativa, você pode tentar criar as políticas via RPC (se disponível):
-- Mas geralmente é mais fácil usar a interface web do Supabase

-- Verificar se o bucket foi criado (execute após criar via interface)
SELECT name, public, file_size_limit, allowed_mime_types, created_at
FROM storage.buckets 
WHERE name = 'documentos';

-- Verificar as políticas criadas (execute após criar via interface)
SELECT policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage'
AND policyname LIKE '%document%';
