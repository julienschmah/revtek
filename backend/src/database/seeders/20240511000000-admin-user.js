'use strict';
const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Check if admin user already exists
    const existingAdmin = await queryInterface.sequelize.query(
      `SELECT * FROM users WHERE email = 'admin@example.com'`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );
    
    // Only proceed if admin doesn't exist
    if (existingAdmin.length === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      await queryInterface.bulkInsert('users', [
        {
          name: 'Administrador',
          email: 'admin@example.com',
          password: hashedPassword,
          role: 'admin',
          is_active: true,
          // Add is_seller field to match the updated model
          is_seller: false,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ]);
    } else {
      console.log('Admin user already exists, skipping...');
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', { email: 'admin@example.com' });
  },
};