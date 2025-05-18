'use client';

import React from 'react';
import { FaMapMarkerAlt, FaBuilding } from 'react-icons/fa';
import { UserFormData, ESTADOS_BRASILEIROS } from './useProfileForm';

interface AddressPanelProps {
  formData: UserFormData;
  isUpdating: boolean;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleSpecialInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleUpdateProfile: (e: React.FormEvent) => void;
}

export default function AddressPanel({
  formData,
  isUpdating,
  handleInputChange,
  handleSpecialInputChange,
  handleUpdateProfile
}: AddressPanelProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-8 mb-6 transition-all duration-300 hover:shadow-xl border border-gray-100">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b pb-4">Endereço</h2>
      
      <p className="mb-6 text-gray-600 bg-amber-50 p-4 rounded-lg border-l-4 border-amber-500">
        {formData.isSeller 
          ? 'Esses dados são obrigatórios para vendedores.' 
          : 'Preencha seu endereço para facilitar suas compras.'}
      </p>

      <form onSubmit={handleUpdateProfile}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="mb-4">
            <label htmlFor="zipCode" className="flex items-center text-gray-700 font-medium mb-2">
              <FaMapMarkerAlt className="mr-2 text-amber-500" />
              CEP {formData.isSeller && <span className="text-amber-600 ml-1">*</span>}
            </label>
            <div className="relative">
              <input
                id="zipCode"
                name="zipCode"
                type="text"
                value={formData.zipCode}
                onChange={handleSpecialInputChange}
                placeholder="12345-678"
                maxLength={9}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                required={formData.isSeller}
              />
            </div>
          </div>

          <div className="mb-4 md:col-span-2">
            <label htmlFor="address" className="flex items-center text-gray-700 font-medium mb-2">
              <FaBuilding className="mr-2 text-amber-500" />
              Endereço {formData.isSeller && <span className="text-amber-600 ml-1">*</span>}
            </label>
            <div className="relative">
              <input
                id="address"
                name="address"
                type="text"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Rua, Avenida, etc."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                required={formData.isSeller}
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label htmlFor="addressNumber" className="flex items-center text-gray-700 font-medium mb-2">
              <span className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center mr-2 text-xs font-bold">Nº</span>
              Número {formData.isSeller && <span className="text-amber-600 ml-1">*</span>}
            </label>
            <div className="relative">
              <input
                id="addressNumber"
                name="addressNumber"
                type="text"
                value={formData.addressNumber}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                required={formData.isSeller}
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label htmlFor="complement" className="flex items-center text-gray-700 font-medium mb-2">
              <span className="mr-2 text-amber-500">+</span>
              Complemento
            </label>
            <div className="relative">
              <input
                id="complement"
                name="complement"
                type="text"
                value={formData.complement}
                onChange={handleInputChange}
                placeholder="Apto, Bloco, etc."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label htmlFor="neighborhood" className="flex items-center text-gray-700 font-medium mb-2">
              <FaMapMarkerAlt className="mr-2 text-amber-500" />
              Bairro {formData.isSeller && <span className="text-amber-600 ml-1">*</span>}
            </label>
            <div className="relative">
              <input
                id="neighborhood"
                name="neighborhood"
                type="text"
                value={formData.neighborhood}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                required={formData.isSeller}
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label htmlFor="city" className="flex items-center text-gray-700 font-medium mb-2">
              <FaBuilding className="mr-2 text-amber-500" />
              Cidade {formData.isSeller && <span className="text-amber-600 ml-1">*</span>}
            </label>
            <div className="relative">
              <input
                id="city"
                name="city"
                type="text"
                value={formData.city}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                required={formData.isSeller}
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label htmlFor="state" className="flex items-center text-gray-700 font-medium mb-2">
              <FaMapMarkerAlt className="mr-2 text-amber-500" />
              Estado {formData.isSeller && <span className="text-amber-600 ml-1">*</span>}
            </label>
            <select
              id="state"
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
              required={formData.isSeller}
            >
              <option value="">Selecione um estado</option>
              {ESTADOS_BRASILEIROS.map(estado => (
                <option key={estado} value={estado}>{estado}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end mt-8">
          <button
            type="submit"
            disabled={isUpdating}
            className={`px-6 py-3 rounded-lg text-white font-medium transition-all duration-300 
            ${isUpdating 
              ? 'bg-amber-400 cursor-not-allowed' 
              : 'bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 shadow-lg hover:shadow-amber-200/50'
            }`}
          >
            {isUpdating ? 'Atualizando...' : 'Salvar Alterações'}
          </button>
        </div>
      </form>
    </div>
  );
}
