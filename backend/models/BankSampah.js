const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const BankSampah = sequelize.define('BankSampah', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  nama_bank_sampah: {
    type: DataTypes.STRING,
    allowNull: false
  },
  alamat: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  kecamatan: {
    type: DataTypes.STRING,
    allowNull: false
  },
  kelurahan: {
    type: DataTypes.STRING,
    allowNull: true
  },
  latitude: {
    type: DataTypes.DOUBLE,
    allowNull: false
  },
  longitude: {
    type: DataTypes.DOUBLE,
    allowNull: false
  },
  nomor_telepon: {
    type: DataTypes.STRING,
    allowNull: true
  },
  jam_operasional: {
    type: DataTypes.STRING,
    allowNull: true
  },
  deskripsi: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('aktif', 'nonaktif'),
    defaultValue: 'aktif'
  }
}, {
  tableName: 'bank_sampah',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = BankSampah;
