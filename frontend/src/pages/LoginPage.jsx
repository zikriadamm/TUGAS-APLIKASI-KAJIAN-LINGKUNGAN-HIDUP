import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Recycle, Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await login({ email, password });
      const userRole = res.user.role;
      if (userRole === 'admin') navigate('/admin/dashboard');
      else if (userRole === 'pengelola') navigate('/pengelola/dashboard');
      else navigate('/masyarakat/dashboard');
    } catch (err) {
      setError(err.message || 'Login gagal. Periksa kembali email dan password Anda.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-xl border border-slate-200 space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md shadow-emerald-200">
            <Recycle className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-black text-slate-800">Masuk Akun</h2>
          <p className="text-xs text-slate-500">Monitoring Bank Sampah Kota Palu</p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-700 text-xs font-semibold rounded-xl flex items-center gap-2 border border-red-200">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full pl-10 pr-4 py-3 text-xs rounded-xl border border-slate-200 bg-slate-50 font-medium focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 text-xs rounded-xl border border-slate-200 bg-slate-50 font-medium focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-200 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            <span>{loading ? 'Memproses...' : 'Masuk Ke Akun'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Quick Accounts Login Helper */}
        <div className="pt-4 border-t border-slate-100 text-center space-y-2">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Demo Quick Login</p>
          <div className="grid grid-cols-3 gap-1.5 text-[10px]">
            <button
              onClick={() => { setEmail('admin@palu.go.id'); setPassword('password123'); }}
              className="py-1.5 px-2 bg-slate-100 hover:bg-emerald-50 text-slate-700 font-semibold rounded-lg"
            >
              Admin
            </button>
            <button
              onClick={() => { setEmail('pengelola.barat@banksampah.id'); setPassword('password123'); }}
              className="py-1.5 px-2 bg-slate-100 hover:bg-emerald-50 text-slate-700 font-semibold rounded-lg"
            >
              Pengelola
            </button>
            <button
              onClick={() => { setEmail('budi@gmail.com'); setPassword('password123'); }}
              className="py-1.5 px-2 bg-slate-100 hover:bg-emerald-50 text-slate-700 font-semibold rounded-lg"
            >
              Masyarakat
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-slate-500">
          Belum punya akun?{' '}
          <Link to="/register" className="font-bold text-emerald-600 hover:underline">
            Daftar Sekarang
          </Link>
        </div>

      </div>
    </div>
  );
}
