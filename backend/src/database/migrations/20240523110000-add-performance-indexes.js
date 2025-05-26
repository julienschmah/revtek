'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Adicionar índice para busca por categoria
    await queryInterface.addIndex('products', ['category_id'], {
      name: 'idx_products_category',
    });

    // Adicionar índice para busca por vendedor
    await queryInterface.addIndex('products', ['seller_id'], {
      name: 'idx_products_seller',
    });

    // Adicionar índice composto para buscas comuns de produtos
    await queryInterface.addIndex('products', ['status', 'category_id'], {
      name: 'idx_products_status_category',
    });

    // Adicionar índice para preço para otimizar filtros de range
    await queryInterface.addIndex('products', ['price'], {
      name: 'idx_products_price',
    });

    // Adicionar índice para busca por usuários ativos
    await queryInterface.addIndex('users', ['is_active'], {
      name: 'idx_users_active',
    });

    // Adicionar índice para busca por email (login)
    await queryInterface.addIndex('users', ['email'], {
      name: 'idx_users_email',
      // unique: true, // Removido para evitar duplicidade de índice UNIQUE
    });
  },

  async down(queryInterface, Sequelize) {
    // Remover todos os índices criados
    await queryInterface.removeIndex('products', 'idx_products_category');
    await queryInterface.removeIndex('products', 'idx_products_seller');
    await queryInterface.removeIndex('products', 'idx_products_status_category');
    await queryInterface.removeIndex('products', 'idx_products_price');
    await queryInterface.removeIndex('users', 'idx_users_active');
    await queryInterface.removeIndex('users', 'idx_users_email');
  }
};
