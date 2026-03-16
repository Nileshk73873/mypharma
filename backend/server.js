const express = require('express');
const cors    = require('cors');
const mysql   = require('mysql2');
const bcrypt  = require('bcryptjs');

const app = express();
app.use(cors());
app.use(express.json());

// ==========================================
// 🔗 MySQL Connection
// ==========================================
const db = mysql.createConnection({
  host:     'localhost',
  user:     'root',
  password: 'Nilesh@73873',
  database: 'mypharma'
});

db.connect(err => {
  if (err) {
    console.error('MySQL connection failed:', err);
  } else {
    console.log('MySQL connected successfully ✅');
  }
});

// ==========================================
// 🛠️ HELPER — Clean date format
// Converts "2026-11-30T18:30:00.000Z" → "2026-11-30"
// Returns null if empty
// ==========================================
function cleanDate(dateStr) {
  if (!dateStr || dateStr === '') return null;
  return dateStr.split('T')[0];
}

// ==========================================
// 👤 AUTH ROUTES — Register & Login
// ==========================================

// REGISTER
app.post('/api/register', async (req, res) => {
  const { name, email, password, contact } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email and password are required' });
  }

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, result) => {
    if (err) return res.status(500).json({ message: 'Database error' });

    if (result.length > 0) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = 'INSERT INTO users (name, email, password, role, contact) VALUES (?, ?, ?, "user", ?)';

    db.query(sql, [name, email, hashedPassword, contact || null], (err) => {
      if (err) return res.status(500).json({ message: 'Failed to register user' });
      res.json({ message: 'Registration successful' });
    });
  });
});

// LOGIN
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, result) => {
    if (err) return res.status(500).json({ message: 'Database error' });

    if (result.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user    = result[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      message: 'Login successful',
      user: {
        id:    user.id,
        name:  user.name,
        email: user.email,
        role:  user.role
      }
    });
  });
});

// ==========================================
// 💊 MEDICINE ROUTES
// ==========================================

// GET all medicines
app.get('/api/medicines', (req, res) => {
  db.query('SELECT * FROM medicines', (err, result) => {
    if (err) return res.status(500).json({ message: 'Error fetching medicines' });
    res.json(result);
  });
});

// ADD medicine
app.post('/api/medicines', (req, res) => {
  const { name, category, price, stock, expiry_date, description } = req.body;

  if (!name || !price || stock === undefined) {
    return res.status(400).json({ message: 'Name, price and stock are required' });
  }

  const sql = `INSERT INTO medicines 
    (name, category, price, stock, expiry_date, description) 
    VALUES (?, ?, ?, ?, ?, ?)`;

  db.query(sql, [
    name,
    category    || null,
    price,
    stock,
    cleanDate(expiry_date),   // ← fixed
    description || null
  ], (err) => {
    if (err) {
      console.error('Add medicine error:', err);
      return res.status(500).json({ message: 'Failed to add medicine' });
    }
    res.json({ message: 'Medicine added successfully' });
  });
});

// EDIT medicine
app.put('/api/medicines/:id', (req, res) => {
  const { id } = req.params;
  const { name, category, price, stock, expiry_date, description } = req.body;

  const sql = `UPDATE medicines 
    SET name=?, category=?, price=?, stock=?, expiry_date=?, description=? 
    WHERE id=?`;

  db.query(sql, [
    name,
    category    || null,
    price,
    stock,
    cleanDate(expiry_date),   // ← fixed
    description || null,
    id
  ], (err) => {
    if (err) {
      console.error('Update medicine error:', err);
      return res.status(500).json({ message: 'Failed to update medicine' });
    }
    res.json({ message: 'Medicine updated successfully' });
  });
});

// DELETE medicine
app.delete('/api/medicines/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM medicines WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).json({ message: 'Failed to delete medicine' });
    res.json({ message: 'Medicine deleted successfully' });
  });
});

// ==========================================
// 🛒 CART ROUTES
// ==========================================

// GET cart for a specific user
app.get('/api/cart/:user_id', (req, res) => {
  const { user_id } = req.params;

  const sql = `
    SELECT cart.id, medicines.name, medicines.price, medicines.stock,
           cart.quantity, cart.medicine_id
    FROM cart
    JOIN medicines ON cart.medicine_id = medicines.id
    WHERE cart.user_id = ?`;

  db.query(sql, [user_id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Error fetching cart' });
    res.json(result);
  });
});

// ADD item to cart
app.post('/api/cart', (req, res) => {
  const { user_id, medicine_id, quantity } = req.body;

  if (!user_id || !medicine_id) {
    return res.status(400).json({ message: 'user_id and medicine_id are required' });
  }

  const checkSql = 'SELECT * FROM cart WHERE user_id = ? AND medicine_id = ?';
  db.query(checkSql, [user_id, medicine_id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Error checking cart' });

    if (result.length > 0) {
      const updateSql = 'UPDATE cart SET quantity = quantity + ? WHERE user_id = ? AND medicine_id = ?';
      db.query(updateSql, [quantity || 1, user_id, medicine_id], (err) => {
        if (err) return res.status(500).json({ message: 'Error updating cart' });
        res.json({ message: 'Cart updated' });
      });
    } else {
      const insertSql = 'INSERT INTO cart (user_id, medicine_id, quantity) VALUES (?, ?, ?)';
      db.query(insertSql, [user_id, medicine_id, quantity || 1], (err) => {
        if (err) return res.status(500).json({ message: 'Error adding to cart' });
        res.json({ message: 'Item added to cart' });
      });
    }
  });
});

// REMOVE single item from cart
app.delete('/api/cart/:user_id/:medicine_id', (req, res) => {
  const { user_id, medicine_id } = req.params;
  db.query('DELETE FROM cart WHERE user_id = ? AND medicine_id = ?', [user_id, medicine_id], (err) => {
    if (err) return res.status(500).json({ message: 'Error removing from cart' });
    res.json({ message: 'Item removed from cart' });
  });
});

// ✅ CLEAR must come BEFORE /:user_id/:medicine_id
// ✅ New URL — no conflict possible
app.delete('/api/cart-clear/:user_id', (req, res) => {
  const { user_id } = req.params;
  db.query('DELETE FROM cart WHERE user_id = ?', [user_id], (err) => {
    if (err) return res.status(500).json({ message: 'Error clearing cart' });
    res.json({ message: 'Cart cleared' });
  });
});
// This comes AFTER
app.delete('/api/cart/:user_id/:medicine_id', (req, res) => {
  const { user_id, medicine_id } = req.params;
  db.query('DELETE FROM cart WHERE user_id = ? AND medicine_id = ?', [user_id, medicine_id], (err) => {
    if (err) return res.status(500).json({ message: 'Error removing from cart' });
    res.json({ message: 'Item removed from cart' });
  });
});
// ==========================================
// 📦 ORDER ROUTES
// ==========================================

// PLACE ORDER
app.post('/api/orders', (req, res) => {
  const { user_id, items, total_amount } = req.body;

  if (!user_id || !items || items.length === 0) {
    return res.status(400).json({ message: 'Invalid order data' });
  }

  const orderSql = 'INSERT INTO orders (user_id, total_amount, status) VALUES (?, ?, "Pending")';
  db.query(orderSql, [user_id, total_amount], (err, result) => {
    if (err) {
      console.error('Place order error:', err);
      return res.status(500).json({ message: 'Failed to create order' });
    }

    const order_id   = result.insertId;
    const itemValues = items.map(item => [order_id, item.medicine_id, item.quantity, item.price_at_time]);
    const itemSql    = 'INSERT INTO order_items (order_id, medicine_id, quantity, price_at_time) VALUES ?';

    db.query(itemSql, [itemValues], (err) => {
      if (err) {
        console.error('Order items error:', err);
        return res.status(500).json({ message: 'Failed to save order items' });
      }

      db.query('DELETE FROM cart WHERE user_id = ?', [user_id], (err) => {
        if (err) return res.status(500).json({ message: 'Order placed but cart not cleared' });
        res.json({ message: 'Order placed successfully', order_id });
      });
    });
  });
});

// GET all orders (admin)
app.get('/api/orders', (req, res) => {
  const sql = `
    SELECT o.id, u.name AS customer, u.email,
           o.total_amount, o.status, o.created_at
    FROM orders o
    JOIN users u ON o.user_id = u.id
    ORDER BY o.created_at DESC`;

  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ message: 'Error fetching orders' });
    res.json(result);
  });
});

// GET order history for a user
app.get('/api/orders/user/:user_id', (req, res) => {
  const { user_id } = req.params;

  const sql = `
    SELECT o.id AS order_id, o.total_amount, o.status, o.created_at,
           m.name AS medicine, oi.quantity, oi.price_at_time
    FROM orders o
    JOIN order_items oi ON oi.order_id    = o.id
    JOIN medicines   m  ON oi.medicine_id = m.id
    WHERE o.user_id = ?
    ORDER BY o.created_at DESC`;

  db.query(sql, [user_id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Error fetching order history' });
    res.json(result);
  });
});

// UPDATE order status (admin)
app.put('/api/orders/:id', (req, res) => {
  const { id }     = req.params;
  const { status } = req.body;

  db.query('UPDATE orders SET status = ? WHERE id = ?', [status, id], (err) => {
    if (err) return res.status(500).json({ message: 'Failed to update order status' });
    res.json({ message: 'Order status updated' });
  });
});

// ==========================================
// 📊 ADMIN DASHBOARD STATS
// ==========================================
app.get('/api/admin/stats', (req, res) => {
  const stats = {};

  db.query("SELECT SUM(total_amount) AS revenue FROM orders WHERE status='Delivered'", (err, r1) => {
    stats.revenue = r1[0].revenue || 0;

    db.query("SELECT COUNT(*) AS total FROM orders", (err, r2) => {
      stats.totalOrders = r2[0].total;

      db.query("SELECT COUNT(*) AS pending FROM orders WHERE status='Pending'", (err, r3) => {
        stats.pendingOrders = r3[0].pending;

        db.query("SELECT COUNT(*) AS lowStock FROM medicines WHERE stock < 10", (err, r4) => {
          stats.lowStock = r4[0].lowStock;

          db.query("SELECT COUNT(*) AS total FROM medicines", (err, r5) => {
            stats.totalMedicines = r5[0].total;
            res.json(stats);
          });
        });
      });
    });
  });
});

// ==========================================
// 🌱 SEED — Hash passwords
// ==========================================
app.get('/seed-passwords', async (req, res) => {
  const users = [
    { email: 'nilesh@gmail.com',   password: 'nilesh123' },
    { email: 'sonali@gmail.com',   password: 'sonali123' },
    { email: 'admin@mypharma.com', password: 'admin123'  }
  ];

  for (const user of users) {
    const hashed = await bcrypt.hash(user.password, 10);
    db.query('UPDATE users SET password = ? WHERE email = ?', [hashed, user.email]);
  }

  res.send('<h2>✅ Passwords hashed successfully!</h2>');
});

// ==========================================
// 🚀 START SERVER
// ==========================================
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});