"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/services/api";

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  images?: string[];
  status?: "active" | "inactive" | "pending";
  createdAt?: string;
  updatedAt?: string;
}

export default function MeusProdutosPage() {
  const { user } = useAuth();
  const [produtos, setProdutos] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Função utilitária para montar a URL da imagem
  function getImageUrl(imagePath?: string) {
    if (!imagePath) return '';
    // Remove /api do final da baseURL se existir
    const base = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api').replace(/\/api$/, '');
    // Garante que não haja barra dupla
    return `${base}/${imagePath}`.replace(/([^:]\/)\/+/, '$1');
  }

  useEffect(() => {
    async function fetchProdutos() {
      try {
        setLoading(true);
        setError("");
        const res = await api.get("/products/my");
        setProdutos(res.data.data.products);
      } catch (err: any) {
        setError("Erro ao carregar produtos.");
        setProdutos([]);
      } finally {
        setLoading(false);
      }
    }
    fetchProdutos();
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Meus Produtos</h1>
      {loading ? (
        <div className="text-lg text-gray-500">Carregando...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : produtos.length === 0 ? (
        <div className="bg-white p-8 rounded shadow text-center text-gray-500">Você ainda não cadastrou nenhum produto.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {produtos.map((produto) => {
            console.log('FRONTEND - produto.images:', produto.images);
            return (
              <div key={produto.id} className="bg-white rounded-xl shadow-lg hover:shadow-amber-200/60 transition p-4 flex flex-col">
                {produto.images && produto.images.length > 0 ? (
                  <img
                    src={getImageUrl(produto.images[0])}
                    alt={produto.name}
                    className="w-full h-40 object-cover rounded mb-4 border"
                    onError={(e) => { (e.target as HTMLImageElement).src = '/images/banner.png'; }}
                  />
                ) : (
                  <div className="w-full h-40 flex items-center justify-center bg-gray-100 rounded mb-4 text-gray-400">
                    Sem imagem
                  </div>
                )}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="font-semibold text-lg text-amber-700 mb-1 truncate">{produto.name}</div>
                    <div className="text-gray-600 text-sm mb-2 line-clamp-2">{produto.description}</div>
                  </div>
                  <div className="mt-2">
                    <span className="text-xl font-bold text-amber-600">R$ {Number(produto.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex items-center justify-between mt-4 text-xs text-gray-500">
                    <span>Status: <span className={produto.status === 'active' ? 'text-green-600' : 'text-red-500'}>{produto.status === 'active' ? 'Ativo' : 'Inativo'}</span></span>
                    {produto.createdAt && (
                      <span>Cadastrado em: {new Date(produto.createdAt).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

