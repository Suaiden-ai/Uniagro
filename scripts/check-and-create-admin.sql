-- Script para verificar e criar usuários admin
-- Execute no Supabase SQL Editor

-- 1. Verificar usuários existentes na tabela profiles
SELECT id, email, name, role, user_type, is_active 
FROM profiles 
ORDER BY created_at;

-- 2. Se você quiser transformar um usuário existente em admin, 
-- substitua 'SEU_EMAIL_AQUI' pelo email do usuário:
-- UPDATE profiles 
-- SET role = 'admin', user_type = 'admin' 
-- WHERE email = 'gilsonfelipe.gt@gmail.com';

-- 3. Verificar novamente após a atualização
-- SELECT id, email, name, role, user_type, is_active 
-- FROM profiles 
-- WHERE email = 'gilsonfelipe.gt@gmail.com';

-- 4. Para criar um novo usuário admin diretamente (apenas para teste):
-- IMPORTANTE: Isso bypass o sistema de auth normal, use apenas para teste
-- INSERT INTO auth.users (
--     id, 
--     instance_id, 
--     aud, 
--     role,
--     email,
--     encrypted_password,
--     email_confirmed_at,
--     raw_app_meta_data,
--     raw_user_meta_data,
--     created_at,
--     updated_at,
--     confirmation_token,
--     email_change,
--     email_change_token_new,
--     recovery_token
-- ) VALUES (
--     gen_random_uuid(),
--     '00000000-0000-0000-0000-000000000000',
--     'authenticated',
--     'authenticated',
--     'admin@uniagro.com',
--     crypt('123456', gen_salt('bf')),
--     NOW(),
--     '{"provider": "email", "providers": ["email"]}',
--     '{"name": "Admin Uniagro"}',
--     NOW(),
--     NOW(),
--     '',
--     '',
--     '',
--     ''
-- );
