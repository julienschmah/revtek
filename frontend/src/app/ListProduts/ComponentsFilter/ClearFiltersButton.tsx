'use client';

import React from 'react';

interface ClearFiltersButtonProps {
  onClearFilters: () => void;
}

const ClearFiltersButton: React.FC<ClearFiltersButtonProps> = ({ onClearFilters }) => {
  return (
    <div className="pt-2">
      <button 
        className="w-full py-3.5 lg:text-amber-200 lg:bg-amber-800 lg:border-amber-700 lg:hover:bg-amber-700 text-amber-700 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors flex items-center justify-center font-medium"
        onClick={onClearFilters}
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
        </svg>
        Limpar todos os filtros
      </button>
    </div>
  );
};

export default ClearFiltersButton;
