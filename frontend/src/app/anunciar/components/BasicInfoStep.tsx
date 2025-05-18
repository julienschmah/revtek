'use client';

import { IMaskInput } from 'react-imask';
import { FaBoxOpen, FaDollarSign, FaChevronRight } from 'react-icons/fa';

interface BasicInfoStepProps {
  formData: {
    titulo: string;
    categoria: string;
    preco: string;
    quantidade: string;
  };
  errors: { [key: string]: string };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  setFormData: React.Dispatch<React.SetStateAction<{
    titulo: string;
    categoria: string;
    preco: string;
    quantidade: string;
    descricao: string;
    especificacoes: string;
    fotos: File[];
  }>>;
  
  goToStep: (step: number) => void;
}

export default function BasicInfoStep({
  formData,
  errors,
  handleChange,
  setFormData,
  goToStep
}: BasicInfoStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
          Título do Anúncio*
          <span className="ml-1 text-xs text-gray-400" title="Seja claro e objetivo">?</span>
        </label>
        <input
          type="text"
          name="titulo"
          value={formData.titulo}
          onChange={handleChange}
          className={`w-full px-4 py-2 rounded-lg border ${errors.titulo ? 'border-red-400' : 'border-gray-300'} focus:ring-2 focus:ring-amber-500 focus:border-transparent`}
          placeholder="Ex: Fogão Industrial 6 Bocas de Alta Pressão"
          required
        />
        {errors.titulo && <span className="text-xs text-red-500">{errors.titulo}</span>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
          Categoria*
          <span className="ml-1 text-xs text-gray-400" title="Escolha a categoria mais adequada">?</span>
        </label>
        <select
          name="categoria"
          value={formData.categoria}
          onChange={handleChange}
          className={`w-full px-4 py-2 rounded-lg border ${errors.categoria ? 'border-red-400' : 'border-gray-300'} focus:ring-2 focus:ring-amber-500 focus:border-transparent`}
          required
        >
          <option value="">Selecione uma categoria</option>
          <option value="fogoes">Fogões Industriais</option>
          <option value="refrigeracao">Refrigeração</option>
          <option value="fornos">Fornos</option>
          <option value="chapas">Chapas e Fritadeiras</option>
          <option value="liquidificadores">Liquidificadores</option>
          <option value="utensilios">Utensílios</option>
          <option value="outros">Outros</option>
        </select>
        {errors.categoria && <span className="text-xs text-red-500">{errors.categoria}</span>}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
            Preço (R$)*
            <span className="ml-1 text-xs text-gray-400" title="Informe o valor do produto">?</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaDollarSign className="text-gray-400" />
            </div>
            <IMaskInput
              mask="num"
              blocks={{
                num: {
                  mask: Number,
                  thousandsSeparator: '.',
                  radix: ',',
                  mapToRadix: [','],
                  min: 0.01,
                  max: 999999999.99,
                  scale: 2,
                  padFractionalZeros: false,
                  normalizeZeros: true,
                },
              }}
              value={formData.preco}
              onAccept={(value) => setFormData(prev => ({ ...prev, preco: value }))}
              type="text"
              name="preco"
              className={`w-full pl-10 pr-4 py-2 rounded-lg border ${errors.preco ? 'border-red-400' : 'border-gray-300'} focus:ring-2 focus:ring-amber-500 focus:border-transparent`}
              placeholder="0,00"
              required
            />
            {errors.preco && <span className="text-xs text-red-500 absolute left-0 -bottom-5">{errors.preco}</span>}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
            Quantidade Disponível*
            <span className="ml-1 text-xs text-gray-400" title="Quantos produtos você tem?">?</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaBoxOpen className="text-gray-400" />
            </div>
            <IMaskInput
              mask={Number}
              min={1}
              max={99999}
              value={formData.quantidade}
              onAccept={(value) => setFormData(prev => ({ ...prev, quantidade: value }))}
              type="text"
              name="quantidade"
              className={`w-full pl-10 pr-4 py-2 rounded-lg border ${errors.quantidade ? 'border-red-400' : 'border-gray-300'} focus:ring-2 focus:ring-amber-500 focus:border-transparent`}
              placeholder="1"
              required
            />
            {errors.quantidade && <span className="text-xs text-red-500 absolute left-0 -bottom-5">{errors.quantidade}</span>}
          </div>
        </div>
      </div>
      <div className="pt-4 flex flex-col sm:flex-row justify-end gap-2">
        <button
          type="button"
          onClick={() => goToStep(2)}
          className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-lg font-medium transition-colors w-full sm:w-auto"
        >
          Continuar <FaChevronRight className="inline ml-2" />
        </button>
      </div>
    </div>
  );
}
