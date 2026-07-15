import React, { useState, useEffect } from 'react';
import { getMapHotspots } from '../../lib/api';
import type { MapHotspot } from '../../types';
import { Shield, Filter, MapPin, ChevronDown } from 'lucide-react';

export default function HotspotMap() {
  const [hotspots, setHotspots] = useState<MapHotspot[]>([]);
  const [category, setCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  useEffect(() => {
    fetchHotspots();
  }, [category]);

  const fetchHotspots = async () => {
    setLoading(true);
    try {
      const data = await getMapHotspots({ category });
      setHotspots(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Initialize Leaflet Map client-side only (avoiding SSR errors)
  useEffect(() => {
    if (typeof window === 'undefined' || loading) return;

    // Load Leaflet styles dynamically
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);

    let mapInstance: any = null;

    // Dynamic import to avoid SSR errors
    import('leaflet').then((L) => {
      // Find or reset container
      const container = document.getElementById('leaflet-hotspot-map');
      if (!container) return;

      // Clean up previous instance if any
      const containerState = (container as any)._leaflet_id;
      if (containerState) {
        return; // Already initialized
      }

      // Bengaluru center coordinates
      mapInstance = L.map('leaflet-hotspot-map').setView([12.9716, 77.5946], 7);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(mapInstance);

      // Custom marker icon creation
      const customIcon = L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34]
      });

      hotspots.forEach((point) => {
        if (!point.latitude || !point.longitude) return;

        const marker = L.marker([point.latitude, point.longitude], { icon: customIcon })
          .addTo(mapInstance);

        marker.bindPopup(`
          <div style="font-family: sans-serif; font-size: 11px; line-height: 1.4;">
            <strong style="color: #0a1317; font-size: 12px;">${point.firNumber}</strong><br/>
            <strong>Category:</strong> ${point.category}<br/>
            <strong>District:</strong> ${point.district}<br/>
            <strong>Density Weight:</strong> ${point.weight}
          </div>
        `);
      });

      setMapLoaded(true);
    });

    return () => {
      // Leaflet cleanup logic is handled automatically by letting map instance garbage collect or replacing html container
    };
  }, [loading, hotspots]);

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-steel font-bold">Geospatial Intelligence</span>
          <h1 className="text-xl md:text-2xl font-bold text-ink-deep">Crime Hotspots Map</h1>
        </div>
        
        {/* Category Filter */}
        <div className="flex items-center gap-2 relative">
          <Filter className="w-4 h-4 text-stone" aria-hidden="true" />
          <div className="relative">
            <button
              type="button"
              aria-haspopup="listbox"
              aria-expanded={isCategoryOpen}
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
              className="px-4 py-1.5 bg-canvas border border-hairline hover:border-steel rounded-full text-xs text-ink text-left flex items-center justify-between gap-1.5 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary min-w-[180px]"
            >
              <span>
                {(() => {
                  const options: Record<string, string> = {
                    all: "All Crime Categories",
                    "Theft / Burglary": "Theft / Burglary",
                    Robbery: "Robbery",
                    "Cheating / Fraud": "Cheating / Fraud",
                    Assault: "Assault"
                  };
                  return options[category] || "Select Category";
                })()}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-stone shrink-0 transition-transform duration-200" style={{ transform: isCategoryOpen ? 'rotate(180deg)' : 'none' }} />
            </button>

            {isCategoryOpen && (
              <>
                <div className="fixed inset-0 z-45" onClick={() => setIsCategoryOpen(false)}></div>
                <ul
                  role="listbox"
                  className="absolute right-0 mt-1.5 min-w-[200px] max-h-60 overflow-y-auto bg-canvas border border-hairline-soft rounded-xl shadow-lg py-1 z-50 text-xs font-medium text-ink divide-y divide-hairline-soft animate-in fade-in slide-in-from-top-1 duration-100"
                >
                  {[
                    { val: 'all', label: 'All Crime Categories' },
                    { val: 'Theft / Burglary', label: 'Theft / Burglary' },
                    { val: 'Robbery', label: 'Robbery' },
                    { val: 'Cheating / Fraud', label: 'Cheating / Fraud' },
                    { val: 'Assault', label: 'Assault' }
                  ].map(item => (
                    <li
                      key={item.val}
                      role="option"
                      aria-selected={item.val === category}
                      onClick={() => {
                        setCategory(item.val);
                        setIsCategoryOpen(false);
                      }}
                      className={`px-4 py-2 hover:bg-surface-soft cursor-pointer transition-colors duration-150 flex items-center justify-between ${
                        item.val === category ? 'bg-primary/5 text-primary font-bold' : ''
                      }`}
                    >
                      <span>{item.label}</span>
                      {item.val === category && <div className="w-1.5 h-1.5 rounded-circle bg-primary shrink-0" />}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Map Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Statistics */}
        <div className="lg:col-span-1 bg-canvas border border-hairline-soft p-5 rounded-xxxl card-product-shadow space-y-4">
          <span className="text-[10px] uppercase tracking-wider text-steel font-bold">Spatial Distribution</span>
          <h3 className="text-sm font-bold text-ink-deep border-b border-hairline-soft pb-2">
            Incidents Breakdown
          </h3>
          <div className="space-y-3">
            {hotspots.map((point, idx) => (
              <div key={idx} className="flex items-start justify-between text-xs pb-2.5 border-b border-hairline-soft last:border-0 last:pb-0">
                <div className="space-y-0.5">
                  <div className="font-bold text-ink-deep">{point.firNumber}</div>
                  <div className="text-[10px] text-stone font-medium flex items-center gap-0.5">
                    <MapPin className="w-3 h-3 text-stone/80" aria-hidden="true" /> {point.district}
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-surface-soft text-[9px] font-bold text-ink uppercase tracking-wider">
                  w-{point.weight}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Leaflet Map Frame */}
        <div className="lg:col-span-3 h-[500px] bg-surface-soft border border-hairline-soft rounded-xxxl card-product-shadow overflow-hidden relative">
          {loading && (
            <div className="absolute inset-0 bg-surface-soft/80 flex flex-col items-center justify-center gap-2 z-10">
              <div className="w-8 h-8 rounded-circle border-4 border-hairline-soft border-t-primary animate-spin" />
              <span className="text-xs text-steel font-bold">Locating crime clusters…</span>
            </div>
          )}
          <div id="leaflet-hotspot-map" className="w-full h-full" style={{ zIndex: 1 }} />
        </div>
      </div>
    </div>
  );
}
