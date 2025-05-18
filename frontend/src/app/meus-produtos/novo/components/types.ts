// Interface para o produto
export interface ProductFormData {
  name: string;
  description: string;
  price: string;
  stock: string;
  category: string;
  images: string[];
  isNew: boolean;
  brand: string;
  model: string;
  warranty: string;
  weight: string;
  dimensions: {
    width: string;
    height: string;
    depth: string;
  };
  features: { key: string; value: string }[];
}

// Categorias simuladas
export const categories = [
  { id: '1', name: 'Fogões' },
  { id: '2', name: 'Geladeiras' },
  { id: '3', name: 'Fritadeiras' },
  { id: '4', name: 'Fornos' },
  { id: '5', name: 'Liquidificadores' },
  { id: '6', name: 'Chapas' },
  { id: '7', name: 'Utensílios' },
  { id: '8', name: 'Preparação' },
  { id: '9', name: 'Refrigeração' },
];
