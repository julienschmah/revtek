'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import ProtectedLayout from '@/components/layouts/ProtectedLayout';
import Image from 'next/image';
import Link from 'next/link';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaTimes, FaEye, FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import { BiLoader } from 'react-icons/bi';
import api from '@/services/api';

// Tipos
interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  status: 'active' | 'inactive' | 'pending';
  salesCount: number;
  createdAt: string;
}

type SortField = 'name' | 'price' | 'stock' | 'salesCount' | 'createdAt';
type SortDirection = 'asc' | 'desc';

export default function MyProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const isFirstLoad = useRef(true);
  // Buscar produtos reais do usuário autenticado
  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (searchTerm) params.search = searchTerm;
      if (selectedStatus !== 'all') params.status = selectedStatus;
      const response = await api.get('/products', { params });
      setProducts(response.data.data || []);
    } catch {
      // Error handled by setting empty products
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedStatus]);
  useEffect(() => {
    loadProducts();
  }, [searchTerm, selectedStatus, loadProducts]);

  useEffect(() => {
    // Atualizar ao focar a página (ex: após cadastro)
    const handleFocus = () => {
      if (!isFirstLoad.current) {
        loadProducts();
      } else {
        isFirstLoad.current = false;
      }
    };
    
    window.addEventListener('focus', handleFocus);
    // Opcional: ouvir evento global
    // window.addEventListener('refreshMyProducts', loadProducts);
    return () => {
      window.removeEventListener('focus', handleFocus);
      // window.removeEventListener('refreshMyProducts', loadProducts);
    };
  }, [loadProducts]);

  // Filtrar produtos
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === 'all' || product.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Ordenar produtos
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortField === 'name') {
      return sortDirection === 'asc' 
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    }
    
    if (sortField === 'price') {
      return sortDirection === 'asc' 
        ? a.price - b.price
        : b.price - a.price;
    }
    
    if (sortField === 'stock') {
      return sortDirection === 'asc' 
        ? a.stock - b.stock
        : b.stock - a.stock;
    }
    
    if (sortField === 'salesCount') {
      return sortDirection === 'asc' 
        ? a.salesCount - b.salesCount
        : b.salesCount - a.salesCount;
    }
    
    // createdAt (default)
    return sortDirection === 'asc' 
      ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  // Manipulador de ordenação
  const handleSort = (field: SortField) => {
    if (field === sortField) {
      // Alternar direção se o campo já está selecionado
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Definir novo campo e direção padrão
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Formatar preço
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  // Renderizar ícone de ordenação
  const renderSortIcon = (field: SortField) => {
    if (field !== sortField) {
      return <FaSort className="ml-1 text-gray-400" />;
    }
    
    return sortDirection === 'asc' 
      ? <FaSortUp className="ml-1 text-amber-600" />
      : <FaSortDown className="ml-1 text-amber-600" />;
  };

  // Deletar produto (simulado)
  const handleDeleteProduct = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      setProducts(products.filter(product => product.id !== id));
    }
  };

  return (
    <ProtectedLayout allowedRoles={['admin', 'seller']}>
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Meus Produtos</h1>
            
            <Link 
              href="/meus-produtos/novo" 
              className="inline-flex items-center bg-amber-600 hover:bg-amber-700 text-white py-2 px-4 rounded-md transition-colors"
            >
              <FaPlus className="mr-2" />
              Novo Produto
            </Link>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            {/* Busca */}
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar produtos..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button 
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setSearchTerm('')}
                >
                  <FaTimes className="text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>
            
            {/* Filtro de status */}
            <div className="w-full md:w-48">
              <select
                className="block w-full border border-gray-300 rounded-md py-2 pl-3 pr-10 focus:ring-amber-500 focus:border-amber-500"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="all">Todos os status</option>
                <option value="active">Ativos</option>
                <option value="inactive">Inativos</option>
                <option value="pending">Pendentes</option>
              </select>
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center p-8">
              <BiLoader className="animate-spin text-amber-600 mr-2" size={24} />
              <span className="text-gray-600">Carregando produtos...</span>
            </div>
          ) : sortedProducts.length === 0 ? (
            <div className="bg-gray-50 border border-gray-100 rounded-lg p-8 text-center">
              <p className="text-gray-600 mb-4">Nenhum produto encontrado.</p>
              {searchTerm || selectedStatus !== 'all' ? (
                <button 
                  className="text-amber-600 hover:text-amber-800 font-medium"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedStatus('all');
                  }}
                >
                  Limpar filtros
                </button>
              ) : (
                <Link 
                  href="/meus-produtos/novo" 
                  className="text-amber-600 hover:text-amber-800 font-medium"
                >
                  Cadastre seu primeiro produto
                </Link>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Produto
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('price')}
                    >
                      <div className="flex items-center">
                        Preço
                        {renderSortIcon('price')}
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('stock')}
                    >
                      <div className="flex items-center">
                        Estoque
                        {renderSortIcon('stock')}
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('salesCount')}
                    >
                      <div className="flex items-center">
                        Vendas
                        {renderSortIcon('salesCount')}
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 relative">
                            <Image 
                              src={product.image} 
                              alt={product.name}
                              fill
                              className="object-cover rounded-md"
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                            <div className="text-sm text-gray-500">{product.category}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 font-medium">{formatPrice(product.price)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm ${product.stock === 0 ? 'text-red-600 font-medium' : 'text-gray-900'}`}>
                          {product.stock === 0 ? 'Esgotado' : product.stock + ' unidades'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{product.salesCount}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          product.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : product.status === 'inactive'
                            ? 'bg-gray-100 text-gray-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {product.status === 'active' 
                            ? 'Ativo'
                            : product.status === 'inactive'
                            ? 'Inativo'
                            : 'Pendente'
                          }
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Link 
                            href={`/produto/${product.id}`}
                            className="text-gray-600 hover:text-amber-600"
                            title="Visualizar"
                          >
                            <FaEye />
                          </Link>
                          <Link 
                            href={`/meus-produtos/editar/${product.id}`}
                            className="text-blue-600 hover:text-blue-900"
                            title="Editar"
                          >
                            <FaEdit />
                          </Link>
                          <button 
                            onClick={() => handleDeleteProduct(product.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Excluir"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </ProtectedLayout>
  );
}