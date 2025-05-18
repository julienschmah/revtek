'use client';

import React from 'react';
import { FaUser, FaEnvelope, FaIdCard, FaPhone, FaCalendarAlt } from 'react-icons/fa';
import { UserFormData } from './useProfileForm';

interface PersonalInfoPanelProps {
  formData: UserFormData;
  isUpdating: boolean;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleSpecialInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleUpdateProfile: (e: React.FormEvent) => void;
}

export default function PersonalInfoPanel({
  formData,
  isUpdating,
  handleInputChange,
  handleSpecialInputChange,
  handleUpdateProfile
}: PersonalInfoPanelProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-8 mb-6 transition-all duration-300 hover:shadow-xl border border-gray-100">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b pb-4">Informações Pessoais</h2>

      <form onSubmit={handleUpdateProfile}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="mb-4">
            <label htmlFor="name" className="flex items-center text-gray-700 font-medium mb-2">
              <FaUser className="mr-2 text-amber-500" />
              Nome Completo *
            </label>
            <div className="relative">
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                required
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
          </div>
          
          <div className="mb-4">
            <label htmlFor="cpf" className="flex items-center text-gray-700 font-medium mb-2">
              <FaIdCard className="mr-2 text-amber-500" />
              CPF
            </label>
            <div className="relative">
              <input
                id="cpf"
                name="cpf"
                type="text"
                value={formData.cpf}
                onChange={handleSpecialInputChange}
                placeholder="123.456.789-01"
                maxLength={14}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label htmlFor="phone" className="flex items-center text-gray-700 font-medium mb-2">
              <FaPhone className="mr-2 text-amber-500" />
              Telefone {formData.isSeller && <span className="text-amber-600 ml-1">*</span>}
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
                required={formData.isSeller}
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
                value={formData.birthDate}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
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
