const { Sequelize } = require('sequelize');

// Ganti 'localhost' menjadi '127.0.0.1'
const sequelize = new Sequelize('bookorama', 'postgres', 'awok', {
  host: '127.0.0.1', // Gunakan 127.0.0.1 agar lebih stabil di Mac/Windows
  port: 5173,        // Ganti port ini jika PostgreSQL Anda tidak jalan di 5432 (misal: 5173)
  dialect: 'postgres',
  logging: false
});

module.exports = sequelize;