import React, { useState, useEffect } from 'react';
import { jenisSampahService, kategoriSampahService } from '../services/api';
import ExchangeModal from '../components/ExchangeModal';
import { Tag, Search, Filter, Coins, CheckCircle, ArrowRight } from 'lucide-react';

export default function JenisSampahPage() {
  const [jenisList, setJenisList] = useState([]);
  const [kategoriList, setKategoriList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);

  const [selectedKategoriId, setSelectedKategoriId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterData();
  }, [selectedKategoriId, searchQuery, jenisList]);

  const loadData = async () => {
    try {
      const [jRes, kRes] = await Promise.all([
        jenisSampahService.getAll({ status: 'aktif' }),
        kategoriSampahService.getAll()
      ]);
      setJenisList(jRes.data || []);
      setKategoriList(kRes.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const filterData = () => {
    let list = [...jenisList];

    if (selectedKategoriId) {
      list = list.filter(item => item.kategori_id === parseInt(selectedKategoriId));
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(item =>
        item.nama_sampah.toLowerCase().includes(q) ||
        (item.deskripsi && item.deskripsi.toLowerCase().includes(q))
      );
    }

    setFilteredList(list);
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-green-700 text-white py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-300 bg-emerald-900/60 px-3 py-1 rounded-full border border-emerald-500/30">
            Katalog Ekonomi Sirkular
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white mt-2">
            Jenis Sampah Bernilai Ekonomi di Kota Palu
          </h1>
          <p className="text-emerald-100 text-sm sm:text-base mt-2 max-w-3xl">
            Kenali daftar lengkap jenis sampah kering yang dapat ditukarkan menjadi saldo uang tunai atau tabungan di Bank Sampah mitra.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        
        {/* Filter Controls */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200/80 flex flex-col md:flex-row justify-between items-center gap-4">
          
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedKategoriId('')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedKategoriId === ''
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Semua Kategori
            </button>

            {kategoriList.map((kat) => (
              <button
                key={kat.id}
                onClick={() => setSelectedKategoriId(kat.id.toString())}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedKategoriId === kat.id.toString()
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {kat.nama_kategori}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Cari nama sampah..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

        </div>

        {/* Grid Display */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredList.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs hover:shadow-xl transition-all flex flex-col justify-between group"
            >
              <div>
                {item.gambar ? (
                  <img
                    src={item.gambar}
                    alt={item.nama_sampah}
                    className="w-full h-48 object-cover rounded-2xl mb-4 group-hover:scale-102 transition-transform"
                  />
                ) : (
                  <div className="w-full h-48 bg-emerald-50 rounded-2xl mb-4 flex items-center justify-center text-emerald-600">
                    <Coins className="w-12 h-12" />
                  </div>
                )}

                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-100/70 px-2.5 py-1 rounded-lg">
                    {item.kategori ? item.kategori.nama_kategori : 'Kategori Sampah'}
                  </span>
                  <span className="text-xs font-semibold text-emerald-600">Aktif Diterima</span>
                </div>

                <h3 className="font-bold text-slate-900 text-xl leading-snug">{item.nama_sampah}</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">{item.deskripsi}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Estimasi Harga Standard</span>
                  <span className="text-2xl font-black text-emerald-700">
                    Rp{parseFloat(item.harga_per_kg).toLocaleString('id-ID')}
                    <span className="text-xs font-medium text-slate-500"> / Kg</span>
                  </span>
                </div>

                <button
                  onClick={() => setIsModalOpen(true)}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-200 transition-all"
                >
                  Tukar Sampah
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>

      <ExchangeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

    </div>
  );
}
