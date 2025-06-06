'use client';

import React from 'react';

interface PriceRange {
  min: string;
  max: string;
}

interface PriceFilterProps {
  priceRange: PriceRange;
  onPriceChange: (type: 'min' | 'max', value: string) => void;
  onPriceRangeSet: (min: string, max: string) => void;
}

const PriceFilter: React.FC<PriceFilterProps> = ({
  priceRange,
  onPriceChange,
  onPriceRangeSet
}) => {
  return (
    <div>
      <div className="flex gap-4 mb-2">
        <div className="flex-1 relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 lg:text-amber-300 text-gray-500">R$</span>
          <input 
            type="number" 
            placeholder="Mínimo" 
            className="w-full py-3 pl-8 pr-3 rounded-lg border lg:border-amber-700 lg:bg-amber-800 lg:text-white lg:placeholder-amber-200 border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent shadow-sm"
            value={priceRange.min}
            onChange={(e) => onPriceChange('min', e.target.value)}
          />
        </div>
        <div className="flex-1 relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 lg:text-amber-300 text-gray-500">R$</span>
          <input 
            type="number" 
            placeholder="Máximo" 
            className="w-full py-3 pl-8 pr-3 rounded-lg border lg:border-amber-700 lg:bg-amber-800 lg:text-white lg:placeholder-amber-200 border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent shadow-sm"
            value={priceRange.max}
            onChange={(e) => onPriceChange('max', e.target.value)}
          />
        </div>
      </div>
      
      <div className="mt-4 grid grid-cols-2 gap-2">
        <button 
          onClick={() => onPriceRangeSet('', '1000')}
          className="py-2 px-3 text-xs lg:bg-amber-800 lg:hover:bg-amber-700 lg:text-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg font-medium transition-colors"
        >
          Até R$ 1.000
        </button>
        <button 
          onClick={() => onPriceRangeSet('1000', '5000')}
          className="py-2 px-3 text-xs lg:bg-amber-800 lg:hover:bg-amber-700 lg:text-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg font-medium transition-colors"
        >
          R$ 1.000 - R$ 5.000
        </button>
        <button 
          onClick={() => onPriceRangeSet('5000', '10000')}
          className="py-2 px-3 text-xs lg:bg-amber-800 lg:hover:bg-amber-700 lg:text-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg font-medium transition-colors"
        >
          R$ 5.000 - R$ 10.000
        </button>
        <button 
          onClick={() => onPriceRangeSet('10000', '')}
          className="py-2 px-3 text-xs lg:bg-amber-800 lg:hover:bg-amber-700 lg:text-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg font-medium transition-colors"
        >
          Acima de R$ 10.000
        </button>
      </div>
    </div>
  );
};

export default PriceFilter;
