-- Script para verificar e ajustar políticas RLS da tabela profiles
-- Execute no Supabase SQL Editor

-- 1. Verificar se RLS está habilitado na tabela profiles
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'profiles';

-- 2. Listar políticas existentes na tabela profiles
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'profiles';

-- 3. Verificar se a tabela profiles tem RLS habilitado
-- Se não tiver, habilitar:
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 4. Remover políticas antigas se existirem
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON profiles;

-- 5. Criar políticas mais permissivas para debug
-- Permitir que usuários vejam seu próprio perfil
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Permitir que usuários atualizem seu próprio perfil  
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Permitir inserção de perfis para usuários autenticados
CREATE POLICY "Enable insert for authenticated users only" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 6. Política adicional para permitir que o trigger funcione
-- (necessário para a função handle_new_user)
CREATE POLICY "Enable insert for service role" ON profiles
  FOR INSERT WITH CHECK (true);

-- 7. Verificar novamente as políticas
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'profiles';

-- 8. Testar acesso - esta consulta deve retornar o perfil do usuário logado
-- SELECT * FROM profiles WHERE id = auth.uid();
