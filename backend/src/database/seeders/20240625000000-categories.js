'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    
    // Check existing categories
    const existingCategories = await queryInterface.sequelize.query(
      `SELECT slug FROM categories`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );
    
    const existingSlugs = new Set(existingCategories.map(cat => cat.slug));
    
    const mainCategories = [
      {
        name: 'Fogões',
        slug: 'fogoes',
        description: 'Fogões industriais e comerciais para restaurantes',
        icon: 'fire',
        parent_id: null,
        is_active: true,
        created_at: now,
        updated_at: now,
      },
      {
        name: 'Refrigeração',
        slug: 'refrigeracao',
        description: 'Equipamentos de refrigeração para cozinhas profissionais',
        icon: 'snowflake',
        parent_id: null,
        is_active: true,
        created_at: now,
        updated_at: now,
      },
      {
        name: 'Preparação',
        slug: 'preparacao',
        description: 'Equipamentos para preparação de alimentos',
        icon: 'blender',
        parent_id: null,
        is_active: true,
        created_at: now,
        updated_at: now,
      },
      {
        name: 'Fornos',
        slug: 'fornos',
        description: 'Fornos comerciais e industriais',
        icon: 'burn',
        parent_id: null,
        is_active: true,
        created_at: now,
        updated_at: now,
      },
      {
        name: 'Utensílios',
        slug: 'utensilios',
        description: 'Utensílios e acessórios para cozinhas profissionais',
        icon: 'utensils',
        parent_id: null,
        is_active: true,
        created_at: now,
        updated_at: now,
      },
      {
        name: 'Móveis',
        slug: 'moveis',
        description: 'Móveis e instalações para restaurantes',
        icon: 'chair',
        parent_id: null,
        is_active: true,
        created_at: now,
        updated_at: now,
      },
    ];

    // Filter out categories that already exist
    const newMainCategories = mainCategories.filter(cat => !existingSlugs.has(cat.slug));
    
    // Only insert if there are new categories
    if (newMainCategories.length > 0) {
      await queryInterface.bulkInsert('categories', newMainCategories, {});
    } else {
      console.log('All main categories already exist, skipping...');
    }

    // Get all categories including newly inserted ones
    const categories = await queryInterface.sequelize.query(
      `SELECT id, slug FROM categories;`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );
    
    const categoryMap = {};
    categories.forEach(category => {
      categoryMap[category.slug] = category.id;
    });

    const subcategories = [
      {
        name: 'Fogões Industriais',
        slug: 'fogoes-industriais',
        description: 'Fogões industriais de alta pressão',
        icon: 'fire',
        parent_id: categoryMap['fogoes'],
        is_active: true,
        created_at: now,
        updated_at: now,
      },
      {
        name: 'Fogões a Gás',
        slug: 'fogoes-a-gas',
        description: 'Fogões comerciais a gás',
        icon: 'fire',
        parent_id: categoryMap['fogoes'],
        is_active: true,
        created_at: now,
        updated_at: now,
      },
      {
        name: 'Cooktops',
        slug: 'cooktops',
        description: 'Cooktops profissionais',
        icon: 'fire',
        parent_id: categoryMap['fogoes'],
        is_active: true,
        created_at: now,
        updated_at: now,
      },
      
      {
        name: 'Geladeiras Comerciais',
        slug: 'geladeiras-comerciais',
        description: 'Geladeiras para uso comercial',
        icon: 'snowflake',
        parent_id: categoryMap['refrigeracao'],
        is_active: true,
        created_at: now,
        updated_at: now,
      },
      {
        name: 'Freezers',
        slug: 'freezers',
        description: 'Freezers industriais e comerciais',
        icon: 'snowflake',
        parent_id: categoryMap['refrigeracao'],
        is_active: true,
        created_at: now,
        updated_at: now,
      },
      {
        name: 'Expositores Refrigerados',
        slug: 'expositores-refrigerados',
        description: 'Expositores refrigerados para alimentos',
        icon: 'snowflake',
        parent_id: categoryMap['refrigeracao'],
        is_active: true,
        created_at: now,
        updated_at: now,
      },
      
      {
        name: 'Liquidificadores',
        slug: 'liquidificadores',
        description: 'Liquidificadores industriais e comerciais',
        icon: 'blender',
        parent_id: categoryMap['preparacao'],
        is_active: true,
        created_at: now,
        updated_at: now,
      },
      {
        name: 'Processadores',
        slug: 'processadores',
        description: 'Processadores de alimentos profissionais',
        icon: 'blender',
        parent_id: categoryMap['preparacao'],
        is_active: true,
        created_at: now,
        updated_at: now,
      },
      {
        name: 'Batedeiras',
        slug: 'batedeiras',
        description: 'Batedeiras industriais',
        icon: 'blender',
        parent_id: categoryMap['preparacao'],
        is_active: true,
        created_at: now,
        updated_at: now,
      },
      
      // Subcategorias de Fornos
      {
        name: 'Fornos Combinados',
        slug: 'fornos-combinados',
        description: 'Fornos combinados profissionais',
        icon: 'burn',
        parent_id: categoryMap['fornos'],
        is_active: true,
        created_at: now,
        updated_at: now,
      },
      {
        name: 'Fornos de Pizza',
        slug: 'fornos-de-pizza',
        description: 'Fornos especiais para pizza',
        icon: 'burn',
        parent_id: categoryMap['fornos'],
        is_active: true,
        created_at: now,
        updated_at: now,
      },
      {
        name: 'Fornos de Convecção',
        slug: 'fornos-de-conveccao',
        description: 'Fornos de convecção para uso comercial',
        icon: 'burn',
        parent_id: categoryMap['fornos'],
        is_active: true,
        created_at: now,
        updated_at: now,
      },
    ];

    // Filter out subcategories that already exist
    const newSubcategories = subcategories.filter(cat => !existingSlugs.has(cat.slug));
    
    // Skip insertion for parent_id that might be null due to parent category not existing
    const validSubcategories = newSubcategories.filter(cat => cat.parent_id !== undefined && cat.parent_id !== null);
    
    // Only insert if there are new subcategories
    if (validSubcategories.length > 0) {
      try {
        await queryInterface.bulkInsert('categories', validSubcategories, {});
      } catch (error) {
        console.error('Error inserting subcategories:', error.message);
        // Insert one by one to identify problem categories
        for (const subcategory of validSubcategories) {
          try {
            await queryInterface.bulkInsert('categories', [subcategory], {});
          } catch (subError) {
            console.error(`Failed to insert subcategory ${subcategory.slug}:`, subError.message);
          }
        }
      }
    } else {
      console.log('All subcategories already exist or have invalid parent_ids, skipping...');
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('categories', null, {});
  }
};