'use client';

import React from 'react';
import { FaLock } from 'react-icons/fa';
import { PasswordFormData } from './useProfileForm';

interface SecurityPanelProps {
  passwordData: PasswordFormData;
  isChangingPassword: boolean;
  handlePasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleChangePassword: (e: React.FormEvent) => void;
}

export default function SecurityPanel({
  passwordData,
  isChangingPassword,
  handlePasswordChange,
  handleChangePassword
}: SecurityPanelProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-8 mb-6 transition-all duration-300 hover:shadow-xl border border-gray-100">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b pb-4">Alterar Senha</h2>

      <form onSubmit={handleChangePassword}>
        <div className="mb-6">
          <label htmlFor="currentPassword" className="flex items-center text-gray-700 font-medium mb-2">
            <FaLock className="mr-2 text-amber-500" />
            Senha Atual
          </label>
          <div className="relative">
            <input
              id="currentPassword"
              name="currentPassword"
              type="password"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
              required
            />
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="newPassword" className="flex items-center text-gray-700 font-medium mb-2">
            <FaLock className="mr-2 text-amber-500" />
            Nova Senha
          </label>
          <div className="relative">
            <input
              id="newPassword"
              name="newPassword"
              type="password"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
              required
              minLength={6}
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">A senha deve ter pelo menos 6 caracteres</p>
        </div>

        <div className="mb-6">
          <label htmlFor="confirmPassword" className="flex items-center text-gray-700 font-medium mb-2">
            <FaLock className="mr-2 text-amber-500" />
            Confirmar Nova Senha
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
              required
              minLength={6}
            />
          </div>
        </div>
        
        <div className="flex justify-end mt-8">
          <button
            type="submit"
            disabled={isChangingPassword}
            className={`px-6 py-3 rounded-lg text-white font-medium transition-all duration-300 
            ${isChangingPassword 
              ? 'bg-amber-400 cursor-not-allowed' 
              : 'bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 shadow-lg hover:shadow-amber-200/50'
            }`}
          >
            {isChangingPassword ? 'Alterando...' : 'Alterar Senha'}
          </button>
        </div>
      </form>
    </div>
  );
}
