

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Configurar CORS para permitir cualquier origen
app.use(cors());

app.use(express.json());

// Configuración del pool de conexiones
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: "Q~Z#PZbNz]4",
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Rutas API
app.get('/api/articles', (req, res) => {
  pool.query('SELECT * FROM articles', (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results);
  });
});

app.get('/api/articles/:id', (req, res) => {
  pool.query('SELECT * FROM articles WHERE id = ?', [req.params.id], (err, results) => {
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

app.post('/api/articles', (req, res) => {
  const { title, content } = req.body;
  pool.query('INSERT INTO articles (title, content) VALUES (?, ?)', [title, content], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.status(201).json({ id: result.insertId, title, content });
  });
});

app.put('/api/articles/:id', (req, res) => {
  const { title, content } = req.body;
  pool.query('UPDATE articles SET title = ?, content = ? WHERE id = ?', [title, content, req.params.id], (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Article updated successfully' });
  });
});

app.delete('/api/articles/:id', (req, res) => {
  pool.query('DELETE FROM articles WHERE id = ?', [req.params.id], (err) => {
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
