'use client';

import React from 'react';

interface BrandFilterProps {
  selectedBrand: string;
  onBrandChange: (brand: string) => void;
}

const BrandFilter: React.FC<BrandFilterProps> = ({
  selectedBrand,
  onBrandChange
}) => {
  const brands = [
    { id: 'tramontina', name: 'Tramontina', count: 32 },
    { id: 'rochedo', name: 'Rochedo', count: 18 },
    { id: 'consul', name: 'Consul', count: 24 }
  ];

  return (
    <div className="space-y-3">
      {brands.map(brand => (
        <button 
          key={brand.id}
          className={`flex items-center w-full py-2.5 px-4 rounded-lg transition-colors ${
            selectedBrand === brand.id 
            ? 'lg:bg-amber-600 lg:border-2 lg:border-amber-400 bg-amber-50 border-2 border-amber-500' 
            : 'lg:bg-amber-800 lg:border lg:border-amber-700 lg:hover:border-amber-600 bg-white border border-gray-200 hover:border-amber-200'
          }`}
          onClick={() => onBrandChange(brand.id)}
        >
          <div className={`h-5 w-5 rounded mr-3 flex items-center justify-center border ${
            selectedBrand === brand.id 
            ? 'border-amber-500 bg-amber-500' 
            : 'lg:border-amber-400 border-gray-300'
          }`}>
            {selectedBrand === brand.id && (
              <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
              </svg>
            )}
          </div>
          <span className="font-medium lg:text-amber-100 text-gray-800">{brand.name}</span>
          <span className="ml-auto text-xs lg:text-amber-300 text-gray-500">({brand.count})</span>
        </button>
      ))}
    </div>
  );
};

export default BrandFilter;
