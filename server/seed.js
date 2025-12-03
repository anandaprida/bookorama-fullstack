const db = require('./models');

const seed = async () => {
  try {
    // 1. Reset Database (Hapus data lama agar bersih)
    await db.sequelize.sync({ force: true }); 
    console.log("Database reset berhasil...");

    // 2. BUAT USER ADMIN (Ini yang kemarin ketinggalan)
    await db.User.create({
      full_name: 'Admin Bookorama',
      email: 'admin@bookorama.com',
      password_hash: 'admin123', // Password sesuai instruksi
      role: 'Admin'
    });

    // 3. Buat User Customer (Opsional, buat tes login user biasa)
    await db.User.create({
      full_name: 'Budi Customer',
      email: 'budi@gmail.com',
      password_hash: 'user123',
      role: 'Customer'
    });

    // 4. Buat Data Buku
    await db.Book.bulkCreate([
       { isbn: '978-1', title: 'Laskar Pelangi', author: 'Andrea Hirata', price: 85000, category: 'Fiksi' },
       { isbn: '978-2', title: 'Atomic Habits', author: 'James Clear', price: 100000, category: 'Self-Help' },
       { isbn: '978-3', title: 'Filosofi Teras', author: 'Henry Manampiring', price: 98000, category: 'Self-Help' }
    ]);

    console.log("✅ SUKSES! User Admin (admin123) dan Buku telah dibuat.");
    
  } catch (err) {
    console.error("❌ Gagal seeding:", err);
  }
};

seed();