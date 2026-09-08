-- ============================================================
-- SQL DUMP FOR BANK SAMPAH KOTA PALU DATABASE
-- Database: bank_sampah_palu
-- Target Server: MySQL 5.7+ / 8.0+ / MariaDB
-- ============================================================

CREATE DATABASE IF NOT EXISTS `bank_sampah_palu` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `bank_sampah_palu`;

-- ------------------------------------------------------------
-- 1. Table structure for `users`
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `detail_transaksi`;
DROP TABLE IF EXISTS `transaksi`;
DROP TABLE IF EXISTS `bank_sampah_jenis_sampah`;
DROP TABLE IF EXISTS `jenis_sampah`;
DROP TABLE IF EXISTS `kategori_sampah`;
DROP TABLE IF EXISTS `bank_sampah`;
DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `edukasi`;

CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(50) DEFAULT NULL,
  `address` TEXT DEFAULT NULL,
  `role` ENUM('admin', 'pengelola', 'masyarakat') NOT NULL DEFAULT 'masyarakat',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- 2. Table structure for `bank_sampah`
-- ------------------------------------------------------------
CREATE TABLE `bank_sampah` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT DEFAULT NULL,
  `nama_bank_sampah` VARCHAR(255) NOT NULL,
  `alamat` TEXT NOT NULL,
  `kecamatan` VARCHAR(100) NOT NULL,
  `kelurahan` VARCHAR(100) DEFAULT NULL,
  `latitude` DOUBLE NOT NULL,
  `longitude` DOUBLE NOT NULL,
  `nomor_telepon` VARCHAR(50) DEFAULT NULL,
  `jam_operasional` VARCHAR(100) DEFAULT NULL,
  `deskripsi` TEXT DEFAULT NULL,
  `status` ENUM('aktif', 'nonaktif') DEFAULT 'aktif',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_bank_sampah_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- 3. Table structure for `kategori_sampah`
-- ------------------------------------------------------------
CREATE TABLE `kategori_sampah` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nama_kategori` VARCHAR(100) NOT NULL,
  `deskripsi` TEXT DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- 4. Table structure for `jenis_sampah`
-- ------------------------------------------------------------
CREATE TABLE `jenis_sampah` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `kategori_id` INT NOT NULL,
  `nama_sampah` VARCHAR(255) NOT NULL,
  `deskripsi` TEXT DEFAULT NULL,
  `gambar` VARCHAR(500) DEFAULT NULL,
  `harga_per_kg` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `status` ENUM('aktif', 'nonaktif') DEFAULT 'aktif',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_jenis_kategori` FOREIGN KEY (`kategori_id`) REFERENCES `kategori_sampah` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- 5. Table structure for `bank_sampah_jenis_sampah`
-- ------------------------------------------------------------
CREATE TABLE `bank_sampah_jenis_sampah` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `bank_sampah_id` INT NOT NULL,
  `jenis_sampah_id` INT NOT NULL,
  `harga_per_kg` DECIMAL(12,2) DEFAULT NULL,
  `status` ENUM('aktif', 'nonaktif') DEFAULT 'aktif',
  CONSTRAINT `fk_pivot_bank` FOREIGN KEY (`bank_sampah_id`) REFERENCES `bank_sampah` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_pivot_jenis` FOREIGN KEY (`jenis_sampah_id`) REFERENCES `jenis_sampah` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- 6. Table structure for `transaksi`
-- ------------------------------------------------------------
CREATE TABLE `transaksi` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `bank_sampah_id` INT NOT NULL,
  `kode_transaksi` VARCHAR(100) NOT NULL UNIQUE,
  `tanggal_transaksi` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `total_berat` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `total_harga` DECIMAL(14,2) NOT NULL DEFAULT 0.00,
  `metode_penyerahan` VARCHAR(100) NOT NULL DEFAULT 'Jemput di Alamat',
  `alamat_penjemputan` TEXT DEFAULT NULL,
  `status` ENUM('Menunggu', 'Diproses', 'Diterima', 'Ditolak', 'Selesai') NOT NULL DEFAULT 'Menunggu',
  `catatan` TEXT DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_transaksi_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_transaksi_bank` FOREIGN KEY (`bank_sampah_id`) REFERENCES `bank_sampah` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- 7. Table structure for `detail_transaksi`
-- ------------------------------------------------------------
CREATE TABLE `detail_transaksi` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `transaksi_id` INT NOT NULL,
  `jenis_sampah_id` INT NOT NULL,
  `berat` DECIMAL(10,2) NOT NULL,
  `harga_per_kg` DECIMAL(12,2) NOT NULL,
  `subtotal` DECIMAL(14,2) NOT NULL,
  CONSTRAINT `fk_detail_transaksi` FOREIGN KEY (`transaksi_id`) REFERENCES `transaksi` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_detail_jenis` FOREIGN KEY (`jenis_sampah_id`) REFERENCES `jenis_sampah` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- 8. Table structure for `edukasi`
-- ------------------------------------------------------------
CREATE TABLE `edukasi` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `judul` VARCHAR(255) NOT NULL,
  `konten` TEXT NOT NULL,
  `gambar` VARCHAR(500) DEFAULT NULL,
  `kategori` VARCHAR(100) DEFAULT 'Daur Ulang',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- DUMMY DATA SEEDING (KOTA PALU)
-- Password for all accounts: password123
-- ============================================================

INSERT INTO `users` (`id`, `name`, `email`, `password`, `phone`, `address`, `role`) VALUES
(1, 'Administrator Palu', 'admin@palu.go.id', '$2a$10$wE1F...hashedpassword', '081234567890', 'Jl. Sam Ratulangi No. 1, Kota Palu', 'admin'),
(2, 'Pengelola Bank Sampah Barat', 'pengelola.barat@banksampah.id', '$2a$10$wE1F...hashedpassword', '085299887766', 'Jl. Hasanuddin No. 45, Palu Barat', 'pengelola'),
(3, 'Pengelola Bank Sampah Mantikulore', 'pengelola.mantikulore@banksampah.id', '$2a$10$wE1F...hashedpassword', '081344556677', 'Jl. Soekarno-Hatta No. 12, Mantikulore', 'pengelola'),
(4, 'Budi Santoso', 'budi@gmail.com', '$2a$10$wE1F...hashedpassword', '082198765432', 'Jl. Diponegoro No. 88, Palu Barat', 'masyarakat'),
(5, 'Siti Rahmawati', 'siti@gmail.com', '$2a$10$wE1F...hashedpassword', '085311223344', 'Jl. Yos Sudarso No. 15, Palu Timur', 'masyarakat');

INSERT INTO `bank_sampah` (`id`, `user_id`, `nama_bank_sampah`, `alamat`, `kecamatan`, `kelurahan`, `latitude`, `longitude`, `nomor_telepon`, `jam_operasional`, `deskripsi`, `status`) VALUES
(1, 2, 'Bank Sampah Palu Barat Asri', 'Jl. Hasanuddin No. 45, Lere, Palu Barat', 'Palu Barat', 'Lere', -0.8950, 119.8520, '085299887766', 'Senin - Sabtu (08:00 - 16:00 WITA)', 'Bank Sampah percontohan di Kota Palu Barat yang menerima daur ulang plastik, kertas, dan logam.', 'aktif'),
(2, 3, 'Bank Sampah Mantikulore Eco', 'Jl. Soekarno-Hatta No. 12, Tondo, Mantikulore', 'Mantikulore', 'Tondo', -0.8870, 119.8920, '081344556677', 'Setiap Hari (08:30 - 17:00 WITA)', 'Melayani area perkampungan dan kampus Untad, fokus pada aneka limbah kertas, plastik, dan elektronik.', 'aktif'),
(3, 1, 'Bank Sampah Palu Selatan Bersih', 'Jl. Basuki Rahmat No. 78, Birobuli Selatan, Palu Selatan', 'Palu Selatan', 'Birobuli Selatan', -0.9120, 119.8780, '082211993344', 'Senin - Jumat (09:00 - 16:30 WITA)', 'Bank Sampah terpadu untuk pengolahan sampah kering dan bernilai jual tinggi.', 'aktif'),
(4, 1, 'Bank Sampah Palu Timur Mandiri', 'Jl. Yos Sudarso No. 89, Talise, Palu Timur', 'Palu Timur', 'Talise', -0.8820, 119.8710, '081299881122', 'Senin - Sabtu (08:00 - 15:00 WITA)', 'Pusat daur ulang sampah pesisir dan kawasan publik Palu Timur.', 'aktif'),
(5, 1, 'Bank Sampah Tatanga Harmoni', 'Jl. Tavanjuka No. 34, Tatanga, Kota Palu', 'Tatanga', 'Tavanjuka', -0.9080, 119.8560, '085188776655', 'Selasa - Minggu (08:00 - 16:00 WITA)', 'Bank Sampah berbasis komunitas masyarakat Tatanga.', 'aktif');

INSERT INTO `kategori_sampah` (`id`, `nama_kategori`, `deskripsi`) VALUES
(1, 'Plastik', 'Botol, gelas, plastik kemasan, dan olahan bahan polimer'),
(2, 'Kertas', 'Kardus, kertas HVS, koran, buku, majalah'),
(3, 'Logam', 'Kaleng aluminium, besi tua, seng, dan tembaga'),
(4, 'Kaca', 'Botol kaca utuh dan pecahan kaca bersih'),
(5, 'Elektronik', 'Kabel bekas, sirkuit, komponen elektronik tua');

INSERT INTO `jenis_sampah` (`id`, `kategori_id`, `nama_sampah`, `deskripsi`, `gambar`, `harga_per_kg`, `status`) VALUES
(1, 1, 'Botol Plastik PET (Bersih)', 'Botol bening bekas minuman, sudah dilepas label dan dikeringkan', 'https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?w=500&q=80', 3500.00, 'aktif'),
(2, 1, 'Gelas Plastik PP', 'Gelas plastik bekas kopi/teh boba bening', '/assets/gelas_plastik.jpg', 2800.00, 'aktif'),
(3, 1, 'Ember & Perabot Plastik HDPE', 'Ember pecah, baskom, jeriken bekas yang sudah dibersihkan', '/assets/ember_hdpe.jpg', 4000.00, 'aktif'),
(4, 2, 'Kardus Bekas (Cokelat)', 'Kardus kemasan barang, dilipat rapi dan bebas basah', '/assets/kardus_bekas.jpg', 2200.00, 'aktif'),
(5, 2, 'Kertas Koran & HVS', 'Koran bekas, majalah, kertas kantor lembaran', 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=500&q=80', 1800.00, 'aktif'),
(6, 3, 'Kaleng Aluminium Minuman', 'Kaleng softdrink aluminium kempes atau utuh', '/assets/kaleng_aluminium.jpg', 12000.00, 'aktif'),
(7, 3, 'Besi Tua & Seng Bekas', 'Potongan besi konstruksi, tiang, seng bangunan bekas', '/assets/besi_tua.jpg', 4500.00, 'aktif'),
(8, 3, 'Tembaga Murni Bekas', 'Kawat tembaga kupasan kabel listrik', '/assets/tembaga_murni.jpg', 75000.00, 'aktif'),
(9, 4, 'Botol Kaca Utuh (Sirup/Kecap)', 'Botol kecap/sirup/kecap kaca bersih tanpa retak', '/assets/botol_kaca.jpg', 1500.00, 'aktif'),
(10, 5, 'Kabel Bekas & Elektronik Kecil', 'Kabel charger, power supply, perangkat elektronik bekas', 'https://images.unsplash.com/photo-1550041473-d296a3a8a18a?w=500&q=80', 15000.00, 'aktif');

INSERT INTO `transaksi` (`id`, `user_id`, `bank_sampah_id`, `kode_transaksi`, `tanggal_transaksi`, `total_berat`, `total_harga`, `metode_penyerahan`, `alamat_penjemputan`, `status`, `catatan`) VALUES
(1, 4, 1, 'TRX-20260901-1001', '2026-09-01 10:00:00', 15.50, 54250.00, 'Jemput di Alamat', 'Jl. Diponegoro No. 88, Palu Barat', 'Selesai', 'Diterima dalam kondisi bersih'),
(2, 5, 2, 'TRX-20260902-1002', '2026-09-02 11:30:00', 22.00, 48400.00, 'Diantar ke Bank Sampah', 'Diantar langsung ke Bank Sampah', 'Selesai', 'Penukaran kardus bekas kantor'),
(3, 4, 1, 'TRX-20260904-1003', '2026-09-04 14:15:00', 5.00, 60000.00, 'Jemput di Alamat', 'Jl. Diponegoro No. 88, Palu Barat', 'Diterima', 'Kaleng aluminium 5kg'),
(4, 5, 3, 'TRX-20260905-1004', '2026-09-05 09:00:00', 12.00, 42000.00, 'Jemput di Alamat', 'Jl. Yos Sudarso No. 15, Palu Timur', 'Diproses', 'Tim penjemputan sedang diperjalanan'),
(5, 4, 2, 'TRX-20260907-1005', '2026-09-07 16:00:00', 8.50, 29750.00, 'Diantar ke Bank Sampah', 'Diantar langsung ke Bank Sampah', 'Menunggu', 'Menunggu konfirmasi kedatangan');

INSERT INTO `detail_transaksi` (`id`, `transaksi_id`, `jenis_sampah_id`, `berat`, `harga_per_kg`, `subtotal`) VALUES
(1, 1, 1, 15.50, 3500.00, 54250.00),
(2, 2, 4, 22.00, 2200.00, 48400.00),
(3, 3, 6, 5.00, 12000.00, 60000.00),
(4, 4, 1, 12.00, 3500.00, 42000.00),
(5, 5, 1, 8.50, 3500.00, 29750.00);

INSERT INTO `edukasi` (`id`, `judul`, `konten`, `gambar`, `kategori`) VALUES
(1, 'Panduan Memilah Sampah Rumah Tangga di Kota Palu', 'Memilah sampah berdasarkan jenisnya adalah langkah awal menjaga lingkungan Kota Palu tetap bersih.', 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&q=80', 'Edukasi Lingkungan'),
(2, 'Mengubah Sampah Plastik Menjadi Cuan dan Saldo Ekonomi', 'Tahukah Anda bahwa botol plastik jenis PET dan perabot HDPE memiliki nilai ekonomis tinggi?', 'https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?w=600&q=80', 'Ekonomi Sirkular'),
(3, 'Peran Masyarakat Kota Palu Dalam Menjaga Teluk Palu', 'Pencemaran laut dan pesisir Teluk Palu dapat dicegah melalui sistem pengelolaan Bank Sampah terpadu.', 'https://images.unsplash.com/photo-1621451537084-482c73073a0f?w=600&q=80', 'Kawasan Pesisir');
