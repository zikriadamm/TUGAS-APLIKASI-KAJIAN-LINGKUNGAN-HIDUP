import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { jenisSampahService, kategoriSampahService } from '../services/api';
import { Tag, Plus, Edit, Trash2, X } from 'lucide-react';

export default function KelolaJenisSampahPage() {
  const [jenisList, setJenisList] = useState([]);
  const [kategoriList, setKategoriList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    kategori_id: '',
    nama_sampah: '',
    harga_per_kg: '',
    deskripsi: '',
    gambar: '',
    status: 'aktif'
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [jRes, kRes] = await Promise.all([
        jenisSampahService.getAll(),
        kategoriSampahService.getAll()
      ]);
      setJenisList(jRes.data || []);
      setKategoriList(kRes.data || []);
      if (kRes.data && kRes.data.length > 0) {
        setFormData(prev => ({ ...prev, kategori_id: kRes.data[0].id }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({
      kategori_id: kategoriList[0]?.id || '',
      nama_sampah: '',
      harga_per_kg: '',
      deskripsi: '',
      gambar: '',
      status: 'aktif'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      kategori_id: item.kategori_id,
      nama_sampah: item.nama_sampah,
      harga_per_kg: item.harga_per_kg,
      deskripsi: item.deskripsi || '',
      gambar: item.gambar || '',
      status: item.status
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await jenisSampahService.update(editingId, formData);
      } else {
        await jenisSampahService.create(formData);
      }
      setIsModalOpen(false);
      loadData();
    } catch (err) {
      alert(err.message || 'Gagal menyimpan jenis sampah.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Hapus jenis sampah ini?')) {
      try {
        await jenisSampahService.delete(id);
        loadData();
      } catch (err) {
        alert(err.message || 'Gagal menghapus jenis sampah.');
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <main className="flex-1 p-6 sm:p-10 space-y-8 overflow-y-auto">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">Kelola Kategori & Jenis Sampah</h1>
            <p className="text-xs text-slate-500 mt-1">Atur harga per kilogram standar dan deskripsi sampah bernilai jual</p>
          </div>
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Jenis Sampah</span>
          </button>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 uppercase tracking-wider font-extrabold border-b border-slate-200">
                <th className="p-4">Nama Sampah</th>
                <th className="p-4">Kategori</th>
                <th className="p-4">Harga / Kg</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {jenisList.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4 font-bold text-slate-800">{item.nama_sampah}</td>
                  <td className="p-4">
                    <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 font-bold rounded-md">
                      {item.kategori?.nama_kategori || '-'}
                    </span>
                  </td>
                  <td className="p-4 font-extrabold text-emerald-700">
                    Rp{parseFloat(item.harga_per_kg).toLocaleString('id-ID')}
                  </td>
                  <td className="p-4 font-semibold text-slate-600">{item.status}</td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="p-1.5 text-slate-500 hover:text-emerald-600 rounded-lg"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-6 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-lg text-slate-800">{editingId ? 'Edit Jenis Sampah' : 'Tambah Jenis Sampah'}</h3>
              <button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Kategori Sampah *</label>
                <select
                  value={formData.kategori_id}
                  onChange={(e) => setFormData({ ...formData, kategori_id: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                >
                  {kategoriList.map(k => <option key={k.id} value={k.id}>{k.nama_kategori}</option>)}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Sampah *</label>
                <input
                  type="text"
                  required
                  value={formData.nama_sampah}
                  onChange={(e) => setFormData({ ...formData, nama_sampah: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Harga per Kg (Rp) *</label>
                <input
                  type="number"
                  required
                  value={formData.harga_per_kg}
                  onChange={(e) => setFormData({ ...formData, harga_per_kg: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Deskripsi</label>
                <textarea
                  rows="2"
                  value={formData.deskripsi}
                  onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                ></textarea>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">URL Gambar (Opsional)</label>
                <input
                  type="text"
                  value={formData.gambar}
                  onChange={(e) => setFormData({ ...formData, gambar: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2.5 bg-slate-100 font-bold rounded-xl">Batal</button>
                <button type="submit" className="flex-1 py-2.5 bg-emerald-600 text-white font-bold rounded-xl">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
