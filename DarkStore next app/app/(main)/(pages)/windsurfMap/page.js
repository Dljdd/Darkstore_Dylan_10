'use client';

import { useEffect, useRef, useState } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';

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
  const [locations, setLocations] = useState([]);

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

        setLocations(geojsonData.features);

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
    <div className="relative">
      <div ref={mapContainer} style={mapContainerStyle} />
      <div 
        style={listContainerStyle} 
        className="bg-background border-l border-border"
      >
        <h2 className="text-xl font-semibold mb-4 text-foreground">Locations</h2>
        <div className="space-y-4">
          {locations.map((location, index) => (
            <div 
              key={index}
              className="p-4 border border-border rounded-lg 
                       hover:bg-accent cursor-pointer
                       bg-card text-card-foreground
                       transition-colors duration-200"
              onClick={() => {
                map.current.flyTo({
                  center: location.geometry.coordinates,
                  zoom: 14
                });
              }}
            >
              <h3 className="font-medium text-foreground">
                {location.properties.name || location.properties.region}
              </h3>
              <p className="text-sm text-muted-foreground">
                {location.properties.region}
              </p>
              {location.properties.storageSpace && (
                <p className="text-sm text-muted-foreground">
                  Storage: {location.properties.storageSpace}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
