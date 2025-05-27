'use client';

import React from 'react';

interface ProfileHeaderProps {
  updateSuccess: boolean;
  passwordSuccess: boolean;
  validationError: string;
}

export default function ProfileHeader({
  updateSuccess,
  passwordSuccess,
  validationError
}: ProfileHeaderProps) {return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Meu Perfil</h1>
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
