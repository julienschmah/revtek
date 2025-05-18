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

// Produtos simulados para edição
export const mockProducts = {
  '1': {
    name: 'Fogão Industrial 6 Bocas de Alta Pressão',
    description: 'Fogão industrial de alta pressão com 6 bocas, estrutura em aço inoxidável, ideal para restaurantes de grande porte. Queimadores de alta potência e controle individual de chama.',
    price: '1899.90',
    stock: '12',
    category: '1',
    images: ['/images/restaurante.png', '/images/restaurante.png'],
    isNew: true,
    brand: 'Progás',
    model: 'P6B-30',
    warranty: '12',
    weight: '45',
    dimensions: {
      width: '150',
      height: '85',
      depth: '90',
    },
    features: [
      { key: 'Material', value: 'Aço Inoxidável' },
      { key: 'Tipo de Gás', value: 'GLP/GN' },
      { key: 'Potência', value: '6 queimadores de 120g cada' },
    ],
  },
  '2': {
    name: 'Fritadeira Elétrica Comercial 10L Inox',
    description: 'Fritadeira elétrica em aço inox com capacidade para 10L de óleo. Temperatura ajustável e sistema de segurança contra superaquecimento.',
    price: '699.90',
    stock: '5',
    category: '3',
    images: ['/images/restaurante.png'],
    isNew: true,
    brand: 'Mondial',
    model: 'FT-10',
    warranty: '6',
    weight: '12',
    dimensions: {
      width: '45',
      height: '35',
      depth: '30',
    },
    features: [
      { key: 'Material', value: 'Aço Inoxidável' },
      { key: 'Potência', value: '3000W' },
      { key: 'Voltagem', value: '220V' },
    ],
  },
};
