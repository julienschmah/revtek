'use client';

import React from 'react';
import ProductFilter from './filter';

interface FilterSidebarProps {
  showMobileFilters: boolean;
  onFilterChange: (filters: any) => void;
  onCloseMobile: () => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ 
  showMobileFilters, 
  onFilterChange, 
  onCloseMobile 
}) => {
  return (
    <div className={`${showMobileFilters ? 'block fixed inset-0 z-40 bg-black bg-opacity-50' : 'hidden'} lg:block lg:static w-full lg:w-80`}>
      <div className={`${showMobileFilters ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} transition-transform duration-300 bg-white lg:bg-amber-900 h-screen lg:h-auto overflow-auto fixed lg:sticky top-0 lg:top-6 left-0 w-3/4 lg:w-full lg:rounded-xl lg:shadow-lg`}>
        <div className="lg:hidden flex justify-between items-center mb-6 border-b border-gray-200 pb-4 p-6">
          <div>
            <h3 className="font-bold text-lg text-gray-800">Filtros</h3>
            <p className="text-sm text-gray-600">Encontre o produto ideal</p>
          </div>
          <button 
            onClick={onCloseMobile}
            className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <div className="hidden lg:block p-6 border-b border-amber-800">
          <h3 className="font-bold text-lg text-white mb-1">Filtros</h3>
          <p className="text-sm text-amber-200">Encontre o produto ideal</p>
        </div>
        
        <div className="p-6 lg:p-4">
          <ProductFilter onFilterChange={onFilterChange} />
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
