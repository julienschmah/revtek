import { Request, Response } from 'express';
import Product, { ProductAttributes } from '../models/product.model';
import Category from '../models/category.model';
import User from '../models/user.model';
import { Op } from 'sequelize';

class ProductController {
  public async create(req: Request, res: Response): Promise<Response> {    try {
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Usuário não autenticado',
        });
      }

      const user = await User.findByPk(userId);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Usuário não encontrado',
        });
      }

      const categoryId = req.body.categoryId;
      const categoryExists = await Category.findByPk(categoryId);
      
      if (!categoryExists) {
        return res.status(404).json({
          success: false,
          message: 'Categoria não encontrada',
        });
      }

      const productData: ProductAttributes = {
        ...req.body,
        sellerId: userId,
        status: 'active', 
        salesCount: 0,
      };
      console.log('CREATE PRODUCT - productData.images:', productData.images);

      const product = await Product.create(productData);
      console.log('CREATE PRODUCT - produto salvo:', product.toJSON());

      return res.status(201).json({
        success: true,
        message: 'Produto criado com sucesso',
        data: product,
      });
    } catch (error: any) {
      console.error('Erro ao criar produto:', error);
      
      if (error.name === 'SequelizeValidationError') {
        const validationErrors = error.errors.map((e: any) => ({
          field: e.path,
          message: e.message,
        }));
        
        return res.status(400).json({
          success: false,
          message: 'Erro de validação',
          errors: validationErrors,
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Erro ao criar produto',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }

  public async update(req: Request, res: Response): Promise<Response> {
    try {
      const productId = req.params.id;
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Usuário não autenticado',
        });
      }

      const product = await Product.findByPk(productId);
      
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Produto não encontrado',
        });
      }

      const user = await User.findByPk(userId);
      if (!user || (user.get('role') !== 'admin' && product.get('sellerId') !== userId)) {
        return res.status(403).json({
          success: false,
          message: 'Você não tem permissão para editar este produto',
        });
      }

      if (req.body.categoryId && req.body.categoryId !== product.get('categoryId')) {
        const categoryExists = await Category.findByPk(req.body.categoryId);
        
        if (!categoryExists) {
          return res.status(404).json({
            success: false,
            message: 'Categoria não encontrada',
          });
        }
      }

      await product.update(req.body);

      return res.status(200).json({
        success: true,
        message: 'Produto atualizado com sucesso',
        data: product,
      });
    } catch (error: any) {
      console.error('Erro ao atualizar produto:', error);
      
      if (error.name === 'SequelizeValidationError') {
        const validationErrors = error.errors.map((e: any) => ({
          field: e.path,
          message: e.message,
        }));
        
        return res.status(400).json({
          success: false,
          message: 'Erro de validação',
          errors: validationErrors,
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Erro ao atualizar produto',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }

  public async listSellerProducts(req: Request, res: Response): Promise<Response> {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Usuário não autenticado',
        });
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = (page - 1) * limit;
      const search = req.query.search as string;
      const status = req.query.status as string;
      const categoryId = req.query.categoryId as string;
      
      const sortBy = (req.query.sortBy as string) || 'createdAt';
      const sortOrder = (req.query.sortOrder as string) || 'DESC';
      
      const where: any = { sellerId: userId };
      
      if (search) {
        where[Op.or] = [
          { name: { [Op.like]: `%${search}%` } },
          { description: { [Op.like]: `%${search}%` } },
          { brand: { [Op.like]: `%${search}%` } },
          { model: { [Op.like]: `%${search}%` } },
        ];
      }
      
      if (status && status !== 'all') {
        where.status = status;
      }
      
      if (categoryId) {
        where.categoryId = categoryId;
      }

      const { count, rows } = await Product.findAndCountAll({
        where,
        limit,
        offset,
        order: [[sortBy, sortOrder]],
        include: [
          {
            model: Category,
            as: 'category',
            attributes: ['id', 'name', 'slug'],
          },
        ],
      });

      const totalPages = Math.ceil(count / limit);
      const hasNextPage = page < totalPages;
      const hasPreviousPage = page > 1;

      return res.status(200).json({
        success: true,
        data: rows,
        pagination: {
          total: count,
          page,
          limit,
          totalPages,
          hasNextPage,
          hasPreviousPage,
        },
      });
    } catch (error: any) {
      console.error('Erro ao listar produtos do vendedor:', error);
      
      return res.status(500).json({
        success: false,
        message: 'Erro ao listar produtos',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }

  public async getById(req: Request, res: Response): Promise<Response> {
    try {
      const productId = req.params.id;
      
      const product = await Product.findByPk(productId, {
        include: [
          {
            model: Category,
            as: 'category',
            attributes: ['id', 'name', 'slug'],
          },
          {
            model: User,
            as: 'seller',
            attributes: ['id', 'name', 'profilePicture', 'isSeller'],
          },
        ],
      });
      
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Produto não encontrado',
        });
      }

      return res.status(200).json({
        success: true,
        data: product,
      });
    } catch (error: any) {
      console.error('Erro ao buscar produto:', error);
      
      return res.status(500).json({
        success: false,
        message: 'Erro ao buscar produto',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    try {
      const productId = req.params.id;
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Usuário não autenticado',
        });
      }

      const product = await Product.findByPk(productId);
      
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Produto não encontrado',
        });
      }

      const user = await User.findByPk(userId);
      if (!user || (user.get('role') !== 'admin' && product.get('sellerId') !== userId)) {
        return res.status(403).json({
          success: false,
          message: 'Você não tem permissão para excluir este produto',
        });
      }

      await product.destroy();

      return res.status(200).json({
        success: true,
        message: 'Produto excluído com sucesso',
      });
    } catch (error: any) {
      console.error('Erro ao excluir produto:', error);
      
      return res.status(500).json({
        success: false,
        message: 'Erro ao excluir produto',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }

  public async listPublic(req: Request, res: Response): Promise<Response> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 12;
      const offset = (page - 1) * limit;

      const search = req.query.search as string;
      const categoryId = req.query.categoryId as string;
      const minPrice = parseFloat(req.query.minPrice as string) || undefined;
      const maxPrice = parseFloat(req.query.maxPrice as string) || undefined;
      const sellerId = req.query.sellerId as string;
      
      const sortBy = (req.query.sortBy as string) || 'createdAt';
      const sortOrder = (req.query.sortOrder as string) || 'DESC';
      
      const where: any = { 
        status: 'active', 
      };
      
      if (search) {
        where[Op.or] = [
          { name: { [Op.like]: `%${search}%` } },
          { description: { [Op.like]: `%${search}%` } },
          { brand: { [Op.like]: `%${search}%` } },
          { model: { [Op.like]: `%${search}%` } },
        ];
      }
      
      if (categoryId) {
        where.categoryId = categoryId;
      }
      
      if (minPrice !== undefined || maxPrice !== undefined) {
        where.price = {};
        
        if (minPrice !== undefined) {
          where.price[Op.gte] = minPrice;
        }
        
        if (maxPrice !== undefined) {
          where.price[Op.lte] = maxPrice;
        }
      }
      
      if (sellerId) {
        where.sellerId = sellerId;
      }    
      const { count, rows } = await Product.findAndCountAll({
        where,
        limit,
        offset,
        order: [[sortBy, sortOrder]],
        include: [
          {
            model: Category,
            as: 'category',
            attributes: ['id', 'name', 'slug'],
          },
          {
            model: User,
            as: 'seller',
            attributes: ['id', 'name', 'profilePicture'],
          },
        ],
        attributes: [
          'id', 'name', 'price', 'description', 'brand', 'model', 
          'images', 'isNew', 'createdAt', 'stock', 'salesCount'
        ]
      });

      const totalPages = Math.ceil(count / limit);
      const hasNextPage = page < totalPages;
      const hasPreviousPage = page > 1;

      return res.status(200).json({
        success: true,
        data: rows,
        pagination: {
          total: count,
          page,
          limit,
          totalPages,
          hasNextPage,
          hasPreviousPage,
        },
      });
    } catch (error: any) {
      console.error('Erro ao listar produtos:', error);
      
      return res.status(500).json({
        success: false,
        message: 'Erro ao listar produtos',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }

  public async getMyProducts(req: Request, res: Response): Promise<Response> {
    console.log('getMyProducts - INICIO');
    try {
      const userId = req.user?.id;
      console.log('getMyProducts - userId:', userId);
      if (!userId) {
        console.log('getMyProducts - NÃO AUTENTICADO');
        return res.status(401).json({ message: 'Não autenticado' });
      }
      const products = await Product.findAll({
        where: { sellerId: userId },
        order: [['createdAt', 'DESC']]
      });
      console.log('getMyProducts - produtos encontrados:', products.length);
      return res.status(200).json({ status: 'success', data: { products } });
    } catch (error: any) {
      console.error('getMyProducts - ERRO:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro ao listar produtos',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }
}

export default new ProductController();