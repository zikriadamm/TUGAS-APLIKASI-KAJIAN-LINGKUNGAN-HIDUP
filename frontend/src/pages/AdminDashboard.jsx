import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import { dashboardService } from '../services/api';
import { Building2, Users, ArrowLeftRight, Weight, Coins, RefreshCw } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const res = await dashboardService.getAdmin();
      setData(res);
    } catch (err) {
      console.error('Failed to load admin dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-slate-50">
        <Sidebar />
        <main className="flex-1 p-8 flex items-center justify-center text-slate-500">
          <p>Memuat statistik dashboard admin...</p>
        </main>
      </div>
    );
  }

  const { stats, charts } = data || {};

  // Chart 1: Monthly Trash Collected (Kg)
  const monthlyTrashChartData = {
    labels: charts?.monthlyLabels || [],
    datasets: [
      {
        label: 'Sampah Terkumpul (Kg)',
        data: charts?.monthlyTrash || [],
        backgroundColor: 'rgba(46, 125, 50, 0.85)',
        borderRadius: 8
      }
    ]
  };

  // Chart 2: Top Trash Types (Doughnut)
  const topJenisChartData = {
    labels: charts?.topJenisLabels || [],
    datasets: [
      {
        data: charts?.topJenisData || [],
        backgroundColor: [
          '#2E7D32',
          '#66BB6A',
          '#0288D1',
          '#F59E0B',
          '#8B5CF6',
          '#EC4899'
        ]
      }
    ]
  };

  // Chart 3: Monthly Transactions (Line)
  const monthlyTrxChartData = {
    labels: charts?.monthlyLabels || [],
    datasets: [
      {
        label: 'Jumlah Transaksi',
        data: charts?.monthlyTrx || [],
        borderColor: '#0288D1',
        backgroundColor: 'rgba(2, 136, 209, 0.15)',
        tension: 0.3,
        fill: true
      }
    ]
  };

  // Chart 4: Bank Sampah per Kecamatan (Bar)
  const kecamatanChartData = {
    labels: charts?.kecamatanLabels || [],
    datasets: [
      {
        label: 'Bank Sampah Aktif',
        data: charts?.kecamatanData || [],
        backgroundColor: '#66BB6A',
        borderRadius: 8
      }
    ]
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <main className="flex-1 p-6 sm:p-10 space-y-8 overflow-y-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">Dashboard Administrator</h1>
            <p className="text-xs text-slate-500 mt-1">Monitoring & Statistik Pengelolaan Sampah Kota Palu</p>
          </div>
          <button
            onClick={loadDashboard}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white text-slate-700 font-bold rounded-xl border border-slate-200 shadow-xs hover:bg-slate-50 text-xs"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh Data</span>
          </button>
        </div>

        {/* 5 STAT CARDS (Section 4.B) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          <StatCard
            title="Total Bank Sampah"
            value={stats?.totalBankSampah || 0}
            unit="Lokasi"
            icon={Building2}
            color="emerald"
          />
          <StatCard
            title="Total Pengguna"
            value={stats?.totalPengguna || 0}
            unit="User"
            icon={Users}
            color="blue"
          />
          <StatCard
            title="Total Transaksi"
            value={stats?.totalTransaksi || 0}
            unit="Kupon"
            icon={ArrowLeftRight}
            color="amber"
          />
          <StatCard
            title="Total Sampah"
            value={stats?.totalSampahTerkumpul || 0}
            unit="Kg"
            icon={Weight}
            color="purple"
          />
          <StatCard
            title="Total Nilai"
            value={`Rp${(stats?.totalNilaiTransaksi || 0).toLocaleString('id-ID')}`}
            unit=""
            icon={Coins}
            color="indigo"
          />
        </div>

        {/* 4 CHARTS (Section 4.B) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Chart 1 */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-800 text-base">1. Total Sampah Terkumpul per Bulan (Kg)</h3>
            <div className="h-64">
              <Bar data={monthlyTrashChartData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </div>

          {/* Chart 2 */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-800 text-base">2. Jenis Sampah Paling Banyak Dikumpulkan</h3>
            <div className="h-64 flex justify-center">
              <Doughnut data={topJenisChartData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </div>

          {/* Chart 3 */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-800 text-base">3. Grafik Transaksi per Bulan</h3>
            <div className="h-64">
              <Line data={monthlyTrxChartData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </div>

          {/* Chart 4 */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-800 text-base">4. Bank Sampah Aktif per Kecamatan</h3>
            <div className="h-64">
              <Bar data={kecamatanChartData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}
