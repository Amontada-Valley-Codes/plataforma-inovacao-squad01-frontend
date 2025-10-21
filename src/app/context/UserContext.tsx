'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
export type UserRole = 'COMUM' | 'AVALIADOR' | 'GESTOR' | 'ADMIN'| 'STARTUP';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  company: string; // O nome da empresa
  companyId?: string; // <-- ADICIONE ESTA LINHA (opcional para não quebrar outras partes)
  image_url?: string;
  access_token?: string;
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
  status: 'ativo' | 'finalizado' | 'rascunho';
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

export interface Idea {
// ... (restante da interface Idea)
  id: string;
  title: string;
  description: string;
  challengeId: string;
  authorId: string;
  stage: string;
  priority: string;
  votes: number;
  comments: number;
  createdAt: string;
  updatedAt: string;
  status: 'submetida' | 'em_avaliacao' | 'aprovada' | 'rejeitada';
}

interface UserContextType {
// ... (restante do UserContextType)
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
// ... (restante do UserProvider)
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is stored in localStorage on mount
    const storedUser = localStorage.getItem('innovate_user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        localStorage.removeItem('innovate_user');
      }
    }
  }, []);

  const handleSetUser = (userData: User | null) => {
    setUser(userData);
    setIsAuthenticated(!!userData);
    
    if (userData) {
      localStorage.setItem('innovate_user', JSON.stringify(userData));
    } else {
      localStorage.removeItem('innovate_user');
    }
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      setUser: handleSetUser, 
      isAuthenticated 
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