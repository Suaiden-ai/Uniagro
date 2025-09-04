-- Adicionar seu email à lista de administradores autorizados
-- Execute no Supabase SQL Editor

-- 1. Atualizar a função para incluir seu email
CREATE OR REPLACE FUNCTION handle_new_admin_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Verificar se o email está na lista de administradores permitidos
  IF NEW.email IN (
    'admin@uniagro.com',
    'gestor@uniagro.com', 
    'analista@uniagro.com',
    'gilsonfelipe.gt@gmail.com'  -- Seu email adicionado
  ) THEN
    INSERT INTO public.profiles (id, email, name, role, is_active)
    VALUES (
      NEW.id,
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
      CASE
        WHEN NEW.email = 'admin@uniagro.com' THEN 'admin'
        WHEN NEW.email = 'gestor@uniagro.com' THEN 'gestor'
        WHEN NEW.email = 'analista@uniagro.com' THEN 'analista'
        WHEN NEW.email = 'gilsonfelipe.gt@gmail.com' THEN 'admin'  -- Você como admin
        ELSE 'admin'
      END,
      true
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Inserir manualmente seu perfil existente
INSERT INTO public.profiles (id, email, name, role, is_active)
VALUES (
  '51a44929-de72-4def-9b93-d27ebbc943ae',
  'gilsonfelipe.gt@gmail.com',
  'Gilson Felipe',
  'admin',
  true
);
