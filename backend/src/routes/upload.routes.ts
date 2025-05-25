import { Router } from 'express';
import path from 'path';
import { protect } from '../middlewares/auth.middleware';
import uploadConfig, { handleMulterError } from '../config/multer';
import { Request, Response, NextFunction } from 'express';
import multer from 'multer';

// Extend Express Request interface to include 'file' property from multer
declare global {
  namespace Express {
    interface Request {
      file?: Express.Multer.File;
    }
  }
}

const router = Router();

// Handler para capturar erros de autenticação e multer separadamente
const handleUpload = (req: Request, res: Response) => {
  try {    // Verificar se existe um usuário autenticado
    if (!req.user) {
      console.error('Upload route - No authenticated user found');
      return res.status(401).json({
        success: false,
        message: 'Não autorizado. Por favor, faça login novamente.',
        code: 'AUTHENTICATION_REQUIRED'
      });
    }
      // Verificar se o arquivo existe
    const file = req.file;
    if (!file) {
      return res.status(400).json({
        success: false,
        message: 'Nenhum arquivo foi enviado',
        code: 'NO_FILE_UPLOADED'
      });
    }
      // Retorna o caminho do arquivo para o frontend
    // Build the public URL path - Extract the "user_X" or "temp" folder from the path
    const pathSegments = file.path.split(path.sep);
    const folderIndex = pathSegments.findIndex(segment => segment === 'storage');
    
    let filePath = '';
    if (folderIndex !== -1 && folderIndex < pathSegments.length - 2) {
      // Get folder and filename
      const storageFolder = pathSegments[folderIndex + 1];
      const filename = pathSegments[pathSegments.length - 1];
      filePath = `/storage/${storageFolder}/${filename}`;
    } else {
      // Fallback to simple path
      filePath = `/storage/${file.filename}`;
    }
      console.log('Upload realizado com sucesso:', filePath, {
      userId: req.user.id,
      filename: file.filename,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size
    });
    
    return res.status(200).json({
      success: true,
      message: 'Arquivo enviado com sucesso',
      path: filePath,
      fileInfo: {
        originalname: file.originalname,
        filename: file.filename,
        mimetype: file.mimetype,
        size: file.size
      }
    });  } catch (error: any) {
    console.error('Erro no upload de arquivo:', error);
    
    return res.status(500).json({
      success: false,
      message: 'Erro ao processar upload de arquivo',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      code: 'UPLOAD_PROCESSING_ERROR'
    });
  }
};

// Middleware para capturar erros do multer
const multerErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err) {
    console.error('Upload route - Multer error:', err);
    return res.status(400).json({
      success: false,
      message: err.message || 'Erro no processamento do arquivo',
      code: 'FILE_PROCESSING_ERROR'
    });
  }
  next();
};

// Create a wrapper middleware that catches token expiration specifically
const tokenExpirationHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err && (err.name === 'TokenExpiredError' || 
              (err.message && err.message.includes('expirado')))) {
    console.error('Upload route - Token expired:', err);
    return res.status(401).json({
      success: false,
      message: 'Sua sessão expirou. Por favor, faça login novamente.',
      code: 'TOKEN_EXPIRED'
    });
  }
  next(err);
};

// Rota para upload de arquivos genéricos
router.post('/', 
  protect, 
  tokenExpirationHandler,
  uploadConfig.single('file'), 
  handleMulterError, 
  handleUpload
);

export default router;
