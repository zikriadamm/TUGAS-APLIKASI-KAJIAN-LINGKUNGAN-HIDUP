const bcrypt = require('bcryptjs');
const { User, BankSampah, KategoriSampah, JenisSampah, BankSampahJenisSampah, Transaksi, DetailTransaksi, Edukasi } = require('../models');

const seedDatabase = async (force = false) => {
  try {
    const jenisCount = await JenisSampah.count();
    if (jenisCount > 0 && !force) {
      console.log(' Database already seeded with Jenis Sampah. Skipping initial seeding.');
      return;
    }

    console.log(' Seeding dummy data for Kota Palu Bank Sampah System...');

    // Clear existing records if re-seeding
    await DetailTransaksi.destroy({ where: {}, truncate: false });
    await Transaksi.destroy({ where: {}, truncate: false });
    await BankSampahJenisSampah.destroy({ where: {}, truncate: false });
    await JenisSampah.destroy({ where: {}, truncate: false });
    await KategoriSampah.destroy({ where: {}, truncate: false });
    await BankSampah.destroy({ where: {}, truncate: false });
    await User.destroy({ where: {}, truncate: false });
    await Edukasi.destroy({ where: {}, truncate: false });

    // 1. Create Users
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const users = await User.bulkCreate([
      {
        name: 'Administrator Palu',
        email: 'admin@palu.go.id',
        password: hashedPassword,
        phone: '081234567890',
        address: 'Jl. Sam Ratulangi No. 1, Kota Palu',
        role: 'admin'
      },
      {
        name: 'Pengelola Bank Sampah Barat',
        email: 'pengelola.barat@banksampah.id',
        password: hashedPassword,
        phone: '085299887766',
        address: 'Jl. Hasanuddin No. 45, Palu Barat',
        role: 'pengelola'
      },
      {
        name: 'Pengelola Bank Sampah Mantikulore',
        email: 'pengelola.mantikulore@banksampah.id',
        password: hashedPassword,
        phone: '081344556677',
        address: 'Jl. Soekarno-Hatta No. 12, Mantikulore',
        role: 'pengelola'
      },
      {
        name: 'Budi Santoso',
        email: 'budi@gmail.com',
        password: hashedPassword,
        phone: '082198765432',
        address: 'Jl. Diponegoro No. 88, Palu Barat',
        role: 'masyarakat'
      },
      {
        name: 'Siti Rahmawati',
        email: 'siti@gmail.com',
        password: hashedPassword,
        phone: '085311223344',
        address: 'Jl. Yos Sudarso No. 15, Palu Timur',
        role: 'masyarakat'
      }
    ]);

    // 2. Create Bank Sampah in Kota Palu
    const bankSampahList = await BankSampah.bulkCreate([
      {
        user_id: users[1].id,
        nama_bank_sampah: 'Bank Sampah Palu Barat Asri',
        alamat: 'Jl. Hasanuddin No. 45, Lere, Palu Barat',
        kecamatan: 'Palu Barat',
        kelurahan: 'Lere',
        latitude: -0.8950,
        longitude: 119.8520,
        nomor_telepon: '085299887766',
        jam_operasional: 'Senin - Sabtu (08:00 - 16:00 WITA)',
        deskripsi: 'Bank Sampah percontohan di Kota Palu Barat yang menerima daur ulang plastik, kertas, dan logam.',
        status: 'aktif'
      },
      {
        user_id: users[2].id,
        nama_bank_sampah: 'Bank Sampah Mantikulore Eco',
        alamat: 'Jl. Soekarno-Hatta No. 12, Tondo, Mantikulore',
        kecamatan: 'Mantikulore',
        kelurahan: 'Tondo',
        latitude: -0.8870,
        longitude: 119.8920,
        nomor_telepon: '081344556677',
        jam_operasional: 'Setiap Hari (08:30 - 17:00 WITA)',
        deskripsi: 'Melayani area perkampungan dan kampus Untad, fokus pada aneka limbah kertas, plastik, dan elektronik.',
        status: 'aktif'
      },
      {
        user_id: users[0].id,
        nama_bank_sampah: 'Bank Sampah Palu Selatan Bersih',
        alamat: 'Jl. Basuki Rahmat No. 78, Birobuli Selatan, Palu Selatan',
        kecamatan: 'Palu Selatan',
        kelurahan: 'Birobuli Selatan',
        latitude: -0.9120,
        longitude: 119.8780,
        nomor_telepon: '082211993344',
        jam_operasional: 'Senin - Jumat (09:00 - 16:30 WITA)',
        deskripsi: 'Bank Sampah terpadu untuk pengolahan sampah kering dan bernilai jual tinggi.',
        status: 'aktif'
      },
      {
        user_id: users[0].id,
        nama_bank_sampah: 'Bank Sampah Palu Timur Mandiri',
        alamat: 'Jl. Yos Sudarso No. 89, Talise, Palu Timur',
        kecamatan: 'Palu Timur',
        kelurahan: 'Talise',
        latitude: -0.8820,
        longitude: 119.8710,
        nomor_telepon: '081299881122',
        jam_operasional: 'Senin - Sabtu (08:00 - 15:00 WITA)',
        deskripsi: 'Pusat daur ulang sampah pesisir dan kawasan publik Palu Timur.',
        status: 'aktif'
      },
      {
        user_id: users[0].id,
        nama_bank_sampah: 'Bank Sampah Tatanga Harmoni',
        alamat: 'Jl. Tavanjuka No. 34, Tatanga, Kota Palu',
        kecamatan: 'Tatanga',
        kelurahan: 'Tavanjuka',
        latitude: -0.9080,
        longitude: 119.8560,
        nomor_telepon: '085188776655',
        jam_operasional: 'Selasa - Minggu (08:00 - 16:00 WITA)',
        deskripsi: 'Bank Sampah berbasis komunitas masyarakat Tatanga.',
        status: 'aktif'
      }
    ]);

    // 3. Create Kategori Sampah
    const kategoriList = await KategoriSampah.bulkCreate([
      { nama_kategori: 'Plastik', deskripsi: 'Botol, gelas, plastik kemasan, dan olahan bahan polimer' },
      { nama_kategori: 'Kertas', deskripsi: 'Kardus, kertas HVS, koran, buku, majalah' },
      { nama_kategori: 'Logam', deskripsi: 'Kaleng aluminium, besi tua, seng, dan tembaga' },
      { nama_kategori: 'Kaca', deskripsi: 'Botol kaca utuh dan pecahan kaca bersih' },
      { nama_kategori: 'Elektronik', deskripsi: 'Kabel bekas, sirkuit, komponen elektronik tua' }
    ]);

    // 4. Create Jenis Sampah (with custom uploaded photos)
    const jenisList = await JenisSampah.bulkCreate([
      {
        kategori_id: kategoriList[0].id,
        nama_sampah: 'Botol Plastik PET (Bersih)',
        deskripsi: 'Botol bening bekas minuman, sudah dilepas label dan dikeringkan',
        gambar: 'https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?w=500&q=80',
        harga_per_kg: 3500.00,
        status: 'aktif'
      },
      {
        kategori_id: kategoriList[0].id,
        nama_sampah: 'Gelas Plastik PP',
        deskripsi: 'Gelas plastik bekas kopi/teh boba bening',
        gambar: '/assets/gelas_plastik.jpg',
        harga_per_kg: 2800.00,
        status: 'aktif'
      },
      {
        kategori_id: kategoriList[0].id,
        nama_sampah: 'Ember & Perabot Plastik HDPE',
        deskripsi: 'Ember pecah, baskom, jeriken bekas yang sudah dibersihkan',
        gambar: '/assets/ember_hdpe.jpg',
        harga_per_kg: 4000.00,
        status: 'aktif'
      },
      {
        kategori_id: kategoriList[1].id,
        nama_sampah: 'Kardus Bekas (Cokelat)',
        deskripsi: 'Kardus kemasan barang, dilipat rapi dan bebas basah',
        gambar: '/assets/kardus_bekas.jpg',
        harga_per_kg: 2200.00,
        status: 'aktif'
      },
      {
        kategori_id: kategoriList[1].id,
        nama_sampah: 'Kertas Koran & HVS',
        deskripsi: 'Koran bekas, majalah, kertas kantor lembaran',
        gambar: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=500&q=80',
        harga_per_kg: 1800.00,
        status: 'aktif'
      },
      {
        kategori_id: kategoriList[2].id,
        nama_sampah: 'Kaleng Aluminium Minuman',
        deskripsi: 'Kaleng softdrink aluminium kempes atau utuh',
        gambar: '/assets/kaleng_aluminium.jpg',
        harga_per_kg: 12000.00,
        status: 'aktif'
      },
      {
        kategori_id: kategoriList[2].id,
        nama_sampah: 'Besi Tua & Seng Bekas',
        deskripsi: 'Potongan besi konstruksi, tiang, seng bangunan bekas',
        gambar: '/assets/besi_tua.jpg',
        harga_per_kg: 4500.00,
        status: 'aktif'
      },
      {
        kategori_id: kategoriList[2].id,
        nama_sampah: 'Tembaga Murni Bekas',
        deskripsi: 'Kawat tembaga kupasan kabel listrik',
        gambar: '/assets/tembaga_murni.jpg',
        harga_per_kg: 75000.00,
        status: 'aktif'
      },
      {
        kategori_id: kategoriList[3].id,
        nama_sampah: 'Botol Kaca Utuh (Sirup/Kecap)',
        deskripsi: 'Botol kecap/sirup/kecap kaca bersih tanpa retak',
        gambar: '/assets/botol_kaca.jpg',
        harga_per_kg: 1500.00,
        status: 'aktif'
      },
      {
        kategori_id: kategoriList[4].id,
        nama_sampah: 'Kabel Bekas & Elektronik Kecil',
        deskripsi: 'Kabel charger, power supply, perangkat elektronik bekas',
        gambar: 'https://images.unsplash.com/photo-1550041473-d296a3a8a18a?w=500&q=80',
        harga_per_kg: 15000.00,
        status: 'aktif'
      }
    ]);

    // 5. Attach accepted jenis_sampah to each Bank Sampah
    for (const bank of bankSampahList) {
      const pivots = jenisList.map(j => ({
        bank_sampah_id: bank.id,
        jenis_sampah_id: j.id,
        harga_per_kg: j.harga_per_kg,
        status: 'aktif'
      }));
      await BankSampahJenisSampah.bulkCreate(pivots);
    }

    // 6. Create Dummy Transactions
    const dummyTransactionsData = [
      {
        user_id: users[3].id,
        bank_sampah_id: bankSampahList[0].id,
        kode_transaksi: 'TRX-20260901-1001',
        tanggal_transaksi: new Date('2026-09-01T10:00:00'),
        total_berat: 15.5,
        total_harga: 54250.00,
        metode_penyerahan: 'Jemput di Alamat',
        alamat_penjemputan: 'Jl. Diponegoro No. 88, Palu Barat',
        status: 'Selesai',
        catatan: 'Diterima dalam kondisi bersih'
      },
      {
        user_id: users[4].id,
        bank_sampah_id: bankSampahList[1].id,
        kode_transaksi: 'TRX-20260902-1002',
        tanggal_transaksi: new Date('2026-09-02T11:30:00'),
        total_berat: 22.0,
        total_harga: 48400.00,
        metode_penyerahan: 'Diantar ke Bank Sampah',
        alamat_penjemputan: 'Diantar langsung ke Bank Sampah',
        status: 'Selesai',
        catatan: 'Penukaran kardus bekas kantor'
      },
      {
        user_id: users[3].id,
        bank_sampah_id: bankSampahList[0].id,
        kode_transaksi: 'TRX-20260904-1003',
        tanggal_transaksi: new Date('2026-09-04T14:15:00'),
        total_berat: 5.0,
        total_harga: 60000.00,
        metode_penyerahan: 'Jemput di Alamat',
        alamat_penjemputan: 'Jl. Diponegoro No. 88, Palu Barat',
        status: 'Diterima',
        catatan: 'Kaleng aluminium 5kg'
      },
      {
        user_id: users[4].id,
        bank_sampah_id: bankSampahList[2].id,
        kode_transaksi: 'TRX-20260905-1004',
        tanggal_transaksi: new Date('2026-09-05T09:00:00'),
        total_berat: 12.0,
        total_harga: 42000.00,
        metode_penyerahan: 'Jemput di Alamat',
        alamat_penjemputan: 'Jl. Yos Sudarso No. 15, Palu Timur',
        status: 'Diproses',
        catatan: 'Tim penjemputan sedang diperjalanan'
      },
      {
        user_id: users[3].id,
        bank_sampah_id: bankSampahList[1].id,
        kode_transaksi: 'TRX-20260907-1005',
        tanggal_transaksi: new Date('2026-09-07T16:00:00'),
        total_berat: 8.5,
        total_harga: 29750.00,
        metode_penyerahan: 'Diantar ke Bank Sampah',
        alamat_penjemputan: 'Diantar langsung ke Bank Sampah',
        status: 'Menunggu',
        catatan: 'Menunggu konfirmasi kedatangan'
      },
      {
        user_id: users[4].id,
        bank_sampah_id: bankSampahList[3].id,
        kode_transaksi: 'TRX-20260908-1006',
        tanggal_transaksi: new Date('2026-09-08T08:30:00'),
        total_berat: 30.0,
        total_harga: 135000.00,
        metode_penyerahan: 'Jemput di Alamat',
        alamat_penjemputan: 'Jl. Yos Sudarso No. 15, Palu Timur',
        status: 'Selesai',
        catatan: 'Besi tua bekas renovasi'
      },
      {
        user_id: users[3].id,
        bank_sampah_id: bankSampahList[4].id,
        kode_transaksi: 'TRX-20260908-1007',
        tanggal_transaksi: new Date('2026-09-08T13:00:00'),
        total_berat: 10.0,
        total_harga: 35000.00,
        metode_penyerahan: 'Jemput di Alamat',
        alamat_penjemputan: 'Jl. Diponegoro No. 88, Palu Barat',
        status: 'Menunggu',
        catatan: 'Botol plastik PET'
      },
      {
        user_id: users[4].id,
        bank_sampah_id: bankSampahList[0].id,
        kode_transaksi: 'TRX-20260825-1008',
        tanggal_transaksi: new Date('2026-08-25T10:00:00'),
        total_berat: 18.0,
        total_harga: 63000.00,
        metode_penyerahan: 'Diantar ke Bank Sampah',
        alamat_penjemputan: 'Diantar langsung ke Bank Sampah',
        status: 'Selesai',
        catatan: 'Transaksi bulan Agustus'
      },
      {
        user_id: users[3].id,
        bank_sampah_id: bankSampahList[2].id,
        kode_transaksi: 'TRX-20260828-1009',
        tanggal_transaksi: new Date('2026-08-28T15:20:00'),
        total_berat: 40.0,
        total_harga: 88000.00,
        metode_penyerahan: 'Jemput di Alamat',
        alamat_penjemputan: 'Jl. Diponegoro No. 88, Palu Barat',
        status: 'Selesai',
        catatan: 'Kardus tebal'
      },
      {
        user_id: users[4].id,
        bank_sampah_id: bankSampahList[1].id,
        kode_transaksi: 'TRX-20260908-1010',
        tanggal_transaksi: new Date('2026-09-08T15:00:00'),
        total_berat: 2.0,
        total_harga: 150000.00,
        metode_penyerahan: 'Jemput di Alamat',
        alamat_penjemputan: 'Jl. Yos Sudarso No. 15, Palu Timur',
        status: 'Diterima',
        catatan: 'Tembaga murni 2kg'
      }
    ];

    const createdTrx = await Transaksi.bulkCreate(dummyTransactionsData);

    // Detail Items for each transaction
    await DetailTransaksi.bulkCreate([
      { transaksi_id: createdTrx[0].id, jenis_sampah_id: jenisList[0].id, berat: 15.5, harga_per_kg: 3500.00, subtotal: 54250.00 },
      { transaksi_id: createdTrx[1].id, jenis_sampah_id: jenisList[3].id, berat: 22.0, harga_per_kg: 2200.00, subtotal: 48400.00 },
      { transaksi_id: createdTrx[2].id, jenis_sampah_id: jenisList[5].id, berat: 5.0, harga_per_kg: 12000.00, subtotal: 60000.00 },
      { transaksi_id: createdTrx[3].id, jenis_sampah_id: jenisList[0].id, berat: 12.0, harga_per_kg: 3500.00, subtotal: 42000.00 },
      { transaksi_id: createdTrx[4].id, jenis_sampah_id: jenisList[0].id, berat: 8.5, harga_per_kg: 3500.00, subtotal: 29750.00 },
      { transaksi_id: createdTrx[5].id, jenis_sampah_id: jenisList[6].id, berat: 30.0, harga_per_kg: 4500.00, subtotal: 135000.00 },
      { transaksi_id: createdTrx[6].id, jenis_sampah_id: jenisList[0].id, berat: 10.0, harga_per_kg: 3500.00, subtotal: 35000.00 },
      { transaksi_id: createdTrx[7].id, jenis_sampah_id: jenisList[0].id, berat: 18.0, harga_per_kg: 3500.00, subtotal: 63000.00 },
      { transaksi_id: createdTrx[8].id, jenis_sampah_id: jenisList[3].id, berat: 40.0, harga_per_kg: 2200.00, subtotal: 88000.00 },
      { transaksi_id: createdTrx[9].id, jenis_sampah_id: jenisList[7].id, berat: 2.0, harga_per_kg: 75000.00, subtotal: 150000.00 }
    ]);

    // 7. Create Edukasi Articles
    await Edukasi.bulkCreate([
      {
        judul: 'Panduan Memilah Sampah Rumah Tangga di Kota Palu',
        konten: 'Memilah sampah berdasarkan jenisnya (plastik, kertas, kaca, logam) adalah langkah awal menjaga lingkungan Kota Palu tetap bersih dan hijau. Pastikan sampah botol plastik telah dibilas dan dikeringkan sebelum dibawa ke Bank Sampah terdekat.',
        gambar: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&q=80',
        kategori: 'Edukasi Lingkungan'
      },
      {
        judul: 'Mengubah Sampah Plastik Menjadi Cuan dan Saldo Ekonomi',
        konten: 'Tahukah Anda bahwa botol plastik jenis PET dan perabot HDPE memiliki nilai ekonomis tinggi di Kota Palu? Dengan menyetorkannya ke Bank Sampah mitra, Anda tidak hanya membantu daur ulang tetapi juga mengumpulkan penghasilan tambahan secara konsisten.',
        gambar: 'https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?w=600&q=80',
        kategori: 'Ekonomi Sirkular'
      },
      {
        judul: 'Peran Masyarakat Kota Palu Dalam Menjaga Teluk Palu Bebas Sampah Plastik',
        konten: 'Pencemaran laut dan pesisir Teluk Palu dapat dicegah melalui sistem pengelolaan Bank Sampah yang terpadu. Kolaborasi masyarakat dan pengelola Bank Sampah merupakan kunci keberlanjutan lingkungan kota kita.',
        gambar: 'https://images.unsplash.com/photo-1621451537084-482c73073a0f?w=600&q=80',
        kategori: 'Kawasan Pesisir'
      }
    ]);

    console.log(' Database seed successfully completed!');
  } catch (error) {
    console.error(' Error seeding database:', error.message);
  }
};

module.exports = seedDatabase;
