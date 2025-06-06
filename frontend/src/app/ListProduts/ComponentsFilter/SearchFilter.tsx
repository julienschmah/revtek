'use client';

import React from 'react';
import { FaSearch } from 'react-icons/fa';

interface SearchFilterProps {
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
}

const SearchFilter: React.FC<SearchFilterProps> = ({
  searchQuery,
  onSearchChange,
  onSearchSubmit
}) => {
  return (
    <div className="mb-6">
      <form onSubmit={onSearchSubmit}>
        <div className="relative">
          <input
            type="text"
            placeholder="Busque por equipamentos..."
            className="w-full py-3 px-4 pr-12 rounded-lg border lg:border-amber-700 border-gray-300 lg:bg-amber-800 bg-white lg:text-white text-gray-900 lg:placeholder-amber-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent shadow-sm"
            value={searchQuery}
            onChange={onSearchChange}
          />
          <button 
            type="submit"
            className="absolute right-0 top-0 h-full px-4 lg:text-amber-300 text-gray-400 hover:text-amber-500 bg-transparent border-none transition-colors"
          >
            <FaSearch className="lg:text-amber-300 text-amber-500" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchFilter;
