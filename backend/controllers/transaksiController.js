const { Transaksi, DetailTransaksi, User, BankSampah, JenisSampah, KategoriSampah } = require('../models');

const getAllTransaksi = async (req, res) => {
  try {
    const { status, bank_sampah_id } = req.query;
    let whereClause = {};

    if (status) {
      whereClause.status = status;
    }

    // Role-based filtering
    if (req.user.role === 'masyarakat') {
      whereClause.user_id = req.user.id;
    } else if (req.user.role === 'pengelola') {
      const managedBank = await BankSampah.findOne({ where: { user_id: req.user.id } });
      if (managedBank) {
        whereClause.bank_sampah_id = managedBank.id;
      } else if (bank_sampah_id) {
        whereClause.bank_sampah_id = bank_sampah_id;
      }
    } else if (bank_sampah_id) {
      whereClause.bank_sampah_id = bank_sampah_id;
    }

    const list = await Transaksi.findAll({
      where: whereClause,
      include: [
        { model: User, as: 'user', attributes: ['id', 'name', 'email', 'phone', 'address'] },
        { model: BankSampah, as: 'bank_sampah', attributes: ['id', 'nama_bank_sampah', 'alamat', 'kecamatan'] },
        {
          model: DetailTransaksi,
          as: 'detail_transaksi',
          include: [{ model: JenisSampah, as: 'jenis_sampah', include: [{ model: KategoriSampah, as: 'kategori' }] }]
        }
      ],
      order: [['created_at', 'DESC']]
    });

    return res.status(200).json({ data: list });
  } catch (error) {
    return res.status(500).json({ message: 'Gagal mengambil data transaksi.', error: error.message });
  }
};

const getTransaksiById = async (req, res) => {
  try {
    const transaksi = await Transaksi.findByPk(req.params.id, {
      include: [
        { model: User, as: 'user', attributes: ['id', 'name', 'email', 'phone', 'address'] },
        { model: BankSampah, as: 'bank_sampah' },
        {
          model: DetailTransaksi,
          as: 'detail_transaksi',
          include: [{ model: JenisSampah, as: 'jenis_sampah', include: [{ model: KategoriSampah, as: 'kategori' }] }]
        }
      ]
    });

    if (!transaksi) {
      return res.status(404).json({ message: 'Transaksi tidak ditemukan.' });
    }

    // Role check
    if (req.user.role === 'masyarakat' && transaksi.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Akses ditolak.' });
    }

    return res.status(200).json({ data: transaksi });
  } catch (error) {
    return res.status(500).json({ message: 'Gagal mengambil detail transaksi.', error: error.message });
  }
};

const createTransaksi = async (req, res) => {
  try {
    const { bank_sampah_id, items, catatan, metode_penyerahan, alamat_penjemputan } = req.body;

    if (!bank_sampah_id || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Bank Sampah dan daftar item sampah wajib diisi.' });
    }

    const bank = await BankSampah.findByPk(bank_sampah_id);
    if (!bank) {
      return res.status(404).json({ message: 'Bank Sampah tidak ditemukan.' });
    }

    // Generate transaction code TRX-YYYYMMDD-XXXX
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const kode_transaksi = `TRX-${dateStr}-${randomNum}`;

    let total_berat = 0;
    let total_harga = 0;
    const detailItemsToCreate = [];

    for (const item of items) {
      const jenis = await JenisSampah.findByPk(item.jenis_sampah_id);
      if (!jenis) continue;

      const berat = parseFloat(item.berat) || 0;
      const harga_per_kg = item.harga_per_kg !== undefined ? parseFloat(item.harga_per_kg) : parseFloat(jenis.harga_per_kg);
      const subtotal = berat * harga_per_kg;

      total_berat += berat;
      total_harga += subtotal;

      detailItemsToCreate.push({
        jenis_sampah_id: jenis.id,
        berat,
        harga_per_kg,
        subtotal
      });
    }

    const finalMetode = ['Jemput di Alamat', 'Diantar ke Bank Sampah'].includes(metode_penyerahan)
      ? metode_penyerahan
      : 'Jemput di Alamat';

    const finalAlamat = (alamat_penjemputan && alamat_penjemputan.trim() !== '')
      ? alamat_penjemputan
      : (req.user.address || 'Alamat belum diatur');

    const newTransaksi = await Transaksi.create({
      user_id: req.user.id,
      bank_sampah_id,
      kode_transaksi,
      tanggal_transaksi: new Date(),
      total_berat,
      total_harga,
      metode_penyerahan: finalMetode,
      alamat_penjemputan: finalAlamat,
      status: 'Menunggu',
      catatan: catatan || ''
    });

    const details = detailItemsToCreate.map(d => ({
      ...d,
      transaksi_id: newTransaksi.id
    }));

    await DetailTransaksi.bulkCreate(details);

    const createdRecord = await Transaksi.findByPk(newTransaksi.id, {
      include: [
        { model: User, as: 'user', attributes: ['id', 'name', 'email', 'phone', 'address'] },
        { model: BankSampah, as: 'bank_sampah' },
        {
          model: DetailTransaksi,
          as: 'detail_transaksi',
          include: [{ model: JenisSampah, as: 'jenis_sampah' }]
        }
      ]
    });

    return res.status(201).json({
      message: 'Permintaan pertukaran sampah berhasil diajukan.',
      data: createdRecord
    });
  } catch (error) {
    return res.status(500).json({ message: 'Gagal membuat transaksi.', error: error.message });
  }
};

const updateStatusTransaksi = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, catatan } = req.body;

    const allowedStatuses = ['Menunggu', 'Diproses', 'Diterima', 'Ditolak', 'Selesai'];
    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Status tidak valid.' });
    }

    const transaksi = await Transaksi.findByPk(id, {
      include: [{ model: BankSampah, as: 'bank_sampah' }]
    });

    if (!transaksi) {
      return res.status(404).json({ message: 'Transaksi tidak ditemukan.' });
    }

    // Authorization check
    if (req.user.role === 'pengelola' && transaksi.bank_sampah.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Anda tidak memiliki akses untuk mengubah transaksi Bank Sampah ini.' });
    }

    transaksi.status = status;
    if (catatan !== undefined) {
      transaksi.catatan = catatan;
    }

    await transaksi.save();

    return res.status(200).json({
      message: `Status transaksi berhasil diperbarui menjadi ${status}.`,
      data: transaksi
    });
  } catch (error) {
    return res.status(500).json({ message: 'Gagal memperbarui status transaksi.', error: error.message });
  }
};

const deleteTransaksi = async (req, res) => {
  try {
    const { id } = req.params;
    const transaksi = await Transaksi.findByPk(id);

    if (!transaksi) {
      return res.status(404).json({ message: 'Transaksi tidak ditemukan.' });
    }

    await DetailTransaksi.destroy({ where: { transaksi_id: id } });
    await transaksi.destroy();

    return res.status(200).json({ message: 'Transaksi berhasil dihapus.' });
  } catch (error) {
    return res.status(500).json({ message: 'Gagal menghapus transaksi.', error: error.message });
  }
};

module.exports = {
  getAllTransaksi,
  getTransaksiById,
  createTransaksi,
  updateStatusTransaksi,
  deleteTransaksi
};
