import React, { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { ChallengeForm } from './components/ChallengeForm';
import { StartupDatabase } from './components/StartupDatabase';
import { ChallengeDetails } from './components/ChallengeDetails';
import { Login } from './components/Login';

export type UserRole = 'comum' | 'avaliador' | 'gestor';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  company: string;
}

export interface Challenge {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  area: string;
  description: string;
  type: 'interno' | 'publico';
  company: string;
  status: 'ativo' | 'finalizado' | 'rascunho';
}

export interface Startup {
  id: string;
  name: string;
  segment: string;
  stage: 'ideacao' | 'operacao' | 'tracao' | 'escala';
  technology: string;
  problem: string;
  description: string;
  matchScore?: number;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<'login' | 'dashboard' | 'challenge-form' | 'startup-database' | 'challenge-details'>('login');
  const [user, setUser] = useState<User | null>(null);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);

  const handleLogin = (userData: User) => {
    setUser(userData);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('login');
  };

  const handleNavigate = (page: typeof currentPage, challenge?: Challenge) => {
    if (challenge) setSelectedChallenge(challenge);
    setCurrentPage(page);
  };

  if (currentPage === 'login' || !user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-background">
      {currentPage === 'dashboard' && (
        <Dashboard
          user={user} 
          onNavigate={handleNavigate} 
          onLogout={handleLogout}
        />
      )}
      {currentPage === 'challenge-form' && (
        <ChallengeForm 
          user={user} 
          onNavigate={handleNavigate}
        />
      )}
      {currentPage === 'startup-database' && (
        <StartupDatabase 
          user={user} 
          onNavigate={handleNavigate}
        />
      )}
      {currentPage === 'challenge-details' && selectedChallenge && (
        <ChallengeDetails 
          user={user} 
          challenge={selectedChallenge}
          onNavigate={handleNavigate}
        />
      )}
    </div>
  );
}