'use client';

import React from 'react';
import { ProductFormData, categories } from './types';

interface BasicInfoProps {
  formData: ProductFormData;
  errors: Record<string, string>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

export default function BasicInfoSection({ formData, errors, handleChange }: BasicInfoProps) {
  return (
    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Informações Básicas</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nome do Produto*
          </label>
          <input 
            type="text" 
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md p-2 focus:ring-amber-500 focus:border-amber-500`}
            placeholder="Nome do produto"
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Categoria*
          </label>
          <select 
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={`w-full border ${errors.category ? 'border-red-500' : 'border-gray-300'} rounded-md p-2 focus:ring-amber-500 focus:border-amber-500`}
          >
            <option value="">Selecione uma categoria</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Marca*
          </label>
          <input 
            type="text" 
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            className={`w-full border ${errors.brand ? 'border-red-500' : 'border-gray-300'} rounded-md p-2 focus:ring-amber-500 focus:border-amber-500`}
            placeholder="Ex: Tramontina"
          />
          {errors.brand && <p className="mt-1 text-sm text-red-600">{errors.brand}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Modelo*
          </label>
          <input 
            type="text" 
            name="model"
            value={formData.model}
            onChange={handleChange}
            className={`w-full border ${errors.model ? 'border-red-500' : 'border-gray-300'} rounded-md p-2 focus:ring-amber-500 focus:border-amber-500`}
            placeholder="Ex: XYZ-1000"
          />
          {errors.model && <p className="mt-1 text-sm text-red-600">{errors.model}</p>}
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descrição do Produto*
          </label>
          <textarea 
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className={`w-full border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-md p-2 focus:ring-amber-500 focus:border-amber-500`}
            placeholder="Descreva detalhadamente o produto..."
          ></textarea>
          {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Preço (R$)*
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500">R$</span>
            </div>
            <input
              type="text"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className={`w-full pl-10 border ${errors.price ? 'border-red-500' : 'border-gray-300'} rounded-md p-2 focus:ring-amber-500 focus:border-amber-500`}
              placeholder="0,00"
            />
          </div>
          {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Estoque (unidades)*
          </label>
          <input 
            type="number" 
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            min="0"
            className={`w-full border ${errors.stock ? 'border-red-500' : 'border-gray-300'} rounded-md p-2 focus:ring-amber-500 focus:border-amber-500`}
            placeholder="0"
          />
          {errors.stock && <p className="mt-1 text-sm text-red-600">{errors.stock}</p>}
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isNew"
            name="isNew"
            checked={formData.isNew}
            onChange={(e) => {
              const changeEvent = {
                target: {
                  name: 'isNew',
                  type: 'checkbox',
                  checked: e.target.checked
                }
              } as React.ChangeEvent<HTMLInputElement>;
              handleChange(changeEvent);
            }}
            className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
          />
          <label htmlFor="isNew" className="ml-2 block text-sm text-gray-700">
            Produto novo (não usado)
          </label>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Garantia (meses)
          </label>
          <input 
            type="number" 
            name="warranty"
            value={formData.warranty}
            onChange={handleChange}
            min="0"
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-amber-500 focus:border-amber-500"
            placeholder="12"
          />
        </div>
      </div>
    </div>
  );
}
