-- Sistema flexível: qualquer usuário pode virar admin via banco
-- Execute no Supabase SQL Editor

-- 1. Função simples que cria perfil para QUALQUER usuário criado
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Criar perfil para TODOS os usuários criados
  -- A role será definida manualmente no banco pelos admins
  INSERT INTO public.profiles (id, email, name, role, is_active)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    'user',  -- Role padrão, admins alteram no banco depois
    false    -- Inativo por padrão, admins ativam no banco
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Recriar o trigger com a nova função
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- 3. Inserir seu perfil atual e ativá-lo como admin
INSERT INTO public.profiles (id, email, name, role, is_active)
VALUES (
  '51a44929-de72-4def-9b93-d27ebbc943ae',
  'gilsonfelipe.gt@gmail.com',
  'Gilson Felipe',
  'admin',
  true
)
ON CONFLICT (id) DO UPDATE SET
  role = 'admin',
  is_active = true;

-- 4. AGORA O CONTROLE É TODO SEU:
-- Para tornar alguém admin, você executa:
-- UPDATE profiles SET role = 'admin', is_active = true WHERE email = 'email@exemplo.com';

-- Para desativar alguém:
-- UPDATE profiles SET is_active = false WHERE email = 'email@exemplo.com';

-- Para ver todos os perfis:
-- SELECT * FROM profiles;
