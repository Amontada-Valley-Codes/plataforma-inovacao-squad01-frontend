'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '../context/UserContext';
import { Collaborators } from '../../components/Collaborators';
import { Button } from '../../components/ui/button';

export default function CollaboratorsPage() {
  const { user, isAuthenticated } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.push('/');
    }
  }, [isAuthenticated, user, router]);

  const handleNavigate = (page: string) => {
    if (page === 'dashboard') {
      router.push('/dashboard');
    }
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  // Apenas gestores podem aceder a esta página
  if (user.role !== 'gestor') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Acesso Negado</h2>
          <p className="text-muted-foreground">Você não tem permissão para aceder a esta página.</p>
          <Button onClick={() => router.push('/dashboard')} className="mt-4">Voltar ao Dashboard</Button>
        </div>
      </div>
    )
  }

  return (
    <Collaborators 
      user={user} 
      onNavigate={handleNavigate}
    />
  );
}