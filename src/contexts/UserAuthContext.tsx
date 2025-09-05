import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';

interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: string;
  user_type: string;
  telefone?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface UserAuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string) => Promise<{ error?: any }>;
  signIn: (email: string, password: string) => Promise<{ error?: any }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error?: any }>;
}

const UserAuthContext = createContext<UserAuthContextType>({
  user: null,
  profile: null,
  loading: true,
  signUp: async () => ({}),
  signIn: async () => ({}),
  signOut: async () => {},
  updateProfile: async () => ({})
});

export const useUserAuth = () => {
  const context = useContext(UserAuthContext);
  if (!context) {
    throw new Error('useUserAuth must be used within a UserAuthProvider');
  }
  return context;
};

export const UserAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Função para salvar perfil no localStorage
  const saveProfileToStorage = (profile: UserProfile | null, userId: string) => {
    try {
      if (profile) {
        localStorage.setItem(`profile_${userId}`, JSON.stringify(profile));
        localStorage.setItem('profile_last_loaded', Date.now().toString());
      } else {
        localStorage.removeItem(`profile_${userId}`);
        localStorage.removeItem('profile_last_loaded');
      }
    } catch (error) {
      console.warn('Erro ao salvar perfil no localStorage:', error);
    }
  };

  // Função para carregar perfil do localStorage
  const loadProfileFromStorage = (userId: string): UserProfile | null => {
    try {
      const cached = localStorage.getItem(`profile_${userId}`);
      const lastLoaded = localStorage.getItem('profile_last_loaded');
      
      if (cached && lastLoaded) {
        const timeSinceLoaded = Date.now() - parseInt(lastLoaded);
        // Cache válido por 30 minutos (aumentei o tempo)
        if (timeSinceLoaded < 30 * 60 * 1000) {
          return JSON.parse(cached);
        }
      }
    } catch (error) {
      console.warn('Erro ao carregar perfil do localStorage:', error);
    }
    return null;
  };

  useEffect(() => {
    let mounted = true;
    
    // Verificar usuário atual
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          if (mounted) {
            setLoading(false);
          }
          return;
        }

        if (mounted) {
          const currentUser = session?.user ?? null;
          setUser(currentUser);
          
          if (currentUser) {
            // Primeiro verificar se já temos o perfil no cache
            const cachedProfile = loadProfileFromStorage(currentUser.id);
            if (cachedProfile) {
              setProfile(cachedProfile);
              setLoading(false);
            } else {
              await loadProfile(currentUser.id);
            }
          } else {
            setLoading(false);
          }
        }
      } catch (error) {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Removido o listener de visibilitychange que estava causando recarregamentos desnecessários

    // Escutar mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {      
      console.log('=== DEBUG AUTH STATE CHANGE ===');
      console.log('Event:', event);
      console.log('Session:', session);
      console.log('Current user:', session?.user);
      
      if (mounted) {
        const currentUser = session?.user ?? null;
        const userChanged = user?.id !== currentUser?.id;
        
        console.log('User changed:', userChanged);
        console.log('Current user ID:', currentUser?.id);
        console.log('Previous user ID:', user?.id);
        
        // Atualizar usuário sempre que houver mudança
        if (userChanged) {
          console.log('Atualizando usuário...');
          setUser(currentUser);
        }
        
        if (currentUser) {
          // Se usuário está logado, garantir que está no estado e carregar perfil
          console.log('Usuário logado, carregando perfil...');
          setUser(currentUser); // Garantir que o usuário está no estado
          setLoading(true);
          await loadProfile(currentUser.id);
        } else if (!currentUser) {
          console.log('Usuário deslogado, limpando estado...');
          setUser(null);
          setProfile(null);
          // Limpar cache quando usuário faz logout
          try {
            localStorage.clear();
          } catch (e) {
            console.warn('Erro ao limpar localStorage:', e);
          }
          setLoading(false);
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const loadProfile = async (userId: string) => {
    try {
      console.log('=== DEBUG LOADPROFILE ===');
      console.log('Carregando perfil para userId:', userId);
      
      // Primeiro, tentar carregar do cache
      const cachedProfile = loadProfileFromStorage(userId);
      if (cachedProfile) {
        console.log('Perfil encontrado no cache:', cachedProfile);
        setProfile(cachedProfile);
        setLoading(false);
        return;
      }

      // Remover esta verificação que está impedindo o carregamento
      // if (loading) {
      //   console.log('Já está carregando, saindo...');
      //   return;
      // }

      console.log('Iniciando carregamento do banco...');
      setLoading(true);

      // Se não há cache, carregar do banco
      // Timeout de 10 segundos (aumentei o tempo)
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Timeout')), 10000);
      });

      const queryPromise = supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      console.log('Executando query no banco...');
      const { data, error } = await Promise.race([queryPromise, timeoutPromise]);

      console.log('Resultado da query:', { data, error });

      if (error) {
        console.warn('Erro ao carregar perfil:', error);
        setProfile(null);
        saveProfileToStorage(null, userId);
      } else {
        console.log('Perfil carregado com sucesso:', data);
        setProfile(data);
        saveProfileToStorage(data, userId);
      }
    } catch (error) {
      console.warn('Erro ao carregar perfil:', error);
      setProfile(null);
      saveProfileToStorage(null, userId);
    } finally {
      setLoading(false);
    }
  };

  const createProfileFromUser = async (userId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Priorizar user_metadata.name, depois user_metadata.nome, depois email
        const userName = user.user_metadata?.name || 
                        user.user_metadata?.nome || 
                        user.email?.split('@')[0] || 
                        'Usuário';
        
        const newProfile = {
          id: userId,
          email: user.email || '',
          name: userName,
          role: 'user',
          user_type: 'cliente',
          is_active: true
        };

        const { error } = await supabase
          .from('profiles')
          .insert(newProfile);

        if (error) {
          console.error('Erro ao criar perfil:', error);
          throw error;
        }
      }
    } catch (error) {
      console.error('Erro ao criar perfil automaticamente:', error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            nome: name // Compatibilidade
          }
        }
      });

      return { error };
    } catch (error) {
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('=== DEBUG SIGNIN ===');
      console.log('Tentando fazer login com:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      console.log('Resultado do login:', { data, error });

      return { error };
    } catch (error) {
      console.log('Erro no login:', error);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      // Limpar estado local
      setUser(null);
      setProfile(null);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user?.id);

      if (error) throw error;
      
      if (profile && user) {
        const updatedProfile = { ...profile, ...updates };
        setProfile(updatedProfile);
        saveProfileToStorage(updatedProfile, user.id);
      }

      return {};
    } catch (error) {
      return { error };
    }
  };

  const value = {
    user,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile
  };

  return (
    <UserAuthContext.Provider value={value}>
      {children}
    </UserAuthContext.Provider>
  );
};
