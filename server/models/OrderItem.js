const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const OrderItem = sequelize.define('OrderItem', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  quantity: { type: DataTypes.INTEGER, allowNull: false },
  price_at_purchase: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  subtotal: { type: DataTypes.DECIMAL(10, 2), allowNull: false }
  // transaction_id & book_id akan otomatis dibuat oleh relasi
});

module.exports = OrderItem;
