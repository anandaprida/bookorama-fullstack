const sequelize = require('../config/database');
const User = require('./User');
const Book = require('./Book');
const Category = require('./Category'); // Import Baru
const Transaction = require('./Transaction');
const OrderItem = require('./OrderItem');

// --- Definisi Relasi ---

// 1. User & Transaksi
User.hasMany(Transaction, { foreignKey: 'user_id' });
Transaction.belongsTo(User, { foreignKey: 'user_id' });

// 2. Transaksi & Item
Transaction.hasMany(OrderItem, { foreignKey: 'transaction_id' });
OrderItem.belongsTo(Transaction, { foreignKey: 'transaction_id' });

// 3. Buku & Item
Book.hasMany(OrderItem, { foreignKey: 'book_id' });
OrderItem.belongsTo(Book, { foreignKey: 'book_id' });

// 4. Kategori & Buku (RELASI BARU)
Category.hasMany(Book, { foreignKey: 'category_id' });
Book.belongsTo(Category, { foreignKey: 'category_id' });

const db = {
  sequelize,
  User,
  Book,
  Category,
  Transaction,
  OrderItem
};

module.exports = db;
