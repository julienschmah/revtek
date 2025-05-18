'use client';

import React from 'react';
import { BiLoader } from 'react-icons/bi';
import { FaArrowLeft } from 'react-icons/fa';
import Link from 'next/link';

export function LoadingState() {
  return (
    <div className="flex justify-center items-center h-96">
      <BiLoader className="animate-spin text-amber-600 mr-2" size={32} />
      <p className="text-gray-600 text-lg">Carregando produto...</p>
    </div>
  );
}

export function ProductNotFoundState() {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-8">
      <div className="flex items-center mb-6">
        <Link 
          href="/meus-produtos" 
          className="mr-4 text-gray-600 hover:text-amber-600 transition-colors"
        >
          <FaArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">Produto não encontrado</h1>
      </div>
      
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-gray-600 mb-4">O produto que você está procurando não foi encontrado.</p>
        <Link 
          href="/meus-produtos" 
          className="bg-amber-600 hover:bg-amber-700 text-white font-medium py-2 px-6 rounded-md transition-colors"
        >
          Voltar para a lista de produtos
        </Link>
      </div>
    </div>
  );
}
