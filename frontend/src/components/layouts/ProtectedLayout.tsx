'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FaSearch, FaBell, FaShoppingCart, FaUserCircle, FaHeart, FaList, FaSignOutAlt, FaTags, FaMapMarkerAlt } from 'react-icons/fa';

interface ProtectedLayoutProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export default function ProtectedLayout({
  children,
}: ProtectedLayoutProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Buscando por:', searchQuery);
  };

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-gradient-to-r from-[#452b18] to-[#5d402a] text-white py-2 px-4 shadow-md">
        <div className="container mx-auto flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center">
              <div className="relative mr-2">
                <span className="text-3xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">
                  Rev<span className="text-amber-400">Mak</span>
                </span>
              </div>
            </Link>
            
            <form onSubmit={handleSearch} className="flex-1 mx-6 max-w-3xl">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar equipamentos para restaurante..."
                  className="w-full py-2 px-4 pr-10 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button 
                  type="submit" 
                  className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-amber-500"
                >
                  <FaSearch />
                </button>
              </div>
            </form>
            
            <div className="flex items-center space-x-4 text-sm">
              <button className="flex flex-col items-center hover:text-amber-300 transition-colors">
                <FaBell className="text-xl" />
                <span className="hidden sm:inline mt-1">Notificações</span>
              </button>
              
              <Link href="/favorites" className="flex flex-col items-center hover:text-amber-300 transition-colors">
                <FaHeart className="text-xl" />
                <span className="hidden sm:inline mt-1">Favoritos</span>
              </Link>
              
              <Link href="/cart" className="flex flex-col items-center hover:text-amber-300 transition-colors">
                <div className="relative">
                  <FaShoppingCart className="text-xl" />
                  <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">3</span>
                </div>
                <span className="hidden sm:inline mt-1">Carrinho</span>
              </Link>
              
              <div className="relative">
                <button 
                  onClick={toggleUserMenu}
                  className="flex flex-col items-center hover:text-amber-300 transition-colors"
                >
                  <FaUserCircle className="text-xl" />
                  <span className="hidden sm:inline mt-1">
                    Conta
                  </span>
                </button>
                
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <p className="text-gray-700 font-medium">Nome do Usuário</p>
                      <p className="text-gray-500 text-xs truncate">email@exemplo.com</p>
                    </div>
                    
                    <Link href="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center">
                      <FaUserCircle className="mr-2 text-amber-600" />
                      Meu perfil
                    </Link>
                    
                    <Link href="/orders" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center">
                      <FaList className="mr-2 text-amber-600" />
                      Meus pedidos
                    </Link>
                    
                    <Link href="/admin" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center">
                      <FaTags className="mr-2 text-amber-600" />
                      Painel admin
                    </Link>
                    
                    <button
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center"
                    >
                      <FaSignOutAlt className="mr-2 text-amber-600" />
                      Sair
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <nav className="flex items-center space-x-6 text-sm py-1">
            <Link href="/categorias" className="hover:text-amber-300 flex items-center transition-colors">
              <FaList className="mr-1" />
              Categorias
            </Link>
            <Link href="/ofertas" className="hover:text-amber-300 transition-colors">Ofertas</Link>
            <Link href="/novidades" className="hover:text-amber-300 transition-colors">Lançamentos</Link>
            <Link href="/vendedores" className="hover:text-amber-300 transition-colors">Vendedores</Link>
            
            <Link 
              href="/anunciar" 
              className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-1 rounded-md font-medium flex items-center transition-colors"
            >
              <FaTags className="mr-1" />
              Anunciar
            </Link>
            
            <Link href="/meus-produtos" className="hover:text-amber-300 flex items-center bg-amber-700/30 px-2 py-0.5 rounded-md transition-colors">
              <FaTags className="mr-1" />
              Meus Produtos
            </Link>
            <Link href="/ajuda" className="hover:text-amber-300 transition-colors">Ajuda</Link>
          </nav>
        </div>
      </header>
      
      <div className="bg-white border-b border-gray-200 py-2 px-4 text-sm">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center text-gray-600">
            <FaMapMarkerAlt className="mr-1 text-amber-600" />
            <span>Enviar para São Paulo - SP</span>
          </div>
          
          <div className="flex space-x-4 text-gray-600">
            <Link href="/premium" className="hover:text-amber-600 transition-colors">RevMak Premium</Link>
            <Link href="/frete-gratis" className="hover:text-amber-600 transition-colors">Frete Grátis</Link>
            <Link href="/mais-vendidos" className="hover:text-amber-600 transition-colors">Mais Vendidos</Link>
          </div>
        </div>
      </div>
      
      <main className="flex-grow container mx-auto p-4">
        {children}
      </main>
    </div>
  );
}