'use client';

import React from 'react';
import { FaChevronUp, FaChevronDown } from 'react-icons/fa';

interface FilterSectionProps {
  title: string;
  icon: React.ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

const FilterSection: React.FC<FilterSectionProps> = ({
  title,
  icon,
  isExpanded,
  onToggle,
  children
}) => {
  return (
    <div className="mb-6 lg:border-b lg:border-amber-700 border-b border-gray-100 pb-6">
      <div 
        className="flex justify-between items-center cursor-pointer mb-3" 
        onClick={onToggle}
      >
        <h3 className="text-lg font-semibold lg:text-white text-gray-800 flex items-center">
          {icon}
          {title}
        </h3>
        {isExpanded ? 
          <FaChevronUp className="lg:text-amber-300 text-amber-500" /> : 
          <FaChevronDown className="lg:text-amber-300 text-amber-500" />
        }
      </div>
      {isExpanded && (
        <div className="mt-3">
          {children}
        </div>
      )}
    </div>
  );
};

export default FilterSection;
