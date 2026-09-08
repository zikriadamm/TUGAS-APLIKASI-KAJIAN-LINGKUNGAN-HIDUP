const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const BankSampahJenisSampah = sequelize.define('BankSampahJenisSampah', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  bank_sampah_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  jenis_sampah_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  harga_per_kg: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('aktif', 'nonaktif'),
    defaultValue: 'aktif'
  }
}, {
  tableName: 'bank_sampah_jenis_sampah',
  timestamps: false
});

module.exports = BankSampahJenisSampah;
