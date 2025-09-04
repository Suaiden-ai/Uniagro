-- Script para criar a tabela profiles integrada com Supabase Authentication
-- Execute este script no Supabase SQL Editor

-- Criar tabela profiles se não existir (integrada com auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'admin',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índice no email para performance
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_active ON profiles(is_active);

-- Função para atualizar o updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para atualizar updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Função para criar perfil admin automaticamente quando um usuário for criado
CREATE OR REPLACE FUNCTION handle_new_admin_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Verificar se o email está na lista de administradores permitidos
  IF NEW.email IN (
    'admin@uniagro.com',
    'gestor@uniagro.com', 
    'analista@uniagro.com'
  ) THEN
    INSERT INTO profiles (id, email, name, role, is_active)
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

-- Trigger para criar perfil automaticamente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_admin_user();

-- Configurar RLS (Row Level Security) para a tabela profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Política para permitir que usuários autenticados vejam apenas seu próprio perfil
CREATE POLICY "Users can view own admin profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Política para permitir que usuários autenticados atualizem apenas seu próprio perfil
CREATE POLICY "Users can update own admin profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- INSTRUÇÕES PARA CRIAR CONTAS ADMIN:
-- 1. Vá para Authentication > Users no Supabase Dashboard
-- 2. Clique em "Add user" 
-- 3. Crie contas com estes emails:
--    - admin@uniagro.com (será role: admin)
--    - gestor@uniagro.com (será role: gestor) 
--    - analista@uniagro.com (será role: analista)
-- 4. A tabela profiles será populada automaticamente!
