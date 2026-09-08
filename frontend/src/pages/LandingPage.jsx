import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { bankSampahService, jenisSampahService, edukasiService } from '../services/api';
import MapComponent from '../components/MapComponent';
import ExchangeModal from '../components/ExchangeModal';
import {
  Recycle,
  MapPin,
  TrendingUp,
  ShieldCheck,
  Coins,
  ArrowRight,
  Search,
  CheckCircle,
  BookOpen,
  Sparkles,
  Phone,
  Clock
} from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const [bankList, setBankList] = useState([]);
  const [jenisList, setJenisList] = useState([]);
  const [edukasiList, setEdukasiList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBankId, setSelectedBankId] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [bRes, jRes, eRes] = await Promise.all([
        bankSampahService.getAll({ status: 'aktif' }),
        jenisSampahService.getAll({ status: 'aktif' }),
        edukasiService.getAll()
      ]);
      setBankList(bRes.data || []);
      setJenisList(jRes.data || []);
      setEdukasiList(eRes.data || []);
    } catch (err) {
      console.error('Error loading landing page data:', err);
    }
  };

  const openExchangeWithBank = (bankId) => {
    setSelectedBankId(bankId);
    setIsModalOpen(true);
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-900 via-emerald-800 to-green-900 text-white pt-12 pb-24 lg:pt-20 lg:pb-32">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#66BB6A_1px,transparent_1px)] [background-size:16px_16px]"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-700/60 border border-emerald-500/30 text-emerald-200 text-xs font-bold uppercase tracking-wider backdrop-blur-xs">
                <Sparkles className="w-4 h-4 text-emerald-300" />
                <span>Sistem Informasi Bank Sampah Kota Palu</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-white">
                Kelola Sampah, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-green-200 to-teal-300">
                  Ciptakan Nilai Ekonomi
                </span>
              </h1>

              <p className="text-base sm:text-lg text-emerald-100/90 max-w-2xl leading-relaxed">
                Platform digital terpadu untuk memantau keberadaan Bank Sampah dan membantu masyarakat Kota Palu mengubah limbah rumah tangga menjadi pendapatan bernilai ekonomi.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center lg:justify-start">
                <Link
                  to="/peta"
                  className="px-7 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-2xl shadow-lg shadow-emerald-950/40 flex items-center justify-center gap-2 transition-all hover:scale-103"
                >
                  <Search className="w-5 h-5" />
                  <span>Cari Bank Sampah</span>
                </Link>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="px-7 py-4 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold rounded-2xl backdrop-blur-xs flex items-center justify-center gap-2 transition-all hover:scale-103"
                >
                  <Coins className="w-5 h-5 text-emerald-300" />
                  <span>Mulai Tukar Sampah</span>
                </button>
              </div>

              {/* Trust Badges */}
              <div className="pt-8 border-t border-emerald-700/50 grid grid-cols-3 gap-4 text-left">
                <div>
                  <h4 className="text-2xl lg:text-3xl font-extrabold text-emerald-300">5+</h4>
                  <p className="text-xs text-emerald-100">Bank Sampah Mitra</p>
                </div>
                <div>
                  <h4 className="text-2xl lg:text-3xl font-extrabold text-emerald-300">10+</h4>
                  <p className="text-xs text-emerald-100">Jenis Sampah Ekonomi</p>
                </div>
                <div>
                  <h4 className="text-2xl lg:text-3xl font-extrabold text-emerald-300">8</h4>
                  <p className="text-xs text-emerald-100">Kecamatan di Palu</p>
                </div>
              </div>
            </div>

            {/* Right Card / Visual Illustration */}
            <div className="lg:col-span-5">
              <div className="relative bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 shadow-2xl space-y-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500 text-slate-900 flex items-center justify-center font-bold">
                      <Recycle className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-base">Kota Palu Bersih</h3>
                      <p className="text-xs text-emerald-200">Gerakan Bebas Sampah 2026</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-semibold rounded-full border border-emerald-400/30">
                    Aktif
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="bg-white/10 p-3.5 rounded-2xl flex justify-between items-center text-sm">
                    <span className="text-emerald-100">Botol Plastik PET</span>
                    <span className="font-bold text-emerald-300">Rp3.500 / Kg</span>
                  </div>
                  <div className="bg-white/10 p-3.5 rounded-2xl flex justify-between items-center text-sm">
                    <span className="text-emerald-100">Kaleng Aluminium</span>
                    <span className="font-bold text-emerald-300">Rp12.000 / Kg</span>
                  </div>
                  <div className="bg-white/10 p-3.5 rounded-2xl flex justify-between items-center text-sm">
                    <span className="text-emerald-100">Kardus Bekas</span>
                    <span className="font-bold text-emerald-300">Rp2.200 / Kg</span>
                  </div>
                </div>

                <button
                  onClick={() => setIsModalOpen(true)}
                  className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-green-400 text-slate-950 font-extrabold text-sm rounded-xl text-center shadow-md transition-all hover:opacity-90"
                >
                  Tukarkan Sampah Anda Sekarang
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* QUICK MAP SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-100 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Peta Digital Bank Sampah</span>
              <h2 className="text-2xl font-extrabold text-slate-800">Lokasi Bank Sampah Kota Palu</h2>
            </div>
            <Link
              to="/peta"
              className="inline-flex items-center gap-2 text-emerald-600 font-bold text-sm hover:text-emerald-700"
            >
              <span>Buka Peta Mode Layar Penuh</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <MapComponent bankSampahList={bankList} height="400px" />
        </div>
      </section>

      {/* ECONOMIC TRASH CATALOG PREVIEW */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-extrabold text-emerald-600 uppercase tracking-wider bg-emerald-100 px-3 py-1 rounded-full">
            Nilai Ekonomi Sampah
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3">
            Jenis Sampah Bernilai Jual di Kota Palu
          </h2>
          <p className="text-slate-600 mt-3 text-base">
            Daftar harga standar sampah per kilogram yang siap dibeli oleh Bank Sampah mitra kami.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {jenisList.slice(0, 8).map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs hover:shadow-lg transition-all group flex flex-col justify-between"
            >
              <div>
                {item.gambar && (
                  <img
                    src={item.gambar}
                    alt={item.nama_sampah}
                    className="w-full h-40 object-cover rounded-xl mb-4 group-hover:scale-102 transition-transform"
                  />
                )}
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                  {item.kategori ? item.kategori.nama_kategori : 'Daur Ulang'}
                </span>
                <h3 className="font-bold text-slate-800 text-lg mt-2 line-clamp-1">{item.nama_sampah}</h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{item.deskripsi}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">Harga per Kg</span>
                  <span className="text-lg font-extrabold text-emerald-700">
                    Rp{parseFloat(item.harga_per_kg).toLocaleString('id-ID')}
                  </span>
                </div>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="p-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-colors"
                  title="Tukar jenis sampah ini"
                >
                  <Coins className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            to="/jenis-sampah"
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors text-sm"
          >
            <span>Lihat Semua Katalog & Harga</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* BANK SAMPAH MITRA LIST */}
      <section className="py-16 bg-emerald-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">Jaringan Bank Sampah</span>
              <h2 className="text-3xl font-extrabold text-white mt-1">Bank Sampah Aktif di Kota Palu</h2>
            </div>
            <Link to="/bank-sampah" className="text-emerald-300 font-bold text-sm hover:underline mt-2 md:mt-0">
              Lihat Seluruh Daftar Bank Sampah →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {bankList.slice(0, 3).map((bank) => (
              <div key={bank.id} className="bg-emerald-800/80 rounded-2xl p-6 border border-emerald-700/60 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-200 text-xs font-semibold rounded-lg border border-emerald-400/30">
                      Kec. {bank.kecamatan}
                    </span>
                    <span className="text-xs text-emerald-300 font-medium">{bank.jam_operasional}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{bank.nama_bank_sampah}</h3>
                  <p className="text-xs text-emerald-100 flex items-start gap-1.5 mb-4">
                    <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{bank.alamat}</span>
                  </p>
                </div>

                <button
                  onClick={() => openExchangeWithBank(bank.id)}
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Pilih Bank Sampah Ini</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EDUKASI & NEWS PREVIEW */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Edukasi Lingkungan</span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-1">Artikel & Panduan Pengelolaan Sampah</h2>
          </div>
          <Link to="/edukasi" className="text-emerald-600 font-bold text-sm hover:underline mt-2 md:mt-0">
            Lihat Artikel Lainnya →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {edukasiList.slice(0, 3).map((item) => (
            <div key={item.id} className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-xs hover:shadow-md transition-shadow">
              {item.gambar && (
                <img src={item.gambar} alt={item.judul} className="w-full h-48 object-cover" />
              )}
              <div className="p-6">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
                  {item.kategori}
                </span>
                <h3 className="font-bold text-slate-800 text-lg mt-3 line-clamp-2">{item.judul}</h3>
                <p className="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed">{item.konten}</p>
                <Link
                  to={`/edukasi/${item.id}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 mt-4 hover:gap-2 transition-all"
                >
                  <span>Baca Selengkapnya</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Exchange Modal */}
      <ExchangeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialBankId={selectedBankId}
      />

    </div>
  );
}
