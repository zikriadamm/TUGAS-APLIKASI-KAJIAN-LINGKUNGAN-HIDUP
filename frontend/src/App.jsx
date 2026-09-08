import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import LandingPage from './pages/LandingPage';
import BankSampahMapPage from './pages/BankSampahMapPage';
import JenisSampahPage from './pages/JenisSampahPage';
import EdukasiPage from './pages/EdukasiPage';
import EdukasiDetailPage from './pages/EdukasiDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboard from './pages/AdminDashboard';
import PengelolaDashboard from './pages/PengelolaDashboard';
import MasyarakatDashboard from './pages/MasyarakatDashboard';
import TransaksiPage from './pages/TransaksiPage';
import KelolaUserPage from './pages/KelolaUserPage';
import KelolaBankSampahPage from './pages/KelolaBankSampahPage';
import KelolaJenisSampahPage from './pages/KelolaJenisSampahPage';

export default function App() {
  const location = useLocation();

  // Hide main Navbar and Footer inside dashboard pages
  const isDashboardRoute =
    location.pathname.startsWith('/admin') ||
    location.pathname.startsWith('/pengelola') ||
    location.pathname.startsWith('/masyarakat');

  return (
    <div className="flex flex-col min-h-screen">
      {!isDashboardRoute && <Navbar />}

      <div className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/peta" element={<BankSampahMapPage />} />
          <Route path="/bank-sampah" element={<BankSampahMapPage />} />
          <Route path="/jenis-sampah" element={<JenisSampahPage />} />
          <Route path="/edukasi" element={<EdukasiPage />} />
          <Route path="/edukasi/:id" element={<EdukasiDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<KelolaUserPage />} />
          <Route path="/admin/bank-sampah" element={<KelolaBankSampahPage />} />
          <Route path="/admin/jenis-sampah" element={<KelolaJenisSampahPage />} />
          <Route path="/admin/transaksi" element={<TransaksiPage />} />
          <Route path="/admin/edukasi" element={<EdukasiPage />} />

          {/* Pengelola Routes */}
          <Route path="/pengelola/dashboard" element={<PengelolaDashboard />} />
          <Route path="/pengelola/transaksi" element={<TransaksiPage />} />
          <Route path="/pengelola/profil" element={<KelolaBankSampahPage />} />

          {/* Masyarakat Routes */}
          <Route path="/masyarakat/dashboard" element={<MasyarakatDashboard />} />
          <Route path="/masyarakat/tukar" element={<BankSampahMapPage />} />
          <Route path="/masyarakat/riwayat" element={<TransaksiPage />} />
        </Routes>
      </div>

      {!isDashboardRoute && <Footer />}
    </div>
  );
}
