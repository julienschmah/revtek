'use client';

import React, { useState, useEffect } from 'react';
import ProtectedLayout from '@/components/layouts/ProtectedLayout';
import { BsStarFill, BsLightningCharge, BsShieldCheck } from 'react-icons/bs';
import { FaTruck, FaPercent, FaRegClock } from 'react-icons/fa';
import { MdKitchen } from 'react-icons/md';
import api from '@/services/api';

// Importar componentes do arquivo de índice
import { 
  Breadcrumb, 
  FilterBar, 
  SearchBar, 
  SideFilters, 
  ProductList 
} from '@/components/products/listing';

// Importar tipos
import type { BreadcrumbItem } from '@/components/products/listing/Breadcrumb';
import type { FilterOption } from '@/components/products/listing/FilterBar';
import type { FilterGroup } from '@/components/products/listing/SideFilters';

// Tipos de dados
interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviewCount: number;
  category: string;
  brand: string;
  inStock: boolean;
  freeShipping?: boolean;
  featuredLabel?: string;
  isNew?: boolean;
}

interface PriceRange {
  min: number;
  max: number;
}

// Opções de filtro rápido
const quickFilterOptions: FilterOption[] = [
  { id: 'promocao', label: 'Promoção', icon: <FaPercent /> },
  { id: 'fogoes', label: 'Fogões', icon: <MdKitchen /> },
  { id: 'novidades', label: 'Novidades', icon: <BsLightningCharge /> },
  { id: 'freteGratis', label: 'Frete Grátis', icon: <FaTruck /> },
  { id: 'mais-vendidos', label: 'Mais Vendidos', icon: <BsStarFill /> },
  { id: 'garantia', label: 'Garantia Estendida', icon: <BsShieldCheck /> },
  { id: 'pronta-entrega', label: 'Pronta Entrega', icon: <FaRegClock /> },
];

// Grupos de filtro lateral
const filterGroups: FilterGroup[] = [
  {
    id: 'category',
    title: 'Categorias',
    type: 'checkbox',
    options: [
      { id: 'fogoes', label: 'Fogões', count: 125 },
      { id: 'fornos', label: 'Fornos', count: 87 },
      { id: 'refrigeradores', label: 'Refrigeradores', count: 56 },
      { id: 'liquidificadores', label: 'Liquidificadores', count: 43 },
      { id: 'batedeiras', label: 'Batedeiras', count: 38 },
      { id: 'utilidades', label: 'Utensílios de Cozinha', count: 120 },
    ],
  },
  {
    id: 'brand',
    title: 'Marcas',
    type: 'checkbox',
    options: [
      { id: 'tramontina', label: 'Tramontina', count: 87 },
      { id: 'consul', label: 'Consul', count: 64 },
      { id: 'brastemp', label: 'Brastemp', count: 53 },
      { id: 'electrolux', label: 'Electrolux', count: 49 },
      { id: 'progás', label: 'Progás', count: 38 },
      { id: 'venancio', label: 'Venâncio', count: 32 },
    ],
  },
  {
    id: 'price',
    title: 'Faixa de Preço',
    type: 'range',
    priceRange: {
      min: 0,
      max: 10000,
      current: { min: 0, max: 10000 },
    },
  },
  {
    id: 'rating',
    title: 'Avaliação',
    type: 'radio',
    options: [
      { id: '4+', label: '4 estrelas ou mais' },
      { id: '3+', label: '3 estrelas ou mais' },
      { id: '2+', label: '2 estrelas ou mais' },
      { id: '1+', label: '1 estrela ou mais' },
    ],
  },
];

// Opções de ordenação
const sortOptions = [
  { value: 'relevance', label: 'Relevância' },
  { value: 'newest', label: 'Mais recentes' },
  { value: 'price_asc', label: 'Menor preço' },
  { value: 'price_desc', label: 'Maior preço' },
  { value: 'rating', label: 'Melhor avaliados' },
];

export default function ProductsPage() {
  // Estados
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const [activePriceRanges, setActivePriceRanges] = useState<Record<string, PriceRange>>({});
  const [quickFilters, setQuickFilters] = useState<string[]>([]);
  const [currentSort, setCurrentSort] = useState('relevance');
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | undefined>();
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Breadcrumb simulado
  const breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Produtos', href: '/produtos' },
  ];

  // Carregar produtos reais da API pública  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(undefined);
      try {
        // Montar parâmetros de busca/filtro
        const params: Record<string, string | number> = {};
        if (searchQuery) params.search = searchQuery;
        // Filtros rápidos e laterais (exemplo simplificado)
        if (activeFilters.category && activeFilters.category.length > 0) {
          // Supondo que categoryId seja o slug ou id real
          params.categoryId = activeFilters.category[0];
        }
        if (activePriceRanges.price) {
          params.minPrice = activePriceRanges.price.min;
          params.maxPrice = activePriceRanges.price.max;
        }
        // Ordenação
        if (currentSort === 'price_asc') {
          params.sortBy = 'price';
          params.sortOrder = 'ASC';
        } else if (currentSort === 'price_desc') {
          params.sortBy = 'price';
          params.sortOrder = 'DESC';
        } else if (currentSort === 'newest') {
          params.sortBy = 'createdAt';
          params.sortOrder = 'DESC';
        } else if (currentSort === 'rating') {
          params.sortBy = 'rating';
          params.sortOrder = 'DESC';
        }
        
        // Chamada à API
        const response = await fetch('/api/products?' + new URLSearchParams(params as Record<string, string>));
        const responseData = await response.json();
        
        // Transformar os dados da API para o formato esperado pelo componente
        const formattedProducts = (responseData.data || []).map((product: any) => ({
          id: product.id,
          name: product.name,
          image: product.images && product.images.length > 0 
            ? product.images[0] 
            : 'https://via.placeholder.com/300',
          price: product.price,
          oldPrice: product.oldPrice,
          rating: product.rating || 4,
          reviewCount: product.reviewCount || 0,
          brand: product.brand,
          isNew: product.isNew,
          freeShipping: true,
          isFavorite: false
        }));
        
        setProducts(formattedProducts);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Erro ao carregar produtos. Tente novamente.');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [searchQuery, activeFilters, activePriceRanges, currentSort]);

  // Gerenciar filtros
  const handleFilterChange = (groupId: string, optionId: string, checked: boolean) => {
    setActiveFilters((prev) => {
      const current = prev[groupId] || [];
      if (filterGroups.find((g) => g.id === groupId)?.type === 'radio') {
        return {
          ...prev,
          [groupId]: checked ? [optionId] : [],
        };
      }
      
      if (checked && !current.includes(optionId)) {
        return {
          ...prev,
          [groupId]: [...current, optionId],
        };
      } else if (!checked) {
        return {
          ...prev,
          [groupId]: current.filter((id) => id !== optionId),
        };
      }
      
      return prev;
    });
  };

  const handlePriceRangeChange = (groupId: string, range: PriceRange) => {
    setActivePriceRanges((prev) => ({
      ...prev,
      [groupId]: range,
    }));
  };

  const handleQuickFilterToggle = (filterId: string) => {
    setQuickFilters((prev) =>
      prev.includes(filterId)
        ? prev.filter((id) => id !== filterId)
        : [...prev, filterId]
    );
  };

  const clearAllFilters = () => {
    setActiveFilters({});
    setActivePriceRanges({});
    setQuickFilters([]);
  };

  return (
    <ProtectedLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbItems} currentPage="Equipamentos para Restaurante" />
        
        {/* Barra de busca e ordenação */}
        <SearchBar
          query={searchQuery}
          onQueryChange={setSearchQuery}
          onSearch={() => console.log('Buscando:', searchQuery)}
          sortOptions={sortOptions}
          currentSort={currentSort}
          onSortChange={(sort) => setCurrentSort(sort)}
          resultsCount={products.length}
          categoryName="Equipamentos para Restaurante"
        />
        
        {/* Filtros rápidos */}
        <FilterBar
          options={quickFilterOptions}
          activeFilters={quickFilters}
          onFilterToggle={handleQuickFilterToggle}
          showMobileFilters={() => setShowMobileFilters(true)}
        />
        
        {/* Conteúdo principal */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Filtros laterais (desktop) */}
            <div className="hidden md:block w-64 flex-shrink-0">
              <div className="sticky top-24">
                <SideFilters
                  filterGroups={filterGroups}
                  activeFilters={activeFilters}
                  activePriceRanges={activePriceRanges}
                  onFilterChange={handleFilterChange}
                  onPriceRangeChange={handlePriceRangeChange}
                  onClearFilters={clearAllFilters}
                />
              </div>
            </div>
            
            {/* Listagem de produtos */}
            <div className="flex-grow">
              <ProductList
                products={products}
                loading={loading}
                error={error}
                viewType={viewType}
                onViewTypeChange={setViewType}
              />
            </div>
          </div>
        </div>
        
        {/* Filtros laterais (mobile) */}
        {showMobileFilters && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex md:hidden">
            <div className="bg-white w-4/5 h-full overflow-y-auto">
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-lg font-medium">Filtros</h2>
                <button
                  className="text-gray-500"
                  onClick={() => setShowMobileFilters(false)}
                >
                  ✕
                </button>
              </div>
              <div className="p-4">
                <SideFilters
                  filterGroups={filterGroups}
                  activeFilters={activeFilters}
                  activePriceRanges={activePriceRanges}
                  onFilterChange={handleFilterChange}
                  onPriceRangeChange={handlePriceRangeChange}
                  onClearFilters={clearAllFilters}
                />
              </div>
              <div className="p-4 border-t sticky bottom-0 bg-white">
                <button
                  className="w-full bg-amber-600 text-white py-3 rounded-lg font-medium"
                  onClick={() => setShowMobileFilters(false)}
                >
                  Aplicar Filtros
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedLayout>
  );
}