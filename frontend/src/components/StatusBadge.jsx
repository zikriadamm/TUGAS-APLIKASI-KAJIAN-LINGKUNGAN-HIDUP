import React from 'react';

export default function StatusBadge({ status }) {
  const getBadgeStyle = (st) => {
    switch (st) {
      case 'Menunggu':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Diproses':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Diterima':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'Selesai':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Ditolak':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'aktif':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'nonaktif':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getBadgeStyle(status)}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-75"></span>
      {status}
    </span>
  );
}
