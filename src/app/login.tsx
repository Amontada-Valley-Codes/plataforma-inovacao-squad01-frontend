'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from './context/UserContext';
import  Login  from '../components/Login';

export default function HomePage() {
  const { user, setUser, isAuthenticated } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && user) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, user, router]);

  const handleLogin = (userData: any) => {
    setUser(userData);
    router.push('/dashboard');
  };

  return <Login onLogin={handleLogin} />;
}