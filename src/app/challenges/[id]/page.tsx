'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useUser, Challenge } from '../../context/UserContext';
import { ChallengeDetails } from '../../../components/ChallengeDetails';

export default function ChallengeDetailsPage() {
  const { user, isAuthenticated } = useUser();
  const router = useRouter();
  const params = useParams();
  const [challenge, setChallenge] = useState<Challenge | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.push('/');
      return;
    }

    // Try to get challenge from sessionStorage first
    const storedChallenge = sessionStorage.getItem('selectedChallenge');
    if (storedChallenge) {
      try {
        const challengeData = JSON.parse(storedChallenge);
        if (challengeData.id === params.id) {
          setChallenge(challengeData);
          return;
        }
      } catch (error) {
        console.error('Error parsing stored challenge:', error);
      }
    }

    // If not found in sessionStorage, create a mock challenge based on ID
    // In a real app, this would fetch from an API
    const mockChallenge: Challenge = {
      id: params.id as string,
      name: 'Automação de Processos Financeiros',
      startDate: '2024-01-15',
      endDate: '2024-03-15',
      area: 'FinTech',
      description: 'Buscar soluções inovadoras para automatizar processos financeiros internos, reduzindo custos operacionais e aumentando a eficiência.',
      type: 'interno',
      company: user.company,
      status: 'ativo'
    };
    setChallenge(mockChallenge);
  }, [isAuthenticated, user, router, params.id]);

  const handleNavigate = (page: string) => {
    switch (page) {
      case 'dashboard':
        router.push('/dashboard');
        break;
      case 'startup-database':
        router.push('/startups');
        break;
      default:
        break;
    }
  };

  if (!isAuthenticated || !user || !challenge) {
    return null;
  }

  return (
    <ChallengeDetails 
      user={user} 
      challenge={challenge}
      onNavigate={handleNavigate}
    />
  );
}