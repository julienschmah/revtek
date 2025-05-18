'use client';

import React from 'react';
import ProtectedLayout from '@/components/layouts/ProtectedLayout';
import Header from './components/Header';
import BasicInfoSection from './components/BasicInfoSection'; 
import DimensionsSection from './components/DimensionsSection';
import FeaturesSection from './components/FeaturesSection';
import ImagesSection from './components/ImagesSection';
import FormButtons from './components/FormButtons';
import { LoadingState, ProductNotFoundState } from './components/StateComponents';
import { useProductForm } from './components/useProductForm';

type PageProps = {
  params: {
    id: string;
  };
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default function EditProductPage({ params }: PageProps) {
  const { 
    loading, 
    productNotFound, 
    formData, 
    errors, 
    isSubmitting, 
    handleChange,
    handleFeatureChange,
    addFeature,
    removeFeature,
    handleImageUpload,
    removeImage,
    handleSubmit
  } = useProductForm(params.id);

  if (loading) {
    return (
      <ProtectedLayout allowedRoles={['admin', 'seller']}>
        <div className="container mx-auto px-4 py-6">
          <LoadingState />
        </div>
      </ProtectedLayout>
    );
  }
  
  if (productNotFound) {
    return (
      <ProtectedLayout allowedRoles={['admin', 'seller']}>
        <div className="container mx-auto px-4 py-6">
          <ProductNotFoundState />
        </div>
      </ProtectedLayout>
    );
  }
  
  return (
    <ProtectedLayout allowedRoles={['admin', 'seller']}>
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <Header />
          
          <form onSubmit={handleSubmit} className="space-y-8">
            <BasicInfoSection 
              formData={formData}
              errors={errors}
              handleChange={handleChange}
            />
            
            <DimensionsSection 
              formData={formData}
              handleChange={handleChange}
            />
            
            <FeaturesSection 
              formData={formData}
              handleFeatureChange={handleFeatureChange}
              addFeature={addFeature}
              removeFeature={removeFeature}
            />     
            <ImagesSection 
              formData={formData}
              errors={errors}
              handleImageUpload={handleImageUpload}
              removeImage={removeImage}
            />
            
            <FormButtons isSubmitting={isSubmitting} />
          </form>
        </div>
      </div>
    </ProtectedLayout>
  );
} 