import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { edukasiService } from '../services/api';
import { BookOpen, ArrowRight, Sparkles, Calendar } from 'lucide-react';

export default function EdukasiPage() {
  const [edukasiList, setEdukasiList] = useState([]);

  useEffect(() => {
    loadEdukasi();
  }, []);

  const loadEdukasi = async () => {
    try {
      const res = await edukasiService.getAll();
      setEdukasiList(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-900 to-teal-800 text-white py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-300 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/30">
            Edukasi & Informasi Lingkungan
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white mt-2">
            Panduan & Berita Kebersihan Kota Palu
          </h1>
          <p className="text-emerald-100 text-sm sm:text-base mt-2 max-w-3xl">
            Tingkatkan pengetahuan Anda tentang teknik pemilahan sampah, daur ulang kreatif, dan upaya perlindungan lingkungan Kota Palu.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {edukasiList.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-xl transition-all flex flex-col justify-between"
            >
              <div>
                {item.gambar && (
                  <img src={item.gambar} alt={item.judul} className="w-full h-52 object-cover" />
                )}
                <div className="p-6">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 font-bold rounded-lg uppercase tracking-wider">
                      {item.kategori}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(item.created_at).toLocaleDateString('id-ID')}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-xl leading-snug">{item.judul}</h3>
                  <p className="text-xs text-slate-500 mt-3 line-clamp-4 leading-relaxed">{item.konten}</p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-2">
                <Link
                  to={`/edukasi/${item.id}`}
                  className="w-full py-3 bg-slate-900 hover:bg-emerald-600 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <span>Baca Selengkapnya</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
