const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { initDatabase, sequelize } = require('./config/db');
const seedDatabase = require('./seeders/seed');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Lazy Database initialization for standalone & serverless environments
let dbInitialized = false;
let dbInitPromise = null;

const ensureDbInit = async () => {
  if (dbInitialized) return;
  if (!dbInitPromise) {
    dbInitPromise = (async () => {
      try {
        await initDatabase();
        await sequelize.sync();
        await seedDatabase();
        dbInitialized = true;
      } catch (err) {
        dbInitPromise = null;
        throw err;
      }
    })();
  }
  await dbInitPromise;
};

// Database Init Middleware
app.use(async (req, res, next) => {
  try {
    await ensureDbInit();
    next();
  } catch (err) {
    console.error('Database initialization error:', err);
    res.status(500).json({ message: 'Terjadi kesalahan pada inisialisasi database.', error: err.message });
  }
});

// Health Check API
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'API Monitoring Bank Sampah Kota Palu Berjalan Normal.' });
});

// Import Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const bankSampahRoutes = require('./routes/bankSampahRoutes');
const kategoriSampahRoutes = require('./routes/kategoriSampahRoutes');
const jenisSampahRoutes = require('./routes/jenisSampahRoutes');
const transaksiRoutes = require('./routes/transaksiRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const edukasiRoutes = require('./routes/edukasiRoutes');

// Register Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/bank-sampah', bankSampahRoutes);
app.use('/api/kategori-sampah', kategoriSampahRoutes);
app.use('/api/jenis-sampah', jenisSampahRoutes);
app.use('/api/transaksi', transaksiRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/edukasi', edukasiRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Terjadi kesalahan pada server internal.', error: err.message });
});

// Initialize Server & Database
const startServer = async () => {
  try {
    await ensureDbInit();
    app.listen(PORT, () => {
      console.log(`=============================================================`);
      console.log(` Server Bank Sampah Palu running on http://localhost:${PORT}`);
      console.log(`=============================================================`);
    });
  } catch (error) {
    console.error(' Failed to start server:', error);
  }
};

if (require.main === module) {
  startServer();
}

module.exports = app;
