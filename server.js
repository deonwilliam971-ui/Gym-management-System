const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

let db;

// Initialize Database connection and create tables if they don't exist
async function initializeDB() {
    db = await open({
        filename: path.join(__dirname, 'gym_management.db'),
        driver: sqlite3.Database
    });

    console.log('Connected to SQLite database!');

    await db.exec(`
        CREATE TABLE IF NOT EXISTS plans (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            duration_months INTEGER NOT NULL,
            price REAL NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS members (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            first_name TEXT NOT NULL,
            last_name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            phone TEXT,
            join_date DATE NOT NULL,
            plan_id INTEGER,
            status TEXT DEFAULT 'Active',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (plan_id) REFERENCES plans(id) ON DELETE SET NULL
        );
    `);

    // Insert default plans if the table is empty
    const { count } = await db.get('SELECT COUNT(*) as count FROM plans');
    if (count === 0) {
        await db.run(`INSERT INTO plans (name, duration_months, price) VALUES 
            ('Monthly Starter', 1, 50.00),
            ('Quarterly Pro', 3, 135.00),
            ('Annual VIP', 12, 500.00);`
        );
        console.log('Inserted default membership plans.');
    }
}

// API ROUTES

// 1. Get all plans
app.get('/api/plans', async (req, res) => {
    try {
        const rows = await db.all('SELECT * FROM plans');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error retrieving plans' });
    }
});

// 2. Get all members
app.get('/api/members', async (req, res) => {
    try {
        const query = `
            SELECT m.*, p.name as plan_name 
            FROM members m 
            LEFT JOIN plans p ON m.plan_id = p.id
            ORDER BY m.created_at DESC
        `;
        const rows = await db.all(query);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error retrieving members' });
    }
});

// 3. Add a new member
app.post('/api/members', async (req, res) => {
    const { first_name, last_name, email, phone, plan_id } = req.body;
    
    if (!first_name || !last_name || !email) {
        return res.status(400).json({ error: 'First name, last name, and email are required' });
    }

    try {
        const join_date = new Date().toISOString().split('T')[0]; // Current date YYYY-MM-DD
        const result = await db.run(
            'INSERT INTO members (first_name, last_name, email, phone, join_date, plan_id) VALUES (?, ?, ?, ?, ?, ?)',
            [first_name, last_name, email, phone, join_date, plan_id || null]
        );
        res.status(201).json({ id: result.lastID, message: 'Member added successfully' });
    } catch (error) {
        console.error(error);
        if (error.message.includes('UNIQUE constraint failed')) {
            res.status(409).json({ error: 'Email already exists' });
        } else {
            res.status(500).json({ error: 'Server Error adding member' });
        }
    }
});

// 4. Delete a member
app.delete('/api/members/:id', async (req, res) => {
    const memberId = req.params.id;
    try {
        const result = await db.run('DELETE FROM members WHERE id = ?', [memberId]);
        if (result.changes === 0) {
            return res.status(404).json({ error: 'Member not found' });
        }
        res.json({ message: 'Member deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error deleting member' });
    }
});

// Start Server after setting up DB
initializeDB().then(() => {
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
}).catch(err => {
    console.error('Failed to initialize database:', err);
});
