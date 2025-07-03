const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const dbPath = path.join(__dirname, 'users.json');

// Inisialisasi DB jika belum ada
if (!fs.existsSync(dbPath)) {
  fs.writeFileSync(dbPath, JSON.stringify({ users: {} }, null, 2));
}

// API Daftar
app.post('/api/daftar', (req, res) => {
  const { username, password, phone } = req.body;
  if (!username || !password || !phone) {
    return res.status(400).json({ success: false, error: 'Data tidak lengkap' });
  }

  const db = JSON.parse(fs.readFileSync(dbPath));
  if (db.users[username]) {
    return res.status(400).json({ success: false, error: 'Username sudah terdaftar' });
  }

  db.users[username] = { password, phone };
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
  res.json({ success: true });
});

// API Login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  const db = JSON.parse(fs.readFileSync(dbPath));
  if (!db.users[username] || db.users[username].password !== password) {
    return res.status(401).json({ success: false, error: 'Login gagal' });
  }

  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`✅ Server aktif di http://localhost:${PORT}`);
});
