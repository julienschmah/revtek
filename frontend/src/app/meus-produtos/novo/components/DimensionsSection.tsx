'use client';

import React from 'react';
import { ProductFormData } from './types';

interface DimensionsProps {
  formData: ProductFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function DimensionsSection({ formData, handleChange }: DimensionsProps) {
  return (
    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Dimensões e Peso</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Largura (cm)
          </label>
          <input 
            type="text" 
            name="dimensions.width"
            value={formData.dimensions.width}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-amber-500 focus:border-amber-500"
            placeholder="0"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Altura (cm)
          </label>
          <input 
            type="text" 
            name="dimensions.height"
            value={formData.dimensions.height}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-amber-500 focus:border-amber-500"
            placeholder="0"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Profundidade (cm)
          </label>
          <input 
            type="text" 
            name="dimensions.depth"
            value={formData.dimensions.depth}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-amber-500 focus:border-amber-500"
            placeholder="0"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Peso (kg)
          </label>
          <input 
            type="text" 
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-amber-500 focus:border-amber-500"
            placeholder="0"
          />
        </div>
      </div>
    </div>
  );
}
