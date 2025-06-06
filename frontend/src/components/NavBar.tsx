'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaShoppingCart, FaBell, FaHeart, FaUser, FaSearch, FaUserCircle, FaList, FaSignOutAlt, FaMapMarkerAlt } from 'react-icons/fa';
import { useAuth } from '@/contexts/AuthContext';

const NavBar: React.FC = () => {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Buscando por:', searchQuery);
  };

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };
  
  const handleLogout = () => {
    logout();
  };

  return (
    <>
      <header className="bg-gradient-to-r from-[#452b18] to-[#5d402a] text-white py-2 px-4 shadow-md">
        <div className="container mx-auto flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Link href="/landingpage" className="flex items-center">
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
            </form>          <div className="flex items-center space-x-4 text-sm">
              <button className="flex flex-col items-center hover:text-amber-300 transition-colors">
                <FaBell className="text-xl" />
                <span className="hidden sm:inline mt-1">Notificações</span>
              </button>
              
              <Link href="/favoritos" className="flex flex-col items-center hover:text-amber-300 transition-colors">
                <FaHeart className="text-xl" />
                <span className="hidden sm:inline mt-1">Favoritos</span>
              </Link>
              
              <Link href="/carrinho" className="flex flex-col items-center hover:text-amber-300 transition-colors">
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
                    {user ? user.name.split(' ')[0] : 'Conta'}
                  </span>
                </button>
                
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <p className="text-gray-700 font-medium">{user?.name || 'Usuário'}</p>
                      <p className="text-gray-500 text-xs truncate">{user?.email || 'email@exemplo.com'}</p>
                    </div>
                    
                    <Link href="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center">
                      <FaUserCircle className="mr-2 text-amber-600" />
                      Meu perfil
                    </Link>
                    
                    <Link href="/meus-pedidos" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center">
                      <FaList className="mr-2 text-amber-600" />
                      Meus pedidos
                    </Link>
                    
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center"
                    >
                      <FaSignOutAlt className="mr-2 text-amber-600" />
                      Sair
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center py-2">
            <div className="text-xs flex items-center text-white/90 mr-auto">
              <FaMapMarkerAlt className="mr-1" />
              Enviar para São Paulo - SP
            </div>
              <div className="flex space-x-6">
              <Link href="/ListProduts" className="text-white hover:text-amber-300">
                Produtos
              </Link>
              <Link href="/categorias" className="text-white hover:text-amber-300">
                Categorias
              </Link>
              <Link href="/ofertas" className="text-white hover:text-amber-300">
                Ofertas
              </Link>
              <Link href="/lancamentos" className="text-white hover:text-amber-300">
                Lançamentos
              </Link>
              <Link href="/vendedores" className="text-white hover:text-amber-300">
                Vendedores
              </Link>
              <Link 
                href="/anunciar" 
                className="bg-amber-500 text-white px-4 py-1 rounded hover:bg-amber-600"
              >
                Anunciar
              </Link>
              <Link 
                href="/meus-produtos" 
                className="text-white px-4 py-1 border border-white rounded hover:bg-white/10"
              >
                Meus Produtos
              </Link>
              <Link href="/ajuda" className="text-white hover:text-amber-300">
                Ajuda
              </Link>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default NavBar;