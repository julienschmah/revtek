'use client';

import React from 'react';

// Helper types
export interface Product {
  id: string;
  name: string;
  description: string;
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

export interface Category {
  id: string;
  name: string;
}

// Mock data for testing
export const mockCategories: Category[] = [
  { id: '1', name: 'Fogões Industriais' },
  { id: '2', name: 'Refrigeração' },
  { id: '3', name: 'Fornos' },
  { id: '4', name: 'Utensílios' },
  { id: '5', name: 'Panelas' },
  { id: '6', name: 'Chapas' },
  { id: '7', name: 'Fritadeiras' },
  { id: '8', name: 'Liquidificadores' }
];

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Fogão Industrial 6 Bocas de Alta Pressão',
    description: 'Fogão industrial de alta pressão com 6 bocas, ideal para restaurantes de médio porte.',
    price: 2890.00,
    oldPrice: 3200.00,
    condition: 'novo',
    brand: 'Progás',
    rating: 4.8,
    reviewCount: 45,
    imageUrls: ['/images/products/placeholder.svg'],
    categoryId: '1',
    userId: '1',
    category: { id: '1', name: 'Fogões Industriais' },
    user: { id: '1', name: 'Equipamentos BR' },
    inStock: true,
    freeShipping: true,
    featuredLabel: 'Destaque'
  },
  {
    id: '2',
    name: 'Refrigerador Comercial Inox 4 Portas',
    description: 'Refrigerador comercial em aço inox com 4 portas, capacidade de 1000L.',
    price: 6790.00,
    condition: 'novo',
    brand: 'Gelopar',
    rating: 4.6,
    reviewCount: 23,
    imageUrls: ['/images/products/placeholder.svg'],
    categoryId: '2',
    userId: '2',
    category: { id: '2', name: 'Refrigeração' },
    user: { id: '2', name: 'Cozinhas Pro' },
    inStock: true
  },
  {
    id: '3',
    name: 'Forno Combinado 10 GNs',
    description: 'Forno combinado profissional para 10 GNs com vapor e convecção.',
    price: 15900.00,
    oldPrice: 17500.00,
    condition: 'seminovo',
    brand: 'Rational',
    rating: 5.0,
    reviewCount: 18,
    imageUrls: ['/images/products/placeholder.svg'],
    categoryId: '3',
    userId: '1',
    category: { id: '3', name: 'Fornos' },
    user: { id: '1', name: 'Equipamentos BR' },
    inStock: true,
    freeShipping: true
  },
  {
    id: '4',
    name: 'Kit Utensílios de Cozinha Profissional 10 peças',
    description: 'Kit completo com 10 utensílios essenciais para cozinha profissional.',
    price: 790.00,
    condition: 'novo',
    brand: 'Tramontina',
    rating: 4.3,
    reviewCount: 32,
    imageUrls: ['/images/products/placeholder.svg'],
    categoryId: '4',
    userId: '3',
    category: { id: '4', name: 'Utensílios' },
    user: { id: '3', name: 'Chef Store' },
    inStock: true,
    isNew: true
  },
  {
    id: '5',
    name: 'Conjunto de Panelas em Alumínio Profissionais',
    description: 'Conjunto com 5 panelas de alumínio para uso profissional.',
    price: 1200.00,
    condition: 'novo',
    brand: 'Alumínio Real',
    rating: 4.5,
    reviewCount: 27,
    imageUrls: ['/images/products/placeholder.svg'],
    categoryId: '5',
    userId: '3',
    category: { id: '5', name: 'Panelas' },
    user: { id: '3', name: 'Chef Store' },
    inStock: true
  },
  {
    id: '6',
    name: 'Chapa a Gás 80cm Bifeteira',
    description: 'Chapa a gás para bifes com 80cm, acabamento em aço inox.',
    price: 1890.00,
    condition: 'usado',
    brand: 'Venâncio',
    rating: 4.0,
    reviewCount: 15,
    imageUrls: ['/images/products/placeholder.svg'],
    categoryId: '6',
    userId: '2',
    category: { id: '6', name: 'Chapas' },
    user: { id: '2', name: 'Cozinhas Pro' },
    inStock: false
  }
];

// Helper function to format currency
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};
