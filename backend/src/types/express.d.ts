// Custom type definitions to extend Express Request interface with Multer properties
import { UserInstance } from '../models/user.model';

declare global {
  namespace Express {
    // Extend the Express Request interface
    interface Request {
      // User property is already defined in auth.middleware.ts
      user?: UserInstance;
      
      // Add Multer's file property for single file uploads
      file?: Express.Multer.File;
      
      // Add Multer's files property for multiple file uploads
      files?: {
        [fieldname: string]: Express.Multer.File[];
      } | Express.Multer.File[];
    }
  }
}

// Export an empty object to make this a valid module
export {};
