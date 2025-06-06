import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col justify-center items-center h-80 bg-white rounded-xl p-10">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-amber-500 mb-4"></div>
      <p className="text-gray-600 font-medium">Carregando produtos...</p>
      <p className="text-gray-400 text-sm mt-2">Aguarde enquanto buscamos os melhores produtos para você</p>
    </div>
  );
};

export default LoadingSpinner;
