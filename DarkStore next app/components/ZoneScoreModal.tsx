import React, { useEffect } from 'react';

interface ZoneScoreResponse {
  zoneScore: number;
  region: string;
  setupCost: number;
  annualRevenue: number;
  operationalCost: number;
  netProfit: number;
  paybackPeriod: number;
}

interface ZoneScoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  coordinates: [number, number] | null;
  zoneScore: ZoneScoreResponse | null;
  isLoading: boolean;
  error: string | null;
  onCalculate: () => void;
}

const DataRow = ({ label, value }: { label: string; value: string | number }) => (
  <div className="flex justify-between items-center py-4 border-b border-zinc-800">
    <span className="text-white text-xl">{label}</span>
    <span className="text-white text-xl font-medium">{value}</span>
  </div>
);

export default function ZoneScoreModal({
  isOpen,
  onClose,
  coordinates,
  zoneScore,
  isLoading,
  error,
  onCalculate,
}: ZoneScoreModalProps) {
  useEffect(() => {
    console.log('[Modal] Props updated:', {
      isOpen,
      coordinates,
      zoneScore,
      isLoading,
      error
    });
  }, [isOpen, coordinates, zoneScore, isLoading, error]);

  if (!isOpen) {
    console.log('[Modal] Not rendering - modal is closed');
    return null;
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  const formatYears = (value: number) => {
    return `${value.toFixed(1)} years`;
  };

  console.log('[Modal] Rendering with zoneScore:', zoneScore);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-zinc-900 rounded-lg p-8 max-w-2xl w-full mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-zinc-400 hover:text-white text-xl"
        >
          ×
        </button>
        
        <h2 className="text-3xl font-semibold mb-6 text-white">Zone Score Analysis</h2>
        
        {coordinates && (
          <div className="mb-6">
            <p className="text-zinc-400 text-lg">Selected Location:</p>
            <p className="text-white text-xl font-medium">
              {coordinates[1].toFixed(4)}°N, {coordinates[0].toFixed(4)}°E
            </p>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500 rounded-md">
            <p className="text-red-500">{error}</p>
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-8 space-y-4">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white mx-auto"></div>
            <p className="text-zinc-400">Analyzing location and calculating zone score...</p>
          </div>
        ) : zoneScore ? (
          <div className="space-y-6">
            <div className="space-y-2">
              <DataRow 
                label="Zone Score" 
                value={formatPercentage(zoneScore.zoneScore)} 
              />
              <DataRow 
                label="Region" 
                value={zoneScore.region} 
              />
              <DataRow 
                label="Setup Cost" 
                value={formatCurrency(zoneScore.setupCost)} 
              />
              <DataRow 
                label="Annual Revenue" 
                value={formatCurrency(zoneScore.annualRevenue)} 
              />
              <DataRow 
                label="Operational Cost" 
                value={formatCurrency(zoneScore.operationalCost)} 
              />
              <DataRow 
                label="Net Profit" 
                value={formatCurrency(zoneScore.netProfit)} 
              />
              <DataRow 
                label="Payback Period" 
                value={formatYears(zoneScore.paybackPeriod)} 
              />
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-zinc-400 mb-4">Click calculate to analyze this location</p>
            <button
              onClick={onCalculate}
              className="w-full py-3 px-4 bg-white text-zinc-900 rounded-md
                       hover:bg-zinc-200 transition-colors text-lg font-medium"
            >
              Calculate Zone Score
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
