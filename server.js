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
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database.');
});

// Get all articles
app.get('/api/articles', (req, res) => {
  db.query('SELECT * FROM articles', (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results);
  });
});

// Get a single article
app.get('/api/articles/:id', (req, res) => {
  db.query('SELECT * FROM articles WHERE id = ?', [req.params.id], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (results.length === 0) {
      res.status(404).json({ message: 'Article not found' });
      return;
    }
    res.json(results[0]);
  });
});

// Create a new article
app.post('/api/articles', (req, res) => {
  const { title, content } = req.body;
  db.query('INSERT INTO articles (title, content) VALUES (?, ?)', [title, content], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.status(201).json({ id: result.insertId, title, content });
  });
});

// Update an article
app.put('/api/articles/:id', (req, res) => {
  const { title, content } = req.body;
  db.query('UPDATE articles SET title = ?, content = ? WHERE id = ?', [title, content, req.params.id], (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Article updated successfully' });
  });
});

// Delete an article
app.delete('/api/articles/:id', (req, res) => {
  db.query('DELETE FROM articles WHERE id = ?', [req.params.id], (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Article deleted successfully' });
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});