-- Script para configurar sistema de usuários
-- Execute no Supabase SQL Editor

-- 1. Verificar estrutura atual da tabela profiles
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'profiles' AND table_schema = 'public'
ORDER BY column_name;

-- 2. Adicionar campos necessários para usuários comuns
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS telefone VARCHAR(20);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS user_type VARCHAR(20) DEFAULT 'user';

-- 3. Verificar se os campos foram adicionados
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'profiles' AND table_schema = 'public'
ORDER BY column_name;

-- 4. Criar/atualizar função para criar perfis automaticamente
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Criar perfil para TODOS os usuários criados via auth
  INSERT INTO public.profiles (id, email, name, role, user_type, is_active)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'nome', split_part(NEW.email, '@', 1)),
    'user',    -- Role padrão para usuários comuns
    'user',    -- Tipo de usuário
    true       -- Usuários comuns são ativos por padrão
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Criar trigger para chamar a função quando usuário é criado
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- 6. Modificar tabela cadastro_inicial para referenciar usuários
ALTER TABLE cadastro_inicial ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);
CREATE INDEX IF NOT EXISTS idx_cadastro_inicial_user_id ON cadastro_inicial(user_id);

-- 7. Habilitar RLS na tabela cadastro_inicial
ALTER TABLE cadastro_inicial ENABLE ROW LEVEL SECURITY;

-- 8. Remover políticas antigas se existirem
DROP POLICY IF EXISTS "Users can view own forms" ON cadastro_inicial;
DROP POLICY IF EXISTS "Users can insert own forms" ON cadastro_inicial;
DROP POLICY IF EXISTS "Users can update own forms" ON cadastro_inicial;
DROP POLICY IF EXISTS "Admins can view all forms" ON cadastro_inicial;

-- 9. Criar novas políticas de RLS
-- Usuários podem ver apenas seus próprios formulários
CREATE POLICY "Users can view own forms" ON cadastro_inicial
  FOR SELECT USING (auth.uid() = user_id);

-- Usuários podem inserir apenas com seu próprio user_id
CREATE POLICY "Users can insert own forms" ON cadastro_inicial
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Usuários podem atualizar apenas seus próprios formulários
CREATE POLICY "Users can update own forms" ON cadastro_inicial
  FOR UPDATE USING (auth.uid() = user_id);

-- Admins podem ver todos os formulários
CREATE POLICY "Admins can view all forms" ON cadastro_inicial
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'gestor', 'analista')
      AND is_active = true
    )
  );

-- 10. Permitir inserção de formulários sem user_id (para compatibilidade com formulários anônimos)
CREATE POLICY "Allow anonymous forms" ON cadastro_inicial
  FOR INSERT WITH CHECK (user_id IS NULL);

CREATE POLICY "View anonymous forms for admins" ON cadastro_inicial
  FOR SELECT USING (
    user_id IS NULL AND EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'gestor', 'analista')
      AND is_active = true
    )
  );

-- 11. Adicionar comentários explicativos
COMMENT ON COLUMN profiles.user_type IS 'Tipo do usuário: user (usuário comum) ou admin (administrador)';
COMMENT ON COLUMN profiles.role IS 'Role do usuário: user, admin, gestor, analista';
COMMENT ON COLUMN cadastro_inicial.user_id IS 'FK para auth.users - NULL para formulários anônimos';

-- 12. Verificação final - listar estrutura das tabelas modificadas
SELECT 'profiles' as tabela, column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'profiles' AND table_schema = 'public'
UNION ALL
SELECT 'cadastro_inicial' as tabela, column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'cadastro_inicial' AND table_schema = 'public' AND column_name = 'user_id'
ORDER BY tabela, column_name;
