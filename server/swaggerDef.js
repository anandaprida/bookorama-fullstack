const swaggerDef = {
  openapi: '3.0.0',
  info: {
    title: 'Bookorama API',
    version: '1.0.0',
    description: 'Dokumentasi API untuk E-Commerce Bookorama (Fullstack)',
  },
  servers: [
    {
      url: 'http://localhost:5001',
      description: 'Development Server',
    },
  ],
  components: {
    securitySchemes: {
      // Jika nanti pakai JWT, aktifkan ini
      // bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' } 
    },
    schemas: {
      Book: {
        type: 'object',
        properties: {
          isbn: { type: 'string', example: '978-1' },
          title: { type: 'string', example: 'Laskar Pelangi' },
          author: { type: 'string', example: 'Andrea Hirata' },
          price: { type: 'number', example: 85000 },
          category_id: { type: 'integer', example: 1 },
          image_url: { type: 'string', example: 'https://example.com/cover.jpg' }
        }
      },
      Category: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          name: { type: 'string', example: 'Fiksi' }
        }
      },
      LoginRequest: {
        type: 'object',
        properties: {
          email: { type: 'string', example: 'admin@bookorama.com' },
          password: { type: 'string', example: 'admin123' }
        }
      },
      TransactionRequest: {
        type: 'object',
        properties: {
          user_id: { type: 'integer', example: 2 },
          items: { 
            type: 'array',
            items: {
              type: 'object',
              properties: {
                isbn: { type: 'string', example: '978-1' },
                price: { type: 'number', example: 85000 },
                quantity: { type: 'integer', example: 1 }
              }
            }
          }
        }
      }
    }
  },
  paths: {
    '/api/auth/login': {
      post: {
        summary: 'Login User/Admin',
        tags: ['Auth'],
        requestBody: {
          content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginRequest' } } }
        },
        responses: {
          200: { description: 'Login Berhasil' },
          401: { description: 'Password Salah' }
        }
      }
    },
    '/api/books': {
      get: {
        summary: 'Ambil Semua Buku',
        tags: ['Books'],
        responses: {
          200: { description: 'List semua buku', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Book' } } } } }
        }
      },
      post: {
        summary: 'Tambah Buku Baru',
        tags: ['Books'],
        requestBody: {
          content: { 'application/json': { schema: { $ref: '#/components/schemas/Book' } } }
        },
        responses: { 201: { description: 'Buku dibuat' } }
      }
    },
    '/api/books/{isbn}': {
      delete: {
        summary: 'Hapus Buku',
        tags: ['Books'],
        parameters: [{ name: 'isbn', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Terhapus' } }
      }
    },
    '/api/categories': {
      get: {
        summary: 'Ambil Semua Kategori',
        tags: ['Categories'],
        responses: { 200: { description: 'List Kategori' } }
      },
      post: {
        summary: 'Tambah Kategori',
        tags: ['Categories'],
        requestBody: { content: { 'application/json': { schema: { type: 'object', properties: { name: { type: 'string' } } } } } },
        responses: { 200: { description: 'Kategori dibuat' } }
      }
    },
    '/api/categories/{id}': {
      delete: {
        summary: 'Hapus Kategori',
        tags: ['Categories'],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Terhapus' } }
      }
    },
    '/api/users/{id}': {
      put: {
        summary: 'Update Profil User',
        tags: ['Users'],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        requestBody: { content: { 'application/json': { schema: { type: 'object', properties: { full_name: { type: 'string' }, password: { type: 'string' } } } } } },
        responses: { 200: { description: 'Profil Diupdate' } }
      }
    },
    '/api/transactions': {
      get: {
        summary: 'Lihat Riwayat Transaksi',
        tags: ['Transactions'],
        parameters: [{ name: 'user_id', in: 'query', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'History Transaksi' } }
      },
      post: {
        summary: 'Checkout / Buat Pesanan Baru',
        tags: ['Transactions'],
        requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/TransactionRequest' } } } },
        responses: { 201: { description: 'Transaksi Sukses' } }
      }
    }
  }
};

module.exports = swaggerDef;