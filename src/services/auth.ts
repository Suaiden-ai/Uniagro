import { supabase } from '@/lib/supabase';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
  is_active: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  user?: AdminUser;
  error?: string;
}

export const authenticateAdmin = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    const { email, password } = credentials;

    // Validação básica
    if (!email || !password) {
      return {
        success: false,
        error: 'Email e senha são obrigatórios'
      };
    }

    // Fazer login usando Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !authData.user) {
      return {
        success: false,
        error: 'Email ou senha incorretos'
      };
    }

    // Buscar dados do perfil admin
    const { data: adminUser, error: profileError } = await supabase
      .from('profiles')
      .select('id, email, name, role, is_active')
      .eq('id', authData.user.id)
      .eq('is_active', true)
      .single();

    if (profileError || !adminUser) {
      // Se não encontrou na tabela profiles, não é um admin autorizado
      await supabase.auth.signOut();
      return {
        success: false,
        error: 'Acesso não autorizado para administração'
      };
    }

    return {
      success: true,
      user: adminUser
    };

  } catch (error) {
    console.error('Erro na autenticação:', error);
    return {
      success: false,
      error: 'Erro interno do servidor'
    };
  }
};

export const validateToken = async (): Promise<AdminUser | null> => {
  try {
    // Verificar se há sessão ativa no Supabase
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session?.user) {
      return null;
    }

    // Buscar dados do perfil admin
    const { data: adminUser, error: profileError } = await supabase
      .from('profiles')
      .select('id, email, name, role, is_active')
      .eq('id', session.user.id)
      .eq('is_active', true)
      .single();

    if (profileError || !adminUser) {
      return null;
    }

    // Verificar se o usuário tem role de admin
    const isAdminRole = adminUser.role && ['admin', 'gestor', 'analista'].includes(adminUser.role);
    if (!isAdminRole) {
      return null;
    }

    return adminUser;
  } catch (error) {
    console.error('Erro na validação do token:', error);
    return null;
  }
};

export const logoutAdmin = async (): Promise<void> => {
  try {
    await supabase.auth.signOut();
  } catch (error) {
    console.error('Erro no logout:', error);
  }
};
