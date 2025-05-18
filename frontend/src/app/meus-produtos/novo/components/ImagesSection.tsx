'use client';

import React from 'react';
import Image from 'next/image';
import { FaTrash, FaUpload } from 'react-icons/fa';
import { ProductFormData } from './types';

interface ImagesProps {
  formData: ProductFormData;
  errors: Record<string, string>;
  handleImageUpload: (e?: React.ChangeEvent<HTMLInputElement>) => void;
  removeImage: (index: number) => void;
}

export default function ImagesSection({ 
  formData, 
  errors, 
  handleImageUpload, 
  removeImage 
}: ImagesProps) {
  return (
    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Imagens do Produto*</h2>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {formData.images.map((image, index) => (
          <div key={index} className="relative border border-gray-200 rounded-lg overflow-hidden group">
            <div className="aspect-w-1 aspect-h-1 relative">
              <Image 
                src={image} 
                alt={`Imagem ${index + 1}`}
                fill
                className="object-cover"
              />
            </div>
            <button 
              type="button"
              onClick={() => removeImage(index)}
              className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <FaTrash size={12} />
            </button>
          </div>
        ))}
        
        <label className="border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center p-4 hover:border-amber-500 transition-colors aspect-w-1 aspect-h-1 cursor-pointer">
          <FaUpload className="text-gray-400 mb-2" size={24} />
          <span className="text-sm text-gray-500">Adicionar Imagem</span>
          <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
        </label>
      </div>
      {errors.images && <p className="mt-2 text-sm text-red-600">{errors.images}</p>}
      <p className="mt-2 text-xs text-gray-500">
        * Formatos aceitos: JPEG, PNG ou WebP. Tamanho máximo: 5MB por imagem. A primeira imagem será a principal.
      </p>
    </div>
  );
}
