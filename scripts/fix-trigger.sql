-- Script alternativo para corrigir problemas do trigger
-- Execute este se o primeiro não funcionou

-- Recriar a função com mais logs para debug
CREATE OR REPLACE FUNCTION handle_new_admin_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Log para debug (aparecerá nos logs do Supabase)
  RAISE LOG 'Trigger executado para email: %', NEW.email;
  
  -- Verificar se o email está na lista de administradores permitidos
  IF NEW.email IN (
    'admin@uniagro.com',
    'gestor@uniagro.com', 
    'analista@uniagro.com'
  ) THEN
    
    RAISE LOG 'Email autorizado, criando perfil para: %', NEW.email;
    
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
    
    RAISE LOG 'Perfil criado com sucesso para: %', NEW.email;
  ELSE
    RAISE LOG 'Email não autorizado: %', NEW.email;
  END IF;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE LOG 'Erro ao criar perfil: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recriar o trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_admin_user();

-- Inserir manualmente se o trigger não funcionou
-- IMPORTANTE: Execute apenas se você já criou um usuário e ele não apareceu na tabela
-- Substitua os valores pelos dados reais do usuário criado

-- Primeiro, pegue os dados do usuário criado:
-- SELECT id, email FROM auth.users WHERE email = 'SEU_EMAIL_AQUI';

-- Depois execute o INSERT manual (descomente e ajuste):
/*
INSERT INTO public.profiles (id, email, name, role, is_active)
VALUES (
  'UUID_DO_USUARIO_AQUI',  -- Cole o ID do usuário aqui
  'admin@uniagro.com',     -- Email do usuário
  'Administrador',         -- Nome
  'admin',                 -- Role
  true                     -- Ativo
);
*/
