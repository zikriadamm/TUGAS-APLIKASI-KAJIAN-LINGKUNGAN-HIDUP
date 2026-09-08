import React from 'react';
import { Link } from 'react-router-dom';
import { Recycle, MapPin, Phone, Mail, Globe, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white">
                <Recycle className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                Bank Sampah <span className="text-emerald-400">Palu</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Sistem Informasi Monitoring Bank Sampah dan Pertukaran Sampah Bernilai Ekonomi Terpadu di Kota Palu, Sulawesi Tengah.
            </p>
          </div>

          {/* Quick Nav */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm tracking-wider uppercase">Menu Utama</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/" className="hover:text-emerald-400 transition-colors">Beranda</Link></li>
              <li><Link to="/peta" className="hover:text-emerald-400 transition-colors">Peta Bank Sampah</Link></li>
              <li><Link to="/bank-sampah" className="hover:text-emerald-400 transition-colors">Daftar Bank Sampah</Link></li>
              <li><Link to="/jenis-sampah" className="hover:text-emerald-400 transition-colors">Katalog Jenis & Harga</Link></li>
              <li><Link to="/edukasi" className="hover:text-emerald-400 transition-colors">Edukasi & Berita</Link></li>
            </ul>
          </div>

          {/* Kecamatan Palu */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm tracking-wider uppercase">Kecamatan Palu</h3>
            <ul className="grid grid-cols-2 gap-2 text-xs text-slate-400">
              <li>• Palu Barat</li>
              <li>• Palu Timur</li>
              <li>• Palu Selatan</li>
              <li>• Palu Utara</li>
              <li>• Mantikulore</li>
              <li>• Tatanga</li>
              <li>• Tawaeli</li>
              <li>• Ulujadi</li>
            </ul>
          </div>

          {/* Contact & Info */}
          <div className="space-y-3 text-sm">
            <h3 className="text-white font-semibold mb-4 text-sm tracking-wider uppercase">Kontak Pengelola</h3>
            <div className="flex items-start gap-3 text-slate-400">
              <MapPin className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <span>Dinas Lingkungan Hidup Kota Palu, Sulawesi Tengah</span>
            </div>
            <div className="flex items-center gap-3 text-slate-400">
              <Phone className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>(0451) 421-9988</span>
            </div>
            <div className="flex items-center gap-3 text-slate-400">
              <Mail className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>dlh@palukota.go.id</span>
            </div>
          </div>

        </div>

        <div className="pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Bank Sampah Kota Palu. Hak Cipta Dilindungi Undang-Undang.</p>
          <p className="flex items-center gap-1">
            Dirancang dengan <Heart className="w-4 h-4 text-red-500 fill-current inline" /> untuk Kota Palu Hijau & Bersih.
          </p>
        </div>
      </div>
    </footer>
  );
}
