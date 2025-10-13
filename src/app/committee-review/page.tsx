'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '../context/UserContext';
import { CommitteeReview } from '../../components/CommitteeReview';
import { Button } from '../../components/ui/button';

export default function CommitteeReviewPage() {
  const { user, isAuthenticated } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.push('/');
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || !user) {
    return null;
  }

  // Apenas gestores e avaliadores podem aceder
  if (user.role !== 'GESTOR' && user.role !== 'AVALIADOR' && user.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Acesso Negado</h2>
          <p className="text-gray-600">Você não tem permissão para aceder a esta página.</p>
          <Button onClick={() => router.push('/dashboard')} className="mt-4">Voltar ao Dashboard</Button>
        </div>
      </div>
    )
  }

  return <CommitteeReview user={user} />;
}