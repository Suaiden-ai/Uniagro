-- Script para verificar perfil do usuário atual
-- Execute no Supabase SQL Editor

-- 1. Verificar se existe perfil para o usuário logado
SELECT 
    id,
    email, 
    name,
    role,
    user_type,
    is_active,
    created_at
FROM profiles 
WHERE email = 'gilsonfelipe.gt@gmail.com';

-- 2. Se não existir perfil, criar um manualmente
-- (substitua os dados pelos seus)
INSERT INTO profiles (
    id, 
    email, 
    name, 
    role, 
    user_type, 
    is_active
) 
SELECT 
    auth.users.id,
    'gilsonfelipe.gt@gmail.com',
    'Gilson Felipe',
    'admin',
    'admin',
    true
FROM auth.users 
WHERE auth.users.email = 'gilsonfelipe.gt@gmail.com'
AND NOT EXISTS (
    SELECT 1 FROM profiles WHERE email = 'gilsonfelipe.gt@gmail.com'
);

-- 3. Verificar novamente após inserção
SELECT 
    id,
    email, 
    name,
    role,
    user_type,
    is_active,
    created_at
FROM profiles 
WHERE email = 'gilsonfelipe.gt@gmail.com';
