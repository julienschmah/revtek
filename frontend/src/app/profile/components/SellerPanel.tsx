'use client';

import React from 'react';
import { FaBuilding, FaIdCard } from 'react-icons/fa';
import { UserFormData } from './useProfileForm';

interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  isActive?: boolean;
  cpf?: string;
  cnpj?: string;
  phone?: string;
  birthDate?: string;
  address?: string;
  isSeller?: boolean;
}

interface SellerPanelProps {
  user: User;
  formData: UserFormData;
  isUpdating: boolean;
  isBecomingSeller: boolean;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleSpecialInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleUpdateProfile: (e: React.FormEvent) => void;
}

export default function SellerPanel({
  user,
  formData,
  isUpdating,
  isBecomingSeller,
  handleInputChange,
  handleSpecialInputChange,
  handleUpdateProfile
}: SellerPanelProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-8 mb-6 transition-all duration-300 hover:shadow-xl border border-gray-100">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b pb-4">Informações de Vendedor</h2>
      
      {!user?.isSeller && !formData.isSeller && (
        <div className="bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200 text-amber-800 p-6 rounded-lg mb-6 shadow-inner">
          <h3 className="font-bold text-lg mb-2 flex items-center">
            <svg className="w-6 h-6 mr-2 text-amber-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
            </svg>
            Torne-se um vendedor RevMak!
          </h3>
          <p>Para vender na RevMak, você precisará ativar seu perfil de vendedor e completar seus dados. Vendedores têm acesso ao painel de controle para gerenciar produtos e vendas.</p>
        </div>
      )}

      <form onSubmit={handleUpdateProfile}>
        <div className="mb-8">
          <label className="flex items-center pl-4 pr-6 py-4 bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-200 cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                name="isSeller"
                checked={formData.isSeller}
                onChange={handleInputChange}
                className="sr-only"
              />
              <div className={`w-10 h-6 bg-gray-200 rounded-full shadow-inner ${formData.isSeller ? 'bg-amber-500' : ''}`}></div>
              <div className={`absolute w-4 h-4 bg-white rounded-full shadow -top-1 transition ${formData.isSeller ? 'transform translate-x-6' : 'translate-x-1'}`}></div>
            </div>
            <span className="ml-4 text-gray-700 font-medium">Ativar perfil de vendedor</span>
          </label>
        </div>
        
        {formData.isSeller && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="mb-4 md:col-span-2">
                <label htmlFor="companyName" className="flex items-center text-gray-700 font-medium mb-2">
                  <FaBuilding className="mr-2 text-amber-500" />
                  Nome da Empresa/Negócio <span className="text-amber-600 ml-1">*</span>
                </label>
                <div className="relative">
                  <input
                    id="companyName"
                    name="companyName"
                    type="text"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                    required={formData.isSeller}
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label htmlFor="cnpj" className="flex items-center text-gray-700 font-medium mb-2">
                  <FaIdCard className="mr-2 text-amber-500" />
                  CNPJ (opcional para pessoa jurídica)
                </label>
                <div className="relative">
                  <input
                    id="cnpj"
                    name="cnpj"
                    type="text"
                    value={formData.cnpj}
                    onChange={handleSpecialInputChange}
                    placeholder="12.345.678/0001-90"
                    maxLength={18}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>
            </div>
            
            {isBecomingSeller && (
              <div className="mt-6 bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-500 p-6 rounded-r-lg">
                <h3 className="font-bold text-blue-800 mb-2 flex items-center">
                  <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  Importante
                </h3>
                <p className="text-blue-800">
                  Para se tornar um vendedor, você precisa completar seu endereço e informações pessoais. 
                  Por favor, certifique-se de que todos os campos obrigatórios estão preenchidos.
                </p>
              </div>
            )}
          </>
        )}

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
