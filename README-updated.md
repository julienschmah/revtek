# Projeto Revmak

Este é um projeto full-stack com React (Next.js), Node.js e PostgreSQL.

## Estrutura do Projeto

O projeto está dividido em duas partes principais:

- **Frontend**: Aplicação React com Next.js
- **Backend**: API RESTful com Node.js, Express e PostgreSQL

## Requisitos

- Node.js (v18 ou superior)
- npm ou yarn
- PostgreSQL (local ou remoto)
- Docker e Docker Compose (opcional)

## Configuração e Execução

### Instalação de Dependências

Para instalar todas as dependências do projeto (frontend e backend):

```bash
npm run install:all
```

### Configuração de Ambiente

#### Backend

```bash
# Entrar na pasta do backend
cd backend

# Criar arquivo .env
cp .env.example .env
# Edite o arquivo .env com suas configurações

# Executar migrações e seeds do banco de dados
npm run db:migrate
npm run db:seed
```

#### Frontend

```bash
# Entrar na pasta do frontend
cd frontend

# Criar arquivo .env.local
cp .env.example .env.local
# Edite o arquivo .env.local com suas configurações
```

### Executando o Projeto

Para iniciar tanto o backend quanto o frontend simultaneamente:

```bash
# Na raiz do projeto
npm run dev
```

Ou você pode executá-los separadamente:

```bash
# Para o backend
cd backend
npm run dev

# Para o frontend
cd frontend
npm run dev
```

O backend estará disponível em http://localhost:3001 e o frontend em http://localhost:3000.

### Com Docker

```bash
# Iniciar todos os serviços
docker-compose up

# Iniciar em background
docker-compose up -d

# Parar todos os serviços
docker-compose down
```

## Principais Endpoints da API

### Produtos

- `GET /api/products/public` - Lista todos os produtos públicos
- `GET /api/products/public/:id` - Obtém um produto pelo ID
- `GET /api/products/my` - Lista produtos do usuário autenticado (requer autenticação)
- `POST /api/products` - Cria um novo produto (requer autenticação)
- `PUT /api/products/:id` - Atualiza um produto (requer autenticação)
- `DELETE /api/products/:id` - Remove um produto (requer autenticação)

### Categorias

- `GET /api/categories` - Lista todas as categorias
- `GET /api/categories/id/:id` - Obtém uma categoria pelo ID
- `GET /api/categories/slug/:slug` - Obtém uma categoria pelo slug

### Autenticação

- `POST /api/auth/register` - Registra um novo usuário
- `POST /api/auth/login` - Autentica um usuário
- `POST /api/auth/refresh` - Atualiza o token de acesso
- `GET /api/auth/me` - Obtém informações do usuário autenticado

## Tecnologias Utilizadas

### Backend

- Node.js
- Express
- TypeScript
- PostgreSQL com Sequelize
- JWT para autenticação
- bcrypt para criptografia
- Middleware de segurança (helmet, cors, rate-limit)

### Frontend

- React
- Next.js
- TypeScript
- Tailwind CSS
- Axios para requisições HTTP
