const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  full_name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  password_hash: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM('Admin', 'Customer'), defaultValue: 'Customer' }
});

module.exports = User;
