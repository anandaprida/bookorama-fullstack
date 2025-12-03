const express = require('express');
const cors = require('cors');
const db = require('./models');
const swaggerDocument = require('./swaggerDef');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// --- MANUAL SWAGGER UI (CDN VERSION) ---
// Ini solusi paling stabil untuk Vercel/Serverless
// Kita load script langsung dari internet, bukan dari folder lokal yang sering hilang
app.get('/api-docs', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>Bookorama API Documentation</title>
      <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui.css" />
      <style>
        body { margin: 0; padding: 0; }
      </style>
    </head>
    <body>
      <div id="swagger-ui"></div>
      <script src="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-bundle.js" crossorigin></script>
      <script src="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-standalone-preset.js" crossorigin></script>
      <script>
        window.onload = () => {
          window.ui = SwaggerUIBundle({
            spec: ${JSON.stringify(swaggerDocument)},
            dom_id: '#swagger-ui',
            presets: [
              SwaggerUIBundle.presets.apis,
              SwaggerUIStandalonePreset
            ],
            layout: "StandaloneLayout",
          });
        };
      </script>
    </body>
    </html>
  `);
});
// ---------------------------------------

// --- API ENDPOINTS ---

// 1. GET: Ambil Semua Buku (Include Kategori)
app.get('/api/books', async (req, res) => {
  try {
    const books = await db.Book.findAll({ 
      include: db.Category, 
      order: [['createdAt', 'DESC']] 
    });
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. POST: Tambah Buku Baru
app.post('/api/books', async (req, res) => {
  try {
    const { isbn, title, author, price, category_id, image_url } = req.body;
    const newBook = await db.Book.create({ 
      isbn, title, author, price, category_id, image_url 
    });
    res.status(201).json(newBook);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. DELETE: Hapus Buku
app.delete('/api/books/:isbn', async (req, res) => {
  try {
    const result = await db.Book.destroy({ where: { isbn: req.params.isbn } });
    if (result) res.json({ message: "Buku dihapus" });
    else res.status(404).json({ message: "Buku tidak ditemukan" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. KATEGORI API
app.get('/api/categories', async (req, res) => {
  const cats = await db.Category.findAll();
  res.json(cats);
});

app.post('/api/categories', async (req, res) => {
  try {
    const newCat = await db.Category.create({ name: req.body.name });
    res.json(newCat);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/categories/:id', async (req, res) => {
  await db.Category.destroy({ where: { id: req.params.id } });
  res.json({ message: "Kategori dihapus" });
});

// 5. Auth & User Profile
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await db.User.findOne({ where: { email } });
    if (user && user.password_hash === password) {
        res.json({ id: user.id, name: user.full_name, email: user.email, role: user.role });
    } else {
        res.status(401).json({ message: "Email atau password salah" });
    }
});

app.put('/api/users/:id', async (req, res) => {
  try {
    const { full_name, password } = req.body;
    await db.User.update(
      { full_name, password_hash: password },
      { where: { id: req.params.id } }
    );
    res.json({ message: "Profil berhasil diupdate" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 6. Transaksi
app.post('/api/transactions', async (req, res) => {
  const t = await db.sequelize.transaction();
  try {
    const { user_id, items } = req.body;
    const total_amount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const trxNumber = `TRX-${Date.now()}`;

    const newTrx = await db.Transaction.create({
      user_id, transaction_number: trxNumber, total_amount
    }, { transaction: t });

    const orderItemsData = items.map(item => ({
      transaction_id: newTrx.id,
      book_id: item.isbn,
      quantity: item.quantity,
      price_at_purchase: item.price,
      subtotal: item.price * item.quantity
    }));

    await db.OrderItem.bulkCreate(orderItemsData, { transaction: t });
    await t.commit();
    res.status(201).json({ message: "Transaksi Berhasil", transaction: newTrx });
  } catch (err) {
    await t.rollback();
    res.status(500).json({ error: "Gagal memproses transaksi" });
  }
});

app.get('/api/transactions', async (req, res) => {
  try {
    const { user_id } = req.query;
    if (!user_id) return res.status(400).json({ error: "User ID diperlukan" });

    const transactions = await db.Transaction.findAll({
      where: { user_id },
      include: [{ model: db.OrderItem, include: [db.Book] }],
      order: [['createdAt', 'DESC']]
    });
    
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- SERVER STARTUP ---
module.exports = app;

if (require.main === module) {
  db.sequelize.sync({ force: false }).then(() => {
    console.log("Database connected.");
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`Docs available at http://localhost:${PORT}/api-docs`);
    });
  }).catch(err => console.log("DB Error: " + err));
}