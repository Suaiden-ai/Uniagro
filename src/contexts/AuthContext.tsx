import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { authenticateAdmin, validateToken, generateToken, AdminUser, LoginCredentials } from '@/services/auth';

interface AuthContextType {
  isAuthenticated: boolean;
  user: AdminUser | null;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Verificar se já está autenticado no localStorage ao carregar
  useEffect(() => {
    const checkAuthStatus = async () => {
      setLoading(true);
      
      try {
        const savedToken = localStorage.getItem('uniagro_admin_token');
        const savedAuth = localStorage.getItem('uniagro_admin_auth');
        
        if (savedToken && savedAuth) {
          const authData = JSON.parse(savedAuth);
          
          // Verificar se o token não expirou (24 horas)
          const now = new Date().getTime();
          const tokenAge = now - (authData.timestamp || 0);
          const maxAge = 24 * 60 * 60 * 1000; // 24 horas
          
          if (tokenAge < maxAge) {
            // Validar token no servidor
            const validUser = await validateToken(savedToken);
            
            if (validUser) {
              setIsAuthenticated(true);
              setUser(validUser);
            } else {
              // Token inválido, limpar
              localStorage.removeItem('uniagro_admin_token');
              localStorage.removeItem('uniagro_admin_auth');
            }
          } else {
            // Token expirado, limpar
            localStorage.removeItem('uniagro_admin_token');
            localStorage.removeItem('uniagro_admin_auth');
          }
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        // Em caso de erro, limpar dados
        localStorage.removeItem('uniagro_admin_token');
        localStorage.removeItem('uniagro_admin_auth');
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      const response = await authenticateAdmin(credentials);
      
      if (response.success && response.user) {
        setIsAuthenticated(true);
        setUser(response.user);
        
        // Gerar e salvar token
        const token = generateToken(response.user);
        
        localStorage.setItem('uniagro_admin_token', token);
        localStorage.setItem('uniagro_admin_auth', JSON.stringify({
          isAuthenticated: true,
          user: response.user,
          timestamp: new Date().getTime()
        }));
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Erro no login:', error);
      return false;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('uniagro_admin_token');
    localStorage.removeItem('uniagro_admin_auth');
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      user,
      login,
      logout,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};
