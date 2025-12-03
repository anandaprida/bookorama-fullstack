const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Transaction = sequelize.define('Transaction', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  transaction_number: { type: DataTypes.STRING, allowNull: false, unique: true },
  total_amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  status: { type: DataTypes.STRING, defaultValue: 'Success' }
  // user_id akan otomatis dibuat oleh relasi
});

module.exports = Transaction;
