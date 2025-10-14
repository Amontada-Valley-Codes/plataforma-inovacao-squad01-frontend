// /plat_inovacao/src/app/startups/new/page.tsx

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '../../context/UserContext';
import { StartupForm } from '../../../components/StartupForm';
import Loading from '../../loading';

export default function NewStartupPage() {
  const { user, isAuthenticated } = useUser();
  const router = useRouter();

  useEffect(() => {
    // Se não estiver autenticado ou se o utilizador não for admin, redireciona
    if (!isAuthenticated || (user && user.role !== 'ADMIN')) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, user, router]);

  const handleNavigate = (page: string) => {
    if (page === 'dashboard') {
      router.push('/dashboard');
    }
  };

  // Mostra o loading enquanto verifica as permissões
  if (!isAuthenticated || !user) {
    return <Loading />;
  }

  // Se não for admin, não renderiza nada antes de redirecionar
  if (user.role !== 'ADMIN') {
      return null;
  }

  return (
    <StartupForm 
      user={user} 
      onNavigate={handleNavigate}
    />
  );
}