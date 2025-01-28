'use client';

import { useEffect, useRef, useState } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';

const mapContainerStyle = {
  height: '100%',
  width: '100%'
};

// Function to create popup HTML content
const createPopupHTML = (properties) => {
  const { name, region, storageSpace, company } = properties;
  return `
    <div class="store-popup">
      <h3 class="store-title">${name || region}</h3>
      <div class="store-details">
        <p><strong>Location:</strong> ${region}</p>
        ${storageSpace ? `<p><strong>Storage Space:</strong> ${storageSpace}</p>` : ''}
        ${company ? `<p><strong>Company:</strong> ${company}</p>` : ''}
      </div>
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

  useEffect(() => {
    import('mapbox-gl').then((mapboxModule) => {
      setMapboxgl(mapboxModule.default);
    });
  }, []);

  useEffect(() => {
    if (!mapboxgl || !mapContainer.current || map.current) return;

    // Initialize the map centered on Mumbai
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/outdoors-v12',
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
              '#FF4B2B' // default color
            ],
            'circle-stroke-width': 2,
            'circle-stroke-color': '#fff'
          }
        });

        // Add popup on click
        map.current.on('click', 'dark-stores-points', (e) => {
          const coordinates = e.features[0].geometry.coordinates.slice();
          const properties = e.features[0].properties;

          new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(createPopupHTML(properties))
            .addTo(map.current);
        });

        // Change cursor on hover
        map.current.on('mouseenter', 'dark-stores-points', () => {
          map.current.getCanvas().style.cursor = 'pointer';
        });
        map.current.on('mouseleave', 'dark-stores-points', () => {
          map.current.getCanvas().style.cursor = '';
        });

      } catch (error) {
        console.error('Error loading GeoJSON:', error);
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
    <div className="map-container">
      <div ref={mapContainer} style={mapContainerStyle} />
      <style jsx global>{`
        .store-popup {
          padding: 12px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        }
        .store-title {
          margin: 0 0 8px 0;
          font-size: 16px;
          font-weight: 600;
          color: #1a1a1a;
        }
        .store-details {
          font-size: 14px;
          line-height: 1.4;
        }
        .store-details p {
          margin: 4px 0;
          color: #4a4a4a;
        }
        .store-details strong {
          color: #1a1a1a;
        }
        .mapboxgl-popup-content {
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
      `}</style>
    </div>
  );
}
