-- Script para corrigir o problema do RLS
-- Execute no Supabase SQL Editor

-- 1. Adicionar política para INSERT (permite que o sistema crie perfis automaticamente)
CREATE POLICY "System can insert admin profiles" ON profiles
  FOR INSERT WITH CHECK (true);

-- 2. Recriar a função com SECURITY DEFINER para contornar RLS
CREATE OR REPLACE FUNCTION handle_new_admin_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Verificar se o email está na lista de administradores permitidos
  IF NEW.email IN (
    'admin@uniagro.com',
    'gestor@uniagro.com', 
    'analista@uniagro.com'
  ) THEN
    -- Usar SECURITY DEFINER bypassa RLS durante a inserção
    INSERT INTO public.profiles (id, email, name, role, is_active)
    VALUES (
      NEW.id,
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
      CASE
        WHEN NEW.email = 'admin@uniagro.com' THEN 'admin'
        WHEN NEW.email = 'gestor@uniagro.com' THEN 'gestor'
        WHEN NEW.email = 'analista@uniagro.com' THEN 'analista'
        ELSE 'admin'
      END,
      true
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Inserir manualmente o perfil para o usuário já criado
-- Primeiro, vamos ver qual usuário foi criado:
SELECT id, email, created_at FROM auth.users ORDER BY created_at DESC LIMIT 3;

-- 4. Agora insira o perfil manualmente (DESCOMENTE e ajuste o UUID):
/*
INSERT INTO public.profiles (id, email, name, role, is_active)
VALUES (
  'COLE_O_UUID_DO_USUARIO_AQUI',
  'admin@uniagro.com',  -- ou o email que você criou
  'Administrador Uniagro',
  'admin',
  true
);
*/
