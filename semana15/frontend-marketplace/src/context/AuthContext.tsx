'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType } from '@/types/auth';
import { 
  login as apiLogin, 
  register as apiRegister, 
  getMe, 
  saveToken, 
  getToken, 
  removeToken 
} from '@/utils/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Restaurar sesión al montar
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const savedToken = getToken();
        if (savedToken) {
          setToken(savedToken);
          const response = await getMe();
          if (response.success) {
            setUser(response.data);
          } else {
            removeToken();
            setToken(null);
          }
        }
      } catch (err) {
        console.error('Error restaurando sesión:', err);
        removeToken();
        setToken(null);
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiLogin(email, password);
      if (response.success) {
        saveToken(response.data.token);
        setToken(response.data.token);
        setUser(response.data.user);
        return response.data.user;
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al iniciar sesión';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiRegister(email, password);
      if (response.success) {
        saveToken(response.data.token);
        setToken(response.data.token);
        setUser(response.data.user);
        return response.data.user;
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al registrar usuario';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    removeToken();
    setToken(null);
    setUser(null);
    setError(null);
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    login,
    register,
    logout,
    isLoading,
    error
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
