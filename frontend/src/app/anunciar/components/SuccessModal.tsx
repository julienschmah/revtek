'use client';

import { FaCheckCircle } from 'react-icons/fa';

interface SuccessModalProps {
  show: boolean;
  onClose: () => void;
}

export default function SuccessModal({ show, onClose }: SuccessModalProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center max-w-xs w-full">
        <FaCheckCircle className="text-4xl text-amber-500 mb-2" />
        <h2 className="text-lg font-bold mb-1 text-gray-800">Anúncio enviado!</h2>
        <p className="text-gray-600 text-center mb-4">Seu anúncio foi enviado com sucesso e será revisado pela equipe RevMak.</p>
        <button 
          onClick={onClose} 
          className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
        >
          Fechar
        </button>
      </div>
    </div>
  );
}
