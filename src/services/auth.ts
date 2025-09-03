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

// Função simples para hash de senha (em produção, use bcrypt no backend)
const simpleHash = (password: string): string => {
  // Esta é uma implementação simples para desenvolvimento
  // Em produção, use bcrypt ou outra biblioteca segura no backend
  return btoa(password + 'uniagro_salt');
};

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

    // Validação de formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        success: false,
        error: 'Formato de email inválido'
      };
    }

    // Usuários de teste com validação real
    const testUsers = [
      { 
        email: 'admin@uniagro.com', 
        password: 'admin123', 
        user: { id: '1', email: 'admin@uniagro.com', name: 'Administrador Uniagro', role: 'admin', is_active: true }
      },
      { 
        email: 'gestor@uniagro.com', 
        password: 'gestor123',
        user: { id: '2', email: 'gestor@uniagro.com', name: 'Gestor Uniagro', role: 'manager', is_active: true }
      },
      { 
        email: 'analista@uniagro.com', 
        password: 'analista123',
        user: { id: '3', email: 'analista@uniagro.com', name: 'Analista Uniagro', role: 'analyst', is_active: true }
      }
    ];

    const validUser = testUsers.find(
      u => u.email === email.toLowerCase() && u.password === password
    );

    if (!validUser) {
      return {
        success: false,
        error: 'Email ou senha incorretos'
      };
    }

    return {
      success: true,
      user: validUser.user
    };

  } catch (error) {
    console.error('Erro na autenticação:', error);
    return {
      success: false,
      error: 'Erro interno do servidor'
    };
  }
};

export const validateToken = async (token: string): Promise<AdminUser | null> => {
  try {
    // Validar se o token está no formato correto (base64)
    const decoded = atob(token);
    const userData = JSON.parse(decoded);
    
    // Verificar se o usuário ainda existe e está ativo
    const { data: adminData, error } = await supabase
      .from('admin_users')
      .select('id, email, name, role, is_active')
      .eq('id', userData.id)
      .eq('is_active', true)
      .single();

    if (error || !adminData) {
      return null;
    }

    return adminData;
  } catch (error) {
    return null;
  }
};

export const generateToken = (user: AdminUser): string => {
  // Gerar token simples (em produção, use JWT)
  const tokenData = {
    id: user.id,
    email: user.email,
    timestamp: Date.now()
  };
  
  return btoa(JSON.stringify(tokenData));
};
