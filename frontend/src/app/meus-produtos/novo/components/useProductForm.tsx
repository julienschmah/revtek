'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProductFormData } from './types';
import api, { uploadImage } from '@/services/api';

export function useProductForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    images: ['/images/restaurante.png'],
    isNew: true,
    brand: '',
    model: '',
    warranty: '12',
    weight: '',
    dimensions: {
      width: '',
      height: '',
      depth: '',
    },
    features: [{ key: '', value: '' }],
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Handle changes in form fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Handle nested fields
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as Record<string, string>),
          [child]: value,
        }
      }));
    } else {
      // Handle regular fields
      setFormData(prev => ({
        ...prev,
        [name]: e.target.type === 'checkbox' 
          ? (e.target as HTMLInputElement).checked 
          : value
      }));
    }
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  // Handle feature changes
  const handleFeatureChange = (index: number, field: 'key' | 'value', value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index][field] = value;
    setFormData(prev => ({
      ...prev,
      features: newFeatures
    }));
  };
  
  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, { key: '', value: '' }]
    }));
  };
  
  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };
  
  // Image handling
  const handleImageUpload = async (e?: React.ChangeEvent<HTMLInputElement>) => {
    if (!e?.target?.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    try {
      const path = await uploadImage(file);
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, path],
      }));
    } catch {
      setApiError('Erro ao fazer upload da imagem.');
    }
  };
  
  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };
  
  // Form validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Validações obrigatórias
    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Descrição é obrigatória';
    }
    
    if (!formData.price.trim()) {
      newErrors.price = 'Preço é obrigatório';
    } else if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Preço deve ser um valor positivo';
    }
    
    if (!formData.stock.trim()) {
      newErrors.stock = 'Estoque é obrigatório';
    } else if (isNaN(parseInt(formData.stock)) || parseInt(formData.stock) < 0) {
      newErrors.stock = 'Estoque deve ser um número não negativo';
    }
    
    if (!formData.category) {
      newErrors.category = 'Categoria é obrigatória';
    }
    
    if (!formData.brand.trim()) {
      newErrors.brand = 'Marca é obrigatória';
    }
    
    if (!formData.model.trim()) {
      newErrors.model = 'Modelo é obrigatório';
    }
    
    if (formData.images.length === 0) {
      newErrors.images = 'Pelo menos uma imagem é obrigatória';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Scroll para o primeiro erro
      const firstErrorField = Object.keys(errors)[0];
      const errorElement = document.querySelector(`[name="${firstErrorField}"]`);
      errorElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    
    setIsSubmitting(true);
    setApiError(null);
    try {
      // Montar payload para API
      const payload = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price.replace(/\./g, '').replace(',', '.')),
        stock: parseInt(formData.stock),
        categoryId: formData.category,
        images: formData.images,
        isNew: formData.isNew,
        brand: formData.brand,
        model: formData.model,
        warranty: formData.warranty ? parseInt(formData.warranty) : 0,
        weight: formData.weight ? parseFloat(formData.weight.replace(',', '.')) : null,
        width: formData.dimensions.width ? parseFloat(formData.dimensions.width.replace(',', '.')) : null,
        height: formData.dimensions.height ? parseFloat(formData.dimensions.height.replace(',', '.')) : null,
        depth: formData.dimensions.depth ? parseFloat(formData.dimensions.depth.replace(',', '.')) : null,
        features: formData.features.filter(f => f.key && f.value),
      };
      
      // Chamada real à API
      await api.post('/products', payload);
      setShowSuccessModal(true);
      
      // Opcional: notificar página de listagem para atualizar (ex: via contexto ou evento)
      // window.dispatchEvent(new Event('refreshMyProducts'));
      
      setTimeout(() => {
        router.push('/meus-produtos');
      }, 1200);
    } catch (error: unknown) {
      const errorResponse = error as { response?: { data?: { message?: string } } };
      if (errorResponse.response?.data?.message) {
        setApiError(errorResponse.response.data.message);
      } else {
        setApiError('Ocorreu um erro ao salvar o produto. Por favor, tente novamente.');
      }
      console.error('Erro ao enviar produto:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    errors,
    isSubmitting,
    showSuccessModal,
    apiError,
    handleChange,
    handleFeatureChange,
    addFeature,
    removeFeature,
    handleImageUpload,
    removeImage,
    handleSubmit,
    setApiError,
  };
}
