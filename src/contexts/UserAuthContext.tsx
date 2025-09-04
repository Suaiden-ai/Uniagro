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
      if (mounted) {
        const currentUser = session?.user ?? null;
        const userChanged = user?.id !== currentUser?.id;
        
        // Só atualizar o estado se realmente houver mudança
        if (userChanged) {
          setUser(currentUser);
        }
        
        if (currentUser && userChanged) {
          // Só recarregar perfil se o usuário realmente mudou
          setLoading(true);
          await loadProfile(currentUser.id);
        } else if (!currentUser && userChanged) {
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
      // Primeiro, tentar carregar do cache
      const cachedProfile = loadProfileFromStorage(userId);
      if (cachedProfile) {
        setProfile(cachedProfile);
        setLoading(false);
        return;
      }

      // Se já estamos carregando, não iniciar outro carregamento
      if (loading) {
        return;
      }

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

      const { data, error } = await Promise.race([queryPromise, timeoutPromise]);

      if (error) {
        console.warn('Erro ao carregar perfil:', error);
        setProfile(null);
        saveProfileToStorage(null, userId);
      } else {
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
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      return { error };
    } catch (error) {
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
