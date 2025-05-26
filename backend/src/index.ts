import express, { Express } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { rateLimit } from 'express-rate-limit';
import compression from 'compression';

// Rotas
import routes from './routes/index';

// Middlewares
import { globalErrorHandler, AppError } from './middlewares/error.middleware';
import { performanceMonitor, enableCompression } from './middlewares/performance.middleware';

// Inicialização do banco de dados
import { initDatabase } from './config/init-db';

// Configuração das variáveis de ambiente
dotenv.config();

// Criação da aplicação Express
const app: Express = express();
const port = process.env.PORT || 3001;

// Middlewares
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());
app.use(helmet());
app.use(compression()); // Comprimir todas as respostas
app.use(morgan('dev'));
app.use(performanceMonitor); // Adicionar monitoramento de performance
app.use(enableCompression); // Configurações de cache

// Configuração do CORS (deve vir ANTES do express.static)
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
    exposedHeaders: ['Access-Control-Allow-Origin', 'Access-Control-Allow-Credentials']
  })
);

// Libera CORS para arquivos estáticos (corrigido para todas as rotas de arquivos)
app.use((req, res, next) => {
  if (req.path.startsWith('/storage/')) {
    res.header('Access-Control-Allow-Origin', '*'); // Permite acesso universal para imagens
    res.header('Access-Control-Allow-Credentials', 'true');
  }
  next();
});

// Servir arquivos estáticos da pasta public
app.use(express.static('src/public'));

// Limitador de requisições
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  limit: 100, // 100 requisições por IP
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

// Rotas
app.use('/api', routes);

// Rota de teste
app.get('/', (req, res) => {
  res.send('API Revmak funcionando!');
});

// Middleware para rotas não encontradas
app.all('*', (req, res, next) => {
  next(new AppError(`Não foi possível encontrar ${req.originalUrl} neste servidor!`, 404));
});

// Middleware de tratamento de erros
app.use(globalErrorHandler);

// Inicialização do servidor
const startServer = async () => {
  try {
    // Inicializar o banco de dados
    await initDatabase();
    
    // Iniciar o servidor
    app.listen(port, () => {
      console.log(`Servidor rodando na porta ${port}`);
    });
  } catch (error) {
    console.error('Erro ao iniciar o servidor:', error);
  }
};

startServer();