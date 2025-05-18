'use client';

import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface DetailStepProps {
  formData: {
    descricao: string;
    especificacoes: string;
  };
  errors: { [key: string]: string };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  goToStep: (step: number) => void;
}

export default function DetailStep({
  formData,
  errors,
  handleChange,
  goToStep
}: DetailStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
          Descrição Detalhada*
          <span className="ml-1 text-xs text-gray-400" title="Descreva o produto de forma completa">?</span>
        </label>
        <textarea
          name="descricao"
          value={formData.descricao}
          onChange={handleChange}
          rows={6}
          className={`w-full px-4 py-2 rounded-lg border ${errors.descricao ? 'border-red-400' : 'border-gray-300'} focus:ring-2 focus:ring-amber-500 focus:border-transparent`}
          placeholder="Descreva o produto em detalhes, incluindo características, benefícios, estado de conservação, etc."
          required
        ></textarea>
        {errors.descricao && <span className="text-xs text-red-500">{errors.descricao}</span>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
          Especificações Técnicas
          <span className="ml-1 text-xs text-gray-400" title="Dimensões, material, potência, etc.">?</span>
        </label>
        <textarea
          name="especificacoes"
          value={formData.especificacoes}
          onChange={handleChange}
          rows={4}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          placeholder="Informe as especificações técnicas do produto (dimensões, material, potência, etc.)"
        ></textarea>
      </div>
      <div className="pt-4 flex flex-col sm:flex-row justify-between gap-2">
        <button
          type="button"
          onClick={() => goToStep(1)}
          className="border border-amber-500 text-amber-600 hover:bg-amber-50 px-6 py-2 rounded-lg font-medium transition-colors w-full sm:w-auto"
        >
          <FaChevronLeft className="inline mr-2" /> Voltar
        </button>
        <button
          type="button"
          onClick={() => goToStep(3)}
          className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-lg font-medium transition-colors w-full sm:w-auto"
        >
          Continuar <FaChevronRight className="inline ml-2" />
        </button>
      </div>
    </div>
  );
}
