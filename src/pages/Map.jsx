import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useLanguage } from '../context/LanguageContext';

const getHealthColor = (score) => {
  if (score <= 35) return '#00B4D8';
  if (score <= 68) return '#7209B7';
  return '#E76F51';
};

const getHealthLabel = (score) => {
  if (score <= 35) return 'Poor';
  if (score <= 68) return 'Moderate';
  return 'Prime';
};

const MapPage = () => {
  const { language } = useLanguage();
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchScans = async () => {
      const currentUser = localStorage.getItem('currentUser');
      if (!currentUser) {
        setLoading(false);
        return;
      }
      
      try {
        const res = await fetch(`/api/soil-scans?username=${currentUser}`);
        const data = await res.json();
        if (data.success) {
          // Filter out invalid scans that don't have proper coordinates
          const validScans = (data.soilScans || []).filter(
            s => typeof s.lat === 'number' && typeof s.lng === 'number' && !isNaN(s.lat) && !isNaN(s.lng)
          );
          setScans(validScans);
        } else {
          setError(data.error);
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load map data');
      } finally {
        setLoading(false);
      }
    };
    fetchScans();
  }, []);

  // Determine initial center. Default to center of India if no scans exist.
  const center = scans.length > 0 
    ? [scans[scans.length - 1].lat, scans[scans.length - 1].lng] 
    : [22.0, 78.0];

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] bg-[#0a0a0a] overflow-hidden flex flex-col font-body">
      {/* Glassmorphism Header Overlay */}
      <div className="absolute top-6 left-6 z-[1000] max-w-md p-6 rounded-2xl border border-white/15 backdrop-blur-md bg-black/40 shadow-2xl pointer-events-none">
        <h1 className="font-heading text-3xl sm:text-4xl text-white uppercase tracking-widest mb-2">
          Soil <span className="text-[#00B4D8]">Telemetry</span>
        </h1>
        <p className="font-body text-white/70 text-sm mb-4">
          {language === 'hi' 
            ? 'आपके प्रोफाइल से जुड़ा लाइव मृदा स्वास्थ्य 2D नक्शा।' 
            : language === 'ta' 
            ? 'உங்கள் சுயவிவரத்துடன் ஒத்திசைக்கப்பட்ட நேரடி 2D மண் சுகாதார வரைபடம்.' 
            : 'Live 2D soil telemetry map synced with your profile.'}
        </p>
        
        <div className="flex flex-col gap-2 text-xs font-mono tracking-widest text-white/80 uppercase">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-[#00B4D8] shadow-[0_0_8px_rgba(0,180,216,0.8)]" />
            <span>0-35 (Poor)</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-[#7209B7] shadow-[0_0_8px_rgba(114,9,183,0.8)]" />
            <span>36-68 (Moderate)</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-[#E76F51] shadow-[0_0_8px_rgba(231,111,81,0.8)]" />
            <span>69-100 (Prime)</span>
          </div>
        </div>

        {!localStorage.getItem('currentUser') && (
          <div className="mt-4 p-3 border border-red-500/50 rounded-xl bg-red-500/10 text-red-400 text-xs">
            You must be logged in to sync and save map locations.
          </div>
        )}
      </div>

      {/* 2D Leaflet Map */}
      <div className="w-full flex-1 relative z-0">
        <MapContainer 
          center={center} 
          zoom={4} 
          style={{ height: '100%', width: '100%' }}
          zoomControl={true}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />
          
          {scans.map((scan, i) => (
            <CircleMarker
              key={i}
              center={[scan.lat, scan.lng]}
              radius={10}
              pathOptions={{
                fillColor: getHealthColor(scan.soilHealth),
                fillOpacity: 0.8,
                color: '#ffffff', // Stroke color
                weight: 2,        // Stroke weight
              }}
            >
              <Popup className="custom-dark-popup">
                <div className="flex flex-col gap-2">
                  <div className="text-[10px] text-white/50 uppercase tracking-widest border-b border-white/10 pb-1">
                    {new Date(scan.timestamp || Date.now()).toLocaleString()}
                  </div>
                  <div className="text-xl font-bold font-heading">
                    <span style={{ color: getHealthColor(scan.soilHealth) }}>{scan.soilHealth}</span> / 100 <span className="text-sm font-normal text-white/70">{getHealthLabel(scan.soilHealth)}</span>
                  </div>
                  <div className="flex gap-4 mt-2 pt-2 border-t border-white/10 text-xs font-mono">
                    <div className="flex flex-col">
                      <span className="text-white/50">Moisture</span>
                      <span className="text-white">{scan.moisture ?? '--'}%</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-white/50">pH</span>
                      <span className="text-white">{scan.ph ?? '--'}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-white/50">NPK</span>
                      <span className="text-white">{scan.n ?? '--'}/{scan.p ?? '--'}/{scan.k ?? '--'}</span>
                    </div>
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default MapPage;
