import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { getReportsForMap } from '../services/reportService';
import 'leaflet/dist/leaflet.css';

// Fix default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const getMarkerIcon = (urgency) => {
  const colors = { high: '#ff635b', medium: '#f59e0b', low: '#16a34a' };
  const color = colors[urgency] || '#000666';
  
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="position:relative">
      <div style="position:absolute;width:32px;height:32px;border-radius:50%;background:${color};opacity:0.3;animation:pulse-ring 1.5s infinite"></div>
      <div style="width:24px;height:24px;border-radius:50%;background:${color};border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.4);position:relative;z-index:1"></div>
    </div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

const typeIcons = {
  violence: 'security',
  accident: 'car_crash',
  fire: 'local_fire_department',
  kidnapping: 'no_encryption',
  medical: 'medical_services',
  other: 'report_problem'
};

function CrisisMap() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    fetchReports();
    getUserLocation();
  }, []);

  const fetchReports = async () => {
    try {
      const data = await getReportsForMap();
      setReports(data);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude }),
        () => setUserLocation({ lat: 9.082, lng: 8.6753 }),
        { enableHighAccuracy: true }
      );
    }
  };

  const filteredReports = filter === 'all' ? reports : reports.filter(r => r.urgency === filter);
  const defaultCenter = userLocation || { lat: 9.082, lng: 8.6753 };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center pt-16">
        <div className="text-center">
          <span className="animate-spin material-symbols-outlined text-primary text-6xl">progress_activity</span>
          <p className="text-on-surface-variant mt-4 text-sm font-bold uppercase tracking-widest">Loading tactical map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface pt-16">
      {/* Header */}
      <div className="bg-surface-container-low shadow-sm p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-primary block mb-1">Live Sector Intel</span>
              <h1 className="text-3xl font-black text-on-surface tracking-tighter uppercase">Crisis Map</h1>
            </div>
            
            {/* Filter Buttons */}
            <div className="flex gap-2 flex-wrap">
              {[
                { key: 'all', label: 'All', icon: 'public' },
                { key: 'high', label: 'Critical', icon: 'emergency' },
                { key: 'medium', label: 'Medium', icon: 'warning' },
                { key: 'low', label: 'Low', icon: 'info' }
              ].map((f) => (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={`flex items-center gap-1 px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-widest transition-all ${
                    filter === f.key
                      ? 'bg-primary text-on-primary shadow-lg'
                      : 'bg-surface-container-highest text-on-surface-variant hover:bg-surface-container-high'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">{f.icon}</span>
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-surface-container-high border-b border-outline-variant/20 p-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-3xl font-black text-primary">{reports.length}</div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-secondary">Total Reports</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-black text-on-tertiary-container">{reports.filter(r => r.urgency === 'high').length}</div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-secondary">Critical</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-black text-warning">{reports.filter(r => r.urgency === 'medium').length}</div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-secondary">Medium</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-black text-success">{reports.filter(r => r.status === 'resolved').length}</div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-secondary">Resolved</div>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="h-[calc(100vh-300px)] min-h-[400px] p-4">
        <MapContainer
          center={[defaultCenter.lat, defaultCenter.lng]}
          zoom={6}
          style={{ height: '100%', width: '100%', borderRadius: '0.75rem' }}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />
          
          {filteredReports.map((report) => (
            report.location?.lat && report.location?.lng && (
              <Marker
                key={report.id}
                position={[report.location.lat, report.location.lng]}
                icon={getMarkerIcon(report.urgency)}
              >
                <Popup>
                  <div className="p-3 min-w-[220px] font-body">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="material-symbols-outlined text-primary text-xl">
                        {typeIcons[report.type] || 'report_problem'}
                      </span>
                      <h3 className="font-black text-on-surface capitalize text-sm">{report.type}</h3>
                    </div>
                    <p className="text-xs text-on-surface-variant mb-2 line-clamp-2">
                      {report.aiAnalysis?.summary || report.description}
                    </p>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`inline-block w-2 h-2 rounded-full ${
                        report.urgency === 'high' ? 'bg-tertiary-container' :
                        report.urgency === 'medium' ? 'bg-warning' : 'bg-success'
                      }`}></span>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">{report.urgency}</span>
                    </div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-secondary">
                      Status: <span className="text-on-surface capitalize">{report.status}</span>
                    </div>
                    {report.aiAnalysis?.severityScore && (
                      <div className="mt-2">
                        <div className="text-[10px] font-bold uppercase tracking-widest text-secondary">AI Severity</div>
                        <div className="w-full bg-surface-container-highest rounded h-1.5 mt-1">
                          <div
                            className={`h-1.5 rounded ${
                              report.aiAnalysis.severityScore > 0.7 ? 'bg-tertiary-container' :
                              report.aiAnalysis.severityScore > 0.4 ? 'bg-warning' : 'bg-success'
                            }`}
                            style={{ width: `${report.aiAnalysis.severityScore * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                </Popup>
              </Marker>
            )
          ))}
        </MapContainer>
      </div>

      {/* Legend */}
      <div className="bg-surface-container-low border-t border-outline-variant/20 p-4">
        <div className="max-w-7xl mx-auto flex gap-6 justify-center flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-tertiary-container"></div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-secondary">Critical</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-warning"></div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-secondary">Medium</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-success"></div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-secondary">Low</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CrisisMap;
