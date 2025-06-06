'use client';

import React, { useState, useEffect } from 'react';
import api from '@/services/api';
import {
  SearchFilter,
  FilterSection,
  PurposeFilter,
  CategoryFilter,
  PriceFilter,
  ConditionFilter,
  BrandFilter,
  ClearFiltersButton
} from './ComponentsFilter';

interface Category {
  id: string;
  name: string;
}

interface FilterProps {
  onFilterChange: (filters: any) => void;
}

const ProductFilter: React.FC<FilterProps> = ({ onFilterChange }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [expandedSections, setExpandedSections] = useState({
    purpose: true,
    equipmentType: true,
    priceRange: true,
    condition: true,
    brand: true,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPurpose, setSelectedPurpose] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCondition, setSelectedCondition] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [priceRange, setPriceRange] = useState({
    min: '',
    max: ''
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        console.log('Fetching categories from API');
        const response = await api.get('/categories');
        
        if (!response.data.success) {
          console.error('API request was not successful:', response.data);
          setCategories([]);
          return;
        }

        const fetchedCategories = response.data.data;
        
        if (!Array.isArray(fetchedCategories)) {
          console.error('API did not return an array of categories:', fetchedCategories);
          setCategories([]);
          return;
        }
        
        console.log(`Successfully fetched ${fetchedCategories.length} categories from API`);
        setCategories(fetchedCategories);
      } catch (error) {
        console.error('Error fetching categories from API:', error);
        setCategories([]);
      }
    };

    fetchCategories();
  }, []);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section as keyof typeof prev]
    }));
  };

  const handlePurposeChange = (purpose: string) => {
    setSelectedPurpose(purpose);
    onFilterChange({ purpose });
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    onFilterChange({ category });
  };

  const handleConditionChange = (condition: string) => {
    setSelectedCondition(condition);
    onFilterChange({ condition });
  };
  const handleBrandChange = (brand: string) => {
    setSelectedBrand(brand);
    onFilterChange({ brand });
  };

  const handlePriceChange = (type: 'min' | 'max', value: string) => {
    setPriceRange(prev => {
      const newRange = { ...prev, [type]: value };
      onFilterChange({ 
        minPrice: newRange.min, 
        maxPrice: newRange.max 
      });
      return newRange;
    });
  };

  const handlePriceRangeSet = (min: string, max: string) => {
    setPriceRange({ min, max });
    onFilterChange({ minPrice: min, maxPrice: max });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange({ query: searchQuery });
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedPurpose('');
    setSelectedCategory('');
    setSelectedCondition('');
    setSelectedBrand('');
    setPriceRange({ min: '', max: '' });
    onFilterChange({
      query: '',
      purpose: '',
      category: '',
      condition: '',
      brand: '',
      minPrice: '',
      maxPrice: ''
    });
  };  return (
    <div className="lg:bg-transparent bg-white lg:rounded-none rounded-xl lg:shadow-none shadow-md">
      <div className="lg:hidden bg-amber-50 rounded-t-xl p-5 border-b border-amber-100">
        <h2 className="text-xl font-bold text-amber-800 mb-1">Filtros</h2>
        <p className="text-sm text-amber-700">Encontre o equipamento ideal</p>
      </div>
      
      <div className="lg:p-0 p-5">
        <SearchFilter 
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          onSearchSubmit={handleSearchSubmit}
        />
        
        <FilterSection
          title="Finalidade"
          icon={<svg className="w-5 h-5 lg:text-amber-300 text-amber-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>}
          isExpanded={expandedSections.purpose}
          onToggle={() => toggleSection('purpose')}
        >
          <PurposeFilter 
            selectedPurpose={selectedPurpose}
            onPurposeChange={handlePurposeChange}
          />
        </FilterSection>

        <FilterSection
          title="Tipo de Equipamento"
          icon={<svg className="w-5 h-5 lg:text-amber-300 text-amber-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path></svg>}
          isExpanded={expandedSections.equipmentType}
          onToggle={() => toggleSection('equipmentType')}
        >
          <CategoryFilter 
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
          />
        </FilterSection>

        <FilterSection
          title="Faixa de Preço"
          icon={<svg className="w-5 h-5 lg:text-amber-300 text-amber-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>}
          isExpanded={expandedSections.priceRange}
          onToggle={() => toggleSection('priceRange')}
        >
          <PriceFilter 
            priceRange={priceRange}
            onPriceChange={handlePriceChange}
            onPriceRangeSet={handlePriceRangeSet}
          />
        </FilterSection>

        <FilterSection
          title="Condição"
          icon={<svg className="w-5 h-5 lg:text-amber-300 text-amber-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>}
          isExpanded={expandedSections.condition}
          onToggle={() => toggleSection('condition')}
        >
          <ConditionFilter 
            selectedCondition={selectedCondition}
            onConditionChange={handleConditionChange}
          />
        </FilterSection>

        <FilterSection
          title="Marcas"
          icon={<svg className="w-5 h-5 lg:text-amber-300 text-amber-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 4v12l-4-2-4 2V4M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>}
          isExpanded={expandedSections.brand}
          onToggle={() => toggleSection('brand')}
        >
          <BrandFilter 
            selectedBrand={selectedBrand}
            onBrandChange={handleBrandChange}
          />
        </FilterSection>

        <ClearFiltersButton onClearFilters={handleClearFilters} />
      </div>
    </div>
  );
};

export default ProductFilter;