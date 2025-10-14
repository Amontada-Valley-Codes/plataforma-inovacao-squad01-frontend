'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '../../context/UserContext';
import { CompanyForm } from '../../../components/CompanyForm';

export default function NewCompanyPage() {
  const { user, isAuthenticated } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated || !user || user.role !== 'ADMIN') {
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

  return <CompanyForm user={user} onNavigate={handleNavigate} />;
}