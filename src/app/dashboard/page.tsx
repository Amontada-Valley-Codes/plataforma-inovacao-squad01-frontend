'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '../context/UserContext';
import dynamic from 'next/dynamic';
import Loading from '../loading'; // Vamos usar o seu componente de loading

// --- MUDANÇA PRINCIPAL AQUI ---
// Importamos o Dashboard de forma dinâmica
const Dashboard = dynamic(
  () => import('../../components/Dashboard').then((mod) => mod.Dashboard),
  { 
    ssr: false, // O Dashboard não precisa de ser pré-renderizado no servidor
    loading: () => <Loading />, // Mostra o seu ecrã de loading enquanto o Dashboard carrega
  }
);

export default function DashboardPage() {
  const { user, setUser, isAuthenticated } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.push('/');
    }
  }, [isAuthenticated, user, router]);

  const handleNavigate = (page: string, challenge?: any) => {
    switch (page) {
      case 'challenge-form':
        router.push('/challenges/new');
        break;
      case 'startup-database':
        router.push('/startups');
        break;
      case 'challenge-details':
        if (challenge?.id) {
          sessionStorage.setItem('selectedChallenge', JSON.stringify(challenge));
          router.push(`/challenges/${challenge.id}`);
        }
        break;
      case 'funnel':
         router.push('/funnel');
         break;
      case 'collaborators':
         router.push('/collaborators');
         break;
      default:
        break;
    }
  };

  const handleLogout = () => {
    setUser(null);
    router.push('/');
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <Dashboard 
      user={user} 
      onNavigate={handleNavigate} 
      onLogout={handleLogout}
    />
  );
}