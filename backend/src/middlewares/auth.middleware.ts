import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { UserInstance } from '../models/user.model';
import NodeCache from 'node-cache';

const userCache = new NodeCache({
  stdTTL: 900,
  checkperiod: 300,
  useClones: false,
  maxKeys: 1000
});

declare global {
  namespace Express {
    interface Request {
      user?: UserInstance;
    }
  }
}

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const startTime = Date.now();
  try {
    const isDebug = process.env.NODE_ENV === 'development';
    
    if (isDebug) {
      console.log('Auth Middleware - protect: Processing request', { 
        path: req.path, 
        method: req.method
      });
    }
    
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
      console.log('Auth Middleware - protect: Found token in Authorization header');
    } 
    else if (req.cookies && req.cookies.jwt) {
      token = req.cookies.jwt;
      console.log('Auth Middleware - protect: Found token in cookies');
    }
    if (!token) {
      console.log('Auth Middleware - protect: No token found');
      return res.status(401).json({
        status: 'error',
        message: 'Você não está autenticado. Por favor, faça login.',
      });
    }
    
    if (!token.includes('.') || token.split('.').length !== 3) {
      console.error('Auth Middleware - protect: Invalid token format');
      return res.status(401).json({
        status: 'error',
        message: 'Formato de token inválido. Por favor, faça login novamente.',
      });
    }

    console.log('Auth Middleware - protect: Verifying token');
    
    // Verificar se o token é válido
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'seu-segredo-super-secreto'
      ) as { id: number };
      
      console.log('Auth Middleware - protect: Token verified successfully', { 
        userId: decoded.id,
        exp: (decoded as any).exp ? new Date((decoded as any).exp * 1000).toISOString() : 'unknown'
      });

      const cacheKey = `user_${decoded.id}`;
      let currentUser = userCache.get(cacheKey) as UserInstance | undefined;
      
      if (!currentUser) {
        console.log('Auth Middleware - protect: User not in cache, finding in database');
        // Verificar se o usuário ainda existe
        const dbUser = await User.findByPk(decoded.id);
        
        if (!dbUser) {
          console.log('Auth Middleware - protect: User not found in database');
          return res.status(401).json({
            status: 'error',
            message: 'O usuário não existe mais.',
          });
        }
        
        currentUser = dbUser;
        // Armazenar no cache para futuras requisições
        userCache.set(cacheKey, currentUser);
      } else {
        console.log('Auth Middleware - protect: User found in cache');
      }
      
      // Verificar se o usuário está ativo
      if (!currentUser.isActive) {
        console.log('Auth Middleware - protect: User account is inactive');
        // Remover do cache se não estiver mais ativo
        userCache.del(cacheKey);
        return res.status(401).json({
          status: 'error',
          message: 'Esta conta foi desativada.',
        });
      }

      const responseTime = Date.now() - startTime;
      console.log('Auth Middleware - protect: Authentication successful', {
        userId: currentUser.id,
        role: currentUser.role,
        responseTimeMs: responseTime
      });
      
      // Adicionar o usuário ao request
      req.user = currentUser;
      next();
    } catch (err) {
      console.error('Auth Middleware - protect: Invalid token', err);
      return res.status(401).json({
        status: 'error',
        message: 'Token inválido ou expirado.',
      });
    }
  } catch (err) {
    console.error('Auth Middleware - protect: Unexpected error', err);
    return res.status(500).json({
      status: 'error',
      message: 'Erro no servidor. Tente novamente mais tarde.',
    });
  }
};

export const restrictTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Você não está autenticado. Por favor, faça login.',
      });
    }

    // Verificar se o usuário tem o papel necessário
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'error',
        message: 'Você não tem permissão para acessar este recurso.',
      });
    }

    next();
  };
};

export class AppError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Log do erro
  console.error('Error Handler:', {
    message: err.message,
    name: err.name,
    stack: err.stack,
    path: req.path,
    method: req.method,
    statusCode: err.statusCode
  });

  // Enviar resposta com erro
  res.status(err.statusCode).json({
    status: err.status,
    message: err.isOperational ? err.message : 'Erro no servidor. Tente novamente mais tarde.',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};
