'use client';

import React from 'react';

interface MobileFilterButtonProps {
  showMobileFilters: boolean;
  onToggle: () => void;
}

const MobileFilterButton: React.FC<MobileFilterButtonProps> = ({ 
  showMobileFilters, 
  onToggle 
}) => {
  return (
    <div className="lg:hidden fixed bottom-6 right-6 z-50">
      <button
        onClick={onToggle}
        className="flex items-center justify-center px-4 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-full shadow-lg transition-all hover:shadow-xl"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-6 w-6 mr-2" 
          viewBox="0 0 20 20" 
          fill="currentColor"
        >
          <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
        </svg>
        {showMobileFilters ? 'Ocultar' : 'Filtros'}
      </button>
    </div>
  );
};

export default MobileFilterButton;
