import React, { useState, useEffect, useRef } from 'react';
import { getMapHotspots } from '../../lib/api';
import type { MapHotspot } from '../../types';
import { Shield, Filter, MapPin, ChevronDown, Search, AlertCircle } from 'lucide-react';
import { useI18n } from '../../i18n/hooks';
import { translateDistrict, translateCategory } from '../../i18n/utils';

export default function HotspotMap() {
  const { t, currentLanguage } = useI18n();
  const [hotspots, setHotspots] = useState<MapHotspot[]>([]);
  const [category, setCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  // Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [searchError, setSearchError] = useState('');

  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

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

    const setupMap = (L: any) => {
      const container = document.getElementById('leaflet-hotspot-map');
      if (!container) return;

      // Initialize map instance only once
      if (!mapRef.current) {
        // Bengaluru center coordinates
        const mapInstance = L.map('leaflet-hotspot-map').setView([12.9716, 77.5946], 7);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors'
        }).addTo(mapInstance);
        mapRef.current = mapInstance;

        // Force a layout recalculation in case container size transitioned
        setTimeout(() => {
          mapInstance.invalidateSize();
        }, 100);
      }

      const map = mapRef.current;

      // Clear previous markers
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];

      // Custom marker icon creation
      const customIcon = L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34]
      });

      // Add new markers
      const newMarkers = hotspots
        .filter((point) => point.latitude && point.longitude)
        .map((point) => {
          const marker = L.marker([point.latitude, point.longitude], { icon: customIcon })
            .addTo(map);

          marker.bindPopup(`
            <div style="font-family: sans-serif; font-size: 11px; line-height: 1.4;">
              <strong style="color: #0a1317; font-size: 12px;">${point.firNumber}</strong><br/>
              <strong>${currentLanguage === 'en' ? 'Category' : 'ಅಪರಾಧ ವಿಭಾಗ'}:</strong> ${translateCategory(point.category, currentLanguage)}<br/>
              <strong>${currentLanguage === 'en' ? 'District' : 'ಜಿಲ್ಲೆ'}:</strong> ${translateDistrict(point.district, currentLanguage)}<br/>
              <strong>${currentLanguage === 'en' ? 'Density Weight' : 'ಸಾಂದ್ರತೆಯ ಪ್ರಮಾಣ'}:</strong> ${point.weight}
            </div>
          `);

          // Attach metadata to marker for search referencing
          (marker as any).firNumber = point.firNumber;

          return marker;
        });

      markersRef.current = newMarkers;
      setMapLoaded(true);
    };

    // Load Leaflet styles dynamically
    if (!document.querySelector('link[href*="leaflet.css"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    let loadListener: (() => void) | null = null;
    let scriptElement: HTMLScriptElement | null = null;

    if ((window as any).L) {
      setupMap((window as any).L);
    } else {
      // Find or create leaflet.js script tag
      let script = document.querySelector('script[src*="leaflet.js"]') as HTMLScriptElement;
      if (!script) {
        script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.async = true;
        document.body.appendChild(script);
      }
      scriptElement = script;

      loadListener = () => {
        if ((window as any).L) {
          setupMap((window as any).L);
        }
      };
      script.addEventListener('load', loadListener);
    }

    return () => {
      if (loadListener && scriptElement) {
        scriptElement.removeEventListener('load', loadListener);
      }
    };
  }, [loading, hotspots]);

  // Clean up map instance on unmount
  useEffect(() => {
    return () => {
      if (mapRef.current) {
        try {
          mapRef.current.remove();
        } catch (e) {
          console.warn('Leaflet cleanup warning:', e);
        }
        mapRef.current = null;
      }
    };
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    if (!mapRef.current) return;

    const query = searchQuery.trim().toLowerCase();
    const marker = markersRef.current.find((m) => {
      return m.firNumber && m.firNumber.toLowerCase().includes(query);
    });

    if (marker) {
      mapRef.current.setView(marker.getLatLng(), 12);
      marker.openPopup();
      setSearchError('');
    } else {
      setSearchError(
        currentLanguage === 'en' 
          ? `No match found for "${searchQuery}"` 
          : `"${searchQuery}" ಗೆ ಯಾವುದೇ ಸಾಮ್ಯತೆ ಕಂಡುಬಂದಿಲ್ಲ`
      );
    }
  };

  const handleSidebarClick = (firNumber: string) => {
    const marker = markersRef.current.find(m => m.firNumber === firNumber);
    if (marker && mapRef.current) {
      mapRef.current.setView(marker.getLatLng(), 12);
      marker.openPopup();
      setSearchError('');
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-steel font-bold">
            {currentLanguage === 'en' ? 'Geospatial Intelligence' : 'ಭೂ-ಸ್ಥಳೀಯ ಗುಪ್ತಚರ'}
          </span>
          <h1 className="text-xl md:text-2xl font-bold text-ink-deep">{t('map.title')}</h1>
        </div>
        
        {/* Filters and Search controls */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          {/* FIR Search Bar */}
          <form onSubmit={handleSearchSubmit} className="relative flex items-center w-full sm:w-auto">
            <div className="relative group w-full sm:w-auto">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                placeholder={currentLanguage === 'en' ? "Search FIR number..." : "ಎಫ್‌ಐಆರ್ ಸಂಖ್ಯೆ ಹುಡುಕಿ..."}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (searchError) setSearchError('');
                }}
                className="w-full sm:w-[220px] pl-10 pr-8 bg-surface-soft border border-hairline hover:border-steel focus:border-2 focus:border-fb-blue focus:ring-0 rounded-full text-xs text-ink placeholder-stone h-10 transition-all duration-150 outline-none font-medium"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSearchError('');
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone hover:text-ink text-sm font-bold focus:outline-none p-1"
                >
                  &times;
                </button>
              )}
            </div>
            
            {/* Tooltip error message */}
            {searchError && (
              <span className="absolute top-11 left-0 sm:left-auto sm:right-0 text-[10px] font-bold text-critical-strong bg-white px-2.5 py-1.5 rounded-lg shadow-lg border border-critical-strong/20 z-[100] flex items-center gap-1.5 animate-in fade-in slide-in-from-top-1 duration-150 whitespace-nowrap">
                <AlertCircle className="w-3.5 h-3.5 text-critical-strong shrink-0" />
                {searchError}
              </span>
            )}
          </form>

          {/* Category Filter */}
          <div className="flex items-center gap-2 relative">
            <Filter className="w-4 h-4 text-stone" aria-hidden="true" />
            <div className="relative">
              <button
                type="button"
                aria-haspopup="listbox"
                aria-expanded={isCategoryOpen}
                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                className="px-4 py-1.5 bg-canvas border border-hairline hover:border-steel rounded-full text-xs text-ink text-left flex items-center justify-between gap-1.5 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary min-w-[180px] h-10 font-bold"
              >
                <span>
                  {translateCategory(category, currentLanguage)}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-stone shrink-0 transition-transform duration-200" style={{ transform: isCategoryOpen ? 'rotate(180deg)' : 'none' }} />
              </button>

              {isCategoryOpen && (
                <>
                  <div className="fixed inset-0 z-45" onClick={() => setIsCategoryOpen(false)}></div>
                  <ul
                    role="listbox"
                    className="absolute right-0 mt-1.5 min-w-[200px] max-h-60 overflow-y-auto bg-canvas border border-hairline-soft rounded-xl shadow-lg py-1 z-50 text-xs font-bold text-ink divide-y divide-hairline-soft animate-in fade-in slide-in-from-top-1 duration-100"
                  >
                    {[
                      { val: 'all', label: translateCategory('all', currentLanguage) },
                      { val: 'Theft / Burglary', label: translateCategory('Theft / Burglary', currentLanguage) },
                      { val: 'Robbery', label: translateCategory('Robbery', currentLanguage) },
                      { val: 'Cheating / Fraud', label: translateCategory('Cheating / Fraud', currentLanguage) },
                      { val: 'Assault', label: translateCategory('Assault', currentLanguage) }
                    ].map(item => (
                      <li
                        key={item.val}
                        role="option"
                        aria-selected={item.val === category}
                        onClick={() => {
                          setCategory(item.val);
                          setIsCategoryOpen(false);
                        }}
                        className={`px-4 py-2.5 hover:bg-surface-soft cursor-pointer transition-colors duration-150 flex items-center justify-between ${
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
      </div>

      {/* Map Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Statistics */}
        <div className="lg:col-span-1 bg-canvas border border-hairline-soft p-5 rounded-xxxl shadow-xs space-y-4 max-h-[500px] overflow-y-auto">
          <span className="text-[10px] uppercase tracking-wider text-steel font-bold">
            {currentLanguage === 'en' ? 'Spatial Distribution' : 'ಸ್ಥಳೀಯ ವಿತರಣೆ'}
          </span>
          <h3 className="text-sm font-bold text-ink-deep border-b border-hairline-soft pb-2" style={{ fontFeatureSettings: '"ss01" on, "ss02" on' }}>
            {currentLanguage === 'en' ? 'Incidents Breakdown' : 'ಪ್ರಕರಣಗಳ ವಿವರ'}
          </h3>
          <div className="space-y-2">
            {hotspots.map((point, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSidebarClick(point.firNumber)}
                className="w-full flex items-start justify-between text-left text-xs pb-2.5 pt-1.5 border-b border-hairline-soft last:border-0 last:pb-0 hover:bg-surface-soft/60 px-2 rounded-xl transition cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <div className="space-y-0.5">
                  <div className="font-bold text-ink-deep">{point.firNumber}</div>
                  <div className="text-[10px] text-stone font-medium flex items-center gap-0.5">
                    <MapPin className="w-3 h-3 text-stone/85" aria-hidden="true" /> {translateDistrict(point.district, currentLanguage)}
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-surface-soft text-[9px] font-bold text-ink uppercase tracking-wider shrink-0 mt-0.5">
                  w-{point.weight}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Leaflet Map Frame */}
        <div className="lg:col-span-3 h-[500px] bg-surface-soft border border-hairline-soft rounded-xxxl shadow-xs overflow-hidden relative">
          {loading && (
            <div className="absolute inset-0 bg-surface-soft/80 flex flex-col items-center justify-center gap-2 z-10 animate-in fade-in duration-300">
              <div className="w-8 h-8 rounded-circle border-4 border-hairline-soft border-t-primary animate-spin" />
              <span className="text-xs text-steel font-bold">
                {currentLanguage === 'en' ? 'Locating crime clusters…' : 'ಅಪರಾಧ ವಲಯಗಳನ್ನು ಪತ್ತೆ ಮಾಡಲಾಗುತ್ತಿದೆ...'}
              </span>
            </div>
          )}
          <div id="leaflet-hotspot-map" className="w-full h-full" style={{ zIndex: 1 }} />
        </div>
      </div>
    </div>
  );
}
