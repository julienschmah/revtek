import React from 'react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  return (
    <div className="bg-white rounded-xl shadow p-10 text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-600 mb-6">
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3 className="text-2xl font-bold text-gray-800 mb-3">Erro ao carregar produtos</h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        {message}
      </p>
      {onRetry && (
        <button 
          className="bg-amber-500 hover:bg-amber-600 text-white py-3 px-6 rounded-lg transition-colors font-medium shadow-sm hover:shadow"
          onClick={onRetry}
        >
          Tentar novamente
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
