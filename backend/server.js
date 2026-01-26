const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// 🔗 MongoDB Connection
mongoose.connect(
  'mongodb+srv://mypharma:mypharma123@cluster0.wkza7si.mongodb.net/mypharma'
)
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// ==========================================
// 📊 MODELS
// ==========================================

// 💊 Medicine Model
const medicineSchema = new mongoose.Schema({
  name: String,
  price: Number,
  stock: String
});
const Medicine = mongoose.model('Medicine', medicineSchema);

// 🛒 Cart Model
const cartSchema = new mongoose.Schema({
  name: String,
  price: Number
});
const Cart = mongoose.model('Cart', cartSchema);

// 📦 Order Model
const orderSchema = new mongoose.Schema({
  customer: Object, // Stores name, address, etc. from checkout form
  items: Array,
  total: Number,
  createdAt: { type: Date, default: Date.now }
});
const Order = mongoose.model('Order', orderSchema);

// 👤 User Model
const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true }
});
const User = mongoose.model('User', userSchema);

// ==========================================
// 🛣️ USER & AUTH ROUTES
// ==========================================

// Get all users (used by Angular Login to find matching credentials)
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// ==========================================
// 🛣️ MEDICINE ROUTES
// ==========================================

app.get('/api/medicines', async (req, res) => {
  try {
    const medicines = await Medicine.find();
    res.json(medicines);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching medicines' });
  }
});

app.post('/api/medicines', async (req, res) => {
  try {
    const medicine = new Medicine(req.body);
    await medicine.save();
    res.json({ message: 'Medicine added successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to add medicine' });
  }
});

app.delete('/api/medicines/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Medicine.findByIdAndDelete(id);
    res.json({ message: 'Medicine deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete medicine' });
  }
});

// ==========================================
// 🛣️ CART ROUTES
// ==========================================

app.post('/api/cart', async (req, res) => {
  try {
    const item = new Cart(req.body);
    await item.save();
    res.json({ message: 'Item added to cart' });
  } catch (err) {
    res.status(500).json({ message: 'Error adding to cart' });
  }
});

app.get('/api/cart', async (req, res) => {
  try {
    const items = await Cart.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching cart' });
  }
});

app.delete('/api/cart', async (req, res) => {
  try {
    await Cart.deleteMany({});
    res.json({ message: 'Cart cleared' });
  } catch (err) {
    res.status(500).json({ message: 'Error clearing cart' });
  }
});

// ==========================================
// 🛣️ ORDER ROUTES
// ==========================================

app.post('/api/orders', async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.json({ message: 'Order saved' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to save order' });
  }
});

app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching orders' });
  }
});

// ==========================================
// 🛠️ MAINTENANCE ROUTES
// ==========================================

app.get('/', (req, res) => {
  res.send('MyPharma backend is running on Port 3000');
});

// 🟢 SEED ROUTE (Run once to create test user and medicines)
app.get('/seed-db', async (req, res) => {
  try {
    await Medicine.deleteMany({}); 
    await User.deleteMany({}); 
    
    await Medicine.create([
      { name: 'Dolo 650', price: 30, stock: '500 strips' },
      { name: 'Vitamin C', price: 45, stock: '200 bottles' },
      { name: 'Paracetamol', price: 100, stock: 'In Stock' }
    ]);

    await User.create({ email: 'new123@gmail.com', password: 'password123' });

    res.send('<h1>✅ Database Seeded!</h1><p>Test User: new123@gmail.com | Password: password123</p><p><a href="http://localhost:4200/login">Go to Login</a></p>');
  } catch (err) {
    res.status(500).send('Error seeding DB: ' + err.message);
  }
});

// 🚀 Start server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});