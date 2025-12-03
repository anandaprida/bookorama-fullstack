import React, { useState, useEffect, createContext, useContext } from 'react';
import { ShoppingCart, User, BookOpen, LogOut, Package, Plus, Trash2, Home, LayoutDashboard, List, Image as ImageIcon, ArrowLeft, Clock, Settings, Save } from 'lucide-react';

// --- PERBAIKAN DI SINI ---
// Sekarang kode akan mengecek:
// 1. Apakah ada settingan VITE_API_URL di Vercel? Kalau ada, pakai itu.
// 2. Kalau tidak ada (di laptop), pakai localhost.
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const AuthContext = createContext(null);
const CartContext = createContext(null);

// --- 1. Login Page ---
const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('budi@gmail.com');
  const [password, setPassword] = useState('user123');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // Debugging: Cek ke mana frontend menembak
      console.log("Mencoba login ke:", `${API_URL}/auth/login`);
      
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) login(data); else setError(data.message);
    } catch (err) { 
      console.error(err);
      setError('Gagal koneksi server. Cek console untuk detail.'); 
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-indigo-600 mb-6 text-center">Bookorama Login</h1>
        {error && <div className="bg-red-100 text-red-700 p-2 mb-4 rounded text-sm text-center">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-2 border rounded" placeholder="Email" required />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-2 border rounded" placeholder="Password" required />
          <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700">Masuk</button>
        </form>
        <p className="text-xs text-gray-400 mt-4 text-center">Gunakan admin@bookorama.com / admin123 untuk Admin</p>
      </div>
    </div>
  );
};

// --- 2. Customer: Book List ---
const BookList = ({ onSelectBook }) => {
  const { addToCart } = useContext(CartContext);
  const [books, setBooks] = useState([]);

  useEffect(() => { fetch(`${API_URL}/books`).then(res => res.json()).then(setBooks); }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {books.map((book) => (
        <div key={book.isbn} onClick={() => onSelectBook(book)} className="bg-white rounded-lg shadow overflow-hidden flex flex-col group hover:shadow-xl transition cursor-pointer">
          <div className="h-48 sm:h-64 bg-gray-200 overflow-hidden relative">
            {book.image_url ? (
              <img src={book.image_url} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400"><BookOpen size={48} /></div>
            )}
          </div>
          <div className="p-4 flex-1 flex flex-col">
            <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">{book.Category ? book.Category.name : 'Umum'}</span>
            <h3 className="text-lg font-bold text-gray-900 mt-1 line-clamp-2">{book.title}</h3>
            <p className="text-sm text-gray-600">{book.author}</p>
            <div className="mt-auto pt-4 flex items-center justify-between">
              <span className="text-lg font-bold text-gray-900">Rp {parseInt(book.price).toLocaleString('id-ID')}</span>
              <button onClick={(e) => { e.stopPropagation(); addToCart(book); }} className="bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 shadow-md">
                <ShoppingCart size={18} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// --- 3. Customer: Book Detail ---
const BookDetail = ({ book, onBack }) => {
  const { addToCart } = useContext(CartContext);
  if (!book) return null;

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-4xl mx-auto">
      <div className="md:flex">
        <div className="md:w-1/3 h-64 md:h-96 bg-gray-200 relative">
           {book.image_url ? 
             <img src={book.image_url} className="w-full h-full object-cover" /> : 
             <div className="w-full h-full flex items-center justify-center text-gray-400"><BookOpen size={64}/></div>
           }
        </div>
        <div className="p-6 md:p-8 md:w-2/3 flex flex-col">
          <button onClick={onBack} className="self-start flex items-center text-gray-500 hover:text-gray-800 mb-4">
            <ArrowLeft size={16} className="mr-1"/> Kembali
          </button>
          <div className="uppercase tracking-wide text-sm text-indigo-600 font-bold">{book.Category?.name || 'Umum'}</div>
          <h1 className="mt-1 text-2xl md:text-3xl font-bold text-gray-900">{book.title}</h1>
          <p className="text-gray-600 text-lg mt-2">{book.author}</p>
          <div className="mt-4 text-gray-500 text-sm md:text-base">
            <p>ISBN: <span className="font-mono">{book.isbn}</span></p>
            <p className="mt-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
          </div>
          <div className="mt-auto pt-6 flex items-center justify-between border-t">
            <span className="text-2xl md:text-3xl font-bold text-gray-900">Rp {parseInt(book.price).toLocaleString('id-ID')}</span>
            <button onClick={() => { addToCart(book); alert('Masuk keranjang!'); }} className="bg-indigo-600 text-white px-4 md:px-8 py-2 md:py-3 rounded-lg hover:bg-indigo-700 font-bold flex items-center gap-2 text-sm md:text-base">
              <ShoppingCart size={20} /> <span className="hidden sm:inline">Masukkan Keranjang</span> <span className="sm:hidden">Beli</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- 4. Customer: Order History ---
const OrderHistory = ({ user }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/transactions?user_id=${user.id}`)
      .then(res => res.json())
      .then(data => { setOrders(data); setLoading(false); });
  }, [user]);

  if (loading) return <div className="text-center p-10">Memuat riwayat...</div>;
  if (orders.length === 0) return <div className="text-center p-10 text-gray-500">Belum ada riwayat belanja.</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-4 md:space-y-6">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><Clock /> Riwayat Pesanan</h2>
      {orders.map(order => (
        <div key={order.id} className="bg-white rounded-lg shadow overflow-hidden border border-gray-100">
          <div className="bg-gray-50 p-3 md:p-4 flex justify-between items-center border-b">
            <div>
              <div className="font-mono text-sm text-gray-500">{order.transaction_number}</div>
              <div className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString('id-ID', { dateStyle: 'full' })}</div>
            </div>
            <div className="text-right">
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-bold">{order.status}</span>
              <div className="font-bold text-base md:text-lg mt-1">Rp {parseInt(order.total_amount).toLocaleString('id-ID')}</div>
            </div>
          </div>
          <div className="p-3 md:p-4">
            {order.OrderItems && order.OrderItems.map(item => (
              <div key={item.id} className="flex justify-between py-2 border-b last:border-0 border-gray-50 text-sm">
                <span className="flex-1 line-clamp-1 mr-2">{item.Book ? item.Book.title : 'Buku dihapus'} <span className="text-gray-400">x{item.quantity}</span></span>
                <span className="font-medium text-gray-600 whitespace-nowrap">Rp {parseInt(item.subtotal).toLocaleString('id-ID')}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

// --- 5. Customer: Profile Page ---
const ProfilePage = ({ user }) => {
  const [formData, setFormData] = useState({ full_name: user.name, password: '' });
  
  const handleUpdate = async (e) => {
    e.preventDefault();
    if(!formData.password) return alert("Masukkan password untuk konfirmasi/ubah.");
    
    const res = await fetch(`${API_URL}/users/${user.id}`, {
      method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(formData)
    });
    
    if(res.ok) {
      alert("Profil berhasil diupdate! Silakan login ulang.");
      window.location.reload();
    } else {
      alert("Gagal update profil");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Settings /> Edit Profil</h2>
      <form onSubmit={handleUpdate} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
          <input className="w-full p-2 border rounded mt-1" value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Password (Baru/Lama)</label>
          <input className="w-full p-2 border rounded mt-1" type="password" placeholder="***" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
          <p className="text-xs text-gray-500 mt-1">Wajib diisi untuk menyimpan perubahan.</p>
        </div>
        <button className="w-full bg-indigo-600 text-white py-2 rounded font-bold hover:bg-indigo-700 flex justify-center gap-2">
          <Save size={18} /> Simpan Perubahan
        </button>
      </form>
    </div>
  )
}

// --- Admin Components ---
const AdminBooks = () => {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ isbn: '', title: '', author: '', price: '', category_id: '', image_url: '' });

  const loadData = () => {
    fetch(`${API_URL}/books`).then(res => res.json()).then(setBooks);
    fetch(`${API_URL}/categories`).then(res => res.json()).then(setCategories);
  };
  useEffect(() => { loadData(); }, []);

  const handleDelete = async (isbn) => { if (confirm('Hapus buku ini?')) { await fetch(`${API_URL}/books/${isbn}`, { method: 'DELETE' }); loadData(); }};
  const handleAdd = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API_URL}/books`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
    if (res.ok) { setIsAdding(false); setFormData({ isbn: '', title: '', author: '', price: '', category_id: '', image_url: '' }); loadData(); }
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 border-b flex justify-between bg-gray-50 font-bold text-gray-700">Manajemen Buku <button onClick={() => setIsAdding(!isAdding)} className="bg-indigo-600 text-white px-3 py-1 rounded text-xs"><Plus size={14} /> Tambah</button></div>
      {isAdding && (
        <form onSubmit={handleAdd} className="p-4 bg-gray-50 grid gap-2 sm:grid-cols-2 border-b">
          <input placeholder="ISBN" className="p-2 border rounded" value={formData.isbn} onChange={e => setFormData({...formData, isbn: e.target.value})} required />
          <input placeholder="Judul" className="p-2 border rounded" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
          <input placeholder="Penulis" className="p-2 border rounded" value={formData.author} onChange={e => setFormData({...formData, author: e.target.value})} required />
          <input placeholder="Harga" type="number" className="p-2 border rounded" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required />
          <select className="p-2 border rounded" value={formData.category_id} onChange={e => setFormData({...formData, category_id: e.target.value})} required>
            <option value="">Kategori...</option>{categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <input placeholder="URL Gambar" className="p-2 border rounded" value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} />
          <button className="col-span-2 bg-green-600 text-white py-2 rounded font-bold">Simpan</button>
        </form>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100"><tr><th className="p-3">Cover</th><th className="p-3">Info</th><th className="p-3">Harga</th><th className="p-3 text-right">Aksi</th></tr></thead>
          <tbody className="divide-y">{books.map(b => (
            <tr key={b.isbn}><td className="p-3">{b.image_url && <img src={b.image_url} className="w-8 h-10 object-cover rounded"/>}</td>
            <td className="p-3"><div className="font-bold line-clamp-1">{b.title}</div><div className="text-xs text-gray-500">{b.isbn}</div></td>
            <td className="p-3">Rp {parseInt(b.price).toLocaleString()}</td>
            <td className="p-3 text-right"><button onClick={() => handleDelete(b.isbn)} className="text-red-500"><Trash2 size={16}/></button></td></tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
};

const AdminCategories = () => {
  const [cats, setCats] = useState([]); const [name, setName] = useState('');
  const load = () => fetch(`${API_URL}/categories`).then(r => r.json()).then(setCats);
  useEffect(() => { load(); }, []);
  const add = async (e) => { e.preventDefault(); if(!name) return; await fetch(`${API_URL}/categories`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({name})}); setName(''); load(); };
  const del = async (id) => { if(confirm('Hapus?')) { await fetch(`${API_URL}/categories/${id}`, { method: 'DELETE' }); load(); }};
  return (
    <div className="bg-white rounded shadow max-w-xl mx-auto"><div className="p-4 bg-gray-50 font-bold border-b">Kategori</div>
      <form onSubmit={add} className="p-4 border-b flex gap-2"><input className="flex-1 border p-2 rounded" value={name} onChange={e=>setName(e.target.value)} placeholder="Nama Kategori"/><button className="bg-indigo-600 text-white px-4 rounded">Add</button></form>
      <ul className="divide-y">{cats.map(c=><li key={c.id} className="p-3 flex justify-between">{c.name} <button onClick={()=>del(c.id)} className="text-red-500"><Trash2 size={16}/></button></li>)}</ul>
    </div>
  )
};

// --- Nav Components ---
const Navbar = ({ user, setView, logout, cartCount }) => (
  <nav className="bg-indigo-600 text-white shadow sticky top-0 z-50">
    <div className="max-w-7xl mx-auto px-4 flex justify-between h-16 items-center">
      <div className="font-bold text-xl cursor-pointer flex items-center gap-2" onClick={() => setView('home')}>
        <BookOpen /> <span className="hidden sm:inline">Bookorama</span> <span className="sm:hidden">Bookorama</span>
      </div>
      <div className="hidden md:flex items-center gap-4">
        {user.role === 'Customer' ? (
          <>
            <button onClick={() => setView('home')} className="flex gap-1 hover:text-indigo-200"><Home size={18} /> Home</button>
            <button onClick={() => setView('orders')} className="flex gap-1 hover:text-indigo-200"><Clock size={18} /> History</button>
            <button onClick={() => setView('profile')} className="flex gap-1 hover:text-indigo-200"><User size={18} /> Profil</button>
            <button onClick={() => setView('cart')} className="flex gap-1 relative hover:text-indigo-200"><ShoppingCart size={18} /> {cartCount > 0 && <span className="bg-red-500 text-xs rounded-full px-1.5 absolute -top-2 -right-2">{cartCount}</span>}</button>
          </>
        ) : (
          <>
            <button onClick={() => setView('admin_books')} className="flex gap-1"><LayoutDashboard size={18}/> Buku</button>
            <button onClick={() => setView('admin_cats')} className="flex gap-1"><List size={18}/> Kategori</button>
          </>
        )}
        <button onClick={logout} className="ml-2 bg-red-500 p-1.5 rounded hover:bg-red-600 flex items-center gap-1 text-sm"><LogOut size={16}/> Logout</button>
      </div>
      <div className="md:hidden flex items-center">
         <button onClick={logout} className="bg-red-500 p-1.5 rounded hover:bg-red-600"><LogOut size={16}/></button>
      </div>
    </div>
  </nav>
);

const MobileBottomNav = ({ user, setView, cartCount }) => {
  if (user.role !== 'Customer') return null;
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-50 flex justify-around items-center h-16 text-gray-500">
      <button onClick={() => setView('home')} className="flex flex-col items-center justify-center w-full h-full hover:text-indigo-600 active:text-indigo-600"><Home size={20} /><span className="text-[10px] mt-1">Home</span></button>
      <button onClick={() => setView('orders')} className="flex flex-col items-center justify-center w-full h-full hover:text-indigo-600 active:text-indigo-600"><Clock size={20} /><span className="text-[10px] mt-1">History</span></button>
      <button onClick={() => setView('cart')} className="flex flex-col items-center justify-center w-full h-full hover:text-indigo-600 active:text-indigo-600 relative"><div className="relative"><ShoppingCart size={20} />{cartCount > 0 && <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 rounded-full">{cartCount}</span>}</div><span className="text-[10px] mt-1">Cart</span></button>
      <button onClick={() => setView('profile')} className="flex flex-col items-center justify-center w-full h-full hover:text-indigo-600 active:text-indigo-600"><User size={20} /><span className="text-[10px] mt-1">Profil</span></button>
    </div>
  );
};

const CartPage = () => {
  const { cart, removeFromCart, checkout } = useContext(CartContext);
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  if (!cart.length) return <div className="text-center py-10 text-gray-500">Keranjang Kosong</div>;
  return (
    <div className="bg-white rounded p-4 md:p-6 shadow max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Keranjang</h2>
      {cart.map(i => (
        <div key={i.isbn} className="flex justify-between border-b py-3 items-center">
          <div className="flex gap-3 items-center">{i.image_url && <img src={i.image_url} className="w-10 h-14 object-cover rounded"/>}
            <div><div className="font-bold line-clamp-1">{i.title}</div><div className="text-sm text-gray-500">{i.quantity} x Rp {parseInt(i.price).toLocaleString()}</div></div>
          </div>
          <button onClick={() => removeFromCart(i.isbn)} className="text-red-500"><Trash2 size={18}/></button>
        </div>
      ))}
      <div className="mt-4 flex justify-between pt-4 font-bold text-lg"><span>Total:</span> <span>Rp {total.toLocaleString('id-ID')}</span></div>
      <button onClick={checkout} className="w-full mt-4 bg-green-600 text-white py-3 rounded font-bold hover:bg-green-700">Checkout</button>
    </div>
  );
};

export default function App() {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [view, setView] = useState('home');
  const [selectedBook, setSelectedBook] = useState(null);

  const login = (u) => { setUser(u); setView(u.role === 'Admin' ? 'admin_books' : 'home'); };
  const logout = () => { setUser(null); setCart([]); setView('home'); setSelectedBook(null); };
  
  const addToCart = (bk) => setCart(p => { 
    const ex = p.find(i => i.isbn === bk.isbn);
    return ex ? p.map(i => i.isbn === bk.isbn ? {...i, quantity: i.quantity+1} : i) : [...p, {...bk, quantity: 1}];
  });
  const removeFromCart = (id) => setCart(p => p.filter(i => i.isbn !== id));
  
  const checkout = async () => {
    try {
      const res = await fetch(`${API_URL}/transactions`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ user_id: user.id, items: cart }) });
      if(res.ok) { alert("Transaksi Berhasil!"); setCart([]); setView('orders'); }
    } catch(e) { alert("Error"); }
  };

  if (!user) return <AuthContext.Provider value={{ login }}><LoginPage /></AuthContext.Provider>;

  const renderContent = () => {
    if (user.role === 'Admin') {
      if (view === 'admin_cats') return <AdminCategories />;
      return <AdminBooks />;
    }
    if (view === 'book_detail' && selectedBook) return <BookDetail book={selectedBook} onBack={() => setView('home')} />;
    if (view === 'cart') return <CartPage />;
    if (view === 'orders') return <OrderHistory user={user} />;
    if (view === 'profile') return <ProfilePage user={user} />;
    return <BookList onSelectBook={(book) => { setSelectedBook(book); setView('book_detail'); }} />;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <CartContext.Provider value={{ cart, addToCart, removeFromCart, checkout }}>
        <div className="min-h-screen bg-gray-100 font-sans text-gray-900 pb-20 md:pb-10">
          <Navbar user={user} setView={(v) => { setView(v); setSelectedBook(null); }} logout={logout} cartCount={cart.reduce((a,b)=>a+b.quantity,0)} />
          <main className="max-w-7xl mx-auto py-6 px-4">
            {renderContent()}
          </main>
          <MobileBottomNav user={user} setView={(v) => { setView(v); setSelectedBook(null); }} cartCount={cart.reduce((a,b)=>a+b.quantity,0)} />
        </div>
      </CartContext.Provider>
    </AuthContext.Provider>
  );
}