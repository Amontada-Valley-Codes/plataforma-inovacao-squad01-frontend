'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useUser } from '../../context/UserContext';
import { InnovationFunnel } from '../../../components/InnovationFunnel';
import { Challenge } from '../../context/UserContext';

export default function FunnelPage() {
  const { user, isAuthenticated } = useUser();
  const router = useRouter();
  const params = useParams();
  const [challenge, setChallenge] = useState<Challenge | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.push('/');
      return;
    }
    
    // Recupera os dados do desafio que guardámos
    const storedChallenge = sessionStorage.getItem('selectedChallenge');
    if (storedChallenge) {
      const challengeData = JSON.parse(storedChallenge);
      // Confirma se o ID na URL corresponde ao desafio guardado
      if (challengeData.id === params.id) {
        setChallenge(challengeData);
      } else {
        // Se não corresponder, talvez redirecionar ou buscar da API
        console.error("ID do desafio na URL não corresponde ao guardado.");
        router.push('/dashboard');
      }
    }
  }, [isAuthenticated, user, router, params.id]);
  
  if (!challenge) {
    return <div>Carregando funil...</div>; // Ou um componente de loading
  }

  return (
    <InnovationFunnel 
      user={user!} 
      challenge={challenge}
    />
  );
}