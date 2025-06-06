'use client';

import React from 'react';

interface FilterParams {
  category: string;
  condition: string;
  minPrice: string;
  maxPrice: string;
  brand: string;
  purpose: string;
}

interface NoProductsFoundProps {
  onClearFilters: () => void;
}

const NoProductsFound: React.FC<NoProductsFoundProps> = ({ onClearFilters }) => {
  return (
    <div className="bg-white rounded-xl shadow p-10 text-center">
      <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-amber-100 text-amber-600 mb-6">
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3 className="text-3xl font-bold text-gray-800 mb-3">Nenhum produto encontrado</h3>
      <p className="text-gray-600 mb-8 max-w-md mx-auto text-lg">
        Tente ajustar os filtros para encontrar o que você está procurando ou entre em contato conosco para verificar a disponibilidade.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button 
          className="bg-amber-500 hover:bg-amber-600 text-white py-3 px-6 rounded-lg transition-colors font-medium shadow-sm hover:shadow"
          onClick={onClearFilters}
        >
          Limpar todos os filtros
        </button>
        <button 
          className="border border-amber-500 text-amber-600 hover:bg-amber-50 py-3 px-6 rounded-lg transition-colors font-medium"
          onClick={() => window.location.href = '/landingpage'}
        >
          Voltar para a home
        </button>
      </div>
    </div>
  );
};

export default NoProductsFound;
