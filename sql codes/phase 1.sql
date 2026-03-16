-- ============================================
-- 🏥 MyPharma Database Schema
-- ============================================

-- Step 1: Create and select the database
CREATE DATABASE IF NOT EXISTS mypharma;
USE mypharma;

-- ============================================
-- TABLE 1: users
-- Stores both customers and admin
-- ============================================
CREATE TABLE users (
  id       INT AUTO_INCREMENT PRIMARY KEY,
  name     VARCHAR(100)  NOT NULL,
  email    VARCHAR(100)  NOT NULL UNIQUE,
  password VARCHAR(255)  NOT NULL,
  role     ENUM('user','admin') DEFAULT 'user',
  contact  VARCHAR(15)
);

-- ============================================
-- TABLE 2: medicines
-- Stock is INT (not string like before!)
-- ============================================
CREATE TABLE medicines (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  name         VARCHAR(100)   NOT NULL,
  category     VARCHAR(50),
  price        DECIMAL(10,2)  NOT NULL,
  stock        INT            NOT NULL DEFAULT 0,
  expiry_date  DATE,
  description  TEXT,

  CONSTRAINT chk_price CHECK (price > 0),
  CONSTRAINT chk_stock CHECK (stock >= 0)
);

-- ============================================
-- TABLE 3: cart
-- Each user has their OWN cart now
-- ============================================
CREATE TABLE cart (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  user_id     INT NOT NULL,
  medicine_id INT NOT NULL,
  quantity    INT NOT NULL DEFAULT 1,

  FOREIGN KEY (user_id)     REFERENCES users(id)     ON DELETE CASCADE,
  FOREIGN KEY (medicine_id) REFERENCES medicines(id) ON DELETE CASCADE
);

-- ============================================
-- TABLE 4: orders
-- Linked to a user via user_id (proper FK)
-- ============================================
CREATE TABLE orders (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  user_id      INT            NOT NULL,
  total_amount DECIMAL(10,2)  NOT NULL,
  status       ENUM('Pending','Processing','Delivered') DEFAULT 'Pending',
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================
-- TABLE 5: order_items
-- Replaces the wrong JSON.stringify approach!
-- Stores each medicine line in an order
-- ============================================
CREATE TABLE order_items (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  order_id       INT            NOT NULL,
  medicine_id    INT            NOT NULL,
  quantity       INT            NOT NULL,
  price_at_time  DECIMAL(10,2)  NOT NULL,

  FOREIGN KEY (order_id)    REFERENCES orders(id)    ON DELETE CASCADE,
  FOREIGN KEY (medicine_id) REFERENCES medicines(id) ON DELETE CASCADE
);

-- ============================================
-- INDEXES (speeds up frequent searches)
-- ============================================
CREATE INDEX idx_medicine_name ON medicines(name);
CREATE INDEX idx_orders_user   ON orders(user_id);
CREATE INDEX idx_cart_user     ON cart(user_id);


SHOW TABLES;


USE mypharma;

-- ============================================
-- Sample Users
-- (passwords are plain text for now,
--  we'll add proper hashing in backend)
-- ============================================
INSERT INTO users (name, email, password, role, contact) VALUES
('Nilesh Kumar',  'nilesh@gmail.com',  'nilesh123',  'user',  '9876543210'),
('Sonali Kori',   'sonali@gmail.com',  'sonali123',  'user',  '9123456780'),
('Admin User',    'admin@mypharma.com','admin123',   'admin', '9000000000');

-- ============================================
-- Sample Medicines
-- ============================================
INSERT INTO medicines (name, category, price, stock, expiry_date, description) VALUES
('Dolo 650',        'Painkiller',    30.00,  500, '2026-12-01', 'Used for fever and mild pain'),
('Vitamin C 500mg', 'Supplement',    45.00,  200, '2027-03-15', 'Boosts immunity'),
('Paracetamol',     'Painkiller',    20.00,  350, '2026-08-20', 'Common painkiller and fever reducer'),
('Azithromycin',    'Antibiotic',   120.00,  100, '2026-06-10', 'Antibiotic for infections'),
('Omeprazole',      'Antacid',       55.00,  180, '2027-01-25', 'Used for acidity and ulcers'),
('Cetirizine',      'Antiallergic',  30.00,  250, '2026-11-30', 'Antihistamine for allergies'),
('Metformin',       'Diabetes',      90.00,   80, '2026-09-15', 'Used in type 2 diabetes'),
('Aspirin',         'Painkiller',    25.00,    8, '2025-12-01', 'Blood thinner and painkiller'),
('Ibuprofen',       'Painkiller',    40.00,    5, '2025-11-15', 'Anti-inflammatory painkiller'),
('Cough Syrup',     'Cough & Cold',  85.00,  150, '2026-07-20', 'Relieves cough and cold symptoms');

-- ============================================
-- Sample Cart (for user id=1, Nilesh)
-- ============================================
INSERT INTO cart (user_id, medicine_id, quantity) VALUES
(1, 1, 2),
(1, 3, 1);

-- ============================================
-- Sample Orders
-- ============================================
INSERT INTO orders (user_id, total_amount, status) VALUES
(1, 80.00,  'Delivered'),
(1, 120.00, 'Processing'),
(2, 45.00,  'Pending');

-- ============================================
-- Sample Order Items
-- ============================================
INSERT INTO order_items (order_id, medicine_id, quantity, price_at_time) VALUES
(1, 1, 2, 30.00),  -- Order 1: 2x Dolo 650
(1, 3, 1, 20.00),  -- Order 1: 1x Paracetamol
(2, 4, 1, 120.00), -- Order 2: 1x Azithromycin
(3, 2, 1, 45.00);  -- Order 3: 1x Vitamin C



SELECT * FROM users;
SELECT * FROM medicines;
SELECT * FROM cart;
SELECT * FROM orders;
SELECT * FROM order_items;


SELECT 
  o.id          AS order_id,
  u.name        AS customer,
  m.name        AS medicine,
  oi.quantity,
  oi.price_at_time,
  o.status,
  o.created_at
FROM orders o
JOIN users       u  ON o.user_id      = u.id
JOIN order_items oi ON oi.order_id    = o.id
JOIN medicines   m  ON oi.medicine_id = m.id
ORDER BY o.id;


USE mypharma;

-- ============================================
-- TRIGGER 1: Auto-decrement stock when
-- a new order_item is inserted
-- ============================================
DELIMITER $$

CREATE TRIGGER trg_decrement_stock
AFTER INSERT ON order_items
FOR EACH ROW
BEGIN
  UPDATE medicines
  SET stock = stock - NEW.quantity
  WHERE id = NEW.medicine_id;
END$$

DELIMITER ;


-- ============================================
-- TRIGGER 2: Prevent order if stock is
-- insufficient (before inserting order_item)
-- ============================================
DELIMITER $$

CREATE TRIGGER trg_check_stock
BEFORE INSERT ON order_items
FOR EACH ROW
BEGIN
  DECLARE available_stock INT;

  SELECT stock INTO available_stock
  FROM medicines
  WHERE id = NEW.medicine_id;

  IF available_stock < NEW.quantity THEN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'Insufficient stock for this medicine';
  END IF;
END$$

DELIMITER ;

-- ✅ Test the Triggers
-- Check Dolo 650 stock BEFORE (should be 500)
SELECT name, stock FROM medicines WHERE id = 1;

-- Insert a new order_item manually
INSERT INTO order_items (order_id, medicine_id, quantity, price_at_time)
VALUES (1, 1, 10, 30.00);

-- Check Dolo 650 stock AFTER (should now be 490)
SELECT name, stock FROM medicines WHERE id = 1;

-- Test trigger 2: Try to order more than available
-- Ibuprofen has only 5 in stock — this should FAIL with error
INSERT INTO order_items (order_id, medicine_id, quantity, price_at_time)
VALUES (1, 9, 100, 40.00);


-- 🟡 Part B — Views
USE mypharma;

-- ============================================
-- VIEW 1: Low stock medicines
-- Shows medicines where stock < 10
-- ============================================
CREATE VIEW low_stock_view AS
SELECT 
  id,
  name,
  category,
  stock,
  price
FROM medicines
WHERE stock < 10;


-- ============================================
-- VIEW 2: Expiring soon (within 30 days)
-- ============================================
CREATE VIEW expiring_soon_view AS
SELECT
  id,
  name,
  category,
  stock,
  expiry_date,
  DATEDIFF(expiry_date, CURDATE()) AS days_remaining
FROM medicines
WHERE expiry_date <= DATE_ADD(CURDATE(), INTERVAL 30 DAY)
  AND expiry_date >= CURDATE();


-- ============================================
-- VIEW 3: Order summary
-- Useful for admin dashboard
-- ============================================
CREATE VIEW order_summary_view AS
SELECT
  o.id            AS order_id,
  u.name          AS customer_name,
  u.email         AS customer_email,
  o.total_amount,
  o.status,
  o.created_at,
  COUNT(oi.id)    AS total_items
FROM orders o
JOIN users u       ON o.user_id   = u.id
JOIN order_items oi ON oi.order_id = o.id
GROUP BY o.id, u.name, u.email, o.total_amount, o.status, o.created_at;

-- ✅ Test the Views
-- Should show Aspirin and Ibuprofen (stock < 10)
SELECT * FROM low_stock_view;

-- Should show medicines expiring within 30 days
SELECT * FROM expiring_soon_view;

-- Should show all orders with customer details
SELECT * FROM order_summary_view;


-- 🟢 Part C — Stored Procedure
USE mypharma;

DELIMITER $$

CREATE PROCEDURE PlaceOrder(
  IN  p_user_id      INT,
  IN  p_medicine_id  INT,
  IN  p_quantity     INT,
  IN  p_price        DECIMAL(10,2),
  OUT p_order_id     INT,
  OUT p_message      VARCHAR(100)
)
BEGIN
  -- Declare variables
  DECLARE v_stock INT;
  DECLARE v_total DECIMAL(10,2);

  -- Error handler: if anything fails, rollback
  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    ROLLBACK;
    SET p_message = 'Order failed due to an error';
    SET p_order_id = -1;
  END;

  -- Start transaction
  START TRANSACTION;

  -- Check available stock
  SELECT stock INTO v_stock
  FROM medicines WHERE id = p_medicine_id;

  IF v_stock < p_quantity THEN
    SET p_message  = 'Insufficient stock';
    SET p_order_id = -1;
    ROLLBACK;
  ELSE
    -- Calculate total
    SET v_total = p_price * p_quantity;

    -- Insert into orders
    INSERT INTO orders (user_id, total_amount, status)
    VALUES (p_user_id, v_total, 'Pending');

    -- Get the new order id
    SET p_order_id = LAST_INSERT_ID();

    -- Insert into order_items
    -- (this also fires the stock decrement trigger!)
    INSERT INTO order_items (order_id, medicine_id, quantity, price_at_time)
    VALUES (p_order_id, p_medicine_id, p_quantity, p_price);

    COMMIT;
    SET p_message = 'Order placed successfully';
  END IF;

END$$

DELIMITER ;

-- ✅ Test the Stored Procedure
-- Place a valid order (Nilesh orders 2x Vitamin C)
CALL PlaceOrder(1, 2, 2, 45.00, @order_id, @msg);
SELECT @order_id AS new_order_id, @msg AS message;

-- Check that it appears in orders table
SELECT * FROM orders WHERE id = @order_id;

-- Try an order that should FAIL (order 999 Ibuprofen, only 5 in stock)
CALL PlaceOrder(1, 9, 999, 40.00, @order_id, @msg);
SELECT @order_id AS new_order_id, @msg AS message;
-- Should return: order_id = -1, message = 'Insufficient stock'


USE mypharma;
SHOW TABLES;
SHOW TRIGGERS;

CREATE VIEW low_stock_view AS
SELECT 
  id,
  name,
  category,
  stock,
  price
FROM medicines
WHERE stock < 10;

CREATE VIEW expiring_soon_view AS
SELECT
  id,
  name,
  category,
  stock,
  expiry_date,
  DATEDIFF(expiry_date, CURDATE()) AS days_remaining
FROM medicines
WHERE expiry_date <= DATE_ADD(CURDATE(), INTERVAL 30 DAY)
  AND expiry_date >= CURDATE();
  
  CREATE VIEW order_summary_view AS
SELECT
  o.id            AS order_id,
  u.name          AS customer_name,
  u.email         AS customer_email,
  o.total_amount,
  o.status,
  o.created_at,
  COUNT(oi.id)    AS total_items
FROM orders o
JOIN users u        ON o.user_id    = u.id
JOIN order_items oi ON oi.order_id  = o.id
GROUP BY o.id, u.name, u.email, o.total_amount, o.status, o.created_at;


SELECT email, password FROM users;


SELECT * FROM orders;
SELECT * FROM order_items;
SELECT * FROM low_stock_view;
SELECT * FROM expiring_soon_view;
SELECT * FROM order_summary_view;