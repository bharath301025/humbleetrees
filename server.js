// backend/server.js
require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const db = require('./db');
const { validateUsername } = require('./validators');

const app = express();
const PORT = process.env.PORT || 3000;
const ORIGIN = process.env.ORIGIN || '*';

app.use(helmet());
app.use(express.json());
app.use(cors({
  origin: ORIGIN === '*' ? true : ORIGIN,
  methods: ['GET', 'POST', 'OPTIONS'],
}));

app.get('/api/health', (req, res) => {
  res.json({ ok: true, uptime: process.uptime() });
});

app.get('/api/users', (req, res) => {
  db.all('SELECT id, username, created_at FROM users ORDER BY id DESC LIMIT 50', [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    res.json({ data: rows });
  });
});

app.post('/api/users', (req, res) => {
  const { username } = req.body || {};
  const check = validateUsername(username);
  if (!check.ok) {
    return res.status(400).json({ error: check.reason });
  }
  const name = check.value;

  const stmt = db.prepare('INSERT INTO users (username) VALUES (?)');
  stmt.run(name, function(err) {
    if (err) {
      if (err && err.message && err.message.includes('UNIQUE')) {
        return res.status(409).json({ error: 'Username already taken' });
      }
      return res.status(500).json({ error: 'DB insert error' });
    }
    return res.status(201).json({ id: this.lastID, username: name });
  });
  stmt.finalize();
});

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.listen(PORT, () => {
  console.log(`Humblee Trees username API listening on :${PORT}`);
});
