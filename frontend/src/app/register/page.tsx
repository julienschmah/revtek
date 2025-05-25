'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationError, setValidationError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();
  const { register, isAuthenticated, connectionError } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setValidationError('');
    
    if (password !== confirmPassword) {
      setValidationError('As senhas não coincidem.');
      setIsLoading(false);
      return;
    }
    
    if (password.length < 6) {
      setValidationError('A senha deve ter pelo menos 6 caracteres.');
      setIsLoading(false);
      return;
    }

  try {
      await register(name, email, password);
    } catch {
      // Error is handled through connectionError state in AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  const displayError = validationError || connectionError;

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#1a0d05]">
      {/* Lado esquerdo - Imagem e branding com tema futurista marrom escuro */}
      <div className="hidden md:flex md:w-1/2 bg-[#120805] text-white relative overflow-hidden">
        {/* Efeito de grade futurista */}
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#3a1a0a_1px,transparent_1px),linear-gradient(to_bottom,#3a1a0a_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        {/* Círculos futuristas */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-gradient-to-br from-amber-500/10 to-transparent blur-2xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full bg-gradient-to-tr from-brown-700/20 to-transparent blur-3xl"></div>
        {/* Linhas diagonais futuristas */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -left-10 top-0 w-[200%] h-full rotate-12 bg-gradient-to-b from-amber-500/5 to-transparent"></div>
          <div className="absolute -left-10 top-0 w-[200%] h-full rotate-[20deg] bg-gradient-to-b from-brown-800/10 to-transparent"></div>
        </div>
        {/* Efeito de brilho pulsante */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-radial from-amber-500/5 to-transparent opacity-70 animate-pulse-slow"></div>
        <div className="relative z-10 flex flex-col justify-center items-center w-full p-12">
          {/* Logo futurista com efeito de borda brilhante */}
          <div className="mb-16 text-center transform hover:scale-105 transition-transform duration-300">
            <div className="inline-block relative">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/30 to-brown-600/30 blur-xl rounded-full"></div>
              <h1 className="relative text-6xl font-display font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">
                Rev<span className="text-amber-400">Mak</span>
              </h1>
            </div>
            <p className="text-amber-100/80 text-lg mt-2 tracking-wider">EQUIPAMENTOS PARA RESTAURANTES</p>
          </div>
          {/* Imagem com efeito futurista */}
          <div className="relative w-full h-96 mb-16 group perspective-1000">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-brown-900/30 rounded-xl -m-2 group-hover:bg-amber-500/20 transition-all duration-500 pointer-events-none"></div>
            <div className="absolute inset-0 rounded-xl shadow-[0_0_40px_5px_rgba(217,119,6,0.15)] group-hover:shadow-[0_0_60px_5px_rgba(217,119,6,0.25)] transition-all duration-500 pointer-events-none"></div>
            <div className="absolute inset-0 rounded-xl border border-amber-500/10 group-hover:border-amber-500/30 transition-all duration-500 pointer-events-none"></div>
            {/* Efeito de borda brilhante */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500/30 to-brown-600/30 rounded-xl opacity-0 group-hover:opacity-100 blur-sm transition-all duration-500 pointer-events-none"></div>
            <div className="relative h-full w-full transform group-hover:rotate-y-6 transition-all duration-500 preserve-3d">
              <img src="/images/restaurante.png" alt="Equipamentos para restaurantes" className="object-contain rounded-xl p-4 z-10 w-full h-full" />
            </div>
          </div>
        </div>
      </div>
      {/* Lado direito - Formulário de registro com tema futurista */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-[#1a0d05] px-6 py-12">
        <div className="w-full max-w-md">
          {/* Logo para mobile com tema futurista */}
          <div className="md:hidden text-center mb-12">
            <div className="inline-block bg-[#120805] p-8 rounded-2xl shadow-[0_0_30px_rgba(217,119,6,0.15)] mb-4 border border-amber-900/30">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-brown-600/20 blur-xl rounded-full"></div>
                <h1 className="relative text-4xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">
                  Rev<span className="text-amber-400">Mak</span>
                </h1>
              </div>
              <p className="text-amber-100/80 text-sm mt-2 tracking-wider">EQUIPAMENTOS PARA RESTAURANTES</p>
            </div>
          </div>
          {/* Card de registro com efeito futurista */}
          <div className="bg-[#120805] rounded-2xl shadow-[0_0_40px_rgba(217,119,6,0.1)] p-8 border border-amber-900/30 backdrop-blur-sm transform hover:-translate-y-1 transition-all duration-300 relative">
            {/* Efeito de borda brilhante no hover */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500/20 to-brown-600/20 rounded-2xl opacity-0 group-hover:opacity-100 blur-sm transition-all duration-500 pointer-events-none"></div>
            <h2 className="text-2xl font-bold text-amber-100 mb-8 text-center tracking-wide">Criar Conta</h2>
            {displayError && (
              <div className="bg-red-900/20 border border-red-800/30 text-red-400 px-4 py-3 rounded-lg mb-6 flex items-center">
                <span className="font-medium">{displayError}</span>
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-amber-200/80 mb-2 tracking-wide">NOME</label>
                <div className="relative group">
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full pl-3 pr-3 py-3.5 bg-brown-900/30 border border-amber-900/50 text-amber-100 rounded-lg focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all shadow-[0_0_10px_rgba(217,119,6,0.1)] placeholder:text-amber-800/50"
                    placeholder="Seu nome completo"
                    required
                  />
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-amber-500/5 to-amber-700/5 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none"></div>
                </div>
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-amber-200/80 mb-2 tracking-wide">EMAIL</label>
                <div className="relative group">
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-3 pr-3 py-3.5 bg-brown-900/30 border border-amber-900/50 text-amber-100 rounded-lg focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all shadow-[0_0_10px_rgba(217,119,6,0.1)] placeholder:text-amber-800/50"
                    placeholder="seu@email.com"
                    required
                  />
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-amber-500/5 to-amber-700/5 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none"></div>
                </div>
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-amber-200/80 mb-2 tracking-wide">SENHA</label>
                <div className="relative group">
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-3 pr-3 py-3.5 bg-brown-900/30 border border-amber-900/50 text-amber-100 rounded-lg focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all shadow-[0_0_10px_rgba(217,119,6,0.1)] placeholder:text-amber-800/50"
                    placeholder="••••••••"
                    required
                    minLength={6}
                  />
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-amber-500/5 to-amber-700/5 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none"></div>
                </div>
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-amber-200/80 mb-2 tracking-wide">CONFIRMAR SENHA</label>
                <div className="relative group">
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="block w-full pl-3 pr-3 py-3.5 bg-brown-900/30 border border-amber-900/50 text-amber-100 rounded-lg focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all shadow-[0_0_10px_rgba(217,119,6,0.1)] placeholder:text-amber-800/50"
                    placeholder="••••••••"
                    required
                    minLength={6}
                  />
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-amber-500/5 to-amber-700/5 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none"></div>
                </div>
              </div>
              {/* Botão com efeito futurista */}
              <button
                type="submit"
                disabled={isLoading}
                className="relative w-full mt-4 group overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-amber-700 to-amber-600 rounded-lg opacity-80 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0gMjAgMCBMIDAgMCAwIDIwIiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iMC41Ii8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIiBvcGFjaXR5PSIwLjA1Ii8+PC9zdmc+')] opacity-10 pointer-events-none"></div>
                <div className="absolute left-0 top-0 h-full w-0 bg-gradient-to-r from-amber-500/40 to-transparent group-hover:w-full transition-all duration-500 ease-out pointer-events-none"></div>
                <div className="relative flex items-center justify-center py-3.5 px-4">
                  <span className="text-white font-medium tracking-wide">
                    {isLoading ? 'REGISTRANDO...' : 'REGISTRAR'}
                  </span>
                </div>
                <div className="absolute inset-0 rounded-lg shadow-[0_0_20px_rgba(217,119,6,0.3)] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
              </button>
            </form>
            <div className="mt-10 text-center">
              <p className="text-sm text-amber-100/50">
                Já tem uma conta?{' '}
                <Link href="/login" className="text-amber-500 hover:text-amber-400 transition-colors">
                  Faça login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}