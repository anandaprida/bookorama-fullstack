const { Sequelize } = require('sequelize');

// Jika ada env variable DATABASE_URL (saat di Cloud), pakai itu.
// Jika tidak (di laptop), pakai settingan localhost lama.
const sequelize = process.env.DATABASE_URL 
  ? new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
      protocol: 'postgres',
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false 
        }
      },
      logging: false
    })
  : new Sequelize('bookorama', 'postgres', 'awok', { // Ganti password lokalmu
      host: '127.0.0.1',
      port: 5173,
      dialect: 'postgres',
      logging: false
    });

module.exports = sequelize;