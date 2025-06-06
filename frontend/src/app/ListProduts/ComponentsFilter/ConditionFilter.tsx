'use client';

import React from 'react';

interface ConditionFilterProps {
  selectedCondition: string;
  onConditionChange: (condition: string) => void;
}

const ConditionFilter: React.FC<ConditionFilterProps> = ({
  selectedCondition,
  onConditionChange
}) => {
  const conditions = [
    { id: 'novo', label: 'Novo', badge: 'Premium', badgeColor: 'bg-green-100 text-green-800' },
    { id: 'seminovo', label: 'Seminovo', badge: 'Economia', badgeColor: 'bg-blue-100 text-blue-800' },
    { id: 'usado', label: 'Usado', badge: 'Melhor custo', badgeColor: 'bg-amber-100 text-amber-800' }
  ];

  return (
    <div className="space-y-3">
      {conditions.map(condition => (
        <button 
          key={condition.id}
          className={`flex items-center w-full py-2.5 px-4 rounded-lg transition-colors ${
            selectedCondition === condition.id 
            ? 'bg-amber-500 text-white hover:bg-amber-600' 
            : 'lg:bg-amber-800 lg:text-amber-100 lg:hover:bg-amber-700 bg-gray-50 text-gray-700 hover:bg-amber-50'
          }`}
          onClick={() => onConditionChange(condition.id)}
        >
          <div className={`h-4 w-4 rounded-full mr-3 flex items-center justify-center border-2 ${
            selectedCondition === condition.id 
            ? 'border-white' 
            : 'lg:border-amber-300 border-gray-400'
          }`}>
            {selectedCondition === condition.id && (
              <div className="h-2 w-2 rounded-full bg-white"></div>
            )}
          </div>
          <span className="font-medium">{condition.label}</span>
          <span className={`ml-auto text-xs ${condition.badgeColor} py-1 px-2 rounded-full`}>
            {condition.badge}
          </span>
        </button>
      ))}
    </div>
  );
};

export default ConditionFilter;
