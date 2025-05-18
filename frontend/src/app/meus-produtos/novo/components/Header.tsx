'use client';

import React from 'react';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';

export default function Header() {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center">
        <Link 
          href="/meus-produtos" 
          className="mr-4 text-gray-600 hover:text-amber-600 transition-colors"
        >
          <FaArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">Cadastrar Novo Produto</h1>
      </div>
    </div>
  );
}
