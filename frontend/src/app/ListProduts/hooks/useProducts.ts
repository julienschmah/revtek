'use client';

import { useState, useEffect } from 'react';
import api from '@/services/api';
import { getImageUrl, getCategoryPlaceholder } from '../utils';

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  oldPrice?: number;
  condition: string;
  brand: string;
  rating?: number;
  reviewCount?: number;
  imageUrls: string[];
  categoryId: string;
  userId: string;
  category?: {
    id: string;
    name: string;
  };
  user?: {
    id: string;
    name: string;
  };
  inStock?: boolean;
  freeShipping?: boolean;
  isNew?: boolean;
  featuredLabel?: string;
}

interface FilterParams {
  category: string;
  condition: string;
  minPrice: string;
  maxPrice: string;
  brand: string;
  purpose: string;
}

interface UseProductsReturn {
  products: Product[];
  displayedProducts: Product[];
  loading: boolean;
  error: string | null;
  fetchProducts: () => void;
}

export const useProducts = (filterParams: FilterParams, sortOption: string): UseProductsReturn => {
  const [products, setProducts] = useState<Product[]>([]);
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const sortProducts = (productsToSort: Product[]) => {
    let sorted = [...productsToSort];
    
    switch (sortOption) {
      case 'menor-preco':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'maior-preco':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'mais-recentes':
        sorted.sort((a, b) => parseInt(b.id) - parseInt(a.id));
        break;
      case 'popularidade':
        sorted.sort((a, b) => {
          const ratingA = a.rating || 0;
          const ratingB = b.rating || 0;
          if (ratingB !== ratingA) {
            return ratingB - ratingA;
          }
          return (b.reviewCount || 0) - (a.reviewCount || 0);
        });
        break;
      default:
        sorted.sort((a, b) => {
          let scoreA = 0;
          let scoreB = 0;
          
          if (a.featuredLabel) scoreA += 3;
          if (b.featuredLabel) scoreB += 3;
          
          if (a.isNew || a.condition === 'novo') scoreA += 2;
          if (b.isNew || b.condition === 'novo') scoreB += 2;
          
          scoreA += (a.rating || 0);
          scoreB += (b.rating || 0);
          
          return scoreB - scoreA;
        });
    }
    
    return sorted;
  };

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams();
      if (filterParams.category) params.append('categoryId', filterParams.category);
      if (filterParams.condition) params.append('condition', filterParams.condition);
      if (filterParams.minPrice) params.append('minPrice', filterParams.minPrice);
      if (filterParams.maxPrice) params.append('maxPrice', filterParams.maxPrice);
      if (filterParams.brand) params.append('brand', filterParams.brand);
      if (filterParams.purpose) params.append('purpose', filterParams.purpose);
      
      console.log(`Fetching products with params: ${params.toString()}`);
      
      const response = await api.get(`/products/public?${params.toString()}`);
      
      if (!response.data.success) {
        console.error('API request was not successful:', response.data);
        setError('Não foi possível obter os produtos. Tente novamente mais tarde.');
        setProducts([]);
        setDisplayedProducts([]);
        return;
      }
      
      const fetchedProducts = response.data.data;
      
      if (!Array.isArray(fetchedProducts)) {
        console.error('API did not return an array of products:', fetchedProducts);
        setError('Formato de dados inválido recebido do servidor.');
        setProducts([]);
        setDisplayedProducts([]);
        return;
      }
      
      if (fetchedProducts.length === 0) {
        console.log('No products found with the current filters');
      } else {
        console.log(`Successfully fetched ${fetchedProducts.length} products from API`);
      }
        
      const mappedProducts = fetchedProducts.map((product: any) => {
        console.log(`Produto ${product.id} - ${product.name}:`, {
          images: product.images,
          type: typeof product.images,
          isArray: Array.isArray(product.images)
        });
        
        let imageUrls: string[] = [];
        
        if (Array.isArray(product.images) && product.images.length > 0) {
          const validImages = product.images.filter((img: any) => {
            return img && 
                   typeof img === 'string' && 
                   img.trim() !== '' && 
                   img !== 'null' && 
                   img !== 'undefined';
          });
          
          console.log(`Produto ${product.id} - imagens válidas:`, validImages);
          
          if (validImages.length > 0) {
            imageUrls = validImages.map((img: string) => {
              try {
                return getImageUrl(img.trim());
              } catch (error) {
                console.warn(`Erro ao processar URL da imagem: ${img}`, error);
                return getCategoryPlaceholder(product.category?.name);
              }
            });
            
            console.log(`Produto ${product.id} - URLs finais:`, imageUrls);
          }
        } 
        
        if (imageUrls.length === 0) {
          const categoryName = product.category?.name;
          const placeholderUrl = getCategoryPlaceholder(categoryName);
          imageUrls = [placeholderUrl];
          console.log(`Produto ${product.id} - usando placeholder para categoria ${categoryName}:`, placeholderUrl);
        }
          
        return {
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          condition: product.isNew ? 'novo' : 'usado',
          brand: product.brand || 'Sem marca',
          rating: product.rating || 0,
          reviewCount: product.reviewCount || 0,
          imageUrls: imageUrls,
          categoryId: product.categoryId,
          userId: product.sellerId,
          category: product.category,
          user: {
            id: product.sellerId,
            name: product.seller?.name || 'Vendedor RevMak'
          },
          inStock: product.stock > 0,
          isNew: product.isNew,
          featuredLabel: product.salesCount > 10 ? 'Popular' : (product.isNew ? 'Novo' : ''),
          freeShipping: product.price > 1000 
        };
      });
      
      setProducts(mappedProducts);
      setDisplayedProducts(sortProducts(mappedProducts));
    } catch (error) {
      console.error('Error fetching products from API:', error);
      setError('Ocorreu um erro ao buscar os produtos. Verifique sua conexão com a internet ou tente novamente mais tarde.');
      setProducts([]);
      setDisplayedProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [filterParams, sortOption]);
  
  useEffect(() => {
    if (products.length > 0) {
      setDisplayedProducts(sortProducts(products));
    }
  }, [sortOption, products]);

  return {
    products,
    displayedProducts,
    loading,
    error,
    fetchProducts
  };
};
