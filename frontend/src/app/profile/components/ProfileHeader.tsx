'use client';

import React from 'react';
import { FaUser } from 'react-icons/fa';

interface ProfileHeaderProps {
  name: string | undefined;
  email: string | undefined;
  updateSuccess: boolean;
  passwordSuccess: boolean;
  validationError: string;
}

export default function ProfileHeader({
  name,
  email,
  updateSuccess,
  passwordSuccess,
  validationError
}: ProfileHeaderProps) {
  return (
    <>
      <div className="flex items-center space-x-4 mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-white shadow-lg">
          <FaUser className="text-2xl" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{name || 'Seu Perfil'}</h1>
          <p className="text-gray-500">{email}</p>
        </div>
      </div>

      {/* Mensagens de sucesso/erro */}
      {updateSuccess && (
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-4 rounded-lg shadow-lg mb-6 transform transition-all animate-fadeIn">
          <div className="flex items-center">
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span>Perfil atualizado com sucesso!</span>
          </div>
        </div>
      )}
      
      {passwordSuccess && (
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-4 rounded-lg shadow-lg mb-6 transform transition-all animate-fadeIn">
          <div className="flex items-center">
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span>Senha alterada com sucesso!</span>
          </div>
        </div>
      )}
      
      {validationError && (
        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-4 rounded-lg shadow-lg mb-6">
          <div className="flex items-center">
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>{validationError}</span>
          </div>
        </div>
      )}
    </>
  );
}
