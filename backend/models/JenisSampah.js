const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const JenisSampah = sequelize.define('JenisSampah', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  kategori_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  nama_sampah: {
    type: DataTypes.STRING,
    allowNull: false
  },
  deskripsi: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  gambar: {
    type: DataTypes.STRING,
    allowNull: true
  },
  harga_per_kg: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0
  },
  status: {
    type: DataTypes.ENUM('aktif', 'nonaktif'),
    defaultValue: 'aktif'
  }
}, {
  tableName: 'jenis_sampah',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = JenisSampah;
