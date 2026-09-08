import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { edukasiService } from '../services/api';
import { ArrowLeft, Calendar, Tag, Share2 } from 'lucide-react';

export default function EdukasiDetailPage() {
  const { id } = useParams();
  const [item, setItem] = useState(null);

  useEffect(() => {
    loadDetail();
  }, [id]);

  const loadDetail = async () => {
    try {
      const res = await edukasiService.getById(id);
      setItem(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  if (!item) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-slate-500">
        <p>Memuat artikel edukasi...</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        
        <Link
          to="/edukasi"
          className="inline-flex items-center gap-2 text-xs font-bold text-emerald-700 hover:text-emerald-800 mb-6 bg-emerald-50 px-3 py-2 rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Daftar Edukasi</span>
        </Link>

        <article className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-6">
          <div className="space-y-3">
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-extrabold rounded-lg uppercase tracking-wider">
              {item.kategori}
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight">
              {item.judul}
            </h1>
            <div className="flex items-center gap-4 text-xs text-slate-400 pt-2 border-t border-slate-100">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-emerald-600" />
                {new Date(item.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
              <span>• Kota Palu</span>
            </div>
          </div>

          {item.gambar && (
            <img src={item.gambar} alt={item.judul} className="w-full h-80 object-cover rounded-2xl" />
          )}

          <div className="text-slate-700 text-base leading-relaxed space-y-4 font-normal">
            {item.konten.split('\n').map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </div>

        </article>

      </div>
    </div>
  );
}
