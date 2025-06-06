'use client';

import { useRouter } from 'next/navigation';

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

export const getImageUrl = (imagePath: string): string => {
  if (!imagePath || typeof imagePath !== 'string' || imagePath.trim() === '') {
    return '/images/products/placeholder.svg';
  }

  const cleanPath = imagePath.trim();

  if (cleanPath.startsWith('http://') || cleanPath.startsWith('https://')) {
    try {
      // Validar se é uma URL válida
      new URL(cleanPath);
      return cleanPath;
    } catch (error) {
      console.warn(`Invalid URL provided: ${cleanPath}`);
      return '/images/products/placeholder.svg';
    }
  }
  
  if (cleanPath.startsWith('/storage/')) {
    return `http://localhost:3001${cleanPath}`;
  }
  
  if (cleanPath.startsWith('storage/')) {
    return `http://localhost:3001/${cleanPath}`;
  }
  
  if (cleanPath.startsWith('/images/')) {
    return cleanPath;
  }
  
  if (cleanPath.length > 0) {
    return `http://localhost:3001/storage/${cleanPath}`;
  }
  
  // Fallback final
  return '/images/products/placeholder.svg';
};

export const getCategoryPlaceholder = (categoryName?: string): string => {
  const categoryMap: Record<string, string> = {
    'Fogões Industriais': '/images/products/fogao.svg',
    'Refrigeração': '/images/products/geladeira.svg',
    'Fornos': '/images/products/forno.svg',
    'Utensílios': '/images/products/utensilios.svg',
    'Panelas': '/images/products/panela.svg',
    'Chapas': '/images/products/chapa.svg', 
    'Fritadeiras': '/images/products/fritadeira.svg',
    'Liquidificadores': '/images/products/liquidificador.svg'
  };
  
  if (!categoryName) return '/images/products/placeholder.svg';
  
  return categoryMap[categoryName] || '/images/products/placeholder.svg';
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

export const getColorFromText = (text: string): string => {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = text.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const colors = [
    '#FF5733', '#33FFF5', '#3357FF', '#FF33A8', 
    '#33FF57', '#F3FF33', '#FF8C33', '#8C33FF'
  ];
  
  const index = Math.abs(hash) % colors.length;
  return colors[index];
};
