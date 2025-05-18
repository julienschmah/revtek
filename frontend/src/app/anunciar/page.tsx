'use client';

import { useState, useRef } from 'react';
import ProtectedLayout from '@/components/layouts/ProtectedLayout';
import Image from 'next/image';
import { FaBoxOpen, FaDollarSign, FaCheckCircle, FaChevronRight, FaChevronLeft, FaCamera } from 'react-icons/fa';
import { IMaskInput } from 'react-imask';

export default function AnunciarPage() {
  const [formStep, setFormStep] = useState(1);
  const [formData, setFormData] = useState({
    titulo: '',
    categoria: '',
    preco: '',
    quantidade: '',
    descricao: '',
    especificacoes: '',
    fotos: [] as File[],
  });
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<{[key:string]: string}>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Validação simples
  const validateStep = (step: number) => {
    const newErrors: {[key:string]: string} = {};
    if (step === 1) {
      if (!formData.titulo) newErrors.titulo = 'Título obrigatório';
      if (!formData.categoria) newErrors.categoria = 'Selecione uma categoria';
      if (!formData.preco) newErrors.preco = 'Informe o preço';
      if (!formData.quantidade) newErrors.quantidade = 'Informe a quantidade';
    }
    if (step === 2) {
      if (!formData.descricao) newErrors.descricao = 'Descrição obrigatória';
    }
    if (step === 3) {
      if (formData.fotos.length === 0) newErrors.fotos = 'Adicione pelo menos uma foto';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files).slice(0, 5 - formData.fotos.length);
      setFormData(prev => ({
        ...prev,
        fotos: [...prev.fotos, ...filesArray],
      }));
      // Previews
      const newPreviews = filesArray.map(file => URL.createObjectURL(file));
      setPreviewUrls(prev => [...prev, ...newPreviews]);
    }
  };

  // Drag and drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      const filesArray = Array.from(e.dataTransfer.files).slice(0, 5 - formData.fotos.length);
      setFormData(prev => ({
        ...prev,
        fotos: [...prev.fotos, ...filesArray],
      }));
      const newPreviews = filesArray.map(file => URL.createObjectURL(file));
      setPreviewUrls(prev => [...prev, ...newPreviews]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const removeFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      fotos: prev.fotos.filter((_, i) => i !== index),
    }));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const goToStep = (step: number) => {
    if (step > formStep && !validateStep(formStep)) return;
    setFormStep(step);
    window.scrollTo(0, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(3)) return;
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
    // Aqui você pode enviar os dados para a API
  };

  return (
    <ProtectedLayout>
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden my-4 sm:my-8 p-0 sm:p-0">
        {/* Cabeçalho visual com ícones de etapas */}
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-6 sm:px-6 sm:py-8 text-white relative overflow-hidden">
          <div className="flex justify-between items-center max-w-md mx-auto">
            <div className="flex flex-col items-center flex-1">
              <div className={`rounded-full w-10 h-10 flex items-center justify-center border-2 ${formStep>=1?'border-white bg-amber-100 text-amber-700':'border-white/40 bg-white/20 text-white/70'}`}>1</div>
              <span className="text-xs mt-1 font-medium">Básico</span>
            </div>
            <FaChevronRight className={`mx-1 sm:mx-2 text-lg ${formStep>=2?'text-white':'text-white/40'}`} />
            <div className="flex flex-col items-center flex-1">
              <div className={`rounded-full w-10 h-10 flex items-center justify-center border-2 ${formStep>=2?'border-white bg-amber-100 text-amber-700':'border-white/40 bg-white/20 text-white/70'}`}>2</div>
              <span className="text-xs mt-1 font-medium">Detalhes</span>
            </div>
            <FaChevronRight className={`mx-1 sm:mx-2 text-lg ${formStep>=3?'text-white':'text-white/40'}`} />
            <div className="flex flex-col items-center flex-1">
              <div className={`rounded-full w-10 h-10 flex items-center justify-center border-2 ${formStep>=3?'border-white bg-amber-100 text-amber-700':'border-white/40 bg-white/20 text-white/70'}`}>3</div>
              <span className="text-xs mt-1 font-medium">Fotos</span>
            </div>
            <FaChevronRight className={`mx-1 sm:mx-2 text-lg ${formStep>=4?'text-white':'text-white/40'}`} />
            <div className="flex flex-col items-center flex-1">
              <div className={`rounded-full w-10 h-10 flex items-center justify-center border-2 ${formStep>=4?'border-white bg-amber-100 text-amber-700':'border-white/40 bg-white/20 text-white/70'}`}>4</div>
              <span className="text-xs mt-1 font-medium">Revisão</span>
            </div>
          </div>
        </div>

        {/* Modal de sucesso */}
        {showSuccess && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center max-w-xs w-full">
              <FaCheckCircle className="text-4xl text-amber-500 mb-2" />
              <h2 className="text-lg font-bold mb-1 text-gray-800">Anúncio enviado!</h2>
              <p className="text-gray-600 text-center mb-4">Seu anúncio foi enviado com sucesso e será revisado pela equipe RevMak.</p>
              <button onClick={()=>setShowSuccess(false)} className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-lg font-medium transition-colors">Fechar</button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-4 sm:p-6">
          {/* Etapa 1: Informações Básicas */}
          {formStep === 1 && (
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
                  className={`w-full px-4 py-2 rounded-lg border ${errors.titulo?'border-red-400':'border-gray-300'} focus:ring-2 focus:ring-amber-500 focus:border-transparent`}
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
                  className={`w-full px-4 py-2 rounded-lg border ${errors.categoria?'border-red-400':'border-gray-300'} focus:ring-2 focus:ring-amber-500 focus:border-transparent`}
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
                      className={`w-full pl-10 pr-4 py-2 rounded-lg border ${errors.preco?'border-red-400':'border-gray-300'} focus:ring-2 focus:ring-amber-500 focus:border-transparent`}
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
                      className={`w-full pl-10 pr-4 py-2 rounded-lg border ${errors.quantidade?'border-red-400':'border-gray-300'} focus:ring-2 focus:ring-amber-500 focus:border-transparent`}
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
          )}

          {/* Etapa 2: Descrição e Detalhes */}
          {formStep === 2 && (
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
                  className={`w-full px-4 py-2 rounded-lg border ${errors.descricao?'border-red-400':'border-gray-300'} focus:ring-2 focus:ring-amber-500 focus:border-transparent`}
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
          )}

          {/* Etapa 3: Fotos do Produto */}
          {formStep === 3 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  Fotos do Produto*
                  <span className="ml-1 text-xs text-gray-400" title="Adicione fotos reais e de boa qualidade">?</span>
                </label>
                <div
                  className={`mt-1 flex flex-col items-center justify-center px-4 pt-5 pb-6 border-2 border-dashed rounded-lg ${errors.fotos?'border-red-400':'border-gray-300'}`}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  style={{minHeight: '120px'}}
                >
                  <div className="flex flex-col items-center w-full">
                    <FaCamera className="h-10 w-10 text-gray-400 mb-2" />
                    <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-amber-600 hover:text-amber-500 px-3 py-1 border border-amber-200 shadow-sm">
                      <span>Carregar fotos</span>
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
                  {/* Prévia das imagens */}
                  {previewUrls.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4 w-full justify-center">
                      {previewUrls.map((url, idx) => (
                        <div key={idx} className="relative group">
                          <Image src={url} alt="Prévia" width={80} height={80} className="w-20 h-20 object-cover rounded-md border border-gray-200 shadow-sm" />
                          <button
                            type="button"
                            onClick={() => removeFile(idx)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow group-hover:scale-110 transition-transform"
                            title="Remover"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
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
                  className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-2 rounded-lg font-medium transition-colors w-full sm:w-auto"
                >
                  Revisar <FaChevronRight className="inline ml-2" />
                </button>
              </div>
            </div>
          )}

          {/* Etapa 4: Revisão */}
          {formStep === 4 && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-gray-800 mb-2">Revise seu anúncio</h2>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="mb-2">
                  <span className="font-semibold text-gray-700">Título:</span> {formData.titulo}
                </div>
                <div className="mb-2">
                  <span className="font-semibold text-gray-700">Categoria:</span> {formData.categoria}
                </div>
                <div className="mb-2">
                  <span className="font-semibold text-gray-700">Preço:</span> R$ {formData.preco}
                </div>
                <div className="mb-2">
                  <span className="font-semibold text-gray-700">Quantidade:</span> {formData.quantidade}
                </div>
                <div className="mb-2">
                  <span className="font-semibold text-gray-700">Descrição:</span> {formData.descricao}
                </div>
                {formData.especificacoes && (
                  <div className="mb-2">
                    <span className="font-semibold text-gray-700">Especificações:</span> {formData.especificacoes}
                  </div>
                )}
                {previewUrls.length > 0 && (
                  <div className="mb-2">
                    <span className="font-semibold text-gray-700">Fotos:</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {previewUrls.map((url, idx) => (
                        <Image key={idx} src={url} alt="Prévia" width={64} height={64} className="w-16 h-16 object-cover rounded-md border border-gray-200" />
                      ))}
                    </div>
                  </div>
                )}
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
                  className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-2 rounded-lg font-medium transition-colors w-full sm:w-auto"
                >
                  Publicar Anúncio <FaCheckCircle className="inline ml-2" />
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </ProtectedLayout>
  );
}