-- Script para corrigir problema do campo timestamp_cadastro imutável
-- Execute no Supabase SQL Editor

-- 1. Verificar se existe algum trigger que está causando o problema
SELECT 
  trigger_name,
  event_manipulation,
  action_statement,
  action_timing
FROM information_schema.triggers 
WHERE event_object_table = 'cadastro_inicial';

-- 2. Verificar constraints na tabela
SELECT 
  tc.constraint_name,
  tc.constraint_type,
  ccu.column_name
FROM information_schema.table_constraints tc
JOIN information_schema.constraint_column_usage ccu 
  ON tc.constraint_name = ccu.constraint_name
WHERE tc.table_name = 'cadastro_inicial' 
  AND tc.table_schema = 'public';

-- 3. Verificar se existe alguma função que está impedindo a atualização do timestamp_cadastro
SELECT 
  routine_name,
  routine_definition
FROM information_schema.routines 
WHERE routine_schema = 'public' 
  AND routine_definition ILIKE '%timestamp_cadastro%';

-- 4. Se existir um trigger problemático, vamos removê-lo
-- (Execute apenas se o trigger for encontrado no passo 1)
-- DROP TRIGGER IF EXISTS nome_do_trigger_problematico ON cadastro_inicial;

-- 5. Verificar se o campo timestamp_cadastro tem alguma configuração especial
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default,
  is_identity,
  identity_generation
FROM information_schema.columns 
WHERE table_name = 'cadastro_inicial' 
  AND table_schema = 'public'
  AND column_name = 'timestamp_cadastro';

-- 6. Se necessário, recriar o campo timestamp_cadastro sem restrições
-- (Execute apenas se necessário)
-- ALTER TABLE cadastro_inicial ALTER COLUMN timestamp_cadastro DROP NOT NULL;
-- ALTER TABLE cadastro_inicial ALTER COLUMN timestamp_cadastro SET DEFAULT NOW();

-- 7. Verificar se há alguma política RLS que está causando o problema
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'cadastro_inicial';

-- 8. Teste simples para verificar se a atualização funciona
-- (Execute apenas para teste - substitua o user_id pelo ID real)
-- UPDATE cadastro_inicial 
-- SET nome_completo = nome_completo 
-- WHERE user_id = 'c7132f45-9a24-4bfa-b013-241cae3b3341';
