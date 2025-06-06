'use client';

import React from 'react';
import ProductCard from './ProductCard';

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

interface ProductGridProps {
  products: Product[];
  filterParams: {
    purpose: string;
  };
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, filterParams }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
      {products.map((product) => (
        <ProductCard 
          key={product.id} 
          product={product} 
          filterParams={filterParams}
        />
      ))}
    </div>
  );
};

export default ProductGrid;
