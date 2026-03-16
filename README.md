# 🏥 MyPharma — Online Pharmacy Management System

A full-stack web application for managing an online pharmacy.  
Built as a **DBMS Course Project** using the MEAN stack with MySQL.

---

## 👥 Team Members
>Nileshkumar_Kori Varad_Jadhav Palak_Rathod Suresh_Choudhary

---

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Angular 17 |
| Backend | Node.js + Express |
| Database | MySQL |
| Styling | CSS |

---

## ✨ Features

### 👤 User
- Register & Login with password hashing
- Browse all medicines with category & stock info
- Add medicines to cart (user-specific)
- Checkout with shipping details
- View order history with status tracking

### 🔐 Admin
- Secure admin login
- Dashboard with live stats (revenue, orders, low stock)
- Add, Edit, Delete medicines
- Manage orders and update status (Pending / Processing / Delivered / Cancelled)
- Low stock & expiry date alerts

### 🗄️ Database (MySQL)
- 5 normalized tables with FK constraints
- 2 Triggers (stock decrement, stock validation)
- 3 Views (low stock, expiring soon, order summary)
- 1 Stored Procedure with Transaction (PlaceOrder)
- Indexes, CHECK constraints, ENUM types

---

## 📁 Project Structure

```
mypharma/
├── backend/
│   ├── server.js          # Express API server
│   └── package.json
├── src/
│   └── app/
│       ├── pages/         # Angular components
│       │   ├── home/
│       │   ├── medicines/
│       │   ├── cart/
│       │   ├── checkout/
│       │   ├── login/
│       │   ├── register/
│       │   ├── order-history/
│       │   ├── order-success/
│       │   └── admin/
│       │       ├── admin-login/
│       │       ├── admin-dashboard/
│       │       ├── admin-medicines/
│       │       └── admin-orders/
│       └── services/      # Angular services
│           ├── auth.ts
│           ├── medicine.ts
│           └── cart.ts
├── sql codes/
│   ├── phase1.sql         # Complete DB setup (schema + data + triggers + views + procedure)
│   └── queries.sql        # Demo queries (JOINs, aggregations, views, procedure test)
└── README.md
```

---

## ⚙️ Prerequisites

Make sure these are installed on your laptop:

| Software | Version | Download |
|---|---|---|
| Node.js | v18+ | https://nodejs.org |
| Angular CLI | Latest | `npm install -g @angular/cli` |
| MySQL | 8.0+ | https://dev.mysql.com/downloads/ |
| MySQL Workbench | Latest | https://dev.mysql.com/downloads/workbench/ |

---

## 🚀 How to Run — Step by Step

### Step 1: Clone the Repository

```bash
git clone https://github.com/nileshkumar240197/mypharma.git
cd mypharma
```

---

### Step 2: Set Up MySQL Database

1. Open **MySQL Workbench**
2. Connect to your local MySQL server
3. Go to **File → Open SQL Script**
4. Open `sql codes/phase1.sql`
5. Press **Ctrl + Shift + Enter** to run everything

This single file will:
- ✅ Create the `mypharma` database
- ✅ Create all 5 tables with constraints and indexes
- ✅ Insert sample data (users, medicines, orders)
- ✅ Create 2 triggers
- ✅ Create 3 views
- ✅ Create the PlaceOrder stored procedure

---

### Step 3: Configure Backend

Open `backend/server.js` and update the MySQL connection with **your** credentials:

```javascript
const db = mysql.createConnection({
  host:     'localhost',
  user:     'root',
  password: 'YOUR_MYSQL_PASSWORD',  // ← Change this to your password
  database: 'mypharma'
});
```

---

### Step 4: Start Backend Server

Open a terminal and run:

```bash
cd backend
npm install
node server.js
```

✅ You should see:
```
Server running on http://localhost:3000
MySQL connected successfully ✅
```

⚠️ **Keep this terminal open!**

---

### Step 5: Hash Sample Passwords

After backend starts, open browser and visit:

```
http://localhost:3000/seed-passwords
```

You should see: **✅ Passwords hashed successfully!**

---

### Step 6: Start Frontend

Open a **second terminal** (keep backend running) and run:

```bash
npm install
ng serve
```

✅ You should see:
```
Application bundle generation complete.
➜  Local: http://localhost:4200/
```

---

### Step 7: Open the App

| URL | Purpose |
|---|---|
| http://localhost:4200 | User app |
| http://localhost:4200/admin-login | Admin panel |

---

## 🔑 Test Credentials

### User Accounts
| Name | Email | Password |
|---|---|---|
| Nilesh Kumar | nilesh@gmail.com | nilesh123 |
| Sonali Kori | sonali@gmail.com | sonali123 |

### Admin Account
| Email | Password |
|---|---|
| admin@mypharma.com | admin123 |

---

## 🗄️ Database Schema

```
users         (id, name, email, password, role, contact)
medicines     (id, name, category, price, stock, expiry_date, description)
cart          (id, user_id, medicine_id, quantity)
orders        (id, user_id, total_amount, status, created_at)
order_items   (id, order_id, medicine_id, quantity, price_at_time)
```

---

## 🔍 Key SQL Features

### Triggers
```sql
-- Auto-decrements stock when order is placed
TRIGGER trg_decrement_stock

-- Prevents order if stock is insufficient
TRIGGER trg_check_stock
```

### Views
```sql
-- Medicines with stock < 10
SELECT * FROM low_stock_view;

-- Medicines expiring within 30 days
SELECT * FROM expiring_soon_view;

-- Orders with full customer details
SELECT * FROM order_summary_view;
```

### Stored Procedure with Transaction
```sql
-- Place an order (handles stock check + insert + commit atomically)
CALL PlaceOrder(1, 2, 1, 45.00, @order_id, @msg);
SELECT @order_id AS new_order_id, @msg AS message;
```

### Demo Queries (`queries.sql`)
```sql
-- 1. Multi-table JOIN (4 tables): Full order details
-- 2. Aggregation: Total revenue per customer
-- 3. Top selling medicines by quantity
-- 4. Low stock view
-- 5. Expiring soon view
-- 6. Order summary view
-- 7. Stored procedure test
-- 8. Trigger test (stock before and after)
```

To run demo queries:
1. Open MySQL Workbench
2. Open `sql codes/queries.sql`
3. Run each query individually to see results

---

## 📊 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | /api/register | Register user |
| POST | /api/login | Login user/admin |
| GET | /api/medicines | Get all medicines |
| POST | /api/medicines | Add medicine |
| PUT | /api/medicines/:id | Edit medicine |
| DELETE | /api/medicines/:id | Delete medicine |
| GET | /api/cart/:user_id | Get user cart |
| POST | /api/cart | Add to cart |
| DELETE | /api/cart/clear/:user_id | Clear cart |
| DELETE | /api/cart/:user_id/:medicine_id | Remove item |
| POST | /api/orders | Place order |
| GET | /api/orders | Get all orders (admin) |
| GET | /api/orders/user/:id | Get user orders |
| PUT | /api/orders/:id | Update order status |
| GET | /api/admin/stats | Dashboard stats |

---

## ⚠️ Common Issues

**Backend not connecting to MySQL?**
- Make sure MySQL service is running
- Check your password in `backend/server.js`
- Make sure `mypharma` database was created by running `phase1.sql`

**`ng serve` not working?**
- Run `npm install` first in root folder
- Make sure Angular CLI is installed: `npm install -g @angular/cli`

**Medicines not showing?**
- Make sure backend is running on port 3000
- Visit `http://localhost:3000/api/medicines` to verify

**Port already in use?**
```bash
npx kill-port 3000
```

**Passwords not working after fresh DB setup?**
- Visit `http://localhost:3000/seed-passwords` after starting backend

---

## 👨‍💻 Developer

**Nilesh Kumar** — DBMS Course Project 2025–26
