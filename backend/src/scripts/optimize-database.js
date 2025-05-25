#!/usr/bin/env node
// filepath: c:\Users\julien\Work\revtek\backend\src\scripts\optimize-database.js

const { execSync } = require('child_process');
const path = require('path');

console.log('Iniciando otimização do banco de dados...');

try {
  // Caminho para o sequelize-cli
  const sequelizePath = path.join(__dirname, '..', '..', 'node_modules', '.bin', 'sequelize');
  
  // Executar as migrações pendentes
  console.log('Executando migrações pendentes...');
  execSync(`${sequelizePath} db:migrate`, { stdio: 'inherit' });
  
  // Verificar a estrutura do banco
  console.log('Verificando estrutura do banco de dados...');
  execSync(`${sequelizePath} db:migrate:status`, { stdio: 'inherit' });
  
  console.log('Otimização do banco de dados concluída com sucesso!');
} catch (error) {
  console.error('Erro durante a otimização do banco de dados:', error.message);
  process.exit(1);
}
