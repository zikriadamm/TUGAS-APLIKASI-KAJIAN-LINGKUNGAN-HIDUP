import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Building2,
  Users,
  Layers,
  ShoppingBag,
  BookOpen,
  ArrowLeftRight,
  LogOut,
  MapPin,
  Home,
  UserCheck,
  Tag
} from 'lucide-react';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  let menuItems = [];

  if (user?.role === 'admin') {
    menuItems = [
      { label: 'Dashboard Admin', path: '/admin/dashboard', icon: LayoutDashboard },
      { label: 'Kelola Bank Sampah', path: '/admin/bank-sampah', icon: Building2 },
      { label: 'Kelola Pengguna', path: '/admin/users', icon: Users },
      { label: 'Jenis & Harga Sampah', path: '/admin/jenis-sampah', icon: Tag },
      { label: 'Verifikasi Transaksi', path: '/admin/transaksi', icon: ArrowLeftRight },
      { label: 'Edukasi & Artikel', path: '/admin/edukasi', icon: BookOpen },
    ];
  } else if (user?.role === 'pengelola') {
    menuItems = [
      { label: 'Dashboard Pengelola', path: '/pengelola/dashboard', icon: LayoutDashboard },
      { label: 'Profil Bank Sampah', path: '/pengelola/profil', icon: Building2 },
      { label: 'Permintaan Transaksi', path: '/pengelola/transaksi', icon: ArrowLeftRight },
    ];
  } else {
    menuItems = [
      { label: 'Dashboard Saya', path: '/masyarakat/dashboard', icon: LayoutDashboard },
      { label: 'Tukar Sampah', path: '/masyarakat/tukar', icon: ArrowLeftRight },
      { label: 'Riwayat Transaksi', path: '/masyarakat/riwayat', icon: ShoppingBag },
      { label: 'Peta Bank Sampah', path: '/peta', icon: MapPin },
    ];
  }

  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen flex flex-col justify-between p-4 shrink-0">
      <div className="space-y-6">
        
        {/* User Card */}
        <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-white uppercase text-sm">
              {user?.name ? user.name.charAt(0) : 'U'}
            </div>
            <div className="overflow-hidden">
              <h4 className="font-bold text-sm text-white truncate">{user?.name || 'Pengguna'}</h4>
              <span className="inline-block px-2 py-0.5 text-[10px] uppercase tracking-wider font-extrabold bg-emerald-500/20 text-emerald-400 rounded-md">
                {user?.role}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Section */}
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 mb-3">Menu Dashboard</p>
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all ${
                    active
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/50'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

      </div>

      {/* Footer Controls */}
      <div className="space-y-2 pt-6 border-t border-slate-800">
        <Link
          to="/"
          className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <Home className="w-5 h-5" />
          <span>Kembali ke Beranda</span>
        </Link>
        <button
          onClick={() => {
            logout();
            navigate('/login');
          }}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Keluar Akun</span>
        </button>
      </div>
    </aside>
  );
}
