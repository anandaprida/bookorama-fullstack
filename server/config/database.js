const { Sequelize } = require('sequelize');
const pg = require('pg'); // <--- 1. Import manual library pg

const sequelize = process.env.DATABASE_URL 
  ? new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
      dialectModule: pg, // <--- 2. Paksa Sequelize pakai module ini (PENTING BUAT VERCEL)
      protocol: 'postgres',
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false 
        }
      },
      logging: false
    })
  : new Sequelize('bookorama', 'postgres', 'awok', {
      host: '127.0.0.1',
      port: 5173,
      dialect: 'postgres',
      logging: false
    });

module.exports = sequelize;