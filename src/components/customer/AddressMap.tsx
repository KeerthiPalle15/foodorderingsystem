'use client';

import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui';

interface AddressMapProps {
  onAddressSelect: (address: string, lat: number, lng: number) => void;
  initialAddress?: string;
}

declare global {
  interface Window {
    L: any;
  }
}

export function AddressMap({ onAddressSelect, initialAddress }: AddressMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(initialAddress || '');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Load Leaflet CSS and JS
    const loadLeaflet = async () => {
      if (typeof window !== 'undefined' && !window.L) {
        // Load CSS
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);

        // Load JS
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.async = true;
        script.onload = () => {
          setMapLoaded(true);
        };
        document.body.appendChild(script);
      } else if (window.L) {
        setMapLoaded(true);
      }
    };

    loadLeaflet();
  }, []);

  useEffect(() => {
    if (!mapLoaded || !mapRef.current || !window.L) return;

    // Initialize map
    const map = window.L.map(mapRef.current).setView([20.5937, 78.9629], 5); // Default to India center

    // Add OpenStreetMap tiles
    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    // Fix for default marker icon
    const DefaultIcon = window.L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    window.L.Marker.prototype.options.icon = DefaultIcon;

    mapInstanceRef.current = map;

    // Handle click on map
    map.on('click', (e: any) => {
      const { lat, lng } = e.latlng;

      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lng]);
      } else {
        markerRef.current = window.L.marker([lat, lng]).addTo(map);
      }

      // Get address from coordinates using reverse geocoding
      fetchAddress(lat, lng);
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }
    };
  }, [mapLoaded]);

  const fetchAddress = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();
      const address = data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
      setSelectedAddress(address);
      onAddressSelect(address, lat, lng);
    } catch (error) {
      const address = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
      setSelectedAddress(address);
      onAddressSelect(address, lat, lng);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim() || !mapInstanceRef.current || !window.L) return;

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        const latNum = parseFloat(lat);
        const lngNum = parseFloat(lon);

        mapInstanceRef.current.setView([latNum, lngNum], 15);

        if (markerRef.current) {
          markerRef.current.setLatLng([latNum, lngNum]);
        } else {
          markerRef.current = window.L.marker([latNum, lngNum]).addTo(mapInstanceRef.current);
        }

        setSelectedAddress(data[0].display_name);
        onAddressSelect(data[0].display_name, latNum, lngNum);
      }
    } catch (error) {
      console.error('Error searching address:', error);
    }
  };

  return (
    <Card className="p-6">
      <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        Pinpoint Your Delivery Location
      </h3>
      
      <p className="text-sm text-gray-500 mb-4">
        Click on the map to mark your exact delivery location or search for your address
      </p>

      {/* Search Box */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for your address..."
          className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2.5 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </div>

      {/* Map Container */}
      <div 
        ref={mapRef} 
        className="w-full h-64 rounded-xl border border-gray-200 overflow-hidden"
        style={{ minHeight: '256px' }}
      />

      {/* Selected Address Display */}
      {selectedAddress && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-700 font-medium flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Location Selected
          </p>
          <p className="text-sm text-gray-700 mt-1 line-clamp-2">{selectedAddress}</p>
        </div>
      )}

      {!mapLoaded && (
        <div className="w-full h-64 rounded-xl border border-gray-200 flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-sm text-gray-500">Loading map...</p>
          </div>
        </div>
      )}
    </Card>
  );
}
