import React, { useState, useEffect } from 'react';
import { bankSampahService, jenisSampahService } from '../services/api';
import MapComponent from '../components/MapComponent';
import ExchangeModal from '../components/ExchangeModal';
import { MapPin, Filter, Search, Phone, Clock, Recycle, Coins, CheckCircle2, ChevronRight } from 'lucide-react';

export default function BankSampahMapPage() {
  const [bankList, setBankList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [jenisList, setJenisList] = useState([]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKecamatan, setSelectedKecamatan] = useState('');
  const [selectedJenisId, setSelectedJenisId] = useState('');

  const [activeBankDetail, setActiveBankDetail] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const kecamatanOptions = [
    'Palu Barat',
    'Palu Timur',
    'Palu Selatan',
    'Palu Utara',
    'Mantikulore',
    'Tatanga',
    'Tawaeli',
    'Ulujadi'
  ];

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchQuery, selectedKecamatan, selectedJenisId, bankList]);

  const loadData = async () => {
    try {
      const [bRes, jRes] = await Promise.all([
        bankSampahService.getAll({ status: 'aktif' }),
        jenisSampahService.getAll({ status: 'aktif' })
      ]);
      setBankList(bRes.data || []);
      setFilteredList(bRes.data || []);
      setJenisList(jRes.data || []);
    } catch (err) {
      console.error('Gagal memuat data peta bank sampah:', err);
    }
  };

  const applyFilters = () => {
    let result = [...bankList];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(b =>
        b.nama_bank_sampah.toLowerCase().includes(q) ||
        b.alamat.toLowerCase().includes(q) ||
        b.kecamatan.toLowerCase().includes(q)
      );
    }

    if (selectedKecamatan) {
      result = result.filter(b => b.kecamatan === selectedKecamatan);
    }

    if (selectedJenisId) {
      const jId = parseInt(selectedJenisId);
      result = result.filter(b =>
        b.jenis_sampah_accepted && b.jenis_sampah_accepted.some(j => j.id === jId)
      );
    }

    setFilteredList(result);
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-green-700 text-white py-12 px-4 sm:px-6 lg:px-8 shadow-md">
        <div className="max-w-7xl mx-auto">
          <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-300 bg-emerald-900/60 px-3 py-1 rounded-full border border-emerald-500/30">
            Pemetaan GIS Bank Sampah
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white mt-2">
            Peta Lokasi Bank Sampah Kota Palu
          </h1>
          <p className="text-emerald-100 text-sm sm:text-base mt-2 max-w-3xl">
            Temukan lokasi Bank Sampah terdekat di seluruh kecamatan Kota Palu beserta jam operasional dan jenis sampah yang diterima.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-6">
        
        {/* Filter Controls Bar */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200/80 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          
          {/* Search Input */}
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Cari nama bank sampah / alamat..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          {/* Kecamatan Filter */}
          <div className="relative">
            <select
              value={selectedKecamatan}
              onChange={(e) => setSelectedKecamatan(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="">-- Semua Kecamatan Kota Palu --</option>
              {kecamatanOptions.map((kec) => (
                <option key={kec} value={kec}>{kec}</option>
              ))}
            </select>
          </div>

          {/* Jenis Sampah Filter */}
          <div className="relative">
            <select
              value={selectedJenisId}
              onChange={(e) => setSelectedJenisId(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="">-- Semua Jenis Sampah --</option>
              {jenisList.map((j) => (
                <option key={j.id} value={j.id}>{j.nama_sampah}</option>
              ))}
            </select>
          </div>

        </div>

        {/* Map & Cards Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Map View */}
          <div className="lg:col-span-8">
            <div className="bg-white p-3 rounded-3xl border border-slate-200 shadow-md">
              <MapComponent
                bankSampahList={filteredList}
                selectedBank={activeBankDetail}
                onSelectBank={(bank) => {
                  setActiveBankDetail(bank);
                  setIsModalOpen(true);
                }}
                height="620px"
              />
            </div>
          </div>

          {/* Sidebar Cards List */}
          <div className="lg:col-span-4 space-y-4 max-h-[640px] overflow-y-auto pr-1">
            <div className="flex justify-between items-center px-1">
              <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                Daftar Bank Sampah ({filteredList.length})
              </span>
              {(selectedKecamatan || selectedJenisId || searchQuery) && (
                <button
                  onClick={() => {
                    setSelectedKecamatan('');
                    setSelectedJenisId('');
                    setSearchQuery('');
                  }}
                  className="text-xs text-red-600 font-bold hover:underline"
                >
                  Reset Filter
                </button>
              )}
            </div>

            {filteredList.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 text-slate-400 space-y-2">
                <Recycle className="w-10 h-10 mx-auto text-slate-300" />
                <p className="text-sm font-bold">Tidak ada Bank Sampah yang sesuai filter.</p>
              </div>
            ) : (
              filteredList.map((bank) => (
                <div
                  key={bank.id}
                  onClick={() => setActiveBankDetail(bank)}
                  className={`bg-white rounded-2xl p-5 border transition-all cursor-pointer ${
                    activeBankDetail?.id === bank.id
                      ? 'border-emerald-500 ring-2 ring-emerald-200 shadow-md'
                      : 'border-slate-200 hover:border-emerald-300 shadow-xs'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-100">
                      {bank.kecamatan}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">{bank.jam_operasional}</span>
                  </div>

                  <h3 className="font-bold text-slate-800 text-base">{bank.nama_bank_sampah}</h3>
                  <p className="text-xs text-slate-500 flex items-start gap-1.5 mt-1.5">
                    <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{bank.alamat}</span>
                  </p>

                  {bank.nomor_telepon && (
                    <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
                      <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{bank.nomor_telepon}</span>
                    </p>
                  )}

                  {/* Accepted trash tags */}
                  {bank.jenis_sampah_accepted && bank.jenis_sampah_accepted.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap gap-1">
                      {bank.jenis_sampah_accepted.slice(0, 3).map(j => (
                        <span key={j.id} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] rounded-md font-medium">
                          {j.nama_sampah}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveBankDetail(bank);
                        setIsModalOpen(true);
                      }}
                      className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl text-center shadow-xs transition-colors"
                    >
                      Ajukan Tukar Sampah
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>

      </div>

      <ExchangeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialBankId={activeBankDetail?.id}
      />

    </div>
  );
}
