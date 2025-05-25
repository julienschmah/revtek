'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import ProtectedLayout from '@/components/layouts/ProtectedLayout';
import { FormData, ErrorState } from './components/types';
import { FaChevronRight, FaChevronLeft, FaCheckCircle, FaCamera, FaDollarSign, FaBoxOpen } from 'react-icons/fa';
import { IMaskInput } from 'react-imask';
import { useAuth } from '@/contexts/AuthContext';

// Componentes
import StepHeader from './components/StepHeader';
import SuccessModal from './components/SuccessModal';
import BasicInfoStep from './components/BasicInfoStep';
import DetailStep from './components/DetailStep';
import PhotoStep from './components/PhotoStep';
import ReviewStep from './components/ReviewStep';

export default function AnunciarPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [formStep, setFormStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
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
  const [errors, setErrors] = useState<ErrorState>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Verificar se o usuário preencheu os campos obrigatórios
  useEffect(() => {
    if (user) {
      // Verificar se os dados do perfil estão preenchidos
      if (!user.cpf && !user.cnpj) {
        alert('Para anunciar, você precisa completar seu cadastro preenchendo CPF ou CNPJ.');
        setRedirecting(true);
        router.push('/profile');
      }
    }
  }, [user, router]);

  // Se estiver redirecionando, não renderizar o restante do componente
  if (redirecting) {
    return (
      <ProtectedLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl mb-4">Redirecionando para completar seu cadastro...</h1>
            <p>Para anunciar produtos, você precisa preencher seus dados de CPF ou CNPJ.</p>
          </div>
        </div>
      </ProtectedLayout>
    );
  }
  
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

  // Função para upload de imagens
  const uploadImages = async (files: File[]): Promise<string[]> => {
    const uploadedPaths: string[] = [];
    for (const file of files) {
      const formData = new window.FormData();
      formData.append('file', file);
      // Corrige a URL para o backend
      const res = await fetch('http://localhost:3001/api/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success && data.path) {
        uploadedPaths.push(data.path);
      } else {
        throw new Error(data.message || 'Erro ao fazer upload da imagem');
      }
    }
    return uploadedPaths;
  };

  // Função para publicar anúncio
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(3)) return;
    setIsSubmitting(true);
    try {
      // 1. Upload das imagens
      const imagePaths = await uploadImages(formData.fotos);      // 2. Montar dados do produto
      const productPayload = {
        name: formData.titulo,
        description: formData.descricao,
        price: parseFloat(formData.preco.replace(/[^\d,\.]/g, '').replace(',', '.')),
        stock: parseInt(formData.quantidade, 10),
        categoryId: parseInt(formData.categoria, 10),
        brand: 'Genérica', // Valor padrão
        model: 'Padrão', // Valor padrão
        images: imagePaths,
        features: formData.especificacoes ? { especificacoes: formData.especificacoes } : {},
      };
      // 3. Enviar para API de produtos
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(productPayload),
      });
      const data = await res.json();
      if (data.success) {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        setFormStep(1);
        setFormData({ titulo: '', categoria: '', preco: '', quantidade: '', descricao: '', especificacoes: '', fotos: [] });
        setPreviewUrls([]);
      } else {
        alert(data.message || 'Erro ao publicar anúncio');
      }
    } catch (err: any) {
      alert(err.message || 'Erro ao publicar anúncio');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ProtectedLayout>      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden my-4 sm:my-8 p-0 sm:p-0">
        {/* Cabeçalho visual com ícones de etapas */}
        <StepHeader formStep={formStep} />

        {/* Modal de sucesso */}
        <SuccessModal 
          show={showSuccess}
          onClose={() => setShowSuccess(false)}
        />

        <form onSubmit={handleSubmit} className="p-4 sm:p-6">          {/* Etapa 1: Informações Básicas */}
          {formStep === 1 && (
            <BasicInfoStep
              formData={formData}
              errors={errors}
              handleChange={handleChange}
              setFormData={setFormData}
              goToStep={goToStep}
            />
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