const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

// Database configuration
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'mydatabase',
  user: process.env.DB_USER || 'azriel',
  password: process.env.DB_PASSWORD || 'A227Y8751'
});

app.use(cors());
app.use(express.json());

// Test database connection
app.get('/api/test', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ success: true, time: result.rows[0].now });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Execute custom queries
app.post('/api/query', async (req, res) => {
  try {
    const { query, params = [] } = req.body;
    const result = await pool.query(query, params);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Call procedures
app.post('/api/procedure/:name', async (req, res) => {
  try {
    const { name } = req.params;
    const { params = [] } = req.body;
    
    let query;
    switch (name) {
      case 'add_attendance':
        query = 'CALL add_attendance($1, $2, $3, $4)';
        break;
      case 'update_hourly_rate':
        query = 'CALL update_hourly_rate($1, $2)';
        break;
      default:
        return res.status(400).json({ success: false, error: 'Unknown procedure' });
    }
    
    await pool.query(query, params);
    res.json({ success: true, message: 'Procedure executed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Call functions
app.post('/api/function/:name', async (req, res) => {
  try {
    const { name } = req.params;
    const { params = [] } = req.body;
    
    let query;
    switch (name) {
      case 'calc_weekly_hours':
        query = 'SELECT calc_weekly_hours($1, $2) as total_hours';
        break;
      case 'get_cashier_orders':
        query = 'SELECT * FROM get_cashier_orders($1)';
        break;
      default:
        return res.status(400).json({ success: false, error: 'Unknown function' });
    }
    
    const result = await pool.query(query, params);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// MEMBERS CRUD
app.get('/api/members', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM members ORDER BY memberid');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/members', async (req, res) => {
  try {
    const { name, birth_date, email, phone, membershiptype, status } = req.body;
    const result = await pool.query(
      'INSERT INTO members (name, birth_date, email, phone, membershiptype, join_date, status) VALUES ($1, $2, $3, $4, $5, CURRENT_DATE, $6) RETURNING *',
      [name, birth_date, email, phone, membershiptype, status]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/members/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, birth_date, email, phone, membershiptype, status } = req.body;
    const result = await pool.query(
      'UPDATE members SET name = $1, birth_date = $2, email = $3, phone = $4, membershiptype = $5, status = $6 WHERE memberid = $7 RETURNING *',
      [name, birth_date, email, phone, membershiptype, status, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/members/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM members WHERE memberid = $1', [id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// CLASSES CRUD
app.get('/api/classes', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM classes ORDER BY classid');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/classes', async (req, res) => {
  try {
    const { classname, instructorid, schedule, capacity, price } = req.body;
    const result = await pool.query(
      'INSERT INTO classes (classname, instructorid, schedule, capacity, price) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [classname, instructorid, schedule, capacity, price]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/classes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { classname, instructorid, schedule, capacity, price } = req.body;
    const result = await pool.query(
      'UPDATE classes SET classname = $1, instructorid = $2, schedule = $3, capacity = $4, price = $5 WHERE classid = $6 RETURNING *',
      [classname, instructorid, schedule, capacity, price, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/classes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM classes WHERE classid = $1', [id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// EMPLOYEES CRUD
app.get('/api/employees', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM employees ORDER BY employeeid');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/employees', async (req, res) => {
  try {
    const { name, role, hourly_rate, email, phone } = req.body;
    const result = await pool.query(
      'INSERT INTO employees (name, role, hourly_rate, hire_date, email, phone) VALUES ($1, $2, $3, CURRENT_DATE, $4, $5) RETURNING *',
      [name, role, hourly_rate, email, phone]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/employees/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, role, hourly_rate, email, phone } = req.body;
    const result = await pool.query(
      'UPDATE employees SET name = $1, role = $2, hourly_rate = $3, email = $4, phone = $5 WHERE employeeid = $6 RETURNING *',
      [name, role, hourly_rate, email, phone, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/employees/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM employees WHERE employeeid = $1', [id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PRODUCTS CRUD
app.get('/api/products', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products ORDER BY productid');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const { name, price, stock, category } = req.body;
    const result = await pool.query(
      'INSERT INTO products (name, price, stock, category) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, price, stock, category]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, stock, category } = req.body;
    const result = await pool.query(
      'UPDATE products SET name = $1, price = $2, stock = $3, category = $4 WHERE productid = $5 RETURNING *',
      [name, price, stock, category, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM products WHERE productid = $1', [id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// CLASS MEMBERSHIP CRUD
app.get('/api/class-membership', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT cm.*, m.name as member_name, c.classname 
      FROM class_membership cm 
      JOIN members m ON cm.memberid = m.memberid 
      JOIN classes c ON cm.classid = c.classid 
      ORDER BY cm.memberid, cm.classid
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/class-membership', async (req, res) => {
  try {
    const { memberid, classid } = req.body;
    const result = await pool.query(
      'INSERT INTO class_membership (memberid, classid, registration_date) VALUES ($1, $2, CURRENT_DATE) RETURNING *',
      [memberid, classid]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/class-membership/:memberid/:classid', async (req, res) => {
  try {
    const { memberid, classid } = req.params;
    await pool.query('DELETE FROM class_membership WHERE memberid = $1 AND classid = $2', [memberid, classid]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log('Testing database connection...');
  pool.query('SELECT NOW()', (err, result) => {
    if (err) {
      console.error('Database connection failed:', err.message);
    } else {
      console.log('Database connected successfully at:', result.rows[0].now);
    }
  });
});