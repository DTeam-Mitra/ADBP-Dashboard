
import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Navbar } from '@/components/Navbar';
import { InteractiveMap } from '@/components/InteractiveMap';
import { IndicatorPanel } from '@/components/IndicatorPanel';
import { SummaryPanel } from '@/components/SummaryPanel';
import { MapTooltip } from '@/components/MapTooltip';

const Index = () => {
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [hoveredRegion, setHoveredRegion] = useState(null);
  const [selectedIndicator, setSelectedIndicator] = useState('population');
  const [currentLevel, setCurrentLevel] = useState('country'); // country -> state -> district -> block
  const [summaryScrolled, setSummaryScrolled] = useState(false);
  const [tooltipData, setTooltipData] = useState(null);
  const mapRef = useRef(null);

  // Sample data for different regions and indicators
  const indicators = [
    { id: 'population', name: 'Population', value: '1.38B', color: 'bg-blue-500', trend: '+1.2%' },
    { id: 'literacy', name: 'Literacy Rate', value: '77.7%', color: 'bg-green-500', trend: '+2.1%' },
    { id: 'gdp', name: 'GDP Growth', value: '6.8%', color: 'bg-purple-500', trend: '+0.5%' },
    { id: 'healthcare', name: 'Healthcare Index', value: '41.2', color: 'bg-red-500', trend: '+3.2%' },
    { id: 'employment', name: 'Employment Rate', value: '46.8%', color: 'bg-orange-500', trend: '-0.8%' },
    { id: 'infrastructure', name: 'Infrastructure Score', value: '44.1', color: 'bg-indigo-500', trend: '+4.1%' }
  ];

  const handleRegionClick = (region) => {
    setSelectedRegion(region);
    // Logic to drill down to next level
    if (currentLevel === 'country') {
      setCurrentLevel('state');
    } else if (currentLevel === 'state') {
      setCurrentLevel('district');
    } else if (currentLevel === 'district') {
      setCurrentLevel('block');
    }
  };

  const handleRegionHover = (region, event) => {
    setHoveredRegion(region);
    if (region && event) {
      setTooltipData({
        x: event.clientX,
        y: event.clientY,
        region: region
      });
    } else {
      setTooltipData(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      <Navbar />
      
      {/* Main Content */}
      <div className="flex h-screen pt-16">
        {/* Summary Panel - Left Side (20%) */}
        <SummaryPanel 
          selectedIndicator={selectedIndicator}
          selectedRegion={selectedRegion}
          currentLevel={currentLevel}
          onScroll={setSummaryScrolled}
          className="w-1/5 z-40"
        />

        {/* Map and Indicators - Right Side (80%) */}
        <div className="flex-1 flex flex-col relative">
          {/* Map Area (65-75% of right side) */}
          <div className={`flex-1 relative transition-all duration-300 ${summaryScrolled ? 'blur-sm' : ''}`}>
            <InteractiveMap
              ref={mapRef}
              currentLevel={currentLevel}
              selectedRegion={selectedRegion}
              hoveredRegion={hoveredRegion}
              selectedIndicator={selectedIndicator}
              onRegionClick={handleRegionClick}
              onRegionHover={handleRegionHover}
              className="w-full h-full"
            />
            
            {/* Map Overlay Info */}
            <div className="absolute top-4 right-4 z-30">
              <Card className="p-3 bg-white/90 backdrop-blur-sm">
                <div className="text-sm font-medium text-gray-700">
                  Current View: {currentLevel.charAt(0).toUpperCase() + currentLevel.slice(1)}
                </div>
                {selectedRegion && (
                  <div className="text-xs text-gray-500 mt-1">
                    {selectedRegion.name}
                  </div>
                )}
              </Card>
            </div>
          </div>

          {/* Indicator Panel - Bottom (25-35%) */}
          <div className={`transition-all duration-300 ${summaryScrolled ? 'blur-sm' : ''}`}>
            <IndicatorPanel
              indicators={indicators}
              selectedIndicator={selectedIndicator}
              onIndicatorSelect={setSelectedIndicator}
              selectedRegion={selectedRegion}
              className="h-80"
            />
          </div>
        </div>
      </div>

      {/* Map Tooltip */}
      {tooltipData && (
        <MapTooltip
          data={tooltipData}
          selectedIndicator={selectedIndicator}
        />
      )}
    </div>
  );
};

export default Index;
