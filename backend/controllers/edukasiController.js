const { Edukasi } = require('../models');

const getAllEdukasi = async (req, res) => {
  try {
    const list = await Edukasi.findAll({
      order: [['created_at', 'DESC']]
    });
    return res.status(200).json({ data: list });
  } catch (error) {
    return res.status(500).json({ message: 'Gagal mengambil artikel edukasi.', error: error.message });
  }
};

const getEdukasiById = async (req, res) => {
  try {
    const item = await Edukasi.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Artikel edukasi tidak ditemukan.' });
    }
    return res.status(200).json({ data: item });
  } catch (error) {
    return res.status(500).json({ message: 'Gagal mengambil detail edukasi.', error: error.message });
  }
};

const createEdukasi = async (req, res) => {
  try {
    const { judul, konten, gambar, kategori } = req.body;
    if (!judul || !konten) {
      return res.status(400).json({ message: 'Judul dan konten wajib diisi.' });
    }

    const newItem = await Edukasi.create({
      judul,
      konten,
      gambar: gambar || '',
      kategori: kategori || 'Daur Ulang'
    });

    return res.status(201).json({ message: 'Artikel edukasi berhasil dibuat.', data: newItem });
  } catch (error) {
    return res.status(500).json({ message: 'Gagal membuat artikel edukasi.', error: error.message });
  }
};

const updateEdukasi = async (req, res) => {
  try {
    const { id } = req.params;
    const { judul, konten, gambar, kategori } = req.body;

    const item = await Edukasi.findByPk(id);
    if (!item) {
      return res.status(404).json({ message: 'Artikel edukasi tidak ditemukan.' });
    }

    if (judul) item.judul = judul;
    if (konten) item.konten = konten;
    if (gambar !== undefined) item.gambar = gambar;
    if (kategori) item.kategori = kategori;

    await item.save();
    return res.status(200).json({ message: 'Artikel edukasi berhasil diperbarui.', data: item });
  } catch (error) {
    return res.status(500).json({ message: 'Gagal memperbarui artikel edukasi.', error: error.message });
  }
};

const deleteEdukasi = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Edukasi.findByPk(id);
    if (!item) {
      return res.status(404).json({ message: 'Artikel edukasi tidak ditemukan.' });
    }

    await item.destroy();
    return res.status(200).json({ message: 'Artikel edukasi berhasil dihapus.' });
  } catch (error) {
    return res.status(500).json({ message: 'Gagal menghapus artikel edukasi.', error: error.message });
  }
};

module.exports = {
  getAllEdukasi,
  getEdukasiById,
  createEdukasi,
  updateEdukasi,
  deleteEdukasi
};
