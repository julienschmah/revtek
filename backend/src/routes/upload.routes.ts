import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = Router();

// Configuração do multer para salvar arquivos em /public/uploads
const uploadDir = path.resolve(__dirname, '../../public/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Tipa explicitamente os parâmetros das funções do multer como 'unknown' para melhor prática
const storage = multer.diskStorage({
  destination: (req: unknown, file: unknown, cb: (error: Error | null, destination: string) => void) => {
    cb(null, uploadDir);
  },
  filename: (req: unknown, file: { originalname: string; fieldname: string }, cb: (error: Error | null, filename: string) => void) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  },
});

const upload = multer({ storage });

// Rota de upload
router.post('/', upload.single('file'), (req, res) => {
  // Tipar req como any para acessar req.file sem erro TS
  const file = (req as any).file;
  if (!file) {
    return res.status(400).json({ success: false, message: 'Nenhum arquivo enviado' });
  }
  // Retorna o path relativo para salvar no banco
  const filePath = `/uploads/${file.filename}`;
  return res.status(201).json({ success: true, path: filePath });
});

export default router;
