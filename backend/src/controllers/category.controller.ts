import { Request, Response } from 'express';
import Category, { CategoryAttributes } from '../models/category.model';
import Product from '../models/product.model';
import { Op } from 'sequelize';

class CategoryController {
  /**
   * Cria uma nova categoria
   */
  public async create(req: Request, res: Response): Promise<Response> {
    try {
      // Verificar se o usuário é admin
      if (req.user?.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Apenas administradores podem criar categorias',
        });
      }

      if (req.body.parentId) {
        const parentCategory = await Category.findByPk(req.body.parentId);
        
        if (!parentCategory) {
          return res.status(404).json({
            success: false,
            message: 'Categoria pai não encontrada',
          });
        }
      }

      const categoryData: CategoryAttributes = req.body;
      const category = await Category.create(categoryData);

      return res.status(201).json({
        success: true,
        message: 'Categoria criada com sucesso',
        data: category,
      });
    } catch (error: any) {
      console.error('Erro ao criar categoria:', error);
      
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
      
      // Verificar se é um erro de unicidade (slug duplicado)
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({
          success: false,
          message: 'Já existe uma categoria com este slug',
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Erro ao criar categoria',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }

  /**
   * Atualiza uma categoria existente
   */
  public async update(req: Request, res: Response): Promise<Response> {
    try {      // Verificar se o usuário é admin
      if (req.user?.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Apenas administradores podem atualizar categorias',
        });
      }

      const categoryId = parseInt(req.params.id, 10);
      
      const category = await Category.findByPk(categoryId);
      
      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Categoria não encontrada',
        });
      }

      if (req.body.parentId !== undefined) {
        if (req.body.parentId === categoryId) {
          return res.status(400).json({
            success: false,
            message: 'Uma categoria não pode ser pai dela mesma',
          });
        }
        
        if (req.body.parentId) {
          const parentCategory = await Category.findByPk(req.body.parentId);
          
          if (!parentCategory) {
            return res.status(404).json({
              success: false,
              message: 'Categoria pai não encontrada',
            });
          }          
          const isSubcategory = await checkIfSubcategory(
            Number(req.body.parentId), 
            categoryId
          );
          
          if (isSubcategory) {
            return res.status(400).json({
              success: false,
              message: 'Não é possível criar hierarquias cíclicas de categorias',
            });
          }
        }
      }

      await category.update(req.body);

      return res.status(200).json({
        success: true,
        message: 'Categoria atualizada com sucesso',
        data: category,
      });
    } catch (error: any) {
      console.error('Erro ao atualizar categoria:', error);
      
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
      
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({
          success: false,
          message: 'Já existe uma categoria com este slug',
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Erro ao atualizar categoria',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }


  public async listAll(req: Request, res: Response): Promise<Response> {
    try {
      const includeInactive = req.query.includeInactive === 'true';
      
      const where: any = {};
      
      if (!includeInactive) {
        where.isActive = true;
      }
      
      const categories = await Category.findAll({
        where,
        include: [
          {
            model: Category,
            as: 'subcategories',
            required: false,
            attributes: ['id', 'name', 'slug', 'icon', 'isActive'],
            where: includeInactive ? {} : { isActive: true },
          },
        ],
        order: [
          ['name', 'ASC'],
          [{ model: Category, as: 'subcategories' }, 'name', 'ASC'],
        ],
      });

      return res.status(200).json({
        success: true,
        data: categories,
      });
    } catch (error: any) {
      console.error('Erro ao listar categorias:', error);
      
      return res.status(500).json({
        success: false,
        message: 'Erro ao listar categorias',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }

  /**
   * Busca uma categoria pelo ID
   */  public async getById(req: Request, res: Response): Promise<Response> {
    try {
      const categoryId = parseInt(req.params.id, 10);
      
      const category = await Category.findByPk(categoryId, {
        include: [
          {
            model: Category,
            as: 'subcategories',
            required: false,
            attributes: ['id', 'name', 'slug', 'icon', 'isActive'],
          },
          {
            model: Category,
            as: 'parentCategory',
            required: false,
            attributes: ['id', 'name', 'slug'],
          },
        ],
      });
      
      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Categoria não encontrada',
        });
      }

      return res.status(200).json({
        success: true,
        data: category,
      });
    } catch (error: any) {
      console.error('Erro ao buscar categoria:', error);
      
      return res.status(500).json({
        success: false,
        message: 'Erro ao buscar categoria',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }

  public async getBySlug(req: Request, res: Response): Promise<Response> {
    try {
      const slug = req.params.slug;
      
      const category = await Category.findOne({
        where: { slug },
        include: [
          {
            model: Category,
            as: 'subcategories',
            required: false,
            attributes: ['id', 'name', 'slug', 'icon', 'isActive'],
            where: { isActive: true },
          },
          {
            model: Category,
            as: 'parentCategory',
            required: false,
            attributes: ['id', 'name', 'slug'],
          },
        ],
      });
      
      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Categoria não encontrada',
        });
      }

      return res.status(200).json({
        success: true,
        data: category,
      });
    } catch (error: any) {
      console.error('Erro ao buscar categoria:', error);
      
      return res.status(500).json({
        success: false,
        message: 'Erro ao buscar categoria',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    try {
      // Verificar se o usuário é admin
      if (req.user?.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Apenas administradores podem excluir categorias',        });
      }

      const categoryId = parseInt(req.params.id, 10);
      
      const category = await Category.findByPk(categoryId);
      
      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Categoria não encontrada',
        });      }

      const productCount = await Product.count({
        where: { categoryId }
      });
      
      if (productCount > 0) {
        return res.status(400).json({
          success: false,
          message: 'Não é possível excluir uma categoria que possui produtos',
        });
      }

      const subcategoryCount = await Category.count({
        where: { parentId: categoryId }
      });
      
      if (subcategoryCount > 0) {
        return res.status(400).json({
          success: false,
          message: 'Não é possível excluir uma categoria que possui subcategorias',
        });
      }

      await category.destroy();

      return res.status(200).json({
        success: true,
        message: 'Categoria excluída com sucesso',
      });
    } catch (error: any) {
      console.error('Erro ao excluir categoria:', error);
      
      return res.status(500).json({
        success: false,
        message: 'Erro ao excluir categoria',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }
}

async function checkIfSubcategory(parentId: number, categoryId: number): Promise<boolean> {
  if (parentId === categoryId) {
    return true;
  }
  
  const children = await Category.findAll({
    where: { parentId },
    attributes: ['id'],
  });
  
  if (children.length === 0) {
    return false;
  }
  
  for (const child of children) {
    if (child.get('id') === categoryId) {
      return true;
    }
    
    const isSubcategory = await checkIfSubcategory(child.get('id') as number, categoryId);
    
    if (isSubcategory) {
      return true;
    }
  }
  
  return false;
}

export default new CategoryController(); 