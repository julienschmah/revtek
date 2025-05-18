'use client';

import React from 'react';
import ProtectedLayout from '@/components/layouts/ProtectedLayout';

// Import components
import Header from './components/Header';
import BasicInfoSection from './components/BasicInfoSection';
import DimensionsSection from './components/DimensionsSection';
import FeaturesSection from './components/FeaturesSection';
import ImagesSection from './components/ImagesSection';
import FormButtons from './components/FormButtons';
import { SuccessModal, ApiErrorNotification } from './components/Notifications';

// Import form logic hook
import { useProductForm } from './components/useProductForm';

export default function NewProductPage() {
  const {
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
  } = useProductForm();
  
  return (
    <ProtectedLayout allowedRoles={['admin', 'seller']}>
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <Header />
          
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Informações básicas */}
            <BasicInfoSection 
              formData={formData}
              errors={errors}
              handleChange={handleChange}
            />
            
            {/* Dimensões e peso */}
            <DimensionsSection 
              formData={formData} 
              handleChange={handleChange}
            />
            
            {/* Características técnicas */}
            <FeaturesSection 
              formData={formData}
              handleFeatureChange={handleFeatureChange}
              addFeature={addFeature}
              removeFeature={removeFeature}
            />
            
            {/* Imagens */}
            <ImagesSection 
              formData={formData}
              errors={errors}
              handleImageUpload={handleImageUpload}
              removeImage={removeImage}
            />
            
            {/* Botões de formulário */}
            <FormButtons isSubmitting={isSubmitting} />
          </form>
        </div>
      </div>
      
      {/* Notifications */}
      <SuccessModal show={showSuccessModal} />
      <ApiErrorNotification apiError={apiError} onClose={() => setApiError(null)} />
    </ProtectedLayout>
  );
}