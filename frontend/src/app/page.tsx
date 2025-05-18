'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    console.log('Home - Auth state:', { isAuthenticated, isLoading });
    
    if (!isLoading) {
      if (isAuthenticated) {
        console.log('Home - User authenticated, redirecting to landing page');
        router.push('/landingpage');
      } else {
        console.log('Home - User not authenticated, redirecting to login');
        router.push('/login');
      }
    }
  }, [isLoading, isAuthenticated, router]);

  // Renderiza tela de carregamento enquanto verifica autenticação
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600">Inicializando...</p>
      </div>
    </div>
  );
}
