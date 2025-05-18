'use client';

import React from 'react';
import { FaPlus, FaTrash } from 'react-icons/fa';
import { ProductFormData } from './types';

interface FeaturesProps {
  formData: ProductFormData;
  handleFeatureChange: (index: number, field: 'key' | 'value', value: string) => void;
  addFeature: () => void;
  removeFeature: (index: number) => void;
}

export default function FeaturesSection({ 
  formData, 
  handleFeatureChange, 
  addFeature, 
  removeFeature 
}: FeaturesProps) {
  return (
    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Características Técnicas</h2>
        <button 
          type="button"
          onClick={addFeature}
          className="inline-flex items-center text-sm text-amber-600 hover:text-amber-800"
        >
          <FaPlus className="mr-1" />
          Adicionar característica
        </button>
      </div>
      
      <div className="space-y-4">
        {formData.features.map((feature, index) => (
          <div key={index} className="flex items-center gap-4">
            <div className="flex-grow">
              <input 
                type="text" 
                value={feature.key}
                onChange={(e) => handleFeatureChange(index, 'key', e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-amber-500 focus:border-amber-500 mb-2"
                placeholder="Característica (ex: Material)"
              />
              <input 
                type="text" 
                value={feature.value}
                onChange={(e) => handleFeatureChange(index, 'value', e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-amber-500 focus:border-amber-500"
                placeholder="Valor (ex: Inox)"
              />
            </div>
            {index > 0 && (
              <button 
                type="button"
                onClick={() => removeFeature(index)}
                className="text-red-600 hover:text-red-800"
              >
                <FaTrash />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
