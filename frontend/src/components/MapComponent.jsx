import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Phone, Clock, Recycle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Custom Leaflet Green Icon
const greenIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function MapRecenter({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, 13);
    }
  }, [center, map]);
  return null;
}

export default function MapComponent({ bankSampahList = [], selectedBank = null, onSelectBank = null, height = '500px' }) {
  const navigate = useNavigate();
  const defaultCenter = [-0.8917, 119.8707]; // Coordinates of Kota Palu

  const mapCenter = selectedBank && selectedBank.latitude && selectedBank.longitude
    ? [selectedBank.latitude, selectedBank.longitude]
    : defaultCenter;

  return (
    <div style={{ height }} className="relative w-full rounded-2xl overflow-hidden shadow-md border border-slate-200">
      <MapContainer
        center={defaultCenter}
        zoom={13}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapRecenter center={mapCenter} />

        {bankSampahList.map((bank) => {
          if (!bank.latitude || !bank.longitude) return null;
          return (
            <Marker
              key={bank.id}
              position={[bank.latitude, bank.longitude]}
              icon={greenIcon}
            >
              <Popup className="custom-leaflet-popup">
                <div className="p-1 min-w-[240px] max-w-[280px]">
                  <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-100">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                      <Recycle className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-800 leading-tight">{bank.nama_bank_sampah}</h4>
                      <span className="text-[11px] text-emerald-600 font-semibold">{bank.kecamatan}</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-600 mb-3">
                    <p className="flex items-start gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span>{bank.alamat}</span>
                    </p>
                    {bank.nomor_telepon && (
                      <p className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{bank.nomor_telepon}</span>
                      </p>
                    )}
                    {bank.jam_operasional && (
                      <p className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{bank.jam_operasional}</span>
                      </p>
                    )}
                  </div>

                  {/* Accepted trash badge preview */}
                  {bank.jenis_sampah_accepted && bank.jenis_sampah_accepted.length > 0 && (
                    <div className="mb-3">
                      <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Menerima Sampah:</p>
                      <div className="flex flex-wrap gap-1">
                        {bank.jenis_sampah_accepted.slice(0, 3).map(j => (
                          <span key={j.id} className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-medium rounded-md">
                            {j.nama_sampah}
                          </span>
                        ))}
                        {bank.jenis_sampah_accepted.length > 3 && (
                          <span className="text-[10px] text-slate-400 self-center">+{bank.jenis_sampah_accepted.length - 3} lagi</span>
                        )}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => {
                      if (onSelectBank) {
                        onSelectBank(bank);
                      } else {
                        navigate('/masyarakat/tukar', { state: { selectedBankId: bank.id } });
                      }
                    }}
                    className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1 transition-colors"
                  >
                    <span>Tukar Sampah Di Sini</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
