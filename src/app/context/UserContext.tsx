'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { setAuthHeader } from '../../service/Api';

export type UserRole = 'COMUM' | 'AVALIADOR' | 'GESTOR' | 'ADMIN';

export interface User {
  sub: string;
  name: string;
  email: string;
  role: UserRole;
  companyId: string;
  image_url?: string; // ✨ NOVO CAMPO ADICIONADO AQUI
}

export interface Challenge {
// ... (restante da interface Challenge)
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  area: string;
  description: string;
  type: 'INTERNO' | 'PUBLICO';
  company: string;
  status: 'ATIVO' | 'FINALIZADO' | 'RASCUNHO';
}

export interface Startup {
// ... (restante da interface Startup)
  id: string;
  name: string;
  segment: string;
  stage: 'ideacao' | 'operacao' | 'tracao' | 'escala';
  technology: string;
  problem: string;
  description: string;
  matchScore?: number;
}

interface UserContextType {
  user: User | null;
  setUser: (data: { user: User, token: string } | null) => void;
  isAuthenticated: boolean;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
// ... (restante do UserProvider)
  const [user, setUserState] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  

    useEffect(() => {
    // Ao carregar a aplicação, verifique se há um token guardado
    const token = localStorage.getItem('innovate_token');
    const storedUser = localStorage.getItem('innovate_user');
    
    if (token && storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUserState(userData);
        setIsAuthenticated(true);
        setAuthHeader(token); // Configure o cabeçalho do Axios
      } catch (error) {
        // Limpa em caso de dados corrompidos
        logout();
      }
    }
  }, []);

    const setUser = (data: { user: User, token: string } | null) => {
    if (data) {
      const { user, token } = data;
      localStorage.setItem('innovate_token', token);
      localStorage.setItem('innovate_user', JSON.stringify(user));
      setUserState(user);
      setIsAuthenticated(true);
      setAuthHeader(token); // Configure o cabeçalho do Axios no login
    } else {
      logout();
    }
  };
  
  const logout = () => {
    localStorage.removeItem('innovate_token');
    localStorage.removeItem('innovate_user');
    setUserState(null);
    setIsAuthenticated(false);
    setAuthHeader(null); // Limpe o cabeçalho do Axios no logout
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      setUser, 
      isAuthenticated,
      logout
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}