import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import { dashboardService, transaksiService } from '../services/api';
import { ArrowLeftRight, Weight, Coins, Users, CheckCircle2, XCircle, Clock, RefreshCw } from 'lucide-react';

export default function PengelolaDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState('');

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const res = await dashboardService.getPengelola();
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (trxId, newStatus) => {
    try {
      await transaksiService.updateStatus(trxId, { status: newStatus });
      setActionMessage(`Status transaksi berhasil diperbarui ke '${newStatus}'`);
      setTimeout(() => setActionMessage(''), 2500);
      loadDashboard();
    } catch (err) {
      alert(err.message || 'Gagal memperbarui status transaksi.');
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-slate-50">
        <Sidebar />
        <main className="flex-1 p-8 flex items-center justify-center text-slate-500">
          <p>Memuat data pengelola bank sampah...</p>
        </main>
      </div>
    );
  }

  const { bankSampah, stats, recentTransaksi } = data || {};

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <main className="flex-1 p-6 sm:p-10 space-y-8 overflow-y-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">
              {bankSampah ? bankSampah.nama_bank_sampah : 'Dashboard Pengelola Bank Sampah'}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Kecamatan {bankSampah?.kecamatan || 'Palu'} • Operasional: {bankSampah?.jam_operasional || '08:00 - 16:00 WITA'}
            </p>
          </div>
          <button
            onClick={loadDashboard}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white text-slate-700 font-bold rounded-xl border border-slate-200 shadow-xs hover:bg-slate-50 text-xs"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>

        {actionMessage && (
          <div className="p-4 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-200">
            {actionMessage}
          </div>
        )}

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Transaksi"
            value={stats?.totalTransaksi || 0}
            unit="Permintaan"
            icon={ArrowLeftRight}
            color="amber"
          />
          <StatCard
            title="Total Sampah Masuk"
            value={stats?.totalSampahMasuk || 0}
            unit="Kg"
            icon={Weight}
            color="emerald"
          />
          <StatCard
            title="Total Nilai Transaksi"
            value={`Rp${(stats?.totalNilaiTransaksi || 0).toLocaleString('id-ID')}`}
            unit=""
            icon={Coins}
            color="indigo"
          />
          <StatCard
            title="Jumlah Nasabah"
            value={stats?.jumlahPengguna || 0}
            unit="Orang"
            icon={Users}
            color="blue"
          />
        </div>

        {/* Incoming Transactions Table & Status Verification */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-extrabold text-slate-900 text-lg">Permintaan Pertukaran Sampah Terbaru</h3>
            <span className="text-xs text-slate-400 font-medium">Verifikasi dan perbarui status transaksi</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 uppercase tracking-wider font-extrabold border-b border-slate-200">
                  <th className="p-3.5 rounded-l-xl">Kode TRX</th>
                  <th className="p-3.5">Nasabah</th>
                  <th className="p-3.5">Metode & Alamat</th>
                  <th className="p-3.5">Detail Sampah</th>
                  <th className="p-3.5">Berat</th>
                  <th className="p-3.5">Total Rp</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 rounded-r-xl text-right">Aksi Verifikasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentTransaksi && recentTransaksi.length > 0 ? (
                  recentTransaksi.map((trx) => (
                    <tr key={trx.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3.5 font-bold text-slate-800">{trx.kode_transaksi}</td>
                      <td className="p-3.5">
                        <div className="font-semibold text-slate-800">{trx.user?.name}</div>
                        <div className="text-[10px] text-slate-400">{trx.user?.phone}</div>
                      </td>
                      <td className="p-3.5">
                        <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          trx.metode_penyerahan === 'Jemput di Alamat' 
                            ? 'bg-amber-100 text-amber-800' 
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {trx.metode_penyerahan || 'Jemput di Alamat'}
                        </span>
                        <div className="text-[11px] text-slate-600 mt-1 max-w-[200px] line-clamp-2" title={trx.alamat_penjemputan}>
                          {trx.alamat_penjemputan || trx.user?.address || '-'}
                        </div>
                      </td>
                      <td className="p-3.5">
                        {trx.detail_transaksi?.map(d => (
                          <div key={d.id} className="text-slate-600 font-medium">
                            • {d.jenis_sampah?.nama_sampah} ({d.berat}kg)
                          </div>
                        ))}
                      </td>
                      <td className="p-3.5 font-bold text-slate-700">{trx.total_berat} Kg</td>
                      <td className="p-3.5 font-bold text-emerald-700">Rp{parseFloat(trx.total_harga).toLocaleString('id-ID')}</td>
                      <td className="p-3.5">
                        <StatusBadge status={trx.status} />
                      </td>
                      <td className="p-3.5 text-right">
                        <div className="flex justify-end gap-1.5">
                          {trx.status === 'Menunggu' && (
                            <button
                              onClick={() => handleUpdateStatus(trx.id, 'Diproses')}
                              className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-[11px]"
                            >
                              Proses
                            </button>
                          )}
                          {(trx.status === 'Menunggu' || trx.status === 'Diproses') && (
                            <button
                              onClick={() => handleUpdateStatus(trx.id, 'Diterima')}
                              className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-[11px]"
                            >
                              Terima
                            </button>
                          )}
                          {trx.status === 'Diterima' && (
                            <button
                              onClick={() => handleUpdateStatus(trx.id, 'Selesai')}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[11px]"
                            >
                              Selesai
                            </button>
                          )}
                          {trx.status !== 'Selesai' && trx.status !== 'Ditolak' && (
                            <button
                              onClick={() => handleUpdateStatus(trx.id, 'Ditolak')}
                              className="px-2.5 py-1 bg-red-100 hover:bg-red-200 text-red-700 font-bold rounded-lg text-[11px]"
                            >
                              Tolak
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="p-8 text-center text-slate-400">Belum ada transaksi pertukaran sampah.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}
