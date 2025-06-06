'use client';

import React from 'react';

interface PurposeFilterProps {
  selectedPurpose: string;
  onPurposeChange: (purpose: string) => void;
}

const PurposeFilter: React.FC<PurposeFilterProps> = ({
  selectedPurpose,
  onPurposeChange
}) => {
  return (
    <div className="flex gap-3">
      <button 
        className={`flex-1 py-3 rounded-lg border-2 transition-all ${selectedPurpose === 'compra' 
          ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white border-amber-600 shadow-md' 
          : 'lg:bg-amber-800 lg:border-amber-700 lg:text-amber-100 lg:hover:border-amber-600 lg:hover:bg-amber-700 bg-white border-gray-200 text-gray-700 hover:border-amber-300 hover:bg-amber-50'}`}
        onClick={() => onPurposeChange('compra')}
      >
        Comprar
      </button>
      <button 
        className={`flex-1 py-3 rounded-lg border-2 transition-all ${selectedPurpose === 'aluguel' 
          ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white border-amber-600 shadow-md' 
          : 'lg:bg-amber-800 lg:border-amber-700 lg:text-amber-100 lg:hover:border-amber-600 lg:hover:bg-amber-700 bg-white border-gray-200 text-gray-700 hover:border-amber-300 hover:bg-amber-50'}`}
        onClick={() => onPurposeChange('aluguel')}
      >
        Alugar
      </button>
    </div>
  );
};

export default PurposeFilter;
