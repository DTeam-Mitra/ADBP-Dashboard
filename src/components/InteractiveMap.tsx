
import React, { useEffect, useRef, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface InteractiveMapProps {
  currentLevel: string;
  selectedRegion: any;
  hoveredRegion: any;
  selectedIndicator: string;
  onRegionClick: (region: any) => void;
  onRegionHover: (region: any, event?: any) => void;
  className?: string;
}

export const InteractiveMap = forwardRef<HTMLDivElement, InteractiveMapProps>(({
  currentLevel,
  selectedRegion,
  hoveredRegion,
  selectedIndicator,
  onRegionClick,
  onRegionHover,
  className
}, ref) => {
  const mapContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Using a free map alternative - OpenStreetMap with Leaflet-style implementation
    // For now, we'll create a mock interactive map with SVG
    const mockStates = [
      { name: 'Maharashtra', x: 300, y: 400, population: '112M', literacy: '82.3%' },
      { name: 'Uttar Pradesh', x: 350, y: 200, population: '199M', literacy: '67.7%' },
      { name: 'Karnataka', x: 250, y: 500, population: '61M', literacy: '75.4%' },
      { name: 'Tamil Nadu', x: 280, y: 600, population: '72M', literacy: '80.1%' },
      { name: 'Gujarat', x: 150, y: 300, population: '60M', literacy: '78.0%' },
      { name: 'West Bengal', x: 450, y: 250, population: '91M', literacy: '76.3%' },
      { name: 'Rajasthan', x: 200, y: 250, population: '68M', literacy: '66.1%' },
      { name: 'Madhya Pradesh', x: 280, y: 300, population: '73M', literacy: '69.3%' },
    ];

    // Clear previous content
    if (mapContainer.current) {
      mapContainer.current.innerHTML = '';
    }

    // Create SVG map
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.setAttribute('viewBox', '0 0 600 700');
    svg.style.background = '#f8fafc';
    svg.style.borderRadius = '12px';

    // Add India outline (simplified)
    const indiaOutline = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    indiaOutline.setAttribute('d', 'M150,150 L450,150 L480,200 L470,300 L450,400 L400,500 L350,600 L300,650 L250,650 L200,600 L150,500 L120,400 L100,300 L110,200 Z');
    indiaOutline.setAttribute('fill', '#e2e8f0');
    indiaOutline.setAttribute('stroke', '#cbd5e1');
    indiaOutline.setAttribute('stroke-width', '2');
    svg.appendChild(indiaOutline);

    // Add state markers
    mockStates.forEach((state) => {
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', state.x.toString());
      circle.setAttribute('cy', state.y.toString());
      circle.setAttribute('r', '8');
      circle.setAttribute('fill', getMarkerColor(selectedIndicator));
      circle.setAttribute('stroke', '#ffffff');
      circle.setAttribute('stroke-width', '2');
      circle.style.cursor = 'pointer';
      circle.style.transition = 'all 0.2s ease';

      // Add hover effects
      circle.addEventListener('mouseenter', (e) => {
        circle.setAttribute('r', '12');
        onRegionHover(state, e);
      });

      circle.addEventListener('mouseleave', () => {
        circle.setAttribute('r', '8');
        onRegionHover(null);
      });

      // Add click handler
      circle.addEventListener('click', () => {
        onRegionClick(state);
      });

      svg.appendChild(circle);

      // Add state labels
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', (state.x + 15).toString());
      text.setAttribute('y', (state.y + 5).toString());
      text.setAttribute('font-size', '12');
      text.setAttribute('fill', '#475569');
      text.setAttribute('font-weight', '500');
      text.textContent = state.name;
      svg.appendChild(text);
    });

    mapContainer.current.appendChild(svg);

    // Cleanup function
    return () => {
      if (mapContainer.current) {
        mapContainer.current.innerHTML = '';
      }
    };
  }, [selectedIndicator, onRegionClick, onRegionHover]);

  const getMarkerColor = (indicator: string) => {
    const colors: Record<string, string> = {
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
        <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 text-sm text-gray-600 shadow-lg">
          <div className="font-medium mb-1">Interactive Map</div>
          <div>Click on markers to drill down</div>
          <div>Hover for quick stats</div>
        </div>
      </div>
    </div>
  );
});

InteractiveMap.displayName = 'InteractiveMap';
