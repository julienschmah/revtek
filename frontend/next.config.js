/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Ativar o streaming na renderização para melhor experiência no carregamento
    serverActions: true,
  },
  // Configurações para SPA - evitar problemas na navegação do histórico
  reactStrictMode: false, // Desativado para evitar duplo carregamento
  swcMinify: true,
  
  // Configuração para permitir imagens de hosts específicos
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001',
        pathname: '/storage/**',
      },
      {
        protocol: 'https',
        hostname: '**',
      }
    ],
  },
};

module.exports = nextConfig; 