'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '../context/UserContext';
import { StartupDatabase } from '../../components/StartupDatabase';

export default function StartupsPage() {
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

  return (
    <StartupDatabase 
      user={user} 
      onNavigate={handleNavigate}
    />
  );
}