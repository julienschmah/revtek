'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaStar, FaRegStar, FaHeart } from 'react-icons/fa';
import { formatCurrency, getColorFromText, getCategoryPlaceholder } from '../utils';

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

interface ProductCardProps {
  product: Product;
  filterParams: {
    purpose: string;
  };
}

const ProductCard: React.FC<ProductCardProps> = ({ product, filterParams }) => {
  const renderStars = (rating: number = 0) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<FaStar key={i} className="text-amber-500" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-amber-500" />);
      }
    }
    return stars;
  };

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full border border-gray-200 group relative transform hover:translate-y-[-5px]">
      {product.featuredLabel && (
        <div className="absolute top-0 left-0 z-10 overflow-hidden h-16 w-16">
          <div className="absolute -rotate-45 transform origin-top-right bg-amber-500 text-white font-bold py-1 left-[-40px] top-[32px] w-[170px] text-center text-xs shadow-md">
            {product.featuredLabel}
          </div>
        </div>
      )}
      
      {(product.isNew || product.condition === 'novo') && (
        <div className="absolute top-3 right-3 z-10">
          <span className="bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
            Novo
          </span>
        </div>
      )}
      
      <div className="absolute top-3 left-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          className="bg-white rounded-full p-2.5 shadow-md hover:bg-amber-50 transition-colors"
          aria-label="Adicionar aos favoritos"
        >
          <FaHeart className="text-gray-400 hover:text-amber-500 transition-colors" />
        </button>
      </div>

      <div className="relative w-full h-52 bg-gray-50 overflow-hidden">
        <Link href={`/produtos/${product.id}`} className="block h-full">
          <div className="w-full h-full transition-transform duration-500 group-hover:scale-110 relative">
            {product.imageUrls && product.imageUrls.length > 0 && product.imageUrls[0] ? (
              <div className="relative w-full h-full">
                <Image
                  src={product.imageUrls[0]}
                  alt={product.name || 'Produto'}
                  fill
                  className="object-contain p-2 z-10"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  onError={(e) => {
                    console.log(`Image load error for product ${product.id}, using category placeholder`);
                    const target = e.target as HTMLImageElement;
                    const placeholderUrl = getCategoryPlaceholder(product.category?.name);
                    if (target.src !== placeholderUrl) {
                      target.src = placeholderUrl;
                    }
                  }}
                  onLoad={() => {
                    console.log(`Image loaded successfully for product ${product.id}`);
                  }}
                />
                
                <div 
                  className="absolute inset-0 z-0 flex items-center justify-center"
                  style={{ 
                    backgroundColor: getColorFromText(product.name || ''),
                    opacity: 0.1
                  }}
                />
                
                <div className="absolute inset-0 z-0 flex items-center justify-center">
                  <span className="text-6xl font-bold opacity-10" style={{ color: getColorFromText(product.name || '') }}>
                    {(product.name || 'P').charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
            ) : (
              <div 
                className="w-full h-full flex flex-col items-center justify-center p-4"
                style={{ 
                  background: `linear-gradient(135deg, ${getColorFromText(product.name || 'Produto')}22, ${getColorFromText(product.name || 'Produto')}44)` 
                }}
              >
                <svg 
                  className="w-12 h-12 mb-2"
                  style={{ color: getColorFromText(product.name || 'Produto') }}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
                <span 
                  className="text-sm font-medium text-center line-clamp-2"
                  style={{ color: getColorFromText(product.name || 'Produto') }}
                >
                  {product.name || 'Produto sem nome'}
                </span>
              </div>
            )}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
          </div>
        </Link>
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{product.category?.name || 'Sem categoria'}</span>
          <span className="text-xs font-medium text-amber-700 bg-amber-50 px-2 py-1 rounded-full">{product.brand}</span>
        </div>
        
        <Link href={`/produtos/${product.id}`} className="group-hover:text-amber-600 transition-colors">
          <h3 className="font-semibold text-gray-800 line-clamp-2 h-12 text-base lg:text-lg" title={product.name}>
            {product.name}
          </h3>
        </Link>
        
        <div className="flex items-center my-3">
          <div className="flex text-lg">
            {renderStars(product.rating || 0)}
          </div>
          <span className="text-sm text-gray-500 ml-2">
            ({product.reviewCount || 0})
          </span>
        </div>
        
        <div className="mt-auto">
          {product.oldPrice && (
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm text-gray-500 line-through">
                {formatCurrency(product.oldPrice)}
              </span>
              <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full font-medium">
                {Math.round((1 - product.price / product.oldPrice) * 100)}% OFF
              </span>
            </div>
          )}
          <div className="flex items-baseline">
            <span className="text-2xl font-bold text-amber-600">
              {formatCurrency(product.price)}
            </span>
            {filterParams.purpose === 'aluguel' && (
              <span className="text-sm text-gray-600 ml-1 font-medium">/dia</span>
            )}
          </div>
        </div>
        
        {product.freeShipping && (
          <div className="mt-3 flex items-center">
            <svg className="w-4 h-4 text-green-600 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span className="text-sm font-medium text-green-600">Frete grátis</span>
          </div>
        )}
        
        <div className="mt-3 pt-3 text-sm text-gray-600 border-t border-gray-100">
          Vendido por: <span className="font-medium">{product.user?.name || 'Vendedor RevMak'}</span>
        </div>

        <button 
          className="w-full py-3 mt-4 bg-amber-500 hover:bg-amber-600 text-white rounded-md transition-all duration-300 flex items-center justify-center group-hover:shadow-lg"
          onClick={(e) => {
            e.preventDefault();
            alert(`Produto "${product.name}" adicionado ao carrinho!`);
          }}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 mr-2" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" 
            />
          </svg>
          Adicionar ao Carrinho
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
