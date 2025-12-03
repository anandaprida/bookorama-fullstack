const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Book = sequelize.define('Book', {
  isbn: { type: DataTypes.STRING, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: false },
  author: { type: DataTypes.STRING, allowNull: false },
  price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  image_url: { type: DataTypes.STRING, allowNull: true }, // Kolom Baru: URL Gambar
  // category_id akan otomatis dibuat oleh relasi, jadi tidak perlu didefinisikan manual di sini jika menggunakan asosiasi Sequelize standar, tapi agar aman kita biarkan Sequelize mengaturnya via index.js
});

module.exports = Book;