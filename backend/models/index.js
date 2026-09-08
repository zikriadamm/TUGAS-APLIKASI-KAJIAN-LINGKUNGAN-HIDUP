const { sequelize } = require('../config/db');
const User = require('./User');
const BankSampah = require('./BankSampah');
const KategoriSampah = require('./KategoriSampah');
const JenisSampah = require('./JenisSampah');
const BankSampahJenisSampah = require('./BankSampahJenisSampah');
const Transaksi = require('./Transaksi');
const DetailTransaksi = require('./DetailTransaksi');
const Edukasi = require('./Edukasi');

// Associations
User.hasMany(BankSampah, { foreignKey: 'user_id', as: 'bank_sampah_managed' });
BankSampah.belongsTo(User, { foreignKey: 'user_id', as: 'pengelola' });

User.hasMany(Transaksi, { foreignKey: 'user_id', as: 'transaksi' });
Transaksi.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

BankSampah.hasMany(Transaksi, { foreignKey: 'bank_sampah_id', as: 'transaksi' });
Transaksi.belongsTo(BankSampah, { foreignKey: 'bank_sampah_id', as: 'bank_sampah' });

KategoriSampah.hasMany(JenisSampah, { foreignKey: 'kategori_id', as: 'jenis_sampah' });
JenisSampah.belongsTo(KategoriSampah, { foreignKey: 'kategori_id', as: 'kategori' });

BankSampah.belongsToMany(JenisSampah, {
  through: BankSampahJenisSampah,
  foreignKey: 'bank_sampah_id',
  otherKey: 'jenis_sampah_id',
  as: 'jenis_sampah_accepted'
});

JenisSampah.belongsToMany(BankSampah, {
  through: BankSampahJenisSampah,
  foreignKey: 'jenis_sampah_id',
  otherKey: 'bank_sampah_id',
  as: 'bank_sampah_list'
});

BankSampah.hasMany(BankSampahJenisSampah, { foreignKey: 'bank_sampah_id', as: 'pivot_jenis_sampah' });
BankSampahJenisSampah.belongsTo(BankSampah, { foreignKey: 'bank_sampah_id' });

JenisSampah.hasMany(BankSampahJenisSampah, { foreignKey: 'jenis_sampah_id' });
BankSampahJenisSampah.belongsTo(JenisSampah, { foreignKey: 'jenis_sampah_id', as: 'jenis_sampah' });

Transaksi.hasMany(DetailTransaksi, { foreignKey: 'transaksi_id', as: 'detail_transaksi' });
DetailTransaksi.belongsTo(Transaksi, { foreignKey: 'transaksi_id' });

DetailTransaksi.belongsTo(JenisSampah, { foreignKey: 'jenis_sampah_id', as: 'jenis_sampah' });
JenisSampah.hasMany(DetailTransaksi, { foreignKey: 'jenis_sampah_id' });

module.exports = {
  sequelize,
  User,
  BankSampah,
  KategoriSampah,
  JenisSampah,
  BankSampahJenisSampah,
  Transaksi,
  DetailTransaksi,
  Edukasi
};
