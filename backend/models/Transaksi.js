const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Transaksi = sequelize.define('Transaksi', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  bank_sampah_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  kode_transaksi: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  tanggal_transaksi: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  total_berat: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0
  },
  total_harga: {
    type: DataTypes.DECIMAL(14, 2),
    allowNull: false,
    defaultValue: 0
  },
  metode_penyerahan: {
    type: DataTypes.ENUM('Jemput di Alamat', 'Diantar ke Bank Sampah'),
    defaultValue: 'Jemput di Alamat'
  },
  alamat_penjemputan: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('Menunggu', 'Diproses', 'Diterima', 'Ditolak', 'Selesai'),
    defaultValue: 'Menunggu',
    allowNull: false
  },
  catatan: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'transaksi',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Transaksi;
