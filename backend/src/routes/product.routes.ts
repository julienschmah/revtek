import { Router } from 'express';
import productController from '../controllers/product.controller';
import { protect, restrictTo } from '../middlewares/auth.middleware';

const router = Router();

// Rotas públicas - não requerem autenticação
router.get('/public', productController.listPublic);
router.get('/public/:id', productController.getById);

// Rotas privadas - requerem autenticação
router.use(protect);

// Rota para listar produtos do usuário autenticado
router.get('/my', (req, res, next) => {
  console.log('ROTA /products/my ACIONADA');
  next();
}, productController.getMyProducts);

// Rotas para vendedores (gerenciamento de produtos)
router.get('/', productController.listSellerProducts);
router.post('/', productController.create);
router.put('/:id', productController.update);
router.get('/:id', productController.getById);
router.delete('/:id', productController.delete);

export default router;