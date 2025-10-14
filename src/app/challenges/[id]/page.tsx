// /plat_inovacao/src/app/challenges/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useUser, Challenge } from '../../context/UserContext';
import { ChallengeDetails } from '../../../components/ChallengeDetails';
import api from '../../../lib/api'; // Importar o axios
import Loading from '../../loading'; // Importar o loading

export default function ChallengeDetailsPage() {
  const { user, isAuthenticated } = useUser();
  const router = useRouter();
  const params = useParams();
  const challengeId = params.id as string;

  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.push('/');
      return;
    }

    if (!challengeId) return;

    const fetchChallenge = async () => {
      setIsLoading(true);
      try {
        const response = await api.get(`/challenges/${challengeId}`);
        setChallenge(response.data);
      } catch (error) {
        console.error('Falha ao buscar detalhes do desafio:', error);
        // Opcional: redirecionar para uma página de erro ou dashboard
        router.push('/dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    fetchChallenge();
  }, [isAuthenticated, user, router, challengeId]);

  const handleNavigate = (page: string) => {
    if (page === 'dashboard') router.push('/dashboard');
    if (page === 'startup-database') router.push('/startups');
  };

  if (isLoading || !challenge) {
    return <Loading />;
  }

  return (
    <ChallengeDetails 
      user={user!} 
      challenge={challenge}
      onNavigate={handleNavigate}
    />
  );
}