'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '../context/UserContext';
import { Dashboard } from '../../components/Dashboard';

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
          // Store challenge in sessionStorage for details page
          sessionStorage.setItem('selectedChallenge', JSON.stringify(challenge));
          router.push(`/challenges/${challenge.id}`);
        }
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