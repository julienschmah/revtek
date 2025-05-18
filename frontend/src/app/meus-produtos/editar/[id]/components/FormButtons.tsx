'use client';

import React from 'react';
import Link from 'next/link';
import { FaSave } from 'react-icons/fa';
import { BiLoader } from 'react-icons/bi';

interface FormButtonsProps {
  isSubmitting: boolean;
}

export default function FormButtons({ isSubmitting }: FormButtonsProps) {
  return (
    <div className="flex justify-between pt-4 border-t border-gray-200">
      <Link 
        href="/meus-produtos" 
        className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-md transition-colors"
      >
        Cancelar
      </Link>
      
      <button 
        type="submit"
        disabled={isSubmitting}
        className="bg-amber-600 hover:bg-amber-700 text-white font-medium py-2 px-6 rounded-md transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center"
      >
        {isSubmitting ? (
          <>
            <BiLoader className="animate-spin mr-2" />
            Salvando...
          </>
        ) : (
          <>
            <FaSave className="mr-2" />
            Salvar Alterações
          </>
        )}
      </button>
    </div>
  );
}
