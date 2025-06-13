# Gym Management System

A comprehensive gym management system with dark mode support and PostgreSQL database integration.

## Features

- **Complete CRUD Operations**: Members, Classes, Class Membership, Employees, Products
- **Dark Mode Support**: Toggle between light and dark themes
- **Database Integration**: PostgreSQL connection with custom queries and procedures
- **Analytics Dashboard**: Real-time charts and statistics
- **Responsive Design**: Works on all devices
- **Modern UI**: Clean, professional interface with smooth animations

## Database Connection Setup

### Prerequisites

1. **PostgreSQL Database**: Make sure your PostgreSQL server is running
2. **Node.js Backend**: You'll need a backend server to handle database connections

### Backend Setup (Required for Production)

Since browsers cannot directly connect to PostgreSQL for security reasons, you need a backend server. Here's how to set it up:

#### 1. Create a Node.js Backend

```bash
mkdir gym-backend
cd gym-backend
npm init -y
npm install express cors pg dotenv
```

#### 2. Create server.js

```javascript
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

// Database configuration
const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'mydatabase',
  user: 'azriel',
  password: 'A227Y8751'
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
        throw new Error('Unknown procedure');
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
        throw new Error('Unknown function');
    }
    
    const result = await pool.query(query, params);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// CRUD endpoints for each table
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

// Add similar endpoints for other tables...

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
```

#### 3. Update Frontend Database Service

Update `src/services/database.ts` to use your backend API:

```typescript
export class DatabaseService {
  private baseUrl = 'http://localhost:3001/api';

  async executeQuery(query: string, params: any[] = []): Promise<any[]> {
    const response = await fetch(`${this.baseUrl}/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, params })
    });
    
    const result = await response.json();
    if (!result.success) throw new Error(result.error);
    return result.data;
  }

  async callProcedure(procedureName: string, params: any[]): Promise<any> {
    const response = await fetch(`${this.baseUrl}/procedure/${procedureName}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ params })
    });
    
    const result = await response.json();
    if (!result.success) throw new Error(result.error);
    return result;
  }

  async callFunction(functionName: string, params: any[]): Promise<any> {
    const response = await fetch(`${this.baseUrl}/function/${functionName}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ params })
    });
    
    const result = await response.json();
    if (!result.success) throw new Error(result.error);
    return result.data;
  }
}
```

### Running the Application

1. **Start the backend server**:
   ```bash
   cd gym-backend
   node server.js
   ```

2. **Start the frontend**:
   ```bash
   npm run dev
   ```

## Database Queries and Procedures Included

### Queries
1. **Members with Membership Details** - Lists all members with their membership type, price, and duration
2. **Monthly Revenue Report** - Total revenue from payments per month and year
3. **Member Attendance Statistics** - Number of check-ins per member per month and year
4. **Instructor Class Count** - List of instructors and the number of classes they conduct
5. **Popular Classes** - Classes with participant count (minimum 3 participants)
6. **Inactive Members** - Members who haven't visited in the last month

### Procedures
1. **add_attendance** - Insert attendance record with duplicate prevention
2. **update_hourly_rate** - Update employee hourly rate with validation

### Functions
1. **calc_weekly_hours** - Calculate total attendance hours for a member in a week
2. **get_cashier_orders** - Get all orders handled by a specific cashier

## Dark Mode

Toggle between light and dark themes using the moon/sun icon in the sidebar. The preference is saved in localStorage.

## Demo Credentials

- Username: `admin`
- Password: `password`