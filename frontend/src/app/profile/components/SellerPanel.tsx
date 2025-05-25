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
      <div className="bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200 text-amber-800 p-6 rounded-lg mb-6 shadow-inner">
        <h3 className="font-bold text-lg mb-2 flex items-center">
          <svg className="w-6 h-6 mr-2 text-amber-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
          </svg>
          Para anunciar produtos, complete todos os dados obrigatórios do seu perfil.
        </h3>
        <p>Preencha suas informações pessoais, endereço, telefone e CPF ou CNPJ nas abas correspondentes. Assim que tudo estiver completo, você poderá anunciar normalmente.</p>
      </div>
    </div>
  );
}
