'use client';

import React from 'react';

interface SortControlsProps {
  displayedProductsCount: number;
  sortOption: string;
  onSortChange: (value: string) => void;
}

const SortControls: React.FC<SortControlsProps> = ({ 
  displayedProductsCount, 
  sortOption, 
  onSortChange 
}) => {
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm mb-8 flex flex-col sm:flex-row justify-between items-center">
      <div className="text-sm font-medium text-gray-600 bg-amber-50 px-3 py-1.5 rounded-full mb-3 sm:mb-0">
        <span className="font-bold text-amber-700">{displayedProductsCount}</span> produtos encontrados
      </div>
      <div className="flex items-center">
        <span className="mr-3 text-gray-600">Ordenar por:</span>
        <div className="relative">
          <select 
            className="appearance-none bg-white border border-gray-300 text-gray-700 pl-4 pr-10 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 hover:border-amber-300 transition-colors"
            onChange={(e) => onSortChange(e.target.value)}
            value={sortOption}
          >
            <option value="relevancia">Relevância</option>
            <option value="menor-preco">Menor preço</option>
            <option value="maior-preco">Maior preço</option>
            <option value="mais-recentes">Mais recentes</option>
            <option value="popularidade">Mais populares</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SortControls;
