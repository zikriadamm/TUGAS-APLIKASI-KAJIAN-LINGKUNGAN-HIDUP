const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const DetailTransaksi = sequelize.define('DetailTransaksi', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  transaksi_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  jenis_sampah_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  berat: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  harga_per_kg: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false
  },
  subtotal: {
    type: DataTypes.DECIMAL(14, 2),
    allowNull: false
  }
}, {
  tableName: 'detail_transaksi',
  timestamps: false
});

module.exports = DetailTransaksi;
