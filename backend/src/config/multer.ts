import multer, { FileFilterCallback, MulterError } from 'multer';
import path from 'path';
import fs from 'fs';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

// Define error classes for better error handling
export class FileUploadError extends Error {
  code: string;
  statusCode: number;
  
  constructor(message: string, code: string = 'FILE_UPLOAD_ERROR', statusCode: number = 400) {
    super(message);
    this.name = 'FileUploadError';
    this.code = code;
    this.statusCode = statusCode;
  }
}

// Ensure storage directory exists
const baseStorageDir = path.join(__dirname, '..', 'public', 'storage');
if (!fs.existsSync(baseStorageDir)) {
  fs.mkdirSync(baseStorageDir, { recursive: true });
}

// Create user-specific directories for uploads
const getStoragePath = (req: Request) => {
  // Default storage if no user is authenticated
  let storagePath = path.join(baseStorageDir, 'temp');
  
  // If user is authenticated, use user-specific directory
  if (req.user && req.user.id) {
    storagePath = path.join(baseStorageDir, `user_${req.user.id}`);
  }
  
  // Ensure the directory exists
  if (!fs.existsSync(storagePath)) {
    fs.mkdirSync(storagePath, { recursive: true });
  }
  
  return storagePath;
};

// Enhanced storage configuration with user-specific paths
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      const destinationPath = getStoragePath(req);
      console.log('Upload destination path:', destinationPath);
      cb(null, destinationPath);
    } catch (error) {
      console.error('Error determining upload destination:', error);
      cb(new Error('Erro ao determinar destino do upload'), '');
    }
  },
  filename: (req, file, cb) => {
    try {
      // Generate unique filename with original extension
      const uniqueId = uuidv4();
      const originalExt = path.extname(file.originalname).toLowerCase();
      const fileName = `${uniqueId}${originalExt}`;
      
      // Store original filename information
      file.originalname = file.originalname.replace(/[^\w\s.-]/g, '_'); // sanitize original filename
      
      console.log('Generated filename for upload:', fileName);
      cb(null, fileName);
    } catch (error) {
      console.error('Error generating filename:', error);
      cb(new Error('Erro ao gerar nome do arquivo'), '');
    }
  },
});

// Enhanced file filter with detailed validation
const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  try {
    console.log('Validating file:', { 
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size
    });
    
    // Check for authentication
    if (!req.user) {
      console.warn('File upload attempted without authentication');
      return cb(new FileUploadError(
        'Autenticação necessária para upload de arquivos. Por favor, faça login novamente.',
        'AUTHENTICATION_REQUIRED',
        401
      ));
    }
    
    // Check file type
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      console.warn('Invalid file type attempted:', file.mimetype);
      return cb(new FileUploadError(
        `Tipo de arquivo não suportado (${file.mimetype}). Apenas imagens JPEG, PNG, GIF e WebP são permitidas.`,
        'INVALID_FILE_TYPE'
      ));
    }
    
    // Check filename length
    if (file.originalname.length > 255) {
      return cb(new FileUploadError(
        'Nome do arquivo muito longo. Máximo de 255 caracteres.',
        'FILENAME_TOO_LONG'
      ));
    }
    
    // Accept the file
    console.log('File validation successful');
    cb(null, true);
  } catch (error) {
    console.error('Unexpected error during file validation:', error);
    cb(new Error('Erro inesperado na validação do arquivo'));
  }
};

// Enhanced limits configuration
const limits = {
  fileSize: 5 * 1024 * 1024, // 5MB
  files: 1, // Allow only 1 file per request
};

// Main multer configuration
const uploadConfig = multer({
  storage,
  fileFilter,
  limits,
});

// Error handler middleware for multer errors
export const handleMulterError = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err) {
    console.error('Multer error:', err);
    
    if (err instanceof MulterError) {
      // Handle specific Multer errors
      switch (err.code) {
        case 'LIMIT_FILE_SIZE':
          return res.status(400).json({
            success: false,
            message: 'Arquivo muito grande. O tamanho máximo permitido é 5MB.',
            code: 'FILE_TOO_LARGE'
          });
        case 'LIMIT_UNEXPECTED_FILE':
          return res.status(400).json({
            success: false,
            message: 'Campo de arquivo inválido ou múltiplos arquivos enviados.',
            code: 'INVALID_FIELD'
          });
        default:
          return res.status(400).json({
            success: false,
            message: `Erro no processamento do arquivo: ${err.message}`,
            code: err.code
          });
      }
    } else if (err instanceof FileUploadError) {
      // Handle custom file upload errors
      return res.status(err.statusCode).json({
        success: false,
        message: err.message,
        code: err.code
      });
    }
    
    // Handle other errors
    return res.status(500).json({
      success: false,
      message: 'Erro no processamento do upload de arquivo',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
  
  next();
};

export default uploadConfig;
