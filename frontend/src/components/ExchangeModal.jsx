import React, { useState, useEffect } from 'react';
import { bankSampahService, jenisSampahService, transaksiService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Recycle, Calculator, CheckCircle2, AlertCircle, Trash2, Plus, X, MapPin, Truck, Store } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ExchangeModal({ isOpen, onClose, initialBankId = null, onSuccess = null }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [bankList, setBankList] = useState([]);
  const [selectedBankId, setSelectedBankId] = useState(initialBankId || '');
  const [jenisList, setJenisList] = useState([]);
  
  const [items, setItems] = useState([
    { jenis_sampah_id: '', berat: '', harga_per_kg: 0 }
  ]);

  const [metodePenyerahan, setMetodePenyerahan] = useState('Jemput di Alamat');
  const [alamatPenjemputan, setAlamatPenjemputan] = useState('');
  const [catatan, setCatatan] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadInitialData();
      if (user && user.address) {
        setAlamatPenjemputan(user.address);
      }
    }
  }, [isOpen, user]);

  useEffect(() => {
    if (initialBankId) {
      setSelectedBankId(initialBankId);
    }
  }, [initialBankId]);

  const loadInitialData = async () => {
    try {
      const [banksRes, jenisRes] = await Promise.all([
        bankSampahService.getAll({ status: 'aktif' }),
        jenisSampahService.getAll({ status: 'aktif' })
      ]);
      setBankList(banksRes.data || []);
      setJenisList(jenisRes.data || []);
      if (!selectedBankId && banksRes.data && banksRes.data.length > 0) {
        setSelectedBankId(banksRes.data[0].id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;

    if (field === 'jenis_sampah_id') {
      const selectedJenis = jenisList.find(j => j.id === parseInt(value));
      if (selectedJenis) {
        newItems[index].harga_per_kg = parseFloat(selectedJenis.harga_per_kg || 0);
      } else {
        newItems[index].harga_per_kg = 0;
      }
    }

    setItems(newItems);
  };

  const addItemRow = () => {
    setItems([...items, { jenis_sampah_id: '', berat: '', harga_per_kg: 0 }]);
  };

  const removeItemRow = (index) => {
    if (items.length === 1) return;
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const calculateTotalBerat = () => {
    return items.reduce((acc, item) => acc + (parseFloat(item.berat) || 0), 0);
  };

  const calculateTotalHarga = () => {
    return items.reduce((acc, item) => {
      const b = parseFloat(item.berat) || 0;
      const h = parseFloat(item.harga_per_kg) || 0;
      return acc + (b * h);
    }, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    setError('');
    setSuccess('');

    if (!selectedBankId) {
      setError('Pilih Bank Sampah tujuan.');
      return;
    }

    const validItems = items.filter(i => i.jenis_sampah_id && parseFloat(i.berat) > 0);
    if (validItems.length === 0) {
      setError('Pilih minimal 1 jenis sampah dan masukkan berat yang valid (> 0 kg).');
      return;
    }

    if (metodePenyerahan === 'Jemput di Alamat' && (!alamatPenjemputan || alamatPenjemputan.trim() === '')) {
      setError('Masukkan alamat penjemputan sampah.');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        bank_sampah_id: parseInt(selectedBankId),
        items: validItems.map(i => ({
          jenis_sampah_id: parseInt(i.jenis_sampah_id),
          berat: parseFloat(i.berat),
          harga_per_kg: parseFloat(i.harga_per_kg)
        })),
        metode_penyerahan: metodePenyerahan,
        alamat_penjemputan: metodePenyerahan === 'Jemput di Alamat' ? alamatPenjemputan : 'Diantar langsung ke Bank Sampah',
        catatan
      };

      const res = await transaksiService.create(payload);
      setSuccess('Permintaan pertukaran sampah berhasil dikirim!');
      setItems([{ jenis_sampah_id: '', berat: '', harga_per_kg: 0 }]);
      setCatatan('');
      
      if (onSuccess) {
        onSuccess(res.data);
      }
      setTimeout(() => {
        setSuccess('');
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.message || 'Gagal mengajukan pertukaran sampah.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-100 animate-fadeIn">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-green-600 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center backdrop-blur-xs">
              <Recycle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">Form Pertukaran Sampah</h3>
              <p className="text-xs text-emerald-100">Ubah sampah menjadi rupiah di Bank Sampah Kota Palu</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {error && (
            <div className="p-4 bg-red-50 text-red-700 text-sm rounded-xl flex items-center gap-3 border border-red-200">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-4 bg-emerald-50 text-emerald-700 text-sm rounded-xl flex items-center gap-3 border border-emerald-200">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {/* Bank Sampah Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Pilih Bank Sampah Tujuan *
            </label>
            <select
              value={selectedBankId}
              onChange={(e) => setSelectedBankId(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
            >
              <option value="">-- Pilih Bank Sampah --</option>
              {bankList.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.nama_bank_sampah} ({b.kecamatan})
                </option>
              ))}
            </select>
          </div>

          {/* Metode Penyerahan & Alamat Penjemputan (New Feature) */}
          <div className="space-y-3 bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100">
            <label className="block text-xs font-bold text-emerald-900 uppercase tracking-wider">
              Metode Penyerahan Sampah *
            </label>
            
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setMetodePenyerahan('Jemput di Alamat')}
                className={`py-3 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all ${
                  metodePenyerahan === 'Jemput di Alamat'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Truck className="w-4 h-4" />
                <span>Jemput di Alamat Saya</span>
              </button>

              <button
                type="button"
                onClick={() => setMetodePenyerahan('Diantar ke Bank Sampah')}
                className={`py-3 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all ${
                  metodePenyerahan === 'Diantar ke Bank Sampah'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Store className="w-4 h-4" />
                <span>Diantar ke Lokasi Bank</span>
              </button>
            </div>

            {metodePenyerahan === 'Jemput di Alamat' && (
              <div className="pt-2">
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Alamat Penjemputan di Kota Palu *</span>
                </label>
                <textarea
                  rows="2"
                  required
                  value={alamatPenjemputan}
                  onChange={(e) => setAlamatPenjemputan(e.target.value)}
                  placeholder="Masukkan alamat lengkap rumah / lokasi penjemputan sampah (Jalan, No. Rumah, Kelurahan, Kecamatan di Kota Palu)"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                ></textarea>
              </div>
            )}
          </div>

          {/* Item Rows */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Jenis Sampah & Berat (Kg) *
              </label>
              <button
                type="button"
                onClick={addItemRow}
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-lg"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Jenis</span>
              </button>
            </div>

            <div className="space-y-3">
              {items.map((item, index) => (
                <div key={index} className="flex gap-2 items-center bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
                  <div className="flex-1">
                    <select
                      value={item.jenis_sampah_id}
                      onChange={(e) => handleItemChange(index, 'jenis_sampah_id', e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    >
                      <option value="">-- Jenis Sampah --</option>
                      {jenisList.map((j) => (
                        <option key={j.id} value={j.id}>
                          {j.nama_sampah} (Rp{parseFloat(j.harga_per_kg).toLocaleString('id-ID')}/Kg)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="w-28">
                    <input
                      type="number"
                      step="0.1"
                      min="0.1"
                      placeholder="Berat (Kg)"
                      value={item.berat}
                      onChange={(e) => handleItemChange(index, 'berat', e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div className="w-32 text-right pr-1">
                    <span className="text-xs font-bold text-emerald-700">
                      Rp{((parseFloat(item.berat) || 0) * (parseFloat(item.harga_per_kg) || 0)).toLocaleString('id-ID')}
                    </span>
                  </div>

                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItemRow(index)}
                      className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Catatan / Pesan Tambahan (Opsional)
            </label>
            <textarea
              rows="2"
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              placeholder="Contoh: Sampah sudah dipilah dan dimasukkan karung. Ingin dijemput jam 10 pagi."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-xs font-medium focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            ></textarea>
          </div>

          {/* Real-time Calculation Summary Box */}
          <div className="bg-emerald-900 text-white rounded-2xl p-5 shadow-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-700/80 flex items-center justify-center">
                <Calculator className="w-5 h-5 text-emerald-300" />
              </div>
              <div>
                <span className="text-xs text-emerald-300 font-semibold block uppercase tracking-wider">Total Estimasi Nilai</span>
                <span className="text-xs text-emerald-200">Berat Total: {calculateTotalBerat().toFixed(1)} Kg</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-emerald-300">
                Rp{calculateTotalHarga().toLocaleString('id-ID')}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 text-slate-600 font-bold text-sm bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-200 transition-all hover:scale-101 disabled:opacity-50"
            >
              {loading ? 'Mengirim Transaksi...' : 'Kirim Permintaan Exchange'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
