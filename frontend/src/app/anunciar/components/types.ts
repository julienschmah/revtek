export interface FormData {
  titulo: string;
  categoria: string;
  preco: string;
  quantidade: string;
  descricao: string;
  especificacoes: string;
  fotos: File[];
}

export interface ErrorState {
  [key: string]: string;
}
