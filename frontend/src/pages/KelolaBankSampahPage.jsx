import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { bankSampahService } from '../services/api';
import { Building2, Plus, Edit, Trash2, MapPin, X } from 'lucide-react';

export default function KelolaBankSampahPage() {
  const [bankList, setBankList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    nama_bank_sampah: '',
    alamat: '',
    kecamatan: 'Palu Barat',
    kelurahan: '',
    latitude: -0.8950,
    longitude: 119.8520,
    nomor_telepon: '',
    jam_operasional: '08:00 - 16:00 WITA',
    deskripsi: '',
    status: 'aktif'
  });

  const kecamatanOptions = [
    'Palu Barat', 'Palu Timur', 'Palu Selatan', 'Palu Utara',
    'Mantikulore', 'Tatanga', 'Tawaeli', 'Ulujadi'
  ];

  useEffect(() => {
    loadBankSampah();
  }, []);

  const loadBankSampah = async () => {
    try {
      const res = await bankSampahService.getAll();
      setBankList(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({
      nama_bank_sampah: '',
      alamat: '',
      kecamatan: 'Palu Barat',
      kelurahan: '',
      latitude: -0.8950,
      longitude: 119.8520,
      nomor_telepon: '',
      jam_operasional: '08:00 - 16:00 WITA',
      deskripsi: '',
      status: 'aktif'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (bank) => {
    setEditingId(bank.id);
    setFormData({
      nama_bank_sampah: bank.nama_bank_sampah,
      alamat: bank.alamat,
      kecamatan: bank.kecamatan,
      kelurahan: bank.kelurahan || '',
      latitude: bank.latitude,
      longitude: bank.longitude,
      nomor_telepon: bank.nomor_telepon || '',
      jam_operasional: bank.jam_operasional || '',
      deskripsi: bank.deskripsi || '',
      status: bank.status
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await bankSampahService.update(editingId, formData);
      } else {
        await bankSampahService.create(formData);
      }
      setIsModalOpen(false);
      loadBankSampah();
    } catch (err) {
      alert(err.message || 'Gagal menyimpan data Bank Sampah.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Hapus Bank Sampah ini?')) {
      try {
        await bankSampahService.delete(id);
        loadBankSampah();
      } catch (err) {
        alert(err.message || 'Gagal menghapus Bank Sampah.');
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <main className="flex-1 p-6 sm:p-10 space-y-8 overflow-y-auto">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">Kelola Data Bank Sampah</h1>
            <p className="text-xs text-slate-500 mt-1">Kelola lokasi, koordinat latitude/longitude, dan pengelola di Kota Palu</p>
          </div>
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Bank Sampah</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bankList.map((bank) => (
            <div key={bank.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-100">
                    {bank.kecamatan}
                  </span>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                    bank.status === 'aktif' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {bank.status}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-lg">{bank.nama_bank_sampah}</h3>
                <p className="text-xs text-slate-500 flex items-start gap-1.5 mt-1">
                  <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{bank.alamat}</span>
                </p>

                <div className="mt-3 text-[11px] text-slate-400 space-y-1 bg-slate-50 p-3 rounded-xl">
                  <p><strong>Lat/Long:</strong> {bank.latitude}, {bank.longitude}</p>
                  <p><strong>Telepon:</strong> {bank.nomor_telepon || '-'}</p>
                  <p><strong>Jam:</strong> {bank.jam_operasional || '-'}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex gap-2">
                <button
                  onClick={() => handleOpenEdit(bank)}
                  className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center justify-center gap-1"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(bank.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-xl"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-lg text-slate-800">{editingId ? 'Edit Bank Sampah' : 'Tambah Bank Sampah Baru'}</h3>
              <button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Bank Sampah *</label>
                <input
                  type="text"
                  required
                  value={formData.nama_bank_sampah}
                  onChange={(e) => setFormData({ ...formData, nama_bank_sampah: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Alamat Lengkap *</label>
                <textarea
                  required
                  rows="2"
                  value={formData.alamat}
                  onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kecamatan *</label>
                  <select
                    value={formData.kecamatan}
                    onChange={(e) => setFormData({ ...formData, kecamatan: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl"
                  >
                    {kecamatanOptions.map(k => <option key={k} value={k}>{k}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kelurahan</label>
                  <input
                    type="text"
                    value={formData.kelurahan}
                    onChange={(e) => setFormData({ ...formData, kelurahan: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Latitude *</label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={formData.latitude}
                    onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Longitude *</label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={formData.longitude}
                    onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
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
