
import React, { useEffect, useRef, forwardRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { cn } from '@/lib/utils';

export const InteractiveMap = forwardRef(({
  currentLevel,
  selectedRegion,
  hoveredRegion,
  selectedIndicator,
  onRegionClick,
  onRegionHover,
  className
}, ref) => {
  const mapContainer = useRef();
  const map = useRef();

  useEffect(() => {
    if (!mapContainer.current) return;

    // Note: Replace with your actual Mapbox token
    mapboxgl.accessToken = 'pk.YOUR_MAPBOX_TOKEN_HERE';

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [78.9629, 20.5937], // Center of India
      zoom: 4.5,
      pitch: 0,
    });

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      }),
      'top-left'
    );

    // Mock India states data (in real implementation, you'd load GeoJSON)
    const mockStates = [
      { name: 'Maharashtra', center: [75.7139, 19.7515], population: '112M', literacy: '82.3%' },
      { name: 'Uttar Pradesh', center: [80.9462, 26.8467], population: '199M', literacy: '67.7%' },
      { name: 'Karnataka', center: [75.7139, 15.3173], population: '61M', literacy: '75.4%' },
      { name: 'Tamil Nadu', center: [78.6569, 11.1271], population: '72M', literacy: '80.1%' },
      { name: 'Gujarat', center: [71.1924, 22.2587], population: '60M', literacy: '78.0%' },
      { name: 'West Bengal', center: [87.8550, 22.9868], population: '91M', literacy: '76.3%' },
    ];

    // Add markers for states
    mockStates.forEach((state) => {
      const marker = new mapboxgl.Marker({
        color: getMarkerColor(selectedIndicator),
        scale: 0.8
      })
        .setLngLat(state.center)
        .addTo(map.current);

      // Add click handler
      marker.getElement().addEventListener('click', () => {
        onRegionClick(state);
      });

      // Add hover handler
      marker.getElement().addEventListener('mouseenter', (e) => {
        onRegionHover(state, e);
      });

      marker.getElement().addEventListener('mouseleave', () => {
        onRegionHover(null);
      });
    });

    // Cleanup
    return () => {
      map.current?.remove();
    };
  }, [selectedIndicator, onRegionClick, onRegionHover]);

  const getMarkerColor = (indicator) => {
    const colors = {
      population: '#3b82f6',
      literacy: '#10b981',
      gdp: '#8b5cf6',
      healthcare: '#ef4444',
      employment: '#f97316',
      infrastructure: '#6366f1'
    };
    return colors[indicator] || '#3b82f6';
  };

  return (
    <div className={cn("relative w-full h-full", className)}>
      <div ref={mapContainer} className="absolute inset-0 rounded-lg" />
      
      {/* Map Instructions */}
      <div className="absolute bottom-4 left-4 z-30">
        <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 text-sm text-gray-600">
          <div className="font-medium mb-1">Interactive Map</div>
          <div>Click on markers to drill down</div>
          <div>Hover for quick stats</div>
        </div>
      </div>

      {/* Temporary notice for Mapbox token */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-md text-center">
        <div className="text-blue-800 font-medium mb-2">Map Configuration Required</div>
        <div className="text-blue-600 text-sm">
          Please add your Mapbox public token to enable the interactive map. 
          Visit <a href="https://mapbox.com/" target="_blank" rel="noopener noreferrer" className="underline">mapbox.com</a> to get your token.
        </div>
      </div>
    </div>
  );
});

InteractiveMap.displayName = 'InteractiveMap';
