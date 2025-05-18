'use client';

import { FaChevronLeft } from 'react-icons/fa';
import Image from 'next/image';

interface ReviewStepProps {
  formData: {
    titulo: string;
    categoria: string;
    preco: string;
    quantidade: string;
    descricao: string;
    especificacoes: string;
    fotos: File[];
  };
  previewUrls: string[];
  goToStep: (step: number) => void;
  isSubmitting: boolean;
}

export default function ReviewStep({
  formData,
  previewUrls,
  goToStep,
  isSubmitting
}: ReviewStepProps) {
  // Função para obter o nome da categoria
  const getCategoryName = (categoryValue: string) => {
    const categories: {[key: string]: string} = {
      'fogoes': 'Fogões Industriais',
      'refrigeracao': 'Refrigeração',
      'fornos': 'Fornos',
      'chapas': 'Chapas e Fritadeiras',
      'liquidificadores': 'Liquidificadores',
      'utensilios': 'Utensílios',
      'outros': 'Outros'
    };
    return categories[categoryValue] || categoryValue;
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Revise seu anúncio</h2>
      
      {/* Informações básicas */}
      <div className="border border-gray-200 rounded-lg p-4">
        <h3 className="text-lg font-medium text-gray-700 mb-2">Informações básicas</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Título</p>
            <p className="text-base">{formData.titulo}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Categoria</p>
            <p className="text-base">{getCategoryName(formData.categoria)}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Preço</p>
            <p className="text-base">R$ {formData.preco}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Quantidade</p>
            <p className="text-base">{formData.quantidade} unidades</p>
          </div>
        </div>
      </div>
      
      {/* Descrição e especificações */}
      <div className="border border-gray-200 rounded-lg p-4">
        <h3 className="text-lg font-medium text-gray-700 mb-2">Descrição e especificações</h3>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Descrição</p>
            <p className="text-base whitespace-pre-line">{formData.descricao}</p>
          </div>
          {formData.especificacoes && (
            <div>
              <p className="text-sm font-medium text-gray-500">Especificações técnicas</p>
              <p className="text-base whitespace-pre-line">{formData.especificacoes}</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Fotos */}
      <div className="border border-gray-200 rounded-lg p-4">
        <h3 className="text-lg font-medium text-gray-700 mb-2">Fotos</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {previewUrls.map((url, index) => (
            <div key={index} className="relative rounded-lg overflow-hidden border border-gray-300">
              <div className="relative w-full h-24 sm:h-32">
                <Image 
                  src={url} 
                  alt={`Foto ${index + 1}`} 
                  fill
                  style={{ objectFit: 'cover' }} 
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="pt-4 flex flex-col sm:flex-row justify-between gap-2">
        <button
          type="button"
          onClick={() => goToStep(3)}
          className="border border-amber-500 text-amber-600 hover:bg-amber-50 px-6 py-2 rounded-lg font-medium transition-colors w-full sm:w-auto"
        >
          <FaChevronLeft className="inline mr-2" /> Voltar
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-lg font-medium transition-colors w-full sm:w-auto ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
        >
          {isSubmitting ? 'Enviando...' : 'Publicar anúncio'}
        </button>
      </div>
    </div>
  );
}
