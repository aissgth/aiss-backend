const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const dbPath = path.join(__dirname, 'users.json');

// Pastikan file users.json ada
if (!fs.existsSync(dbPath)) {
  fs.writeFileSync(dbPath, JSON.stringify({ users: {} }, null, 2));
}

// ====== API: DAFTAR ======
app.post('/api/daftar', (req, res) => {
  const { username, password, phone } = req.body;

  if (!username || !password || !phone) {
    return res.json({ success: false, error: 'Data tidak lengkap' });
  }

  const db = JSON.parse(fs.readFileSync(dbPath));

  if (db.users[username]) {
    return res.json({ success: false, error: 'Username sudah terdaftar' });
  }

  db.users[username] = { password, phone };
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

  return res.json({ success: true });
});

// ====== API: LOGIN ======
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  const db = JSON.parse(fs.readFileSync(dbPath));

  if (!db.users[username]) {
    return res.json({ success: false, error: 'User tidak ditemukan' });
  }

  if (db.users[username].password !== password) {
    return res.json({ success: false, error: 'Password salah' });
  }

  return res.json({ success: true });
});

// ====== Default route ======
app.get('/', (req, res) => {
  res.send('Aiss Auth Backend aktif!');
});

app.listen(PORT, () => {
  console.log(`✅ Server aktif di http://localhost:${PORT}`);
});
