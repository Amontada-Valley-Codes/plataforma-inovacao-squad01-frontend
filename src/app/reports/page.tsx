'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '../context/UserContext';
import { Reports } from '../../components/Reports';
import { Button } from '../../components/ui/button';

export default function ReportsPage() {
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

  // Apenas gestores e admins podem aceder a esta página
  if (user.role !== 'GESTOR' && user.role !== 'ADMIN') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-xl font-semibold">Acesso Negado</h2>
          <p className="text-gray-600">Você não tem permissão para visualizar os relatórios.</p>
          <Button onClick={() => router.push('/dashboard')}>Voltar ao Dashboard</Button>
        </div>
      </div>
    )
  }

  return (
    <Reports 
      user={user} 
      onNavigate={handleNavigate}
    />
  );
}