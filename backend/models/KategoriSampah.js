const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const KategoriSampah = sequelize.define('KategoriSampah', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  nama_kategori: {
    type: DataTypes.STRING,
    allowNull: false
  },
  deskripsi: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'kategori_sampah',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

module.exports = KategoriSampah;
