const { BankSampah, User, JenisSampah, BankSampahJenisSampah, KategoriSampah } = require('../models');
const { Op } = require('sequelize');

const getAllBankSampah = async (req, res) => {
  try {
    const { kecamatan, jenis_sampah, search, status } = req.query;
    
    let whereClause = {};
    if (kecamatan) {
      whereClause.kecamatan = kecamatan;
    }
    if (status) {
      whereClause.status = status;
    }
    if (search) {
      whereClause[Op.or] = [
        { nama_bank_sampah: { [Op.like]: `%${search}%` } },
        { alamat: { [Op.like]: `%${search}%` } },
        { kecamatan: { [Op.like]: `%${search}%` } }
      ];
    }

    let includeArray = [
      { model: User, as: 'pengelola', attributes: ['id', 'name', 'email', 'phone'] },
      { 
        model: JenisSampah, 
        as: 'jenis_sampah_accepted',
        through: { attributes: ['harga_per_kg', 'status'] },
        include: [{ model: KategoriSampah, as: 'kategori' }]
      }
    ];

    let bankSampahList = await BankSampah.findAll({
      where: whereClause,
      include: includeArray,
      order: [['id', 'ASC']]
    });

    if (jenis_sampah) {
      const jenisId = parseInt(jenis_sampah);
      bankSampahList = bankSampahList.filter(b => 
        b.jenis_sampah_accepted.some(j => j.id === jenisId)
      );
    }

    return res.status(200).json({ data: bankSampahList });
  } catch (error) {
    return res.status(500).json({ message: 'Gagal mengambil data Bank Sampah.', error: error.message });
  }
};

const getBankSampahById = async (req, res) => {
  try {
    const bankSampah = await BankSampah.findByPk(req.params.id, {
      include: [
        { model: User, as: 'pengelola', attributes: ['id', 'name', 'email', 'phone'] },
        { 
          model: JenisSampah, 
          as: 'jenis_sampah_accepted',
          through: { attributes: ['harga_per_kg', 'status'] },
          include: [{ model: KategoriSampah, as: 'kategori' }]
        }
      ]
    });

    if (!bankSampah) {
      return res.status(404).json({ message: 'Bank Sampah tidak ditemukan.' });
    }

    return res.status(200).json({ data: bankSampah });
  } catch (error) {
    return res.status(500).json({ message: 'Gagal mengambil detail Bank Sampah.', error: error.message });
  }
};

const createBankSampah = async (req, res) => {
  try {
    const {
      user_id,
      nama_bank_sampah,
      alamat,
      kecamatan,
      kelurahan,
      latitude,
      longitude,
      nomor_telepon,
      jam_operasional,
      deskripsi,
      status,
      jenis_sampah_ids
    } = req.body;

    if (!nama_bank_sampah || !alamat || !kecamatan || latitude === undefined || longitude === undefined) {
      return res.status(400).json({ message: 'Nama, alamat, kecamatan, latitude, dan longitude wajib diisi.' });
    }

    const newBankSampah = await BankSampah.create({
      user_id: user_id || req.user.id,
      nama_bank_sampah,
      alamat,
      kecamatan,
      kelurahan: kelurahan || '',
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      nomor_telepon: nomor_telepon || '',
      jam_operasional: jam_operasional || '08:00 - 16:00 WITA',
      deskripsi: deskripsi || '',
      status: status || 'aktif'
    });

    // If initial accepted trash types provided
    if (jenis_sampah_ids && Array.isArray(jenis_sampah_ids)) {
      const pivotItems = jenis_sampah_ids.map(jId => ({
        bank_sampah_id: newBankSampah.id,
        jenis_sampah_id: typeof jId === 'object' ? jId.id : jId,
        harga_per_kg: typeof jId === 'object' ? jId.harga_per_kg : null,
        status: 'aktif'
      }));
      await BankSampahJenisSampah.bulkCreate(pivotItems);
    } else {
      // Auto attach all active global jenis_sampah by default
      const allJenis = await JenisSampah.findAll({ where: { status: 'aktif' } });
      const pivotItems = allJenis.map(j => ({
        bank_sampah_id: newBankSampah.id,
        jenis_sampah_id: j.id,
        harga_per_kg: j.harga_per_kg,
        status: 'aktif'
      }));
      await BankSampahJenisSampah.bulkCreate(pivotItems);
    }

    return res.status(201).json({ message: 'Bank Sampah berhasil ditambahkan.', data: newBankSampah });
  } catch (error) {
    return res.status(500).json({ message: 'Gagal membuat Bank Sampah.', error: error.message });
  }
};

const updateBankSampah = async (req, res) => {
  try {
    const { id } = req.params;
    const bankSampah = await BankSampah.findByPk(id);

    if (!bankSampah) {
      return res.status(404).json({ message: 'Bank Sampah tidak ditemukan.' });
    }

    // Check ownership if pengelola
    if (req.user.role === 'pengelola' && bankSampah.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Anda tidak memiliki izin mengedit Bank Sampah ini.' });
    }

    const {
      nama_bank_sampah,
      alamat,
      kecamatan,
      kelurahan,
      latitude,
      longitude,
      nomor_telepon,
      jam_operasional,
      deskripsi,
      status,
      user_id,
      accepted_jenis_sampah
    } = req.body;

    if (nama_bank_sampah) bankSampah.nama_bank_sampah = nama_bank_sampah;
    if (alamat) bankSampah.alamat = alamat;
    if (kecamatan) bankSampah.kecamatan = kecamatan;
    if (kelurahan !== undefined) bankSampah.kelurahan = kelurahan;
    if (latitude !== undefined) bankSampah.latitude = parseFloat(latitude);
    if (longitude !== undefined) bankSampah.longitude = parseFloat(longitude);
    if (nomor_telepon !== undefined) bankSampah.nomor_telepon = nomor_telepon;
    if (jam_operasional !== undefined) bankSampah.jam_operasional = jam_operasional;
    if (deskripsi !== undefined) bankSampah.deskripsi = deskripsi;
    if (status) bankSampah.status = status;
    if (user_id && req.user.role === 'admin') bankSampah.user_id = user_id;

    await bankSampah.save();

    // If accepted_jenis_sampah updated: Array of { jenis_sampah_id, harga_per_kg, status }
    if (accepted_jenis_sampah && Array.isArray(accepted_jenis_sampah)) {
      await BankSampahJenisSampah.destroy({ where: { bank_sampah_id: id } });
      const newPivots = accepted_jenis_sampah.map(item => ({
        bank_sampah_id: id,
        jenis_sampah_id: item.jenis_sampah_id,
        harga_per_kg: item.harga_per_kg,
        status: item.status || 'aktif'
      }));
      await BankSampahJenisSampah.bulkCreate(newPivots);
    }

    return res.status(200).json({ message: 'Bank Sampah berhasil diperbarui.', data: bankSampah });
  } catch (error) {
    return res.status(500).json({ message: 'Gagal memperbarui Bank Sampah.', error: error.message });
  }
};

const deleteBankSampah = async (req, res) => {
  try {
    const { id } = req.params;
    const bankSampah = await BankSampah.findByPk(id);

    if (!bankSampah) {
      return res.status(404).json({ message: 'Bank Sampah tidak ditemukan.' });
    }

    await BankSampahJenisSampah.destroy({ where: { bank_sampah_id: id } });
    await bankSampah.destroy();

    return res.status(200).json({ message: 'Bank Sampah berhasil dihapus.' });
  } catch (error) {
    return res.status(500).json({ message: 'Gagal menghapus Bank Sampah.', error: error.message });
  }
};

module.exports = {
  getAllBankSampah,
  getBankSampahById,
  createBankSampah,
  updateBankSampah,
  deleteBankSampah
};
