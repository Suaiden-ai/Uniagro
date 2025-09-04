-- Script de Debug para verificar o que está acontecendo
-- Execute no Supabase SQL Editor para debugar

-- 1. Verificar se a tabela profiles existe
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'profiles';

-- 2. Verificar se existem registros na tabela profiles
SELECT * FROM profiles;

-- 3. Verificar se o trigger existe
SELECT trigger_name, event_manipulation, event_object_table 
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';

-- 4. Verificar se a função existe
SELECT routine_name, routine_type 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name = 'handle_new_admin_user';

-- 5. Verificar usuários criados em auth.users
SELECT id, email, created_at 
FROM auth.users 
ORDER BY created_at DESC 
LIMIT 5;

-- 6. Testar a função manualmente (substitua os valores pelos dados reais do usuário)
-- IMPORTANTE: Substitua 'SEU_USER_ID' e 'SEU_EMAIL' pelos valores reais
-- SELECT handle_new_admin_user();

-- 7. Verificar se há políticas RLS que podem estar bloqueando
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'profiles';
