'use client';

import React, { useState } from 'react';
import Breadcrumb from './Components/Breadcrumb';
import MobileFilterButton from './Components/MobileFilterButton';
import FilterSidebar from './FilterSidebar';
import SortControls from './Components/SortControls';
import ProductGrid from './Components/ProductGrid';
import NoProductsFound from './Components/NoProductsFound';
import LoadingSpinner from './Components/LoadingSpinner';
import ErrorMessage from './Components/ErrorMessage';
import { useProducts } from './hooks/useProducts';

export default function ListProductsPage() {
  const [sortOption, setSortOption] = useState('relevancia');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [filterParams, setFilterParams] = useState({
    category: '',
    condition: '',
    minPrice: '',
    maxPrice: '',
    brand: '',
    purpose: ''
  });

  const { products, displayedProducts, loading, error, fetchProducts } = useProducts(filterParams, sortOption);

  const handleFilterChange = (newFilters: any) => {
    setFilterParams(prev => ({
      ...prev,
      ...newFilters
    }));
  };

  const handleClearFilters = () => {
    setFilterParams({
      category: '',
      condition: '',
      minPrice: '',
      maxPrice: '',
      brand: '',
      purpose: ''
    });
  };

  return (
    <div className="bg-gray-100 min-h-screen pb-16">
      <div className="container mx-auto px-4 pt-6">
        <Breadcrumb />
        
        <MobileFilterButton 
          showMobileFilters={showMobileFilters}
          onToggle={() => setShowMobileFilters(prev => !prev)}
        />
        
        <div className="flex flex-col lg:flex-row gap-6">
          <FilterSidebar 
            showMobileFilters={showMobileFilters}
            onFilterChange={handleFilterChange}
            onCloseMobile={() => setShowMobileFilters(false)}
          />
          
          <div className="flex-1 lg:w-auto">
            <SortControls 
              displayedProductsCount={displayedProducts.length}
              sortOption={sortOption}
              onSortChange={setSortOption}
            />
            
            {loading ? (
              <LoadingSpinner />
            ) : error ? (
              <ErrorMessage 
                message={error} 
                onRetry={fetchProducts}
              />
            ) : displayedProducts.length > 0 ? (
              <ProductGrid 
                products={displayedProducts}
                filterParams={filterParams}
              />
            ) : (
              <NoProductsFound onClearFilters={handleClearFilters} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
