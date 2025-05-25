'use client';

import React from 'react';
import { FaUser, FaEnvelope, FaIdCard, FaPhone, FaCalendarAlt } from 'react-icons/fa';
import { UserFormData } from './useProfileForm';
import { IMaskInput } from 'react-imask';
import { FaSync } from 'react-icons/fa';

interface PersonalInfoPanelProps {
  formData: UserFormData;
  isUpdating: boolean;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleSpecialInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleUpdateProfile: (e: React.FormEvent) => void;
  forceRefresh?: () => Promise<void>;
}

export default function PersonalInfoPanel({
  formData,
  isUpdating,
  handleInputChange,
  handleSpecialInputChange,
  handleUpdateProfile
}: PersonalInfoPanelProps) {
  // Debug para visualizar os dados do formulário
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('PersonalInfoPanel - formData:', formData);
    }
  }, [formData]);

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 mb-6 transition-all duration-300 hover:shadow-xl border border-gray-100">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b pb-4">Informações Pessoais</h2>

      <form onSubmit={handleUpdateProfile}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">          <div className="mb-4">
            <label htmlFor="name" className="flex items-center text-gray-700 font-medium mb-2">
              <FaUser className="mr-2 text-amber-500" />
              Nome Completo
            </label>
            <div className="relative">
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                readOnly
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="flex items-center text-gray-700 font-medium mb-2">
              <FaEnvelope className="mr-2 text-amber-500" />
              Email *
            </label>
            <div className="relative">
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                required
              />
            </div>
          </div>            <div className="mb-4">
            <label htmlFor="cpf" className="flex items-center text-gray-700 font-medium mb-2">
              <FaIdCard className="mr-2 text-amber-500" />
              CPF
            </label>
            <div className="relative">
              <input
                id="cpf"
                name="cpf"
                type="text"
                value={formData.cpf || ''}
                readOnly
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
              />
              {/* Debug info */}
              {process.env.NODE_ENV === 'development' && (
                <div className="text-xs text-gray-500 mt-1">
                  formData.cpf: {JSON.stringify(formData.cpf)} | 
                  user.cpf: {JSON.stringify(formData.cpf)}
                </div>
              )}
            </div>
          </div><div className="mb-4">
            <label htmlFor="cnpj" className="flex items-center text-gray-700 font-medium mb-2">
              <FaIdCard className="mr-2 text-amber-500" />
              CNPJ
            </label>
            <div className="relative">
              <input
                id="cnpj"
                name="cnpj"
                type="text"
                value={formData.cnpj || ''}
                readOnly
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
              />
            </div>
          </div>
            <div className="mb-4">
            <label htmlFor="phone" className="flex items-center text-gray-700 font-medium mb-2">
              <FaPhone className="mr-2 text-amber-500" />
              Telefone
            </label>
            <div className="relative">
              <input
                id="phone"
                name="phone"
                type="text"
                value={formData.phone}
                onChange={handleSpecialInputChange}
                placeholder="(11) 98765-4321"
                maxLength={15}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>
            <div className="mb-4">
            <label htmlFor="birthDate" className="flex items-center text-gray-700 font-medium mb-2">
              <FaCalendarAlt className="mr-2 text-amber-500" />
              Data de Nascimento
            </label>
            <div className="relative">
              <input
                id="birthDate"
                name="birthDate"
                type="date"
                value={formData.birthDate || ''}
                readOnly
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
              />
            </div>
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
