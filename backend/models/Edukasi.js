const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Edukasi = sequelize.define('Edukasi', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  judul: {
    type: DataTypes.STRING,
    allowNull: false
  },
  konten: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  gambar: {
    type: DataTypes.STRING,
    allowNull: true
  },
  kategori: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'Umum'
  }
}, {
  tableName: 'edukasi',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Edukasi;
