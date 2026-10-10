require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

if (!process.env.JWT_SECRET) {
  console.error('Missing JWT_SECRET. Copy backend/.env.example to backend/.env and fill it in.');
  process.exit(1);
}

const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend build + standalone pages
app.use(express.static(path.join(__dirname, '..', 'frontend', 'dist')));
app.use(express.static(path.join(__dirname, '..', 'frontend')));

app.use('/uploads', express.static('uploads'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api', require('./routes/jobs'));
app.use('/api', require('./routes/applications'));
app.use('/api/users', require('./routes/users'));
app.use('/api/contact', require('./routes/contact'));

// SPA fallback — serve frontend for all non-API routes
app.use((req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'Route not found' });
  }
  res.sendFile(path.join(__dirname, '..', 'frontend', 'dist', 'index.html'));
});

app.use((err, req, res, next) => {
  console.error('[Error]', err.message);
  res.status(err.status || 500).json({ error: err.message || 'Something went wrong.' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Nexova server running on http://localhost:${PORT}`);
});

module.exports = app;
