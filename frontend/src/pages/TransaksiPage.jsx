import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import StatusBadge from '../components/StatusBadge';
import { transaksiService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ArrowLeftRight, Download, Filter, Search, CheckCircle, Eye, Trash2 } from 'lucide-react';

export default function TransaksiPage() {
  const { user } = useAuth();
  const [transaksiList, setTransaksiList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedDetail, setSelectedDetail] = useState(null);

  useEffect(() => {
    loadTransaksi();
  }, []);

  useEffect(() => {
    filterData();
  }, [searchQuery, selectedStatus, transaksiList]);

  const loadTransaksi = async () => {
    try {
      setLoading(true);
      const res = await transaksiService.getAll();
      setTransaksiList(res.data || []);
      setFilteredList(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filterData = () => {
    let list = [...transaksiList];

    if (selectedStatus) {
      list = list.filter(t => t.status === selectedStatus);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(t =>
        t.kode_transaksi.toLowerCase().includes(q) ||
        (t.user?.name && t.user.name.toLowerCase().includes(q)) ||
        (t.bank_sampah?.nama_bank_sampah && t.bank_sampah.nama_bank_sampah.toLowerCase().includes(q))
      );
    }

    setFilteredList(list);
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await transaksiService.updateStatus(id, { status: newStatus });
      loadTransaksi();
    } catch (err) {
      alert(err.message || 'Gagal memperbarui status.');
    }
  };

  const exportReport = () => {
    // Generate CSV report download
    const headers = ['Kode Transaksi', 'Tanggal', 'Nasabah', 'No. HP', 'Bank Sampah', 'Metode Penyerahan', 'Alamat Penjemputan', 'Berat (Kg)', 'Total Harga (Rp)', 'Status'];
    const rows = filteredList.map(t => [
      t.kode_transaksi,
      new Date(t.tanggal_transaksi).toLocaleDateString('id-ID'),
      t.user?.name || '',
      t.user?.phone || '',
      t.bank_sampah?.nama_bank_sampah || '',
      t.metode_penyerahan || 'Jemput di Alamat',
      `"${(t.alamat_penjemputan || t.user?.address || '').replace(/"/g, '""')}"`,
      t.total_berat,
      t.total_harga,
      t.status
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Laporan_Transaksi_BankSampah_Palu_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <main className="flex-1 p-6 sm:p-10 space-y-8 overflow-y-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">Monitoring & Riwayat Transaksi</h1>
            <p className="text-xs text-slate-500 mt-1">Daftar lengkap pertukaran sampah bernilai ekonomi di Kota Palu</p>
          </div>

          <button
            onClick={exportReport}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Export Laporan Transaksi (CSV)</span>
          </button>
        </div>

        {/* Filter Controls */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Cari kode TRX / nasabah / bank..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 font-medium focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 font-semibold focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="">-- Semua Status --</option>
              <option value="Menunggu">Menunggu</option>
              <option value="Diproses">Diproses</option>
              <option value="Diterima">Diterima</option>
              <option value="Selesai">Selesai</option>
              <option value="Ditolak">Ditolak</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 uppercase tracking-wider font-extrabold border-b border-slate-200">
                  <th className="p-4">Kode Transaksi</th>
                  <th className="p-4">Tanggal</th>
                  <th className="p-4">Nasabah</th>
                  <th className="p-4">Penyerahan & Alamat</th>
                  <th className="p-4">Bank Sampah</th>
                  <th className="p-4">Berat (Kg)</th>
                  <th className="p-4">Total Nilai</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredList.map((trx) => (
                  <tr key={trx.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 font-bold text-slate-800">{trx.kode_transaksi}</td>
                    <td className="p-4 text-slate-500">
                      {new Date(trx.tanggal_transaksi).toLocaleDateString('id-ID')}
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-slate-800">{trx.user?.name}</div>
                      <div className="text-[10px] text-slate-400">{trx.user?.phone}</div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        trx.metode_penyerahan === 'Jemput di Alamat' 
                          ? 'bg-amber-100 text-amber-800' 
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {trx.metode_penyerahan || 'Jemput di Alamat'}
                      </span>
                      <div className="text-[11px] text-slate-600 mt-1 max-w-[180px] line-clamp-2" title={trx.alamat_penjemputan}>
                        {trx.alamat_penjemputan || trx.user?.address || '-'}
                      </div>
                    </td>
                    <td className="p-4 font-semibold text-slate-700">
                      {trx.bank_sampah?.nama_bank_sampah}
                    </td>
                    <td className="p-4 font-bold text-slate-700">{trx.total_berat} Kg</td>
                    <td className="p-4 font-black text-emerald-700">
                      Rp{parseFloat(trx.total_harga).toLocaleString('id-ID')}
                    </td>
                    <td className="p-4">
                      <StatusBadge status={trx.status} />
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setSelectedDetail(trx)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs"
                      >
                        Detail
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </main>

      {/* Detail Modal */}
      {selectedDetail && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-lg text-slate-800">Detail Transaksi {selectedDetail.kode_transaksi}</h3>
              <button onClick={() => setSelectedDetail(null)} className="text-slate-400 font-bold hover:text-slate-600">✕</button>
            </div>

            <div className="space-y-3 text-xs text-slate-600">
              <p><strong>Nasabah:</strong> {selectedDetail.user?.name} ({selectedDetail.user?.email})</p>
              <p><strong>No. Telepon:</strong> {selectedDetail.user?.phone || '-'}</p>
              <p><strong>Bank Sampah:</strong> {selectedDetail.bank_sampah?.nama_bank_sampah}</p>
              <p><strong>Metode Penyerahan:</strong> <span className="font-bold text-slate-800">{selectedDetail.metode_penyerahan || 'Jemput di Alamat'}</span></p>
              <p><strong>Alamat Penjemputan:</strong> {selectedDetail.alamat_penjemputan || selectedDetail.user?.address || '-'}</p>
              <p><strong>Status:</strong> <StatusBadge status={selectedDetail.status} /></p>
              <p><strong>Catatan:</strong> {selectedDetail.catatan || '-'}</p>

              <div className="pt-3 border-t border-slate-100">
                <p className="font-bold text-slate-700 uppercase tracking-wider mb-2">Rincian Item Sampah:</p>
                <div className="space-y-2">
                  {selectedDetail.detail_transaksi?.map(d => (
                    <div key={d.id} className="flex justify-between p-2.5 bg-slate-50 rounded-xl">
                      <span>{d.jenis_sampah?.nama_sampah} ({d.berat} kg x Rp{parseFloat(d.harga_per_kg).toLocaleString('id-ID')})</span>
                      <span className="font-bold text-emerald-700">Rp{parseFloat(d.subtotal).toLocaleString('id-ID')}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setSelectedDetail(null)}
                className="px-5 py-2 bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
