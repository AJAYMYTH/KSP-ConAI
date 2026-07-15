import React, { useState, useEffect, useRef } from 'react';
import { getMapHotspots } from '../../lib/api';
import type { MapHotspot } from '../../types';
import { Shield, Filter, MapPin, ChevronDown } from 'lucide-react';

const TRANSLATIONS = {
  EN: {
    geospatialIntel: "Geospatial Intelligence",
    pageTitle: "Crime Hotspots Map",
    spatialDist: "Spatial Distribution",
    incidentsBreakdown: "Incidents Breakdown",
    locatingClusters: "Locating crime clusters…",
    allCategories: "All Crime Categories"
  },
  KN: {
    geospatialIntel: "ಭೂ-ಸ್ಥಳೀಯ ಗುಪ್ತಚರ",
    pageTitle: "ಅಪರಾಧ ಹಾಟ್‌ಸ್ಪಾಟ್‌ಗಳ ನಕ್ಷೆ",
    spatialDist: "ಸ್ಥಳೀಯ ವಿತರಣೆ",
    incidentsBreakdown: "ಪ್ರಕರಣಗಳ ವಿವರ",
    locatingClusters: "ಅಪರಾಧ ವಲಯಗಳನ್ನು ಪತ್ತೆ ಮಾಡಲಾಗುತ್ತಿದೆ...",
    allCategories: "ಎಲ್ಲಾ ಅಪರಾಧ ವಿಭಾಗಗಳು"
  }
};

const translateDistrict = (district: string, lang: 'EN' | 'KN') => {
  if (lang === 'EN') return district;
  const mapping: Record<string, string> = {
    'all': 'ಎಲ್ಲಾ ಜಿಲ್ಲೆಗಳು',
    'Bengaluru City': 'ಬೆಂಗಳೂರು ನಗರ',
    'Mysuru City': 'ಮೈಸೂರು ನಗರ',
    'Hubballi-Dharwad City': 'ಹುಬ್ಬಳ್ಳಿ-ಧಾರವಾಡ ನಗರ',
    'Mangaluru City': 'ಮಂಗಳೂರು ನಗರ',
    'Belagavi': 'ಬೆಳಗಾವಿ',
    'Kalaburagi': 'ಕಲಬುರಗಿ',
    'Bengaluru': 'ಬೆಂಗಳೂರು',
    'Mysuru': 'ಮೈಸೂರು'
  };
  return mapping[district] || district;
};

const translateCategory = (cat: string, lang: 'EN' | 'KN') => {
  if (lang === 'EN') return cat;
  const mapping: Record<string, string> = {
    'all': 'ಎಲ್ಲಾ ಅಪರಾಧ ವಿಭಾಗಗಳು',
    'Theft / Burglary': 'ಕಳ್ಳತನ / ಕನ್ನಗಳ್ಳತನ',
    'Assault': 'ಹಲ್ಲೆ',
    'Cheating / Fraud': 'ವಂಚನೆ / ಅಪರಾಧ',
    'Robbery': 'ದರೋಡೆ',
    'Cyber Crimes': 'ಸೈಬರ್ ಅಪರಾಧಗಳು',
    'Other Crimes': 'ಇತರ ಅಪರಾಧಗಳು'
  };
  return mapping[cat] || cat;
};

export default function HotspotMap() {
  const [hotspots, setHotspots] = useState<MapHotspot[]>([]);
  const [category, setCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [language, setLanguage] = useState<'EN' | 'KN'>('EN');

  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  useEffect(() => {
    fetchHotspots();

    const saved = localStorage.getItem('ksp_language') as 'EN' | 'KN';
    if (saved === 'EN' || saved === 'KN') {
      setLanguage(saved);
    }

    const handleLangChange = (e: Event) => {
      const customEvent = e as CustomEvent<'EN' | 'KN'>;
      setLanguage(customEvent.detail);
    };

    window.addEventListener('ksp-language-change', handleLangChange);
    return () => {
      window.removeEventListener('ksp-language-change', handleLangChange);
    };
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
              <strong>${language === 'EN' ? 'Category' : 'ಅಪರಾಧ ವಿಭಾಗ'}:</strong> ${translateCategory(point.category, language)}<br/>
              <strong>${language === 'EN' ? 'District' : 'ಜಿಲ್ಲೆ'}:</strong> ${translateDistrict(point.district, language)}<br/>
              <strong>${language === 'EN' ? 'Density Weight' : 'ಸಾಂದ್ರತೆಯ ಪ್ರಮಾಣ'}:</strong> ${point.weight}
            </div>
          `);

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

  const t = TRANSLATIONS[language];

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-steel font-bold">{t.geospatialIntel}</span>
          <h1 className="text-xl md:text-2xl font-bold text-ink-deep">{t.pageTitle}</h1>
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
                {translateCategory(category, language)}
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
                    { val: 'all', label: translateCategory('all', language) },
                    { val: 'Theft / Burglary', label: translateCategory('Theft / Burglary', language) },
                    { val: 'Robbery', label: translateCategory('Robbery', language) },
                    { val: 'Cheating / Fraud', label: translateCategory('Cheating / Fraud', language) },
                    { val: 'Assault', label: translateCategory('Assault', language) }
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
          <span className="text-[10px] uppercase tracking-wider text-steel font-bold">{t.spatialDist}</span>
          <h3 className="text-sm font-bold text-ink-deep border-b border-hairline-soft pb-2">
            {t.incidentsBreakdown}
          </h3>
          <div className="space-y-3">
            {hotspots.map((point, idx) => (
              <div key={idx} className="flex items-start justify-between text-xs pb-2.5 border-b border-hairline-soft last:border-0 last:pb-0">
                <div className="space-y-0.5">
                  <div className="font-bold text-ink-deep">{point.firNumber}</div>
                  <div className="text-[10px] text-stone font-medium flex items-center gap-0.5">
                    <MapPin className="w-3 h-3 text-stone/80" aria-hidden="true" /> {translateDistrict(point.district, language)}
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
              <span className="text-xs text-steel font-bold">{t.locatingClusters}</span>
            </div>
          )}
          <div id="leaflet-hotspot-map" className="w-full h-full" style={{ zIndex: 1 }} />
        </div>
      </div>
    </div>
  );
}
