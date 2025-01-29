'use client';

import { useState, useCallback } from 'react';
import Map from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import ZoneScoreModal from '@/components/ZoneScoreModal';

interface ZoneScoreData {
  zoneScore: number;
  region: string;
  setupCost: number;
  annualRevenue: number;
  operationalCost: number;
  netProfit: number;
  paybackPeriod: number;
}

export default function Page() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);
  const [zoneScore, setZoneScore] = useState<ZoneScoreData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculateZoneScore = useCallback(async (coords: [number, number]) => {
    console.log('Calculating for:', coords);
    setIsLoading(true);
    setError(null);
    
    try {
      const res = await fetch('/api/calculate-zone-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          latitude: coords[1],
          longitude: coords[0]
        })
      });

      const data = await res.json();
      console.log('Received data:', data);

      if (!res.ok) {
        throw new Error(data.error || 'Failed to calculate');
      }

      setZoneScore(data);
    } catch (err) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : 'Failed to calculate');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleMapClick = useCallback((e: any) => {
    const coords: [number, number] = [e.lngLat.lng, e.lngLat.lat];
    console.log('Clicked:', coords);
    setCoordinates(coords);
    setIsModalOpen(true);
    calculateZoneScore(coords);
  }, [calculateZoneScore]);

  const handleRecalculate = useCallback(() => {
    if (coordinates) {
      calculateZoneScore(coordinates);
    }
  }, [coordinates, calculateZoneScore]);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div className="w-full h-screen">
        <Map
          initialViewState={{
            longitude: 72.8777,
            latitude: 19.0760,
            zoom: 11
          }}
          style={{ width: "100%", height: "100%" }}
          mapStyle="mapbox://styles/mapbox/dark-v11"
          mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
          onClick={handleMapClick}
        />
        
        <ZoneScoreModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          coordinates={coordinates}
          zoneScore={zoneScore}
          isLoading={isLoading}
          error={error}
          onCalculate={handleRecalculate}
        />
      </div>
    </main>
  );
}
