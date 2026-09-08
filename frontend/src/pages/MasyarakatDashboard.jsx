import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import ExchangeModal from '../components/ExchangeModal';
import { dashboardService, userService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, Weight, Coins, Plus, MapPin, ArrowRight, Clock, RefreshCw, Edit3, Check, Phone, User as UserIcon, Truck } from 'lucide-react';

export default function MasyarakatDashboard() {
  const { user, setUser } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBankId, setSelectedBankId] = useState(null);

  // Address editing states
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [addressInput, setAddressInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [savingAddress, setSavingAddress] = useState(false);
  const [addressMsg, setAddressMsg] = useState('');

  useEffect(() => {
    loadDashboard();
  }, []);

  useEffect(() => {
    if (user) {
      setAddressInput(user.address || '');
      setPhoneInput(user.phone || '');
    }
  }, [user]);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const res = await dashboardService.getMasyarakat();
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    if (!user) return;
    try {
      setSavingAddress(true);
      setAddressMsg('');
      const res = await userService.update(user.id, {
        address: addressInput,
        phone: phoneInput
      });

      // Update AuthContext user state
      if (setUser) {
        setUser({
          ...user,
          address: addressInput,
          phone: phoneInput
        });
      }

      setAddressMsg('Alamat penjemputan berhasil diperbarui!');
      setIsEditingAddress(false);
      setTimeout(() => setAddressMsg(''), 3000);
    } catch (err) {
      setAddressMsg(err.message || 'Gagal memperbarui alamat.');
    } finally {
      setSavingAddress(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-slate-50">
        <Sidebar />
        <main className="flex-1 p-8 flex items-center justify-center text-slate-500">
          <p>Memuat statistik masyarakat...</p>
        </main>
      </div>
    );
  }

  const { stats, recentTransaksi, recommendedBankSampah } = data || {};

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <main className="flex-1 p-6 sm:p-10 space-y-8 overflow-y-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">Dashboard Masyarakat</h1>
            <p className="text-xs text-slate-500 mt-1">Pantau transaksi pertukaran sampah & pendapatan ekonomi Anda di Kota Palu</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-lg shadow-emerald-200 text-sm transition-all hover:scale-102"
          >
            <Plus className="w-5 h-5" />
            <span>Tukar Sampah Sekarang</span>
          </button>
        </div>

        {/* Alamat Penjemputan Saya & Profile Card (New Feature Card) */}
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-800 rounded-3xl p-6 text-white shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-emerald-700/60 pb-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 backdrop-blur-xs border border-emerald-400/30 flex items-center justify-center text-emerald-300">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg leading-tight text-emerald-100">Alamat Penjemputan Saya</h3>
                <p className="text-xs text-emerald-300">Alamat default untuk kurir penjemputan sampah bernilai ekonomi</p>
              </div>
            </div>

            {!isEditingAddress && (
              <button
                onClick={() => setIsEditingAddress(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/30 hover:bg-emerald-500/40 text-emerald-100 font-bold rounded-xl border border-emerald-400/30 text-xs transition-colors"
              >
                <Edit3 className="w-4 h-4" />
                <span>Ubah Alamat & No. HP</span>
              </button>
            )}
          </div>

          {addressMsg && (
            <div className="mb-4 p-3 bg-emerald-500/20 border border-emerald-400/40 rounded-xl text-emerald-200 text-xs font-semibold">
              {addressMsg}
            </div>
          )}

          {isEditingAddress ? (
            <form onSubmit={handleSaveAddress} className="space-y-4 bg-emerald-950/40 p-4 rounded-2xl border border-emerald-700/50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-emerald-200 mb-1">
                    No. Telepon / WhatsApp
                  </label>
                  <input
                    type="text"
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    placeholder="Contoh: 082198765432"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-white/10 border border-emerald-500/40 text-white placeholder-emerald-400/60 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-emerald-200 mb-1">
                    Alamat Penjemputan Kota Palu
                  </label>
                  <input
                    type="text"
                    value={addressInput}
                    onChange={(e) => setAddressInput(e.target.value)}
                    placeholder="Jl. Diponegoro No. 88, Lere, Palu Barat"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-white/10 border border-emerald-500/40 text-white placeholder-emerald-400/60 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditingAddress(false);
                    setAddressInput(user?.address || '');
                    setPhoneInput(user?.phone || '');
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-slate-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={savingAddress}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors shadow-md"
                >
                  <Check className="w-4 h-4" />
                  <span>{savingAddress ? 'Menyimpan...' : 'Simpan Alamat'}</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="bg-white/5 p-3.5 rounded-2xl border border-white/10 flex items-center gap-3">
                <UserIcon className="w-5 h-5 text-emerald-300 shrink-0" />
                <div>
                  <span className="text-[10px] text-emerald-300 block font-semibold">Nama Pemilik Akun</span>
                  <span className="font-bold text-white text-sm">{user?.name || '-'}</span>
                </div>
              </div>

              <div className="bg-white/5 p-3.5 rounded-2xl border border-white/10 flex items-center gap-3">
                <Phone className="w-5 h-5 text-emerald-300 shrink-0" />
                <div>
                  <span className="text-[10px] text-emerald-300 block font-semibold">No. Kontak Penjemputan</span>
                  <span className="font-bold text-white text-sm">{user?.phone || 'Belum diisi'}</span>
                </div>
              </div>

              <div className="bg-white/5 p-3.5 rounded-2xl border border-white/10 flex items-center gap-3">
                <MapPin className="w-5 h-5 text-emerald-300 shrink-0" />
                <div>
                  <span className="text-[10px] text-emerald-300 block font-semibold">Lokasi Alamat Penjemputan</span>
                  <span className="font-bold text-white text-xs line-clamp-2">{user?.address || 'Belum ada alamat penjemputan tersimpan'}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 3 Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <StatCard
            title="Total Transaksi"
            value={stats?.totalTransaksi || 0}
            unit="Kali"
            icon={ShoppingBag}
            color="blue"
          />
          <StatCard
            title="Total Sampah Ditukar"
            value={stats?.totalSampahDitukar || 0}
            unit="Kg"
            icon={Weight}
            color="emerald"
          />
          <StatCard
            title="Total Pendapatan"
            value={`Rp${(stats?.totalPendapatan || 0).toLocaleString('id-ID')}`}
            unit=""
            icon={Coins}
            color="amber"
          />
        </div>

        {/* Status Transaksi Terbaru & History */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Recent Transactions List */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-extrabold text-slate-900 text-base">Status Transaksi Terbaru Saya</h3>
              <button onClick={loadDashboard} className="text-xs text-emerald-600 font-bold hover:underline flex items-center gap-1">
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Refresh</span>
              </button>
            </div>

            <div className="space-y-3">
              {recentTransaksi && recentTransaksi.length > 0 ? (
                recentTransaksi.map((trx) => (
                  <div key={trx.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-800">{trx.kode_transaksi}</span>
                        <StatusBadge status={trx.status} />
                      </div>
                      <span className="text-sm font-black text-emerald-700">
                        Rp{parseFloat(trx.total_harga).toLocaleString('id-ID')}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
                      <p>{trx.bank_sampah?.nama_bank_sampah}</p>
                      <p>{new Date(trx.tanggal_transaksi).toLocaleDateString('id-ID')} • {trx.total_berat} Kg</p>
                    </div>

                    {trx.metode_penyerahan && (
                      <div className="pt-2 border-t border-slate-200/60 text-[11px] flex items-center justify-between text-slate-500">
                        <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                          <Truck className="w-3 h-3" />
                          {trx.metode_penyerahan}
                        </span>
                        {trx.alamat_penjemputan && (
                          <span className="truncate max-w-[240px] text-slate-500" title={trx.alamat_penjemputan}>
                            {trx.alamat_penjemputan}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-slate-400 text-xs">
                  Anda belum pernah mengajukan pertukaran sampah.
                </div>
              )}
            </div>
          </div>

          {/* Recommended Bank Sampah */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
            <h3 className="font-extrabold text-slate-900 text-base">Rekomendasi Bank Sampah Kota Palu</h3>
            
            <div className="space-y-3">
              {recommendedBankSampah?.map((bank) => (
                <div key={bank.id} className="p-3.5 bg-emerald-50/60 rounded-2xl border border-emerald-100/80 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md uppercase">
                      Kec. {bank.kecamatan}
                    </span>
                    <h4 className="font-bold text-sm text-slate-800 mt-1">{bank.nama_bank_sampah}</h4>
                    <p className="text-[11px] text-slate-500 line-clamp-1">{bank.alamat}</p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedBankId(bank.id);
                      setIsModalOpen(true);
                    }}
                    className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs transition-colors shrink-0"
                    title="Tukar sampah di bank ini"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

      </main>

      <ExchangeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialBankId={selectedBankId}
        onSuccess={loadDashboard}
      />

    </div>
  );
}

