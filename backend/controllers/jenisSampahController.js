const { JenisSampah, KategoriSampah } = require('../models');
const { Op } = require('sequelize');

const getAllJenisSampah = async (req, res) => {
  try {
    const { kategori_id, status, search } = req.query;

    let whereClause = {};
    if (kategori_id) whereClause.kategori_id = kategori_id;
    if (status) whereClause.status = status;
    if (search) {
      whereClause[Op.or] = [
        { nama_sampah: { [Op.like]: `%${search}%` } },
        { deskripsi: { [Op.like]: `%${search}%` } }
      ];
    }

    const jenisList = await JenisSampah.findAll({
      where: whereClause,
      include: [{ model: KategoriSampah, as: 'kategori' }],
      order: [['id', 'ASC']]
    });

    return res.status(200).json({ data: jenisList });
  } catch (error) {
    return res.status(500).json({ message: 'Gagal mengambil data jenis sampah.', error: error.message });
  }
};

const getJenisSampahById = async (req, res) => {
  try {
    const jenis = await JenisSampah.findByPk(req.params.id, {
      include: [{ model: KategoriSampah, as: 'kategori' }]
    });

    if (!jenis) {
      return res.status(404).json({ message: 'Jenis sampah tidak ditemukan.' });
    }

    return res.status(200).json({ data: jenis });
  } catch (error) {
    return res.status(500).json({ message: 'Gagal mengambil detail jenis sampah.', error: error.message });
  }
};

const createJenisSampah = async (req, res) => {
  try {
    const { kategori_id, nama_sampah, deskripsi, gambar, harga_per_kg, status } = req.body;

    if (!kategori_id || !nama_sampah || harga_per_kg === undefined) {
      return res.status(400).json({ message: 'Kategori ID, nama sampah, dan harga per kg wajib diisi.' });
    }

    const newJenis = await JenisSampah.create({
      kategori_id,
      nama_sampah,
      deskripsi: deskripsi || '',
      gambar: gambar || '',
      harga_per_kg: parseFloat(harga_per_kg),
      status: status || 'aktif'
    });

    return res.status(201).json({ message: 'Jenis sampah berhasil ditambahkan.', data: newJenis });
  } catch (error) {
    return res.status(500).json({ message: 'Gagal menambahkan jenis sampah.', error: error.message });
  }
};

const updateJenisSampah = async (req, res) => {
  try {
    const { id } = req.params;
    const { kategori_id, nama_sampah, deskripsi, gambar, harga_per_kg, status } = req.body;

    const jenis = await JenisSampah.findByPk(id);
    if (!jenis) {
      return res.status(404).json({ message: 'Jenis sampah tidak ditemukan.' });
    }

    if (kategori_id) jenis.kategori_id = kategori_id;
    if (nama_sampah) jenis.nama_sampah = nama_sampah;
    if (deskripsi !== undefined) jenis.deskripsi = deskripsi;
    if (gambar !== undefined) jenis.gambar = gambar;
    if (harga_per_kg !== undefined) jenis.harga_per_kg = parseFloat(harga_per_kg);
    if (status) jenis.status = status;

    await jenis.save();
    return res.status(200).json({ message: 'Jenis sampah berhasil diperbarui.', data: jenis });
  } catch (error) {
    return res.status(500).json({ message: 'Gagal memperbarui jenis sampah.', error: error.message });
  }
};

const deleteJenisSampah = async (req, res) => {
  try {
    const { id } = req.params;
    const jenis = await JenisSampah.findByPk(id);
    if (!jenis) {
      return res.status(404).json({ message: 'Jenis sampah tidak ditemukan.' });
    }

    await jenis.destroy();
    return res.status(200).json({ message: 'Jenis sampah berhasil dihapus.' });
  } catch (error) {
    return res.status(500).json({ message: 'Gagal menghapus jenis sampah.', error: error.message });
  }
};

module.exports = {
  getAllJenisSampah,
  getJenisSampahById,
  createJenisSampah,
  updateJenisSampah,
  deleteJenisSampah
};
