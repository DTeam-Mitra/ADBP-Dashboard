import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { cn } from '@/lib/utils';

interface InteractiveMapProps {
  currentLevel: 'village';
  selectedRegion: any;
  hoveredRegion: any;
  selectedIndicator: string;
  onRegionClick: (region: any) => void;
  onRegionHover: (region: any, event?: any) => void;
  activeLayer?: string;
  className?: string;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  currentLevel,
  selectedRegion,
  hoveredRegion,
  selectedIndicator,
  onRegionClick,
  onRegionHover,
  activeLayer = 'default',
  className
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const [geojsonData, setGeojsonData] = useState<any>(null);
  const [geojsonLayer, setGeojsonLayer] = useState<L.GeoJSON<any> | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(6);

  useEffect(() => {
    const container = mapContainer.current;
    if (!container) return;

    const map = L.map(container, {
      zoomControl: true,
      attributionControl: false,
      minZoom: 6,
      maxZoom: 12
    }).setView([19.7515, 75.7139], 6);

    mapInstance.current = map;

    fetch('/mh1.geojson')
      .then(res => {
        if (!res.ok) throw new Error(`Network error: ${res.statusText}`);
        return res.json();
      })
      .then(data => {
        setGeojsonData(data);
        updateMapByZoomLevel(map, data);
        map.on('zoomend', () => {
          setZoomLevel(map.getZoom());
          updateMapByZoomLevel(map, data);
        });
      })
      .catch(err => {
        console.error('Error loading mh1.geojson:', err);
        alert('Failed to load map data. Please check the console for details.');
      });

    return () => {
      map.remove();
    };
  }, [currentLevel, selectedIndicator, activeLayer, onRegionClick, onRegionHover]);

  useEffect(() => {
    if (!geojsonLayer || !hoveredRegion || !mapInstance.current) return;
    geojsonLayer.eachLayer(layer => {
      const feature = (layer as any).feature;
      const isHovered = hoveredRegion && feature?.properties?.ID === hoveredRegion.ID;
      const isSelected = selectedRegion && feature?.properties?.ID === selectedRegion.ID;
      (layer as L.Path).setStyle({
        weight: isSelected ? 3 : isHovered ? 2 : 1,
        fillOpacity: isSelected ? 0.7 : isHovered ? 0.6 : 0.5,
        color: isSelected ? '#2563eb' : '#1f2937',
        fillColor: '#34d399'
      });
    });
  }, [hoveredRegion, selectedRegion, geojsonLayer]);

  const updateMapByZoomLevel = (map: L.Map, data: any) => {
    const zoom = map.getZoom();
    if (!data) return;

    if (geojsonLayer) {
      geojsonLayer.remove();
    }

    const filteredFeatures = data.features.filter((feature: any) => {
      if (zoom <= 6) return feature.properties.TYPE === 'district';
      if (zoom > 6 && zoom <= 9) return feature.properties.TYPE === 'subdistrict';
      return ['village', 'city', 'town'].includes(feature.properties.TYPE);
    });

    const filteredGeoJSON = { ...data, features: filteredFeatures };

    const newLayer = L.geoJSON(filteredGeoJSON, {
      style: feature => {
        const isSelected = selectedRegion && selectedRegion.ID === feature.properties.ID;
        return {
          color: isSelected ? '#2563eb' : '#1f2937',
          weight: isSelected ? 3 : 1,
          fillColor: '#34d399',
          fillOpacity: isSelected ? 0.7 : 0.5
        };
      },
      onEachFeature: (feature, layer) => {
        const name = feature.properties.NAME || 'Unknown';
        const district = feature.properties.DISTRICT || 'Unknown';

        layer.bindTooltip(`${name}, ${district}`, {
          direction: 'center',
          sticky: true
        });

        layer.on({
          mouseover: (e: L.LeafletMouseEvent) => {
            (layer as L.Path).setStyle({ weight: 2, fillOpacity: 0.7 });
            onRegionHover(feature.properties, e);
          },
          mouseout: () => {
            (layer as L.Path).setStyle({ weight: 1, fillOpacity: 0.5 });
            onRegionHover(null);
          },
          click: () => {
            onRegionClick(feature.properties);
          }
        });
      }
    }).addTo(map);

    setGeojsonLayer(newLayer);
    try {
      if (newLayer.getBounds().isValid()) {
        map.fitBounds(newLayer.getBounds());
      }
    } catch (e) {
      console.warn('Invalid bounds:', e);
    }
  };

  return (
    <div className={cn("relative w-full h-full", className)}>
      <div ref={mapContainer} className="absolute inset-0 rounded-lg" />

      <div className="absolute bottom-4 right-4 z-30">
        <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 text-sm text-gray-600 shadow-lg">
          <div className="font-medium mb-1">Interactive Map</div>
          <div>Current Level: {currentLevel.charAt(0).toUpperCase() + currentLevel.slice(1)}</div>
          <div>Zoom Level: {zoomLevel}</div>
          <div className="text-xs text-gray-500">Click regions to view details</div>
        </div>
      </div>
    </div>
  );
};