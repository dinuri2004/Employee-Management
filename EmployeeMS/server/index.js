const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database');

    // Create table if it doesn't exist
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS employees (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            position VARCHAR(255) NOT NULL,
            salary DECIMAL(10, 2)
        )
    `;
    db.query(createTableQuery, (err) => {
        if (err) console.error('Error creating table:', err);
    });
});

// GET all employees
app.get('/employees', (req, res) => {
    db.query('SELECT * FROM employees', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// POST new employee
app.post('/employees', (req, res) => {
    const { name, email, position, salary } = req.body;
    const query = 'INSERT INTO employees (name, email, position, salary) VALUES (?, ?, ?, ?)';
    db.query(query, [name, email, position, salary], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: result.insertId, name, email, position, salary });
    });
});

// PUT update employee
app.put('/employees/:id', (req, res) => {
    const { id } = req.params;
    const { name, email, position, salary } = req.body;
    const query = 'UPDATE employees SET name = ?, email = ?, position = ?, salary = ? WHERE id = ?';
    db.query(query, [name, email, position, salary, id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id, name, email, position, salary });
    });
});

// DELETE employee
app.delete('/employees/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM employees WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Employee deleted' });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
