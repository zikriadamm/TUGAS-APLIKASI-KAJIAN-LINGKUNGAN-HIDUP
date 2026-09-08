const { KategoriSampah, JenisSampah } = require('../models');

const getAllKategori = async (req, res) => {
  try {
    const kategoriList = await KategoriSampah.findAll({
      include: [{ model: JenisSampah, as: 'jenis_sampah' }],
      order: [['id', 'ASC']]
    });
    return res.status(200).json({ data: kategoriList });
  } catch (error) {
    return res.status(500).json({ message: 'Gagal mengambil data kategori.', error: error.message });
  }
};

const createKategori = async (req, res) => {
  try {
    const { nama_kategori, deskripsi } = req.body;
    if (!nama_kategori) {
      return res.status(400).json({ message: 'Nama kategori wajib diisi.' });
    }

    const newKategori = await KategoriSampah.create({
      nama_kategori,
      deskripsi: deskripsi || ''
    });

    return res.status(201).json({ message: 'Kategori berhasil ditambahkan.', data: newKategori });
  } catch (error) {
    return res.status(500).json({ message: 'Gagal menambahkan kategori.', error: error.message });
  }
};

const updateKategori = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama_kategori, deskripsi } = req.body;

    const kategori = await KategoriSampah.findByPk(id);
    if (!kategori) {
      return res.status(404).json({ message: 'Kategori tidak ditemukan.' });
    }

    if (nama_kategori) kategori.nama_kategori = nama_kategori;
    if (deskripsi !== undefined) kategori.deskripsi = deskripsi;

    await kategori.save();
    return res.status(200).json({ message: 'Kategori berhasil diperbarui.', data: kategori });
  } catch (error) {
    return res.status(500).json({ message: 'Gagal memperbarui kategori.', error: error.message });
  }
};

const deleteKategori = async (req, res) => {
  try {
    const { id } = req.params;
    const kategori = await KategoriSampah.findByPk(id);
    if (!kategori) {
      return res.status(404).json({ message: 'Kategori tidak ditemukan.' });
    }

    await kategori.destroy();
    return res.status(200).json({ message: 'Kategori berhasil dihapus.' });
  } catch (error) {
    return res.status(500).json({ message: 'Gagal menghapus kategori.', error: error.message });
  }
};

module.exports = {
  getAllKategori,
  createKategori,
  updateKategori,
  deleteKategori
};
