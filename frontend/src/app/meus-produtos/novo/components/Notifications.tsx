'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

interface SuccessModalProps {
  show: boolean;
}

export function SuccessModal({ show }: SuccessModalProps) {
  const router = useRouter();
  
  if (!show) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 flex flex-col items-center">
        <span className="text-3xl mb-2 text-green-600">✓</span>
        <h2 className="text-lg font-semibold mb-2">Produto cadastrado com sucesso!</h2>
        <p className="text-gray-600 mb-4">Redirecionando para seus produtos...</p>
        <button onClick={() => router.push('/meus-produtos')} className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-md">Ver meus produtos</button>
      </div>
    </div>
  );
}

interface ApiErrorNotificationProps {
  apiError: string | null;
  onClose: () => void;
}

export function ApiErrorNotification({ apiError, onClose }: ApiErrorNotificationProps) {
  if (!apiError) return null;
  
  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-6 py-3 rounded shadow-lg z-50">
      <span>{apiError}</span>
      <button className="ml-4 underline" onClick={onClose}>Fechar</button>
    </div>
  );
}
