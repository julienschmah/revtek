'use client';

import { useRef } from 'react';
import { FaCamera, FaChevronLeft, FaChevronRight, FaTrash } from 'react-icons/fa';
import Image from 'next/image';

interface PhotoStepProps {
  formData: {
    fotos: File[];
  };
  previewUrls: string[];
  errors: { [key: string]: string };
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  removeFile: (index: number) => void;
  goToStep: (step: number) => void;
}

export default function PhotoStep({
  formData,
  previewUrls,
  errors,
  fileInputRef,
  handleFileChange,
  handleDrop,
  handleDragOver,
  removeFile,
  goToStep
}: PhotoStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
          Fotos do Produto*
          <span className="ml-1 text-xs text-gray-400" title="Adicione fotos reais e de boa qualidade">?</span>
        </label>
        <div
          className={`mt-1 flex flex-col items-center justify-center px-4 pt-5 pb-6 border-2 border-dashed rounded-lg ${errors.fotos ? 'border-red-400' : 'border-gray-300'}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          style={{ minHeight: '120px' }}
        >
          <div className="flex flex-col items-center w-full">
            <FaCamera className="h-10 w-10 text-gray-400 mb-2" />
            <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-amber-600 hover:text-amber-500 px-3 py-1 border border-amber-200 shadow-sm">
              Selecionar arquivos
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                className="sr-only"
                multiple
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
              />
            </label>
            <p className="text-xs text-gray-500 mt-2">PNG, JPG, GIF até 10MB (máx. 5 imagens)</p>
            <p className="text-xs text-gray-400">ou arraste e solte aqui</p>
          </div>
          {errors.fotos && <span className="text-xs text-red-500 mt-2">{errors.fotos}</span>}
        </div>
        
        {previewUrls.length > 0 && (
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
            {previewUrls.map((url, index) => (
              <div key={index} className="relative rounded-lg overflow-hidden border border-gray-300 group">
                <div className="relative w-full h-24 sm:h-32">
                  <Image 
                    src={url} 
                    alt={`Foto ${index + 1}`} 
                    fill
                    style={{ objectFit: 'cover' }} 
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <FaTrash size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="pt-4 flex flex-col sm:flex-row justify-between gap-2">
        <button
          type="button"
          onClick={() => goToStep(2)}
          className="border border-amber-500 text-amber-600 hover:bg-amber-50 px-6 py-2 rounded-lg font-medium transition-colors w-full sm:w-auto"
        >
          <FaChevronLeft className="inline mr-2" /> Voltar
        </button>
        <button
          type="button"
          onClick={() => goToStep(4)}
          className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-lg font-medium transition-colors w-full sm:w-auto"
        >
          Continuar <FaChevronRight className="inline ml-2" />
        </button>
      </div>
    </div>
  );
}
