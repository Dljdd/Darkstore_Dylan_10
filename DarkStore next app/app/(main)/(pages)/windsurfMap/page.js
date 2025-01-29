'use client';

import { useEffect, useRef, useState } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import ZoneScoreModal from '@/components/ZoneScoreModal';

const mapContainerStyle = {
  position: 'fixed',
  top: '64px', // Height of navbar
  left: '100px', // Width of sidebar
  right: '300px', // Leave space for the list component
  bottom: 0,
  height: 'calc(100vh - 64px)', // Subtract navbar height
  width: 'calc(100vw - 400px)', // Subtract sidebar and list width
  zIndex: 1
};

const listContainerStyle = {
  position: 'fixed',
  top: '64px',
  right: 0,
  width: '300px',
  height: 'calc(100vh - 64px)',
  overflowY: 'auto',
  padding: '1rem',
  zIndex: 1

};

const tooltipStyle = {
  position: 'absolute',
  top: '20px',
  left: '50%',
  transform: 'translateX(-50%)',
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  color: 'white',
  padding: '8px 16px',
  borderRadius: '8px',
  zIndex: 2,
  fontSize: '14px',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
};

// Function to create popup HTML content
const createPopupHTML = (properties, coordinates) => {
  const { name, region, storageSpace, company } = properties;
  const locationName = name || region;
  return `
    <div style="color: black; padding: 10px;" class="store-popup">
      <h3 style="margin: 0 0 10px 0; font-weight: bold;">${locationName}</h3>
      <div class="store-details">
        <p style="margin: 5px 0;"><strong>Location:</strong> ${region}</p>
        ${storageSpace ? `<p style="margin: 5px 0;"><strong>Storage Space:</strong> ${storageSpace}</p>` : ''}
        ${company ? `<p style="margin: 5px 0;"><strong>Company:</strong> ${company}</p>` : ''}
      </div>
      <button 
        class="calculate-zone-score-btn"
        data-lat="${coordinates[1]}"
        data-lng="${coordinates[0]}"
        data-location="${locationName}"
        style="
          background-color: #1a1a1a;
          color: white;
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          margin-top: 10px;
          cursor: pointer;
          width: 100%;
          transition: background-color 0.2s;
        "
        onmouseover="this.style.backgroundColor='#333'"
        onmouseout="this.style.backgroundColor='#1a1a1a'"
      >
        Calculate Zone Score
      </button>
    </div>
  `;
};

// Function to get marker color based on company
const getMarkerColor = (company) => {
  switch (company?.toLowerCase()) {
    case 'blinkit':
      return '#F9D923'; // Yellow
    case 'zepto':
      return '#4B56D2'; // Blue
    case 'swiggy':
      return '#FF4B2B'; // Orange
    default:
      return '#FF4B2B'; // Default orange
  }
};

export default function WindsurfMap() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [mapboxgl, setMapboxgl] = useState(null);
  const [locations, setLocations] = useState([]);
  const [locationScores, setLocationScores] = useState({});
  const [selectedCoordinates, setSelectedCoordinates] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [zoneScore, setZoneScore] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showTip, setShowTip] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Function to calculate zone score for a specific location
  const calculateLocationScore = async (location) => {
    try {
      const response = await fetch('/api/calculate-zone-score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          latitude: location.geometry.coordinates[1],
          longitude: location.geometry.coordinates[0],
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to calculate zone score');
      }

      const data = await response.json();
      return data;
    } catch (err) {
      console.error('Error calculating score for location:', err);
      return null;
    }
  };

  // Load zone scores for all locations
  const loadLocationScores = async (locations) => {
    const scores = {};
    for (const location of locations) {
      const score = await calculateLocationScore(location);
      if (score) {
        scores[location.properties.name || location.properties.region] = score;
      }
    }
    setLocationScores(scores);
  };

  // Function to calculate zone score
  const calculateZoneScore = async () => {
    if (!selectedCoordinates) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/calculate-zone-score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          latitude: selectedCoordinates[1],
          longitude: selectedCoordinates[0],
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to calculate zone score');
      }

      const data = await response.json();
      setZoneScore(data);
      setIsModalOpen(true);
    } catch (err) {
      setError(err.message || 'Failed to calculate zone score');
      setZoneScore(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMapClick = (e) => {
    const coordinates = e.lngLat;
    setSelectedCoordinates([coordinates.lng, coordinates.lat]);
    setZoneScore(null);
    setError(null);
    setIsModalOpen(true);
  };

  useEffect(() => {
    import('mapbox-gl').then((mapboxModule) => {
      setMapboxgl(mapboxModule.default);
    });

    // Add click event listener to handle popup button clicks
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('calculate-zone-score-btn')) {
        const lat = parseFloat(e.target.getAttribute('data-lat'));
        const lng = parseFloat(e.target.getAttribute('data-lng'));
        const locationName = e.target.getAttribute('data-location');
        
        setSelectedCoordinates([lng, lat]);
        setSelectedLocation(locationName);
        setZoneScore(null);
        setError(null);
        setIsModalOpen(true);
        calculateZoneScore();
      }
    });

    return () => {
      // Cleanup the window object
      delete window.calculateZoneScore;
    };
  }, []);

  useEffect(() => {
    if (!mapboxgl || !mapContainer.current || map.current) return;

    // Initialize the map centered on Mumbai
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [72.8777, 19.0760], // Mumbai coordinates
      zoom: 10,
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl());

    // Load GeoJSON data when the map is ready
    map.current.on('load', async () => {
      try {
        const response = await fetch('/dark_stores.geojson');
        const geojsonData = await response.json();

        // Add the GeoJSON source
        map.current.addSource('dark-stores', {
          type: 'geojson',
          data: geojsonData,
        });

        // Add a layer to display the points
        map.current.addLayer({
          id: 'dark-stores-points',
          type: 'circle',
          source: 'dark-stores',
          paint: {
            'circle-radius': 8,
            'circle-color': [
              'match',
              ['get', 'company'],
              'Blinkit', '#F9D923',
              'Zepto', '#4B56D2',
              'Swiggy', '#FF4B2B',
              '#FF4B2B'
            ],
            'circle-opacity': 0.8
          }
        });

        // Add popup on click
        map.current.on('click', 'dark-stores-points', (e) => {
          const coordinates = e.features[0].geometry.coordinates.slice();
          const properties = e.features[0].properties;

          new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(createPopupHTML(properties, coordinates))
            .addTo(map.current);
        });

        // Change cursor on hover
        map.current.on('mouseenter', 'dark-stores-points', () => {
          map.current.getCanvas().style.cursor = 'pointer';
        });
        map.current.on('mouseleave', 'dark-stores-points', () => {
          map.current.getCanvas().style.cursor = '';
        });

        setLocations(geojsonData.features);
        // Load zone scores for all locations
        loadLocationScores(geojsonData.features);

      } catch (error) {
        console.error('Error loading GeoJSON:', error);
      }
    });

    // Add click handler for zone score calculation
    map.current.on('click', (e) => {
      // Don't trigger if clicking on a dark store point
      const features = map.current.queryRenderedFeatures(e.point, {
        layers: ['dark-stores-points']
      });
      
      if (features.length === 0) {
        handleMapClick(e);
      }
    });

    // Clean up on unmount
    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [mapboxgl]);

  return (
    <div className="relative">
      <div ref={mapContainer} style={mapContainerStyle}>
        {showTip && (
          <div style={tooltipStyle}>
            <span>Tip: Click on any of the grey regions to check out their zone score</span>
            <button
              onClick={() => setShowTip(false)}
              style={{
                marginLeft: '12px',
                background: 'none',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                padding: '0 4px',
                fontSize: '16px'
              }}
            >
              ×
            </button>
          </div>
        )}
      </div>
      <div 
        style={listContainerStyle} 
        className="bg-background border-l border-border"
      >
        <h2 className="text-xl font-semibold mb-4 text-foreground">Existing Locations</h2>
        <div className="space-y-4">
          {locations.map((location, index) => {
            const locationName = location.properties.name || location.properties.region;
            
            return (
              <button 
                key={index}
                className="relative w-full p-4 rounded-lg bg-card hover:bg-accent/80 transition-colors cursor-pointer text-left group"
                onClick={() => {
                  map.current.flyTo({
                    center: location.geometry.coordinates,
                    zoom: 14,
                    duration: 1500
                  });
                }}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-foreground">{locationName}</h3>
                    <p className="text-sm text-muted-foreground">{location.properties.region}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <ZoneScoreModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        coordinates={selectedCoordinates}
        zoneScore={zoneScore}
        isLoading={isLoading}
        error={error}
        onCalculate={calculateZoneScore}
      />
    </div>
  );
}
