import { Router } from 'express';
import categoryController from '../controllers/category.controller';
import { protect, restrictTo } from '../middlewares/auth.middleware';

const router = Router();

// Rotas públicas
router.get('/', categoryController.listAll);
router.get('/id/:id', categoryController.getById);
router.get('/slug/:slug', categoryController.getBySlug);

// Rotas privadas (apenas admin)
router.use(protect);
router.post('/', restrictTo('admin'), categoryController.create);
router.put('/:id', restrictTo('admin'), categoryController.update);
router.delete('/:id', restrictTo('admin'), categoryController.delete);

export default router; 