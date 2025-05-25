// Test script to verify that TypeScript recognizes req.file property
import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import { protect } from '../middlewares/auth.middleware';

// Initialize multer with disk storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../public/storage/test'));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Create a test route handler
const testUploadHandler = (req: Request, res: Response) => {
  try {
    // TypeScript should now recognize req.file without errors
    const file = req.file;
    
    if (!file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }
    
    // Access file properties without TypeScript errors
    const fileInfo = {
      originalname: file.originalname,
      filename: file.filename,
      mimetype: file.mimetype,
      size: file.size,
      path: file.path
    };
    
    return res.status(200).json({
      success: true,
      message: 'File uploaded successfully',
      fileInfo
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error processing file upload'
    });
  }
};

// Example of using this function in a route
const router = express.Router();
router.post('/test-upload', protect, upload.single('file'), testUploadHandler);

export { testUploadHandler };
