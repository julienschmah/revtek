'use client';

import React from 'react';

interface Category {
  id: string;
  name: string;
}

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onCategoryChange
}) => {
  return (
    <div className="grid grid-cols-2 gap-2.5">
      {Array.isArray(categories) && categories.length > 0 ? (
        categories.map(category => (
          <button 
            key={category.id}
            className={`py-3 px-2 rounded-lg border-2 text-sm font-medium transition-all ${
              selectedCategory === category.id 
              ? 'bg-amber-500 text-white border-amber-500 shadow-md' 
              : 'lg:border-amber-700 lg:text-amber-100 lg:hover:border-amber-600 lg:hover:bg-amber-800 lg:bg-amber-800 border-gray-200 text-gray-700 hover:border-amber-200 hover:bg-amber-50'
            }`}
            onClick={() => onCategoryChange(category.id)}
          >
            {category.name}
          </button>
        ))
      ) : (
        <div className="col-span-2 flex justify-center items-center py-6 lg:bg-amber-800 bg-amber-50 rounded-lg">
          <svg className="animate-spin h-5 w-5 mr-3 lg:text-amber-300 text-amber-500" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="lg:text-amber-200 text-amber-700">Carregando categorias...</span>
        </div>
      )}
    </div>
  );
};

export default CategoryFilter;
