'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProductFormData, mockProducts } from './types';

export function useProductForm(id: string | string[]) {
  // Ensure id is a string
  const productId = Array.isArray(id) ? id[0] : id;
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    images: [],
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
  const [productNotFound, setProductNotFound] = useState(false);
  // Carregando dados do produto
  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        
        // Simular chamada à API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Buscar dados do produto pelo ID
        if (mockProducts[productId as keyof typeof mockProducts]) {
          setFormData(mockProducts[productId as keyof typeof mockProducts] as ProductFormData);
          setProductNotFound(false);
        } else {
          setProductNotFound(true);
        }
        
      } catch (error) {
        console.error('Erro ao carregar produto:', error);
        alert('Erro ao carregar dados do produto. Tente novamente.');      } finally {
        setLoading(false);
      }
    };
    
    loadProduct();
  }, [productId]);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => {
        const newState = { ...prev };
        const parentKey = parent as keyof ProductFormData;
        if (parentKey === 'dimensions') {
          newState.dimensions = {
            ...prev.dimensions,
            [child]: value,
          };
        }
        
        return newState;
      });
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: e.target.type === 'checkbox' 
          ? (e.target as HTMLInputElement).checked 
          : value
      }));
    }
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
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
  
  const handleImageUpload = () => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, '/images/restaurante.png']
    }));
  };
  
  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };
  
  // Validar formulário
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
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
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      const firstErrorField = Object.keys(errors)[0];
      const errorElement = document.querySelector(`[name="${firstErrorField}"]`);
      errorElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      router.push('/meus-produtos');
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      alert('Ocorreu um erro ao salvar o produto. Por favor, tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    loading,
    isSubmitting,
    formData,
    errors,
    productNotFound,
    handleChange,
    handleFeatureChange,
    addFeature,
    removeFeature,
    handleImageUpload,
    removeImage,
    handleSubmit
  };
}
