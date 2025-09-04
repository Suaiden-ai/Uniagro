-- Script para testar consulta específica do usuário
-- Execute no Supabase SQL Editor usando o ID que aparece no log

-- Testar a consulta exata que está sendo feita
SELECT * FROM profiles WHERE id = 'c7132f45-9a24-4bfa-b013-241cae3b3341';

-- Verificar se existe o usuário na tabela auth
SELECT id, email, email_confirmed_at FROM auth.users WHERE id = 'c7132f45-9a24-4bfa-b013-241cae3b3341';

-- Verificar se há algum problema de RLS específico
SET LOCAL auth.uid = 'c7132f45-9a24-4bfa-b013-241cae3b3341';
SELECT * FROM profiles WHERE id = 'c7132f45-9a24-4bfa-b013-241cae3b3341';
